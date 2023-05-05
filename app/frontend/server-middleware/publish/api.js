// expose express API endpoint that can post a message to Mastodon

// express app
const bodyParser = require('body-parser')
const app = require('express')()
app.use(bodyParser.json())

// axios to make requests against Mastondon REST API
const axios = require('axios')

// Mastodon API config
const baseUrl = 'https://mstdn.social/api/v1'
const commonHeaders = {
  Authorization: `Bearer ${process.env.MASTODON_BEARER_TOKEN}`,
  'Content-Type': 'application/json',
  Accept: '*/*',
  'Accept-Encoding': 'gzip, deflate, br',
  Connection: 'keep-alive'
}

/* API endpoints */

/**
 * post a message to Mastodon
 * https://docs.joinmastodon.org/methods/statuses/#create
 **/
app.all('/post', async (req, res) => {
  const url = `${baseUrl}/statuses`
  const message = req.body.message

  console.log('PAYLOAD', req.body) // eslint-disable-line no-console
  console.log('POST', url) // eslint-disable-line no-console
  console.log('TOKEN', process.env.MASTODON_BEARER_TOKEN) // eslint-disable-line no-console

  if (!message) {
    res.status(400).json({ success: false, error: 'No message provided' })
    return
  }

  try {
    const response = await axios.post(url, { status: message }, { headers: commonHeaders })
    res.json({ success: true, response: response.data })
  } catch (error) {
    console.log(error) // eslint-disable-line no-console
    res.status(error.response.status).json({ success: false, error: error.response.data })
  }
})

module.exports = app
