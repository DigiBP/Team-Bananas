import axios from 'axios'

const processInstance = {
  processId: '', // camunda id
  businessKey: '',
  title: '',
  office: '',
  department: '',
  manager: '',
  jobAd: '',
  _additional: {
    id: '', // weaviate id
    vector: []
  }
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
  processInstance,

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
    state.processInstance = processInstance
  },

  SET_PROCESS_INSTANCE: (state, processInstance) => {
    state.processInstance = processInstance
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
  },

  saveInstanceData ({ commit }) {
    return new Promise((resolve, reject) => {
      const url = '/api/store/save-instance-data'
      axios.post(url, {
        ...this.state.processInstance
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

  fetchEmployees ({ commit }) {
    return new Promise((resolve, reject) => {
      const url = '/api/store/employees'
      axios.get(url)
        .then((response) => {
          commit('SET_EMPLOYEES', response.data)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  fetchJobAds ({ commit }) {
    return new Promise((resolve, reject) => {
      const url = '/api/store/job-ads'
      axios.get(url)
        .then((response) => {
          commit('SET_JOB_ADS', response.data)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  fetchJobAd ({ commit }, { processInstanceId }) {
    return new Promise((resolve, reject) => {
      const url = `/api/store/job-ads/${processInstanceId}`
      axios.get(url)
        .then((response) => {
          commit('SET_PROCESS_INSTANCE', response.data)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  matchEmployees ({ commit, state }) {
    return new Promise((resolve, reject) => {
      const url = '/api/store/match-employees'
      axios.post(url, {
        vector: state.processInstance._additional.vector
      }).then((response) => {
        resolve(response)
      }).catch((error) => {
        reject(error)
      })
    })
  }

}
