<template>
  <Panel name="Переводчики" @clearFilter="clearFilter">
    <div class="filter">
      <multiselect
        v-model="filter.deleted"
        track-by="label"
        label="label"
        placeholder="Выберите"
        :searchable="false"
        :allowEmpty="false"
        :options="[
          {label: 'Все', value: undefined},
          {label: 'Не показывать удаленных', value: 0},
          {label: 'Удаленные', value: 1}
        ]"
      >
        <template slot="caret">
          <div class="multiselect__select multiselect__select--svg">
            <svg-icon name="down-arrow" width="10" height="6"/>
          </div>
        </template>
      </multiselect>
      <multiselect
        v-model="filter.blocked"
        track-by="label"
        label="label"
        placeholder="Выберите"
        :searchable="false"
        :allowEmpty="false"
        :options="[
          {label: 'Все', value: undefined},
          {label: 'Не показывать заблокированных', value: 0},
          {label: 'Заблокированные', value: 1}
        ]"
      >
        <template slot="caret">
          <div class="multiselect__select multiselect__select--svg">
            <svg-icon name="down-arrow" width="10" height="6"/>
          </div>
        </template>
      </multiselect>
      <ui-input group noLabel v-model="filter.surname" width="155" placeholder="Фамилия"/>
    </div>
    <div class="table">
      <div class="table__head">
        <div
          class="table__cell table__cell--sortable table__cell--translator"
          :class="{'is-sorting-active': sorting.col === 'name'}"
          @click="sortTable('name')"
        >
          <span>Переводчик</span>
          <svg-icon name="sort" width="16" height="12"/>
        </div>
        <div class="table__cell table__cell--activity">Активность</div>
        <div
          class="table__cell table__cell--sortable table__cell--count"
          :class="{'is-sorting-active': sorting.col === 'count'}"
          @click="sortTable('count')"
        >
          <span>Количество девушек</span>
          <svg-icon name="sort" width="16" height="12"/>
        </div>
        <div class="table__cell table__cell--block">Блокировка</div>
      </div>
      <div class="table__content">
        <Translator
          v-for="(translator) in translatorsList"
          :key="translator.ID"
          :translator="translator"
        />
        <AddEditModal @sucessCallback="updateComponenetWithLadies"/>
        <BlockModal @sucessCallback="updateComponenet"/>
        <RemoveModal @sucessCallback="updateComponenet"/>
        <AttachLadiesModal @sucessCallback="updateComponenetWithLadies"/>
      </div>
    </div>
  </Panel>
</template>


<script>
import cloneDeep from 'lodash/cloneDeep';
import sortBy from 'lodash/sortBy';
import Panel from '@/components/Shared/Layout/Panel.vue';
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';
import Multiselect from 'vue-multiselect';
import UiInput from '@/components/Shared/UI/Input.vue';
import Translator from '@/components/Translators/Translator.vue';
import BlockModal from '@/components/Translators/BlockModal.vue';
import AddEditModal from '@/components/Translators/AddEditModal.vue';
import RemoveModal from '@/components/Translators/RemoveModal.vue';
import AttachLadiesModal from '@/components/Translators/AttachLadiesModal.vue';
import api from '@/helpers/Api';
import EventBus from '@/event-bus';

const defaultFilterState = {
  deleted: { label: 'Не показывать удаленных', value: 0 },
  blocked: { label: 'Не показывать заблокированных', value: 0 },
  surname: '',
};

const defaultSortingState = {
  col: undefined,
  dir: 'ASC',
};

export default {
  name: 'TranslatorsList',
  components: {
    Panel,
    SvgIcon,
    Multiselect,
    UiInput,
    Translator,
    BlockModal,
    RemoveModal,
    AddEditModal,
    AttachLadiesModal,
  },
  data() {
    return {
      filter: cloneDeep(defaultFilterState),
      sorting: cloneDeep(defaultSortingState),
      translators: [],
    };
  },
  created() {
    EventBus.$on('should-update-translators', () => {
      this.fetchApi();
    });
  },
  mounted() {
    this.fetchApi();
  },
  computed: {
    translatorsList() {
      return this.applySorting(
        this.applyFilters(this.$store.state.translators.translators, this.filter),
      );
    },
  },
  methods: {
    fetchApi() {
      api.get('translators').then(res => {
        this.$store.commit('TRANSLATORS_UPDATE', res.data);
      });
    },
    updateComponenet() {
      this.fetchApi();
    },
    updateComponenetWithLadies() {
      this.fetchApi();
      EventBus.$emit('should-update-ladies');
    },
    applyFilters(arr, filter) {
      const showDeleted = x => {
        if (filter.deleted.value === 0) {
          return x.RemovalDate.length <= 1;
        }
        if (filter.deleted.value === 1) {
          return x.RemovalDate.length > 1;
        }
        return true;
      };
      const showBlocked = x => {
        if (filter.blocked.value === 0) {
          return x.BlockDate.length <= 1;
        }
        if (filter.blocked.value === 1) {
          return x.BlockDate.length > 1;
        }
        return true;
      };
      const filterSurname = x => {
        const filterName = filter.surname.trim();
        return filterName ? x.LastName.toLowerCase().startsWith(filterName.toLowerCase()) : true;
      };

      return arr ? arr.filter(x => showDeleted(x) && showBlocked(x) && filterSurname(x)) : [];
    },
    clearFilter() {
      this.filter = cloneDeep(defaultFilterState);
    },
    applySorting(arr) {
      const { col, dir } = this.sorting;

      const sortingRules = () => {
        // sort by FirstName
        if (col === 'name') {
          if (dir === 'DESC') {
            return sortBy(arr, x => x.FirstName).reverse();
          }
          return sortBy(arr, x => x.FirstName);
        }
        // sort by LadiesCount
        if (col === 'count') {
          if (dir === 'DESC') {
            return sortBy(arr, x => parseInt(x.LadiesCount, 10)).reverse();
          }
          return sortBy(arr, x => parseInt(x.LadiesCount, 10));
        }

        // default sort by id
        return sortBy(arr, x => x.ID).reverse();
      };

      return arr ? sortingRules() : [];
    },
    sortTable(name) {
      // double click change direction
      if (this.sorting.col === name) {
        this.sorting.dir = this.sorting.dir === 'ASC' ? 'DESC' : 'ASC';
      }

      this.sorting.col = name;
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
  padding: 15px 12px;
  margin-left: -10px;
  margin-right: -10px;
  .multiselect {
    margin: 5px 10px;
    max-width: 240px;
  }
  .ui-group {
    margin: 5px 10px;
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
    span {
      display: inline-block;
    }
    .svg-icon {
      fill: rgba($fontColor, 0.5);
      transition: fill 0.25s ease;
    }
    &--sortable {
      cursor: pointer;
      transition: color 0.25s ease-in-out;
      &:hover {
        color: $colorPrimary;
      }
    }
    &--translator {
      flex: 0 0 25%;
    }
    &--activity {
      flex: 0 0 34%;
      text-align: center;
    }
    &--count {
      flex: 0 0 12%;
      margin-left: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        max-width: 75px;
      }
    }
    &--block {
      flex: 0 0 130px;
      margin-left: 35px;
    }
    &.is-sorting-active {
      .svg-icon {
        fill: $colorPrimary;
      }
    }
  }
  &__content {
    flex: 1 1 auto;
    max-height: 100%;
    overflow-y: scroll;
    padding: 12px;
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
}
@include r($md) {
  .table {
    &__head {
      flex-direction: column;
      align-items: flex-start;
      padding-top: 0;
      padding-bottom: 8px;
    }
    &__content {
      padding-left: 20px;
      padding-right: 20px;
    }
    &__cell {
      flex: 0 0 auto;
      display: none;
      padding: 8px 0;
      &--sortable {
        display: block;
      }
      &--count {
        margin-left: 0;
        span {
          max-width: 100%;
        }
      }
    }
  }
}
</style>
