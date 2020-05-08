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
      <time class="text-center"  :class="{ opaque : event.imageAllowOverlay === false}" :datetime="event.startDateString">
        {{event.startDateString | fullDate }} {{event.startTimeString}}
      </time>
      <a class="button stream with-bottom-margin" :href="ticketHref"></a>
      <p v-for="(line, index) in descriptionLines" :key="index" v-html="line" class="text-center text-break-long-anchors"></p>
    </div>
    <section v-if="artists.length > 0" style="margin:auto" class="featuring with-top-padding">
      <h2 class="with-max-width auto-center">Featuring</h2>
      <ArtistSummary v-for="artist in artists" :key="artist.id" :artist="artist" class="with-max-width auto-center" />
    </section>
  </div>
</template>

<script>
import ArtistSummary from '@/components/ArtistSummary.vue'
import axios from 'axios'
import { get } from 'lodash-es'
import { getImgixUrlForElement } from '@/lib/util.js'

export default {
  name : 'Event',
  components : {
    ArtistSummary
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
      state   : null,   // 'loading', 'loaded' or 'error'
      imgSrc  : null,

    }
  },

  computed : {
    title(){
      const date = this.$options.filters.shortDate(this.event.startIso)
      return `${this.event.name} - supporting ${this.supportingVenueName} on ${date} #saveourvenues`
    },
    supportingVenueName() {
      return this.event.venueSummary.nameContainsTown
        ? this.event.venueSummary.name
        : `${this.event.venueSummary.name}, ${this.event.venueSummary.town}`
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
    /**
     * Break the desc (inc. line breaks) into an array of HTML strings
     */
    descriptionLines(){
      let desc = get(this.event,'description', '')
      let descLines = desc.split("\n")
      return descLines.filter(line => !!line)
    }
  },

  mounted() {
    this.state = 'loading'

    const params = {
      id : this.$route.params.id
    }

     axios.get('https://www.ents24.com/internal-api/entity/event', {params})
      .then(response => {
        this.event = get(response, 'data.data')
        this.refreshImgSrc()
        this.state = 'loaded'
      })
      .catch(() => this.state = 'error')

    window.addEventListener('resize', this.refreshImgSrc);
    window.setTimeout(this.scrollToEl, 100);

    axios.get('https://www.ents24.com/internal-api/artists/event', {params})
      .then(response => {
        let artists = get(response, 'data.data', [])
        this.artists = artists.filter(artist => artist.isStub === false)
      })
  },

  destroyed(){
    window.removeEventListener('resize', this.refreshImgSrc);
  },

  methods : {
    get,
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
    font-size : 2.5rem
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

.button.stream {
  height     : 100px;
  width      : 200px;
  background : url('../assets/img/ents24-stream-diamond.svg') center center no-repeat;

  &:hover{
    filter: contrast(1.1);
  }
}

.featuring {
  background : linear-gradient($color-jade-whisper 80%, transparent);
  color      : $color-seaweed;

  .artist-summary {
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
