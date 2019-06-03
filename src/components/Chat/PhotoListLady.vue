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
            <ui-radio isRed isBig v-model="filter.isSend" cbValue="0" name="isSend" label="Да"/>
            <ui-radio isRed isBig v-model="filter.isSend" cbValue="1" name="isSend" label="Нет"/>
          </div>
          <div class="ui-radio-group">
            <label for>Просмотрено:</label>
            <ui-radio isRed isBig v-model="filter.isRead" cbValue="0" name="isRead" label="Да"/>
            <ui-radio isRed isBig v-model="filter.isRead" cbValue="1" name="isRead" label="Нет"/>
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

export default {
  name: 'AddEditModal',
  components: {
    SvgIcon,
    UiRadio,
    Panel,
  },
  computed: {
    currentUsers() {
      return this.$store.state.chat.currentUsers;
    },
    photosCount() {
      return this.photos.length;
    },
  },
  data() {
    return {
      filter: {
        isSend: null,
        isRead: null,
      },
      users: {},
      photos: [],
    };
  },
  methods: {
    beforeOpen(event) {
      this.users = event.params.users;
      // this.type = event.params.type;
    },

    resetState() {
      this.filter = {
        isSend: null,
        isRead: null,
      };
      this.users = {};
      this.photos = [];
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
</style>
