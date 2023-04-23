// express app
const bodyParser = require('body-parser')
const app = require('express')()
app.use(bodyParser.json())

// axios for making requests to Camunda API
const axios = require('axios')

// Camunda API config
const tenantId = '{tenant-id}'
const processKey = '{key}'
const baseUrl = 'http://localhost:8080/engine-rest'

/* API endpoints */

// API endpoint 1: generate job ad via OpenAI API
app.all('/start-instance', async (req, res) => {
  const url = `${baseUrl}/process-definition/key/${processKey}/tenant-id/${tenantId}/start`

  const response = await axios.post(url, {
    variables: {
      title: {
        value: req.body.title,
        type: 'String'
      },
      skills: {
        value: req.body.skills,
        type: 'String'
      }
    }
  })

  console.log(response.data) // eslint-disable-line no-console
})

module.exports = app
