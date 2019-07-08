<template>
  <div class="add-message">
    <div class="add-message__textarea">
      <textarea
        name="sent-invite-message"
        id="sent-invite-message"
        rows="6"
        placeholder="Текст сообщения"
        @input="handleInput"
        :value="textarea"
      ></textarea>
    </div>
    <div class="add-message__actions">
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
    </div>
  </div>
</template>

<script>
import EmojiPicker from 'vue-emoji-picker';
import emojiTable from '@/data/emojis.js';
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';

export default {
  name: 'AddInvite',
  components: {
    SvgIcon,
    EmojiPicker,
  },
  data() {
    return {
      emojiTable,
    };
  },
  props: {
    textarea: String,
  },
  methods: {
    handleInput(e) {
      this.$emit('update:textarea', e.target.value);
    },
    handleSubmit() {
      this.$emit('sentInvite');
      // this.textarea = ''; // reset state
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
    justify-content: flex-end;
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
</style>
