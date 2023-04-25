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

// axios to make requests against Camunda REST Engine API
// const axios = require('axios')

/* API endpoints */

// API endpoint 0: initialize collections in weviate
app.all('/init', (req, res) => {
  const classes = [
    'JobAd',
    'Applicant',
    'Employee'
  ]

  classes.forEach((className) => {
    const classObj = {
      class: className,
      vectorizer: 'text2vec-openai'
    }

    // add the schema
    client
      .schema
      .classCreator()
      .withClass(classObj)
      .do()
      .then((res) => {
        console.log(res) // eslint-disable-line no-console
      })
      .catch((err) => {
        console.error(err) // eslint-disable-line no-console
        return res.send('Failed')
      })
  })

  return res.send('OK')
})

module.exports = app
