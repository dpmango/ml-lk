<template>
  <div class="send-invite">
    <panel-collapse name="Отправить приглашение">
      <div class="send-invite__list">
        <swiper :options="swiperOption" ref="mySwiper">
          <swiper-slide v-for="(lady, idx) in inviteList" :key="idx">
            <invite-card :data="lady"/>
          </swiper-slide>
          <div class="swiper-prev" slot="button-prev">
            <svg-icon name="swiper-prev" width="8" height="12"/>
          </div>
          <div class="swiper-next" slot="button-next">
            <svg-icon name="swiper-next" width="8" height="12"/>
          </div>
        </swiper>
      </div>
    </panel-collapse>
  </div>
</template>

<script>
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';
import PanelCollapse from '@/components/Shared/Layout/PanelCollapse.vue';
import InviteCard from '@/components/Invite/InviteCard.vue';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css';

export default {
  name: 'SendInvite',
  components: {
    SvgIcon,
    PanelCollapse,
    InviteCard,
    swiper,
    swiperSlide,
  },
  data() {
    return {
      swiperOption: {
        // https://idangero.us/swiper/api/
        // wrapperClass: 'swiper-wrapper',
        // slideClass: 'example-slide',
        direction: 'horizontal',
        loop: false,
        watchOverflow: true,
        setWrapperSize: false,
        spaceBetween: 10,
        slidesPerView: 'auto',
        normalizeSlideIndex: true,
        freeMode: true,
        freeModeSticky: true,
        navigation: {
          nextEl: '.swiper-next',
          prevEl: '.swiper-prev',
        },
      },
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
        {
          ID: 4,
          Thumbnail: 'https://marmeladies.com/media/images/profile/1543646_0_17964.jpg',
          RealName: 'Karina',
          Age: '21',
          Country: 'Ukraine, Kiev',
          Online: '0',
        },
        {
          ID: 5,
          Thumbnail: 'https://marmeladies.com/media/images/profile/1543646_0_17964.jpg',
          RealName: 'Karina',
          Age: '21',
          Country: 'Ukraine, Kiev',
          Online: '1',
        },
        {
          ID: 6,
          Thumbnail: 'https://marmeladies.com/media/images/profile/1543646_0_17964.jpg',
          RealName: 'Karina',
          Age: '21',
          Country: 'Ukraine, Kiev',
          Online: '0',
        },
        {
          ID: 7,
          Thumbnail: 'https://marmeladies.com/media/images/profile/1543646_0_17964.jpg',
          RealName: 'Karina',
          Age: '21',
          Country: 'Ukraine, Kiev',
          Online: '1',
        },
        {
          ID: 8,
          Thumbnail: 'https://marmeladies.com/media/images/profile/1543646_0_17964.jpg',
          RealName: 'Karina',
          Age: '21',
          Country: 'Ukraine, Kiev',
          Online: '0',
        },
      ],
    };
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@import '@/theme/utils.scss';

.send-invite {
  margin-bottom: 10px;
  &__list {
    .swiper-container {
      padding: 15px 50px;
    }

    .swiper-slide {
      width: 100%;
      flex: 0 0 16.6666%;
      max-width: 16.6666%;
      min-width: 1px;
      min-height: 0;
    }
  }
}
.swiper-prev,
.swiper-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  padding: 10px;
  cursor: pointer;
  color: #6f6e70;
  transition: color 0.25s ease;
  &:hover {
    color: $fontColor;
  }
}
.swiper-prev {
  left: 15px;
}
.swiper-next {
  right: 15px;
}
</style>
