<template>
  <div class="mb-12">
    <h2 class="text-md font-bold mb-4">
      Start Process
    </h2>
    <p class="mb-8">
      Please enter the position title for the new position.
    </p>
    <div v-if="errors.length" class="text-sm bg-red-200 p-2 rounded-md mb-4">
      <ul v-for="error in errors" :key="error">
        <li>{{ error }}</li>
      </ul>
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
    <div class="flex mb-4">
      <label for="office" class="block w-32 font-light pt-2 mr-4">Office</label>
      <select id="office" v-model="office" class="w-full p-2 border border-1">
        <option value="">Select Office</option>
        <option value="Basel">Basel</option>
        <option value="Bern">Bern</option>
        <option value="Olten">Olten</option>
        <option value="Zurich">Zurich</option>
      </select>
    </div>
    <div class="flex mb-4">
      <label for="manager" class="block w-32 font-light pt-2 mr-4">Manager</label>
      <select id="manager" v-model="manager" class="w-full p-2 border border-1">
        <option value="">Select Manager</option>
        <option value="Heiri Nager">Heiri Nager</option>
        <option value="Vreni Zuffi">Vreni Zuffi</option>
      </select>
    </div>
    <div class="flex mb-4">
      <label for="department" class="block w-32 font-light pt-2 mr-4">Department</label>
      <select id="department" v-model="department" class="w-full p-2 border border-1">
        <option value="">Select Department</option>
        <option value="Sales">Sales</option>
        <option value="Marketing">Marketing</option>
        <option value="Consulting">Consulting</option>
        <option value="Technology">Technology</option>
        <option value="Backoffice">Backoffice</option>
      </select>
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
      office: '',
      manager: '',
      department: '',
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

      if (!this.office) {
        this.errors.push('Office name required.')
      }

      if (!this.manager) {
        this.errors.push('Manager name required.')
      }

      if (!this.department) {
        this.errors.push('Department name required.')
      }

      if (this.errors.length) {
        return false
      }

      this.startProcess()
    },
    startProcess () {
      this.startingProcess = true
      this.$store.dispatch('startProcessInstance', {
        title: this.title,
        office: this.office,
        manager: this.manager,
        department: this.department
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
