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
  const about = 'Digisailors aims to bring businesses into the digital age through innovative and cutting-edge solutions. We empower companies to embrace digitalisation and provide a range of services that help businesses thrive in the digital landscape. By joining Digisailors, you will embark on a journey of digitalisation and help take your clients\' business to new heights in the digital realm. Join us today!'
  const skills = req.body.skills.replace(/\n/g, ', ')
  const prompt = 'Please write a job ad with basic html formatting (allowd tags: h1, h2, ul, li, p). ' +
  'The job ad should follow this format: Position Title, About Digisailors, Job Description, Requirements, Application. ' +
  `The job ad is for the company "Digisailors" and is for a position as "${req.body.title}". ` +
  'Tho job is located in Olten and requires a calid Swiss working permit.' +
  `The job add should include a section "About Digisailors" similar to: ${about}" ` +
  (skills ? `The job add should inlcude skills similar to ${skills} and extended to common skills for a "${req.body.title}". ` : '') +
  'The applicants should apply online via "HR Buddy" on https://digisailors.ch/. ' +
  (req.body.fancy ? `Rewrite the entire job ad ${req.body.fancy}` : '') + ':'

  console.log(prompt) // eslint-disable-line no-console

  const response = await openai.createChatCompletion({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }]
  })

  console.log(response.data.choices[0]) // eslint-disable-line no-console
  res.json({ message: response.data.choices[0].message.content })
})

module.exports = app
