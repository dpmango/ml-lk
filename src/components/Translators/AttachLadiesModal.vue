<template>
  <modal
    name="attach-ladies-translator"
    :adaptive="true"
    width="760"
    height="auto"
    :scrollable="true"
    @before-open="beforeOpen"
    @opened="opened"
    @before-close="beforeClose"
  >
    <div class="modal">
      <div class="modal__close" @click="closeModal">
        <svg-icon name="close" width="14" height="14"/>
      </div>
      <div class="modal__grid">
        <div class="modal__col modal__col--left">
          <div class="list">
            <div class="list__head">
              <div class="modal__title">{{name}}</div>
              <div class="modal__title">{{countLadiesAttached}}</div>
            </div>
            <div class="list__scroller" ref="listLeft">
              <Notification v-if="errorMessage" type="danger">{{errorMessage}}</Notification>
              <template v-if="ladies.attached.length === 0">
                <div class="list__blank-message">
                  <strong>{{name}}</strong> не имеет прикрепленных девушек
                </div>
              </template>
              <Lady
                v-for="(lady, idx) in ladies.attached"
                :key="idx"
                :lady="lady"
                type="attached"
                @detachClick="handleDetachClick"
              />
              <spinner
                class="list__loader"
                v-if="scrollFetch.left.isLoading"
                size="medium"
                line-fg-color="#5aa6ff"
              />
            </div>
          </div>
        </div>
        <div class="modal__col modal__col--right">
          <div class="list">
            <div class="list__head">
              <div class="modal__title">Новые девушки</div>
            </div>
            <div class="list__scroller list__scroller--pad" ref="listRight">
              <Lady
                v-for="(lady, idx) in availableLadiesForSelect"
                :key="idx"
                :lady="lady"
                :selectedLadies="selectedLadies"
                type="select"
                @selectAttach="handleAttachClick"
              />
              <spinner
                class="list__loader"
                v-if="scrollFetch.right.isLoading"
                size="medium"
                line-fg-color="#5aa6ff"
              />
            </div>
            <div class="list__cta">
              <Button primary type="button" @click="attachLadies">Прикрепить переводчика</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
import throttle from 'lodash/throttle';
import Spinner from 'vue-simple-spinner';
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';
import Button from '@/components/Shared/UI/Button.vue';
import Notification from '@/components/Shared/UI/Notification.vue';
import Lady from '@/components/Ladies/Lady.vue';
import Plurize from '@/helpers/Plurize';
import api from '@/helpers/Api';

export default {
  name: 'AttachLadiesModal',
  components: {
    Spinner,
    SvgIcon,
    Button,
    Notification,
    Lady,
  },
  data() {
    return {
      name: '',
      id: '',
      counterAttached: 0,
      errorMessage: '',
      ladies: {
        attached: [],
        available: [],
      },
      selectedLadies: [],
      scrollFetch: {
        left: {
          isLoading: false,
          moreResultsAvailable: true,
        },
        right: {
          isLoading: false,
          moreResultsAvailable: true,
        },
      },
    };
  },
  created() {
    this.scrollWithThrottleLeft = throttle(this.handleListScrollLeft, 100);
    this.scrollWithThrottleRight = throttle(this.handleListScrollRight, 100);
  },
  computed: {
    countLadiesAttached() {
      // const { length } = this.ladies.attached;
      if (this.counterAttached === 0) return '';
      return `${this.counterAttached} ${Plurize(this.counterAttached, 'девушка', 'девушки', 'девушек')}`;
    },
    availableLadiesForSelect() {
      // filter out attached ladies
      return this.ladies.available
        .filter(x => this.ladies.attached.filter(y => y.ID === x.ID).length === 0);
    },
  },
  methods: {
    beforeOpen(event) {
      this.name = event.params.name;
      this.id = event.params.id;
      this.counterAttached = parseInt(event.params.count, 10);
      this.fetchAttached();
      this.fetchAvailable();
    },
    opened() {
      this.$refs.listLeft.addEventListener('scroll', this.scrollWithThrottleLeft, false);
      this.$refs.listRight.addEventListener('scroll', this.scrollWithThrottleRight, false);
    },
    beforeClose() {
      this.$refs.listLeft.removeEventListener('scroll', this.scrollWithThrottleLeft, false);
      this.$refs.listRight.removeEventListener('scroll', this.scrollWithThrottleRight, false);

      this.resetState();
    },
    closeModal() {
      this.$modal.hide('attach-ladies-translator');
    },
    resetState() {
      this.errorMessage = '';
    },
    fetchAttached() {
      api.get(`translators/${this.id}/ladies`).then((res) => {
        this.ladies.attached = res.data;
      });
    },
    fetchAvailable() {
      api.get('ladies?free=true').then((res) => {
        this.ladies.available = res.data;
      });
    },
    handleListScrollLeft() {
      const lastId = this.ladies.attached[this.ladies.attached.length - 1].ID;
      const url = `translators/${this.id}/ladies?last_id=${lastId}`;

      this.fetchOnScrollBottom(this.$refs.listLeft, 'left', 'attached', url);
    },
    handleListScrollRight() {
      const lastId = this.ladies.available[this.ladies.available.length - 1].ID;
      const url = `ladies?last_id=${lastId}`;

      this.fetchOnScrollBottom(this.$refs.listRight, 'right', 'available', url);
    },
    fetchOnScrollBottom(listDOM, listPos, ladiesArr, url) {
      const scrollRemaining = listDOM.scrollHeight - listDOM.scrollTop - listDOM.offsetHeight;
      if (scrollRemaining <= 150 && !this.scrollFetch[listPos].isLoading && this.scrollFetch[listPos].moreResultsAvailable) {
        this.scrollFetch[listPos].isLoading = true;

        api.get(url).then((res) => {
          console.log(`get ${url} - l ${res.data.length}`);
          this.ladies[ladiesArr] = this.ladies[ladiesArr].concat(res.data);
          this.scrollFetch[listPos].isLoading = false;
          this.scrollFetch[listPos].moreResultsAvailable = res.data.length === 21;
        });
      }
    },
    handleAttachClick(ladyId) {
      this.selectedLadies = this.selectedLadies.concat(ladyId);
    },
    attachLadies() {
      api.post(`translators/${this.id}/ladies`, {
        ladies: this.selectedLadies.join(','),
      }).then((res) => {
        const apiData = res.data[0];
        if (apiData.success) {
          this.fetchAttached();
          this.errorMessage = '';
          this.counterAttached = this.counterAttached + this.selectedLadies.length;
          this.$emit('sucessCallback');
          // this.closeModal();
        } else {
          this.errorMessage = apiData.message;
        }
      });
    },
    handleDetachClick(ladyId) {
      console.log(`detaching ${ladyId} from translator ${this.id}`);
      api.delete(`translators/${this.id}/ladies`, {
        data: {
          ladies: ladyId,
        },
      }).then((res) => {
        const apiData = res.data[0];
        if (apiData.success) {
          this.fetchAttached();
          this.fetchAvailable();
          this.errorMessage = '';
          this.counterAttached = this.counterAttached - 1;
          // this.$emit('sucessCallback');
          // this.closeModal();
        } else {
          this.errorMessage = apiData.message;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme/utils.scss';

.modal {
  &__grid{
    display: flex;
  }
  &__col{
    flex: 0 0 auto;
    width: 100%;
    min-width: 1px;
    min-height: 0px;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 120px);
    &--left{
      flex-basis: 60%;
      max-width: 60%;
      border-right: 1px solid #D1CFDA;
    }
    &--right{
      flex-basis: 40%;
      max-width: 40%;
    }
  }
  &__title {
    font-weight: 500;
    line-height: 1.28;
    font-size: 13px;
  }
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
}

.list{
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  &__head{
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #D1CFDA;
    .modal__title{
      &:first-child{
        flex: 0 0 245px;
      }
      &:nth-child(2){
        margin-left: auto;
        padding-left: 20px;
        flex: 0 0 145px;
      }
    }
  }
  &__scroller{
    flex: 0 1 auto;
    max-height: 100%;
    padding: 20px 20px 0px;
    overflow-y: scroll;
    &--pad{
      padding-top: 10px;
    }
  }
  &__cta {
    flex: 0 0 auto;
    padding: 25px 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    .btn{
      margin-left: 10px;
      margin-right: 10px;
    }
  }
  &__blank-message{
    margin: 20px 0;
    font-size: 13px;
  }
  &__loader{
    margin-top: 20px;
    margin-bottom: 0;
  }
}

@include r($md) {
.modal {
  &__grid{
    flex-wrap: wrap;
  }
  &__col{
    height: auto;
    max-height: calc(100vh - 120px);
    &--left{
      flex-basis: 100%;
      max-width: 100%;
      border-right: 0;
      border-bottom: 1px solid #D1CFDA;
    }
    &--right{
      flex-basis: 100%;
      max-width: 100%;
    }
  }
}
}

</style>
