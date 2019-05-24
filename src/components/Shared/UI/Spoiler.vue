<template>
  <div class="spoiler">
    <div class="spoiler__head">
      <div class="spoiler__title">
        {{title}}
        <svg-icon name="down-arrow" width="10" height="6"/>
      </div>
    </div>
    <div class="spoiler__body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';

export default {
  name: 'UiSpoiler',
  components: {
    SvgIcon,
  },
  props: {
    title: String,
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme/utils.scss';

.spoiler {
  display: block;
  width: 100%;
  &__title {
    display: inline-flex;
    align-items: center;
    font-size: 14px;
    line-height: normal;
    cursor: pointer;
    .svg-icon {
      margin-left: 10px;
    }
  }
  &__head {
    margin: 0px 10px 5px 43px;
  }
  .ui-checkbox {
    display: inline-block;
  }
}
</style>