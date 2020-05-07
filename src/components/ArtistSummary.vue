<template>
  <div class="artist-summary with-bottom-margin" :class="{ 'with-image' : artist.imageSource !== 'default'}">
    <h3>{{ artist.name }}</h3>
    <a v-if="artist.imageSource !== 'default'" :to="artist.uri" class="img-anchor">
      <img :src="imgSrc" :alt="imgAlt" ref="img">
    </a>
    <p v-if="this.artist.description" v-html="this.artist.description"></p>
  </div>
</template>

<script>
import { getImgixUrlForElement } from '@/lib/util.js'

export default {
  name: 'ArtistSummary',
  props: {
    artist: {
      default: () => {},
      type: Object
    }
  },
  data : function() {
    return {
      imgSrc : null,
      imgAlt : '',
    }
  },
  mounted() {
    this.refreshImgSrc()
    this.imgAlt = this.artist.name
    window.addEventListener('resize', this.refreshImgSrc);
  },
  destroyed(){
    window.removeEventListener('resize', this.refreshImgSrc);
  },
  methods : {
    refreshImgSrc() {
      if(!this.$refs['img']) {
        return
      }

      this.imgSrc = getImgixUrlForElement(this.artist.imgixUrl, this.$refs['img'])
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/size.scss';

.artist-summary {
  // Clearer element - img is floated on larger devices
  &:after {
    clear   : both;
    content : '';
    display : block;
  }

  .img-anchor {
    display    : block;
    filter     : grayscale(100%);
    height     : 300px;
    mask-image : linear-gradient(to bottom, black, transparent);
    width      : 100%;

    img {
      display : block;
      height  : 100%;
      width   : 100%;
    }
  }

  @include for-tablet-portrait-up {
    .img-anchor {
      float      : left;
      margin     : 0 1rem 1rem 1rem;
      mask-image : none;
      width      : 300px;
    }

    img {
      border-image : linear-gradient(to right, black, transparent) 1;
      border-style : solid;
      border-width : 1px;
    }

    p {
      display    : block; // Undo inline-block applied to fix URL wrapping _raises eyebrow_
      margin-top : 0!important; // No overlap, pls
    }
  }

  &.with-image p:first-of-type {
    // Pull paragraph up onto masked img, unless you're using a Microsoft product for some reason
    margin-top : -4rem;
  }
}

</style>
