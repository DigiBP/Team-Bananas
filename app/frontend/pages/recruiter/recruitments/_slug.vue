<template>
  <div>
    <div v-if="!loadingProcess">
      <h1>Recruitment Drive for {{ processInstance.title }}</h1>
      <ProcessInstance />
      <p>
        <JobAd>
          <div v-html="processInstance.jobAd" class="max-w-xl" />
        </JobAd>
      </p>
      <div v-if="loadingEmployees">
        <font-awesome-icon icon="spinner" spin />
      </div>
      <div v-else>
        ...employees...
      </div>
      <p>
        <NuxtLink to="/recruiter/recruitments">
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
import ProcessInstance from '~/components/ProcessInstance.vue'

export default {
  components: {
    Button,
    JobAd,
    ProcessInstance
  },
  layout: 'recruiter',
  asyncData ({ params }) {
    const slug = params.slug
    return { slug }
  },
  data () {
    return {
      loadingProcess: true,
      loadingEmployees: false
    }
  },
  computed: {
    ...mapState(['processInstance'])
  },
  mounted () {
    this.$store.dispatch('fetchJobAd', {
      processInstanceId: this.slug
    }).then(() => {
      this.loadingProcess = false
      this.loadingEmployees = true
      this.$store.dispatch('matchEmployees').then(() => {
        this.loadingEmployees = false
      })
    })
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
