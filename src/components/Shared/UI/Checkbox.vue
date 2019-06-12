<template>
  <div
    class="ui-checkbox"
    :class="{'is-active': value, 'is-yellow': yellow, 'with-checkmark': withCheckmark}"
  >
    <input type="checkbox" :name="name" :id="name" :value="value" @change="handleChange">
    <label :class="{'is-big-font': bigFont}" :for="name">{{label}}</label>
  </div>
</template>

<script>
export default {
  name: 'UiCheckbox',
  props: {
    name: String,
    label: String,
    value: Boolean,
    bigFont: Boolean,
    yellow: Boolean,
    withCheckmark: Boolean,
  },
  methods: {
    handleChange() {
      this.$emit('input', !this.value);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme/utils.scss';

.ui-checkbox {
  position: relative;
  cursor: pointer;
  input[type='checkbox'] {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
  }
  label {
    display: flex;
    align-items: center;
    padding-left: 28px;
    min-height: 30px;
    font-size: 11px;
    color: rgba($fontColor, 0.6);
    cursor: pointer;
    &::after {
      display: block;
      content: ' ';
      position: absolute;
      top: 50%;
      left: 0;
      width: 14px;
      height: 14px;
      transform: translateY(-50%);
      border: 2px solid rgba(#473f69, 0.5);
      border-radius: 4px;
      transition: border 0.25s ease-in-out;
    }
    &::before {
      display: inline-block;
      content: '';
      position: absolute;
      left: 5px;
      top: 50%;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $colorPrimary;
      opacity: 0;
      transform: translateY(-50%);
      transition: opacity 0.25s ease-in-out;
    }
  }
  .is-big-font {
    font-size: 14px;
    padding-left: 33px;
    color: $fontColor;
  }
  &.is-yellow {
    &.is-active {
      label {
        &::after {
          border-color: $colorOrange;
        }
        &::before {
          background: $colorOrange;
        }
      }
    }
  }
  &.with-checkmark {
    &.is-active {
      label {
        &::after {
          background-color: $colorPrimary;
        }
        &::before {
          left: 2.5px;
          width: 14px;
          height: 10px;
          z-index: 2;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAKCAYAAACE2W/HAAAABGdBTUEAALGPC/xhBQAAAK1JREFUKBWVjzEKwkAURBMiimBvY2NjZWWVU+RU1mnTpkhhm0YsvYaNIDYpUgRygM2bsLuoZCEOPPbv/JkNiaI/ZIzZwh1Os2uEd/AA6TqrSHAPTzWQvrgZiwzL0AvsDvAG6QZrV8q4vOD4W5YHDUg1rHyGSyUXteB/WrP1OMwFFr6kASOBEqQOUotmSbvkq+QuLGIoQOotmuXFLhc8CeVKW+XB4NSC0llM7T69AcWO0hZLcgV4AAAAAElFTkSuQmCC);
        }
      }
      &.is-yellow {
        label::after {
          background-color: $colorOrange;
        }
      }
    }
  }
  &.is-active {
    label {
      &::after {
        border-color: $colorPrimary;
      }
      &::before {
        opacity: 1;
      }
    }
  }
}
</style>
