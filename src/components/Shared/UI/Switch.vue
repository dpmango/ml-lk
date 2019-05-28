<template>
  <div
    class="ui-switch"
    :class="{'is-active': active, 'is-green': isGreen}"
    @click="$emit('click')"
  >
    <span class="ui-switch__toggle"></span>
  </div>
</template>

<script>
export default {
  name: 'UiSwitch',
  props: {
    active: Boolean,
    isGreen: Boolean,
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme/utils.scss';

.ui-switch {
  position: relative;
  z-index: 1;
  width: 34px;
  height: 14px;
  border-radius: 25px;
  cursor: pointer;
  background: rgba(34, 31, 31, 0.26);
  &__toggle {
    display: inline-block;
    position: absolute;
    z-index: 2;
    top: 50%;
    left: -3px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #f1f1f1;
    transform: translate3d(0, -50%, 0);
    will-change: transform;
    transform-style: preserve-3d;
    // transition: 0.25s ease-out;
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.237602), 0px 0px 1px rgba(0, 0, 0, 0.12);
  }
  &.is-active {
    background: rgba($colorRed, 0.5);
    .ui-switch__toggle {
      transform: translate3d(20px, -50%, 0);
      background: $colorRed;
      box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.237602), 0px 0px 1px rgba(0, 0, 0, 0.12);
    }
  }
  &.is-green {
    &.is-active {
      background: rgba($colorGreen, 0.5);
      .ui-switch__toggle {
        background: $colorGreen;
      }
    }
  }
}
</style>
