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
        <emoji-picker @emoji="appendEmoji" :search="search">
          <div
            class="emoji-invoker"
            slot="emoji-invoker"
            slot-scope="{ events: { click: clickEvent } }"
            @click.stop="clickEvent"
          >
            <svg-icon name="smile" width="21" height="21"/>
          </div>
          <div slot="emoji-picker" slot-scope="{ emojis, insert }">
            <div class="emoji-picker">
              <div class="emoji-picker__search">
                <input type="text" v-model="search" v-focus>
              </div>
              <div>
                <div v-for="(emojiGroup, category) in emojis" :key="category">
                  <h5>{{ category }}</h5>
                  <div class="emojis">
                    <span
                      v-for="(emoji, emojiName) in emojiGroup"
                      :key="emojiName"
                      @click="insert(emoji)"
                      :title="emojiName"
                    >{{ emoji }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </emoji-picker>
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
import EmojiPicker from 'vue-emoji-picker';

export default {
  name: 'AddMessage',
  components: {
    SvgIcon,
    UiCheckbox,
    EmojiPicker,
  },
  data() {
    return {
      textarea: '',
      enterForSubmit: false,
      search: '',
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
    appendEmoji(emoji) {
      this.textarea += emoji;
    },
  },
  directives: {
    focus: {
      inserted(el) {
        el.focus();
      },
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

.emoji-picker {
  position: absolute;
  z-index: 1;
  font-family: Montserrat;
  border: 1px solid #ccc;
  width: 15rem;
  height: 20rem;
  overflow: scroll;
  padding: 1rem;
  box-sizing: border-box;
  border-radius: 0.5rem;
  background: #fff;
  bottom: 40px;
  left: 0;
  box-shadow: 1px 1px 8px #c7dbe6;
}
.emoji-picker__search {
  display: flex;
}
.emoji-picker__search > input {
  flex: 1;
  border-radius: 10rem;
  border: 1px solid #ccc;
  padding: 0.5rem 1rem;
  outline: none;
}
.emoji-picker h5 {
  margin-bottom: 0;
  color: #b1b1b1;
  text-transform: uppercase;
  font-size: 0.8rem;
  cursor: default;
}
.emoji-picker .emojis {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.emoji-picker .emojis:after {
  content: '';
  flex: auto;
}
.emoji-picker .emojis span {
  padding: 0.2rem;
  cursor: pointer;
  border-radius: 5px;
}
.emoji-picker .emojis span:hover {
  background: #ececec;
  cursor: pointer;
}
</style>
