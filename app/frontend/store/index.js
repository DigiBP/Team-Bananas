import axios from 'axios'

const processInstance = {
  id: '',
  businessKey: '',
  title: '',
  jobAd: ''
}

export const state = () => ({
  /* loading flag */
  loading: true, // global lading flag on app init

  /* auth flags */
  auth: {
    manager: false, // user is authenticated as hiring manager
    managerFailed: false // user provided wrong password
  },

  /* current process instance data for UI */
  processInstance
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

  /* auth mutations */

  SET_MANAGER_AUTHENTICATED: (state, authenticated) => {
    state.auth.manager = (authenticated === true)
  },

  SET_MANAGER_AUTH_FAILED: (state, failed) => {
    state.auth.managerFailed = (failed === true)
  },

  /* process instance mutations */

  RESET_PROCESS_INSTANCE: (state) => {
    state.processInstance = processInstance
  },

  SET_PROCESS_INSTANCE_ID: (state, id) => {
    state.processInstance.id = id
  },

  SET_PROCESS_INSTANCE_BUSINESS_KEY: (state, businessKey) => {
    state.processInstance.businessKey = businessKey
  },

  SET_PROCESS_INSTANCE_TITLE: (state, title) => {
    state.processInstance.title = title
  },

  SET_PROCESS_INSTANCE_JOB_AD: (state, jobAd) => {
    state.processInstance.jobAd = jobAd
  }
}

export const actions = {

  loginManager ({ commit }, { secret }) {
    if (secret === 'secret') {
      commit('SET_MANAGER_AUTHENTICATED', true)
      commit('SET_MANAGER_AUTH_FAILED', false)
    } else {
      commit('SET_MANAGER_AUTH_FAILED', true)
    }
  },

  startProcessInstance ({ commit }, { title }) {
    return new Promise((resolve, reject) => {
      commit('RESET_PROCESS_INSTANCE')
      commit('SET_PROCESS_INSTANCE_TITLE', title)

      const url = '/api/camunda/start-instance'
      axios.post(url, { title })
        .then((response) => {
          commit('SET_PROCESS_INSTANCE_ID', response.data.id)
          commit('SET_PROCESS_INSTANCE_BUSINESS_KEY', response.data.businessKey)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  generateJobAd ({ commit }, { title, skills, fancy }) {
    return new Promise((resolve, reject) => {
      const url = '/api/ai/generate-job-ad'
      axios.post(url, {
        title,
        skills,
        fancy
      })
        .then((response) => {
          console.log(response.data) // eslint-disable-line no-console
          commit('SET_PROCESS_INSTANCE_JOB_AD', response.data.message)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  confirmJobAd ({ commit }) {
    return new Promise((resolve, reject) => {
      const url = '/api/camunda/confirm-job-ad'
      axios.post(url, {
        ...this.state.processInstance
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        reject(error)
      })
    })
  }

}
