<template>
  <div>
    <div>
      <h1>Welcome, Hiring Manager 👋</h1>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  layout: 'manager',
  methods: {
    ...mapGetters({})
  }
}
</script>

<style lang="scss" scoped>
h1 {
  @apply text-2xl font-light pt-4 pb-8;
}

h2 {
  @apply text-lg font-bold pt-4;
}

ul {
  @apply list-disc ml-4 mt-2;
}

ol {
  @apply list-decimal ml-4;
}
</style>
