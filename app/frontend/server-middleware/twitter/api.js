// express app
const bodyParser = require('body-parser')
const app = require('express')()
app.use(bodyParser.json())

// API endpoint 0: post the job ad as a tweet to Twitter
app.all('/post-tweet', async (req, res) => {
  const tweet = req.body.tweet ?? ''

  // Twitter API
  const Twitter = require('twitter-lite')
  const twitter = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_TOKEN_SECRET
  })

  // post the tweet
  const response = await twitter.post('statuses/update', {
    status: tweet
  })

  console.log(response) // eslint-disable-line no-console
  res.json({ message: 'Tweet posted' })
})
