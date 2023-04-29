<template>
  <div class="mb-12">
    <h2 class="text-md font-bold mb-4">
      Edit Job Ad
    </h2>
    <div>
      <textarea
        v-model="editedJobAd"
        class="w-full h-64 border border-1 p-2 text-sm"
        @keyup="$store.commit('SET_PROCESS_INSTANCE_JOB_AD', editedJobAd)"
      />
    </div>
    <Button v-if="editedJobAd != originalJobAd" color="accent" @clicked="resetJobAd()">
      <font-awesome-icon :icon="['fas', 'times']" />
      <span>Reset Changes</span>
    </Button>
    <Button @clicked="validateForm()">
      <font-awesome-icon v-if="confirmingJobAd" :icon="['fas', 'spinner']" spin />
      <font-awesome-icon v-else :icon="['fas', 'check']" />
      <span>Confirm Job Ad</span>
    </Button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Button from '~/components/Button'

export default {
  name: 'StepConfirmJobAd',
  components: { Button },
  data () {
    return {
      editedJobAd: '',
      originalJobAd: '',
      confirmingJobAd: false,
      errors: []
    }
  },
  computed: {
    ...mapState(['processInstance'])
  },
  mounted () {
    this.editedJobAd = this.processInstance.jobAd
    this.originalJobAd = this.processInstance.jobAd
  },
  methods: {
    validateForm () {
      this.errors = []

      if (!this.editedJobAd.trim()) {
        this.errors.push('Job ad required.')
      }

      if (this.errors.length) {
        return false
      }

      this.confirmJobAd()
    },
    resetJobAd () {
      this.editedJobAd = this.originalJobAd
      this.$store.commit('SET_PROCESS_INSTANCE_JOB_AD', this.originalJobAd)
    },
    confirmJobAd () {
      this.confirmingJobAd = true
      this.$store.dispatch('confirmJobAd', {}).catch(() => {
        this.confirmingJobAd = false
      }).then(() => {
        this.$store.dispatch('saveInstanceData', {}).then(() => {
          this.$emit('completed')
        }).finally(() => {
          this.confirmingJobAd = false
        })
      })
    }
  }
}
</script>
