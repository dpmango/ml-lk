<template>
  <div :class="{ 'ui-group': group }">
    <input
      class="ui-input"
      :class="{ 'ui-input--big': big }"
      :placeholder="requiredPlaceholder"
      :type="type"
      :value="value"
      :required="required"
      @input="handleChange"
      @click="$emit('click')"
    >
  </div>
</template>

<script>
export default {
  name: 'UiInput',
  props: {
    // layout modifiers
    group: Boolean,
    big: Boolean,
    // functional props
    placeholder: String,
    required: Boolean,
    type: {
      type: String,
      default: 'text',
    },
    value: String,
  },
  model: {
    prop: 'value',
    event: 'input',
  },
  computed: {
    requiredPlaceholder() {
      return this.placeholder + (this.required ? ' (*)' : '');
    },
  },
  methods: {
    handleChange(e) {
      this.$emit('input', e.target.value);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/theme/utils.scss';

.ui-group {
  position: relative;
  z-index: 1;
  margin-bottom: 20px;
}

.ui-input {
  -webkit-appearance: none;
  display: block;
  width: 100%;
  padding: 6px 15px;
  background: transparent;
  border: 1px solid rgba($fontColor, 0.2);
  border-radius: 4px;
  font-size: 14px;
  color: $fontColor;
  transition: border 0.25s ease-in-out;
  &::placeholder {
    color: rgba($fontColor, 0.4);
  }
  &:focus {
    border-color: $colorPrimary;
  }
}
</style>
