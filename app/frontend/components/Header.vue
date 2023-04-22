<template>
  <div class="header">
    <div class="header-inner">
      <div class="flex flex-row flex-nowrap justify-between justify-items-center">
        <div class="w-auto flex-grow-0 flex-shrink-0 text-white">
          <NuxtLink to="/">
            <img src="logo.svg" alt="Digisailors HR Buddy">
          </NuxtLink>
        </div>
        <div class="w-full flex-grow flex-shrink pt-2.5 pl-4 text-xl font-light text-white">
          <sup>ai</sup>HR Buddy
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Header',
  methods: {
    ...mapGetters({
      isStepSearch: 'isStepSearch'
    })
  }
}
</script>

<style lang="scss" scoped>
.header {
  @apply top-0 left-0 w-screen bg-digisailor-default bg-opacity-90 backdrop-blur-lg drop-shadow-md shadow-sm;

  &-inner {
    @apply w-full max-w-screen-lg flex-grow m-auto py-2 px-8;

    img {
      @apply h-16 w-auto;
    }
  }
}
</style>
