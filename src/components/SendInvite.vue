<template>
  <div class="send-invite" v-if="shouldShowModule">
    <LadyInviteList
      :selectedLady="selectedLady"
      @onLadySelect="onLadySelect"
      ref="ladyInviteListRef"
    />
    <MansList :forLady="selectedLady"/>
  </div>
</template>

<script>
import fetchOnShowModule from '@/mixins/fetchOnShowModule';
import LadyInviteList from '@/components/Invite/LadyInviteList.vue';
import MansList from '@/components/Invite/MansList.vue';
import { setTimeout } from 'timers';

export default {
  name: 'SendInvite',
  mixins: [fetchOnShowModule],
  components: {
    LadyInviteList,
    MansList,
  },
  data() {
    return {
      selectedLady: undefined,
    };
  },
  computed: {
    pageModules() {
      return this.$store.state.page.activeModules;
    },
    shouldShowModule() {
      return this.pageModules.indexOf('SendInvite') !== -1;
    },
  },
  methods: {
    fetchApi() {
      setTimeout(() => {
        this.$refs.ladyInviteListRef.fetchApi();
      }, 100);
    },
    onLadySelect(ladyId) {
      if (this.selectedLady === ladyId) {
        this.selectedLady = undefined; // deselect
      } else {
        this.selectedLady = ladyId;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme/utils.scss';

.send-invite {
  margin-bottom: 10px;
}
</style>
