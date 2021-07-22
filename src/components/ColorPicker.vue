<template>
  <div class="color-picker">
    <div
      class="color-picker__color"
      v-for="color in colors"
      :key="color"
      :style="{ 'background-color': color }"
      @click="emitColor(color)"
    />
    <label class="color-picker__input">
      <unnnic-icon-svg class="color-picker__input__icon" icon="add-circle-1" size="sm" />
      <input ref="color-picker__input" type="color" @change="addColor()" />
    </label>
  </div>
</template>

<script>
  export default {
    name: 'color-picker',
    props: {
      initialColors: {
        type: Array,
        default: () => ['#009E96', '#262626', '#C4EAF5', '#C4C4C4'],
      },
    },
    data() {
      return {
        colors: this.initialColors,
      };
    },
    methods: {
      addColor(event) {
        const color = event.target.value;
        this.colors.push(color);
        this.emitColor(color);
      },
      emitColor(color) {
        this.$emit('colorChange', color);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .color-picker {
    display: flex;
    gap: $unnnic-inline-xs;

    &__color {
      width: $unnnic-icon-size-xs;
      height: $unnnic-icon-size-xs;
      border-radius: 50%;
    }

    &__input {
      width: $unnnic-icon-size-xs;
      height: $unnnic-icon-size-xs;
      border-radius: 50%;

      &__icon {
        left: -2px;
        top: -6px;
      }

      input {
        visibility: hidden;
      }
    }
  }
</style>
