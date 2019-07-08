<template>
  <div class="user-relation" :data-id="ID">
    <Avatar :Thumbnail="Thumbnail" :RealName="RealName" :Online="Online" />
    <div class="user-relation__content">
      <a
        :href="outProfileLink"
        target="_blank"
        @click.stop
        class="user-relation__name"
      >{{RealName}}, {{Age}}</a>
      <div class="user-relation__country" :class="{'have-counters': haveMsgCounters}">{{Country}}</div>
      <div v-if="haveMsgCounters" class="user-relation__counters">
        <div class="user-relation__chatnew" v-if="haveChatNew">
          <svg-icon name="relationComment" width="12" height="12" />
          <span>{{ChatNew}}</span>
        </div>
        <a
          :href="outLinkMsgNew"
          target="_blank"
          @click.stop
          class="user-relation__msgnew"
          v-if="haveMessageNew"
        >
          <svg-icon name="relationMessage" width="14" height="11" />
          <span>{{MsgNew}}</span>
        </a>
      </div>
      <div class="user-relation__delete" v-if="removable" @click="$emit('onRemoveClick')">
        <svg-icon name="close" width="12" height="12" />
      </div>
    </div>
  </div>
</template>

<script>
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';
import Avatar from '@/components/Users/Avatar.vue';

export default {
  name: 'Relation',
  components: {
    SvgIcon,
    Avatar,
  },
  props: {
    ID: String,
    IDMan: String,
    RealName: String,
    Age: Number,
    Country: String,
    Online: String,
    Thumbnail: String,
    ChatNew: String,
    MsgNew: String,
    removable: Boolean,
  },
  computed: {
    haveMsgCounters() {
      return this.haveChatNew || this.haveMessageNew;
    },
    haveChatNew() {
      return this.ChatNew && this.ChatNew !== '0';
    },
    haveMessageNew() {
      return this.MsgNew && this.MsgNew !== '0';
    },
    outProfileLink() {
      return `https://marmeladies.com/profile.php?ID=${this.ID}`;
    },
    outLinkMsgNew() {
      return `https://marmeladies.com/moderators/messages.php?action=view_messages&user_id=${this.IDMan}&user_id_1=${this.ID}&status=1`;
    },
  },
};
</script>


<style lang="scss" scoped>
@import '@/theme/utils.scss';

.user-relation {
  position: relative;
  display: flex;
  align-items: center;

  &__content {
    margin-left: 10px;
  }
  &__name {
    display: block;
    font-size: 14px;
    transition: color 0.25s ease;
    &:hover {
      color: $colorPrimary;
    }
  }
  &__country {
    font-size: 11px;
    min-height: 12px;
    margin-top: 0.5em;
    color: #1e1e1e;
    &.have-counters {
      min-height: 0;
    }
  }
  &__counters {
    display: flex;
    align-items: center;
    margin-top: 0.5em;
    > div {
      margin-right: 8px;
      &:last-child {
        margin-right: 0px;
      }
    }
  }
  &__chatnew,
  &__msgnew {
    display: flex;
    align-items: center;
    font-size: 12px;
    span {
      display: inline-block;
      margin-left: 4px;
    }
  }
  &__chatnew {
    color: #ff7676;
  }
  &__msgnew {
    color: #ff9800;
    transition: color 0.25s ease;
    &:hover {
      color: $colorPrimary;
    }
  }
  &__delete {
    position: absolute;
    right: -5px;
    top: 50%;
    padding: 5px;
    transform: translateY(-50%);
    color: rgba($fontColor, 0.4);
    transition: color 0.25s ease-in-out;
    cursor: pointer;
    &:hover {
      color: $colorRed;
    }
  }
}
</style>
