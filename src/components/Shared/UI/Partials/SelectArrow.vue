<template>
  <div class="multiselect__select multiselect__select--svg">
    <svg-icon name="down-arrow" width="10" height="6"/>
  </div>
</template>

<script>
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';

export default {
  name: 'SelectArrow',
  components: {
    SvgIcon,
  },
};
</script>
