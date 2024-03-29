<template>
  <div v-if="type === 'textarea'" :class="{ 'ui-group': group }">
    <template v-if="placeholder && !noLabel">
      <label class="ui-placeholder" for="name">{{requiredLabel}}</label>
    </template>
    <textarea-autosize
      class="ui-input"
      :style="{ maxWidth: width + 'px' }"
      :name="name"
      :required="required"
      :placeholder="placeholder"
      :min-height="minheight"
      :max-height="maxheight"
      :value="value"
      :disabled="disabled"
      @input="handleChange"
    />
  </div>
  <div v-else :class="{ 'ui-group': group }">
    <template v-if="placeholder && !noLabel">
      <label class="ui-placeholder" for="name">{{requiredLabel}}</label>
    </template>
    <input
      class="ui-input"
      :class="{ 'ui-input--big': big, 'ui-input--compact': compact }"
      :style="{ maxWidth: width + 'px' }"
      :name="name"
      :id="name"
      :placeholder="placeholder"
      :type="renderType"
      :value="value"
      :required="required"
      :disabled="disabled"
      @keydown="handleKeyDown"
      @input="handleChange"
      @click="$emit('click')"
    >
    <div v-if="passwordEye" class="ui-input__eye" @click="togglePasswordVisibility">
      <template v-if="showPassword">
        <svg-icon name="eye-open" width="16" height="16"/>
      </template>
      <template v-else>
        <svg-icon name="eye-closed" width="16" height="16"/>
      </template>
    </div>
  </div>
</template>

<script>
import SvgIcon from '@/components/Shared/UI/SvgIcon.vue';

export default {
  name: 'UiInput',
  components: {
    SvgIcon,
  },
  data() {
    return {
      showPassword: false,
    };
  },
  props: {
    // layout modifiers
    group: Boolean,
    big: Boolean,
    compact: Boolean,
    width: String,
    noLabel: Boolean,
    // textarea props
    minheight: {
      type: [Number, String],
      default: 118,
    },
    maxheight: {
      type: [Number, String],
      default: 200,
    },
    // functional props
    name: String,
    placeholder: String,
    required: Boolean,
    disabled: Boolean,
    type: {
      type: String,
      default: 'text',
    },
    value: String,
    min: String,
    max: String,
    passwordEye: Boolean,
  },
  model: {
    prop: 'value',
    event: 'input',
  },
  computed: {
    renderType() {
      if (this.type === 'password' && this.showPassword) {
        return 'text';
      }
      return this.type;
    },
    requiredLabel() {
      if (!this.placeholder) {
        return '';
      }
      return this.placeholder + (this.required ? ' (*)' : '');
    },
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    handleKeyDown() {
      if (this.min && this.max) {
        // assume that its a mask
      }
    },
    handleChange(e) {
      const valueOfType = this.type !== 'textarea' ? e.target.value : e;
      // as VueTextareaAutosize is passing clear value in event
      this.$emit('input', valueOfType);
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

.ui-placeholder {
  display: inline-block;
  font-size: 12px;
  margin-bottom: 5px;
  color: rgba($fontColor, 0.8);
}
.ui-input {
  -webkit-appearance: none;
  display: block;
  width: 100%;
  padding: 6px 13px;
  background: transparent;
  border: 1px solid rgba($fontColor, 0.2);
  border-radius: 4px;
  font-size: 14px;
  color: $fontColor;
  transition: border 0.25s ease-in-out, box-shadow 0.25s ease-in-out;
  &::placeholder {
    color: rgba($fontColor, 0.4);
  }
  &:focus {
    // border-color: $colorPrimary;
    box-shadow: 0px 8px 6px rgba(0, 0, 0, 0.14);
  }
  &--compact {
    width: auto;
    padding-left: 5px;
    padding-right: 5px;
    text-align: center;
    max-width: 40px;
  }
  &[disabled] {
    background: rgba(0, 0, 0, 0.1);
  }
  &__eye {
    position: absolute;
    bottom: 1px;
    right: 10px;
    padding: 5px;
    cursor: pointer;
  }
}
</style>
