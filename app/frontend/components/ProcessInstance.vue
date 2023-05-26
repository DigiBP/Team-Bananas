<template>
  <div class="mb-12 p-4 rounded-md bg-gray-200">
    <h2 class="text-md font-bold mb-4">
      Recruitment Details
    </h2>
    <div class="flex space-x-12">
      <div class="w-1/2">
        <div class="flex mb-2">
          <label for="processInstanceKey">Position</label>
          <input id="processInstanceKey" v-model="processInstance.title" type="text" readonly>
        </div>
        <div class="flex mb-2">
          <label for="processInstanceKey">Key</label>
          <input id="processInstanceKey" v-model="processInstance.businessKey" type="text" readonly>
        </div>
        <div class="flex mb-2">
          <label for="processInstanceId">Process ID</label>
          <div class="w-full">
            <input id="processInstanceId" v-model="processInstance.processId" type="text" readonly>
            <a target="_blank" :href="`https://digibp.herokuapp.com/camunda/app/cockpit/default/#/process-instance/${processInstance.processId}`" class="block pt-1 pb-2 text-xs text-red-500">
              Open in Camunda
              <font-awesome-icon :icon="['fas', 'square-arrow-up-right']" />
            </a>
          </div>
        </div>
      </div>
      <div class="w-1/2">
        <div class="flex mb-2">
          <label for="processInstanceOffice">Office</label>
          <input id="processInstanceOffice" v-model="processInstance.office" type="text" readonly>
        </div>
        <div class="flex mb-2">
          <label for="processInstanceDepartment">Department</label>
          <input id="processInstanceDepartment" v-model="processInstance.department" type="text" readonly>
        </div>
        <div class="flex mb-2">
          <label for="processInstanceManager">Manager</label>
          <input id="processInstanceManager" v-model="processInstance.manager" type="text" readonly>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ProcessInstance',
  computed: {
    ...mapState(['processInstance'])
  }
}
</script>

<style lang="scss" scoped>
label {
  @apply block w-32 mr-4;
  @apply font-bold text-sm;
}

input {
  @apply w-full;
  @apply border-none bg-gray-200;
  @apply font-light text-sm;
}
</style>
