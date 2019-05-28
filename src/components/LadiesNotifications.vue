<template>
  <div class="ladies-ntf">
    <panel-collapse name="Девушки">
      <div class="ladies-ntf__filter filter-ntf">
        <div class="filter-ntf__item">
          <label for>Онлайн для всех</label>
          <ui-switch isGreen @click="handleFilterClick" :active="filter.online"/>
        </div>
        <div class="filter-ntf__item">
          <label for>Рассылки для всех</label>
          <ui-switch isGreen @click="handleFilterClick" :active="filter.mailer"/>
        </div>
      </div>
    </panel-collapse>
  </div>
</template>

<script>
import PanelCollapse from '@/components/Shared/Layout/PanelCollapse.vue';
import UiSwitch from '@/components/Shared/UI/Switch.vue';

export default {
  name: 'LadiesNotifications',
  components: {
    PanelCollapse,
    UiSwitch,
  },
  data() {
    return {
      filter: {
        online: false,
        mailer: true,
      },
    };
  },
  methods: {
    handleFilterClick() {},
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme/utils.scss';

.ladies-ntf {
  margin-bottom: 10px;
  &__filter {
    display: flex;
    align-items: flex-start;
    padding: 17px 20px;
    border: 1px solid rgba(#d1cfda, 0.4);
  }
}
.filter-ntf {
  &__item {
    display: flex;
    align-items: center;
    margin-right: 40px;
    > label {
      margin-right: 10px;
      font-weight: 500;
      font-size: 13px;
    }
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
