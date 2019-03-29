<template>
  <div
    class="lady"
    :class="{'is-selectable': type === 'select'}"
    :data-id="lady.ID"
    @click="handleClick"
  >
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
    <template v-if="type === 'attached'">
      <div class="lady__translator lady__translator--actions">
        <span class="lady__attach">
          <span>Изменить переводчика</span>
        </span>
        <span class="lady__attach" @click="handleDetachClick">
          <span>Удалить переводчика</span>
        </span>
      </div>
    </template>
    <template v-if="!type">
      <div class="lady__translator">
        <span v-if="lady.Translator" @click="handleAttachClick">
          {{lady.Translator.FirstName}}
          <br>
          {{lady.Translator.LastName}}
        </span>
        <span v-else class="lady__attach" @click="handleAttachClick">
          <span>Прикрепить к переводчику</span>
        </span>
      </div>
      <div class="lady__actions">
        <div @click="handleEditClick" class="lady__edit">
          <svg-icon name="edit" width="14" height="14"/>
        </div>
      </div>
    </template>
  </div>
</template>


<script>
import { timestampToDate, dateToAge } from '@/helpers/Dates';
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';

export default {
  name: 'Lady',
  components: {
    SvgIcon,
  },
  props: {
    type: String,
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
      return dateToAge(this.lady.DateOfBirth);
    },
    registration() {
      return timestampToDate(this.lady.LastReg);
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
    handleClick() {
      if (this.type === 'select') {
        this.$emit('selectAttach', this.lady.ID);
      }
    },
    handleAttachClick() {
      this.$modal.show('attach-translator', {
        lady: this.lady,
      });
    },
    handleDetachClick() {
      this.$emit('detachClick', this.lady.ID);
    },
    handleEditClick() {
      console.log('TBD - edit lady');
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
    &--actions{
      flex-basis: 145px;
      margin-right: 0;
      .lady__attach{
        margin-bottom: 1em;
        &:last-child{
          margin-bottom: 0;
        }
      }
    }
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
  &.is-selectable{
    margin-left: -20px;
    margin-right: -20px;
    padding: 10px 20px;
    margin-bottom: 0;
    cursor: pointer;
    transition: background .25s ease-in-out;
    &:hover{
      background: rgba(#190F44, .1);
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
