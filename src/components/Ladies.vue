<template>
  <Panel name="Девушки" @clearFilter="clearFilter">
    <form class="filter">
      <ui-input group v-model="filter.id" width="60" placeholder="ID"/>
      <ui-input group v-model="filter.nickname" width="155" placeholder="Ник"/>
      <ui-input group v-model="filter.lastname" width="155" placeholder="Фамилия"/>
      <multiselect
        v-model="filter.status"
        track-by="label"
        label="label"
        placeholder="Статус"
        :searchable="false"
        :options="[
          {label: 'Активна', value: 1},
          {label: 'На проверке', value: 2},
          {label: 'Отклонена', value: 3},
          {label: 'Удалена', value: 4}
        ]"
      >
        <template slot="caret">
          <div @click="toggle()" class="multiselect__select multiselect__select--svg">
            <svg-icon name="down-arrow" width="10" height="6"/>
          </div>
        </template>
      </multiselect>
      <ui-checkbox v-model="filter.noTranslator" name="noTranslator" label="Без переводчика"/>
    </form>

    <div class="table">
      <div class="table__head">
        <div class="table__cell table__cell--name">Девушки</div>
        <div class="table__cell table__cell--name">Переводчик</div>
      </div>
      <div class="table__content">
        <Lady v-for="(lady, idx) in ladiesResults" :key="idx" :lady="lady"/>
      </div>
    </div>
  </Panel>
</template>

<script>
// import debounce from 'lodash/debounce'
import cloneDeep from 'lodash/cloneDeep';
import Panel from '@/components/Shared/Layout/Panel.vue';
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';
import UiInput from '@/components/Shared/UI/Input.vue';
import UiCheckbox from '@/components/Shared/UI/Checkbox.vue';
import Multiselect from 'vue-multiselect';
import Lady from '@/components/Ladies/Lady.vue';
import api from '@/helpers/Api';

const defaultFilterState = {
  id: '',
  nickname: '',
  lastname: '',
  status: undefined,
  noTranslator: false,
};

export default {
  name: 'Ladies',
  components: {
    Panel,
    SvgIcon,
    Lady,
    UiInput,
    UiCheckbox,
    Multiselect,
  },
  data() {
    return {
      filter: cloneDeep(defaultFilterState),
      ladies: null,
    };
  },
  computed: {
    ladiesResults() {
      return this.applySorting(this.applyFilters(this.ladies, this.filter));
    },
  },
  mounted() {
    api.get('ladies').then((response) => {
      this.ladies = response.data;
    });
  },
  methods: {
    // handleFilterChange(e) {
    //   console.log('form changed', e);
    // },
    applyFilters(arr, filter) {
      // TODO filter is applied on every change. Change to debounce
      const id = filter.id.trim();
      const nickname = filter.nickname.trim();
      const lastname = filter.lastname.trim();
      const status = filter.status ? filter.status.value : undefined;

      const filterById = x => (id ? x.ID.indexOf(id) !== -1 : true);
      const filterByNickname = x => (nickname ? x.NickName.toLowerCase().indexOf(nickname.toLowerCase()) !== -1 : true);
      const filterByLastName = x => (lastname ? x.LastName.toLowerCase().indexOf(lastname.toLowerCase()) !== -1 : true);
      const filterByStatus = x => (status ? x.Status === status : true);
      const filterByTranslator = x => (filter.noTranslator ? !x.Translator : true);

      return arr
        ? arr
          .filter(x => filterById(x))
          .filter(x => filterByNickname(x))
          .filter(x => filterByLastName(x))
          .filter(x => filterByStatus(x))
          .filter(x => filterByTranslator(x))
        : [];
    },
    clearFilter() {
      this.filter = cloneDeep(defaultFilterState);
    },
    applySorting(arr) {
      return this.sortById(arr);
    },
    sortById(arr) {
      return arr;
      // return arr ? arr.slice().sort((a, b) => b.ID - a.ID) : [];
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme/utils.scss';

.filter{
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px 12px;
  .ui-group{
    margin: 10px;
  }
  .ui-checkbox{
    margin: 10px;
  }
  .multiselect{
    margin: 10px;
    max-width: 235px;
  }
}

.table {
  flex: 1 1 auto;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  &__head {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    padding: 8px 12px 16px;
    border-bottom: 1px solid rgba(#d1cfda, 0.8);
  }
  &__cell {
    font-size: 13px;
    font-weight: 500;
    &--name {
      flex: 0 1 50%;
    }
  }
  &__content {
    flex: 1 1 auto;
    max-height: 100%;
    overflow-y: scroll;
    padding: 20px;
  }
}
</style>
