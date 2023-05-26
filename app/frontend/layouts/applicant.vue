<template>
  <div>
    <div class="main">
      <Header color="accent" />
      <div class="wrapper">
        <div v-if="loading">
          Loading application...
        </div>
        <div v-else>
          <Nuxt />
        </div>
      </div>
      <Footer />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Header from '~/components/Header'
import Footer from '~/components/Footer'

export default {
  components: { Footer, Header },
  computed: {
    ...mapState(['loading'])
  },
  mounted () {
    this.$store.commit('SET_LOADING', false)
    this.$store.commit('RESET_PROCESS_INSTANCE')
  }
}
</script>

<style lang="scss" scoped>
.main {
  @apply flex flex-col justify-center min-h-screen;
  @apply bg-gradient-to-b from-digisailor-accent to-gray-600 bg-opacity-20;
}

.wrapper {
  @apply w-full max-w-screen-xl flex-grow my-16 pt-8 pb-8 pl-12 pr-12 m-auto;
  @apply bg-white bg-opacity-90 backdrop-blur-lg drop-shadow-md shadow-sm;
  @apply rounded-lg;
}
</style>
