<template>
  <div class="page">
    <Header modifier="translators"/>
    <div class="page__content">
      <Container>
        <div class="grid">
          <div class="col col--translators">
            <TranslatorsList/>
          </div>
          <div class="col col--girls">
            <LadiesList/>
          </div>
        </div>
      </Container>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Shared/Header.vue';
import Container from '@/components/Shared/Layout/Container.vue';
import TranslatorsList from '@/components/TranslatorsList.vue';
import LadiesList from '@/components/LadiesList.vue';

export default {
  name: 'Translators',
  components: {
    Header,
    Container,
    TranslatorsList,
    LadiesList,
  },
};
</script>

<style scoped lang="scss">
@import '@/theme/utils.scss';

.grid {
  display: flex;
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
    flex-shrink: 1;
    flex-basis: 64%;
    max-width: 64%;
  }
  &--girls {
    flex-basis: 500px;
    max-width: 500px;
  }
}
@include r($xl) {
  .grid {
    flex-wrap: wrap;
    padding-bottom: 40px;
  }
  .col {
    &--translators {
      flex-basis: 100%;
      max-width: 100%;
      margin-bottom: 20px;
    }
    &--girls {
      flex-basis: 100%;
      max-width: 100%;
    }
  }
}
@include r($sm) {
  .grid {
    margin-left: -25px;
    margin-right: -25px;
  }
}
</style>
