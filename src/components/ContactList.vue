<template>
  <Panel name="Контакт-лист" noClearButton>
    <form class="filter botom-line">
      <button class="filter__clear" @click="clearFilter">Очистить</button>

      <ul class="list">
        <li>
          <ui-checkbox
            @input="filterWithDebounce"
            v-model="filter.active"
            name="c_active"
            label="Активный чат"
            bigFont
          />
        </li>
        <li>
          <ui-checkbox
            @input="filterWithDebounce"
            v-model="filter.new"
            name="c_new"
            label="Неотвеченные"
            bigFont
          />
        </li>
        <li>
          <ui-checkbox
            @input="filterWithDebounce"
            v-model="filter.marked"
            name="c_marked"
            label="Отмеченные"
            bigFont
          />
        </li>
        <li>
          <ui-checkbox
            @input="filterWithDebounce"
            v-model="filter.maleOnline"
            name="c_maleOnline"
            label="Мужчина онлайн"
            bigFont
          />
        </li>
      </ul>

      <button class="choose-profile">Выбрать профиль</button>
    </form>
    <div class="table">
      <div class="table__content" ref="list">
        <UiNotification v-if="errorMessage" type="danger">{{errorMessage}}</UiNotification>
        <RelationContact v-for="(contact, idx) in contactsList" :key="idx" :data="contact"/>
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
import UiCheckbox from '@/components/Shared/UI/Checkbox.vue';
import UiNotification from '@/components/Shared/UI/Notification.vue';
import RelationContact from '@/components/Users/RelationContact.vue';
import api from '@/helpers/Api';

const defaultFilterState = {
  active: false,
  new: false,
  marked: false,
  maleOnline: false,
};

export default {
  name: 'ContactList',
  components: {
    Spinner,
    Panel,
    UiCheckbox,
    UiNotification,
    RelationContact,
  },
  data() {
    return {
      errorMessage: '',
      scrollFetch: {
        isLoading: false,
        moreResultsAvailable: true,
      },
      filter: cloneDeep(defaultFilterState),
    };
  },
  created() {
    this.filterWithDebounce = debounce(this.fetchWithFilter, 600);
    this.scrollWithThrottle = throttle(this.handleListScroll, 100);
  },
  mounted() {
    this.fetchApi();
    this.$refs.list.addEventListener('scroll', this.scrollWithThrottle, false);
  },
  beforeDestroy() {
    this.$refs.list.removeEventListener('scroll', this.scrollWithThrottle, false);
  },
  computed: {
    contactsList() {
      return this.$store.state.contacts.contacts;
    },
  },
  methods: {
    fetchApi() {
      this.fetchWithFilter();
    },
    filterToParams() {
      let filterString = '';
      if (this.filter.active) {
        filterString = '1';
      }
      if (this.filter.new) {
        filterString = filterString.length > 0 ? `${filterString},2` : '2';
      }
      if (this.filter.marked) {
        filterString = filterString.length > 0 ? `${filterString},3` : '3';
      }
      if (this.filter.maleOnline) {
        filterString = filterString.length > 0 ? `${filterString},4` : '4';
      }

      return {
        filter: filterString,
        ladies: '', // TODO
      };
    },
    fetchWithFilter() {
      api
        .get('contacts', {
          params: this.filterToParams(),
        })
        .then(res => {
          console.log('res', res.data);
          this.errorMessage = '';
          this.$store.commit('setContacts', res.data);
        })
        .catch(err => {
          this.errorMessage = err;
        });
    },
    clearFilter() {
      this.filter = cloneDeep(defaultFilterState);
      this.fetchWithFilter();
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
  flex: 0 0 auto;
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 15px 10px;
  .ui-group {
    margin: 5px 10px;
  }
  .ui-checkbox {
    margin: 0px 10px;
  }
  .multiselect {
    margin: 5px 10px;
    max-width: 235px;
  }
  &__clear {
    position: absolute;
    z-index: 3;
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