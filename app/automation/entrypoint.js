import axios from 'axios';
import { Client, logger } from "camunda-external-task-client-js";
import nodemailer from 'nodemailer';

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
    workerId: 'digisailor_robot_worker',
    maxTasks: 1,
    lockDuration: 10000,
    headers: commonHeaders,
    tenantId:
    tenantId
};

// create a Client instance with custom configuration
const client = new Client(config);

// helper function to get smtp mail transporter
async function getTransporter() {
      // create reusable SMTP transporter
      let transporter = await nodemailer.createTransport({
        host: 'ds-mailcatcher',
        port: 1025,
        secure: false,
        tls: {
          rejectUnauthorized: false
        }
      });
  
      // verify SMTP connection configuration
      await transporter.verify(function(error, success) {
        if (error) {
          console.log(error); // eslint-disable-line no-console
        } else {
          console.log('✓ SMTP connection for sending emails is ready.'); // eslint-disable-line no-console
        }
      });

      return transporter
}


/**
 * This task is responsible for posting a job ad to Mastodon
 */
client.subscribe('post_social_media', async function({ task, taskService }) {
    // lock task
    await taskService.lock(task, 60);

    // Mastodon API config
    const matodonUrl = 'https://mstdn.social/api/v1/statuses'
    const mastodonHeaders = {
      Authorization: `Bearer ${process.env.MASTODON_BEARER_TOKEN}`,
      'Content-Type': 'application/json',
      Accept: '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      Connection: 'keep-alive'
    }

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

    // post to Mastodon
    let success = true
    try {
      // post to Mastodon - comment out this line if something gets stuck to avoid publishing many times
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


/**
 * This task is responsible for sending an email to the applicant and requesting booking
 * of a time slot for the second interview.
 */
client.subscribe('invite_for_interview', async function({ task, taskService }) {
    const baseUrl = 'https://digisailors.ch';

    // lock task
    await taskService.lock(task, 60);
  
    // Get a applicant details
    const name = task.variables.get('name');
    const email = task.variables.get('email');
    const processInstanceId = task.processInstanceId;
    
    // leave log traces
    console.log(`===================================`);
    console.log(`[${new Date().toLocaleString('en-GB')}]`);
    console.log(`Applicant name: ${name}`);
    console.log(`Inviting ${email} to book slot for second interview...`);

    // send email with booking link
    let success = true
    try {
      let mailOptions = {
        from: 'bot@digisailors.ch',
        to: email,
        subject: 'Digisailors - Invitation for second interview',
        text: `Dear ${name},\n\n`
          + `You passed the first screening interview! We would like to invite you for a second interview.\n\n`
          + `Please book a slot here: ${baseUrl}/applicant/booking/${processInstanceId}\n\n`
          + `If you are no longer interested in this position, please withdraw your application on the booking page.\n\n`
          + `Best regards,\n`
          + `Digisailors`,
      };

      let transporter = await getTransporter()
      await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          success = false
          console.log(error); // eslint-disable-line no-console
        } else {
          console.log('✓ Message sent: %s', info.messageId); // eslint-disable-line no-console
          transporter.close();
        }
      });
    } catch (error) {
      success = false
      console.log(error) // eslint-disable-line no-console
    }

    // Complete the task
    if (success) {
      await taskService.complete(task);
    } else {
      await taskService.handleFailure(task, {
        errorMessage: 'Error sending email',
        errorDetails: 'Error sending email',
        retries: 0,
        retryTimeout: 1000
      });
    }
});


/**
 * This task is responsible for sending the rejection emails to the applicants.
 */
client.subscribe('reject_application', async function({ task, taskService }) {
    // lock task
    await taskService.lock(task, 60);

    // Get a applicant details
    const name = task.variables.get('name');
    const email = task.variables.get('email');

    // leave log traces
    console.log(`===================================`);
    console.log(`[${new Date().toLocaleString('en-GB')}]`);
    console.log(`Applicant name: ${name}`);
    console.log(`Sending rejection email to ${email}...`);

    // send email with rejection message
    let success = true
    try {
      let mailOptions = {
        from: 'bot@digisailors.ch',
        to: email,
        subject: 'Digisailors - Your application was rejected',
        text: `Dear ${name},\n\n`
          + `Please note that your application has been rejected.\n\n`
          + `We wish you all the best.\n\n`
          + `Best regards,\n`
          + `Digisailors`,
      };

      let transporter = await getTransporter()
      await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          success = false
          console.log(error); // eslint-disable-line no-console
        } else {
          console.log('✓ Message sent: %s', info.messageId); // eslint-disable-line no-console
          transporter.close();
        }
      });
    } catch (error) {
      success = false
      console.log(error) // eslint-disable-line no-console
    }

    // Complete the task
    if (success) {
      await taskService.complete(task);
    } else {
      await taskService.handleFailure(task, {
        errorMessage: 'Error sending rejection email',
        errorDetails: 'Error sending rejection email',
        retries: 0,
        retryTimeout: 1000
      });
    }
});


/**
 * This task is responsible for sending the rejection emails to the applicants.
 */
client.subscribe('inform_manager_slot', async function({ task, taskService }) {
  // lock task
  await taskService.lock(task, 60);

  // Get a applicant details
  const name = task.variables.get('name');
  const email = task.variables.get('email');
  const slot = task.variables.get('slot');
  const processInstanceId = task.processInstanceId;

  // @todo - get manager details via recruimtent process instance
  const managerName = 'Manager';
  const managerEmail = 'manager@digisailors.ch';

  // leave log traces
  console.log(`===================================`);
  console.log(`[${new Date().toLocaleString('en-GB')}]`);
  console.log(`Applicant name: ${name}`);
  console.log(`Informing manager about interview slot by email to ${managerEmail}...`);

  // send email with interview slot
  let success = true
  try {
    let mailOptions = {
      from: 'bot@digisailors.ch',
      to: managerEmail,
      subject: 'Digisailors - New intervew slot booked',
      text: `Dear ${managerName},\n\n`
        + `Please note that a candidate has booked an interview slot as follows:\n\n`
        + `Applicant Name: ${name}\n`
        + `Applicant Email: ${email}\n`
        + `Interview Slot: ${slot}\n\n`
        + `Please leave interview feedback here: https://digisailors.ch/manager/interviews/${processInstanceId}\n\n`
        + `Best regards,\n`
        + `Digisailors`,
    };

    let transporter = await getTransporter()
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        success = false
        console.log(error); // eslint-disable-line no-console
      } else {
        console.log('✓ Message sent: %s', info.messageId); // eslint-disable-line no-console
        transporter.close();
      }
    });
  } catch (error) {
    success = false
    console.log(error) // eslint-disable-line no-console
  }

  // Complete the task
  if (success) {
    await taskService.complete(task);
  } else {
    await taskService.handleFailure(task, {
      errorMessage: 'Error sending rejection email',
      errorDetails: 'Error sending rejection email',
      retries: 0,
      retryTimeout: 1000
    });
  }
});

client.start();
