<template>
  <div>
    <div>
      <h1>Recruitment Drive for {{ processInstance.title }}</h1>
      <p>
        {{ slug }}
      </p>
      <p>
        <JobAd>
          <div v-html="processInstance.jobAd" class="max-w-xl" />
        </JobAd>
      </p>
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

export default {
  components: {
    Button, JobAd
  },
  layout: 'recruiter',
  asyncData ({ params }) {
    const slug = params.slug
    return { slug }
  },
  computed: {
    ...mapState(['processInstance'])
  },
  mounted () {
    this.$store.dispatch('fetchJobAd', {
      processInstanceId: this.slug
    }).then(() => {
      this.$store.dispatch('matchEmployees')
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
