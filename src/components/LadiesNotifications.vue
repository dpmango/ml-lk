<template>
  <div class="ladies-ntf" v-if="shouldShowModule">
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
      <div class="ladies-ntf__content">
        <Notification v-if="errorMessage" type="danger">{{errorMessage}}</Notification>
        <div class="ladies-ntf__head head-ntf">
          <div v-for="(col, idx) in [1,2,3,4]" :key="idx" class="head-ntf__col">
            <div class="head-ntf__holder">
              <div class="head-ntf__title">Онлайн</div>
              <div class="head-ntf__title">Рассылка</div>
            </div>
          </div>
        </div>
        <div class="ladies-ntf__list" ref="list">
          <div v-for="(lady, idx) in ladies20" :key="idx" class="ladies-ntf__col">
            <lady-ntf-card :data="lady"/>
          </div>
        </div>
        <spinner
          class="ladies-ntf__loader"
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
import Spinner from 'vue-simple-spinner';
import PanelCollapse from '@/components/Shared/Layout/PanelCollapse.vue';
import UiSwitch from '@/components/Shared/UI/Switch.vue';
import Notification from '@/components/Shared/UI/Notification.vue';
import LadyNtfCard from '@/components/Ladies/LadyNtfCard.vue';
import api from '@/helpers/Api';

export default {
  name: 'LadiesNotifications',
  components: {
    PanelCollapse,
    UiSwitch,
    Spinner,
    Notification,
    LadyNtfCard,
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
  computed: {
    pageModules() {
      return this.$store.state.page.activeModules;
    },
    shouldShowModule() {
      return this.pageModules.indexOf('LadiesNotifications') !== -1;
    },
    ladies20() {
      if (this.scrollFetch.moreResultsAvailable) {
        return this.ladies.slice(0, this.ladies.length - 1);
      } else {
        return this.ladies;
      }
    },
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
        const lastId = this.ladies[this.ladies.length - 2].ID;
        this.scrollFetch.isLoading = true;

        api.get(`ladies?filter=1&last_id=${lastId}`).then(res => {
          this.ladies = this.ladies.concat(res.data.slice(1));
          this.scrollFetch.isLoading = false;
          this.scrollFetch.moreResultsAvailable = res.data.length === 21;
        });
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
  &__content {
    position: relative;
    max-height: 230px;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 15px 20px;
  }
  &__head {
    flex: 0 0 auto;
    padding-bottom: 10px;
    min-height: 0px;
  }
  &__list {
    flex: 0 1 auto;
    min-height: 1px;
    display: flex;
    flex-wrap: wrap;
    margin: -10px;
    overflow-y: scroll;
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
  &__col {
    width: 100%;
    flex: 0 0 25%;
    max-width: 25%;
    min-height: 0px;
    min-width: 1px;
    padding: 10px;
  }
  &__loader {
    position: absolute;
    bottom: 10px;
    z-index: 3;
    left: 50%;
    transform: translateX(-50%);
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

.head-ntf {
  display: flex;
  flex-wrap: wrap;
  margin-left: -10px;
  margin-right: -10px;
  &__col {
    display: flex;
    width: 100%;
    flex: 0 0 25%;
    max-width: 25%;
    min-height: 0px;
    min-width: 1px;
    padding: 0 10px;
  }
  &__holder {
    flex: 0 0 auto;
    margin-left: auto;
    display: flex;
  }
  &__title {
    width: 70px;
    flex: 0 0 auto;
    min-width: 1px;
    font-size: 13px;
    text-align: center;
  }
}

@include r($lg) {
  .ladies-ntf {
    &__col {
      flex: 0 0 33.3333%;
      max-width: 33.3333%;
    }
  }
}
</style>
