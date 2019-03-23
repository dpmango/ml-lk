<template>
  <modal name="block-translator" :adaptive="true" width="380" height="auto">
    <div class="modal">
      <div class="modal__close" @click="$modal.hide('block-translator')">
        <svg-icon name="close" width="14" height="14"/>
      </div>
      <div class="modal__title">
        Переводчик
        <strong>{{name}}</strong>
        <br>будет заблокирован
      </div>

      <div class="modal__content">
        <Notification v-if="errorMessage" type="danger">{{errorMessage}}</Notification>
        <form @submit="handleSubmit">
          <multiselect
            v-model="form.reason"
            :options="selectOptions"
            placeholder="Укажите причину"
          />
          <ui-input v-if="shouldShowInput" group v-model="form.reasonInput" placeholder="Причина"/>

          <div class="modal__cta">
            <Button orange type="submit">Заблокировать</Button>
            <Button @click="$modal.hide('block-translator')">Отмена</Button>
          </div>
        </form>
      </div>
    </div>
  </modal>
</template>

<script>
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';
import Button from '@/components/Shared/UI/Button.vue';
import UiInput from '@/components/Shared/UI/Input.vue';
import Multiselect from 'vue-multiselect';
import Notification from '@/components/Shared/UI/Notification.vue';
// import api from '@/helpers/Api';

const defaultFormState = {
  reason: '',
  reasonInput: '',
};

export default {
  name: 'RemoveModal',
  components: {
    SvgIcon,
    Button,
    UiInput,
    Multiselect,
    Notification,
  },
  props: {
    name: String,
  },
  data() {
    return {
      errorMessage: '',
      form: defaultFormState,
      selectOptions: ['Спам', 'Невыполнение обязательств', 'Другое'],
    };
  },
  computed: {
    shouldShowInput() {
      return this.form.reason === 'Другое';
    },
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      // api
      //   .post('translators', {

      //   })
      //   .then((res) => {
      //     if (res.data[0].success) {
      //       this.form = defaultFormState;
      //       this.errorMessage = '';
      //     } else {
      //       this.errorMessage = res.data[0].message;
      //     }
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
    },
  },
};
</script>

<style lang="scss">
@import '@/theme/vendor/select.scss';
</style>

<style lang="scss" scoped>
@import '@/theme/utils.scss';

.v--modal-overlay .v--modal-box {
  overflow: visible;
}
.modal {
  padding: 35px 20px;
  &__title {
    font-weight: 400;
    line-height: 1.28;
    font-size: 14px;
    text-align: center;
    strong {
      font-weight: 700;
    }
  }
  &__close {
    position: absolute;
    top: 10px;
    right: 10px;
    margin-left: auto;
    cursor: pointer;
    padding: 10px;
    color: rgba($fontColor, 0.4);
    transition: color 0.25s ease-in-out;
    &:hover {
      color: $colorRed;
    }
  }
  &__content {
    margin-top: 20px;
    .multiselect {
      margin-bottom: 20px;
    }
  }
  &__cta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .btn {
      padding-left: 10px;
      padding-right: 10px;
      min-width: 160px;
    }
  }
}
</style>
