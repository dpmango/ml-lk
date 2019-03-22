<template>
  <div class="lady" :data-id="lady.ID">
    <div class="lady__avatar">
      <img :src="lady.Thumbnail" :alt="lady.RealName">
    </div>
    <div class="lady__details lady-details">
      <div class="lady-details__top">
        <div class="lady-details__id">ID: {{lady.ID}}</div>
        <div class="lady-details__status">{{renderStatus}}</div>
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
      <span v-if="lady.Translator">
        {{lady.Translator.FirstName}}
        <br>
        {{lady.Translator.LastName}}
      </span>
      <span class="lady__attach" v-else>
        <span>Прикрепить к переводчику</span>
      </span>
    </div>
    <div class="lady__actions">
      <div @click="handleEditClick" class="lady__edit">
        <svg-icon name="edit" width="14" height="14"/>
      </div>
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
    renderStatus() {
      switch (this.lady.Status) {
        case 1:
          return 'Активна';
        case 2:
          return 'На проверке';
        case 3:
          return 'Отклонена';
        case 4:
          return 'Удалена';
        default:
          return '';
      }
    },
  },
  methods: {
    handleEditClick() {
      console.log('edit click');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme/utils.scss';

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
    flex: 0 0 175px;
    padding-left: 20px;
  }
  &__translator {
    flex: 0 0 95px;
    padding-left: 20px;
    font-size: 11px;
    line-height: 1.57;
    margin-left: auto;
    margin-right: auto;
  }
  &__attach {
    display: inline-block;
    cursor: pointer;
    span {
      transition: border 0.25s ease-in-out;
      border-bottom: 1px dashed rgba(black, 0.4);
    }
    &:hover {
      span {
        border-color: $colorPrimary;
      }
    }
  }
  &__actions {
    padding-left: 35px;
  }
  &__edit {
    color: #a5a5a5;
    padding: 10px;
    cursor: pointer;
    transition: color 0.25s ease-in-out;
    &:hover {
      color: $colorPrimary;
    }
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
