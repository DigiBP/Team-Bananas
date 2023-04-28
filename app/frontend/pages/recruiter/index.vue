<template>
  <div>
    <div>
      <h1>Welcome, Recruiter 👋</h1>
      <p class="max-w-4xl mb-12">
        This is the Digisailors HR Buddy. Here, you can check on new hiring requests, track the progress of
        ongoing hiring processes, view the applicants, and schedule interviews.
      </p>
      <div>
        <NuxtLink to="/recruiter/employees">
          <Button color="main">
            List of Employees
          </Button>
        </NuxtLink>
        <NuxtLink to="/recruiter/job-ads">
          <Button color="main">
            List of Job Ads
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
  layout: 'recruiter',
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
