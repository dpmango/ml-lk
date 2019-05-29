<template>
  <div v-click-outside="hideDropdown" class="lady-filter" :class="{'is-active' : isOpened}">
    <div class="lady-filter__toggler" @click="toggleDropdown">Выбрать профиль</div>
    <div class="lady-filter__dropdown">
      <div class="lady-filter__list">
        <div class="lady-filter__lady lady-card" v-for="(lady, idx) in list" :key="idx">
          <Avatar :Thumbnail="lady.Thumbnail" :RealName="lady.RealName" :Online="lady.Online"/>
          <div class="lady-card__content">
            <div class="lady-card__name">{{lady.RealName}}</div>
            <div class="lady-card__country">{{lady.Country}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from '@/components/Users/Avatar.vue';
import ClickOutside from 'vue-click-outside';

export default {
  name: 'LadyFilter',
  components: {
    Avatar,
  },
  data() {
    return {
      isOpened: false,
      list: [
        {
          ID: 1,
          Thumbnail: 'https://marmeladies.com/media/images/profile/1543646_0_17964.jpg',
          RealName: 'Karina',
          Age: '21',
          Country: 'Ukraine, Kiev',
          Online: '0',
        },
        {
          ID: 2,
          Thumbnail: 'https://marmeladies.com/media/images/profile/1543646_0_17964.jpg',
          RealName: 'Karina',
          Age: '21',
          Country: 'Ukraine, Kiev',
          Online: '1',
        },
        {
          ID: 3,
          Thumbnail: 'https://marmeladies.com/media/images/profile/1543646_0_17964.jpg',
          RealName: 'Karina',
          Age: '21',
          Country: 'Ukraine, Kiev',
          Online: '0',
        },
        {
          ID: 4,
          Thumbnail: 'https://marmeladies.com/media/images/profile/1543646_0_17964.jpg',
          RealName: 'Karina',
          Age: '21',
          Country: 'Ukraine, Kiev',
          Online: '0',
        },
        {
          ID: 5,
          Thumbnail: 'https://marmeladies.com/media/images/profile/1543646_0_17964.jpg',
          RealName: 'Karina',
          Age: '21',
          Country: 'Ukraine, Kiev',
          Online: '1',
        },
        {
          ID: 6,
          Thumbnail: 'https://marmeladies.com/media/images/profile/1543646_0_17964.jpg',
          RealName: 'Karina',
          Age: '21',
          Country: 'Ukraine, Kiev',
          Online: '0',
        },
        {
          ID: 7,
          Thumbnail: 'https://marmeladies.com/media/images/profile/1543646_0_17964.jpg',
          RealName: 'Karina',
          Age: '21',
          Country: 'Ukraine, Kiev',
          Online: '1',
        },
        {
          ID: 8,
          Thumbnail: 'https://marmeladies.com/media/images/profile/1543646_0_17964.jpg',
          RealName: 'Karina',
          Age: '21',
          Country: 'Ukraine, Kiev',
          Online: '0',
        },
      ],
    };
  },
  methods: {
    toggleDropdown() {
      this.isOpened = !this.isOpened;
    },
    hideDropdown() {
      this.isOpened = false;
    },
  },
  directives: {
    ClickOutside,
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme/utils.scss';

.lady-filter {
  position: relative;
  &__toggler {
    display: inline-block;
    margin-left: 43px;
    font-weight: 500;
    font-size: 13px;
    line-height: 20px;
    padding: 0;
    border: none;
    border-bottom: 1px dashed #1e1e1e;
    background: none;
    cursor: pointer;
    transition: 0.25s ease;
    &:hover {
      border-color: transparent;
    }
  }
  &__dropdown {
    position: absolute;
    top: 100%;
    left: 43px;
    z-index: 3;
    background: white;
    box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.16);
    opacity: 0;
    pointer-events: none;
    transform: translate3d(0, 7px, 0);
    transition: 0.25s ease;
    max-height: 450px;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 3px;
      margin-top: 10px;
    }

    &::-webkit-scrollbar-track {
      border-left: 3px solid rgba(black, 0.2);
      margin-top: 20px;
      margin-bottom: 20px;
    }

    &::-webkit-scrollbar-thumb {
      border-left: 3px solid $colorOrange;
    }
  }
  &__list {
    list-style: none;
  }
  &__lady {
    // some
  }
  &.is-active {
    .lady-filter {
      &__dropdown {
        opacity: 1;
        transform: translate(0, 0);
        pointer-events: all;
      }
    }
  }
}

.lady-card {
  position: relative;
  background: transparent;
  display: flex;
  align-items: center;
  padding: 12px 15px;
  transition: background-color 0.25s ease, border-color 0.25s ease;
  &__content {
    width: 100%;
    margin-left: 10px;
    padding-right: 20px;
  }
  &__name {
    font-size: 14px;
    line-height: 18px;
  }
  &__country {
    margin-top: 0.5em;
    font-size: 11px;
    color: $fontColor;
  }
  &:hover {
    background: $colorBg;
  }
}
</style>
