<template>
  <modal name="add-translator" :adaptive="true" width="640" height="auto">
    <div class="modal">
      <div class="modal__head">
        <div class="modal__title">Добавление переводчика</div>
        <div class="modal__close" @click="$modal.hide('add-translator')">
          <svg-icon name="close" width="14" height="14"/>
        </div>
      </div>
      <div class="modal__content">
        <div class="modal__inputs">
          <div class="modal__col-50">inpout</div>
          <div class="modal__col-50">inpout</div>
          <div class="modal__col-50">inpout</div>
          <div class="modal__col-50">inpout</div>
          <div class="modal__col-50">inpout</div>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';

export default {
  name: 'AddModal',
  components: {
    SvgIcon,
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme/utils.scss';

.modal {
  padding: 20px 20px;
  &__head {
    display: flex;
    align-items: center;
  }
  &__title {
    font-weight: 500;
    font-size: 14px;
  }
  &__close {
    margin-top: -10px;
    margin-right: -10px;
    margin-left: auto;
    cursor: pointer;
    padding: 10px;
    color: rgba($fontColor, 0.4);
    transition: color 0.25s ease-in-out;
    &:hover {
      color: $colorRed;
    }
  }
  &__content {
    margin-top: 20px;
  }
  &__inputs {
    display: flex;
    flex-wrap: wrap;
    margin-left: -10px;
    margin-right: -10px;
  }
  &__col-50 {
    width: 100%;
    flex: 0 0 50%;
    max-width: 50%;
    min-width: 1px;
    min-height: 0;
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
