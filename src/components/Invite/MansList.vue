<template>
  <div class="mans panel" v-if="forLady">
    <div class="panel__head panel-head">
      <div class="panel-head__icon">
        <div class="icon-circle">
          <svg-icon name="filter" width="13" height="15"/>
        </div>
      </div>
      <div class="panel-head__name">Мужчины</div>
      <div class="panel-head__action">
        <ui-checkbox
          @input="checkAll"
          v-model="filter.allChecked"
          name="allChecked"
          label="Отметить всех"
          bigFont
        />
      </div>
    </div>
    <div class="panel__content">
      <UiNotification v-if="errorMessage" type="danger">{{errorMessage}}</UiNotification>
      <div class="mans__grid">
        <div v-for="(man, idx) in mansMinus8" :key="idx" class="mans__col">
          <invite-card
            @onSelect="onManSelect"
            :isSelected="selectedMans.indexOf(man.ID) !== -1"
            isSmaller
            :data="man"
          />
        </div>
      </div>
      <div class="mans__grid">
        <div class="mans__col mans__col--restcards">
          <div class="mans__grid">
            <div v-for="(man, idx) in mansRest8" :key="idx" class="mans__col mans__col--collumned">
              <invite-card
                @onSelect="onManSelect"
                :isSelected="selectedMans.indexOf(man.ID) !== -1"
                isSmaller
                :data="man"
              />
            </div>
          </div>
        </div>
        <div class="mans__col mans__col--textarea">
          <div class="add-message__textarea">
            <textarea
              name="sent-invite-message"
              id="sent-invite-message"
              rows="6"
              placeholder="Текст сообщения"
              v-model="textarea"
            ></textarea>
          </div>
          <div class="add-message__actions">
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
      </div>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import EmojiPicker from 'vue-emoji-picker';
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';
import UiCheckbox from '@/components/Shared/UI/Checkbox.vue';
import UiNotification from '@/components/Shared/UI/Notification.vue';
import InviteCard from '@/components/Invite/InviteCard.vue';
import Plurize from '@/helpers/Plurize';
import api from '@/helpers/Api';

const defaultFilterState = {
  allChecked: false,
};

export default {
  name: 'MansList',
  components: {
    SvgIcon,
    EmojiPicker,
    UiCheckbox,
    UiNotification,
    InviteCard,
  },
  data() {
    return {
      filter: cloneDeep(defaultFilterState),
      mans: [],
      selectedMans: [],
      errorMessage: '',
      textarea: '',
      search: '',
    };
  },
  props: {
    forLady: String,
  },
  mounted() {
    this.fetchApi();
  },
  computed: {
    mansMinus8() {
      return this.mans.slice(0, this.mans.length - 9);
    },
    mansRest8() {
      return this.mans.slice(this.mans.length - 8, this.mans.length);
      // return this.mans.slice(this.mans.length - 9, this.mans.length);
    },
  },
  methods: {
    filterToParams() {
      // let filterString = '';
      // let ladiesFilter = '';
      // if (this.filter.marked) {
      //   filterString = '1';
      // }
      // if (this.filter.new) {
      //   filterString = filterString.length > 0 ? `${filterString},2` : '2';
      // }
      // if (this.filter.maleOnline) {
      //   filterString = filterString.length > 0 ? `${filterString},3` : '3';
      // }

      // if (this.filter.ladies.length > 0) {
      //   ladiesFilter = this.filter.ladies.join(',');
      // }

      // filter = 1 (отправить приглашение):
      // lady – ID девушки
      // age_1 и age_2 – интервал «Возраст»
      // height_1 и height_2 – интервал «Рост»
      // weight_1 и weight_2 – интервал «Вес»
      // hair – цвет волос (список ID через запятую)
      // eye – цвет глаз (список ID через запятую)
      // marital – семейное положение (список ID через запятую)
      // education – образование (список ID через запятую)
      // country – страна (список кодов через запятую)
      // city - город
      // id – ID мужчины
      // children – дети – 1:есть;2:нет
      // photo – фото - 1:есть;2:нет

      return {
        filter: 1,
        lady: this.forLady,
      };
    },
    fetchApi() {
      if (!this.forLady) {
        return;
      }
      api
        .get('mens', {
          params: this.filterToParams(),
        })
        .then(res => {
          this.errorMessage = '';
          this.mans = res.data;
        })
        .catch(err => {
          this.errorMessage = err;
        });
    },
    requestNextMans(count) {
      alert(`requesting next mans - count ${count}`);
    },
    onManSelect(id) {
      if (this.selectedMans.indexOf(id) !== -1) {
        this.selectedMans = this.selectedMans.filter(x => x !== id);
      } else {
        this.selectedMans.push(id);
      }
    },
    checkAll() {
      // triggered when Check all is changed
      console.log(this.filter.allChecked);
    },
    clearFilter() {
      this.filter = cloneDeep(defaultFilterState);
      this.fetchApi();
    },
    handleSubmit() {
      console.log(this.textarea);
      api
        .post('chats/sendinvitations', {
          lady: this.forLady,
          men: this.selectedMans.join(','),
          text: this.textarea,
        })
        .then(res => {
          const apiData = res.data[0];
          if (apiData.success) {
            // reset state
            this.errorMessage = '';
            this.textarea = '';
            this.showNotification({
              title: '',
              message: `Отправлено ${this.selectedMans.length} ${Plurize(
                this.selectedMans.length,
                'приглашение',
                'приглашения',
                'приглашений',
              )}`,
            });
            this.mans = [];
            this.selectedMans = [];
            this.requestNextMans(apiData.count);
          } else {
            this.showNotification({ title: options.errTitle, message: apiData.message });
          }
        })
        .catch(err => {
          this.errorMessage = err;
          this.showNotification({ title: options.errTitle, message: error });
        });
    },
    appendEmoji(emoji) {
      this.textarea += emoji;
    },
  },
  watch: {
    forLady() {
      this.fetchApi();
    },
  },
  directives: {
    focus: {
      inserted(el) {
        el.focus();
      },
    },
  },
  notifications: {
    showNotification: {
      title: 'Ошибка',
      type: 'error',
    },
  },
};
</script>


<style lang="scss" scoped>
@import '@/theme/utils.scss';

.icon-circle {
  display: block;
  width: 30px;
  height: 30px;
  background: #d1cfda;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0;
  transition: background 0.25s ease, opacity 0.25s ease;
}

.panel {
  background: #ffffff;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.08);
  &__head {
    flex: 0 0 auto;
    background: white;
    border-bottom: 1px solid rgba(#d1cfda, 0.4);
  }
  &__content {
    padding: 20px;
  }
  &.is-filter-active {
    .panel-head__icon {
      .icon-circle {
        background-color: $colorPrimary;
      }
    }
  }
}

.panel-head {
  display: flex;
  align-items: center;
  min-height: 40px;
  padding: 5px 15px 5px 20px;
  &__icon {
    flex: 0 0 auto;
  }
  &__name {
    flex: 0 1 auto;
    padding-left: 20px;
    font-size: 16px;
  }
  &__action {
    flex: 0 0 auto;
    margin-left: auto;
    &:hover {
    }
  }
}

.mans {
  position: relative;
  margin-top: 10px;
  &__grid {
    display: flex;
    flex-wrap: wrap;
    margin: -10px;
  }
  &__col {
    width: 100%;
    flex: 0 0 16.6666%;
    max-width: 16.6666%;
    min-width: 1px;
    min-height: 0px;
    padding: 10px;
    &--collumned {
      flex-basis: 25%;
      max-width: 25%;
    }
    &--restcards {
      flex-basis: 66.6666%;
      max-width: 66.6666%;
    }
    &--textarea {
      flex-basis: 33.3333%;
      max-width: 33.3333%;
    }
  }
  // &__loader {
  //   position: absolute;
  //   bottom: 10px;
  //   z-index: 3;
  //   left: 50%;
  //   transform: translateX(-50%);
  // }
}

@include r($xl) {
  .panel {
    height: auto;
    max-height: calc(100vh - 80px - 40px);
  }
}
@include r($sm) {
  .panel-head {
    flex-wrap: wrap;
    &__icon {
      flex-basis: auto;
    }
    &__name {
      padding-left: 20px;
    }
  }
}

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

