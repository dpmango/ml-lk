<template>
  <div class="relation" :data-id="data.ID" @click="readNotification">
    <div class="relation__wrapper">
      <div class="relation__user relation__user--left">
        <user-relation
          :ID="data.Man.ID"
          :RealName="data.Man.RealName"
          :Age="data.Man.Age"
          :Country="data.Man.Country"
          :Online="data.Man.Online"
          :Thumbnail="data.Man.Thumbnail"
        />
      </div>
      <div class="relation__separator">
        <svg-icon name="relationSeparator" width="16" height="16"/>
      </div>
      <div class="relation__user relation__user--right">
        <user-relation
          :ID="data.Lady.ID"
          :RealName="data.Lady.RealName"
          :Age="data.Lady.Age"
          :Online="data.Lady.Online"
          :Thumbnail="data.Lady.Thumbnail"
        />
      </div>
    </div>
    <div class="relation__info">
      <div class="relation__date">{{timeStamp}}</div>
      <div class="relation__message">{{data.Message}}</div>
      <div class="relation__new">{{isNew}}</div>
    </div>
    <div class="relation__actions">
      <div
        class="relation__mark"
        :class="{'is-active': data.Marked ==='1'}"
        @click="markClickRouter"
      >
        <svg-icon name="starmark" width="16" height="15"/>
      </div>
      <div class="relation__remove" @click="removeNotification">
        <svg-icon name="close" width="12" height="12"/>
      </div>
    </div>
  </div>
</template>

<script>
import { timestampToTime } from '@/helpers/Dates';
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';
import UserRelation from '@/components/Users/UserRelation.vue';
import api from '@/helpers/Api';

export default {
  name: 'Relation',
  components: {
    SvgIcon,
    UserRelation,
  },
  props: {
    data: {
      ID: String,
      Man: {
        ID: String,
        RealName: String,
        Age: Number,
        Country: String,
        Online: String,
        Thumbnail: String,
      },
      Lady: {
        ID: String,
        RealName: String,
        Age: Number,
        Country: String,
        Online: String,
        Thumbnail: String,
      },
      New: String,
      LastMessageDate: String,
      Marked: String,
      Message: String,
    },
  },
  computed: {
    isNew() {
      return this.data.New === 'Y' ? 'Новое' : '';
    },
    timeStamp() {
      return timestampToTime(this.data.LastMessageDate);
    },
  },
  methods: {
    readNotification() {
      api
        .delete(`notifications/${this.data.ID}/read`)
        .then(res => {
          const apiData = res.data[0];
          if (apiData.success) {
            this.$store.commit('readNotification', this.data.ID);
          } else {
            this.showReadError({ message: apiData.message });
          }
        })
        .catch(error => {
          this.showReadError({ message: error });
        });
    },
    removeNotification() {
      api
        .delete(`notifications/${this.data.ID}`)
        .then(res => {
          const apiData = res.data[0];
          if (apiData.success) {
            this.$store.commit('removeNotification', this.data.ID);
          } else {
            this.showDeleteError({ message: apiData.message });
          }
        })
        .catch(error => {
          this.showDeleteError({ message: error });
        });
    },
    markClickRouter(e) {
      e.stopPropagation();

      if (this.data.Marked === '0') {
        this.markNotification();
      } else if (this.data.Marked === '1') {
        this.unmarkNotification();
      }
    },
    markNotification() {
      api
        .delete(`notifications/${this.data.ID}/mark`)
        .then(res => {
          const apiData = res.data[0];
          if (apiData.success) {
            this.$store.commit('markNotification', this.data.ID);
          } else {
            this.showMarkError({ message: apiData.message });
          }
        })
        .catch(error => {
          this.showMarkError({ message: error });
        });
    },
    unmarkNotification() {
      api
        .delete(`notifications/${this.data.ID}/unmark`)
        .then(res => {
          const apiData = res.data[0];
          if (apiData.success) {
            this.$store.commit('unmarkNotification', this.data.ID);
          } else {
            this.showUnmarkError({ message: apiData.message });
          }
        })
        .catch(error => {
          this.showUnmarkError({ message: error });
        });
    },
  },
  notifications: {
    showDeleteError: {
      title: 'Ошибка при удалении',
      type: 'error',
    },
    showReadError: {
      title: 'Ошибка при прочтении',
      type: 'error',
    },
    showMarkError: {
      title: 'Ошибка при отметке',
      type: 'error',
    },
    showUnmarkError: {
      title: 'Ошибка при снятии отметки',
      type: 'error',
    },
  },
};
</script>


<style lang="scss" scoped>
@import '@/theme/utils.scss';

.relation {
  position: relative;
  transition: background 0.25s ease-in-out;
  padding: 13px 10px;
  &__wrapper {
    display: flex;
    align-items: center;
  }
  &__user {
    width: 100%;
    min-width: 0;
    min-height: 0;
    &--left {
      flex: 0 0 130px;
      max-width: 130px;
    }
    &--right {
      flex: 0 0 130px;
      max-width: 130px;
    }
  }
  &__separator {
    flex: 0 0 auto;
    padding-left: 10px;
    padding-right: 18px;
  }
  &__info {
    margin-top: 0.5em;
    display: flex;
    align-items: center;
  }
  &__date {
    flex: 0 0 50px;
    max-width: 50px;
    font-size: 10px;
    text-align: center;
  }
  &__message {
    padding-left: 10px;
    font-size: 10px;
  }
  &__new {
    flex: 0 0 auto;
    margin-left: auto;
    font-weight: 700;
    font-size: 10px;
    text-align: right;
    color: #ff5722;
  }
  &__actions {
    position: absolute;
    z-index: 3;
    top: 18px;
    right: 5px;
    display: flex;
    align-items: center;
    font-size: 0;
    transition: opacity 0.25s ease;
    opacity: 0;
    pointer-events: none;
  }
  &__mark {
    padding: 3px;
    cursor: pointer;
    color: #a5a5a5;
    transition: color 0.25s ease;
    &.is-active,
    &:hover {
      color: $colorOrange;
    }
  }
  &__remove {
    padding: 3px;
    cursor: pointer;
    color: #a5a5a5;
    transition: color 0.25s ease;
    &:hover {
      color: $colorRed;
    }
  }
  &:hover {
    background: $colorBg;
    .relation__actions {
      opacity: 1;
      pointer-events: all;
    }
  }
}
</style>
