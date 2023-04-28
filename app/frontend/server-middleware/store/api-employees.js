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

// API endpoint 0: get all employees
app.all('/employees', (req, res) => {
  client.graphql
    .get()
    .withClassName('Employee')
    .withFields('_additional { id } name age position degree level experience')
    .do()
    .then((result) => {
      return res.json(result.data.Get.Employee)
    })
    .catch((err) => {
      console.error(err) // eslint-disable-line no-console
      return res.send('failed')
    })
})

// API endpoint 1: find employees matching with a job ad's vector
app.all('/match-employees', (req, res) => {
  const vector = req.body.vector

  console.log('vector', vector) // eslint-disable-line no-console

  client.graphql
    .get()
    .withClassName('Employee')
    .withFields('_additional { id certainty } name age position degree level experience')
    .withNearVector({ vector })
    .do()
    .then((result) => {
      console.log(result.data.Get) // eslint-disable-line no-console
      return res.json(result.data.Get)
    })
    .catch((err) => {
      console.error(err) // eslint-disable-line no-console
      return res.send('failed')
    })
})

module.exports = app
