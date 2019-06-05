<template>
  <div class="panel" :class="{'is-filter-hidden' : !isFilterOpen}">
    <div
      class="panel__head panel-head"
      :class="{'panel-head--no-clear' : noClearButton}"
      @click="toggleFilter"
    >
      <div class="panel-head__icon">
        <div class="icon-circle">
          <svg-icon name="filter" width="13" height="15"/>
        </div>
      </div>
      <div class="panel-head__name">{{name}}</div>
      <template v-if="!noClearButton">
        <div class="panel-head__action" @click="clickClear">
          <span>Очистить фильтр</span>
        </div>
      </template>
    </div>
    <div class="panel__filter">
      <slot name="filter"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';

export default {
  name: 'Panel',
  components: {
    SvgIcon,
  },
  props: {
    name: String,
    noClearButton: Boolean,
  },
  data() {
    return {
      isFilterOpen: true,
    };
  },
  methods: {
    toggleFilter() {
      this.isFilterOpen = !this.isFilterOpen;
    },
    clickClear(e) {
      e.stopPropagation();
      this.$emit('clearFilter');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme/utils.scss';

.icon-circle {
  display: block;
  width: 30px;
  height: 30px;
  background: #d1cfda;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0;
  transition: background 0.25s ease, opacity 0.25s ease;
}

.panel {
  background: #ffffff;
  height: calc(100vh - 80px - 40px);
  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.08);
  &__head {
    flex: 0 0 auto;
    background: $colorBg;
    cursor: pointer;
  }
  &__filter {
    flex: 0 0 auto;
  }
  &.is-filter-hidden {
    .panel__filter {
      height: 0;
      overflow: hidden;
    }
    .panel-head__icon {
      .icon-circle {
        background-color: $colorPrimary;
      }
    }
  }
}

.panel-head {
  display: flex;
  align-items: center;
  min-height: 40px;
  padding: 5px 15px 5px 20px;
  &__icon {
    flex: 0 0 110px;
  }
  &__name {
    flex: 1 1 auto;
    font-size: 16px;
    text-align: center;
  }
  &__action {
    flex: 0 0 110px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    span {
      display: inline-block;
      position: relative;
      &::after {
        display: block;
        content: ' ';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: currentColor;
        transition: right 0.25s ease;
      }
    }
    &:hover {
      span::after {
        right: 100%;
      }
    }
  }
  &--no-clear {
    .panel-head {
      &__icon {
        flex-basis: 30px;
        max-width: 30px;
      }
      &__name {
        padding-right: 30px;
      }
    }
  }
  &:hover {
    .icon-circle {
      opacity: 0.7;
    }
  }
}

@include r($xl) {
  .panel {
    height: auto;
    max-height: calc(100vh - 80px - 40px);
  }
}
@include r($sm) {
  .panel-head {
    flex-wrap: wrap;
    &__icon {
      flex-basis: auto;
    }
    &__name {
      padding-left: 20px;
      text-align: left;
    }
  }
}
</style>
