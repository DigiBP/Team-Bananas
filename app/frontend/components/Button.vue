<template>
  <button :class="`button bg-digisailor-${color}`" @click="$emit('clicked')">
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
    }
  }
}
</script>

<style lang="scss" scoped>
.button {
  @apply inline-block;
  @apply cursor-pointer;
  @apply hover:bg-opacity-90;
  @apply text-white;
  @apply font-bold;
  @apply py-2 px-4 mt-4;
  @apply rounded;
}
</style>
