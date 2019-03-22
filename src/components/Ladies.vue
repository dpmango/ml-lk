<template>
  <Panel name="Девушки">
    <div class="table">
      <div class="table__head">
        <div class="table__cell table__cell--name">Девушки</div>
        <div class="table__cell table__cell--name">Переводчик</div>
      </div>
      <div class="table__content">
        <Lady v-for="(lady, idx) in ladies" :key="idx" :lady="lady"/>
      </div>
    </div>
  </Panel>
</template>

<script>
import Panel from '@/components/Shared/Layout/Panel.vue';
import Lady from '@/components/Ladies/Lady.vue';
import api from '@/helpers/Api';

export default {
  name: 'Ladies',
  components: {
    Panel,
    Lady,
  },
  data() {
    return {
      ladies: null,
    };
  },
  mounted() {
    api.get('ladies').then(response => {
      this.ladies = response.data;
    });
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
    &--name {
      flex: 0 1 50%;
    }
  }
  &__content {
    flex: 0 1 auto;
    max-height: 100%;
    overflow-y: scroll;
    padding: 20px;
  }
}
</style>
