// express app
const bodyParser = require('body-parser')
const app = require('express')()
app.use(bodyParser.json())

// axios to make requests against Camunda REST Engine API
const axios = require('axios')

// shared helper methods
const { sendMail } = require('./helper')

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

  // execute some additional logic based on message name
  const managerName = 'Manager'
  const managerEmail = 'manager@digisailors.ch'
  let mailOptions = {}
  switch (messageName) {
    case 'bananas_personal_interviews_done':
      mailOptions = {
        from: 'bot@digisailors.ch',
        to: managerEmail,
        subject: 'Digisailors - Please finalize shortlist order',
        text: `Dear ${managerName},\n\n` +
          'The interviews have been completed. Please finalize the shortlist soon. \n\n' +
          `Please leave interview feedback here: https://digisailors.ch/manager/shortlist/${req.body.processId}\n\n` +
          'Best regards,\n' +
          'Digisailors'
      }
      console.log(`Sending email to ${managerEmail}...`) // eslint-disable-line no-console
      sendMail(mailOptions)
      break
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
