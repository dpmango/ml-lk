<template>
  <div
    class="panel"
    :class="{'is-filter-hidden' : !isFilterOpen, 'is-filter-active': isFilterActive}"
  >
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
      <div class="panel-head__sound" v-if="soundName" @click="toggleSound">
        <svg-icon v-if="soundActive" name="sound" width="24" height="24"/>
        <svg-icon v-else name="sound-turn-off" width="21" height="21"/>
      </div>
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
    filter: Object,
    soundName: String,
  },
  data() {
    return {
      isFilterOpen: false,
    };
  },
  computed: {
    isFilterActive() {
      if (this.filter) {
        return Object.keys(this.filter).some(f => {
          const fKey = this.filter[f];
          if (typeof fKey === 'boolean') {
            return fKey;
          } else if (Array.isArray(fKey)) {
            return fKey.length > 0;
          } else {
            return false;
          }
        });
      }
      return false;
    },
    soundActive() {
      return this.$store.getters.isSoundModuleActive(this.soundName);
    },
  },
  methods: {
    toggleFilter() {
      this.isFilterOpen = !this.isFilterOpen;
    },
    toggleSound(e) {
      e.preventDefault();
      e.stopPropagation();
      this.$store.commit('TOGGLE_SOUND_ACTIVE_MODULES', this.soundName);
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
  }
  &.is-filter-active {
    .panel-head__icon {
      .icon-circle {
        background-color: $colorPrimary;
      }
    }
  }
}

.panel-head {
  position: relative;
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
  &__sound {
    position: absolute;
    z-index: 3;
    top: 50%;
    right: 15px;
    transform: translateY(-50%);
    font-size: 0;
    padding: 5px;
    transition: opacity 0.25s ease;
    &:hover {
      opacity: 0.75;
    }
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
