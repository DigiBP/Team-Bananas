// express app
const bodyParser = require('body-parser')
const app = require('express')()
app.use(bodyParser.json())

// OpenAI API
const { Configuration, OpenAIApi } = require('openai')
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

/* API endpoints */

// API endpoint 1: generate job ad via OpenAI API
app.all('/generate-job-ad', async (req, res) => {
  const about = 'Digisailors aims to bring businesses into the digital age through innovative and cutting-edge solutions. We empower companies to embrace digitalisation and provide a range of services that help businesses thrive in the digital landscape. By joining Digisailors, you will embark on a journey of digitalisation and help take your clients\' business new heights in the digital realm. Join us today!'
  const skills = req.body.skills.replace(/\n/g, ', ')
  const prompt = `Please write a job ad for the company "Digisailors" for a position as "${req.body.title}". ` +
  `The job add should include a section "About Digisailors" with the following text: "${about}". ` +
  `The job add should inlcude skills related to "${skills}" and extend to related and common skills for a "${req.body.title}". ` +
  'The applicants should apply online via "HR Buddy" on https://digisailors.ch/:'

  console.log(prompt) // eslint-disable-line no-console

  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    max_tokens: 2048,
    prompt
  })

  console.log(response.data) // eslint-disable-line no-console
  res.json({ text: response.data.choices[0].text })
})

module.exports = app
