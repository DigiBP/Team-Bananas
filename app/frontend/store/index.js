import axios from 'axios'

const initProcessInstance = {
  processId: '', // camunda id
  businessKey: '',
  title: '',
  office: '',
  department: '',
  manager: '',
  jobAd: '',
  numInternalCandidates: null,
  internalCandidates: [],
  externalApplicants: []
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
  processInstance: initProcessInstance,

  /* employee data from store */
  employees: [],

  /* instances from camunda */
  instances: [],

  /* job ad data from store */
  jobAds: []
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
    state.processInstance = initProcessInstance
  },

  SET_PROCESS_INSTANCE: (state, processInstance) => {
    state.processInstance = initProcessInstance
    state.processInstance = Object.assign(state.processInstance, processInstance)
  },

  SET_PROCESS_INSTANCE_ID: (state, id) => {
    state.processInstance.processId = id
  },

  SET_PROCESS_INSTANCE_BUSINESS_KEY: (state, businessKey) => {
    state.processInstance.businessKey = businessKey
  },

  SET_PROCESS_INSTANCE_TITLE: (state, title) => {
    state.processInstance.title = title
  },

  SET_PROCESS_INSTANCE_OFFICE: (state, office) => {
    state.processInstance.office = office
  },

  SET_PROCESS_INSTANCE_DEPARTMENT: (state, department) => {
    state.processInstance.department = department
  },

  SET_PROCESS_INSTANCE_MANAGER: (state, manager) => {
    state.processInstance.manager = manager
  },

  SET_PROCESS_INSTANCE_JOB_AD: (state, jobAd) => {
    state.processInstance.jobAd = jobAd
  },

  SET_PROCESS_INSTANCE_INTERNAL_CANIDATES: (state, internalCandidates) => {
    state.processInstance.internalCandidates = internalCandidates
  },

  SET_PROCESS_INSTANCE_NUM_INTERNAL_CANIDATES: (state, numInternalCandidates) => {
    state.processInstance.numInternalCandidates = numInternalCandidates
  },

  /* instances mutations */

  SET_INSTANCES: (state, instances) => {
    state.instances = instances
  },

  /* employee mutations */

  SET_EMPLOYEES: (state, employees) => {
    state.employees = employees
  },

  /* job ad mutations */

  SET_JOB_ADS: (state, jobAds) => {
    state.jobAds = jobAds
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

  startProcessInstance ({ commit }, { title, manager, department, office }) {
    return new Promise((resolve, reject) => {
      commit('RESET_PROCESS_INSTANCE')
      commit('SET_PROCESS_INSTANCE_TITLE', title)
      commit('SET_PROCESS_INSTANCE_OFFICE', office)
      commit('SET_PROCESS_INSTANCE_MANAGER', manager)
      commit('SET_PROCESS_INSTANCE_DEPARTMENT', department)

      const url = '/api/camunda/start-instance'
      axios.post(url, {
        title,
        manager,
        department,
        office
      }).then((response) => {
        commit('SET_PROCESS_INSTANCE_ID', response.data.id)
        commit('SET_PROCESS_INSTANCE_BUSINESS_KEY', response.data.businessKey)
        resolve(response)
      }).catch((error) => {
        reject(error)
      })
    })
  },

  generateJobAd ({ commit, state }, { skills, fancy }) {
    return new Promise((resolve, reject) => {
      const url = '/api/ai/generate-job-ad'
      axios.post(url, {
        title: state.processInstance.title,
        office: state.processInstance.office,
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

  confirmJobAd ({ commit, state }) {
    return new Promise((resolve, reject) => {
      const url = '/api/camunda/confirm-job-ad'
      axios.post(url, {
        ...state.processInstance
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        reject(error)
      })
    })
  },

  saveJobAdData ({ commit, state }) {
    return new Promise((resolve, reject) => {
      const url = '/api/store/save-job-ad'
      axios.post(url, {
        ...state.processInstance
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        reject(error)
      })
    })
  },

  fetchInstances ({ commit }) {
    return new Promise((resolve, reject) => {
      const url = '/api/camunda/list-instances'
      axios.get(url)
        .then((response) => {
          commit('SET_INSTANCES', response.data)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  fetchInstance ({ commit }, { processInstanceId }) {
    return new Promise((resolve, reject) => {
      const url = '/api/camunda/get-instance'
      axios.post(url, { processInstanceId })
        .then((response) => {
          commit('SET_PROCESS_INSTANCE', response.data)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  fetchEmployees ({ commit }) {
    return new Promise((resolve, reject) => {
      const url = '/api/store/employees'
      axios.get(url)
        .then((response) => {
          commit('SET_EMPLOYEES', response.data)
          resolve(response)
        })
        .catch((error) => {
          resolve(error)
        })
    })
  },

  matchEmployees ({ commit, state }) {
    return new Promise((resolve, reject) => {
      const url = '/api/store/match-employees'
      axios.post(url, {
        ...state.processInstance
      }).then((response) => {
        commit('SET_PROCESS_INSTANCE_INTERNAL_CANIDATES', response.data)
        resolve(response)
      }).catch((error) => {
        reject(error)
      })
    })
  },

  proceedWithInternalCandidates ({ commit, state }) {
    return new Promise((resolve, reject) => {
      const url = '/api/camunda/confirm-internal-candidates'
      commit('SET_PROCESS_INSTANCE_NUM_INTERNAL_CANIDATES', state.processInstance.internalCandidates.length)
      axios.post(url, {
        ...state.processInstance
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        reject(error)
      })
    })
  }

}
