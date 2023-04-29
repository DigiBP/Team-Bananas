<template>
  <div>
    <div>
      <h1>Recruitments</h1>
      <p class="max-w-4xl mb-4">
        These are the active recruitments.
      </p>
      <table>
        <thead>
          <tr>
            <th>Action</th>
            <th>Process ID</th>
            <th>Business Key</th>
            <th>Position</th>
            <th>Office</th>
            <th>Department</th>
            <th>Manager</th>
          </tr>
        </thead>
        <tr v-for="position in instances" :key="position.id">
          <td>
            <NuxtLink :to="`/recruiter/recruitments/${position.id}`">
              <Button color="main" size="small">
                View
              </Button>
            </NuxtLink>
          </td>
          <td>
            <div>
              {{ position.id }}
            </div>
            <a target="_blank" :href="`https://digibp.herokuapp.com/camunda/app/cockpit/default/#/process-instance/${position.id}`" class="block p-1 text-xs text-red-500">
              Open in Camunda
              <font-awesome-icon :icon="['fas', 'square-arrow-up-right']" />
            </a>
          </td>
          <td>{{ position.businessKey }}</td>
          <td>{{ position.title }}</td>
          <td>{{ position.office }}</td>
          <td>{{ position.department }}</td>
          <td>{{ position.manager }}</td>
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

export default {
  components: {
    Button
  },
  layout: 'recruiter',
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
