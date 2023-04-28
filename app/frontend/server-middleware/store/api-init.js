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

// API endpoint 1: init data
app.all('/init-data', (req, res) => {
  // create Employee profiles
  const data = require('./employees.json')

  data.forEach((employee) => {
    client.data
      .creator()
      .withClassName('Employee')
      .withId(generateUUID())
      .withProperties({
        name: employee.name,
        age: employee.age,
        position: employee.position,
        degree: employee.degree,
        level: employee.level,
        experience: employee.experience
      })
      .do()
      .then((res) => {
        console.log(res) // eslint-disable-line no-console
      })
      .catch((err) => {
        console.error(err) // eslint-disable-line no-console
      })
  })

  return res.send('OK')
})

module.exports = app
