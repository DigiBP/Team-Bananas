<template>
  <div>
    <div class="main">
      <Header />
      <div class="wrapper">
        <div v-if="loading">
          Loading application...
        </div>
        <div v-else-if="!isAuthenticated()">
          <h1 class="text-xl">
            Login
          </h1>
          <p v-if="isAuthFailed()" class="my-8 p-2 rounded-lg text-red-800 bg-red-100">
            Invalid password. Please try again.
          </p>
          <p v-else class="my-8 p-2 rounded-lg bg-gray-300">
            You are not logged in. Please login to continue.
          </p>
          <div class="flex">
            <label for="password" class="block font-light pt-2 mr-4">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Password"
              class="p-2 border border-1"
              @keyup.enter="login"
            >
          </div>
          <input type="submit" value="Login" class="bg-digisailor-default hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded mt-4" @click="login">
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
import { mapGetters, mapState } from 'vuex'
import Header from '~/components/Header'
import Footer from '~/components/Footer'

export default {
  components: { Footer, Header },
  data () {
    return {
      password: ''
    }
  },
  computed: {
    ...mapState(['loading'])
  },
  mounted () {
    this.$store.commit('SET_LOADING', false)
  },
  methods: {
    ...mapGetters({
      isAuthenticated: 'isManagerAuthenticated',
      isAuthFailed: 'isManagerAuthFailed'
    }),
    login () {
      this.$store.dispatch('loginManager', { secret: this.password }).then(() => {
        this.password = ''
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  @apply flex flex-col justify-center min-h-screen;

  background-image: url('/brand.jpg');
  background-size: cover;
  background-position: center;
}

.wrapper {
  @apply w-full max-w-screen-xl flex-grow my-16 pt-8 pb-8 pl-12 pr-12 m-auto;
  @apply bg-white bg-opacity-90 backdrop-blur-lg drop-shadow-md shadow-sm;
  @apply rounded-lg;
}
</style>
