<template>
  <div :class="{ 'ui-group': group }">
    <input
      class="ui-input"
      :name="name"
      :class="{ 'ui-input--big': big, 'ui-input--compact': compact }"
      :placeholder="requiredPlaceholder"
      :type="type"
      :value="value"
      :required="required"
      @keydown="handleKeyDown"
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
    compact: Boolean,
    // functional props
    name: String,
    placeholder: String,
    required: Boolean,
    type: {
      type: String,
      default: 'text',
    },
    value: String,
    min: String,
    max: String,
  },
  model: {
    prop: 'value',
    event: 'input',
  },
  computed: {
    requiredPlaceholder() {
      if (!this.placeholder) {
        return '';
      }
      return this.placeholder + (this.required ? ' (*)' : '');
    },
  },
  methods: {
    handleKeyDown() {
      if (this.min && this.max) {
        // assume that its a mask
      }
    },
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
  &--compact {
    width: auto;
    padding-left: 5px;
    padding-right: 5px;
    text-align: center;
    max-width: 40px;
  }
}
</style>
