<template>
  <panel-collapse name="Отправить приглашение">
    <div class="send-invite__content-wrapper" :class="{'is-not-empty': listNotEmpty}">
      <div class="send-invite__list" ref="list" v-if="listNotEmpty">
        <Notification v-if="errorMessage" type="danger">{{errorMessage}}</Notification>
        <swiper :options="swiperOption" ref="mySwiper" @slideChange="slideChange">
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
      </div>
      <div class="send-invite__list-empty" v-if="!listNotEmpty && !scrollFetch.isLoading">
        Отправка приглашений сейчас невозможна.
        <br>Возможная причина - нет девушек онлайн.
      </div>
      <spinner
        class="send-invite__loader"
        v-if="scrollFetch.isLoading"
        size="medium"
        line-fg-color="#5aa6ff"
      />
    </div>
  </panel-collapse>
</template>

<script>
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
    listNotEmpty() {
      return this.inviteList.length > 0;
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
      this.scrollFetch.isLoading = true;
      api
        .get('ladies?filter=2')
        .then(res => {
          this.errorMessage = '';
          this.inviteList = res.data;
          this.scrollFetch.isLoading = false;
          this.scrollFetch.moreResultsAvailable = res.data.length === 21;
        })
        .catch(err => {
          this.errorMessage = err;
        });
    },
    slideChange() {
      const curIndex = this.swiper.realIndex;
      const totalSlides = this.swiper.slides.length;
      let slidesOffset = 6;
      const wWidth = window.innerWidth;
      if (wWidth <= 568) {
        slidesOffset = 0;
      } else if (wWidth <= 768) {
        slidesOffset = 1;
      } else if (wWidth <= 768) {
        slidesOffset = 2;
      } else if (wWidth <= 920) {
        slidesOffset = 3;
      } else if (wWidth <= 1100) {
        slidesOffset = 4;
      } else if (wWidth <= 1300) {
        slidesOffset = 5;
      }

      const slideIndexRight = curIndex + slidesOffset;
      const shouldLoad = slideIndexRight + 2 >= totalSlides;

      if (shouldLoad && !this.scrollFetch.isLoading && this.scrollFetch.moreResultsAvailable) {
        const lastId = this.inviteList[this.inviteList.length - 2].ID;
        this.scrollFetch.isLoading = true;

        api
          .get(`ladies?filter=2&last_id=${lastId}`)
          .then(res => {
            this.inviteList = this.inviteList.concat(res.data.slice(1));
            this.scrollFetch.isLoading = false;
            this.scrollFetch.moreResultsAvailable = res.data.length === 21;
          })
          .catch(err => {
            this.errorMessage = err;
          });
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
  position: relative;
  &__content-wrapper {
    padding: 2.5em 0 2em;
    &.is-not-empty {
      padding: 0;
    }
  }
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
  &__loader {
    position: absolute;
    z-index: 3;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
  }
  &__list-empty {
    font-size: 14px;
    text-align: center;

    color: rgba($fontColor, 0.6);
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
