const bodyParser = require('body-parser')
const app = require('express')()

// register app dependencies
app.use(bodyParser.json())

/* API endpoints */

// API endpoint 1: generate job ad via OpenAI API
app.all('/generate-job-ad', (req, res) => {
  console.log(req.body.title)
  console.log(req.body.skills)
  res.json({ data: 'data' })
})

module.exports = app
