// express app
const bodyParser = require('body-parser')
const app = require('express')()
app.use(bodyParser.json())

// axios to make requests against Camunda REST Engine API
const axios = require('axios')

// shared helper methods
const { generateBusinessKey, getProcessVariables, getProcessActivities, getAndLockExternalTask, completeExternalTask } = require('./helper')

// Camunda API config
const tenantId = 'bananas'
const processKey = 'employee_recruitment_to_be'
const baseUrl = 'https://digibp.herokuapp.com/engine-rest'
const commonHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
}

/* API endpoints */

/**
 * Start a new process instance and post variables to it.
 */
app.all('/start-instance', async (req, res) => {
  const url = `${baseUrl}/process-definition/key/${processKey}/tenant-id/${tenantId}/start`

  console.log('===================================') // eslint-disable-line no-console
  console.log('POST', url) // eslint-disable-line no-console
  const businessKey = generateBusinessKey(req.body.title, req.body.office)
  const response = await axios.post(url, {
    businessKey,
    variables: {
      env: {
        value: process.env.ENV_NAME ?? 'dev',
        type: 'String'
      },
      lastMessage: {
        value: '',
        type: 'String'
      },
      title: {
        value: req.body.title,
        type: 'String'
      },
      manager: {
        value: req.body.manager,
        type: 'String'
      },
      department: {
        value: req.body.department,
        type: 'String'
      },
      office: {
        value: req.body.office,
        type: 'String'
      },
      link: {
        value: `${req.protocol}://${req.headers.host}/recruiter/lookup?key=${encodeURIComponent(businessKey)}`,
        type: 'String'
      }
    }
  }, {
    headers: commonHeaders
  })

  res.json({
    id: response.data.id,
    businessKey: response.data.businessKey
  })
})

/**
 * Complete the external service task for "job_ad".
 */
app.all('/confirm-job-ad', async (req, res) => {
  const processInstanceId = req.body.processId
  const jobAd = req.body.jobAd

  // fetch and lock external task
  const externalTaskId = await getAndLockExternalTask(baseUrl, commonHeaders, processInstanceId, 'job_ad')
  if (!externalTaskId) {
    res.json({ success: false, message: 'failed to fetch and lock external task' })
    return
  }

  // generate a tweet text for the job ad
  const title = req.body.title
  const office = req.body.office
  const url = `${req.protocol}://${req.headers.host}/applicant/lookup?key=${encodeURIComponent(processInstanceId)}`
  const tweetText = `📣 We are hiring a ${title} for our ${office} office! Apply via ${url} #digisalors #career #job #hiring`

  // save jobAd as process variable
  const setVariableUrl = `${baseUrl}/process-instance/${processInstanceId}/variables`

  console.log('===================================') // eslint-disable-line no-console
  console.log('POST', setVariableUrl) // eslint-disable-line no-console

  try {
    await axios.post(setVariableUrl, {
      modifications: {
        jobAd: {
          value: jobAd,
          type: 'String'
        },
        tweet: {
          value: tweetText,
          type: 'String'
        }
      }
    }, {
      headers: commonHeaders
    })
  } catch (error) {
    console.log(error.response.data) // eslint-disable-line no-console
    res.json({ success: false, message: 'failed to set variable' })
    return
  }

  // complete the external task
  await completeExternalTask(baseUrl, commonHeaders, externalTaskId)
  res.json({ success: true })
})

/**
 * Complete the external service task for "search_internal_candidates"
 */
app.all('/confirm-internal-candidates', async (req, res) => {
  const processInstanceId = req.body.processId
  const candidates = req.body.internalCandidates
  const numInternalCandidates = candidates.length

  // fetch and lock external task
  const externalTaskId = await getAndLockExternalTask(baseUrl, commonHeaders, processInstanceId, 'internal_candidates')
  if (!externalTaskId) {
    res.json({ success: false, message: 'failed to fetch and lock external task' })
    return
  }

  // save "numInternalCandidates" as process variable
  const setVariableUrl = `${baseUrl}/process-instance/${processInstanceId}/variables`

  console.log('===================================') // eslint-disable-line no-console
  console.log('POST', setVariableUrl) // eslint-disable-line no-console

  try {
    await axios.post(setVariableUrl, {
      modifications: {
        numInternalCandidates: {
          value: numInternalCandidates,
          type: 'Integer'
        }
      }
    }, {
      headers: commonHeaders
    })
  } catch (error) {
    console.log(error.response.data) // eslint-disable-line no-console
    res.json({ success: false, message: 'failed to set variable' })
    return
  }

  // complete the external task
  await completeExternalTask(baseUrl, commonHeaders, externalTaskId)
  res.json({ success: true })
})

/**
 * List all process instances for the current environment.
 */
app.all('/list-instances', async (req, res) => {
  const processKey = 'employee_recruitment_to_be'

  // we filter by the env name to only show instances for the current environment
  const envName = process.env.ENV_NAME ?? 'dev'
  const url = `${baseUrl}/process-instance?processDefinitionKey=${processKey}&tenantIdIn=${tenantId}&variables=env_eq_${envName}&active=true&sortBy=businessKey&sortOrder=desc&maxResults=200`

  console.log('===================================') // eslint-disable-line no-console
  console.log('GET', url) // eslint-disable-line no-console

  const response = await axios.get(url, {
    headers: commonHeaders
  })

  // fetch the process variables for each process instance
  const processInstances = []
  for (const processInstance of response.data) {
    const variables = await getProcessVariables(baseUrl, commonHeaders, processInstance.id)
    const item = { ...processInstance, ...variables }

    // rename id into processId
    item.processId = processInstance.id
    delete item.id

    processInstances.push(item)
  }

  res.json(processInstances)
})

/**
 * Get a process instance by process ID.
 */
app.all('/get-instance', async (req, res) => {
  const processInstanceId = req.body.processInstanceId
  const url = `${baseUrl}/process-instance/${processInstanceId}`

  console.log('===================================') // eslint-disable-line no-console
  console.log('GET', url) // eslint-disable-line no-console

  const response = await axios.get(url, {
    headers: commonHeaders
  })
  const variables = await getProcessVariables(baseUrl, commonHeaders, processInstanceId)
  const activities = await getProcessActivities(baseUrl, commonHeaders, processInstanceId)
  const processInstance = { ...response.data, ...variables, activities }

  // rename id into processId
  processInstance.processId = processInstance.id
  delete processInstance.id

  res.json(processInstance)
})

/**
 * List all applicants process instances for given main process isntance ID.
 */
app.all('/list-applicants', async (req, res) => {
  const processKey = 'employee_recruitment_applicants_process'
  const url = `${baseUrl}/process-instance?processDefinitionKey=${processKey}&tenantIdIn=${tenantId}&active=true&maxResults=200`

  console.log('===================================') // eslint-disable-line no-console
  console.log('GET', url) // eslint-disable-line no-console

  const response = await axios.get(url, {
    headers: commonHeaders
  })

  // fetch the process variables for each process instance
  const processInstances = []
  for (const processInstance of response.data) {
    const variables = await getProcessVariables(baseUrl, commonHeaders, processInstance.id)
    const item = { ...processInstance, ...variables }

    // rename id into processId
    item.processId = processInstance.id
    delete item.id

    // only keep applicants that match the position's process ID and that are of category A (interview track) or B (waitlist)
    if (item.positionInstanceId === req.body.processId && ['A', 'B'].includes(item.category)) {
      processInstances.push(item)
    }
  }

  res.json(processInstances)
})

/**
 * Save screening interview notes and complete external service task 'screening_interview'
 */
app.all('/screening-interview-proceed', async (req, res) => {
  const processInstanceId = req.body.processInstanceId
  const notes = req.body.notes

  // fetch and lock external task
  const externalTaskId = await getAndLockExternalTask(baseUrl, commonHeaders, processInstanceId, 'screening_interview')
  if (!externalTaskId) {
    res.json({ success: false, message: 'failed to fetch and lock external task' })
    return
  }

  // save "notes" as process variable
  const setVariableUrl = `${baseUrl}/process-instance/${processInstanceId}/variables`

  console.log('===================================') // eslint-disable-line no-console
  console.log('POST', setVariableUrl) // eslint-disable-line no-console

  try {
    await axios.post(setVariableUrl, {
      modifications: {
        hadScreeningInterview: {
          value: true,
          type: 'Boolean'
        },
        screeningInterviewNotes: {
          value: notes,
          type: 'String'
        }
      }
    }, {
      headers: commonHeaders
    })
  } catch (error) {
    console.log(error) // eslint-disable-line no-console
    res.json({ success: false, message: 'failed to set variable' })
    return
  }

  // complete the external task
  await completeExternalTask(baseUrl, commonHeaders, externalTaskId)
  res.json({ success: true })
})

/**
 * Save screening interview notes, downgrade to category C and complete external service task 'screening_interview'
 */
app.all('/screening-interview-reject', async (req, res) => {
  const processInstanceId = req.body.processInstanceId
  const notes = req.body.notes

  // fetch and lock external task
  const externalTaskId = await getAndLockExternalTask(baseUrl, commonHeaders, processInstanceId, 'screening_interview')
  if (!externalTaskId) {
    res.json({ success: false, message: 'failed to fetch and lock external task' })
    return
  }

  // save "notes" as process variable incl. downgrade to category C
  const setVariableUrl = `${baseUrl}/process-instance/${processInstanceId}/variables`

  console.log('===================================') // eslint-disable-line no-console
  console.log('POST', setVariableUrl) // eslint-disable-line no-console

  try {
    await axios.post(setVariableUrl, {
      modifications: {
        category: {
          value: 'C',
          type: 'String'
        },
        hadScreeningInterview: {
          value: true,
          type: 'Boolean'
        },
        screeningInterviewNotes: {
          value: notes,
          type: 'String'
        }
      }
    }, {
      headers: commonHeaders
    })
  } catch (error) {
    console.log(error) // eslint-disable-line no-console
    res.json({ success: false, message: 'failed to set variable' })
    return
  }

  // complete the external task
  await completeExternalTask(baseUrl, commonHeaders, externalTaskId)
  res.json({ success: true })
})

/**
 * Post message to process instance including the selected slot.
 */
app.all('/book-second-interview', async (req, res) => {
  const url = `${baseUrl}/message`
  const messageName = 'bananas_interview_booking'

  const processInstanceId = req.body.processInstanceId
  const slot = req.body.slot

  // prepare new variables
  const processVariables = {
    slot: {
      value: slot,
      type: 'String'
    },
    hadSecondInterviewBooking: {
      value: true,
      type: 'Boolean'
    }
  }

  const body = {
    processInstanceId,
    messageName,
    processVariables
  }

  console.log('===================================') // eslint-disable-line no-console
  console.log('POST', url) // eslint-disable-line no-console
  console.log(body) // eslint-disable-line no-console

  try {
    await axios.post(url, body, {
      headers: commonHeaders
    })
  } catch (error) {
    console.log(error.response.data) // eslint-disable-line no-console
    res.json({ success: false, message: 'failed to set variable' })
    return
  }

  res.json({ success: true })
})

/**
 * Withdraw application by throwing an error 'error_applicant_withdrawal' in Camunda.
 */
app.all('/withdraw-application', async (req, res) => {
  const url = `${baseUrl}/message`
  const messageName = 'bananas_applicant_withdrawal'

  const processInstanceId = req.body.processInstanceId

  const body = {
    processInstanceId,
    messageName
  }

  console.log('===================================') // eslint-disable-line no-console

  try {
    await axios.post(url, body, {
      headers: commonHeaders
    })
  } catch (error) {
    console.log(error.response.data) // eslint-disable-line no-console
    res.json({ success: false, message: 'failed to set variable' })
    return
  }

  res.json({ success: true })
})

/**
 * Update category on applicant process instance.
 */
app.all('/update-applicant', async (req, res) => {
  const url = `${baseUrl}/message`
  const messageName = 'bananas_waitlist_update'

  const processInstanceId = req.body.processInstanceId
  const category = req.body.category

  // prepare new variables
  const processVariables = {
    category: {
      value: category,
      type: 'String'
    }
  }

  const body = {
    processInstanceId,
    messageName,
    processVariables
  }

  console.log('===================================') // eslint-disable-line no-console
  console.log('POST', url) // eslint-disable-line no-console
  console.log(body) // eslint-disable-line no-console

  try {
    await axios.post(url, body, {
      headers: commonHeaders
    })
  } catch (error) {
    console.log(error.response.data) // eslint-disable-line no-console
    res.json({ success: false, message: 'failed to set variable' })
    return
  }

  res.json({ success: true })
})

/**
 * Save manager interview notes and complete external service task 'personal_interview'
 */
app.all('/manager-interview-proceed', async (req, res) => {
  const processInstanceId = req.body.processInstanceId
  const positionInstanceId = req.body.positionInstanceId
  const notes = req.body.notes

  // fetch and lock external task
  const externalTaskId = await getAndLockExternalTask(baseUrl, commonHeaders, processInstanceId, 'personal_interview')
  if (!externalTaskId) {
    res.json({ success: false, message: 'failed to fetch and lock external task' })
    return
  }

  // save "notes" as process variable
  const setVariableUrl = `${baseUrl}/process-instance/${processInstanceId}/variables`

  console.log('===================================') // eslint-disable-line no-console
  console.log('POST', setVariableUrl) // eslint-disable-line no-console

  try {
    await axios.post(setVariableUrl, {
      modifications: {
        hadManagerInterview: {
          value: true,
          type: 'Boolean'
        },
        managerInterviewNotes: {
          value: notes,
          type: 'String'
        }
      }
    }, {
      headers: commonHeaders
    })
  } catch (error) {
    console.log(error) // eslint-disable-line no-console
    res.json({ success: false, message: 'failed to set variable' })
    return
  }

  // fetch process variables and merge names and emails with new candidate
  const shortlistUrl = `${baseUrl}/process-instance/${positionInstanceId}/variables`
  console.log('GET', shortlistUrl) // eslint-disable-line no-console

  let shortlistNames
  let shortlistEmails

  try {
    const response = await axios.get(shortlistUrl, {
      headers: commonHeaders
    })
    shortlistNames = response.data.filter(variable => variable.name === 'shortlistNames')[0].value
    shortlistEmails = response.data.filter(variable => variable.name === 'shortlistEmails')[0].value
  } catch (error) {
    console.log(error) // eslint-disable-line no-console
    shortlistNames = []
    shortlistEmails = []
  }

  const candidateUrl = `${baseUrl}/process-instance/${processInstanceId}/variables`
  console.log('GET', candidateUrl) // eslint-disable-line no-console

  let candidateName
  let candidateEmail

  try {
    const response = await axios.get(candidateUrl, {
      headers: commonHeaders
    })
    candidateName = response.data.filter(variable => variable.name === 'name')[0].value
    candidateEmail = response.data.filter(variable => variable.name === 'email')[0].value
  } catch (error) {
    console.log(error) // eslint-disable-line no-console
    candidateName = ''
    candidateEmail = ''
  }

  // merge names and emails
  const newShortlistNames = shortlistNames.push(candidateName)
  const newShortlistEmails = shortlistEmails.push(candidateEmail)

  // save new shortlist names and emails
  const setShortlistUrl = `${baseUrl}/process-instance/${positionInstanceId}/variables`
  console.log('POST', setShortlistUrl) // eslint-disable-line no-console

  try {
    await axios.post(setShortlistUrl, {
      modifications: {
        shortlistNames: {
          value: newShortlistNames,
          type: 'Array'
        },
        shortlistEmails: {
          value: newShortlistEmails,
          type: 'Array'
        }
      }
    }, {
      headers: commonHeaders
    })
  } catch (error) {
    console.log(error) // eslint-disable-line no-console
    res.json({ success: false, message: 'failed to set variable' })
    return
  }

  // complete the external task
  await completeExternalTask(baseUrl, commonHeaders, externalTaskId)
  res.json({ success: true })
})

/**
 * Save manager interview notes, downgrade to category C and complete external service task 'personal_interview'
 */
app.all('/manager-interview-reject', async (req, res) => {
  const processInstanceId = req.body.processInstanceId
  const notes = req.body.notes

  // fetch and lock external task
  const externalTaskId = await getAndLockExternalTask(baseUrl, commonHeaders, processInstanceId, 'personal_interview')
  if (!externalTaskId) {
    res.json({ success: false, message: 'failed to fetch and lock external task' })
    return
  }

  // save "notes" as process variable incl. downgrade to category C
  const setVariableUrl = `${baseUrl}/process-instance/${processInstanceId}/variables`

  console.log('===================================') // eslint-disable-line no-console
  console.log('POST', setVariableUrl) // eslint-disable-line no-console

  try {
    await axios.post(setVariableUrl, {
      modifications: {
        category: {
          value: 'C',
          type: 'String'
        },
        hadManagerInterview: {
          value: true,
          type: 'Boolean'
        },
        managerInterviewNotes: {
          value: notes,
          type: 'String'
        }
      }
    }, {
      headers: commonHeaders
    })
  } catch (error) {
    console.log(error) // eslint-disable-line no-console
    res.json({ success: false, message: 'failed to set variable' })
    return
  }

  // complete the external task
  await completeExternalTask(baseUrl, commonHeaders, externalTaskId)
  res.json({ success: true })
})

module.exports = app
