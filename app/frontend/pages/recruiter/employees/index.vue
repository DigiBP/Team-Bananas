<template>
  <div>
    <div>
      <h1>Employees</h1>
      <p class="max-w-4xl mb-12">
        These are the Digisailors employees.
      </p>
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Photo</th>
            <th>Age</th>
            <th>Position</th>
            <th>Experience</th>
          </tr>
        </thead>
        <tr v-for="employee in employees" :key="employee._additional.id">
          <td>{{ employee.name }}</td>
          <td class="align-center">
            <img :src="pictureSlug(employee.name)" class="block w-40 border border-1 rounded-full" />
          </td>
          <td>{{ employee.age }}</td>
          <td>{{ employee.position }}</td>
          <td>{{ employee.experience }}</td>
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
    ...mapState(['employees'])
  },
  mounted () {
    this.$store.dispatch('fetchEmployees')
  },
  methods: {
    ...mapGetters({}),
    pictureSlug (employeeName) {
      const slug = employeeName.toLowerCase().replace(' ', '-')
      return `employees/${slug}.png`
    }
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
