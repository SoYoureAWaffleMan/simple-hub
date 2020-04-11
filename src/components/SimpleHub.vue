<template>
  <div class="hub">
    <ul>
      <Card
        v-for="event in events"
        :key="event.id"
        :item="event"
        class="card">
      </Card>
    </ul>
    <infinite-loading @infinite="loadNextPage" spinner="waveDots"></infinite-loading>
  </div>
</template>

<script>
import Card from './Card.vue'
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
      nextPageNumber : 1,
      noMorePages    : false
    }
  },

  methods : {
    async loadNextPage(infiniteLoadingInstance) {
      const params = {
        pageNumber : this.nextPageNumber,
        pageSize   : 100,
        filter : { sov : true }
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
h3 {
  margin: 40px 0 0;
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
