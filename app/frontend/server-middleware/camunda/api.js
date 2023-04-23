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

module.exports = app
