<template>
  <div>
    <div v-if="!loadingProcess">
      <h1>Shortlist for {{ processInstance.title }}</h1>
      <ProcessInstance />
      <div class="flex space-x-12">
        <div class="w-1/2">
          <JobAd>
            <div v-html="processInstance.jobAd" />
          </JobAd>
        </div>
        <div class="w-1/2">
          <div v-if="hasShortlist">
            <h2>Shortlist Order</h2>
            <ul>
              <li v-for="item in getShortlist" :key="item.email" class="flex space-x-4">
                <div class="w-3/4">
                  {{ item.name }} ({{ item.email }})
                </div>
                <div class="w-1/4 flex space-x-2">
                  <Button color="main" size="small ">
                    <font-awesome-icon icon="arrow-up" />
                  </Button>
                  <Button color="main" size="small">
                    <font-awesome-icon icon="arrow-down" />
                  </Button>
                </div>
              </li>
            </ul>
            <p class="mt-8 px-4 py-2 rounded-md bg-red-200">
              <strong>Attention:</strong> by confirming below the system will send a job offer to the first
              candidate on the shortlist. In case the candidate declines, the next candidate from the job list
              will be offered the job.
            </p>
            <Button color="main" class="mt-8" @clicked="confirmOrder">
              Confirm Order and Proceed to Contract
              <font-awesome-icon icon="arrow-right" />
            </Button>
          </div>
          <div v-else>
            No shortlisted candidates yet.
          </div>
        </div>
      </div>
      <p>
        <NuxtLink to="/manager">
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
import { mapState } from 'vuex'
import Button from '~/components/Button.vue'
import JobAd from '~/components/JobAd.vue'
import ProcessInstance from '~/components/ProcessInstance.vue'

export default {
  components: {
    Button,
    JobAd,
    ProcessInstance
  },
  layout: 'manager',
  asyncData ({ params }) {
    const slug = params.slug
    return { slug }
  },
  data () {
    return {
      loadingProcess: true,
      loadingEmployees: true,
      loadingApplicants: true
    }
  },
  computed: {
    ...mapState(['processInstance']),
    hasShortlist () {
      return this.processInstance?.shortlistNames?.length > 0
    },
    getShortlist () {
      const names = JSON.parse(this.processInstance.shortlistNames)
      const emails = JSON.parse(this.processInstance.shortlistEmails)

      return names.map((name, index) => {
        return {
          name,
          email: emails[index]
        }
      })
    }
  },
  mounted () {
    this.$store.commit('RESET_PROCESS_INSTANCE')
    this.loadingProcess = true
    this.$store.dispatch('fetchInstance', {
      processInstanceId: this.slug
    }).then(() => {
      this.loadingProcess = false
    })
  },
  methods: {
    confirmOrder () {
      this.$store.dispatch('managerConfirmShortlistOrder', {
        processInstanceId: this.slug
      }).then(() => {
        this.$router.push('/manager')
      })
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
