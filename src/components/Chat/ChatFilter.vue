<template>
  <div class="chat-filter">
    <div class="chat-filter__label">Показать:</div>
    <ui-radio v-model="filter.checkbox" cbValue="0" name="messagesFilter" label="Все"/>
    <ui-radio v-model="filter.checkbox" cbValue="1" name="messagesFilter" label="Избранные"/>
    <ui-radio v-model="filter.checkbox" cbValue="2" name="messagesFilter" label="Фотографии"/>
    <ui-radio v-model="filter.checkbox" cbValue="3" name="messagesFilter" label="За период"/>
    <span class="chat-filter__calendar" v-if="shouldShowCalendar">
      <svg-icon name="calendar" width="24" height="24"/>
      <v-date-picker mode="range" show-caps v-model="filter.dates">
        <div :type="inputState.type" slot-scope="props">
          <input
            type="text"
            :value="props.inputValue"
            @change.native="props.updateValue($event.target.value)"
          >
        </div>
      </v-date-picker>
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
  props: {
    filter: {
      checkbox: String,
      dates: ['start', 'end'],
    },
  },
  computed: {
    shouldShowCalendar() {
      return this.filter.checkbox === '3';
    },
    inputState() {
      if (!this.filter.dates.start) {
        return {
          type: 'is-danger',
          message: 'Date required.',
        };
      }
      return {
        type: 'is-primary',
        message: '',
      };
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
    position: relative;
    flex: 0 0 auto;
    margin-left: 10px;
    .popover-container {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      input {
        width: 100% !important;
        opacity: 0;
      }
    }
  }
}
@include r($sm) {
  .chat-filter {
    margin-top: 0;
  }
}
</style>
