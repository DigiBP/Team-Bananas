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

  const { messageName, processInstanceId } = req.body

  const processVariables = {
    lastMessage: {
      value: messageName,
      type: 'String'
    }
  }

  console.log('POST', url) // eslint-disable-line no-console
  try {
    await axios.post(url, {
      messageName,
      tenantId,
      processInstanceId,
      processVariables
    }, {
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
