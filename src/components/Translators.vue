<template>
  <Panel name="Переводчик">
    <div class="table">
      <div class="table__head">
        <div class="table__cell table__cell--translator">
          Переводчик
          <svg-icon name="sort" width="16" height="12"/>
        </div>
        <div class="table__cell table__cell--translator">Активность</div>
        <div class="table__cell table__cell--translator">
          Количество девушек
          <svg-icon name="sort" width="16" height="12"/>
        </div>
        <div class="table__cell table__cell--translator">Блокировка</div>
      </div>
      <div class="table__content" v-for="(translator, idx) in translators" :key="idx">
        <Translator :translator="translator"/>
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
};
</script>

<style lang="scss" scoped>
@import '@/theme/utils.scss';

.table {
  &__head {
    display: flex;
    align-items: center;
    padding: 16px 12px;
    border-bottom: 1px solid rgba(#d1cfda, 0.8);
  }
  &__cell {
    font-size: 13px;
    font-weight: 500;
    &--translator {
      flex: 0 1 25%;
    }
  }
  &__content {
    padding: 12px;
  }
}
</style>
