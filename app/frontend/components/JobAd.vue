<template>
  <div class="jobad">
    <slot />
    <!-- avoid css removal in tree shaking as styling is used only run-time -->
    <div v-if="false">
      <h1>Job Ad</h1>
      <h2>About</h2>
      <p>
        Lorem Ipsum
      </p>
      <ul>
        <li>Dolor</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JobAd'
}
</script>

<style lang="scss">
.jobad {
  @apply border border-digisailor-default;
  @apply bg-digisailor-default bg-opacity-20;
  @apply rounded-lg shadow-lg;
  @apply p-4 my-4;

  h1 {
    @apply text-lg text-digisailor-default;
    @apply font-bold;
    @apply mb-4;
  }

  h2 {
    @apply text-base text-gray-800;
    @apply font-bold;
    @apply mb-2;
  }

  p {
    @apply text-sm text-gray-900;
    @apply mb-2;
  }

  ul {
    @apply list-disc;
    @apply text-sm text-gray-900;
    @apply ml-4;
    @apply mb-2;
  }
}
</style>
