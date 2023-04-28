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

// helper function to generate UUIDs
function generateUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

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

// API endpoint 2: get all employees
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

// API endpoint 3: get all job ads
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

// API endpoint 3: store position details
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
