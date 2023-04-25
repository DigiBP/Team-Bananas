<template>
  <div class="mb-12">
    <h2 class="text-md font-bold mb-4">
      Start Process
    </h2>
    <p class="mb-8">
      Please enter the position title for the new position.
    </p>
    <div v-if="errors.length" class="text-sm bg-red-200 p-2 rounded-md mb-4">
      {{ errors.join(', ') }}
    </div>
    <div class="flex mb-4">
      <label for="position" class="block w-32 font-light pt-2 mr-4">Position</label>
      <input
        id="position"
        v-model="title"
        type="text"
        placeholder="Position Title"
        class="w-full p-2 border border-1"
        required
      >
    </div>
    <Button @clicked="validateForm()">
      <font-awesome-icon v-if="startingProcess" :icon="['fas', 'spinner']" spin />
      <span>Start Hiring Process</span>
    </Button>
  </div>
</template>

<script>
import Button from '~/components/Button'

export default {
  name: 'PositionTitle',
  components: { Button },
  data () {
    return {
      title: '',
      startingProcess: false,
      errors: []
    }
  },
  methods: {
    validateForm () {
      this.errors = []

      if (!this.title) {
        this.errors.push('Position title required.')
      }

      if (this.errors.length) {
        return false
      }

      this.startProcess()
    },
    startProcess () {
      this.startingProcess = true
      this.$store.dispatch('startProcessInstance', {
        title: this.title
      }).then(() => {
        this.$emit('completed')
      }).catch(() => {
        this.startingProcess = false
      }).finally(() => {
        this.startingProcess = false
      })
    }
  }
}
</script>
