<template>
  <svg :width="width" :height="height" :class="className" xmlns="http://www.w3.org/2000/svg">
    <title v-if="title">{{ title }}</title>
    <use v-bind:xlink:href="iconPath" xmlns:xlink="http://www.w3.org/1999/xlink"></use>
  </svg>
</template>

<script>
export default {
  name: 'svg-icon',

  props: {
    name: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      default: null,
    },
    width: {
      type: [Number, String],
      default: 16,
    },
    height: {
      type: [Number, String],
      default: 16,
    },
  },

  computed: {
    iconPath() {
      return require(`@/assets/icons/${this.name}.svg`).default.url;
    },

    className() {
      return `svg-icon svg-icon--${this.name}`;
    },
  },
};
</script>

<style>
.svg-icon {
  display: inline-block;
  vertical-align: baseline;
  margin-bottom: -2px;
  fill: currentColor;
  transition: opacity 0.25s ease-in-out, fill 0.25s ease-in-out, stroke 0.25s ease-in-out;
}
</style>
