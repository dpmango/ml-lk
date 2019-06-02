<template>
  <div class="ui-radio" :class="{'is-active': isActive, 'is-red': isRed, 'is-big': isBig}">
    <input type="radio" :name="name" :id="idvalue" :value="cbValue" @change="handleChange">
    <label :for="idvalue">{{label}}</label>
  </div>
</template>

<script>
export default {
  name: 'UiRadio',
  props: {
    name: String,
    label: String,
    value: {
      required: true,
      validator: prop => typeof prop === 'string' || prop === null,
    },
    cbValue: {
      required: true,
      validator: prop => typeof prop === 'string' || prop === null,
    },
    isRed: Boolean,
    isBig: Boolean,
  },
  computed: {
    isActive() {
      return this.value === this.cbValue;
    },
    idvalue() {
      return `${this.name}_${this.cbValue}`;
    },
  },
  methods: {
    handleChange() {
      console.log(this.cbValue);
      // TODO - allow reseting by sending null there?
      this.$emit('input', this.cbValue);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme/utils.scss';

.ui-radio {
  position: relative;
  cursor: pointer;
  input[type='radio'] {
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
    font-size: 14px;
    color: rgba($fontColor, 0.8);
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
      border: 2px solid $colorOrange;
      border-radius: 50%;
      transition: border 0.25s ease-in-out;
    }
    &::before {
      display: inline-block;
      content: '';
      position: absolute;
      left: 4px;
      top: 50%;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $colorOrange;
      opacity: 0;
      transform: translateY(-50%);
      transition: opacity 0.25s ease-in-out;
    }
  }

  &.is-red {
    label {
      &::after {
        border-color: #ff5722;
      }
      &::before {
        background: #ff5722;
      }
    }
  }
  &.is-big {
    label {
      &::after {
        width: 16px;
        height: 16px;
      }
      &::before {
        width: 10px;
        height: 10px;
        left: 5px;
      }
    }
  }
  &.is-active {
    label {
      &::before {
        opacity: 1;
      }
    }
  }
}
</style>
