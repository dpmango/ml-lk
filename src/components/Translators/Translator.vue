<template>
  <div class="translator" :class="{'is-removed': isRemoved}" :data-id="translator.ID">
    <div class="translator__name">{{fullName}}</div>
    <div class="translator__activities">
      <div class="translator__activity" v-tooltip.bottom-start="'Письма'">
        <svg-icon name="mail" width="16" height="12"/>
        <span>
          {{translator.Stat11}}/{{translator.Stat12}}
          <span class="stats-space"></span>
          {{translator.Stat13}}/{{translator.Stat14}}
        </span>
      </div>
      <div class="translator__activity" v-tooltip.bottom-start="'Подарки'">
        <svg-icon name="chat" width="19" height="16"/>
        <span>{{translator.Stat21}}/{{translator.Stat22}}</span>
      </div>
      <div class="translator__activity" v-tooltip.bottom-start="'Чаты'">
        <svg-icon name="gift" width="16" height="16"/>
        <span>{{translator.Stat31}}/{{translator.Stat32}}/{{translator.Stat33}}</span>
      </div>
    </div>
    <div class="translator__count" @click="handleLadiesClick">
      <span>{{translator.LadiesCount}}</span>
    </div>
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
      Stat11: String,
      Stat12: String,
      Stat13: String,
      Stat14: String,
      Stat21: String,
      Stat22: String,
      Stat31: String,
      Stat32: String,
      Stat33: String,
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
      this.$modal.show('add-translator', {
        type: 'edit',
        translatorID: this.translator.ID,
      });
    },
    handleRemoveClick() {
      this.$modal.show('remove-translator', {
        name: this.fullName,
        id: this.translator.ID,
        removalDate: this.translator.RemovalDate,
        removalReason: this.translator.RemovalReason,
      });
    },
    handleLadiesClick() {
      this.$modal.show('attach-ladies-translator', {
        name: this.fullName,
        id: this.translator.ID,
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
    margin-left: -5px;
    margin-right: -5px;
  }
  &__activity {
    display: flex;
    align-items: center;
    padding-left: 5px;
    padding-right: 5px;
    font-size: 14px;
    .svg-icon {
      flex: 0 0 auto;
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
    font-size: 14px;
    text-align: center;
    cursor: pointer;
    span{
      display: inline-block;
      position: relative;
      transition: color .25s ease-in-out;
      &::after{
        display: inline-block;
        content: ' ';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: $fontColor;
        transition: right .25s ease-in-out;
      }
    }
    &:hover{
      span{
        color: $colorPrimary;
        &::after{
          right: 100%;
        }
      }
    }
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
      &__name, &__activities, &__block{
        pointer-events: none;
      }
      &__name, &__activities, &__count{
        opacity: 0.5;
      }
      &__block{
        opacity: 0.5;
        pointer-events: none;
        filter: grayscale(1)
      }
    }
  }

  .stats-space{
    display: inline-block;
    min-width: 15px;
  }
}

@include r($md) {
  .translator{
    flex-wrap: wrap;
    min-height: auto;
    padding: 10px 0;
    border-bottom: 1px solid rgba(#d1cfda, 0.8);
    &:last-child{
      border-bottom: 0;
    }
    &__name {
      // 220px
      order: 1;
      font-weight: 500;
      flex: 0 0 160px;
    }
    &__activities {
      order: 5;
      margin-top: 5px;
      flex-basis: 100%;
      justify-content: flex-start;
    }
    &__activity{
      margin-right: 25px;
    }
    &__count {
      order: 2;
      flex: 0 0 75px;
    }
    &__block {
      order: 3;
      flex: 0 0 75px;
      margin-left: 0;
    }
    &__actions {
      order: 4;
      flex: 0 0 55px;
    }
  }
}
@include r($smx){
  .translator{
    &__name{
      flex-basis: 100%;
      padding-right: 0;
    }
    &__activities{
      order: 2;
      margin-top: 10px;
      margin-bottom: 3px;
    }
    &__count{
      margin-left: 0;
      padding-left: 0;
      flex-basis: 50px;
      text-align: left;
    }
    &__block{
      flex-basis: 34px;
      margin-right: 30px;
      margin-left: auto;
    }
  }
}
</style>
