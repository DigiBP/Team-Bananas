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
          <!-- INTERNAL CNADIDATES STAGE -->
          <div v-if="!loadingEmployees" class="mb-4">
            <h2 class="mb-2">Internal Candidates</h2>
            <div v-if="loadingEmployees">
              <font-awesome-icon icon="spinner" spin />
            </div>
            <div v-else>
              <div v-if="isWaitingInternalCandidates">
                <div v-if="processInstance.internalCandidates.length > 0">
                  <ul>
                    <li v-for="candidate in processInstance.internalCandidates" :key="candidate._additional.id" class="mb-2">
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
                <div v-if="isWaitingInternalCandidates" class="mt-4">
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
              <div v-else>
                <font-awesome-icon icon="check" />
                Process instance proceeded with no internal candidates.
              </div>
            </div>
          </div>
          <!-- EXTERNAL APPLICANTS -->
          <div v-if="passedInternalCandidatesStage">
            <hr class="border-digisailor-default my-4">
            <h2 class="mb-2">
              External Applicants
            </h2>
            <div v-if="isWaitingForApplications" class="bg-green-100 text-green-700 mb-2 p-2 rounded-lg">
              <font-awesome-icon icon="envelope-open" />
              Position is open for applications. Job ad
              <a href="https://mstdn.social/@digisailors" target="_blank" class="underline">
                was published
                <font-awesome-icon :icon="['fas', 'square-arrow-up-right']" class="text-xs align-text-top" />
              </a>.
            </div>
            <div v-else class="bg-red-100 text-red-700 mb-2 p-2 rounded-lg">
              <font-awesome-icon icon="envelope-closed" />
              Currently not open for applications.
            </div>
            <div v-if="loadingApplicants">
              <font-awesome-icon icon="spinner" spin />
            </div>
            <ul v-else-if="processInstance.externalApplicants.length > 0" class="my-4">
              <li v-for="applicant in processInstance.externalApplicants" :key="applicant.processId" class="mb-2">
                <div class="p-4 bg-gray-200 rounded-md">
                  <div class="mb-2">
                    <strong>{{ applicant.name }}</strong>, {{ applicant.email }}
                    <div class="float-right inline-block p-1 w-8 h-8 rounded-full text-center text-white text-sm font-bold bg-black">
                      {{ applicant.category }}
                    </div>
                  </div>
                  <a :href="applicant.cv" target="_blank" class="inline rounded-md px-2 py-2 mr-2 text-xs bg-gray-600 text-white">
                    View CV
                  </a>
                  <!-- HOLD INTERVIEW -->
                  <NuxtLink v-if="applicant.category === 'A' && !applicant.hadScreeningInterview" :to="`/recruiter/interviews/${applicant.processId}`">
                    <Button size="small" color="blue-700">
                      Hold Interview
                    </Button>
                  </NuxtLink>
                  <!-- UPGRADE TO CATEGORY A -->
                  <Button v-if="applicant.category === 'B' && !applicant.hadScreeningInterview" size="small" color="pink-700" @clicked="upgradeApplicant(applicant)">
                    Upgrade to Category <span class="inline-block align-baseline bg-black text-xs text-white text-center rounded-full w-5 h-5">A</span>
                  </Button>
                  <div>
                    <a target="_blank" :href="`https://digibp.herokuapp.com/camunda/app/cockpit/default/#/process-instance/${applicant.processId}`" class="inline text-xs text-red-500">
                      Open in Camunda
                      <font-awesome-icon :icon="['fas', 'square-arrow-up-right']" />
                    </a>
                  </div>
                  <div>
                    <div v-if="applicant.hadScreeningInterview" class="text-green-700 mt-4">
                      <font-awesome-icon icon="check" /> Screening interview passed
                    </div>
                    <div v-if="applicant.hadSecondInterviewBooking" class="text-green-700 mt-4">
                      <font-awesome-icon icon="check" /> Has booked a slot for second interview
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <!-- ENOUGH APPLICATIONS RECEIVED -->
            <div v-if="isWaitingForApplications">
              <Button color="main" @clicked="postMessage('bananas_enough_applications')">
                Close for Applications
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
      loadingEmployees: true,
      loadingApplicants: true
    }
  },
  computed: {
    ...mapState(['processInstance']),
    isWaitingInternalCandidates () {
      return this.processInstance?.activities?.[0]?.activityId === 'search_internal_candidates'
    },
    passedInternalCandidatesStage () {
      return this.processInstance.numInternalCandidates === 0 || this.processInstance.numInternalCandidates > 0
    },
    isWaitingForApplications () {
      return this.processInstance?.activities?.[0]?.activityId === 'wait_for_applicants'
    },
    isWaitingForShortlist () {
      return this.processInstance?.activities?.[0]?.activityId === 'confirm_final_shortlist'
    }
  },
  mounted () {
    this.$store.commit('RESET_PROCESS_INSTANCE')
    this.loadingProcess = true
    this.loadingEmployees = true
    this.loadingApplicants = true
    this.$store.dispatch('fetchInstance', {
      processInstanceId: this.slug
    }).then(() => {
      this.loadingProcess = false
      this.$store.dispatch('matchEmployees').then(() => {
        this.loadingEmployees = false
      })
      this.$store.dispatch('fetchExternalApplicants').then(() => {
        this.loadingApplicants = false
      })
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
        this.loadingProcess = true
        this.$store.dispatch('fetchInstance', { processInstanceId: this.processInstance.processId }).then(() => {
          this.loadingProcess = false
        })
      })
    },
    postMessage (messageName) {
      this.$store.dispatch('postMessageToProcessInstance', {
        messageName
      }).then(() => {
        this.loadingProcess = true
        this.$store.dispatch('fetchInstance', { processInstanceId: this.processInstance.processId }).then(() => {
          this.loadingProcess = false
        })
      })
    },
    upgradeApplicant (applicant) {
      this.$store.dispatch('updateApplicant', {
        processInstanceId: applicant.processId,
        category: 'A'
      }).then(() => {
        this.$store.dispatch('fetchExternalApplicants').then(() => {
          this.loadingApplicants = false
        })
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
