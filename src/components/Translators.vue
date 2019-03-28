<template>
  <Panel name="Переводчики">
    <div class="filter">
      <multiselect
        v-model="filter.deleted"
        track-by="label"
        label="label"
        placeholder="Выберите"
        :searchable="false"
        :allowEmpty="false"
        :options="[
          {label: 'Не показывать удаленных', value: 0},
          {label: 'Показывать удаленных', value: 1}
        ]"
      >
        <template slot="caret">
          <div
            @mousedown.prevent.stop="toggle()"
            class="multiselect__select multiselect__select--svg"
          >
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
          {label: 'Не показывать заблокированных', value: 0},
          {label: 'Показывать заблокированных', value: 1}
        ]"
      >
        <template slot="caret">
          <div @click="toggle()" class="multiselect__select multiselect__select--svg">
            <svg-icon name="down-arrow" width="10" height="6"/>
          </div>
        </template>
      </multiselect>
    </div>
    <div class="table">
      <div class="table__head">
        <div class="table__cell table__cell--translator" @click="sortTable('name')">
          <span>Переводчик</span>
          <svg-icon name="sort" width="16" height="12"/>
        </div>
        <div class="table__cell table__cell--activity">Активность</div>
        <div class="table__cell table__cell--count" @click="sortTable('count')">
          <span>Количество девушек</span>
          <svg-icon name="sort" width="16" height="12"/>
        </div>
        <div class="table__cell table__cell--block">Блокировка</div>
      </div>
      <div class="table__content" v-if="translators.length">
        <Translator
          v-for="(translator, idx) in translatorsResults"
          :key="idx"
          :translator="translator"
        />
        <AddEditModal @sucessCallback="updateComponenet"/>
        <BlockModal @sucessCallback="updateComponenet"/>
        <RemoveModal @sucessCallback="updateComponenet"/>
      </div>
    </div>
  </Panel>
</template>


<script>
import Panel from '@/components/Shared/Layout/Panel.vue';
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';
import Multiselect from 'vue-multiselect';
import Translator from '@/components/Translators/Translator.vue';
import BlockModal from '@/components/Translators/BlockModal.vue';
import AddEditModal from '@/components/Translators/AddEditModal.vue';
import RemoveModal from '@/components/Translators/RemoveModal.vue';
import api from '@/helpers/Api';

export default {
  name: 'Translators',
  components: {
    Panel,
    SvgIcon,
    Multiselect,
    Translator,
    BlockModal,
    RemoveModal,
    AddEditModal,
  },
  data() {
    return {
      filter: {
        deleted: { label: 'Показывать удаленных', value: 1 },
        blocked: { label: 'Показывать заблокированных', value: 1 },
      },
      translators: [],
    };
  },
  mounted() {
    this.fetchApi();
  },
  computed: {
    translatorsResults() {
      return this.applySorting(this.applyFilters(this.translators, this.filter));
    },
  },
  methods: {
    fetchApi() {
      api
        .get('translators')
        .then((res) => {
          this.contactResults(res.data);
        });
    },
    contactResults(arr) {
      this.translators = this.translators.concat(arr);
    },
    updateComponenet() {
      this.translators = []; // TODO - concat
      this.fetchApi();
    },
    applyFilters(arr, filter) {
      const showDeleted = (x) => {
        if (filter.deleted.value !== 1) {
          return x.RemovalDate === '0';
        }
        return true;
      };
      const showBlocked = (x) => {
        if (filter.blocked.value !== 1) {
          return x.BlockDate === '0';
        }
        return true;
      };
      return arr ? arr.filter(x => showDeleted(x) && showBlocked(x)) : [];
    },
    applySorting(arr) {
      return this.sortById(arr);
    },
    sortById(arr) {
      return arr ? arr.slice().sort((a, b) => b.ID - a.ID) : [];
    },
    sortTable(name) {
      console.log('sorting table', name);
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
  .multiselect{
    margin: 10px;
    max-width: 240px;
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
    padding: 16px 12px;
    border-bottom: 1px solid rgba(#d1cfda, 0.8);
  }
  &__cell {
    font-size: 13px;
    font-weight: 500;
    span {
      display: inline-block;
    }
    .svg-icon {
      fill: rgba(#1e1e1e, 0.5);
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
  }
  &__content {
    flex: 1 1 auto;
    max-height: 100%;
    overflow-y: scroll;
    padding: 12px;
  }
}
</style>
