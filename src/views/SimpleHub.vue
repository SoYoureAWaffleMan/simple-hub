<template>
  <div class="view-hub with-top-padding">
    <div class="pre-hub text-center with-bottom-margin">
      <h1>Save Our Venues events</h1>
      <h2>powered by</h2>
      <a href="https://ents24.com?referer=sov&utm_medium=web&utm_source=sov&utm_campaign=sov-hub" target="_BLANK">
        <img alt="Ents24 logo" src="../assets/img/ents24-logo-black.svg" width="180">
      </a>
    </div>
    <ul>
      <Card
        v-for="event in events"
        :key="event.id"
        :item="event"
        class="card">
      </Card>
    </ul>
    <infinite-loading @infinite="loadNextPage" spinner="waveDots">
      <div slot="no-more">
        <div class="text-center with-bottom-margin">No more events</div>
        <hr/>
        <div class="dull text-italic anim-pause-fade-in">While you're here, have you
          <a href="https://www.change.org/p/boris-johnson-cancel-the-festival-of-britain-save-britain-s-grassroots-culture">signed the petition</a>?
        </div>
      </div>
      <div slot="no-results">No events found. Curious.</div>
    </infinite-loading>
  </div>
</template>

<script>
import Card from '@/components/Card.vue'
import axios from 'axios'
import InfiniteLoading from 'vue-infinite-loading'
import { get } from 'lodash-es'

export default {
  name : 'SimpleHub',
  components : {
    Card,
    InfiniteLoading,
  },
  data : function() {
    return {
      events         : [],
      pageSize       : window.screen.width < 600 ? 30 : 80,
      nextPageNumber : 1,
      noMorePages    : false
    }
  },

  methods : {
    async loadNextPage(infiniteLoadingInstance) {
      const params = {
        pageNumber : this.nextPageNumber,
        pageSize   : this.pageSize,
        filters : { sov : true }
      }

      axios.get('https://www.ents24.com/internal-api/hub-by-date', {params})
      .then(response => {
        // Use `get` to retrieve nested properties without an error if one is absent. Default to `[]`
        const pageOfEvents = get(response, 'data.data', [])

        if(pageOfEvents.length > 0) {
          this.events.push(...pageOfEvents)
          this.nextPageNumber++
          infiniteLoadingInstance.loaded()
        } else {
          infiniteLoadingInstance.complete()
        }
      })
      .catch( () => infiniteLoadingInstance.error() )
    }
  }
}
</script>

<style lang="scss" scoped>
.pre-hub {

  a {
    transition : all .3s;
    display    : inline-block;
    opacity    : .8;

    &:hover {
      transform : scale(1.1);
      opacity   : 1;
    }
  }
}

h2 {
  margin : 40px 0 0;
}

ul {
  display     : flex;
  align-items : stretch;
  box-sizing  : border-box;
  flex-wrap   : wrap;
  padding     : 1px;
  width       : 100%;
}
</style>
