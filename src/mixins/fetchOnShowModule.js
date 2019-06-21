const fetchOnShowModule = {
  data() {
    return {
      initialListLoaded: false,
    };
  },
  mounted() {
    this.shouldShowModuleRouter();
  },
  methods: {
    shouldShowModuleRouter() {
      if (this.shouldShowModule) {
        if (!this.initialListLoaded) {
          this.fetchApi();
          this.initialListLoaded = true;
        }
      } else {
        this.initialListLoaded = false;
      }
    },
  },
  watch: {
    shouldShowModule() {
      this.shouldShowModuleRouter();
    },
  },
};

export default fetchOnShowModule;
