<template>
  <div>
    <div class="w-full">
      <h1 class="text-xl font-bold mb-8">
        Start New Hiring Process
      </h1>
    </div>
    <Transition>
      <div v-if="step >= 1" class="flex flex-start space-x-12">
        <div class="w-1/2">
          <ProcessInstance />
        </div>
        <div class="w-1/2">
          &nbsp;
        </div>
      </div>
    </Transition>
    <div class="flex flex-start space-x-12">
      <div class="w-1/2 flex-grow-1 flex-shrink-1">
        <Transition>
          <StepPositionTitle v-if="step === 0" @completed="step = 1" />
          <StepGenerateJobAd v-if="step === 1" @completed="step = 2" />
          <StepConfirmJobAd v-if="step === 2" @completed="step = 3" />
          <div v-if="step === 3" class="mb-12">
            <h2 class="text-md font-bold mb-4">
              Nice Job!
            </h2>
            <p>
              We will keep you posted on the progress of the hiring process.
            </p>
            <p>
              <NuxtLink to="/">
                <Button>
                  Back to Dashboard
                </Button>
              </NuxtLink>
            </p>
          </div>
        </Transition>
      </div>
      <div class="w-1/2 flex-grow-1 flex-shrink-1">
        <Transition>
          <div v-if="step === 2">
            <h2 class="text-md font-bold mb-4">
              Job Ad Preview
            </h2>
            <JobAd>
              <div v-html="processInstance.jobAd" />
            </JobAd>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import JobAd from '~/components/JobAd'
import ProcessInstance from '~/components/ProcessInstance'
import StepConfirmJobAd from '~/components/NewPosition/StepConfirmJobAd.vue'
import StepGenerateJobAd from '~/components/NewPosition/StepGenerateJobAd.vue'
import StepPositionTitle from '~/components/NewPosition/StepPositionTitle.vue'

export default {
  components: { JobAd, ProcessInstance, StepConfirmJobAd, StepGenerateJobAd, StepPositionTitle },
  layout: 'manager',
  data () {
    return {
      step: 0
    }
  },
  computed: {
    ...mapState(['processInstance'])
  }
}
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
