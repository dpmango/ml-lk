<template>
  <div class="ntf-lady" :data-id="data.ID">
    <Avatar :Thumbnail="data.Thumbnail" :RealName="data.RealName" />
    <div class="ntf-lady__content">
      <a
        class="ntf-lady__name"
        :href="outProfileLink"
        target="_blank"
        @click.stop
      >{{data.RealName}}, {{age}}</a>
      <div class="ntf-lady__country">{{data.City}}, {{data.Country}}</div>
    </div>
    <div class="ntf-lady__actions">
      <div class="ntf-lady__toggle">
        <ui-switch isGreen @click="toggleOnline" :active="isOnline" />
      </div>
      <div class="ntf-lady__toggle">
        <ui-switch isGreen @click="toggleInvitation" :active="isInvitation" />
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from '@/components/Users/Avatar.vue';
import UiSwitch from '@/components/Shared/UI/Switch.vue';
import { dateToAge } from '@/helpers/Dates';
import api from '@/helpers/Api';

export default {
  name: 'LadyNtfCard',
  components: {
    Avatar,
    UiSwitch,
  },
  props: {
    data: {
      ID: String,
      NickName: String,
      RealName: String,
      LastName: String,
      DateOfBirth: String,
      City: String,
      Country: String,
      LastReg: String,
      Status: Number,
      Thumbnail: String,
      Online: String,
      Invitation: String,
      Translator: {
        ID: String,
        FirstName: String,
        LastName: String,
      },
    },
  },
  computed: {
    age() {
      return dateToAge(this.data.DateOfBirth);
    },
    isOnline() {
      return this.data.Online === '1';
    },
    isInvitation() {
      return this.data.Invitation === '1';
    },
    outProfileLink() {
      return `https://marmeladies.com/profile.php?ID=${this.data.ID}`;
    },
  },
  methods: {
    handleFilterClick(name) {
      this[name] = this[name] === '1' ? '0' : '1';
    },
    toggleOnline() {
      if (!this.isOnline) {
        this.pingApi({
          urlSuffix: `/online`,
          commitAction: [
            'TOGGLE_LADIESNTF_ONLINE',
            'NOTIFICATION_TOGGLE_LADY_ONLINE',
            'CONTACT_TOGGLE_LADY_ONLINE',
          ],
          shouldOnStore: true,
          errTitle: 'Ошибка при добавлении в онлайн',
        });
      } else {
        this.pingApi({
          urlSuffix: `/offline`,
          commitAction: [
            'TOGGLE_LADIESNTF_ONLINE',
            'NOTIFICATION_TOGGLE_LADY_ONLINE',
            'CONTACT_TOGGLE_LADY_ONLINE',
          ],
          shouldOnStore: false,
          errTitle: 'Ошибка при удалении из онлайн',
        });
      }
    },
    toggleInvitation() {
      if (!this.isInvitation) {
        this.pingApi({
          urlSuffix: `/oninvitations`,
          commitAction: [
            'TOGGLE_LADIESNTF_INVITATION',
            'NOTIFICATION_TOGGLE_LADY_ONLINE',
            'CONTACT_TOGGLE_LADY_ONLINE',
          ],
          shouldOnStore: true,
          errTitle: 'Ошибка при добавлении в рассылки',
        });
      } else {
        this.pingApi({
          urlSuffix: `/offinvitations`,
          commitAction: [
            'TOGGLE_LADIESNTF_INVITATION',
            'NOTIFICATION_TOGGLE_LADY_ONLINE',
            'CONTACT_TOGGLE_LADY_ONLINE',
          ],
          shouldOnStore: false,
          errTitle: 'Ошибка при удалении из рассылки',
        });
      }
    },
    pingApi(options) {
      api
        .post(`ladies${options.urlSuffix}`, {
          ladies: this.data.ID,
        })
        .then(res => {
          const apiData = res.data[0];
          if (apiData.success) {
            options.commitAction.forEach(action => {
              this.$store.commit(action, {
                shouldOn: options.shouldOnStore,
                ladyId: this.data.ID,
              });
            });
          } else {
            this.showNotification({ title: options.errTitle, message: apiData.message });
          }
        })
        .catch(error => {
          this.showNotification({ title: options.errTitle, message: error });
        });
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
.ntf-lady {
  display: flex;
  align-items: center;
  min-width: 1px;
  &__content {
    flex: 1 1 auto;
    margin-left: 10px;
  }
  &__name {
    font-size: 14px;
    line-height: 18px;
    display: block;
    transition: color 0.25s ease;
    &:hover {
      color: $colorPrimary;
    }
  }
  &__country {
    margin-top: 0.5em;
    font-size: 11px;
    color: rgba($fontColor, 0.6);
  }
  &__actions {
    display: flex;
    flex: 0 0 auto;
    margin-left: auto;
    padding-left: 10px;
    min-width: 1px;
  }
  &__toggle {
    width: 70px;
    display: flex;
    justify-content: center;
    flex: 0 0 auto;
    min-width: 1px;
  }
}
</style>
