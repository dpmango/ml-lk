<template>
  <panel-collapse name="Отправить приглашение">
    <div class="send-invite__list" ref="list" v-if="inviteList.length > 0">
      <Notification v-if="errorMessage" type="danger">{{errorMessage}}</Notification>
      <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide v-for="(lady, idx) in inviteList" :key="idx">
          <invite-card
            @onSelect="onLadySelect"
            :isSelected="selectedLady === lady.ID"
            :data="lady"
          />
        </swiper-slide>
        <div class="swiper-prev" slot="button-prev">
          <svg-icon name="swiper-prev" width="8" height="12"/>
        </div>
        <div class="swiper-next" slot="button-next">
          <svg-icon name="swiper-next" width="8" height="12"/>
        </div>
      </swiper>
      <spinner
        class="table__loader"
        v-if="scrollFetch.isLoading"
        size="medium"
        line-fg-color="#5aa6ff"
      />
    </div>
  </panel-collapse>
</template>

<script>
import tryMount from '@/mixins/tryMount';
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';
import PanelCollapse from '@/components/Shared/Layout/PanelCollapse.vue';
import InviteCard from '@/components/Invite/InviteCard.vue';
import MansList from '@/components/Invite/MansList.vue';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import Spinner from 'vue-simple-spinner';
import Notification from '@/components/Shared/UI/Notification.vue';
import api from '@/helpers/Api';
import 'swiper/dist/css/swiper.css';

export default {
  name: 'LadyInviteList',
  mixins: [tryMount],
  components: {
    SvgIcon,
    PanelCollapse,
    InviteCard,
    MansList,
    swiper,
    swiperSlide,
    Spinner,
    Notification,
  },
  data() {
    return {
      scrollFetch: {
        isLoading: false,
        moreResultsAvailable: true,
      },
      swiperOption: {
        direction: 'horizontal',
        loop: false,
        watchOverflow: true,
        setWrapperSize: false,
        spaceBetween: 10,
        slidesPerView: 6,
        normalizeSlideIndex: true,
        // freeMode: true,
        // freeModeSticky: true,
        navigation: {
          nextEl: '.swiper-next',
          prevEl: '.swiper-prev',
        },
        breakpoints: {
          568: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          920: {
            slidesPerView: 3,
          },
          1100: {
            slidesPerView: 4,
          },
          1300: {
            slidesPerView: 5,
          },
        },
      },
      inviteList: [],
      errorMessage: '',
    };
  },
  props: {
    selectedLady: String,
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    },
    pageModules() {
      return this.$store.state.page.activeModules;
    },
    shouldShowModule() {
      return this.pageModules.indexOf('SendInvite') !== -1;
    },
  },
  methods: {
    fetchApi() {
      api
        .get('ladies?filter=2')
        .then(res => {
          this.errorMessage = '';
          this.inviteList = res.data;
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
    onLadySelect(id) {
      this.$emit('onLadySelect', id);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme/utils.scss';

.send-invite {
  &__list {
    .swiper-container {
      padding: 15px 50px;
    }
    .swiper-slide {
      width: 100%;
      // flex: 0 0 16.6666%;
      // max-width: 16.6666%;
      min-width: 1px;
      min-height: 0;
    }
  }
}
.swiper-prev,
.swiper-next {
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  z-index: 2;
  padding: 10px;
  width: 50px;
  cursor: pointer;
  color: #6f6e70;
  background: white;
  transition: color 0.25s ease;
  &:hover {
    color: $fontColor;
  }
}
.swiper-prev {
  left: 0px;
}
.swiper-next {
  right: 0px;
}
</style>
