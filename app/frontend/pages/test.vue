<template>
  <div>
    <div class="bg-red-600">red-600</div>
    <div class="bg-red-700">red-700</div>
    <div class="bg-red-800">red-800</div>
    <div class="bg-blue-700">blue-700</div>
    <div class="bg-blue-800">blue-800</div>
    <div class="bg-pink-700">pink-700</div>

    <div class="my-4"></div>

    <Button color="red-600">red-600</Button>
    <Button color="red-700">red-700</Button>
    <Button color="red-800">red-800</Button>
    <Button color="blue-700">blue-700</Button>
    <Button color="blue-800">blue-800</Button>
    <Button color="pink-700">pink-700</Button>

    <div class="my-4"></div>

    <div class="bg-gray-600">bg-gray-600</div>
    <div class="bg-digisailor-main">bg-digisailor-main</div>
    <div class="bg-digisailor-accent">bg-digisailor-accent</div>
    <div class="bg-digisailor-default">bg-digisailor-default</div>

    <div class="my-4"></div>

    <Button color="gray-600">gray-600</Button>
    <Button color="main">bg-main</Button>
    <Button color="accent">bg-accent</Button>
    <Button color="default">bg-default</Button>
  </div>
</template>

<script>
import Button from '~/components/Button.vue'

export default {
  components: {
    Button
  },
  layout: 'default'
}
</script>

<style lang="scss" scoped>
h1 {
  @apply text-2xl pt-4 pb-8;
}

h2 {
  @apply text-lg font-bold pt-4;
}

p {
  @apply max-w-4xl pt-4;

  &:first-of-type {
    @apply pt-0;
  }
}

ul {
  @apply list-disc ml-4 mt-2;
}

ol {
  @apply list-decimal ml-4;
}

li {
  @apply max-w-4xl;
}

strong {
  @apply font-bold;
}
</style>
