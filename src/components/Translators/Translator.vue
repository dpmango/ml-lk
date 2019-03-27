<template>
  <div class="translator" :class="{'is-removed': isRemoved}" :data-id="translator.ID">
    <div class="translator__name">{{fullName}}</div>
    <div class="translator__activities">
      <div class="translator__activity">
        <svg-icon name="mail" width="16" height="12"/>
        <span>0/0 0/0</span>
      </div>
      <div class="translator__activity">
        <svg-icon name="gift" width="16" height="16"/>
        <span>0/0/0</span>
      </div>
      <div class="translator__activity">
        <svg-icon name="chat" width="19" height="16"/>
        <span>0/0/0</span>
      </div>
    </div>
    <div class="translator__count">{{translator.LadiesCount}}</div>
    <div class="translator__block">
      <ui-switch @click="handleBlockClick" :active="isBlocked"/>
    </div>
    <div class="translator__actions">
      <div @click="handleEditClick" class="translator__edit">
        <svg-icon name="edit" width="14" height="14"/>
      </div>
      <div @click="handleRemoveClick" class="translator__remove">
        <svg-icon name="close" width="14" height="14"/>
      </div>
    </div>
  </div>
</template>


<script>
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';
import UiSwitch from '@/components/Shared/UI/Switch.vue';

export default {
  name: 'Translator',
  components: {
    SvgIcon,
    UiSwitch,
  },
  props: {
    translator: {
      ID: String,
      NickName: String,
      FirstName: String,
      LastName: String,
      Notes: String,
      Status: Number,
      BlockDate: String,
      BlockReason: String,
      RemovalDate: String,
      RemovalReason: String,
      LadiesCount: String,
    },
  },
  computed: {
    fullName() {
      return `${this.translator.FirstName} ${this.translator.LastName}`;
    },
    isBlocked() {
      return this.translator.BlockDate !== '0';
    },
    isRemoved() {
      return this.translator.RemovalDate !== '0';
    },
  },
  methods: {
    handleBlockClick() {
      this.$modal.show('block-translator', {
        name: this.fullName,
        id: this.translator.ID,
        blockDate: this.translator.BlockDate,
        blockReason: this.translator.BlockReason,
      });
    },
    handleEditClick() {
      console.log('edit click');
    },
    handleRemoveClick() {
      this.$modal.show('remove-translator', {
        name: this.fullName,
        id: this.translator.ID,
        removalDate: this.translator.RemovalDate,
        removalReason: this.translator.RemovalReason,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme/utils.scss';

.translator {
  min-height: 48px;
  display: flex;
  align-items: center;
  &__name {
    // 220px
    flex: 0 0 25%;
    padding-right: 12px;
    color: rgba($fontColor, 0.8);
    font-size: 14px;
  }
  &__activities {
    // 290px
    flex: 0 0 34%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__activity {
    display: flex;
    align-items: center;
    .svg-icon {
      margin-right: 5px;
      margin-bottom: 0;
    }
    span {
      display: inline-block;
    }
  }
  &__count {
    flex: 0 0 12%;
    margin-left: auto;
    padding-left: 12px;
    padding-right: 12px;
    text-align: center;
  }
  &__block {
    flex: 0 0 75px;
    margin-left: 35px;
    display: flex;
    justify-content: center;
    text-align: center;
  }
  &__actions {
    flex: 0 0 55px;
    display: flex;
    align-items: center;
  }
  &__edit {
    color: #a5a5a5;
    padding: 10px 6px;
    cursor: pointer;
    transition: color 0.25s ease-in-out;
    &:hover {
      color: $colorPrimary;
    }
  }
  &__remove {
    color: #a5a5a5;
    padding: 10px 6px;
    cursor: pointer;
    transition: color 0.25s ease-in-out;
    &:hover {
      color: $colorRed;
    }
  }
  // modifiers
  &.is-removed{
    .translator{
      &__name, &__activities, &__count{
        opacity: 0.5;
      }
    }
  }
}
</style>
