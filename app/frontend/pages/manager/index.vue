<template>
  <div>
    <div>
      <h1>Welcome, Hiring Manager 👋</h1>
      <p class="max-w-4xl mb-12">
        This is the Digisailors hiring portal. Here, you can request new positions to be filled by our
        applicants. You can also view the status of your current positions and the applicants who have
        applied for them.
      </p>
      <div>
        <NuxtLink to="/manager/new">
          <Button>
            <font-awesome-icon :icon="['fas', 'user-gear']" />
            Start a Hiring Process
          </Button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Button from '~/components/Button.vue'

export default {
  components: {
    Button
  },
  layout: 'manager',
  methods: {
    ...mapGetters({})
  }
}
</script>

<style lang="scss" scoped>
h1 {
  @apply text-2xl pt-4 pb-8;
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
