<template>
  <div>
    <div class="w-full">
      <h1>New Position</h1>
      <p class="mb-8">
        Please follow the steps below to initiate the process for a new position.
      </p>
    </div>
    <div class="flex">
      <div class="w-128 mr-12 flex-grow-0 flex-shrink-0">
        <div class="mb-12">
          <h2>Start Process</h2>
          <p class="mb-8">
            Please enter the position title for the new position.
          </p>
          <div class="flex mb-4">
            <label for="position" class="block w-32 font-light pt-2 mr-4">Position</label>
            <input id="position" v-model="title" type="text" placeholder="Position Title" class="w-full p-2 border border-1">
          </div>
          <Button @clicked="startProcess()">
            <font-awesome-icon v-if="startingProcess" :icon="['fas', 'spinner']" spin />
            <span>Start</span>
          </Button>
        </div>

        <div>
          <h2>Generate Job Ad</h2>
          <p class="mb-8">
            Please enter a few important skills or requirements to generate a job ad.
          </p>
          <div class="flex mb-4">
            <label for="skills" class="block w-32 font-light pt-2 mr-4">Skills</label>
            <textarea id="skills" v-model="skills" type="text" placeholder="List 3-5 skills" class="w-full p-2 border border-1" />
          </div>
          <div class="flex mb-4">
            <label for="fancy" class="block w-32 font-light pt-2 mr-4">Fancy Factor</label>
            <select id="fancy" v-model="fancy" class="w-full p-2 border border-1">
              <option value="in English" selected>
                in English
              </option>
              <option value="as Yoda would have written it">
                in Yoda English
              </option>
              <option value="in Pirate English">
                in Pirate English
              </option>
              <option value="in Lolcat English">
                in Lolcat English
              </option>
              <option value="in 13th century English">
                in 13th century English
              </option>
            </select>
          </div>
          <Button @clicked="generateJobAd()">
            <font-awesome-icon v-if="loadingJobAd" :icon="['fas', 'spinner']" spin />
            <span>Generate Job Ad</span>
          </Button>
          <span class="inline-block ml-4 text-gray-400">(can take up to 1 minute)</span>
        </div>
      </div>

      <div class="w-full flex-grow-1 flex-shrink-1">
        <div v-if="processInstance.id">
          <h2>Process Instance</h2>
          <div class="flex mb-4">
            <label for="processInstanceId" class="block w-32 font-light pt-2 mr-4">ID</label>
            <input id="processInstanceId" v-model="processInstance.id" type="text" class="w-full p-2 border border-1" readonly>
          </div>
          <div class="flex mb-4">
            <label for="processInstanceKey" class="block w-32 font-light pt-2 mr-4">Business Key</label>
            <input id="processInstanceKey" v-model="processInstance.businessKey" type="text" class="w-full p-2 border border-1" readonly>
          </div>
        </div>

        <div v-if="processInstance.jobAd">
          <h2>Job Ad</h2>
          <JobAd>
            <div v-html="processInstance.jobAd" />
          </JobAd>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Button from '~/components/Button'
import JobAd from '~/components/JobAd'

export default {
  components: { Button, JobAd },
  layout: 'manager',
  data () {
    return {
      title: '',
      skills: '',
      fancy: 'in English',
      startingProcess: false,
      loadingJobAd: false
    }
  },
  computed: {
    ...mapState(['processInstance'])
  },
  methods: {
    startProcess () {
      this.startingProcess = true
      this.$store.dispatch('startProcessInstance', {
        title: this.title
      }).catch(() => {
        this.startingProcess = false
      }).finally(() => {
        this.startingProcess = false
      })
    },
    generateJobAd () {
      this.loadingJobAd = true
      this.$store.dispatch('generateJobAd', {
        title: this.title,
        skills: this.skills,
        fancy: this.fancy
      }).catch(() => {
        this.loadingJobAd = false
      }).finally(() => {
        this.loadingJobAd = false
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

ul {
  @apply list-disc ml-4 mt-2;
}

ol {
  @apply list-decimal ml-4;
}
</style>
