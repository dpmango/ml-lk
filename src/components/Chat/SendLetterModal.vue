<template>
  <modal
    name="send-letter"
    :adaptive="true"
    width="570"
    height="auto"
    :scrollable="true"
    @before-open="beforeOpen"
    @before-close="resetState"
  >
    <div class="modal">
      <div class="modal__close" @click="closeModal">
        <svg-icon name="close" width="14" height="14" />
      </div>
      <div class="modal__title">Написать письмо</div>

      <div class="modal__content">
        <Notification v-if="errorMessage" type="danger">{{errorMessage}}</Notification>
        <form @submit="handleSubmit">
          <ui-input group v-model="form.subject" placeholder="Тема" />
          <ui-input
            group
            type="textarea"
            :minheight="240"
            :maxheight="350"
            v-model="form.text"
            placeholder="Текст"
          />

          <div class="modal__cta">
            <Button orange type="submit">Отправить</Button>
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
import Notification from '@/components/Shared/UI/Notification.vue';
import api from '@/helpers/Api';

const defaultFormState = {
  subject: '',
  text: '',
};

export default {
  name: 'SendLetterModal',
  components: {
    SvgIcon,
    Button,
    UiInput,
    Notification,
  },
  data() {
    return {
      users: {},
      errorMessage: '',
      form: cloneDeep(defaultFormState),
    };
  },
  computed: {},
  methods: {
    beforeOpen(event) {
      this.users = event.params.users;
    },
    closeModal() {
      this.$modal.hide('send-letter');
    },
    resetState() {
      this.errorMessage = '';
      this.form = cloneDeep(defaultFormState);
    },

    handleSubmit(e) {
      e.preventDefault();
      api
        .post(`messages`, {
          man: this.users.man,
          lady: this.users.lady,
          subject: this.form.subject,
          text: this.form.text,
        })
        .then(res => this.handleResponce(res))
        .catch(error => {
          console.log(error);
        });
    },
    handleResponce(res) {
      if (res.data[0].success) {
        this.resetState();
        // this.$emit('sucessCallback');
        this.showNotification({ type: 'success', message: 'Сообщение успешно отправлено' });
        this.closeModal();
      } else {
        this.errorMessage = res.data[0].message;
        // this.showNotification({ message: res.data[0].message });
      }
    },
  },
  notifications: {
    showNotification: {
      title: 'Ошибка',
      type: 'error',
    },
  },
};
</script>

<style lang="scss">
[data-modal='send-letter'] {
  .v--modal-box.v--modal {
    margin-top: 0;
    margin-bottom: 0;
  }
}
</style>

<style lang="scss" scoped>
@import '@/theme/utils.scss';

.modal {
  &__title {
    background: $colorBg;
    align-items: center;
    min-height: 40px;
    padding: 5px 15px 5px 20px;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      font-weight: 700;
    }
  }
  &__close {
    position: absolute;
    top: 0px;
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
    padding: 20px 20px;
  }
  &__info {
    margin: 20px 0;
    font-size: 11px;
    color: rgba($fontColor, 0.6);
  }
  &__cta {
    text-align: center;
  }
}
@include r(375) {
  .modal__cta {
  }
}
</style>
