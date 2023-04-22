import axios from 'axios'

/*
 * Flask endpoint
 */
const baseApiUrl = '/api/v1'

export const STEP_SEARCH = 'search'
export const STEP_REFINE_RESULTS = 'refine'
export const STEP_RESOLVE = 'resolve'
export const STEP_RECOMMEND = 'recommend'

export const state = () => ({
  loading: true, // app starts in loading mode
  loadingPublications: false, // loading indicator for searching similar pubs
  loadingReviewers: false, // loading indicator for refining search results anf loading reviewer data
  loadingResolutions: false, // loading indicator while the async / background job is running on the server and COIs are resolved

  step: STEP_SEARCH,

  search: {
    title: '',
    abstract: '',
    emails: ''
  },

  hash: '',
  publications: [],
  reviewers: []
})

export const getters = {
  isStepSearch: state => state.step === STEP_SEARCH,
  isStepRefine: state => state.step === STEP_REFINE_RESULTS,
  isStepResolve: state => state.step === STEP_RESOLVE,
  isStepRecommend: state => state.step === STEP_RECOMMEND
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

  SET_LOADING_PUBLICATIONS: (state, loading) => {
    state.loadingPublications = (loading === true)
  },

  SET_LOADING_REVIEWERS: (state, loading) => {
    state.loadingReviewers = (loading === true)
  },

  SET_LOADING_RESOLUTIONS: (state, loading) => {
    state.loadingResolutions = (loading === true)
  },

  SET_STEP: (state, step) => {
    state.step = step
  },

  SET_HASH: (state, hash) => {
    state.hash = hash
  },

  SET_PUBLICATIONS: (state, publications) => {
    // add the 'checked' prop
    state.publications = publications.map(o => ({ ...o, checked: true }))
  },

  SET_REVIEWERS: (state, reviewers) => {
    state.reviewers = reviewers
  },

  SET_TITLE: (state, title) => {
    state.search.title = title
  },

  SET_ABSTRACT: (state, abstract) => {
    state.search.abstract = abstract
  },

  SET_EMAILS: (state, emails) => {
    state.search.emails = emails
  },

  SET_CHECKED: (state, { doi, checked }) => {
    // add the 'checked' prop
    state.publications = state.publications.map((o) => {
      if (o.doi === doi) {
        return { ...o, checked: !o.checked }
      }
      return { ...o }
    })
  }
}

export const actions = {
  searchPublications ({ commit, state }) {
    commit('RESET', '')
    commit('SET_LOADING_PUBLICATIONS', true)

    return new Promise((resolve, reject) => {
      const url = `${baseApiUrl}/search`
      axios.post(url, {
        title: state.search.title,
        abstract: state.search.abstract,
        emails: state.search.emails
      })
        .then((response) => {
          commit('SET_HASH', response.data.hash)
          commit('SET_PUBLICATIONS', response.data.publications)
          commit('SET_REVIEWERS', [])
          commit('SET_STEP', STEP_REFINE_RESULTS)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
        .finally(() => {
          commit('SET_LOADING_PUBLICATIONS', false)
        })
    })
  },

  loadReviewers ({ commit, state }) {
    commit('SET_LOADING_REVIEWERS', true)

    return new Promise((resolve, reject) => {
      const url = `${baseApiUrl}/refine`

      const publications = state.publications.filter(publication => publication.checked === true)
      commit('SET_PUBLICATIONS', publications)

      const dois = publications.map(({ doi }) => doi)
      axios.post(url, {
        hash: state.hash,
        dois
      })
        .then((response) => {
          commit('SET_REVIEWERS', response.data)
          commit('SET_STEP', STEP_RESOLVE)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
        .finally(() => {
          commit('SET_LOADING_REVIEWERS', false)
        })
    })
  },

  startResolve ({ commit, state }) {
    commit('SET_LOADING_RESOLUTIONS', true)

    return new Promise((resolve, reject) => {
      const url = `${baseApiUrl}/resolve`

      axios.post(url, {
        hash: state.hash,
        emails: state.search.emails
      })
        .then((response) => {
          commit('SET_REVIEWERS', response.data)
          commit('SET_STEP', STEP_RECOMMEND)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
          commit('SET_LOADING_RESOLUTIONS', true)
        })
    })
  }
}
