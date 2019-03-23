<template>
  <div class="notification" :class="{'notification--danger': type == 'danger'}">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Notification',
  props: {
    type: String,
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme/utils.scss';
.notification {
  border-radius: 8px;
  color: $fontColor;
  font-size: 14px;
  padding: 8px 20px;
  margin-bottom: 20px;
  &--danger {
    background-color: rgba($colorRed, 0.2);
  }
}
</style>
