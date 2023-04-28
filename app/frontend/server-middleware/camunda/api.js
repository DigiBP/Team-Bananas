// express app
const bodyParser = require('body-parser')
const app = require('express')()
app.use(bodyParser.json())

// axios to make requests against Camunda REST Engine API
const axios = require('axios')

// Camunda API config
const tenantId = 'bananas'
const processKey = 'employee_recruitment_to_be'
const baseUrl = 'https://digibp.herokuapp.com/engine-rest'
const commonHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
}

/* API endpoints */

function generateBusinessKey (title) {
  const today = new Date()
  const date = today.getFullYear() + ('0' + (today.getMonth() + 1)).slice(-2) // 2023-04 --> 202304
  return date + '_' + title.replace(/ /g, '_').toLowerCase()
}

// API endpoint 1: start new process instance in Camunda by passing the job title
app.all('/start-instance', async (req, res) => {
  const url = `${baseUrl}/process-definition/key/${processKey}/tenant-id/${tenantId}/start`

  console.log('POST', url) // eslint-disable-line no-console
  const response = await axios.post(url, {
    businessKey: generateBusinessKey(req.body.title)
  }, {
    headers: commonHeaders
  })
  console.log(response.data) // eslint-disable-line no-console
  res.json({
    id: response.data.id,
    businessKey: response.data.businessKey
  })
})

// API endpoint 2: confirm the job ad step by locking then completing the external service task for "job_ad"
// @see https://camunda.com/blog/2022/01/qa-how-can-i-complete-a-service-task-via-the-rest-api/
app.all('/confirm-job-ad', async (req, res) => {
  const processInstanceId = req.body.processId

  // Step 1: get the external task ID for the processInstance's "job_ad" service task
  const getExternalTaskUrl = `${baseUrl}/external-task?processInstanceId=${processInstanceId}&topicName=job_ad`
  console.log('GET', getExternalTaskUrl) // eslint-disable-line no-console
  const getExternalTaskResponse = await axios.get(getExternalTaskUrl, {
    headers: commonHeaders
  })
  console.log(getExternalTaskResponse.data) // eslint-disable-line no-console
  const externalTaskId = getExternalTaskResponse.data[0].id

  // Step 2: lock the external task
  const lockExternalTaskUrl = `${baseUrl}/external-task/${externalTaskId}/lock`
  console.log('POST', lockExternalTaskUrl) // eslint-disable-line no-console
  try {
    await axios.post(lockExternalTaskUrl, {
      workerId: 'HR Buddy (digisailors.ch)',
      lockDuration: 10000
    }, {
      headers: commonHeaders
    })
  } catch (error) {
    console.log(error.response.data) // eslint-disable-line no-console
    res.json({ success: false, message: 'failed to lock external task id' })
    return
  }

  // Step 3: complete the external task
  const completeExternalTaskUrl = `${baseUrl}/external-task/${externalTaskId}/complete`
  console.log('POST', completeExternalTaskUrl) // eslint-disable-line no-console
  try {
    await axios.post(completeExternalTaskUrl, {
      workerId: 'HR Buddy (digisailors.ch)'
    }, {
      headers: commonHeaders
    })
  } catch (error) {
    console.log(error.response.data) // eslint-disable-line no-console
    res.json({ success: false, message: 'failed to complete external task id' })
    return
  }

  res.json({ success: true })
})

module.exports = app
