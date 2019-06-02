<template>
  <div class="chat-filter">
    <div class="chat-filter__label">Показать:</div>
    <ui-radio v-model="filter.checkbox" cbValue="0" name="messagesFilter" label="Все"/>
    <ui-radio v-model="filter.checkbox" cbValue="1" name="messagesFilter" label="Избранные"/>
    <ui-radio v-model="filter.checkbox" cbValue="2" name="messagesFilter" label="Фотографии"/>
    <ui-radio v-model="filter.checkbox" cbValue="3" name="messagesFilter" label="За период"/>
    <span class="chat-filter__calendar" v-if="shouldShowCalendar">
      <svg-icon name="calendar" width="24" height="24"/>
    </span>
  </div>
</template>

<script>
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';
import UiRadio from '@/components/Shared/UI/Radio.vue';

export default {
  name: 'ChatFilter',
  components: {
    SvgIcon,
    UiRadio,
  },
  data() {
    return {
      filter: {
        checkbox: '0',
        date_1: null,
        date_2: null,
      },
    };
  },
  computed: {
    shouldShowCalendar() {
      return this.filter.checkbox === '3';
    },
  },
  methods: {
    filterToParams(filter) {
      let result = {};

      if (filter.checkbox !== '0') {
        result.filter = filter.checkbox;
      }
      if (filter.checkbox === '3') {
        result.date_1 = this.date_1;
        result.date_2 = this.date_2;
      }
      return result;
    },
  },
  watch: {
    filter: {
      handler(Old, New) {
        this.$emit('update', this.filterToParams(New));
      },
      deep: true,
    },
  },
};
</script>



<style lang="scss" scoped>
@import '@/theme/utils.scss';

.chat-filter {
  flex: 0 0 auto;
  margin: 10px 0;
  padding: 2px 12px;
  background: #ffffff;
  border-radius: 2px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  &__label {
    font-weight: 500;
    font-size: 13px;
    margin-right: 20px;
  }
  .ui-radio {
    margin-right: 25px;
    &:last-of-type {
      margin-right: 0;
    }
  }
  &__calendar {
    flex: 0 0 auto;
    margin-left: 10px;
  }
}
</style>
