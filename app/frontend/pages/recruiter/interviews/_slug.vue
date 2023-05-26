<template>
  <div>
    <div v-if="!loadingApplicant">
      <h1>Screening Interview for {{ applicant.name }}</h1>
      <ProcessInstance />
      <div class="flex space-x-12 mb-12">
        <div class="w-1/2">
          <h2>Candidate</h2>
          <div class="font-bold">Name</div>
          <div class="mb-2">{{ applicant.name }}</div>

          <div class="font-bold">Email</div>
          <div class="mb-2">{{ applicant.email }}</div>

          <div class="font-bold">Scoring Category</div>
          <div class="mb-4">{{ applicant.category }}</div>

          <a :href="applicant.cv" target="_blank">
            <Button size="small" color="gray-600">
              View CV
            </Button>
          </a>
        </div>
        <div class="w-1/2">
          <h2>Screening Interview Notes</h2>
          <div>
            <textarea id="notes" v-model="notes" type="text" placeholder="Please enter notes from the screening interview" class="w-full h-32 border border-gray-600 p-2 rounded-md" />
          </div>
          <div v-if="hasNotes" class="flex space-x-4">
            <Button color="digisailor-main" @clicked="proceed()" class="w-1/2">
              Proceed to next round
              <font-awesome-icon icon="arrow-right" />
            </Button>
            <Button color="red-800" @clicked="reject()" class="w-1/2">
              <font-awesome-icon icon="ban" />
              Reject candidate
            </Button>
          </div>
        </div>
      </div>
      <p>
        <NuxtLink :to="`/recruiter/recruitments/${processInstance.processId}`">
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
import ProcessInstance from '~/components/ProcessInstance.vue'

export default {
  components: {
    Button,
    ProcessInstance
  },
  layout: 'recruiter',
  asyncData ({ params }) {
    const slug = params.slug
    return { slug }
  },
  data () {
    return {
      loadingApplicant: true,
      notes: ''
    }
  },
  computed: {
    ...mapState(['processInstance', 'applicant']),
    hasNotes () {
      return this.notes.length > 0
    }
  },
  mounted () {
    this.$store.dispatch('fetchApplicant', {
      processInstanceId: this.slug
    }).then(() => {
      this.loadingApplicant = false
    })
  },
  methods: {
    proceed () {
      this.$store.dispatch('screeningInterviewProceed', {
        processInstanceId: this.slug,
        notes: this.notes
      }).then(() => {
        this.$router.push(`/recruiter/recruitments/${this.processInstance.processId}`)
      })
    },
    reject () {
      this.$store.dispatch('screeningInterviewReject', {
        processInstanceId: this.slug,
        notes: this.notes
      }).then(() => {
        this.$router.push(`/recruiter/recruitments/${this.processInstance.processId}`)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
h1 {
  @apply text-2xl pt-4 pb-2 mb-8;
}

h2 {
  @apply text-lg font-bold pt-4 pb-2;
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
