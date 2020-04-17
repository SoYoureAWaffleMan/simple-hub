<template>
  <div id="app">
    <div class="pre-hub with-bottom-margin">
      <h1>Save Our Venues events, powered by</h1>
      <a href="https://ents24.com?referer=sov&utm_medium=web&utm_source=sov&utm_campaign=sov-hub" target="_BLANK">
        <img alt="Vue logo" src="./assets/img/ents24-logo-black.svg" width="180">
      </a>
    </div>
    <SimpleHub />
  </div>
</template>

<script>
import SimpleHub from './components/SimpleHub.vue'

export default {
  name: 'App',
  components: {
    SimpleHub
  }
}
</script>

<style lang="scss">

body {
  padding     : 1rem 0 0 0;
  margin      : 0;
  font-family : Helvetica, Arial, sans-serif;
  color       : #333;
}

p, ul, hr {
  margin : 0;
}

p, ul, hr, .with-bottom-margin {
  margin-bottom : 2rem;
}

.pre-hub {
  text-align    : center;

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

.dull {
  opacity: .8;
}

.text-italic {
  font-style: italic;
}

@keyframes fade-in {
  0%   { opacity : 0 }
  100% { opacity : 1 }
}

.anim-fade-in {
  animation-duration : 1s;
  animation-name     : fade-in;
}

@keyframes pause-fade-in {
  0%   { opacity : 0 }
  50%   { opacity : 0 }
  100% { opacity : 1 }
}

.anim-pause-fade-in {
  animation-duration : 2s;
  animation-name     : pause-fade-in;
}
</style>
