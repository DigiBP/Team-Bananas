<template>
  <button :class="`button button-${size} bg-digisailor-${color}`" @click="$emit('clicked')">
    <slot />
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    color: {
      type: String,
      default: 'default'
    },
    size: {
      type: String,
      default: 'default'
    }
  }
}
</script>

<style lang="scss" scoped>
.button {
  @apply inline-block;
  @apply cursor-pointer;
  @apply text-white;
  @apply font-bold;
  @apply py-2 px-4 mt-4;
  @apply rounded;
  @apply transition-all ease-in-out duration-300;

  &:hover {
    @apply cursor-pointer;
    @apply transition-all ease-in-out duration-300;
    @apply bg-opacity-90 shadow-lg;
  }

  &-small {
    @apply text-sm;
    @apply py-1 px-2 mt-0;
  }

  &-large {
    @apply text-lg font-light;
    @apply py-6 px-4;
  }
}
</style>
