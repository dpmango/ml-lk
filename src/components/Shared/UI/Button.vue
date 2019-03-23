<template>
  <button
    class="btn"
    @click="$emit('click')"
    :class="{ 'btn--primary': primary, 'btn--orange': orange }"
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
    border-color: #5aa6ff;
    &:hover {
      color: white;
      background-color: #5aa6ff;
    }
  }
  &--orange {
    border-color: #ff9800;
    &:hover {
      color: white;
      background-color: #ff9800;
    }
  }
}
</style>
