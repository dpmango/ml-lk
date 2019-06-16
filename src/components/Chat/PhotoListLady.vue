<template>
  <modal
    name="chat-lady-photos"
    :adaptive="true"
    width="570"
    height="auto"
    :scrollable="true"
    @before-open="beforeOpen"
    @before-close="resetState"
  >
    <Panel :name="`Фото (${photosCount})`" noClearButton>
      <div class="modal">
        <div class="modal__filter">
          <div class="ui-radio-group">
            <label for>Отправлено:</label>
            <ui-radio
              isRed
              isNullable
              isBig
              v-model="filter.isSend"
              cbValue="0"
              name="isSend"
              label="Да"
            />
            <ui-radio
              isRed
              isNullable
              isBig
              v-model="filter.isSend"
              cbValue="1"
              name="isSend"
              label="Нет"
            />
          </div>
          <div class="ui-radio-group">
            <label for>Просмотрено:</label>
            <ui-radio
              isRed
              isNullable
              isBig
              v-model="filter.isRead"
              cbValue="0"
              name="isRead"
              label="Да"
            />
            <ui-radio
              isRed
              isNullable
              isBig
              v-model="filter.isRead"
              cbValue="1"
              name="isRead"
              label="Нет"
            />
          </div>
        </div>
        <div class="modal__content">
          <div class="photo-grid">
            <div
              class="photo"
              v-for="(photo, idx) in photosFiltered"
              :key="idx"
              :data-id="photo.ID"
            >
              <div class="photo__image">
                <img v-img :src="getImage(photo.ID)">
              </div>
              <div class="photo__content">
                <div class="photo__content-row">
                  <span>Отправлено:</span>
                  <span>{{photo.SendDate}}</span>
                </div>
                <div class="photo__content-row">
                  <span>Просмотрено:</span>
                  <span>{{photo.ReadDate}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  </modal>
</template>

<script>
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';
import UiRadio from '@/components/Shared/UI/Radio.vue';
import Panel from '@/components/Shared/Layout/Panel.vue';
import api from '@/helpers/Api';

export default {
  name: 'AddEditModal',
  components: {
    SvgIcon,
    UiRadio,
    Panel,
  },
  data() {
    return {
      filter: {
        isSend: null,
        isRead: null,
      },
      users: {},
      photos: [],
      photosBase64: [],
    };
  },
  computed: {
    currentUsers() {
      return this.$store.state.chat.currentUsers;
    },
    photosCount() {
      return this.photos.length;
    },
    photosFiltered() {
      const { isSend, isRead } = this.filter;

      const bySend = x => {
        if (isSend === '0') {
          return x.SendDate !== '0';
        } else if (isSend === '1') {
          return x.SendDate === '0';
        } else {
          return true;
        }
      };
      const byRead = x => {
        if (isRead === '0') {
          return x.ReadDate !== '0';
        } else if (isRead === '1') {
          return x.ReadDate === '0';
        } else {
          return true;
        }
      };

      return this.photos.filter(x => bySend(x) && byRead(x));
    },
  },
  methods: {
    beforeOpen(event) {
      this.users = event.params.users;
      // this.type = event.params.type;
      this.fetchApi();
    },
    fetchApi() {
      api
        .get('chats/photos', {
          params: this.users,
        })
        .then(res => {
          this.photos = res.data;
          this.getFiles();
        })
        .catch(err => {
          this.showNotification({ message: err });
        });
    },
    getImage(id) {
      return this.photosBase64.find(x => x.ID === id).img;
    },
    getFiles() {
      if (this.photos.length > 0) {
        this.photos.forEach(x => {
          this.getFile(x.Thumbnail, x.ID);
        });
      }
    },
    getFile(url, ID) {
      api
        .get(url, {
          responseType: 'arraybuffer',
        })
        .then(res => {
          const imgToBase64 = Buffer.from(res.data, 'binary').toString('base64');
          this.photosBase64.push({
            ID: ID,
            img: `data:image/png;base64, ${imgToBase64}`,
          });
        })
        .catch(err => {
          this.showNotification({ message: `File: ${err}` });
        });
    },
    resetState() {
      this.filter = {
        isSend: null,
        isRead: null,
      };
      this.users = {};
      this.photos = [];
      this.photosBase64 = [];
    },
  },
  notifications: {
    showNotification: {
      title: 'Ошибка при загрузке фото',
      type: 'error',
    },
  },
};
</script>


<style lang="scss" scoped>
@import '@/theme/utils.scss';

.modal {
  padding: 20px;
  &__filter {
    display: flex;
    flex-wrap: wrap;
  }
  &__content {
    flex: 1 1 auto;
    max-height: 100%;
    padding: 10px 0;
    &::-webkit-scrollbar {
      width: 3px;
      margin-top: 10px;
    }

    &::-webkit-scrollbar-track {
      border-left: 3px solid rgba(black, 0.2);
      margin-top: 20px;
      margin-bottom: 20px;
    }

    &::-webkit-scrollbar-thumb {
      border-left: 3px solid $colorOrange;
    }
  }
}

.ui-radio-group {
  display: flex;
  align-items: center;
  margin-right: 20px;
  &:last-child {
    margin-right: 0;
  }
  > label {
    font-size: 14px;
    margin-right: 0.5em;
  }
  .ui-radio {
    margin-right: 15px;
    &:last-child {
      margin-right: 0px;
    }
  }
}

.photo-grid {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -10px;
}

.photo {
  width: 100%;
  flex: 0 0 33.3333%;
  max-width: 33.3333%;
  padding: 10px;
  &__image {
    img {
      max-width: 100%;
    }
  }
  &__content {
    margin: 15px 0 20px;
  }
  &__content-row {
    display: flex;
    font-size: 11px;
    margin-top: 0.5em;
    color: rgba($fontColor, 0.5);
    span {
      display: inline-block;
      width: 100%;
      flex: 0 0 50%;
      max-width: 50%;
      &:nth-child(2) {
        text-align: right;
        color: $fontColor;
      }
    }
  }
}
@include r($sm) {
  .modal {
    &__filter {
    }
  }
  .photo {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
</style>
