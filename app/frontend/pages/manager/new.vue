<template>
  <div>
    <div>
      <h1>Request New Position</h1>
      <p class="mb-8">
        Please fill out the form below to request a new position.
      </p>
      <div class="flex mb-4">
        <label for="position" class="block w-32 font-light pt-2 mr-4">Position</label>
        <input id="position" v-model="title" type="text" placeholder="Position Title" class="w-full p-2 border border-1">
      </div>
      <div class="flex mb-4">
        <label for="skills" class="block w-32 font-light pt-2 mr-4">Skills</label>
        <textarea id="skills" v-model="skills" type="text" placeholder="List 3-5 skills" class="w-full p-2 border border-1" />
      </div>
      <div>
        <div class="inline-block cursor-pointer bg-digisailor-default hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded mt-4" @click="generate">
          <i v-if="loadingJobAd" class="fa fa-spinner fa-spin" />
          <span>Generate Job Ad</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  layout: 'manager',
  data () {
    return {
      title: '',
      skills: ''
    }
  },
  computed: {
    ...mapState(['loadingJobAd'])
  },
  methods: {
    generate () {
      this.$store.dispatch('generateJobAd', {
        title: this.title,
        skills: this.skills
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
