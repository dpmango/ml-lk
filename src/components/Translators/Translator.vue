<template>
  <div class="translator">
    <div class="translator__name">{{translator.FirstName}} {{translator.LastName}}</div>
    <div class="translator__count">{{translator.LadiesCount}}</div>
  </div>
</template>


<script>
export default {
  name: 'Translator',
  props: {
    translator: {
      ID: String,
      NickName: String,
      FirstName: String,
      LastName: String,
      Notes: String,
      Status: Number,
      BlockDate: String,
      BlockReason: String,
      RemovalDate: String,
      RemovalReason: String,
      LadiesCount: String,
    },
  },
};
</script>

<style lang="scss" scoped>
.translator {
  min-height: 48px;
  display: flex;
  align-items: center;
  &__name {
    opacity: 0.8;
    font-size: 14px;
  }
}
</style>
