import throttle from 'lodash/throttle';

const tryMount = {
  data() {
    return {
      listMounted: false,
    };
  },
  created() {
    this.scrollWithThrottle = throttle(this.handleListScroll, 100);
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
      }
    },
    tryUnmount() {
      if (this.listMounted && this.$refs.list) {
        this.listMounted = false;
        this.$refs.list.removeEventListener('scroll', this.scrollWithThrottle, false);
      }
    },
  },
};

export default tryMount;
