<template>
  <div class="ui-checkbox" :class="{'is-active': value}">
    <input type="checkbox" :name="name" :id="name" :value="value" @change="handleChange">
    <label :for="name">{{label}}</label>
  </div>
</template>

<script>
export default {
  name: 'UiCheckbox',
  props: {
    name: String,
    label: String,
    value: Boolean,
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

.ui-checkbox{
  position: relative;
  cursor: pointer;
  input[type="checkbox"]{
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
  }
  label{
    display: flex;
    align-items: center;
    padding-left: 28px;
    min-height: 30px;
    font-size: 11px;
    color: rgba($fontColor ,.6);
    cursor: pointer;
    &::after{
      display: block;
      content: ' ';
      position: absolute;
      top: 50%;
      left: 0;
      width: 18px;
      height: 18px;
      transform: translateY(-50%);
      border: 2px solid rgba(#473F69, .5);
      border-radius: 4px;
      transition: border .25s ease-in-out;
    }
    &::before{
      display: inline-block;
      content: '';
      position: absolute;
      left: 7px;
      top: 50%;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $colorPrimary;
      opacity: 0;
      transform: translateY(-50%);
      transition: opacity .25s ease-in-out;
    }
  }
  &.is-active{
    label{
      &::after{
        border-color: $colorPrimary
      }
      &::before{
        opacity: 1;
      }
    }
  }
}
</style>
