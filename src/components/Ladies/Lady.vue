<template>
  <div class="lady" :data-id="lady.ID">
    <div class="lady__avatar">
      <img :src="lady.Thumbnail" :alt="lady.RealName">
    </div>
    <div class="lady__details lady-details">
      <div class="lady-details__top">
        <div class="lady-details__id">ID: {{lady.ID}}</div>
        <div class="lady-details__status">{{lady.Status}}</div>
      </div>
      <div class="lady-details__name">
        <span v-if="lady.RealName">{{lady.RealName}}&nbsp;</span>
        <span v-if="lady.LastName">{{lady.LastName}}</span>
        <span v-if="lady.DateOfBirth">, {{age}}</span>
      </div>
      <div class="lady-details__nickname">{{lady.NickName}}</div>
      <div class="lady-details__registered">Зарегистрирована: {{registration}}</div>
    </div>
    <div class="lady__translator">
      <span v-if="lady.Translator">{{lady.Translator.FirstName}} {{lady.Translator.LastName}}</span>
      <span v-else>Прикрепить к переводчику</span>
    </div>
    <div class="lady__actions">
      <svg-icon name="edit" width="14" height="14"/>
    </div>
  </div>
</template>


<script>
import moment from 'moment';
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';

export default {
  name: 'Lady',
  components: {
    SvgIcon,
  },
  props: {
    lady: {
      ID: String,
      NickName: String,
      RealName: String,
      LastName: String,
      DateOfBirth: String,
      City: String,
      Country: String,
      LastReg: String,
      Status: Number,
      Thumbnail: String,
      Translator: {
        ID: String,
        FirstName: String,
        LastName: String,
      },
    },
  },
  computed: {
    age() {
      const birthday = moment(this.lady.DateOfBirth, 'YYYY-MM-DD');
      return birthday.diff(moment(), 'years') * -1;
    },
    registration() {
      const date = moment.unix(this.lady.LastReg);
      return date.format('DD.MM.YYYY');
    },
  },
};
</script>

<style lang="scss" scoped>
.lady {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
  &__avatar {
    position: relative;
    z-index: 1;
    overflow: hidden;
    flex: 0 0 70px;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      max-width: 101%;
      transform: translate(-50%, -50%);
    }
  }
  &__details {
    padding-left: 20px;
  }
  &__translator {
    max-width: 75px;
    font-size: 11px;
    margin-left: auto;
    margin-right: auto;
  }
  &__actions {
    padding-left: 35px;
  }
}

.lady-details {
  &__top {
    display: flex;
    align-items: center;
  }
  &__id {
    font-size: 11px;
  }
  &__status {
    margin-left: auto;
    font-size: 11px;
  }
  &__name {
    font-size: 14px;
    margin-top: 5px;
  }
  &__nickname {
    font-size: 11px;
    margin-top: 5px;
  }
  &__registered {
    margin-top: 5px;
    font-size: 10px;
  }
}
</style>
