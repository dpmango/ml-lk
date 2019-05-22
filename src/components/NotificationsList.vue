<template>
  <Panel name="Уведомления" noClearButton>
    <form class="filter">
      <ui-checkbox
        @input="filterWithDebounce"
        v-model="filter.noTranslator"
        name="noTranslator"
        label="Без переводчика"
      />
    </form>
    <div class="table">
      <div class="table__content" ref="list">
        <Notification v-if="errorMessage" type="danger">{{errorMessage}}</Notification>
        <!-- вывести список (Lady удалить) -->
        <div v-for="(test, idx) in notifications" :key="idx">
          <span>{{test.id}} {{test.name}} {{test.foo}}</span>
        </div>
        <!-- <Lady v-for="(lady, idx) in notifications" :key="idx" :lady="lady"/> -->
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
import Notification from '@/components/Shared/UI/Notification.vue';
// import api from '@/helpers/Api';

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
    Notification,
  },
  data() {
    return {
      // notifications: null,
      notifications: [{ id: 1, name: 'test', foo: 'bar' }, { id: 2, name: 'test', foo: 'bar' }],
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
      // api
      //   .get('notifications', {
      //     // filter: this.filterToParams(),
      //   })
      //   .then(res => {
      //     this.errorMessage = '';
      //     this.notifications = res.data;
      //     console.log(res);
      //   })
      //   .catch(err => {
      //     this.errorMessage = err;
      //   });
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

.filter {
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
    padding: 20px 0 20px 20px;
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
