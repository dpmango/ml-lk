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
      } else {
        this.initialListLoaded = false;
      }
    },
  },
};

export default fetchOnShowModule;
