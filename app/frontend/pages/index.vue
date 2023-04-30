<template>
  <div>
    <h1>Digisailors <sup>ai</sup>HR Buddy &mdash; Your Virtual HR Assistant</h1>
    <p class="font-light text-base">
      Digisailors aims to bring businesses into the digital age through innovative and cutting-edge solutions.
      We empower companies to embrace digitalisation and provide a range of services that help businesses thrive
      in the digital landscape. By joining Digisailors, you will embark on a journey of digitalisation and help
      take your clients' business new heights in the digital realm. Join us today!
    </p>
    <div class="flex space-x-4 mt-12">
      <NuxtLink to="/manager" class="w-1/3">
        <Button size="large" color="default" class="w-full">
          For Managers
        </Button>
      </NuxtLink>
      <NuxtLink to="/recruiter" class="w-1/3">
        <Button size="large" color="main" class="w-full">
          For HR Staff
        </Button>
      </NuxtLink>
      <NuxtLink to="/applicant" class="w-1/3">
        <Button size="large" color="accent" class="w-full">
          For Applicants
        </Button>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Button from '~/components/Button.vue'

export default {
  components: {
    Button
  },
  layout: 'default',
  methods: {
    ...mapGetters({
      isStepSearch: 'isStepSearch'
    })
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

p {
  @apply max-w-4xl pt-4;

  &:first-of-type {
    @apply pt-0;
  }
}

ul {
  @apply list-disc ml-4 mt-2;
}

ol {
  @apply list-decimal ml-4;
}

li {
  @apply max-w-4xl;
}

strong {
  @apply font-bold;
}
</style>
