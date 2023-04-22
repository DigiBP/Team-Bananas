import axios from 'axios'

export const state = () => ({
  /* loading flags */
  loading: true, // app starts in loading mode
  loadingJobAd: false, // job ad is being generated

  /* auth flags */
  authenticated: false, // user is authenticated as hiring manager
  authFailed: false // user provided wrong password
})

export const getters = {
  /* augh getters */
  isAuthenticated: state => state.authenticated === true,
  isAuthFailed: state => state.authFailed === true
}

export const mutations = {
  RESET: (state) => {
    state.hash = ''
    state.publications = []
    state.reviewers = []
  },

  SET_LOADING: (state, loading) => {
    state.loading = (loading === true)
  },

  SET_LOADING_JOB_AD: (state, loadingJobAd) => {
    state.loadingJobAd = (loadingJobAd === true)
  },

  SET_AUTHENTICATED: (state, authenticated) => {
    state.authenticated = (authenticated === true)
  },

  SET_AUTH_FAILED: (state, authFailed) => {
    state.authFailed = (authFailed === true)
  }
}

export const actions = {

  login ({ commit, state }, { secret }) {
    if (secret === 'secret') {
      commit('SET_AUTHENTICATED', true)
      commit('SET_AUTH_FAILED', false)
    } else {
      commit('SET_AUTH_FAILED', true)
    }
  },

  generateJobAd ({ commit, state }, { title, skills }) {
    commit('SET_LOADING_JOB_AD', true)
    return new Promise((resolve, reject) => {
      const url = '/api/generate-job-ad'
      axios.post(url, {
        title,
        skills
      })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
        .finally(() => {
          commit('SET_LOADING_JOB_AD', false)
        })
    })
  }
}
