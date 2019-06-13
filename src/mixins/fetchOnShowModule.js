const fetchOnShowModule = {
  data() {
    return {
      initialListLoaded: false,
    };
  },
  watch: {
    shouldShowModule() {
      if (this.shouldShowModule) {
        if (!this.initialListLoaded) {
          this.fetchApi();
          this.initialListLoaded = true;
        }
      }
    },
  },
};

export default fetchOnShowModule;
