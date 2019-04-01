<template>
  <modal
    name="add-translator"
    :adaptive="true"
    width="640"
    height="auto"
    :scrollable="true"
    @before-open="beforeOpen"
    @before-close="resetState"
  >
    <div class="modal">
      <div class="modal__head">
        <div class="modal__title">{{actionType}} переводчика</div>
        <div class="modal__close" @click="closeModal">
          <svg-icon name="close" width="14" height="14"/>
        </div>
      </div>
      <div class="modal__content">
        <Notification v-if="errorMessage" type="danger">{{ errorMessage }}</Notification>
        <form @submit="handleSubmit">
          <div class="modal__inputs">
            <div class="modal__col-50">
              <ui-input group required v-model="form.name" placeholder="Имя"/>
              <ui-input group required v-model="form.surname" placeholder="Фамилия"/>
              <ui-input group v-model="form.phone" type="tel" placeholder="Телефон"/>
              <ui-input group v-model="form.skype" placeholder="Skype"/>
              <ui-input group v-model="form.passport" placeholder="Номер и серия паспорта"/>
              <img v-if="form.file" :src="form.file">
              <vue-dropzone
                :include-styling="true"
                ref="DropzoneRef"
                id="dropzone-translators-add"
                :options="dropzoneOptions"
                :useCustomSlot="true"
                @vdropzone-success="handleDropzoneSucess"
                @vdropzone-error="handleDropzoneError"
                @vdropzone-removed-file="handleDropzoneRemove"
              >
                <div class="dropzone-custom-message">
                  <svg-icon name="attach" width="16" height="16"/>
                  <span>Прикрепить скан паспорта</span>
                </div>
              </vue-dropzone>
            </div>
            <div class="modal__col-50">
              <ui-input group required v-model="form.email" type="email" placeholder="Email"/>
              <ui-input group v-model="form.adress" placeholder="Адрес"/>
              <ui-input group required v-model="form.login" placeholder="Логин"/>
              <ui-input
                group
                :required="type === 'add'"
                v-model="form.password"
                type="password"
                :placeholder="passwordPlaceholder"
              />
              <ui-input
                group
                v-model="form.bankCredentials"
                type="textarea"
                placeholder="Реквизиты банка"
              />
            </div>
          </div>

          <div class="modal__title modal__title--section">Финансовые показатели</div>
          <div class="modal__inputs">
            <div class="modal__col-50">
              <div class="ui-input-row">
                <label for="price_1">Входящее письмо</label>
                <ui-input compact min="0" max="100" v-model="form.prices.price_1" name="price_1"/>
                <span class="ui-input-row__helper">% = {{ getCommission(1) }}</span>
              </div>
              <div class="ui-input-row">
                <label for="price_2">Исходящее письмо</label>
                <ui-input compact min="0" max="100" v-model="form.prices.price_2" name="price_2"/>
                <span class="ui-input-row__helper">% = {{ getCommission(2) }}</span>
              </div>
              <div class="ui-input-row">
                <label for="price_3">Файл в письме</label>
                <ui-input compact min="0" max="100" v-model="form.prices.price_3" name="price_3"/>
                <span class="ui-input-row__helper">% = {{ getCommission(3) }}</span>
              </div>
              <div class="ui-input-row">
                <label for="price_4">Минута чата</label>
                <ui-input compact min="0" max="100" v-model="form.prices.price_4" name="price_4"/>
                <span class="ui-input-row__helper">% = {{ getCommission(4) }}</span>
              </div>
              <div class="ui-input-row">
                <label for="price_5">Файл в чате</label>
                <ui-input compact min="0" max="100" v-model="form.prices.price_5" name="price_5"/>
                <span class="ui-input-row__helper">% = {{ getCommission(5) }}</span>
              </div>
              <div class="ui-input-row">
                <label for="price_6">Видео</label>
                <ui-input compact min="0" max="100" v-model="form.prices.price_6" name="price_6"/>
                <span class="ui-input-row__helper">% = {{ getCommission(6) }}</span>
              </div>
              <div class="ui-input-row">
                <label for="price_7">Доставка</label>
                <ui-input compact min="0" max="100" v-model="form.prices.price_7" name="price_7"/>
                <span class="ui-input-row__helper">%</span>
              </div>
            </div>
            <div class="modal__col-50">
              <ui-input
                group
                type="textarea"
                :minheight="275"
                :maxheight="400"
                v-model="form.notes"
                placeholder="Комментарии"
              />
            </div>
          </div>

          <div class="modal__cta">
            <Button orange type="submit">
              <template v-if="type === 'add'">Добавить переводчика</template>
              <template v-if="type === 'edit'">Сохранить изминения</template>
            </Button>
          </div>
        </form>
      </div>
    </div>
  </modal>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import vue2Dropzone from 'vue2-dropzone';
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
  prices: {
    price_1: '0.00',
    price_2: '0.00',
    price_3: '0.00',
    price_4: '0.00',
    price_5: '0.00',
    price_6: '0.00',
    price_7: '0.00',
  },
};

export default {
  name: 'AddEditModal',
  components: {
    SvgIcon,
    UiInput,
    Button,
    Notification,
    vueDropzone: vue2Dropzone,
  },
  data() {
    return {
      type: '', // action type 'add' or 'edit'
      id: null,
      errorMessage: '',
      form: cloneDeep(defaultFormState),
      status: {
        type: 0,
        blockDate: '',
        blockReason: '',
        removalDate: '',
        removalReason: '',
      },
      rates: {},
      dropzoneOptions: {
        // https://www.dropzonejs.com/#configuration-options
        url: 'https://api-m.marmeladies.com/v1/translators/files',
        method: 'POST',
        headers: { Authorization: 'Bearer BqxKJPW-BrOQA3YbNwp54gFaNcpnO9Iv' },
        thumbnailWidth: 80,
        thumbnailHeight: 90,
        maxFilesize: 5,
        maxFiles: 1,
        addRemoveLinks: true,
        thumbnailMethod: 'crop', // crop or contain
        // previewTemplate: this.dropzoneTemplate(),
      },
    };
  },
  mounted() {
    this.getRates();
  },
  computed: {
    actionType() {
      return this.type === 'edit' ? 'Редактирование' : 'Добавление';
    },
    passwordPlaceholder() {
      return this.type === 'edit' ? 'Новый пароль' : 'Пароль';
    },
  },
  methods: {
    closeModal() {
      this.resetState();
      this.$modal.hide('add-translator');
    },
    getRates() {
      api.get('translators/prices').then((res) => {
        [this.rates] = res.data;
      });
    },
    beforeOpen(event) {
      this.type = event.params.type;
      if (event.params.type === 'edit') {
        this.id = event.params.translatorID;
        api
          .get(`translators/${event.params.translatorID}`)
          .then((res) => {
            const apiData = res.data[0];
            if (apiData) {
              this.status.type = apiData.Status;
              this.status.blockDate = apiData.BlockDate;
              this.status.blockReason = apiData.BlockReason;
              this.status.removalDate = apiData.RemovalDate;
              this.status.removalReason = apiData.RemovalReason;
              // LadiesCount - not used
              this.form.login = apiData.Login;
              this.form.name = apiData.FirstName;
              this.form.surname = apiData.LastName;
              this.form.phone = apiData.Phone;
              this.form.passport = apiData.Passport;
              this.form.email = apiData.Email;
              this.form.address = apiData.Address;
              this.form.skype = apiData.Skype;
              // this.form.password: apiData,
              this.form.bankCredentials = apiData.BankAccount;
              this.form.notes = apiData.Notes;
              this.form.file = apiData.Scan;
              this.form.prices.price_1 = apiData.Price_1;
              this.form.prices.price_2 = apiData.Price_2;
              this.form.prices.price_3 = apiData.Price_3;
              this.form.prices.price_4 = apiData.Price_4;
              this.form.prices.price_5 = apiData.Price_5;
              this.form.prices.price_6 = apiData.Price_6;
              this.form.prices.price_7 = apiData.Price_7;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }

      if (event.params.type === 'add') {
        this.resetState();
      }
    },
    resetState() {
      this.id = null;
      this.form = cloneDeep(defaultFormState);
    },
    getCommission(priceId) {
      const priceName = `Price_${priceId}`;
      const rate = this.rates[priceName];
      const commision = this.form.prices[priceName.toLowerCase()] / 100;
      return `${parseFloat(rate * commision).toFixed(2).toString()} y.e`;
    },
    handleSubmit(e) {
      e.preventDefault();
      const postObject = {
        login: this.form.login, // логин (обязательно)
        fname: this.form.name, // имя (обязательно)
        lname: this.form.surname, // фамилия (обязательно)
        phone: this.form.phone, // телефон
        passport: this.form.passport, // номер и серия паспорта
        email: this.form.email, // емейл (обязательно)
        address: this.form.adress, // адрес
        skype: this.form.skype, // скайп
        password: this.form.password, // пароль (обязательно)
        bank: this.form.bankCredentials, // реквизиты
        notes: this.form.notes, // комментарии
        file: this.form.file, // TODO send multiple ? - имя загруженного файла
        price_1: this.form.prices.price_1, // фин.показатели 1..7
        price_2: this.form.prices.price_2,
        price_3: this.form.prices.price_3,
        price_4: this.form.prices.price_4,
        price_5: this.form.prices.price_5,
        price_6: this.form.prices.price_6,
        price_7: this.form.prices.price_7,
      };

      if (this.type === 'add') {
        api
          .post('translators', postObject)
          .then(res => this.handleResponce(res))
          .catch((error) => {
            this.errorMessage = error;
          });
      }
      if (this.type === 'edit') {
        api
          .put(`translators/${this.id}`, postObject)
          .then(res => this.handleResponce(res))
          .catch((error) => {
            this.errorMessage = error;
          });
      }
    },
    handleResponce(res) {
      console.log(`addEditModal responce - type ${this.type}`, res);
      if (res.data[0].success) {
        this.form = cloneDeep(defaultFormState);
        this.errorMessage = '';
        this.$emit('sucessCallback');
        this.closeModal();
      } else {
        this.errorMessage = res.data[0].message;
      }
    },
    handleDropzoneSucess(file, res) {
      this.form.file = res[0].File;
    },
    handleDropzoneError(file, message, xhr) {
      console.log('error', file, message, xhr);
    },
    handleDropzoneRemove(file) {
      // params error, xhr
      if (file.accepted) {
        api
          .delete('translators/files', {
            data: {
              file: this.form.file,
            },
          })
          .then((res) => {
            if (res.data[0].success) {
              this.form.file = '';
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

  },
};
</script>

<style lang="scss" >
@import '@/theme/utils.scss';
@import '@/theme/vendor/dropzone.scss';

.dropzone-custom-message{
  display: flex;
  align-items: center;
  span{
    display: inline-block;
    margin-left: 8px;
    font-size: 11px;
    color: rgba($fontColor, .6);
    border-bottom: 1px dashed rgba($fontColor, .6)
  }
}

.dz-details, .dz-size, .dz-filename{
  display: none;
}

</style>

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
    &--section{
      margin: 15px 0;
    }
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

.ui-input-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  label {
    flex: 1 1 auto;
    display: inline-block;
    font-size: 14px;
    padding-right: 10px;
  }
  span {
    flex: 0 0 80px;
    max-width: 80px;
    margin-left: 10px;
    min-width: 1px;
    display: inline-block;
    font-size: 14px;
  }
}

@include r($sm) {
  .modal{
    &__col-50{
      flex-basis: 100%;
      max-width: 100%;
      margin-bottom: 20px;
    }
  }
}
</style>
