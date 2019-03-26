<template>
  <Panel name="Переводчик">
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
      <div class="table__content">
        <Translator v-for="(translator, idx) in translators" :key="idx" :translator="translator"/>
      </div>
    </div>
  </Panel>
</template>


<script>
import Panel from '@/components/Shared/Layout/Panel.vue';
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';
import Translator from '@/components/Translators/Translator.vue';
import api from '@/helpers/Api';

export default {
  name: 'Translators',
  components: {
    Panel,
    SvgIcon,
    Translator,
  },
  data() {
    return {
      translators: null,
    };
  },
  mounted() {
    api.get('translators').then((response) => {
      this.translators = response.data;
    });
  },
  methods: {
    sortTable(name) {
      console.log('sorting table', name);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme/utils.scss';

.table {
  flex: 0 1 auto;
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
    flex: 0 1 auto;
    max-height: 100%;
    overflow-y: scroll;
    padding: 12px;
  }
}
</style>
