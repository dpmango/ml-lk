<template>
  <div class="page">
    <Header/>
    <div class="page__content">
      <Container>
        <LadiesNotifications/>
        <SendInvite/>
        <div class="grid" :class="{'is-chat-active': isChatActive}">
          <div class="col col--left">
            <NotificationsList/>
          </div>
          <div class="col col--chat">
            <Chat/>
          </div>
          <div class="col col--right">
            <ContactList/>
          </div>
        </div>
      </Container>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Shared/Header.vue';
import Container from '@/components/Shared/Layout/Container.vue';
import LadiesNotifications from '@/components/LadiesNotifications.vue';
import SendInvite from '@/components/SendInvite.vue';
import NotificationsList from '@/components/NotificationsList.vue';
import ContactList from '@/components/ContactList.vue';
import Chat from '@/components/Chat.vue';

export default {
  name: 'Home',
  components: {
    Header,
    Container,
    LadiesNotifications,
    SendInvite,
    NotificationsList,
    ContactList,
    Chat,
  },
  created() {
    this.$store.commit('INITIAL_ADD_SOUNDS');
  },
  computed: {
    isChatActive() {
      return this.$store.getters.haveCurrentUsers;
    },
  },
};
</script>


<style scoped lang="scss">
@import '@/theme/utils.scss';

.grid {
  display: flex;
  margin-left: -5px;
  margin-right: -5px;
}
.col {
  width: 100%;
  max-width: 100%;
  flex: 0 0 100%;
  min-width: 1px;
  min-height: 0;
  padding-left: 5px;
  padding-right: 5px;
  &--left {
    flex: 0 0 380px;
    max-width: 380px;
  }
  &--right {
    flex: 0 0 380px;
    max-width: 380px;
  }
  &--chat {
    flex: 1 1 calc(100% - 760px);
    max-width: calc(100% - 760px);
  }
}
@include r($hd) {
  .grid {
    position: relative;
    .col--left,
    .col--right {
      position: absolute;
      z-index: 2;
      top: 0;
      transition: transform 0.3s ease-out;
    }
    .col--left {
      left: -30px;
    }
    .col--right {
      right: -30px;
    }
    .col--chat {
      position: relative;
      z-index: 1;
      flex: 1 1 100%;
      max-width: 100%;
      margin-left: 30px;
      margin-right: 30px;
    }
    &.is-chat-active {
      .col--left {
        transform: translateX(-320px);
      }
      .col--right {
        transform: translateX(320px);
      }
      .col--left,
      .col--right {
        &:hover {
          transform: translateX(0);
        }
      }
    }
  }
  .v--modal-block-scroll {
    .grid {
      .col--chat {
        z-index: 5;
      }
    }
  }
}

@include r($md) {
  .grid {
    flex-wrap: wrap;
    // margin-left: -25px;
    // margin-right: -25px;
    padding-bottom: 40px;
    .col--left,
    .col--right {
      flex: 1 1 100%;
      max-width: 100%;
      position: static;
      z-index: 2;
      top: 0;
      left: 0;
      right: 0;
      transition: none;
      margin-bottom: 20px;
    }
    .col--chat {
      order: 3;
      margin-left: 0;
      margin-right: 0;
    }
    &.is-chat-active {
      .col--left,
      .col--right {
        transform: translateX(0px);
      }
    }
  }
}
@include r($sm) {
  .grid {
    margin-left: -25px;
    margin-right: -25px;
  }
}
</style>

