// express app
const bodyParser = require('body-parser')
const app = require('express')()
app.use(bodyParser.json())

// axios to make requests against Camunda REST Engine API
const axios = require('axios')

// shared helper methods
const { generateBusinessKey, getProcessVariables, getAndLockExternalTask, completeExternalTask } = require('./helper')

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

  console.log('POST', url) // eslint-disable-line no-console
  const businessKey = generateBusinessKey(req.body.title, req.body.office)
  const response = await axios.post(url, {
    businessKey,
    variables: {
      env: {
        value: process.env.ENV_NAME ?? 'dev',
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
  console.log(response.data) // eslint-disable-line no-console
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
  // we filter by the env name to only show instances for the current environment
  const envName = process.env.ENV_NAME ?? 'dev'
  const url = `${baseUrl}/process-instance?tenantIdIn=${tenantId}&variables=env_eq_${envName}&active=true&sortBy=businessKey&sortOrder=desc&maxResults=200`

  console.log('GET', url) // eslint-disable-line no-console
  const response = await axios.get(url, {
    headers: commonHeaders
  })
  console.log(response.data) // eslint-disable-line no-console

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

  console.log(processInstances) // eslint-disable-line no-console
  res.json(processInstances)
})

/**
 * Get a process instance by process ID.
 */
app.all('/get-instance', async (req, res) => {
  const processInstanceId = req.body.processInstanceId
  const url = `${baseUrl}/process-instance/${processInstanceId}`
  console.log('GET', url) // eslint-disable-line no-console
  const response = await axios.get(url, {
    headers: commonHeaders
  })
  const variables = await getProcessVariables(baseUrl, commonHeaders, processInstanceId)
  const processInstance = { ...response.data, ...variables }

  // rename id into processId
  processInstance.processId = processInstance.id
  delete processInstance.id

  console.log(processInstance) // eslint-disable-line no-console
  res.json(processInstance)
})

module.exports = app
