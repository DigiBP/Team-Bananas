// config: similarity to reach in vector search to be condiered an internal candideate match
const CERTAINTY_CUTOFF = 0.9

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

// API endpoint 1: find employees matching with a job ad
app.all('/match-employees', (req, res) => {
  // step 1: get the job ad vector for the process instance
  const processId = req.body.processId
  client.graphql
    .get('JobAd')
    .withClassName('JobAd')
    .withFields('_additional { id vector } processId')
    .withLimit(1)
    .withWhere({
      path: ['processId'],
      operator: 'Equal',
      valueText: processId
    })
    .do()
    .then((result) => {
      const jobAd = result.data.Get.JobAd[0] ?? null
      if (jobAd === null) {
        res.status(204)
        return res.send('no job ad found')
      }

      const vector = jobAd._additional.vector ?? []
      console.log('vector', vector) // eslint-disable-line no-console

      // step 2: find employees matching with the job ad vector
      client.graphql
        .get()
        .withClassName('Employee')
        .withFields('_additional { id certainty } name age position degree level experience')
        .withNearVector({ vector })
        .do()
        .then((result) => {
          const employees = result.data.Get.Employee
          console.log('employees', employees) // eslint-disable-line no-console
          const matchingEmployees = employees.filter((employee) => {
            return employee._additional.certainty > CERTAINTY_CUTOFF
          })

          return res.json(matchingEmployees)
        })
        .catch((err) => {
          console.error(err) // eslint-disable-line no-console
          res.status(204)
          return res.send('failed matching employees')
        })
    })
    .catch((err) => {
      console.error(err) // eslint-disable-line no-console
      res.status(204)
      return res.send('failed getting job ad vector')
    })
})

module.exports = app
