// express app
const bodyParser = require('body-parser')
const app = require('express')()
app.use(bodyParser.json())

// axios to make requests against Camunda REST Engine API
const axios = require('axios')

// Camunda API config
const tenantId = 'bananas'
const baseUrl = 'https://digibp.herokuapp.com/engine-rest'
const commonHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
}

/* API endpoints */

/**
 * Post a message to a process instance.
 **/
app.all('/post', async (req, res) => {
  const url = `${baseUrl}/message`

  console.log(req.body) // eslint-disable-line no-console

  const { messageName } = req.body

  const processVariables = {
    lastMessage: {
      value: messageName,
      type: 'String'
    }
  }

  const jsonBody = {
    messageName,
    processInstanceId: req.body.processId,
    processVariables
  }

  console.log('POST', url) // eslint-disable-line no-console
  console.log('JSON', jsonBody) // eslint-disable-line no-console
  try {
    await axios.post(url, jsonBody, {
      headers: commonHeaders
    })
  } catch (error) {
    console.log(error.response.data) // eslint-disable-line no-console
    res.json({ success: false, message: 'failed to set variable' })
    return
  }

  res.json({ success: true })
})

module.exports = app
