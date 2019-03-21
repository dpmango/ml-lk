<template>
  <div class="container">
    <slot></slot>
  </div>
</template>


<style lang="scss">
@import '@/theme/utils.scss';

.container {
  width: 100%;
  max-width: 1440px;
  padding-left: 30px;
  padding-right: 30px;
  margin-left: auto;
  margin-right: auto;
}
@include r($sm) {
  .container {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
