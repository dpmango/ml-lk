<template>
  <div class="lady-filter-selected lfs" v-if="data.length > 0">
    <swiper :options="swiperOption" ref="mySwiper">
      <swiper-slide v-for="(user, idx) in data" :key="idx" class="lfs__card">
        <user-relation
          :ID="user.ID"
          :RealName="user.RealName"
          :Age="user.Age"
          :Country="user.Country"
          :Online="user.Online"
          :Thumbnail="user.Thumbnail"
          removable
          @onRemoveClick="$emit('onRemove', user)"
        />
      </swiper-slide>
      <div class="swiper-scrollbar" slot="scrollbar"></div>
    </swiper>
  </div>
</template>

<script>
import UserRelation from '@/components/Users/UserRelation.vue';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css';

export default {
  name: 'LadyFilterSelected',
  props: ['data'],
  components: {
    UserRelation,
    swiper,
    swiperSlide,
  },
  data() {
    return {
      swiperOption: {
        direction: 'horizontal',
        loop: false,
        watchOverflow: true,
        setWrapperSize: false,
        spaceBetween: 20,
        slidesPerView: 'auto',
        normalizeSlideIndex: true,
        freeMode: true,
        freeModeSticky: true,
        scrollbar: {
          el: '.swiper-scrollbar',
          draggable: true,
        },
      },
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme/utils.scss';

.lfs {
  overflow: hidden;
  margin: 0px -10px 0;
  &__card {
    width: 100%;
    padding: 20px 0 0;
    flex: 0 0 150px;
    max-width: 150px;
    min-height: 0px;
    min-width: 1px;
  }
}

.swiper-container {
  padding: 10px 10px;
  overflow: visible;
}

.swiper-scrollbar {
  background: rgba(black, 0.2);
  height: 3px;
  bottom: 0;
  left: 10px;
  right: 10px;
  width: calc(100% - 20px);
}
</style>

<style lang="scss">
@import '@/theme/utils.scss';

.swiper-scrollbar-drag {
  background: $colorOrange;
}
</style>
