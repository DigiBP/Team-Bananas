<template>
  <div>
    Loading...
  </div>
</template>

<script>
export default {
  layout: 'applicant',
  mounted () {
    this.$router.push(`/applicant/jobad/${this.$route.query.key}`)
  }
}
</script>
