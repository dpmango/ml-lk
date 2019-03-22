<template>
  <Container>
    <div class="grid">
      <div class="col col--translators">
        <Translators/>
      </div>
      <div class="col col--girls">
        <Ladies/>
      </div>
    </div>
  </Container>
</template>

<script>
import Container from '@/components/Shared/Layout/Container.vue';
import Translators from '@/components/Translators.vue';
import Ladies from '@/components/Ladies.vue';

export default {
  name: 'Messenger',
  components: {
    Container,
    Translators,
    Ladies,
  },
};
</script>

<style scoped lang="scss">
.grid {
  display: flex;
  flex-wrap: wrap;
  margin-left: -5px;
  margin-right: -5px;
}
.col {
  width: 100%;
  max-width: 100%;
  flex: 0 0 100%;
  min-width: 1px;
  min-height: 0;
  padding-left: 5px;
  padding-right: 5px;
  &--translators {
    flex-basis: 64%;
    max-width: 64%;
  }
  &--girls {
    flex-basis: 36%;
    max-width: 36%;
  }
}
</style>
