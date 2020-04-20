<template>
  <div>
    <div v-if="state === 'error'" class="error-msg flex-stack-center with-top-padding">
      <h2>Something bad happened, awkward</h2>
      <img src="@/assets/img/embarrassed-black.svg" class="with-bottom-margin">
      <h2>Try reloading</h2>
    </div>
    <div v-else class="view-event flex-stack-center">
      <div class="img-wrapper" ref="img-wrapper">
        <img v-if="this.state === 'loaded'" :src="imgSrc" :alt="event.name" ref="img" class="anim-fade-in">
        <h1 class="text-center" :class="{ opaque : event.imageAllowOverlay === false}">{{event.name}}</h1>
        <time class="text-center"  :class="{ opaque : event.imageAllowOverlay === false}" :datetime="event.startDateString">
          {{event.startDateString | shortDate }} {{event.startTimeString}}
        </time>
      </div>
      <a class="button stream with-bottom-margin" :href="ticketHref"></a>
      <p v-for="(line, index) in descriptionLines" :key="index" v-html="line"></p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { get } from 'lodash-es'
import { getImgixUrlForElement } from '@/lib/util.js'

export default {
  name : 'Event',

  data : function() {
    return {
      event  : {},
      state  : null,   // 'loading', 'loaded' or 'error'
      imgSrc : null,
    }
  },

  computed : {
    ticketHref() {
      // Note - this is a URI not a URL *shakes fist*
      return 'https://ents24.com'+get(this.event,'ticketSummary.url')
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
  },

  destroyed(){
    window.removeEventListener('resize', this.refreshImgSrc);
  },

  methods : {
    get,
    refreshImgSrc() {
      this.imgSrc = getImgixUrlForElement(this.event.imgixUrl, this.$refs['img-wrapper'])
    }
  }
}
</script>

<style lang="scss" scoped>
.view-event {
  display        : flex;
  flex-direction : column;
}

.img-wrapper {
  height          : 400px;
  align-self      : stretch;
  display         : flex;
  flex-direction  : column;
  justify-content : flex-end;
  align-items     : center;

  img {
    align-self : stretch;
    position   : absolute;
    display    : block;
    width      : 100%;
    z-index    : -1;
    mask-image : linear-gradient(to bottom, black 15%, transparent 90%);
  }

  time {
    text-transform : uppercase;
    font-weight    : bold;
  }

  .opaque {
    background : rgba(255,255,255,.8);
  }

}

.button.stream {
  height     : 100px;
  width      : 200px;
  background: url('../assets/img/ents24-stream-diamond.svg') center center no-repeat;

  &:hover{
    filter: contrast(1.1);
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
