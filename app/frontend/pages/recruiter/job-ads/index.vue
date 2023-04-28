<template>
  <div>
    <div>
      <h1>Job Ads</h1>
      <p class="max-w-4xl mb-12">
        These are the previously generated job ads.
      </p>
      <table>
        <thead>
          <tr>
            <th>Process ID</th>
            <th>Business Key</th>
            <th>Position</th>
            <th>Job Ad</th>
          </tr>
        </thead>
        <tr v-for="position in jobAds" :key="position._additional.id">
          <td>
            <div>
              {{ position.processId }}
            </div>
            <a target="_blank" :href="`https://digibp.herokuapp.com/camunda/app/cockpit/default/#/process-instance/${position.processId}`" class="block p-1 text-xs text-red-500">
              Open in Camunda
              <font-awesome-icon :icon="['fas', 'square-arrow-up-right']" />
            </a>
          </td>
          <td>{{ position.businessKey }}</td>
          <td>{{ position.title }}</td>
          <td>
            <JobAd>
              <div v-html="position.jobAd" />
            </JobAd>
          </td>
        </tr>
      </table>
      <p>
        <NuxtLink to="/recruiter">
          <Button color="main">
            <font-awesome-icon icon="arrow-left" />
            Back
          </Button>
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Button from '~/components/Button.vue'
import JobAd from '~/components/JobAd.vue'

export default {
  components: {
    Button,
    JobAd
  },
  layout: 'recruiter',
  computed: {
    ...mapState(['jobAds'])
  },
  mounted () {
    this.$store.dispatch('fetchJobAds')
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
