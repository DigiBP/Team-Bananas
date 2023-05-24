<template>
  <div>
    <div v-if="!loadingProcess">
      <div v-if="!acceptsApplications">
        <p class="font-bold bg-red-200 p-4 mb-8 rounded-lg">
          This job is currently not accepting applications.
        </p>
      </div>
      <h1>{{ processInstance.title }}</h1>
      <div>
        Reference: {{ processInstance.businessKey }}<br />
        Office: {{ processInstance.office }}<br />
        Department: {{ processInstance.department }}
      </div>
      <JobAd type="applicant" class="max-w-lg">
        <div v-html="processInstance.jobAd" />
      </JobAd>
      <div>
        <Button color="accent" class="mb-12 mr-2">
          <NuxtLink to="/applicant">
            <font-awesome-icon icon="arrow-left" class="mr-2" />
            Back
          </NuxtLink>
        </Button>
        <div v-if="acceptsApplications" class="inline">
          <Button color="accent" class="mb-12">
            <a :href="link" target="_blank">
              Apply now
            </a>
            <font-awesome-icon icon="external-link-alt" class="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Button from '~/components/Button.vue'
import JobAd from '~/components/JobAd.vue'

export default {
  components: {
    Button,
    JobAd
  },
  layout: 'applicant',
  asyncData ({ params }) {
    const slug = params.slug
    return { slug }
  },
  data () {
    return {
      loadingProcess: true
    }
  },
  computed: {
    ...mapState(['processInstance']),
    link () {
      const url = 'https://docs.google.com/forms/d/e/1FAIpQLSfyZpUxoChHvMPmw_O7uYxtY2TZNQJ54Pu2Ae6J1CVgYwE1xA/viewform'
      return `${url}?usp=pp_url&entry.1110870665=${this.processInstance.processId}&entry.900296223=${this.processInstance.businessKey}&entry.2019870383=${this.processInstance.title}`
    },
    acceptsApplications () {
      return this.processInstance?.activities?.[0].activityId === 'wait_for_applicants'
    }
  },
  mounted () {
    this.$store.dispatch('fetchInstance', {
      processInstanceId: this.slug
    }).then(() => {
      this.loadingProcess = false
    })
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
</style>
