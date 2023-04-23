<template>
  <button :class="`button button-${color}`" @click="$emit('clicked')">
    <slot />
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    color: {
      type: String,
      default: 'digisailor-default'
    }
  }
}
</script>

<style lang="scss" scoped>
.button {
  @apply inline-block;
  @apply cursor-pointer;
  @apply bg-digisailor-default;
  @apply hover:bg-opacity-90;
  @apply text-white;
  @apply font-bold;
  @apply py-2 px-4 mt-4;
  @apply rounded;

  &-digisailor-default {
    @apply bg-digisailor-default;
  }

  &-digisailor-accent {
    @apply bg-digisailor-accent;
  }
}
</style>
