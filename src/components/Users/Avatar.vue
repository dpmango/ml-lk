<template>
  <div class="avatar" :class="{'size-44' : size === 44, 'size-70': size === 70}">
    <div class="avatar__image">
      <img :src="Thumbnail" :alt="RealName">
    </div>
    <span class="avatar__online" :class="{'is-online': Online ==='1'}"></span>
  </div>
</template>

<script>
export default {
  name: 'Relation',
  props: {
    Thumbnail: String,
    RealName: String,
    Online: String,
    size: Number,
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme/utils.scss';
.avatar {
  position: relative;
  flex: 0 0 50px;
  &__image {
    position: relative;
    z-index: 1;
    overflow: hidden;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      max-width: 101%;
      transform: translate(-50%, -50%);
    }
  }
  &__online {
    position: absolute;
    bottom: -5px;
    left: 0;
    z-index: 2;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: $colorRed;
    border: 2px solid white;
    transition: opacity 0.25s ease, background 0.25s ease;
    opacity: 0;
    pointer-events: none;
    &.is-online {
      opacity: 1;
      background: $colorGreen;
    }
  }
  &.size-44 {
    flex-basis: 44px;
    .avatar {
      &__image {
        width: 44px;
        height: 44px;
      }
    }
  }
  &.size-70 {
    flex-basis: 70px;
    .avatar {
      &__image {
        width: 70px;
        height: 70px;
      }
      &__online {
        width: 19px;
        height: 19px;
        border-width: 3px;
        bottom: -3px;
      }
    }
  }
}
</style>
