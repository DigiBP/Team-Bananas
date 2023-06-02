<template>
  <div>
    <div v-if="!loading">
      <h1>Employee: {{ employee.name }}</h1>
      <ul>
        <li>
          <strong>Age:</strong>
          {{ employee.age }}
        </li>
        <li>
          <strong>Position:</strong>
          {{ employee.position }}
        </li>
      </ul>

      <h2>Experience</h2>
      <p>
        {{ employee.experience }}
      </p>
      <p>
        <NuxtLink to="/recruiter/employees">
          <Button color="main">
            <font-awesome-icon icon="arrow-left" />
            Back
          </Button>
        </NuxtLink>
      </p>
    </div>
    <div v-else>
      <font-awesome-icon icon="spinner" spin />
      Loading...
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Button from '~/components/Button.vue'

export default {
  components: {
    Button
  },
  layout: 'recruiter',
  asyncData ({ params }) {
    const slug = params.slug
    return { slug }
  },
  data () {
    return {
      loading: true,
      employee: {}
    }
  },
  computed: {
    ...mapState(['employees'])
  },
  mounted () {
    this.$store.dispatch('fetchEmployees').then(() => {
      this.employee = this.employees.find((employee) => {
        return employee._additional.id === this.slug
      })
      this.loading = false
    })
  }
}
</script>

<style lang="scss" scoped>
h1 {
  @apply text-2xl pt-4 pb-8;
}

h2 {
  @apply text-lg font-normal pt-8 pb-2;
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
