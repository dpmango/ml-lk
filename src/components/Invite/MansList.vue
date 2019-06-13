<template>
  <div class="mans panel" v-if="forLady">
    <div class="panel__head panel-head">
      <div class="panel-head__icon">
        <invite-mans-filter @applyFilters="applyFilters" ref="filter"/>
      </div>
      <div class="panel-head__name">Мужчины</div>
      <div class="panel-head__action">
        <ui-checkbox
          @input="checkAll"
          v-model="filter.allChecked"
          name="allChecked"
          label="Отметить всех"
          bigFont
        />
      </div>
    </div>
    <div class="panel__content">
      <UiNotification v-if="errorMessage" type="danger">{{errorMessage}}</UiNotification>
      <div class="mans__grid">
        <div v-for="(man, idx) in mansMinus8" :key="idx" class="mans__col">
          <invite-card
            @onSelect="onManSelect"
            :isSelected="selectedMans.indexOf(man.ID) !== -1"
            isSmaller
            :data="man"
          />
        </div>
      </div>
      <div class="mans__grid">
        <div class="mans__col mans__col--restcards">
          <div class="mans__grid">
            <div v-for="(man, idx) in mansRest8" :key="idx" class="mans__col mans__col--collumned">
              <invite-card
                @onSelect="onManSelect"
                :isSelected="selectedMans.indexOf(man.ID) !== -1"
                isSmaller
                :data="man"
              />
            </div>
          </div>
        </div>
        <div class="mans__col mans__col--textarea" v-if="mans.length > 0">
          <add-invite :textarea.sync="textarea" @sentInvite="sentInvite"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import UiCheckbox from '@/components/Shared/UI/Checkbox.vue';
import UiNotification from '@/components/Shared/UI/Notification.vue';
import InviteMansFilter from '@/components/Invite/InviteMansFilter.vue';
import InviteCard from '@/components/Invite/InviteCard.vue';
import AddInvite from '@/components/Invite/AddInvite.vue';
import Plurize from '@/helpers/Plurize';
import api from '@/helpers/Api';

const defaultFilterState = {
  allChecked: false,
};

export default {
  name: 'MansList',
  components: {
    UiCheckbox,
    UiNotification,
    InviteMansFilter,
    InviteCard,
    AddInvite,
  },
  data() {
    return {
      filter: cloneDeep(defaultFilterState),
      mans: [],
      selectedMans: [],
      moreMansAvailable: true,
      errorMessage: '',
      textarea: '',
    };
  },
  props: {
    forLady: String,
  },
  mounted() {
    this.fetchApi();
  },
  computed: {
    mansMinus8() {
      return this.mans.slice(0, this.mans.length - 9);
    },
    mansRest8() {
      return this.mans.slice(this.mans.length - 8, this.mans.length);
      // return this.mans.slice(this.mans.length - 9, this.mans.length);
    },
  },
  methods: {
    filterToParams(lastId) {
      // let filterString = '';
      // let ladiesFilter = '';
      // if (this.filter.marked) {
      //   filterString = '1';
      // }
      // if (this.filter.new) {
      //   filterString = filterString.length > 0 ? `${filterString},2` : '2';
      // }
      // if (this.filter.maleOnline) {
      //   filterString = filterString.length > 0 ? `${filterString},3` : '3';
      // }

      // if (this.filter.ladies.length > 0) {
      //   ladiesFilter = this.filter.ladies.join(',');
      // }

      // filter = 1 (отправить приглашение):
      // lady – ID девушки
      // age_1 и age_2 – интервал «Возраст»
      // height_1 и height_2 – интервал «Рост»
      // weight_1 и weight_2 – интервал «Вес»
      // hair – цвет волос (список ID через запятую)
      // eye – цвет глаз (список ID через запятую)
      // marital – семейное положение (список ID через запятую)
      // education – образование (список ID через запятую)
      // country – страна (список кодов через запятую)
      // city - город
      // id – ID мужчины
      // children – дети – 1:есть;2:нет
      // photo – фото - 1:есть;2:нет

      let filterObj = {
        filter: 1,
        lady: this.forLady,
      };

      if (lastId) {
        filterObj = { ...filterObj, ...{ last_id: lastId } };
      }

      return filterObj;
    },
    fetchApi(lastId) {
      if (!this.forLady) {
        return;
      }
      api
        .get('mens', {
          params: this.filterToParams(lastId),
        })
        .then(res => {
          this.errorMessage = '';
          this.mans = res.data;
          this.moreMansAvailable = res.data.length === 21;
        })
        .catch(err => {
          this.errorMessage = err;
        });
    },
    applyFilters() {
      const filters = this.$refs.filter.getFilters();
      console.log('filters from child components', { filters });
    },
    onManSelect(id) {
      if (this.selectedMans.indexOf(id) !== -1) {
        this.selectedMans = this.selectedMans.filter(x => x !== id);
      } else {
        this.selectedMans.push(id);
      }
    },
    checkAll() {
      const manIDs = this.mans.map(x => x.ID);
      if (this.filter.allChecked) {
        this.selectedMans = manIDs;
      } else {
        this.selectedMans = [];
      }
    },
    clearFilter() {
      this.filter = cloneDeep(defaultFilterState);
      this.fetchApi();
    },
    resetState() {
      this.mans = [];
      this.selectedMans = [];
      this.moreMansAvailable = true;
      this.errorMessage = '';
    },
    sentInvite() {
      api
        .post('chats/sendinvitations', {
          lady: this.forLady,
          men: this.selectedMans.join(','),
          text: this.textarea,
        })
        .then(res => {
          const apiData = res.data[0];
          if (apiData.success) {
            // reset state
            const lastId = this.mans[this.mans.length - 1].ID;
            this.errorMessage = '';
            this.showNotification({
              title: '',
              message: `Отправлено ${apiData.count} ${Plurize(
                apiData.count,
                'приглашение',
                'приглашения',
                'приглашений',
              )}`,
              type: 'success',
            });
            this.mans = [];
            this.selectedMans = [];
            this.filter.allChecked = false;
            //  fetch new
            this.fetchApi(lastId);
          } else {
            this.showNotification({ message: apiData.message });
          }
        })
        .catch(err => {
          this.errorMessage = err;
          this.showNotification({ message: error });
        });
    },
  },
  watch: {
    forLady() {
      this.resetState();
      this.fetchApi();
    },
  },
  notifications: {
    showNotification: {
      title: 'Ошибка при отправке приглашения',
      type: 'error',
    },
  },
};
</script>


<style lang="scss" scoped>
@import '@/theme/utils.scss';

.panel {
  background: #ffffff;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.08);
  &__head {
    flex: 0 0 auto;
    background: white;
    border-bottom: 1px solid rgba(#d1cfda, 0.4);
  }
  &__content {
    padding: 20px;
  }
  &.is-filter-active {
    .panel-head__icon {
      .icon-circle {
        background-color: $colorPrimary;
      }
    }
  }
}

.panel-head {
  display: flex;
  align-items: center;
  min-height: 40px;
  padding: 5px 15px 5px 20px;
  &__icon {
    flex: 0 0 auto;
  }
  &__name {
    flex: 0 1 auto;
    padding-left: 20px;
    font-size: 16px;
  }
  &__action {
    flex: 0 0 auto;
    margin-left: auto;
    &:hover {
    }
  }
}

.mans {
  position: relative;
  margin-top: 10px;
  &__grid {
    display: flex;
    flex-wrap: wrap;
    margin: -10px;
  }
  &__col {
    width: 100%;
    flex: 0 0 16.6666%;
    max-width: 16.6666%;
    min-width: 1px;
    min-height: 0px;
    padding: 10px;
    &--collumned {
      flex-basis: 25%;
      max-width: 25%;
    }
    &--restcards {
      flex-basis: 66.6666%;
      max-width: 66.6666%;
    }
    &--textarea {
      flex-basis: 33.3333%;
      max-width: 33.3333%;
    }
  }
  // &__loader {
  //   position: absolute;
  //   bottom: 10px;
  //   z-index: 3;
  //   left: 50%;
  //   transform: translateX(-50%);
  // }
}

@include r($xl) {
  .panel {
    height: auto;
    max-height: calc(100vh - 80px - 40px);
  }
}
@include r($sm) {
  .panel-head {
    flex-wrap: wrap;
    &__icon {
      flex-basis: auto;
    }
    &__name {
      padding-left: 20px;
    }
  }
}
</style>

