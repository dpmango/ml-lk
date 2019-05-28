<template>
  <div class="add-message">
    <div class="add-message__textarea">
      <textarea
        name="add-message"
        id="add-message"
        rows="5"
        v-model="textarea"
        @keydown="handleKeyDown"
      ></textarea>
    </div>
    <div class="add-message__actions">
      <div class="add-message__enter-to-submit">
        <ui-checkbox
          v-model="enterForSubmit"
          name="enterForSubmit"
          label="Нажать Enter для отправки"
        />
      </div>
      <div class="add-message__cta add-message__cta--image">
        <svg-icon name="image" width="18" height="18"/>
      </div>
      <div class="add-message__cta add-message__cta--smile">
        <svg-icon name="smile" width="21" height="21"/>
      </div>

      <button class="add-message__send-btn" type="button" @click="handleSubmit">
        <span>Отправить</span>
        <svg-icon name="send" width="16" height="16"/>
      </button>
    </div>
  </div>
</template>

<script>
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';
import UiCheckbox from '@/components/Shared/UI/Checkbox.vue';

export default {
  name: 'AddMessage',
  components: {
    SvgIcon,
    UiCheckbox,
  },
  data() {
    return {
      textarea: '',
      enterForSubmit: false,
    };
  },
  methods: {
    handleKeyDown(e) {
      if (e.keyCode === 13 && this.enterForSubmit) {
        e.preventDefault();

        this.handleSubmit();
      }
    },
    handleSubmit() {
      this.$emit('addMessage', this.textarea);
      this.textarea = ''; // reset state
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme/utils.scss';
.add-message {
  padding: 20px;
  border-top: 1px solid #d1cfda;
  &__textarea {
    textarea {
      -webkit-appearance: none;
      display: block;
      width: 100%;
      padding: 6px 13px;
      background: #ffffff;
      border: 1px solid rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      font-size: 14px;
      color: $fontColor;
      resize: none;
      transition: border 0.25s ease-in-out, box-shadow 0.25s ease-in-out;
      &::placeholder {
        color: rgba($fontColor, 0.4);
      }
      &:focus {
        // border-color: $colorPrimary;
        box-shadow: 0px 8px 6px rgba(0, 0, 0, 0.14);
      }
      &[disabled] {
        background: rgba(0, 0, 0, 0.1);
      }
    }
  }
  &__actions {
    margin-top: 20px;
    display: flex;
    align-items: center;
  }
  &__enter-to-submit {
    background: #ffffff;
    border: 1px solid $colorBg;
    box-sizing: border-box;
    border-radius: 10px;
    padding: 8px 10px;
  }
  &__cta {
    position: relative;
    z-index: 1;
    flex: 0 0 auto;
    margin-right: 10px;
    min-height: 34px;
    min-width: 34px;
    background: $colorBg;
    border-radius: 50%;
    transition: 0.25s ease;
    cursor: pointer;
    color: #9893ab;
    .svg-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    &--image {
      margin-left: auto;
    }
    &--smile {
    }
    &:hover {
      background: $colorPrimary;
      color: white;
    }
  }
  &__send-btn {
    position: relative;
    z-index: 1;
    flex: 0 0 auto;
    padding: 10px 55px;
    background: transparent;
    border: 2px solid $colorOrange;
    border-radius: 30px;
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;
    align-items: center;
    text-align: center;
    box-shadow: none;
    transition: 0.25s ease;
    .svg-icon {
      color: $colorOrange;
      position: absolute;
      top: 50%;
      right: 15px;
      transform: translateY(-50%);
      transition: color 0.25s ease;
    }
    &:hover {
      background: $colorOrange;
      color: white;
      .svg-icon {
        color: white;
      }
    }
  }
}
</style>
