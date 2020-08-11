<template>
  <div>
    <div v-if="state === 'error'" class="error-msg flex-stack-center with-top-padding">
      <h2>Something bad happened, awkward</h2>
      <img src="@/assets/img/embarrassed-black.svg" class="with-bottom-margin">
      <h2>Try reloading</h2>
    </div>
    <div v-else class="view-event flex-stack-center">
      <img :src="imgSrc" :alt="event.name" ref="img" class="anim-fade-in">
      <h1
        class="text-center text-break"
        :class="{ opaque : event.imageAllowOverlay === false, 'long' : event.name && event.name.length > 20}">
        {{event.name}}
      </h1>

      <div v-if="event.isRanged" class="with-side-padding with-bottom-margin">
        <time :datetime="event.startDateString | fullDate">
          {{event.startDateString | fullDate }}
        </time>
        -
        <time :datetime="event.endDateString | fullDate">
          {{event.endDateString | fullDate }}
        </time>
         {{formattedTime}}
      </div>

      <div v-else class="with-side-padding with-bottom-margin"  :class="{ opaque : event.imageAllowOverlay === false}">
        <time  :datetime="event.startDateString">
          {{event.startDateString | fullDate }}
        </time>
        {{formattedTime}}
      </div>
      <a class="button with-bottom-margin" :class="{'buy' : !event.isOnline, 'stream' : event.isOnline}" :href="ticketHref">
        {{ticketCta}}
      </a>
      <p v-for="(line, index) in descriptionLines" :key="index" v-html="line" class="text-center text-break-long-anchors"></p>
    </div>
    <section v-if="artists.length > 0" style="margin:auto" class="featuring with-top-padding">
      <h2 class="with-max-width auto-center">Featuring</h2>
      <ArtistSummary v-for="artist in artists" :key="artist.id" :artist="artist" class="with-max-width auto-center" />
    </section>
    <section v-if="stages.length > 0" style="margin:auto" class="featuring stages with-top-padding">
      <stage-summary v-for="stage in stages" :key="stage.id" :stage="stage" class="with-max-width auto-center"/>
    </section>
  </div>
</template>

<script>
import ArtistSummary from '@/components/ArtistSummary.vue'
import StageSummary from '@/components/StageSummary.vue'
import axios from 'axios'
import { get } from 'lodash-es'
import { getImgixUrlForElement } from '@/lib/util.js'

export default {
  name : 'Event',
  components : {
    ArtistSummary,
    StageSummary,
  },

  metaInfo() {
    return {
      title : this.title,
      meta  : [
        { property : 'og:title', content: this.title},
        { property : 'og:description', content: `Streamed event on behalf of ${this.supportingVenueName}`},
        { property : 'og:image', content: this.event.imgixUrl},
        { property : 'og:url', content: window.location.href },
        { name     : 'twitter:card', content: 'summary_large_image' },
      ]
    }
  },

  data : function() {
    return {
      event   : {
        id           : null,
        name         : '',
        venueSummary : {}
      },
      artists : [],
      stages  : [],
      state   : null,   // 'loading', 'loaded' or 'error'
      imgSrc  : null,

    }
  },

  computed : {
    title(){
      const date  = this.$options.filters.shortDate(this.event.startIso)
      const vname = this.supportingVenueName
      let title   = this.event.name + ' - '

      if(vname){
        title += `supporting ${vname}`
      }

      return title + ` on ${date} #saveourvenues`
    },
    formattedTime() {
      const start = this.event.startTimeString
      const end   = this.event.endTimeString

      if (!start) {
        return ''
      }

      if (!end || end === start) {
        return start
      }

      return `, ${start} - ${end}`
    },
    supportingVenueName() {
      const vname = this.event.venueSummary.name
      const vtown = this.event.venueSummary.town

      // *siiigh*
      if(!vname || vname.toLowerCase().includes('online')){
        return null
      }

      return this.event.venueSummary.nameContainsTown ? vname : `${vname}, ${vtown}`
    },
    ticketHref() {
      // Note - `url` property is a URI not a URL *shakes fist*
      // Also note - tickets provided by SaveourVenue should contain a raw url, not an Ents24 buy link. Should.
      let href = get(this.event,'ticketSummary.url')

      if(!href) {
        return ''
      }

      // Double check for ents24 "/ticket/buy" URIs  & handle gracefully
      if(href.slice(0,7) === '/ticket') {
        return 'https://ents24.com'+href
      }

      return href
    },

    ticketCta() {
      if (this.event.isOnline) {
        return '' // Text in 'stream' SVG
      }

      return this.event.isFree ? 'More Info' : 'Buy Tickets'
    },
    /**
     * Break the desc (inc. line breaks) into an array of HTML strings
     */
    descriptionLines(){
      let desc = get(this.event,'description', '')
      let descLines = desc.split("\n")
      return descLines.filter(line => !!line)
    }
  },

  async mounted() {
    this.state = 'loading'

    const params = {
      id : this.$route.params.id
    }

     const eventResponse = await axios.get('https://www.ents24.com/internal-api/entity/event', {params})
      .catch(() => this.state = 'error')

    this.event = get(eventResponse, 'data.data')
    this.refreshImgSrc()
    this.state = 'loaded'

    if(this.event.hasStages) {
      this.loadStages()
    } else {
      this.loadArtists()
    }

    window.addEventListener('resize', this.refreshImgSrc);
    window.setTimeout(this.scrollToEl, 100);
  },

  destroyed(){
    window.removeEventListener('resize', this.refreshImgSrc);
  },

  methods : {
    get,
    async loadStages(){
      const stagesResponse = await axios.get('https://www.ents24.com/internal-api/event-stages', {params : { id : this.$route.params.id }})
      let stages = get(stagesResponse, 'data.data', [])
      this.stages = stages
    },
    async loadArtists(){
      const artistsResponse = await axios.get('https://www.ents24.com/internal-api/artists/event', {params : { id : this.$route.params.id }})
      let artists = get(artistsResponse, 'data.data', [])
      this.artists = artists.filter(artist => artist.isStub === false)
    },
    refreshImgSrc() {
      if(!this.$refs['img']) {
        return
      }

      this.imgSrc = getImgixUrlForElement(this.event.imgixUrl, this.$refs['img'])
    },
    /**
     * Scroll this component to the top of the page. One better than just scroll-to-top
     * which doesn't occur in Vue router hash mode
     */
    scrollToEl(){
      this.$el.offsetTop && window.scrollTo(0,this.$el.offsetTop)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/size.scss';
@import '@/assets/scss/color.scss';

$max-img-wrapper-width : 1000px;
$max-img-height-tablet : 350px;
$max-img-height-tablet : 450px;

.view-event {
  display        : flex;
  flex-direction : column;
  max-width: 100vw;
  overflow: hidden;

  img {
    z-index: 1;
  }

  :not(.img){
    z-index: 10;
  }
}

img{
  // Encountered an issue on movema demo where height was being set to auto by an id selector!?
  // `#content .entry-content img { height:auto }`
  // Likely dumb shit I wrote, but just in case it's endemic I've importanted dimensions here.
  // It's a word.
  width      : 100% !important;
  height     : $max-img-height-tablet !important;
  max-width  : $max-img-wrapper-width;
  mask-image : linear-gradient(to bottom, black 15%, transparent 90%);

  @include for-tablet-portrait-up {
    height : $max-img-height-tablet;
  }
}

h1 {
  color          : black;
  background     : none; // Prevent SOV site leaking h1 BG
  text-transform : uppercase;
  font-family    : sans-serif;
  margin-top     : -8rem;
  line-height    : 1.3;
  max-width      : $max-img-wrapper-width;

  &.long {
    font-size : 2rem;

    @include for-tablet-portrait-up {
      font-size : 2.5rem
    }
  }
}

time {
  text-transform : uppercase;
  font-weight    : bold;
}

.opaque {
  background     : white;
  // Masking is fun...
  mix-blend-mode : hard-light;
}

.button {
  text-decoration : none;

  &.buy {
    padding: 1rem 2rem;
    border-radius: 100px;
    background: $color-sov-link-green;
    color : white;


    font-size   : 25px;
    font-weight : bold;
    @include for-tablet-portrait-up {
      font-size : 30px;
    }


    &:hover{
      opacity: .9;
    }

    &:active {
     opacity: 1;
    }
  }

  &.stream {
    height     : 100px;
    width      : 200px;
    background : url('../assets/img/ents24-stream-diamond.svg') center center no-repeat;

    &:hover{
      filter: contrast(1.2);
    }
  }
}

.featuring {
  background : linear-gradient($color-jade-whisper 80%, transparent);
  color      : $color-seaweed;

  .artist-summary, .stage-summary {
    margin-bottom : 4rem;
  }
}

.error-msg {
  margin : auto;

  img {
    max-width : 200px;
    opacity   : .8;
  }
}
</style>
