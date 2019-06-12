<template>
  <div class="mans panel">
    <div class="panel__head panel-head">
      <div class="panel-head__icon">
        <div class="icon-circle">
          <svg-icon name="filter" width="13" height="15"/>
        </div>
      </div>
      <div class="panel-head__name">Мужчины ({{mans.length}})</div>
      <div class="panel-head__action">
        <ui-checkbox
          @input="checkAll"
          v-model="filter.allChecked"
          name="allChecked"
          label="Отметить всех"
          bigFont
        />
      </div>
    </div>
    <div class="panel__content" ref="list">
      <UiNotification v-if="errorMessage" type="danger">{{errorMessage}}</UiNotification>
      <div class="mans__grid">
        <div v-for="(lady, idx) in mansMinus8" :key="idx" class="mans__col">
          <invite-card isSmaller :data="lady"/>
        </div>
      </div>
      <div class="mans__grid">
        <div class="mans__col mans__col--restcards">
          <div class="mans__grid">
            <div v-for="(lady, idx) in mansRest8" :key="idx" class="mans__col mans__col--collumned">
              <invite-card isSmaller :data="lady"/>
            </div>
          </div>
        </div>
        <div class="mans__col mans__col--textarea">
          <textarea/>
        </div>
      </div>
      <spinner
        class="mans__loader"
        v-if="scrollFetch.isLoading"
        size="medium"
        line-fg-color="#5aa6ff"
      />
    </div>
  </div>
</template>

<script>
import throttle from 'lodash/throttle';
import cloneDeep from 'lodash/cloneDeep';
import Spinner from 'vue-simple-spinner';
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';
import UiCheckbox from '@/components/Shared/UI/Checkbox.vue';
import UiNotification from '@/components/Shared/UI/Notification.vue';
import InviteCard from '@/components/Invite/InviteCard.vue';
import api from '@/helpers/Api';

const defaultFilterState = {
  allChecked: false,
};

export default {
  name: 'MansList',
  components: {
    Spinner,
    SvgIcon,
    UiCheckbox,
    UiNotification,
    InviteCard,
  },
  data() {
    return {
      ladyId: '1552269',
      scrollFetch: {
        isLoading: false,
        moreResultsAvailable: true,
      },
      listMounted: false,
      filter: cloneDeep(defaultFilterState),
      mans: [],
      errorMessage: '',
    };
  },
  created() {
    this.scrollWithThrottle = throttle(this.handleListScroll, 100);
  },
  mounted() {
    this.fetchApi();
    this.tryMount();
  },
  updated() {
    this.tryMount();
  },
  beforeDestroy() {
    this.tryUnmount();
  },
  computed: {
    mansMinus8() {
      return this.mans.slice(0, this.mans.length - 9);
    },
    mansRest8() {
      if (this.scrollFetch.moreResultsAvailable) {
        return this.mans.slice(this.mans.length - 8, this.mans.length);
      } else {
        return this.mans.slice(this.mans.length - 9, this.mans.length);
      }
    },
  },

  methods: {
    tryMount() {
      if (!this.listMounted && this.$refs.list) {
        this.listMounted = true;
        this.$refs.list.addEventListener('scroll', this.scrollWithThrottle, false);
      }
    },
    tryUnmount() {
      if (this.listMounted && this.$refs.list) {
        this.listMounted = false;
        this.$refs.list.removeEventListener('scroll', this.scrollWithThrottle, false);
      }
    },
    filterToParams() {
      // let filterString = '';
      // let ladiesFilter = '';
      // if (this.filter.marked) {
      //   filterString = '1';
      // }
      // if (this.filter.new) {
      //   filterString = filterString.length > 0 ? `${filterString},2` : '2';
      // }
      // if (this.filter.maleOnline) {
      //   filterString = filterString.length > 0 ? `${filterString},3` : '3';
      // }

      // if (this.filter.ladies.length > 0) {
      //   ladiesFilter = this.filter.ladies.join(',');
      // }

      // filter = 1 (отправить приглашение):
      // lady – ID девушки
      // age_1 и age_2 – интервал «Возраст»
      // height_1 и height_2 – интервал «Рост»
      // weight_1 и weight_2 – интервал «Вес»
      // hair – цвет волос (список ID через запятую)
      // eye – цвет глаз (список ID через запятую)
      // marital – семейное положение (список ID через запятую)
      // education – образование (список ID через запятую)
      // country – страна (список кодов через запятую)
      // city - город
      // id – ID мужчины
      // children – дети – 1:есть;2:нет
      // photo – фото - 1:есть;2:нет

      return {
        filter: 1,
        lady: this.ladyId,
      };
    },
    fetchApi() {
      api
        .get('mens', {
          params: this.filterToParams(),
        })
        .then(res => {
          this.errorMessage = '';
          this.mans = res.data;
          // this.$store.commit('NOTIFICATIONS_SET', res.data);
        })
        .catch(err => {
          this.errorMessage = err;
        });
    },
    handleListScroll() {
      const listDOM = this.$refs.list;
      const scrollRemaining = listDOM.scrollHeight - listDOM.scrollTop - listDOM.offsetHeight;
      if (
        scrollRemaining <= 150 &&
        !this.scrollFetch.isLoading &&
        this.scrollFetch.moreResultsAvailable
      ) {
        // const lastId = this.ladies[this.ladies.length - 2].ID;
        // const lastId = this.ladiesNtfListLastId;
        this.scrollFetch.isLoading = true;

        // api.get(`ladies?filter=1&last_id=${lastId}`).then(res => {
        //   // this.ladies = this.ladies.concat(res.data.slice(1));
        //   this.$store.commit('APPEND_LADIESNTF', res.data.slice(1));
        //   this.scrollFetch.isLoading = false;
        //   this.scrollFetch.moreResultsAvailable = res.data.length === 21;
        // });
      }
    },
    checkAll() {
      // triggered when Check all is changed
      console.log(this.filter.allChecked);
    },
    clearFilter() {
      this.filter = cloneDeep(defaultFilterState);
      this.fetchApi();
    },
  },
};
</script>


<style lang="scss" scoped>
@import '@/theme/utils.scss';

.icon-circle {
  display: block;
  width: 30px;
  height: 30px;
  background: #d1cfda;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0;
  transition: background 0.25s ease, opacity 0.25s ease;
}

.panel {
  background: #ffffff;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.08);
  &__head {
    flex: 0 0 auto;
    background: white;
    border-bottom: 1px solid rgba(#d1cfda, 0.4);
  }
  &__content {
    padding: 20px;
  }
  &.is-filter-active {
    .panel-head__icon {
      .icon-circle {
        background-color: $colorPrimary;
      }
    }
  }
}

.panel-head {
  display: flex;
  align-items: center;
  min-height: 40px;
  padding: 5px 15px 5px 20px;
  &__icon {
    flex: 0 0 auto;
  }
  &__name {
    flex: 0 1 auto;
    padding-left: 20px;
    font-size: 16px;
  }
  &__action {
    flex: 0 0 auto;
    margin-left: auto;
    &:hover {
    }
  }
}

.mans {
  position: relative;
  margin-top: 10px;
  &__grid {
    display: flex;
    flex-wrap: wrap;
    margin: -10px;
  }
  &__col {
    width: 100%;
    flex: 0 0 16.6666%;
    max-width: 16.6666%;
    min-width: 1px;
    min-height: 0px;
    padding: 10px;
    &--collumned {
      flex-basis: 25%;
      max-width: 25%;
    }
    &--restcards {
      flex-basis: 66.6666%;
      max-width: 66.6666%;
    }
    &--textarea {
      flex-basis: 33.3333%;
      max-width: 33.3333%;
    }
  }
  &__loader {
    position: absolute;
    bottom: 10px;
    z-index: 3;
    left: 50%;
    transform: translateX(-50%);
  }
}

@include r($xl) {
  .panel {
    height: auto;
    max-height: calc(100vh - 80px - 40px);
  }
}
@include r($sm) {
  .panel-head {
    flex-wrap: wrap;
    &__icon {
      flex-basis: auto;
    }
    &__name {
      padding-left: 20px;
    }
  }
}
</style>

