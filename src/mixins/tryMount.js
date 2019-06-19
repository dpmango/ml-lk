import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';

const tryMount = {
  data() {
    return {
      listMounted: false,
    };
  },
  created() {
    this.scrollWithThrottle = throttle(this.handleListScroll, 100);
    if (this.MountWithDebounceScroll) {
      this.scrollWithDebounce = debounce(
        this.handleListScrollDebounce,
        this.MountWithDebounceScroll,
      );
    }
  },
  mounted() {
    this.tryMount();
  },
  updated() {
    this.tryMount();
  },
  beforeDestroy() {
    this.tryUnmount();
  },
  methods: {
    tryMount() {
      if (!this.listMounted && this.$refs.list) {
        this.listMounted = true;
        this.$refs.list.addEventListener('scroll', this.scrollWithThrottle, false);
        if (this.MountWithDebounceScroll) {
          this.$refs.list.addEventListener('scroll', this.scrollWithDebounce, false);
        }
      }
    },
    tryUnmount() {
      if (this.listMounted && this.$refs.list) {
        this.listMounted = false;
        this.$refs.list.removeEventListener('scroll', this.scrollWithThrottle, false);
        if (this.MountWithDebounceScroll) {
          this.$refs.list.removeEventListener('scroll', this.scrollWithDebounce, false);
        }
      }
    },
  },
};

export default tryMount;
