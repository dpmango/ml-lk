<template>
  <Panel name="Уведомления" noClearButton>
    <form class="filter botom-line">
      <button class="filter__clear">Очистить</button>
      <UiSpoiler title="Тип уведомления">
        <ul class="list">
          <li>
            <ui-checkbox
              @input="filterWithDebounce"
              v-model="filter.marked"
              name="marked"
              label="Отмеченные"
              big_font="true"
            />
          </li>
          <li>
            <ui-checkbox
              @input="filterWithDebounce"
              v-model="filter.new"
              name="new"
              label="Новые"
              big_font="true"
            />
          </li>
          <li>
            <ui-checkbox
              @input="filterWithDebounce"
              v-model="filter.maleOnline"
              name="maleOnline"
              label="Мужчина онлайн"
              big_font="true"
            />
          </li>
        </ul>
      </UiSpoiler>
      <button class="choose-profile">Выбрать профиль</button>
    </form>
    <div class="table">
      <div class="table__content" ref="list">
        <UiNotification v-if="errorMessage" type="danger">{{errorMessage}}</UiNotification>
        <Relation v-for="(notification, idx) in notifications" :key="idx" :data="notification"/>
        <spinner
          class="table__loader"
          v-if="scrollFetch.isLoading"
          size="medium"
          line-fg-color="#5aa6ff"
        />
      </div>
    </div>
  </Panel>
</template>

<script>
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import cloneDeep from 'lodash/cloneDeep';
import Spinner from 'vue-simple-spinner';
import Panel from '@/components/Shared/Layout/Panel.vue';
// import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';
import UiCheckbox from '@/components/Shared/UI/Checkbox.vue';
import UiNotification from '@/components/Shared/UI/Notification.vue';
import UiSpoiler from '@/components/Shared/UI/Spoiler.vue';
import Relation from '@/components/Users/Relation.vue';
import api from '@/helpers/Api';

const defaultFilterState = {
  noTranslator: false,
};

export default {
  name: 'NotificationsList',
  components: {
    Spinner,
    Panel,
    // SvgIcon,
    UiCheckbox,
    UiNotification,
    UiSpoiler,
    Relation,
  },
  data() {
    return {
      notifications: [],
      errorMessage: '',
      scrollFetch: {
        isLoading: false,
        moreResultsAvailable: true,
      },
      filter: cloneDeep(defaultFilterState),
    };
  },
  computed: {},
  created() {
    this.filterWithDebounce = debounce(this.applyFilters, 600);
    this.scrollWithThrottle = throttle(this.handleListScroll, 100);
  },
  mounted() {
    this.fetchApi();
    this.$refs.list.addEventListener('scroll', this.scrollWithThrottle, false);
  },
  beforeDestroy() {
    this.$refs.list.removeEventListener('scroll', this.scrollWithThrottle, false);
  },
  methods: {
    fetchApi() {
      this.applyFilters();
    },
    // filterToParams() {
    //   const freeOnly = this.filter.noTranslator ? 1 : undefined;
    //   let filters = {};

    //   if (freeOnly) {
    //     filters = { ...filters, ...{ free: freeOnly } };
    //   }

    //   return filters;
    // },
    applyFilters() {
      api
        .get('notifications', {
          // filter: this.filterToParams(),
        })
        .then(res => {
          this.errorMessage = '';
          this.notifications = res.data;
          console.log('GET notifications responce', res);
        })
        .catch(err => {
          this.errorMessage = err;
        });
    },
    clearFilter() {
      this.filter = cloneDeep(defaultFilterState);
      this.applyFilters();
    },
    handleListScroll() {
      // const listDOM = this.$refs.list;
      // const scrollRemaining = listDOM.scrollHeight - listDOM.scrollTop - listDOM.offsetHeight;
      // if (
      //   scrollRemaining <= 150 &&
      //   !this.scrollFetch.isLoading &&
      //   this.scrollFetch.moreResultsAvailable
      // ) {
      //   const lastId = this.notifications[this.notifications.length - 2].ID;
      //   this.scrollFetch.isLoading = true;
      //   api
      //     .get(`notifications?last_id=${lastId}`, {
      //       params: this.filterToParams(),
      //     })
      //     .then(res => {
      //       this.notifications = this.notifications.concat(res.data.slice(1));
      //       this.scrollFetch.isLoading = false;
      //       this.scrollFetch.moreResultsAvailable = res.data.length === 21;
      //     });
      // }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme/utils.scss';

.list {
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  li {
    width: 100%;
  }
}

.choose-profile {
  margin-left: 43px;
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  cursor: pointer;
  padding: 0;
  border: none;
  border-bottom: 1px dashed #1e1e1e;
  background: none;
}

.filter {
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 15px 10px;
  .ui-group {
    margin: 5px 10px;
  }
  .ui-checkbox {
    margin: 5px 10px;
  }
  .multiselect {
    margin: 5px 10px;
    max-width: 235px;
  }
  &__clear {
    position: absolute;
    top: 15px;
    right: 13px;
    cursor: pointer;
    text-decoration: underline;
    color: rgba(#1e1e1e, 0.5);
    font-size: 13px;
    line-height: normal;
    font-weight: 500;
    padding: 0;
    border: none;
    background: none;
  }
}

.botom-line {
  border-bottom: 1px solid rgba(#d1cfda, 0.4);
}

.table {
  flex: 1 1 auto;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  &__cell {
    font-size: 13px;
    font-weight: 500;
  }
  &__content {
    flex: 1 1 auto;
    max-height: 100%;
    overflow-y: scroll;
    padding: 20px 0 20px 0px;
    &::-webkit-scrollbar {
      width: 25px;
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
  &__loader {
    margin: 30px 0 0px;
  }
}
@include r(460) {
  .table {
    &__head {
      padding: 0;
    }
    &__cell {
      display: none;
    }
  }
}
</style>
