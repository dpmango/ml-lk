<template>
  <div class="spoiler" :class="{'is-open': isOpen}">
    <div class="spoiler__head" @click="toggleSpoiler">
      <div class="spoiler__title">
        {{title}}
        <svg-icon name="down-arrow" width="10" height="6"/>
      </div>
    </div>

    <div class="spoiler__body" v-if="isOpen">
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
  data() {
    return {
      isOpen: true,
    };
  },
  methods: {
    toggleSpoiler() {
      this.isOpen = !this.isOpen;
    },
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
      transform: rotate(180deg);
      transition: transform 0.25s ease;
    }
  }
  &__head {
    margin: 0px 10px 5px 43px;
  }
  &__body {
    height: 0;
    transition: height 0.4s ease-out;
  }
  .ui-checkbox {
    display: inline-block;
  }
  &.is-open {
    .spoiler {
      &__title {
        .svg-icon {
          transform: rotate(0deg);
        }
      }
      &__body {
        height: 100%;
      }
    }
  }
}
</style>
