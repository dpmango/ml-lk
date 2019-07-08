<template>
  <div class="panel" :class="{'is-collapsed': isCollapsed}">
    <div class="panel__head panel-head">
      <div class="panel-head__name">{{name}}</div>
      <!-- <div class="panel-head__collapse" @click="toggleCollapse">
        <span>Свернуть</span>
        <svg-icon name="down-arrow" width="9" height="5"/>
      </div> -->
    </div>
    <div class="panel__content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';

export default {
  name: 'PanelCollapse',
  components: {
    SvgIcon,
  },
  data() {
    return {
      isCollapsed: false,
    };
  },
  props: {
    name: String,
    noClearButton: Boolean,
  },
  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme/utils.scss';

.panel {
  background: #ffffff;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.08);
  &__head {
    flex: 0 0 auto;
    background: $colorBg;
  }
  &__content {
    height: auto;
    overflow: hidden;
    transition: height 0.45s ease-out;
  }
  &.is-collapsed {
    .panel__content {
      height: 0;
    }
    .panel-head__collapse {
      .svg-icon {
        transform: rotate(180deg);
      }
    }
  }
}

.panel-head {
  display: flex;
  align-items: center;
  min-height: 40px;
  padding: 5px 20px 5px 20px;
  &__name {
    flex: 1 1 auto;
    font-size: 16px;
    padding-left: 80px;
    text-align: center;
  }
  &__collapse {
    flex: 0 0 80px;
    display: flex;
    align-items: center;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transform: translateY(0.1em);
    span {
      display: inline-block;
      margin-right: 10px;
    }
    .svg-icon {
      margin-bottom: 0;
      transition: transform 0.25s ease;
    }
  }
}

@include r($xl) {
  .panel {
  }
}
@include r($sm) {
  .panel-head {
    &__name {
      padding-left: 0;
      text-align: left;
    }
  }
}
</style>
