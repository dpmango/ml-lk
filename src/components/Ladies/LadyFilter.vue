<template>
  <div v-click-outside="hideDropdown" class="lady-filter" :class="{'is-active' : isOpened}">
    <div class="lady-filter__toggler" @click="toggleDropdown">Выбрать профиль</div>
    <div class="lady-filter__dropdown" ref="list">
      <div class="lady-filter__cta" v-if="list.length > 1">
        <a href="#" @click="handleSelectAllClick">Выбрать все</a>
      </div>
      <div class="lady-filter__list">
        <Notification v-if="errorMessage" type="danger">{{errorMessage}}</Notification>
        <div
          class="lady-filter__lady lady-card"
          :class="{'is-selected' : selected.indexOf(lady.ID) !== -1}"
          v-for="(lady, idx) in list"
          :key="idx"
          @click="handleLadyClick(lady)"
        >
          <Avatar :Thumbnail="lady.Thumbnail" :RealName="lady.RealName" :Online="lady.Online"/>
          <div class="lady-card__content">
            <div class="lady-card__name">{{lady.RealName}}</div>
            <div class="lady-card__country">{{lady.Country}}</div>
          </div>
        </div>
        <Notification v-if="errorMessage" type="danger">{{errorMessage}}</Notification>
        <spinner
          class="lady-filter__loader"
          v-if="scrollFetch.isLoading"
          size="medium"
          line-fg-color="#5aa6ff"
        />
      </div>
    </div>
  </div>
</template>

<script>
import throttle from 'lodash/throttle';
import Spinner from 'vue-simple-spinner';
import Avatar from '@/components/Users/Avatar.vue';
import Notification from '@/components/Shared/UI/Notification.vue';
import ClickOutside from 'vue-click-outside';
import api from '@/helpers/Api';

export default {
  name: 'LadyFilter',
  components: {
    Avatar,
    Spinner,
    Notification,
  },
  data() {
    return {
      isOpened: false,
      initialListLoaded: false,
      scrollFetch: {
        isLoading: false,
        moreResultsAvailable: true,
      },
      list: [],
      errorMessage: '',
    };
  },
  props: {
    filterGetList: String,
    selected: Array,
  },
  created() {
    this.scrollWithThrottle = throttle(this.handleListScroll, 100);
  },
  mounted() {
    // this.fetchApi();
    this.$refs.list.addEventListener('scroll', this.scrollWithThrottle, false);
  },
  beforeDestroy() {
    this.$refs.list.removeEventListener('scroll', this.scrollWithThrottle, false);
  },
  methods: {
    toggleDropdown() {
      this.isOpened = !this.isOpened;
    },
    hideDropdown() {
      this.isOpened = false;
    },
    handleLadyClick(lady) {
      this.$emit('onSelect', lady);
    },
    handleSelectAllClick() {
      // const allIDs = this.list.map(x => x.ID);
      // this.$emit('onSelect', allIDs);
      this.$emit('onSelect', this.list);
    },
    fetchApi() {
      api
        .get(`ladies?filter=${this.filterGetList}`)
        .then(res => {
          this.errorMessage = '';
          this.list = res.data;
          this.scrollFetch.moreResultsAvailable = res.data.length === 21;
        })
        .catch(err => {
          this.errorMessage = err;
        });
    },
    handleListScroll() {
      const listDOM = this.$refs.list;
      const scrollRemaining = listDOM.scrollHeight - listDOM.scrollTop - listDOM.offsetHeight;
      if (
        scrollRemaining <= 150 &&
        !this.scrollFetch.isLoading &&
        this.scrollFetch.moreResultsAvailable
      ) {
        const lastId = this.list[this.list.length - 2].ID;
        this.scrollFetch.isLoading = true;

        api.get(`ladies?filter=${this.filterGetList}&last_id=${lastId}`).then(res => {
          this.list = this.list.concat(res.data.slice(1));
          this.scrollFetch.isLoading = false;
          this.scrollFetch.moreResultsAvailable = res.data.length === 21;
        });
      }
    },
  },
  directives: {
    ClickOutside,
  },
  watch: {
    isOpened(Old, New) {
      if (!this.initialListLoaded) {
        this.fetchApi();
        this.initialListLoaded = true;
      }
    },
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
  &__cta {
    padding: 8px 15px;
    a {
      font-size: 12px;
      display: inline-block;
      cursor: pointer;
      border-bottom: 1px solid currentColor;
      transition: border 0.25s ease;
      &:hover {
        border-color: transparent;
      }
    }
  }
  &__loader {
    margin-top: 30px;
    // position: absolute;
    // bottom: 10px;
    // z-index: 3;
    // left: 50%;
    // transform: translateX(-50%);
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
  &:hover,
  &.is-selected {
    background: $colorBg;
  }
  &.is-selected:hover {
    background: rgba($colorRed, 0.1);
  }
}
</style>
