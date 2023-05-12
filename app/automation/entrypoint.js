import axios from 'axios';
import { Client, logger } from "camunda-external-task-client-js";

// Camunda API config
const tenantId = 'bananas'
const processKey = 'employee_recruitment_to_be'
const baseUrl = 'https://digibp.herokuapp.com/engine-rest'
const commonHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
}

// Camunda configuration for the Client and tenant
const config = {
    baseUrl,
    use: logger,
    asyncResponseTimeout: 10000,
    workerId: 'job_ad_worker',
    maxTasks: 1,
    lockDuration: 10000,
    headers: commonHeaders,
    tenantId:
    tenantId
};

// Mastodon API config
const matodonUrl = 'https://mstdn.social/api/v1/statuses'
const mastodonHeaders = {
  Authorization: `Bearer ${process.env.MASTODON_BEARER_TOKEN}`,
  'Content-Type': 'application/json',
  Accept: '*/*',
  'Accept-Encoding': 'gzip, deflate, br',
  Connection: 'keep-alive'
}

// create a Client instance with custom configuration
const client = new Client(config);

// connect to the post_social_media external task topic
client.subscribe('post_social_media', async function({ task, taskService }) {
    // Get a process variable
    const title = task.variables.get('title');
    const tweet = task.variables.get('tweet');

    // leave log traces
    console.log(`===================================`);
    
    // log current date time in format 2022-12-31 22:05
    console.log(`[${new Date().toLocaleString('en-GB')}]`);
    console.log(`Business key: ${task.businessKey}`);
    console.log(`Posting job ad for ${title} on Mastodon...`);
    console.log('Tweet:', tweet);

    // lock task
    await taskService.lock(task, 30);

    // post to Mastodon
    let success = true
    try {
      const response = await axios.post(matodonUrl, { status: tweet }, { headers: mastodonHeaders })
    } catch (error) {
      success = false
      console.log(error) // eslint-disable-line no-console
    }
    
    // Complete the task
    if (success) {
      await taskService.complete(task);
    } else {
      await taskService.handleFailure(task, {
        errorMessage: 'Error posting to Mastodon',
        errorDetails: 'Error posting to Mastodon',
        retries: 0,
        retryTimeout: 1000
      });
    }
});
