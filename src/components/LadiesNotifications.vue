<template>
  <div class="ladies-ntf">
    <panel-collapse name="Девушки">
      <div class="ladies-ntf__filter filter-ntf">
        <div class="filter-ntf__item">
          <label for>Онлайн для всех</label>
          <ui-switch isGreen @click="handleFilterClick" :active="filter.online"/>
        </div>
        <div class="filter-ntf__item">
          <label for>Рассылки для всех</label>
          <ui-switch isGreen @click="handleFilterClick" :active="filter.mailer"/>
        </div>
      </div>
      <div class="ladies-ntf__list" ref="list">
        <Notification v-if="errorMessage" type="danger">{{errorMessage}}</Notification>
        <div v-for="(lady, idx) in ladies" :key="idx">{{lady}}</div>
        <spinner
          class="table__loader"
          v-if="scrollFetch.isLoading"
          size="medium"
          line-fg-color="#5aa6ff"
        />
      </div>
    </panel-collapse>
  </div>
</template>

<script>
import throttle from 'lodash/throttle';
import PanelCollapse from '@/components/Shared/Layout/PanelCollapse.vue';
import UiSwitch from '@/components/Shared/UI/Switch.vue';
import Spinner from 'vue-simple-spinner';
import Notification from '@/components/Shared/UI/Notification.vue';
import api from '@/helpers/Api';

export default {
  name: 'LadiesNotifications',
  components: {
    PanelCollapse,
    UiSwitch,
    Spinner,
    Notification,
  },
  data() {
    return {
      scrollFetch: {
        isLoading: false,
        moreResultsAvailable: true,
      },
      filter: {
        online: false,
        mailer: true,
      },
      ladies: [],
      errorMessage: '',
    };
  },
  created() {
    this.scrollWithThrottle = throttle(this.handleListScroll, 100);
  },
  mounted() {
    this.fetchApi();
    this.$refs.list.addEventListener('scroll', this.scrollWithThrottle, false);
  },
  beforeDestroy() {
    this.$refs.list.removeEventListener('scroll', this.scrollWithThrottle, false);
  },
  methods: {
    fetchApi() {
      api
        .get('ladies?filter=1')
        .then(res => {
          this.errorMessage = '';
          this.ladies = res.data;
        })
        .catch(err => {
          this.errorMessage = err;
        });
    },
    handleFilterClick() {},
    handleListScroll() {
      const listDOM = this.$refs.list;
      const scrollRemaining = listDOM.scrollHeight - listDOM.scrollTop - listDOM.offsetHeight;
      if (
        scrollRemaining <= 150 &&
        !this.scrollFetch.isLoading &&
        this.scrollFetch.moreResultsAvailable
      ) {
        // const lastId = this.ladies[this.ladies.length - 2].ID;
        this.scrollFetch.isLoading = true;

        // api
        //   .get(`ladies?last_id=${lastId}`, {
        //     params: this.filterToParams(),
        //   })
        //   .then(res => {
        //     this.ladies = this.ladies.concat(res.data.slice(1));
        //     this.scrollFetch.isLoading = false;
        //     this.scrollFetch.moreResultsAvailable = res.data.length === 21;
        //   });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme/utils.scss';

.ladies-ntf {
  margin-bottom: 10px;
  &__filter {
    display: flex;
    align-items: flex-start;
    padding: 17px 20px;
    border: 1px solid rgba(#d1cfda, 0.4);
  }
  &__list {
  }
}
.filter-ntf {
  &__item {
    display: flex;
    align-items: center;
    margin-right: 40px;
    > label {
      margin-right: 10px;
      font-weight: 500;
      font-size: 13px;
    }
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
