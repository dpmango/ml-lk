<template>
  <div class="invite-card" :class="{'is-selected': isSelected}">
    <Avatar :size="70" :Thumbnail="data.Thumbnail" :RealName="data.RealName" :Online="data.Online"/>
    <div class="invite-card__content">
      <div class="invite-card__name">{{data.RealName}}</div>
      <div class="invite-card__country">{{data.Country}}</div>
    </div>
    <div class="invite-card__checkbox">
      <ui-checkbox yellow withCheckmark v-model="isSelected" :name=" 'inviteSelected_' + data.ID"/>
    </div>
  </div>
</template>

<script>
import Avatar from '@/components/Users/Avatar.vue';
import UiCheckbox from '@/components/Shared/UI/Checkbox.vue';

export default {
  name: 'InviteCard',
  components: {
    Avatar,
    UiCheckbox,
  },
  data() {
    return {
      isSelected: false,
    };
  },
  props: {
    data: {
      ID: String,
      RealName: String,
      Age: Number,
      Country: String,
      Thumbnail: String,
      Online: String,
    },
  },
  methods: {
    select() {
      this.isSelected = !this.isSelected;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme/utils.scss';

.invite-card {
  position: relative;
  background: $colorBg;
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 15px 12px;
  border: 1px solid transparent;
  transition: background-color 0.25s ease, border-color 0.25s ease;
  &__content {
    width: 100%;
    margin-left: 10px;
    padding-right: 20px;
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
  &__checkbox {
    position: absolute;
    top: 50%;
    right: 0px;
    transform: translateY(-50%);
  }
  &.is-selected {
    background-color: white;
    border-color: $colorOrange;
    box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.08);
  }
  &:hover {
    background-color: white;
    border-color: $colorBg;
  }
}
</style>
