<template>
  <div>
    <div v-if="!loadingProcess">
      <h1>Recruitment Drive for {{ processInstance.title }}</h1>
      <ProcessInstance />
      <div class="flex space-x-12">
        <div class="w-1/2">
          <JobAd>
            <div v-html="processInstance.jobAd" />
          </JobAd>
        </div>
        <div class="w-1/2">
          <div class="mb-4">
            <h2 class="mb-2">
              Internal Candidates
            </h2>
            <div v-if="processInstance.numInternalCandidates === null || processInstance.numInternalCandidates !== 0">
              <div v-if="loadingEmployees">
                <font-awesome-icon icon="spinner" spin />
              </div>
              <div v-else>
                <div v-if="processInstance.internalCandidates.length > 0">
                  <ul>
                    <li v-for="candidate in processInstance.internalCandidates" :key="candidate._additional.id">
                      {{ candidate.name }}
                      <span class="rounded-full px-1 py-0.5 text-xs bg-digisailor-accent text-white">
                        {{ (Math.round(candidate._additional.certainty * 10000) / 100) }}%
                      </span>
                    </li>
                  </ul>
                </div>
                <div v-else>
                  There are no internal candidates that match this position.
                </div>
                <div v-if="processInstance.numInternalCandidates === null" class="mt-4">
                  <Button v-if="processInstance.internalCandidates.length > 0" color="main" @clicked="proceedWithCandidates">
                    Proceed with internal candidates
                    <font-awesome-icon icon="arrow-right" />
                  </Button>
                  <Button color="main" @clicked="proceedWithoutCandidates">
                    Proceed without internal candidates
                    <font-awesome-icon icon="arrow-right" />
                  </Button>
                </div>
              </div>
            </div>
            <div v-else>
              <font-awesome-icon icon="check" />
              Process instance proceeded with no internal candidates.
            </div>
          </div>
          <div v-if="passedInternalCandidatesStage">
            <hr class="border-digisailor-default my-4">
            <h2 class="mb-2">
              External Applicants
            </h2>
            <div v-if="isWaitingForApplications" class="bg-green-100 text-green-700 mb-2 p-2 rounded-lg">
              <font-awesome-icon icon="envelope-open" />
              Currently open for applications.
            </div>
            <div v-else  class="bg-red-100 text-red-700 mb-2 p-2 rounded-lg">
              <font-awesome-icon icon="envelope-closed" />
              Currently not open for applications.
            </div>
            <p>
              ...todo...
            </p>
            <!-- ENOUGH APPLICATIONS RECEIVED -->
            <div v-if="isWaitingForApplications">
              <Button color="main" @clicked="postMessage('bananas_enough_applications')">
                Enough Applications Received
                <font-awesome-icon icon="arrow-right" />
              </Button>
            </div>
            <hr class="border-digisailor-default my-4">
            <h2 class="mb-2">
              Shortlist
            </h2>
            <p>
              ...todo...
            </p>
            <!-- APPLICANT INTERVIEWS DONE -->
            <div v-if="isWaitingForShortlist">
              <Button color="main" @clicked="postMessage('bananas_personal_interviews_done')">
                Personal Interviews Done
                <font-awesome-icon icon="arrow-right" />
              </Button>
            </div>
          </div>
        </div>
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
  layout: 'recruiter',
  asyncData ({ params }) {
    const slug = params.slug
    return { slug }
  },
  data () {
    return {
      loadingProcess: true,
      loadingEmployees: true
    }
  },
  computed: {
    ...mapState(['processInstance']),
    passedInternalCandidatesStage () {
      return this.processInstance.numInternalCandidates === 0 || this.processInstance.numInternalCandidates > 0
    },
    isWaitingForApplications () {
      return this.processInstance?.activities?.[0].activityId === 'wait_for_applicants'
    },
    isWaitingForShortlist () {
      return this.processInstance?.activities?.[0].activityId === 'wait_for_shortlist'
    }
  },
  mounted () {
    this.$store.dispatch('fetchInstance', {
      processInstanceId: this.slug
    }).then(() => {
      this.loadingProcess = false
      if (!this.processInstance.numInternalCandidates || this.processInstance.numInternalCandidates > 0) {
        this.$store.dispatch('matchEmployees').then(() => {
          this.loadingEmployees = false
        })
      } else {
        this.loadingEmployees = false
      }
    })
  },
  methods: {
    proceedWithCandidates () {
      this.$store.dispatch('proceedWithInternalCandidates').then(() => {
        this.$store.dispatch('fetchInstance', { processInstanceId: this.processInstance.processId })
      })
    },
    proceedWithoutCandidates () {
      this.$store.commit('SET_PROCESS_INSTANCE_INTERNAL_CANIDATES', [])
      this.$store.dispatch('proceedWithInternalCandidates').then(() => {
        this.$store.dispatch('fetchInstance', { processInstanceId: this.processInstance.processId })
      })
    },
    postMessage (messageName) {
      this.$store.dispatch('postMessageToProcessInstance', {
        messageName
      }).then(() => {
        this.$store.dispatch('fetchInstance', { processInstanceId: this.processInstance.processId })
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
