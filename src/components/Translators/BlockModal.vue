<template>
  <modal
    name="block-translator"
    :adaptive="true"
    width="380"
    height="auto"
    @before-open="beforeOpen"
    @before-close="resetState"
  >
    <div class="modal">
      <div class="modal__close" @click="closeModal">
        <svg-icon name="close" width="14" height="14" />
      </div>
      <div class="modal__title">
        Переводчик
        <strong>{{name}}</strong>
        <br />
        {{actionType}}
      </div>
      <div class="modal__info" v-if="isBlockedAlready">
        <p>Заблокирован: {{blockDateFormated}}</p>
        <p>Причина: {{blockReason}}</p>
      </div>

      <div class="modal__content">
        <Notification v-if="errorMessage" type="danger">{{errorMessage}}</Notification>
        <form @submit="handleSubmit">
          <template v-if="!isBlockedAlready">
            <multiselect
              v-model="form.reason"
              :options="selectOptions"
              placeholder="Укажите причину"
              :searchable="false"
            >
              <template slot="caret">
                <div class="multiselect__select multiselect__select--svg">
                  <svg-icon name="down-arrow" width="10" height="6" />
                </div>
              </template>
            </multiselect>
            <ui-input
              group
              noLabel
              type="textarea"
              v-model="form.reasonInput"
              placeholder="Комментарий"
            />
          </template>

          <div class="modal__cta">
            <template v-if="!isBlockedAlready">
              <Button orange type="submit">Заблокировать</Button>
            </template>
            <template v-else-if="isBlockedAlready">
              <Button primary type="submit">Разблокировать</Button>
            </template>
            <Button type="button" @click="closeModal">Отмена</Button>
          </div>
        </form>
      </div>
    </div>
  </modal>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';
import Button from '@/components/Shared/UI/Button.vue';
import UiInput from '@/components/Shared/UI/Input.vue';
import Multiselect from 'vue-multiselect';
import Notification from '@/components/Shared/UI/Notification.vue';
import { timestampToDate } from '@/helpers/Dates';
import api from '@/helpers/Api';

const defaultFormState = {
  reason: '',
  reasonInput: '',
};

export default {
  name: 'BlockModal',
  components: {
    SvgIcon,
    Button,
    UiInput,
    Multiselect,
    Notification,
  },
  // props: {
  //   // name: String,
  // },

  data() {
    return {
      name: '',
      id: '',
      blockDate: '',
      blockReason: '',
      errorMessage: '',
      form: cloneDeep(defaultFormState),
      selectOptions: ['Спам', 'Невыполнение обязательств', 'Другое'],
    };
  },
  computed: {
    isBlockedAlready() {
      return this.blockDate !== '0' && this.blockReason !== '-';
    },
    actionType() {
      return this.isBlockedAlready ? 'заблокирован' : 'будет заблокирован';
    },
    blockDateFormated() {
      return timestampToDate(this.blockDate);
    },
  },
  methods: {
    beforeOpen(event) {
      this.name = event.params.name;
      this.id = event.params.id;
      this.blockDate = event.params.blockDate;
      this.blockReason = event.params.blockReason;
    },
    closeModal() {
      this.$modal.hide('block-translator');
    },
    resetState() {
      this.errorMessage = '';
      this.form = cloneDeep(defaultFormState);
    },
    getReason() {
      // return this.form.reason !== 'Другое' ? this.form.reason : this.form.reasonInput;
      return `${this.form.reason} : ${this.form.reasonInput}`;
    },
    validate() {
      if (this.form.reason === '') {
        this.errorMessage = 'Выберите причину';
        return false;
      } else if (this.form.reasonInput.trim() === '') {
        this.errorMessage = 'Заполните комментарий';
        return false;
      }
      return true;
    },
    handleSubmit(e) {
      e.preventDefault();

      let patchObj = {};
      if (this.isBlockedAlready) {
        patchObj = {
          type: 'unblock',
          reason: '-',
        };
      } else if (!this.isBlockedAlready) {
        patchObj = {
          type: 'block',
          reason: this.getReason(),
        };
        if (!this.validate()) {
          return false;
        }
      }

      api
        .patch(`translators/${this.id}`, patchObj)
        .then(res => {
          if (res.data[0].success) {
            this.resetState();
            this.$emit('sucessCallback');
            this.closeModal();
          } else {
            this.errorMessage = res.data[0].message;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme/utils.scss';

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
  &__info {
    margin: 20px 0;
    font-size: 11px;
    color: rgba($fontColor, 0.6);
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
@include r(375) {
  .modal__cta {
    .btn {
      min-width: 135px;
    }
  }
}
</style>
