<template>
  <div class="add-message">
    <template v-if="storeData.Chat_enable">
      <div class="add-message__textarea">
        <textarea
          name="add-message"
          id="add-message"
          rows="5"
          v-model="textarea"
          @input="typingDebounce"
          @keydown="handleKeyDown"
        ></textarea>
      </div>
      <div class="add-message__actions">
        <div class="add-message__enter-to-submit">
          <ui-checkbox
            @input="changeEnterSubmit"
            :value="enterForSubmit"
            name="enterForSubmit"
            label="Нажать Enter для отправки"
          />
        </div>
        <div @click="openLadiesModal" class="add-message__cta add-message__cta--image">
          <svg-icon name="image" width="18" height="18" />
        </div>
        <div class="add-message__cta add-message__cta--smile">
          <emoji-picker @emoji="appendEmoji" :emojiTable="emojiTable">
            <div
              class="emoji-invoker"
              slot="emoji-invoker"
              slot-scope="{ events: { click: clickEvent } }"
              @click.stop="clickEvent"
            >
              <svg-icon name="smile" width="21" height="21" />
            </div>
            <div slot="emoji-picker" slot-scope="{ emojis, insert }">
              <div class="emoji-picker">
                <div>
                  <div v-for="(emojiGroup, category) in emojis" :key="category">
                    <div class="emojis">
                      <span
                        v-for="(emojiCode, emojiName) in emojiGroup"
                        :key="emojiName"
                        @click="insert(emojiCode)"
                        :title="emojiName"
                      >
                        <img
                          class="emoji"
                          :src="`https://marmeladies.com//media/images/smiles/emoji/${emojiCode}.gif`"
                          alt
                          title
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </emoji-picker>
        </div>

        <button class="add-message__send-btn" type="button" @click="handleSubmit">
          <span>Отправить</span>
          <svg-icon name="send" width="16" height="16" />
        </button>
        <div
          class="add-message__cta add-message__cta--finish"
          title="Завершить чат"
          @click="$emit('finishChat')"
          v-if="storeData.Open_chat"
        >
          <svg-icon name="exit-chat" width="18" height="18" />
        </div>
      </div>
    </template>
    <template v-if="!storeData.Chat_enable">
      <div class="add-message__disabled">{{storeData.Chat_reason}}</div>
    </template>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';
import UiCheckbox from '@/components/Shared/UI/Checkbox.vue';
import EmojiPicker from 'vue-emoji-picker';
import emojiTable from '@/data/emojis.js';
import api from '@/helpers/Api';

export default {
  name: 'AddMessage',
  components: {
    SvgIcon,
    UiCheckbox,
    EmojiPicker,
  },
  props: {},
  data() {
    return {
      emojiTable,
      textarea: '',
    };
  },
  created() {
    this.typingDebounce = debounce(this.typingNotification, 10000, {
      leading: true,
      trailing: false,
    });
  },
  computed: {
    currentUsers() {
      return this.$store.state.chat.currentUsers;
    },
    storeData() {
      return this.$store.getters.selectInfoByUsers(this.currentUsers);
    },
    enterForSubmit() {
      return this.$store.state.chat.enterForSubmit;
    },
  },
  methods: {
    handleKeyDown(e) {
      this.typingDebounce();
      if (e.keyCode === 13 && this.enterForSubmit) {
        e.preventDefault();

        this.handleSubmit();
      }
    },
    changeEnterSubmit() {
      this.$store.commit('TOGGLE_ENTER_TO_SUBMIT');
    },
    handleSubmit() {
      this.$emit('addMessage', { text: this.textarea });
      this.textarea = ''; // reset state
    },
    appendEmoji(emoji) {
      const eSymbol = String.fromCodePoint(emoji);
      this.textarea += eSymbol;
    },
    typingNotification() {
      this.$emit('sendTypingNotification');
    },
    openLadiesModal() {
      this.$modal.show('chat-lady-photos', {
        users: this.currentUsers,
      });
      // this.$emit('addFile', this.$refs.file.files[0]);
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
  min-height: 100px;
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
    position: relative;
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
    &--finish {
      margin-left: 10px;
    }
    &:hover {
      background: $colorPrimary;
      color: white;
    }
  }
  &__file-container {
    input {
      position: absolute;
      top: 0;
      left: 0;
      width: 0.1px;
      height: 0.1px;
      opacity: 0;
      pointer-events: none;
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
  &__disabled {
    font-size: 14px;
    text-align: center;
    padding: 0.5em 0 1em;
    color: rgba($fontColor, 0.6);
  }
}

.emoji-picker {
  position: absolute;
  z-index: 1;
  font-family: Montserrat;
  border: 1px solid #ccc;
  width: 15rem;
  height: 15rem;
  overflow: scroll;
  padding: 1rem;
  box-sizing: border-box;
  border-radius: 0.5rem;
  background: #fff;
  bottom: 40px;
  left: 0;
  box-shadow: 1px 1px 8px #c7dbe6;
}
.emoji-picker .emojis {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.emoji-picker .emojis span {
  padding: 0.3rem 0.2rem;
  font-size: 0px;
  cursor: pointer;
  border-radius: 5px;
}
.emoji-picker .emojis span:hover {
  background: #ececec;
  cursor: pointer;
}
.emoji {
  width: 24px;
  height: 24px;
}
@include r($md) {
  .add-message {
    &__actions {
      margin-top: 10px;
      flex-wrap: wrap;
      min-height: 48px;
    }
    &__enter-to-submit {
      display: none;
    }
    &__cta {
      &--image {
        margin-left: 0;
      }
    }
  }
}
@include r($sm) {
  .add-message {
    padding: 15px 20px;
  }
}
@include r(375) {
  .add-message {
    &__cta {
      &--finish {
        display: none;
      }
    }
    &__send-btn {
      margin-left: auto;
    }
  }
}
</style>
