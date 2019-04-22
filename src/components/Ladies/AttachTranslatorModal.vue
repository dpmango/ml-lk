<template>
  <modal
    name="attach-translator"
    :adaptive="true"
    width="255"
    height="auto"
    @before-open="beforeOpen"
    @before-close="beforeClose"
    :pivotX="pivotX"
  >
    <div class="modal">
      <div class="modal__close" @click="closeModal">
        <svg-icon name="close" width="14" height="14"/>
      </div>
      <div class="modal__head">
        <div class="modal__head-avatar">
          <img :src="lady.Thumbnail" :alt="lady.RealName">
        </div>
        <div class="modal__head-content">
          <div class="modal__head-name">
            <span v-if="lady.RealName">{{lady.RealName}}</span>
            <span v-if="lady.DateOfBirth">, {{age}}</span>
          </div>
          <div class="modal__head-location">
            <span v-if="lady.City">{{lady.City}}</span>
            <span v-if="lady.Country">, {{lady.Country}}</span>
          </div>
        </div>
      </div>
      <div class="modal__list">
        <Notification v-if="errorMessage" type="danger">{{errorMessage}}</Notification>
        <div
          v-for="(translator, idx) in translatorsResults"
          class="translator-row"
          :class="{'is-current': translator.isCurrent}"
          :key="idx"
          @click="handleTranslatorClick(translator.id)"
        >
          <span class="translator-row__name">{{translator.name}}</span>
          <span class="translator-row__count">
            <span>{{translator.count.join('/')}}</span>
          </span>
        </div>
      </div>
      <!-- <div class="modal__cta">
        <Button orange block @click="closeModal">Выбрать</Button>
      </div>-->
    </div>
  </modal>
</template>

<script>
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';
// import Button from '@/components/Shared/UI/Button.vue';
import Notification from '@/components/Shared/UI/Notification.vue';
import { dateToAge } from '@/helpers/Dates';
import api from '@/helpers/Api';

export default {
  name: 'AttachTranslatorModal',
  components: {
    SvgIcon,
    // Button,
    Notification,
  },
  data() {
    return {
      pivotX: 0.5,
      attachedTranslatorID: '',
      lady: '',
      errorMessage: '',
    };
  },
  computed: {
    age() {
      return dateToAge(this.lady.DateOfBirth);
    },
    translatorsResults() {
      return this.$store.getters.activeTranslators ? this.$store.getters.activeTranslators.map(t => ({
        id: t.ID,
        name: `${t.FirstName} ${t.LastName}`,
        count: t.LadiesCount,
        isCurrent: t.ID === this.attachedTranslatorID,
      })) : [];
    },
  },
  methods: {
    beforeOpen(event) {
      this.lady = event.params.lady;
      this.attachedTranslatorID = event.params.lady.Translator ? event.params.lady.Translator.ID : event.params.translatorID;
      this.pivotX = event.params.pivotX;
    },
    beforeClose() {
      this.resetState();
    },
    closeModal() {
      this.$modal.hide('attach-translator');
    },
    resetState() {
      this.errorMessage = '';
    },
    fetchTranslators() {
      api
        .get('translators')
        .then((res) => {
          this.$store.commit('updateTranslators', res.data);
        });
    },
    handleTranslatorClick(id) {
      const attach = (translatorId) => {
        api.post(`translators/${translatorId}/ladies`, {
          ladies: this.lady.ID,
        }).then((res) => {
          const apiData = res.data[0];
          if (apiData.success) {
            this.attachedTranslatorID = translatorId;
            // this.fetchTranslators();
            this.errorMessage = '';
            this.$emit('sucessCallback');
            this.closeModal();
          } else {
            this.errorMessage = apiData.message;
          }
        });
      };

      const detach = (translatorId) => {
        api.delete(`translators/${translatorId}/ladies`, {
          data: {
            ladies: this.lady.ID,
          },
        }).then((res) => {
          const apiData = res.data[0];
          if (apiData.success) {
            this.attachedTranslatorID = '';
            // this.fetchTranslators();
            this.errorMessage = '';
            this.$emit('sucessCallback');
            this.closeModal();
          } else {
            this.errorMessage = apiData.message;
          }
        });
      };

      // if (this.attachedTranslatorID === id) {
      //   // detach by clicking active
      //   detach(id);
      // } else if (this.attachedTranslatorID) {
      //   // detach and attached clicked if any is attached
      //   detach(id, true);
      // } else {
      //   // attach if noboddy attached
      //   attach(id);
      // }

      // new API - reatach should works
      if (this.attachedTranslatorID === id) {
        // detach by clicking active
        detach(id);
      } else {
        // attach or reatach
        attach(id);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme/utils.scss';

.modal {
  max-height: calc(100vh - 120px);
  &__close {
    position: absolute;
    top: 5px;
    right: 5px;
    margin-left: auto;
    cursor: pointer;
    padding: 10px;
    color: rgba($fontColor, 0.4);
    transition: color 0.25s ease-in-out;
    &:hover {
      color: $colorRed;
    }
  }
  &__head{
    padding: 20px 20px 10px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #D1CFDA;
  }
  &__head-avatar{
    position: relative;
    z-index: 1;
    overflow: hidden;
    flex: 0 0 50px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      max-width: 101%;
      transform: translate(-50%, -50%);
    }
  }
  &__head-content{
    flex: 1 1 auto;
    padding-left: 12px;
  }
  &__head-name{
    font-size: 14px;
    line-height: 18px;
  }
  &__head-location{
    margin-top: 5px;
    font-size: 11px;
    line-height: 14px;
    color: rgba($fontColor, .6);
  }
  &__list{
    flex: 1 1 auto;
  }
  &__cta{
    padding: 20px;
  }
}

.translator-row{
  display: flex;
  align-items: center;
  padding: 12px 20px;
  font-size: 14px;
  color: rgba($fontColor, .8);
  cursor: pointer;
  transition: background .25s ease-in-out;
  &__name{
    flex: 1 1 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 15px;
  }
  &__count{
    margin-left: auto;
  }
  &:hover, &.is-current{
    background: rgba(#190F44, .1);
  }
}
</style>
