import { generateUUID } from './helper.js'

// express app
const bodyParser = require('body-parser')
const app = require('express')()
app.use(bodyParser.json())

// weaviate client
const scheme = process.env.WEAVIATE_SCHEME ?? 'https'
const host = process.env.WEAVIATE_HOST ?? 'search.digisailors.ch'

const weaviate = require('weaviate-ts-client')
const client = weaviate.client({
  scheme,
  host
})

/* API endpoints */

/**
 * Save a job ad and create its vector in Weaviate.
 */
app.all('/save-job-ad', (req, res) => {
  const processInstance = req.body

  client.data
    .creator()
    .withClassName('JobAd')
    .withId(generateUUID())
    .withProperties({
      processId: processInstance.processId,
      businessKey: processInstance.businessKey,
      title: processInstance.title,
      jobAd: processInstance.jobAd
    })
    .do()
    .then((result) => {
      console.log(result) // eslint-disable-line no-console
      return res.send('OK')
    })
    .catch((err) => {
      console.error(err) // eslint-disable-line no-console
      return res.send('failed')
    })
})

module.exports = app
