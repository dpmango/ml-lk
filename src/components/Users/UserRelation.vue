<template>
  <div class="user-relation" :data-id="ID">
    <Avatar :Thumbnail="Thumbnail" :RealName="RealName" :Online="Online"/>
    <div class="user-relation__content">
      <div class="user-relation__name">{{RealName}}, {{Age}}</div>
      <div class="user-relation__country" :class="{'have-counters': haveMsgCounters}">{{Country}}</div>
      <div v-if="haveMsgCounters" class="user-relation__counters">
        <div class="user-relation__chatnew" v-if="haveChatNew">
          <svg-icon name="relationComment" width="12" height="12"/>
          <span>{{ChatNew}}</span>
        </div>
        <div class="user-relation__msgnew" v-if="haveMessageNew">
          <svg-icon name="relationMessage" width="14" height="11"/>
          <span>{{MsgNew}}</span>
        </div>
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
    RealName: String,
    Age: Number,
    Country: String,
    Online: String,
    Thumbnail: String,
    ChatNew: String,
    MsgNew: String,
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
  },
};
</script>


<style lang="scss" scoped>
@import '@/theme/utils.scss';

.user-relation {
  display: flex;
  align-items: center;

  &__content {
    margin-left: 10px;
  }
  &__name {
    font-size: 14px;
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
  }
}
</style>
