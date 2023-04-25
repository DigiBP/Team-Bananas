<template>
  <div class="mb-12">
    <h2 class="text-md font-bold mb-4">
      Process Instance
    </h2>
    <div class="flex mb-4">
      <label for="processInstanceId" class="block w-32 font-light pt-2 mr-4">ID</label>
      <div class="w-full">
        <input id="processInstanceId" v-model="processInstance.id" type="text" class="block w-full p-2 border border-1" readonly>
        <a target="_blank" :href="`https://digibp.herokuapp.com/camunda/app/cockpit/default/#/process-instance/${processInstance.id}`" class="block p-1 text-xs text-red-500">
          Open in Camunda
          <font-awesome-icon :icon="['fas', 'square-arrow-up-right']" />
        </a>
      </div>
    </div>
    <div class="flex mb-4">
      <label for="processInstanceKey" class="block w-32 font-light pt-2 mr-4">Key</label>
      <input id="processInstanceKey" v-model="processInstance.businessKey" type="text" class="w-full p-2 border border-1" readonly>
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
