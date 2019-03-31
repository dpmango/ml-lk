<template>
  <button
    class="btn"
    :class="{ 'btn--primary': primary, 'btn--orange': orange, 'btn--block': block }"
    :type="type"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    primary: Boolean,
    orange: Boolean,
    type: String,
    block: Boolean,
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme/utils.scss';

.btn {
  min-width: 130px;
  padding: 10px 30px;
  font-size: 14px;
  font-weight: 700;
  border-radius: 30px;
  background: transparent;
  color: $fontColor;
  cursor: pointer;
  border: 2px solid #d2d2d2;
  transition: border 0.25s ease-in-out, background 0.25s ease-in-out, color 0.25s ease-in-out;
  &:hover {
    background-color: #d2d2d2;
  }
  &:focus {
    outline: none;
  }
  &--primary {
    border-color: $colorPrimary;
    &:hover {
      color: white;
      background-color: $colorPrimary;
    }
  }
  &--orange {
    border-color: $colorOrange;
    &:hover {
      color: white;
      background-color: $colorOrange;
    }
  }
  &--block{
    display: block;
    width: 100%;
    text-align: center;
  }
}
@include r($sm) {
  .btn {
    font-size: 13px;
    padding: 8px 22px;
  }
}
</style>
