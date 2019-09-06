<template>
  <Panel name="Девушки" @clearFilter="clearFilter">
    <form class="filter">
      <ui-input
        group
        noLabel
        @input="filterWithDebounce"
        v-model="filter.id"
        width="85"
        placeholder="ID"
      />
      <ui-input
        group
        noLabel
        @input="filterWithDebounce"
        v-model="filter.nickname"
        width="130"
        placeholder="Ник"
      />
      <ui-input
        group
        noLabel
        @input="filterWithDebounce"
        v-model="filter.lastname"
        width="155"
        placeholder="Фамилия"
      />
      <multiselect
        v-model="filter.status"
        track-by="label"
        label="label"
        placeholder="Статус"
        :searchable="false"
        @input="filterWithDebounce"
        :options="[
          {label: 'Все', value: undefined},
          {label: 'Активна', value: 1},
          {label: 'На проверке', value: 2},
          {label: 'Отклонена', value: 3},
          {label: 'Удалена', value: 4}
        ]"
      >
        <template slot="caret">
          <div class="multiselect__select multiselect__select--svg">
            <svg-icon name="down-arrow" width="10" height="6" />
          </div>
        </template>
      </multiselect>
      <ui-checkbox
        @input="filterWithDebounce"
        v-model="filter.noTranslator"
        name="noTranslator"
        label="Без переводчика"
      />
    </form>
    <div class="table">
      <div class="table__head">
        <div class="table__cell table__cell--name">Девушки</div>
        <div class="table__cell table__cell--translators">Переводчик</div>
      </div>
      <div class="table__content" ref="list">
        <Notification v-if="errorMessage" type="danger">{{errorMessage}}</Notification>
        <Lady v-for="(lady, idx) in ladies" :key="idx" :lady="lady" />
        <spinner
          class="table__loader"
          v-if="scrollFetch.isLoading"
          size="medium"
          line-fg-color="#5aa6ff"
        />
      </div>
      <AttachTranslatorModal @sucessCallback="updateComponenet" />
    </div>
  </Panel>
</template>

<script>
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import cloneDeep from 'lodash/cloneDeep';
import Spinner from 'vue-simple-spinner';
import Panel from '@/components/Shared/Layout/Panel.vue';
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';
import UiInput from '@/components/Shared/UI/Input.vue';
import UiCheckbox from '@/components/Shared/UI/Checkbox.vue';
import Multiselect from 'vue-multiselect';
import Notification from '@/components/Shared/UI/Notification.vue';
import Lady from '@/components/Ladies/Lady.vue';
import AttachTranslatorModal from '@/components/Ladies/AttachTranslatorModal.vue';
import api from '@/helpers/Api';
import EventBus from '@/event-bus';

const defaultFilterState = {
  id: '',
  nickname: '',
  lastname: '',
  status: undefined,
  noTranslator: false,
};

export default {
  name: 'LadiesList',
  components: {
    Spinner,
    Panel,
    SvgIcon,
    Lady,
    UiInput,
    UiCheckbox,
    Multiselect,
    Notification,
    AttachTranslatorModal,
  },
  data() {
    return {
      scrollFetch: {
        isLoading: false,
        moreResultsAvailable: true,
      },
      filter: cloneDeep(defaultFilterState),
      ladies: null,
      errorMessage: '',
    };
  },
  computed: {},
  created() {
    this.filterWithDebounce = debounce(this.applyFilters, 600);
    this.scrollWithThrottle = throttle(this.handleListScroll, 100);
    EventBus.$on('should-update-ladies', () => {
      this.fetchApi();
    });
  },
  mounted() {
    this.fetchApi();
    this.$refs.list.addEventListener('scroll', this.scrollWithThrottle, false);
  },
  beforeDestroy() {
    this.$refs.list.removeEventListener('scroll', this.scrollWithThrottle, false);
  },
  methods: {
    // handleFilterChange(e) {
    //   console.log('form changed', e);
    // },
    fetchApi() {
      this.applyFilters();
      // api.get('ladies').then((res) => {
      //   this.ladies = res.data;
      // });
    },
    updateComponenet() {
      this.applyFilters();
      EventBus.$emit('should-update-translators');
    },
    filterToParams() {
      const id = this.filter.id.trim();
      const nickname = this.filter.nickname.trim();
      const lastname = this.filter.lastname.trim();
      const status = this.filter.status ? this.filter.status.value : undefined;
      const freeOnly = this.filter.noTranslator ? 1 : undefined;
      let filters = {
        id,
        nick: nickname,
        name: lastname,
      };

      if (status) {
        filters = { ...filters, ...{ status } };
      }
      if (freeOnly) {
        filters = { ...filters, ...{ free: freeOnly } };
      }

      return filters;
    },
    applyFilters() {
      // BE filer
      api
        .get('ladies', {
          params: this.filterToParams(),
        })
        .then(res => {
          this.errorMessage = '';
          this.ladies = res.data;
          this.scrollFetch.moreResultsAvailable = res.data.length === 21;
        })
        .catch(err => {
          this.errorMessage = err;
        });

      // FE filter
      // const filterById = x => (id ? x.ID.startsWith(id) : true);
      // const filterByNickname = x => (nickname ? x.NickName.toLowerCase().startsWith(nickname.toLowerCase()) : true);
      // const filterByLastName = x => (lastname ? x.LastName.toLowerCase().startsWith(lastname.toLowerCase()) : true);
      // const filterByStatus = x => (status ? x.Status === status : true);
      // const filterByTranslator = x => (filter.noTranslator ? !x.Translator : true);

      // return arr
      //   ? arr
      //     .filter(x => filterById(x))
      //     .filter(x => filterByNickname(x))
      //     .filter(x => filterByLastName(x))
      //     .filter(x => filterByStatus(x))
      //     .filter(x => filterByTranslator(x))
      //   : [];
    },
    clearFilter() {
      this.filter = cloneDeep(defaultFilterState);
      this.applyFilters();
    },
    handleListScroll() {
      const listDOM = this.$refs.list;
      const scrollRemaining = listDOM.scrollHeight - listDOM.scrollTop - listDOM.offsetHeight;
      if (
        scrollRemaining <= 150 &&
        !this.scrollFetch.isLoading &&
        this.scrollFetch.moreResultsAvailable
      ) {
        const lastId = this.ladies[this.ladies.length - 2].ID;
        this.scrollFetch.isLoading = true;

        api
          .get(`ladies?last_id=${lastId}`, {
            params: this.filterToParams(),
          })
          .then(res => {
            this.ladies = this.ladies.concat(res.data.slice(1));
            this.scrollFetch.isLoading = false;
            this.scrollFetch.moreResultsAvailable = res.data.length === 21;
          });
      }
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
  min-height: 1px;
  display: flex;
  flex-direction: column;
  &__head {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    padding: 8px 20px 16px;
    border-bottom: 1px solid rgba(#d1cfda, 0.8);
  }
  &__cell {
    font-size: 13px;
    font-weight: 500;
    &--name {
      flex: 0 0 245px;
    }
    &--translators {
      flex: 0 0 168px;
      padding-left: 20px;
      margin-left: auto;
    }
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
