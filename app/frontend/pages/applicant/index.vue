<template>
  <div>
    <div>
      <h1>Jobs</h1>
      <p class="max-w-4xl mb-4">
        These are current job openings that you can apply for.
      </p>
      <table class="w-full">
        <thead>
          <tr>
            <th>Position</th>
            <th>Reference</th>
            <th>Office</th>
            <th>Department</th>
          </tr>
        </thead>
        <tr v-for="position in instances" :key="position.processId">
          <td>
            <NuxtLink :to="`/applicant/jobad/${position.processId}`" class="font-bold text-digisailor-accent underline">
              {{ position.title }}
            </NuxtLink>
          </td>
          <td>{{ position.businessKey }}</td>
          <td>{{ position.office }}</td>
          <td>{{ position.department }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  layout: 'applicant',
  computed: {
    ...mapState(['instances'])
  },
  mounted () {
    this.$store.dispatch('fetchInstances')
  },
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

th {
  @apply py-2 px-2 border;
  @apply text-sm font-bold;
  @apply bg-gray-300;
  @apply align-top text-left;
}

td {
  @apply py-2 px-2 border border-gray-300;
  @apply text-sm;
  @apply align-top;
}
</style>
