<template>
  <modal name="add-translator" :adaptive="true" width="640" height="auto">
    <div class="modal">
      <div class="modal__head">
        <div class="modal__title">Добавление переводчика</div>
        <div class="modal__close" @click="$modal.hide('add-translator')">
          <svg-icon name="close" width="14" height="14"/>
        </div>
      </div>
      <div class="modal__content">
        <Notification v-if="errorMessage" type="danger">{{errorMessage}}</Notification>
        <form @submit="handleSubmit">
          <div class="modal__inputs">
            <div class="modal__col-50">
              <ui-input group required v-model="form.name" placeholder="Имя"/>
              <ui-input group required v-model="form.surname" placeholder="Фамилия"/>
              <ui-input group v-model="form.phone" type="tel" placeholder="Телефон"/>
              <ui-input group v-model="form.skype" placeholder="Skype"/>
              <ui-input group v-model="form.passport" placeholder="Номер и серия паспорта"/>
            </div>
            <div class="modal__col-50">
              <ui-input group required v-model="form.email" type="email" placeholder="Email"/>
              <ui-input group v-model="form.adress" placeholder="Адрес"/>
              <ui-input group required v-model="form.login" placeholder="Логин"/>
              <ui-input
                group
                required
                v-model="form.password"
                type="password"
                placeholder="Пароль"
              />
              <ui-input group v-model="form.bankCredentials" placeholder="Реквизиты банка"/>
            </div>
          </div>

          <div class="modal__inputs">
            <div class="modal__col-50"></div>
            <div class="modal__col-50">
              <ui-input group v-model="form.notes" placeholder="Комментарии"/>
            </div>
          </div>

          <div class="modal__cta">
            <Button orange type="submit">Добавить переводчика</Button>
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
import Notification from '@/components/Shared/UI/Notification.vue';
import api from '@/helpers/Api';

const defaultFormState = {
  name: '',
  surname: '',
  phone: '',
  skype: '',
  passport: '',
  email: '',
  adress: '',
  login: '',
  password: '',
  bankCredentials: '',
  notes: '',
  file: '',
  price_1: '',
};

export default {
  name: 'AddModal',
  components: {
    SvgIcon,
    UiInput,
    Button,
    Notification,
  },
  data() {
    return {
      errorMessage: '',
      form: defaultFormState,
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      api
        .post('translators', {
          login: this.form.login, // логин (обязательно)
          fname: this.form.name, // имя (обязательно)
          lname: this.form.surname, // фамилия (обязательно)
          phone: this.form.phone, // телефон
          passport: this.form.passport, // номер и серия паспорта
          email: this.form.email, // емейл (обязательно)
          // ADRESS ?
          skype: this.form.skype, // скайп
          password: this.form.password, // пароль (обязательно)
          bank: this.form.bankCredentials, // реквизиты
          notes: this.form.notes, // комментарии
          file: this.form.file, // имя загруженного файла
          price_1: this.form.price_1, // фин.показатели 1..7
        })
        .then((res) => {
          console.log(res.data, res.data.message);
          if (res.data[0].success) {
            this.form = defaultFormState;
            this.errorMessage = '';
          } else {
            this.errorMessage = res.data[0].message;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme/utils.scss';

.modal {
  padding: 20px 20px;
  &__head {
    display: flex;
    align-items: center;
  }
  &__title {
    font-weight: 500;
    font-size: 14px;
  }
  &__close {
    margin-top: -10px;
    margin-right: -10px;
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
  }
  &__inputs {
    display: flex;
    flex-wrap: wrap;
    margin-left: -10px;
    margin-right: -10px;
  }
  &__col-50 {
    width: 100%;
    flex: 0 0 50%;
    max-width: 50%;
    min-width: 1px;
    min-height: 0;
    padding-left: 10px;
    padding-right: 10px;
  }
  &__cta {
    margin: 20px 0;
    text-align: center;
  }
}
</style>
