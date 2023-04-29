<template>
  <div class="mb-12">
    <h2 class="text-md font-bold mb-4">
      Generate Job Ad
    </h2>
    <p class="mb-8">
      Please enter a few important skills or requirements to generate a job ad.
    </p>
    <div v-if="errors.length" class="text-sm bg-red-200 p-2 rounded-md mb-4">
      <ul v-for="error in errors" :key="error">
        <li>{{ error }}</li>
      </ul>
    </div>
    <div class="flex mb-4">
      <label for="skills" class="block w-32 font-light pt-2 mr-4">Skills</label>
      <textarea id="skills" v-model="skills" type="text" placeholder="List 3-5 skills" class="w-full p-2 border border-1" />
    </div>
    <div class="flex mb-4">
      <label for="fancy" class="block w-32 font-light pt-2 mr-4">Language</label>
      <select id="fancy" v-model="fancy" class="w-full p-2 border border-1">
        <option value="">
          Select Language Option
        </option>
        <option value="in formal business English">
          in formal business English
        </option>
        <option value="in easily understandable English">
          in easily understandable English
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
    <Button @clicked="validateForm()">
      <font-awesome-icon v-if="loadingJobAd" :icon="['fas', 'spinner']" spin />
      <span>Generate Job Ad</span>
    </Button>
    <span class="inline-block ml-4 text-gray-400">(can take up to 1 minute)</span>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Button from '~/components/Button'

export default {
  name: 'StepGenerateJobAd',
  components: { Button },
  data () {
    return {
      skills: '',
      fancy: '',
      loadingJobAd: false,
      errors: []
    }
  },
  computed: {
    ...mapState(['processInstance'])
  },
  methods: {
    validateForm () {
      this.errors = []

      if (!this.skills.trim()) {
        this.errors.push('Skills required.')
      }

      if (!this.fancy.trim()) {
        this.errors.push('Language option required.')
      }

      if (this.errors.length) {
        return false
      }

      this.generateJobAd()
    },
    generateJobAd () {
      this.loadingJobAd = true
      this.$store.dispatch('generateJobAd', {
        title: this.processInstance.title,
        skills: this.skills,
        fancy: this.fancy
      }).then(() => {
        this.$emit('completed')
      }).catch(() => {
        this.loadingJobAd = false
      }).finally(() => {
        this.loadingJobAd = false
      })
    }
  }
}
</script>
