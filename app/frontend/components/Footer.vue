<template>
  <div class="footer">
    <div class="footer-inner">
      <div class="flex flex-row">
        <div class="w-1/2 p-4">
          &copy; 2023 Digisailors, a fictive company.
        </div>
        <div class="w-1/2 p-4 text-right">
          Built on top of Nuxt, Weaviate, ....
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style lang="scss" scoped>
.footer {
  @apply bg-gray-600 p-16 font-light text-xs text-gray-200;

  &-inner {
    @apply w-full max-w-screen-lg flex-grow m-auto;

    svg {
      @apply w-36;
    }
  }

  a {
    @apply underline text-gray-700;
  }
}
</style>
