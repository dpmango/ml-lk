<template>
  <div class="ntf-lady">
    <Avatar :Thumbnail="data.Thumbnail" :RealName="data.RealName"/>
    <div class="ntf-lady__content">
      <div class="ntf-lady__name">{{data.RealName}}, {{age}}</div>
      <div class="ntf-lady__country">{{data.City}}, {{data.Country}}</div>
    </div>
    <div class="ntf-lady__actions">
      <div class="ntf-lady__toggle">
        <ui-switch isGreen @click="handleFilterClick('Online')" :active="isOnline"/>
      </div>
      <div class="ntf-lady__toggle">
        <ui-switch isGreen @click="handleFilterClick('Invitation')" :active="isInvitation"/>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from '@/components/Users/Avatar.vue';
import UiSwitch from '@/components/Shared/UI/Switch.vue';
import { dateToAge } from '@/helpers/Dates';

export default {
  name: 'LadyNtfCard',
  components: {
    Avatar,
    UiSwitch,
  },
  data() {
    return {
      Online: this.data.Online,
      Invitation: this.data.Invitation,
    };
  },
  props: {
    data: {
      ID: String,
      NickName: String,
      RealName: String,
      LastName: String,
      DateOfBirth: String,
      City: String,
      Country: String,
      LastReg: String,
      Status: Number,
      Thumbnail: String,
      Online: String,
      Invitation: String,
      Translator: {
        ID: String,
        FirstName: String,
        LastName: String,
      },
    },
  },
  computed: {
    age() {
      return dateToAge(this.data.DateOfBirth);
    },
    isOnline() {
      return this.Online === '1';
    },
    isInvitation() {
      return this.Invitation === '1';
    },
  },
  methods: {
    handleFilterClick(name) {
      this[name] = this[name] === '1' ? '0' : '1';
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme/utils.scss';
.ntf-lady {
  display: flex;
  align-items: center;
  min-width: 1px;
  &__content {
    flex: 1 1 auto;
    margin-left: 10px;
  }
  &__name {
    font-size: 14px;
    line-height: 18px;
  }
  &__country {
    margin-top: 0.5em;
    font-size: 11px;
    color: rgba($fontColor, 0.6);
  }
  &__actions {
    display: flex;
    flex: 0 0 auto;
    margin-left: auto;
    padding-left: 10px;
    min-width: 1px;
  }
  &__toggle {
    width: 70px;
    display: flex;
    justify-content: center;
    flex: 0 0 auto;
    min-width: 1px;
  }
}
</style>
