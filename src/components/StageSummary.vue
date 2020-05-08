<template>
  <div class="stage-summary">
    <h3>{{ stageName }}</h3>
    <div class="stage-dates">
      <div v-for="(artists, date) in stage.dates" :key="date" class="date-column">
        <span  v-if="shouldShowStageSubHeading(stage, date)" class="date">
          {{ stageSubHeading(date) }}
        </span>
        <ul>
          <li v-for="artist in artists" :key="artist.name" class="artist">
              {{ artist.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'StageSummary',
  props: {
    stage: {
      default: () => {},
      type: Object
    }
  },
  computed: {
    stageName() {
      return this.stage.name || 'Also Appearing'
    }
  },
  methods: {
    stageHasDate(dateString) {
      return dateString !== 'unknown-date'
    },
    stageSubHeading(dateString) {
      return this.stageHasDate(dateString) ? dateString : 'Also Appearing'
    },
    shouldShowStageSubHeading(stage, dateString) {
      // Prevent showing a useless heading like "Also Appearing" if the
      // stage only has a single unknown date
      if(Object.keys(stage.dates).length === 1 && !this.stageHasDate(dateString)) {
        return false
      }

      return true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/size.scss';
@import '@/assets/scss/color.scss';

$stage-name-slant-height : 1rem;

.stage-summary {
  max-width : 80vw;
  margin    : 0 auto;
}

h3 {
  margin-top    : 75px;
  padding-top   : 10px;
  margin-bottom : 0;
  position      : relative;
  background    : $color-seaweed;
  color         : $color-sov-apple-green;
  padding-bottom : 10px;

  &:before {
    content          : '';
    position         : absolute;
    display          : block;
    height           : $stage-name-slant-height;
    left             : 0;
    top              : -$stage-name-slant-height;
    width            : 100%;
    background-image : linear-gradient(to bottom right, transparent calc(50% - 1px), $color-seaweed 50%);
  }
}

.stage-dates {
  border          : 1px solid #111;
  display         : flex;
  align-items     : center;
  flex            : 1;
  flex-direction  : column;
  justify-content : space-around;

  ul {
    list-style-type: none;
    padding : 0;
  }
}

@include for-tablet-landscape-up {
  .stage-dates {
    flex-direction : row;
    align-items    : flex-start;
    flex-wrap      : wrap;
  }

  .date-column {
    flex-basis: 33%;
  }
}

.date {
  display       : block;
  text-align    : center;
  margin-bottom : 1rem;
  font-weight   : bold;
  font-size     : 1.4rem;
  margin-top    : 1rem;
}

.artist {
  margin-bottom : 5px;
  text-align    : center;

  > a {
    display    : block;
    padding    : 6px 6px 2px 6px;

    &:not(:link) {
      opacity : 0.7;
    }
  }
}
</style>
