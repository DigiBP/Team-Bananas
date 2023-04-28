import { generateUUID } from './helper.js'

// express app
const bodyParser = require('body-parser')
const app = require('express')()
app.use(bodyParser.json())

// weaviate client
const scheme = process.env.WEAVIATE_SCHEME ?? 'http'
const host = process.env.WEAVIATE_HOST ?? 'localhost:8080'

const weaviate = require('weaviate-ts-client')
const client = weaviate.client({
  scheme,
  host
})

/* API endpoints */

// API endpoint 0: get all job ads
app.all('/job-ads', (req, res) => {
  client.graphql
    .get()
    .withClassName('JobAd')
    .withFields('_additional { id } processId businessKey title jobAd')
    .do()
    .then((result) => {
      return res.json(result.data.Get.JobAd)
    })
    .catch((err) => {
      console.error(err) // eslint-disable-line no-console
      return res.send('failed')
    })
})

// API endpoint 1: get a single job ad by id
app.all('/job-ads/:processId', (req, res) => {
  const processId = req.params.processId
  client.graphql
    .get('JobAd')
    .withClassName('JobAd')
    .withFields('_additional { id vector } processId businessKey title jobAd')
    .withLimit(1)
    .withWhere({
      path: ['processId'],
      operator: 'Equal',
      valueText: processId
    })
    .do()
    .then((result) => {
      return res.json(result.data.Get.JobAd[0])
    })
    .catch((err) => {
      console.error(err) // eslint-disable-line no-console
      return res.send('failed')
    })
})

// API endpoint 2: store position details
app.all('/save-instance-data', (req, res) => {
  const processInstance = req.body

  client.data
    .creator()
    .withClassName('JobAd')
    .withId(generateUUID())
    .withProperties({
      processId: processInstance.id,
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
