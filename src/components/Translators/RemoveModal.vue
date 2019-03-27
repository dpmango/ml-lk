<template>
  <modal
    name="remove-translator"
    :adaptive="true"
    width="380"
    height="auto"
    @before-open="beforeOpen"
  >
    <div class="modal">
      <div class="modal__close" @click="closeModal">
        <svg-icon name="close" width="14" height="14"/>
      </div>
      <div class="modal__title">
        Переводчик
        <strong>{{name}}</strong>
        <br>
        {{actionType}}
      </div>
      <div class="modal__info" v-if="isRemovedAlready">
        <p>Удален: {{removalDateFormated}}</p>
        <p>Причина: {{removalReason}}</p>
      </div>

      <div class="modal__content">
        <Notification v-if="errorMessage" type="danger">{{errorMessage}}</Notification>
        <form @submit="handleSubmit">
          <template v-if="!isRemovedAlready">
            <multiselect
              v-model="form.reason"
              :options="selectOptions"
              placeholder="Укажите причину"
            />
            <ui-input
              v-if="shouldShowInput"
              group
              type="textarea"
              v-model="form.reasonInput"
              placeholder="Причина"
            />
          </template>

          <div class="modal__cta">
            <template v-if="!isRemovedAlready">
              <Button orange type="submit">Удалить</Button>
            </template>
            <template v-else-if="isRemovedAlready">
              <Button primary type="submit">Восстановить</Button>
            </template>
            <Button @click="closeModal">Отмена</Button>
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
import { timestampToDate } from '@/helpers/Dates';
import api from '@/helpers/Api';

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
  // props: {
  //   // name: String,
  // },

  data() {
    return {
      name: '',
      id: '',
      removalDate: '',
      removalReason: '',
      errorMessage: '',
      form: defaultFormState,
      selectOptions: ['Причина №1', 'Причина №2', 'Другое'],
    };
  },
  computed: {
    isRemovedAlready() {
      return this.removalDate !== '0' && this.removalReason !== '-';
    },
    actionType() {
      return this.isRemovedAlready ? 'удален' : 'будет удален';
    },
    shouldShowInput() {
      return this.form.reason === 'Другое';
    },
    removalDateFormated() {
      return timestampToDate(this.removalDate);
    },
  },
  methods: {
    beforeOpen(event) {
      this.name = event.params.name;
      this.id = event.params.id;
      this.removalDate = event.params.removalDate;
      this.removalReason = event.params.removalReason;
    },
    closeModal() {
      this.$modal.hide('remove-translator');
    },
    getReason() {
      return this.reason !== 'Другое' ? this.form.reason : this.form.reasonInput;
    },
    handleSubmit(e) {
      e.preventDefault();
      if (this.isRemovedAlready) {
        api
          .patch(`translators/${this.id}`, {
            type: 'restore',
            reason: '-',
          })
          .then(res => this.handleResponce(res))
          .catch((error) => {
            console.log(error);
          });
      } else if (!this.isRemovedAlready) {
        api
          .delete(`translators/${this.id}`, {
            data: {
              reason: this.getReason(),
            },
          })
          .then(res => this.handleResponce(res))
          .catch((error) => {
            console.log(error);
          });
      }
    },
    handleResponce(res) {
      console.log(res);
      if (res.data[0].success) {
        this.form = defaultFormState;
        this.errorMessage = '';
        this.$emit('sucessCallback');
        this.closeModal();
      } else {
        this.errorMessage = res.data[0].message;
      }
    },
  },
};
</script>

<style lang="scss">
@import '@/theme/vendor/select.scss';

.v--modal-overlay .v--modal-box {
  overflow: visible;
}
</style>

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
  &__info{
    margin: 20px 0;
    font-size: 11px;
    color: rgba($fontColor, .6)
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
