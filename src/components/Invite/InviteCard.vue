<template>
  <div
    class="invite-card"
    :data-id="data.ID"
    :class="{'is-selected': isSelected, 'is-smaller': isSmaller}"
    @click="$emit('onSelect', data.ID)"
  >
    <Avatar
      :size="!isSmaller ? 70 : 50"
      :Thumbnail="data.Thumbnail"
      :RealName="data.RealName"
      :Online="data.Online"
    />
    <div class="invite-card__content">
      <a
        class="invite-card__name"
        :href="outProfileLink"
        target="_blank"
        @click.stop
      >{{data.RealName}}</a>
      <div class="invite-card__country">{{data.Country}}</div>
    </div>
    <div class="invite-card__checkbox">
      <ui-checkbox yellow withCheckmark :value="isSelected" :name=" 'inviteSelected_' + data.ID" />
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
  props: {
    data: {
      ID: String,
      RealName: String,
      Age: Number,
      Country: String,
      Thumbnail: String,
      Online: String,
    },
    isSelected: Boolean,
    isSmaller: Boolean,
  },
  computed: {
    outProfileLink() {
      return `https://marmeladies.com/profile.php?ID=${this.data.ID}`;
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
  cursor: pointer;
  transition: background-color 0.25s ease, border-color 0.25s ease;
  &__content {
    flex: 1 1 auto;
    min-width: 1px;
    margin-left: 10px;
    padding-right: 20px;
  }
  &__name {
    font-size: 14px;
    line-height: 18px;
    // overflow: hidden;
    text-overflow: ellipsis;
    // white-space: nowrap;
    display: block;
    transition: color 0.25s ease;
    &:hover {
      color: $colorPrimary;
    }
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
    pointer-events: none;
    transform: translateY(-50%);
  }
  &.is-selected {
    background-color: white;
    border-color: $colorOrange;
    box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.08);
  }
  &.is-smaller {
    padding: 12px 10px;
  }
  &:hover {
    background-color: white;
    border-color: $colorBg;
  }
}
</style>
