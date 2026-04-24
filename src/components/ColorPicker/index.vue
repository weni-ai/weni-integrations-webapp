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
      <unnnic-icon-svg class="color-picker__input__icon" icon="add-circle-1" size="sm" ref="icon" />
      <input ref="color-picker__input" type="color" @change="addColor" />
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
  $color-picker-size: 22.5px;

  .color-picker {
    display: flex;
    gap: $unnnic-space-4;

    &__color {
      width: $color-picker-size;
      height: $color-picker-size;
      border-radius: $unnnic-border-radius-pill;
    }

    &__input {
      width: $color-picker-size;
      height: $color-picker-size;
      border-radius: $unnnic-border-radius-pill;

      &__icon {
        font-size: 28px;
        top: -2px;
        left: -4px;
      }

      input {
        width: 0;
        height: 0;
        visibility: hidden;
      }
    }
  }
</style>
