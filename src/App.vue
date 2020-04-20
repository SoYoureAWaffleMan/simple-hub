<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">

body {
  margin      : 0;
  font-family : Helvetica, Arial, sans-serif;
  font-size   : 18px;
  color       : #333;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

p, ul, hr, h1, h2 {
  margin : 0;
}

p, ul, hr, h1, h2, time, .with-bottom-margin {
  margin-bottom : 2rem;
}

time {
  display: block;
}

.with-top-padding {
  padding-top : 2rem;
}

h1, h2, h3, p, .with-side-padding {
  padding-left : 1rem;
  padding-right : 1rem;
}

p, .with-max-width {
  max-width: 800px;
}

p {
  line-height: 1.5rem;
  text-align: left;
}

.dull {
  opacity: .8;
}

.text-center {
  text-align: center;
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
  50%  { opacity : 0 }
  100% { opacity : 1 }
}

.anim-pause-fade-in {
  animation-duration : 2s;
  animation-name     : pause-fade-in;
}

.flex-stack-center {
  display        : flex;
  flex-direction : column;
  align-items    : center;
  text-align     : center;

  .stretched {
    align-self: stretch;
  }

  .centered {
    align-self: center;
  }
}
</style>
