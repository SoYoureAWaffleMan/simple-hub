<template>
  <div id="app">
    <div class="pre-hub">
      <h1>Save Our Venues events, powered by</h1>
      <a href="https://ents24.com">
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
}

.pre-hub {
  text-align: center;
  color : #333;
  margin-bottom : 1rem;

  a {
    transition : all .3s;
    display: inline-block;
    opacity: .8;

    &:hover {
      transform: scale(1.1);
      opacity: 1;
    }
  }
}
</style>
