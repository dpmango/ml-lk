<template>
  <modal
    name="detach-translator-confirmation"
    :adaptive="true"
    width="380"
    height="auto"
    @before-open="beforeOpen"
    @before-close="resetState"
  >
    <div class="modal">
      <div class="modal__close" @click="closeModal">
        <svg-icon name="close" width="14" height="14"/>
      </div>
      <div class="modal__title">
        <template v-if="lady.name">
          <strong>{{lady.name}}</strong> будет удалена у переводчика
          <br>
          <strong>{{translator.name}}</strong>
        </template>
      </div>

      <div class="modal__content">
        <Notification v-if="errorMessage" type="danger">{{errorMessage}}</Notification>
        <form @submit="handleSubmit">
          <div class="modal__cta">
            <Button orange type="submit">Удалить</Button>
            <Button type="button" @click="closeModal">Отмена</Button>
          </div>
        </form>
      </div>
    </div>
  </modal>
</template>

<script>
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';
import Button from '@/components/Shared/UI/Button.vue';
import Notification from '@/components/Shared/UI/Notification.vue';
import api from '@/helpers/Api';

export default {
  name: 'DetachConfirmModal',
  components: {
    SvgIcon,
    Button,
    Notification,
  },

  data() {
    return {
      lady: '',
      translator: '',
      errorMessage: '',
    };
  },
  computed: {

  },
  methods: {
    beforeOpen(event) {
      this.lady = event.params.lady;
      this.translator = event.params.translator;
    },
    closeModal() {
      this.$modal.hide('detach-translator-confirmation');
    },
    resetState() {
      this.errorMessage = '';
    },
    handleSubmit(e) {
      e.preventDefault();

      api.delete(`translators/${this.translator.id}/ladies`, {
        data: {
          ladies: this.lady.id,
        },
      }).then((res) => {
        const apiData = res.data[0];
        if (apiData.success) {
          this.resetState();
          this.$emit('sucessCallback');
          this.closeModal();
        } else {
          this.errorMessage = apiData.message;
        }
      }).catch((error) => {
        this.errorMessage = error;
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
@include r(375) {
  .modal__cta{
    .btn {
      min-width: 135px;
    }
  }
}
</style>
