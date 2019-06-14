<template>
  <div class="wrapper" :class="{'is-active': isFilterOpen}" v-click-outside="closeFilter">
    <div class="icon-circle" @click="toggleFilterOpen">
      <svg-icon name="filter" width="13" height="15"/>
    </div>
    <div class="filter-wrapper">
      <div class="filter">
        <!-- col -->
        <div class="filter__col">
          <div class="filter__group">
            <label for class="filter__label">Возраст</label>
            <div class="filter__selectrow">
              <multiselect
                v-model="filter.age_1"
                track-by="label"
                label="label"
                placeholder="Выберите"
                :searchable="true"
                :allowEmpty="false"
                :options="options.age_1"
              >
                <template slot="caret">
                  <select-arrow/>
                </template>
              </multiselect>
              <div class="filter__selectrow-split">-</div>
              <multiselect
                v-model="filter.age_2"
                track-by="label"
                label="label"
                placeholder="Выберите"
                :searchable="true"
                :allowEmpty="false"
                :options="options.age_2"
              >
                <template slot="caret">
                  <select-arrow/>
                </template>
              </multiselect>
            </div>
          </div>
          <div class="filter__group">
            <label for class="filter__label">Вес</label>
            <div class="filter__selectrow">
              <multiselect
                v-model="filter.weight_1"
                track-by="label"
                label="label"
                placeholder="Выберите"
                :searchable="false"
                :allowEmpty="false"
                :options="options.weight_1"
              >
                <template slot="caret">
                  <select-arrow/>
                </template>
              </multiselect>
              <div class="filter__selectrow-split">-</div>
              <multiselect
                v-model="filter.weight_2"
                track-by="label"
                label="label"
                placeholder="Выберите"
                :searchable="false"
                :allowEmpty="false"
                :options="options.weight_2"
              >
                <template slot="caret">
                  <select-arrow/>
                </template>
              </multiselect>
            </div>
          </div>
          <div class="filter__group">
            <label for class="filter__label">Семейное положение</label>
            <multiselect
              v-model="filter.marital"
              track-by="label"
              label="label"
              placeholder="Все"
              :multiple="true"
              :searchable="false"
              :allowEmpty="true"
              :options="options.marital"
            >
              <template slot="caret">
                <select-arrow/>
              </template>
              <template slot="selection" slot-scope="{ values }">
                <span
                  class="multiselect__single"
                  v-if="values.length"
                >{{multipleSelectPlaceholder(values, 'marital')}}</span>
              </template>
            </multiselect>
          </div>
          <div class="filter__group">
            <label for class="filter__label">Дети</label>
            <div class="ui-radio-group">
              <ui-radio
                isRed
                isBig
                v-model="filter.children"
                cbValue="1"
                name="manFilterChildren"
                label="Да"
              />
              <ui-radio
                isRed
                isBig
                v-model="filter.children"
                cbValue="2"
                name="manFilterChildren"
                label="Нет"
              />
            </div>
          </div>
        </div>
        <!-- col --->
        <div class="filter__col">
          <div class="filter__group">
            <label for class="filter__label">Цвет глаз</label>
            <multiselect
              v-model="filter.eye"
              track-by="label"
              label="label"
              placeholder="Все"
              :multiple="true"
              :searchable="true"
              :allowEmpty="true"
              :options="options.eye"
            >
              <template slot="caret">
                <select-arrow/>
              </template>
              <template slot="selection" slot-scope="{ values }">
                <span
                  class="multiselect__single"
                  v-if="values.length"
                >{{multipleSelectPlaceholder(values, 'eye')}}</span>
              </template>
            </multiselect>
          </div>
          <div class="filter__group">
            <label for class="filter__label">Цвет волос</label>
            <multiselect
              v-model="filter.hair"
              track-by="label"
              label="label"
              placeholder="Все"
              :multiple="true"
              :searchable="true"
              :allowEmpty="true"
              :options="options.hair"
            >
              <template slot="caret">
                <select-arrow/>
              </template>
              <template slot="selection" slot-scope="{ values }">
                <span
                  class="multiselect__single"
                  v-if="values.length"
                >{{multipleSelectPlaceholder(values, 'hair')}}</span>
              </template>
            </multiselect>
          </div>
          <div class="filter__group">
            <label for class="filter__label">Рост</label>
            <div class="filter__selectrow">
              <multiselect
                v-model="filter.height_1"
                track-by="label"
                label="label"
                placeholder="Выберите"
                :searchable="false"
                :allowEmpty="false"
                :options="options.height_1"
              >
                <template slot="caret">
                  <select-arrow/>
                </template>
              </multiselect>
              <div class="filter__selectrow-split">-</div>
              <multiselect
                v-model="filter.height_2"
                track-by="label"
                label="label"
                placeholder="Выберите"
                :searchable="false"
                :allowEmpty="false"
                :options="options.height_2"
              >
                <template slot="caret">
                  <select-arrow/>
                </template>
              </multiselect>
            </div>
          </div>
          <div class="filter__group">
            <label for class="filter__label">Город</label>
            <!-- @input="filterWithDebounce" -->
            <ui-input noLabel v-model="filter.city" placeholder/>
          </div>
          <div class="filter__group filter__group--cta">
            <a href="#" @click="clearFilter" class="filter__clear">Очистить</a>
          </div>
        </div>
        <!-- col -->
        <div class="filter__col">
          <div class="filter__group">
            <label for class="filter__label">Страна</label>
            <multiselect
              v-model="filter.country"
              track-by="label"
              label="label"
              placeholder="Все"
              :multiple="true"
              :searchable="true"
              :allowEmpty="true"
              :options="options.country"
            >
              <template slot="caret">
                <select-arrow/>
              </template>
              <template slot="selection" slot-scope="{ values }">
                <span
                  class="multiselect__single"
                  v-if="values.length"
                >{{multipleSelectPlaceholder(values, 'country')}}</span>
              </template>
            </multiselect>
          </div>
          <div class="filter__group">
            <label for class="filter__label">Образование</label>
            <multiselect
              v-model="filter.education"
              track-by="label"
              label="label"
              placeholder="Все"
              :multiple="true"
              :searchable="false"
              :allowEmpty="true"
              :options="options.education"
            >
              <template slot="caret">
                <select-arrow/>
              </template>
              <template slot="selection" slot-scope="{ values }">
                <span
                  class="multiselect__single"
                  v-if="values.length"
                >{{multipleSelectPlaceholder(values, 'education')}}</span>
              </template>
            </multiselect>
          </div>
          <div class="filter__group">
            <label for class="filter__label">ID</label>
            <!-- @input="filterWithDebounce" -->
            <ui-input noLabel v-model="filter.id" placeholder/>
          </div>
          <div class="filter__group">
            <label for class="filter__label">Фото</label>
            <div class="ui-radio-group">
              <ui-radio
                isRed
                isBig
                v-model="filter.photo"
                cbValue="1"
                name="manFilterPhoto"
                label="Да"
              />
              <ui-radio
                isRed
                isBig
                v-model="filter.photo"
                cbValue="2"
                name="manFilterPhoto"
                label="Нет"
              />
            </div>
          </div>
          <div class="filter__group filter__group--cta">
            <Button orange block @click="applyFilters">Подобрать</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import ClickOutside from 'vue-click-outside';
import Multiselect from 'vue-multiselect';
import UiInput from '@/components/Shared/UI/Input.vue';
import UiRadio from '@/components/Shared/UI/Radio.vue';
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';
import Button from '@/components/Shared/UI/Button.vue';
import SelectArrow from '@/components/Shared/UI/Partials/SelectArrow.vue';
import Plurize from '@/helpers/Plurize';
import { countriesSelect } from '@/data/countries';
import {
  arrayToSelect,
  ageSelect,
  weight1Select,
  weight2Select,
  height1Select,
  height2Select,
} from '@/data/personParams';

const defaultFilterState = {
  age_1: { label: 'от', value: undefined },
  age_2: { label: 'до', value: undefined },
  height_1: { label: 'от', value: undefined },
  height_2: { label: 'до', value: undefined },
  weight_1: { label: 'от', value: undefined },
  weight_2: { label: 'до', value: undefined },
  hair: [],
  eye: [],
  marital: [],
  education: [],
  country: [],
  city: '',
  id: '',
  children: null,
  photo: null,
};

const selectOptions = {
  age_1: [...[{ label: 'Все', value: undefined }], ...ageSelect],
  age_2: [...[{ label: 'Все', value: undefined }], ...ageSelect],
  height_1: [...[{ label: 'Все', value: undefined }], ...height1Select],
  height_2: [...[{ label: 'Все', value: undefined }], ...height2Select],
  weight_1: [...[{ label: 'Все', value: undefined }], ...weight1Select],
  weight_2: [...[{ label: 'Все', value: undefined }], ...weight2Select],
  hair: [
    { label: 'Черный', value: 1 },
    { label: 'Белый', value: 2 },
    { label: 'Коричневый', value: 3 },
    { label: 'Светлый', value: 4 },
    { label: 'Каштановый', value: 5 },
    { label: 'Рыжий', value: 6 },
    { label: 'Серый', value: 7 },
  ],
  eye: [
    { label: 'Голубой', value: 1 },
    { label: 'Коричневый', value: 2 },
    { label: 'Серый', value: 3 },
    { label: 'Зеленый', value: 4 },
    { label: 'Карий', value: 5 },
  ],
  marital: [
    { label: 'Не был женат', value: 1 },
    { label: 'Разведен', value: 2 },
    { label: 'Жента', value: 3 },
    { label: 'Вдовец', value: 4 },
  ],
  education: [
    { label: 'Среднее', value: 1 },
    { label: 'Колледж', value: 2 },
    { label: 'Студент', value: 3 },
    { label: 'Высшее', value: 4 },
  ],
  country: [...[{ label: 'Все', value: undefined }], ...countriesSelect],
};

export default {
  name: 'InviteMansFilter',
  components: {
    SvgIcon,
    Multiselect,
    UiInput,
    UiRadio,
    SelectArrow,
    Button,
  },
  data() {
    return {
      isFilterOpen: false,
      filter: cloneDeep(defaultFilterState),
      options: selectOptions,
    };
  },
  computed: {},
  methods: {
    toggleFilterOpen() {
      this.isFilterOpen = !this.isFilterOpen;
    },
    closeFilter() {
      this.isFilterOpen = false;
    },
    applyFilters() {
      this.$emit('applyFilters');
      this.closeFilter();
    },
    getFilters() {
      return this.filter;
    },
    clearFilter() {
      this.filter = cloneDeep(defaultFilterState);
      this.applyFilters();
    },
    multipleSelectPlaceholder(values, type) {
      // get plurize
      let plural = '';
      if (type === 'country') {
        plural = Plurize(values.length, 'страна', 'страны', 'стран');
      } else if (type === 'education') {
        plural = Plurize(values.length, 'страна', 'страны', 'стран');
      } else if (type === 'eye') {
        plural = Plurize(values.length, 'цвет', 'цвета', 'цветов');
      } else if (type === 'hair') {
        plural = Plurize(values.length, 'цвет', 'цвета', 'цветов');
      } else {
        plural = Plurize(values.length, 'значение', 'значения', 'значений');
      }

      if (values.length === 1) {
        return values[0].label;
      } else {
        return `${values.length} ${plural} выбрано`;
      }
    },
  },
  directives: {
    ClickOutside,
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme/utils.scss';

.wrapper {
  position: relative;
  &.is-active {
    .filter-wrapper {
      opacity: 1;
      transform: translate(0, 0);
      pointer-events: all;
    }
  }
}
.icon-circle {
  display: block;
  width: 30px;
  height: 30px;
  background: #d1cfda;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  font-size: 0;
  transition: background 0.25s ease, opacity 0.25s ease;
}

.filter-wrapper {
  position: absolute;
  top: 40px;
  left: 0;
  z-index: 3;
  background: #ffffff;
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.08);
  padding: 20px;
  opacity: 0;
  width: 650px;
  pointer-events: none;
  transform: translate(7px, 0px);
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.filter {
  display: flex;
  margin: 0 -14px;
  &__col {
    width: 100%;
    flex: 0 0 33.3333%;
    max-width: 33.3333%;
    min-height: 0;
    min-width: 1px;
    padding-left: 14px;
    padding-right: 14px;
  }
  &__group {
    margin-bottom: 10px;
    &--cta {
      margin-top: 20px;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  &__label {
    display: block;
    font-size: 14px;
    color: rgba($fontColor, 0.8);
    margin-bottom: 0.65em;
  }
  &__selectrow {
    display: flex;
    align-items: center;
    .multiselect {
      flex: 0 1 50%;
      max-width: 50%;
    }
    &-split {
      font-size: 14px;
      line-height: 28px;
      display: flex;
      align-items: center;
      text-align: center;
      color: #6f6e70;
      padding-left: 8px;
      padding-right: 8px;
    }
  }
  &__clear {
    display: inline-block;
    font-size: 12px;
    line-height: 2;
    padding: 5px 0;
    text-decoration-line: underline;
    color: rgba($fontColor, 0.5);
    transition: color 0.25s ease;
    &:hover {
      color: $colorPrimary;
    }
  }
}
.ui-radio-group {
  display: flex;
  align-items: center;
  margin-right: 20px;
  &:last-child {
    margin-right: 0;
  }
  > label {
    font-size: 14px;
    margin-right: 0.5em;
  }
  .ui-radio {
    margin-right: 15px;
    &:last-child {
      margin-right: 0px;
    }
  }
}
</style>
