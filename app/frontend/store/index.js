import axios from 'axios'

export const state = () => ({
  /* loading flags */
  loading: true, // app starts in loading mode
  loadingJobAd: false, // job ad is being generated

  /* auth flags */
  auth: {
    manager: false, // user is authenticated as hiring manager
    managerFailed: false // user provided wrong password
  },

  /* jobAd */
  jobAd: ''
})

export const getters = {
  /* augh getters */
  isManagerAuthenticated: state => state.auth.manager === true,
  isManagerAuthFailed: state => state.auth.managerFailed === true
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

  SET_MANAGER_AUTHENTICATED: (state, authenticated) => {
    state.auth.manager = (authenticated === true)
  },

  SET_MANAGER_AUTH_FAILED: (state, failed) => {
    state.auth.managerFailed = (failed === true)
  },

  SET_JOB_AD: (state, jobAd) => {
    state.jobAd = jobAd.replace(/\n/g, '<br />')
  }
}

export const actions = {

  loginManager ({ commit, state }, { secret }) {
    if (secret === 'secret') {
      commit('SET_MANAGER_AUTHENTICATED', true)
      commit('SET_MANAGER_AUTH_FAILED', false)
    } else {
      commit('SET_MANAGER_AUTH_FAILED', true)
    }
  },

  generateJobAd ({ commit, state }, { title, skills }) {
    commit('SET_LOADING_JOB_AD', true)
    return new Promise((resolve, reject) => {
      const url = '/api/ai/generate-job-ad'
      axios.post(url, {
        title,
        skills
      })
        .then((response) => {
          commit('SET_JOB_AD', response.data.text)
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
