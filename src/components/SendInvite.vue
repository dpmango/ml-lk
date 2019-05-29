<template>
  <div class="send-invite">
    <panel-collapse name="Отправить приглашение">
      <div class="send-invite__list">
        <div v-for="(lady, idx) in inviteList" :key="idx" class="send-invite__col">
          <invite-card :data="lady"/>
        </div>
      </div>
    </panel-collapse>
  </div>
</template>

<script>
import PanelCollapse from '@/components/Shared/Layout/PanelCollapse.vue';
import InviteCard from '@/components/Invite/InviteCard.vue';

export default {
  name: 'SendInvite',
  components: {
    PanelCollapse,
    InviteCard,
  },
  data() {
    return {
      inviteList: [
        {
          ID: 1,
          Thumbnail: 'https://marmeladies.com/media/images/profile/1543646_0_17964.jpg',
          RealName: 'Karina',
          Age: '21',
          Country: 'Ukraine, Kiev',
          Online: '0',
        },
        {
          ID: 2,
          Thumbnail: 'https://marmeladies.com/media/images/profile/1543646_0_17964.jpg',
          RealName: 'Karina',
          Age: '21',
          Country: 'Ukraine, Kiev',
          Online: '1',
        },
        {
          ID: 3,
          Thumbnail: 'https://marmeladies.com/media/images/profile/1543646_0_17964.jpg',
          RealName: 'Karina',
          Age: '21',
          Country: 'Ukraine, Kiev',
          Online: '0',
        },
      ],
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@import '@/theme/utils.scss';

.send-invite {
  margin-bottom: 10px;
  &__list {
    display: flex;
    margin: -5px;
    padding: 15px;
  }
  &__col {
    width: 100%;
    flex: 0 0 16.6666%;
    max-width: 16.6666%;
    min-width: 1px;
    min-height: 0;
    padding: 5px;
  }
}
</style>
