# 🍌 Team Bananas

## 👥 Team Members

| Name                        | Email                                         |
| --------------------------- | --------------------------------------------- |
| Afrodita Abdili             | <afrodita.abdili@students.fhnw.ch>            |
| Dietrich Rordorf            | <dietrichhanspaul.rordorf@students.fhnw.ch>.  |
| Gabriela Caldeira Goncalves | <gabriela.caldeiragoncalves@students.fhnw.ch> |
| Gezim Gjoklaj               | <gezim.gjoklaj@students.fhnw.ch>              |
| Tim Käser                   | <tim.kaeser@students.fhnw.ch>                 |


## Coach

Our marvellous coach is Charuta Pande.

## Project Documentation

**The documentation of the project is in the [Wiki of this repository](https://github.com/DigiBP/Team-Bananas/wiki).**




## 🚀 Change Project


### Service Architecture

<img src="https://raw.githubusercontent.com/DigiBP/Team-Bananas/main/docs/service-architecture.png" style="width:100%; height:auto;" />

### ✅ Scope of the Process Improvements and Digitization:

- A small web app with the name "HR Buddy" is used by hiring managers to start a new process instance via filling in a form
  - hiring manager enters job title, office, and department
  - hiring manager adds a few required skills
  - **Automation:** based on position title and skills, a job ad is automatically generated using OpenAI API ("ChatGPT")
  - the hiring manager can adjust the job ad if needed before confirming
- **Automation:** automate the internal candidate screening using neural search (i.e., vector representation of the job ad matched against vector representations of the employees)
- **Automation:** automate the job posting: we simulate publishing the job ad by posting the job add via API to a Mastodon account
- **Error Handling Scenario:** job can not be posted on Mastodon, a human needs to intervene to post it manually otherwise there will be no candidates for the vacancy
- Candidates can browse the job ads on the "HR Buddy" web app
- Upon clicking on "Apply" in the web app, the candidates are taken to a pre-filled Google Form where they can enter their details
- **iSaaS:** the Google Form submission triggers an event-based, multi-instance expanded subtask for each applicant via Integromat / MAKE.com
- **Self-service:** scheduling integration for applicants to select suitable time window for interview
- **iSaaS:** Integromat (MAKE.com) possibly for starting process instances via a Google Form and posting the job ad to Mastodon
- **Chatbot**: use a chatbot to collect information from the candidate: do the screening of the candiates via the Chatbot
- **Automation:** automate the rejection of candidates: after 14 days in the pipeline without anyone taking action, the candidates are rejected
- Video interview: we only do a form for HR to leave the interview feedback (but do not automate the integration with video call tools)
- If another error scenario is required: we can simulate "error" handling for the case the final candidate rejects the employment offer and the process instance is left without candidates 


## ⚙️ Implementation

### Process Model

1. The process model is deployed on Camunda Platform 
1. The Digisailor HR Buddy is a self-service web platform for the Hiring Manager, HR Staff and the Applicants:
    - The app is accessed via [https://digisailors.ch/](https://digisailors.ch/)
    - Hiring Manager and HR Staff need to login (Password: ```secret```) 
    - A new process instances is created via Camunda REST Engine API as soon as the hiring manager enter a new position title:
        - The logic is in [./app/frontend/server-middleware/camunda/api.js](https://github.com/DigiBP/Team-Bananas/blob/main/app/frontend/server-middleware/camunda/api.js)
        - A business key is created for each position using current year, month and the slug of the position title
    - Once the process instance is created the process starts, i.e., the token is moved to the first task ```generate_job_ad```
    - The first task ```generate_job_ad``` is waiting for message via topic brokerage
    - The Hiring Manager continues in the HR Buddy App by enter key skills for the position, which are fed into the OpenAI API to auto-generate a job ad text via GPT-4
    - The Hiring Manager can edit the generated job ad until satisfied. When confirming the job ad, this will fetch the external service task ```job_ad``` for given process instance from the Camdunda REST API, lock the external task, and mark it as completed. 
    - As soon as the job ad is defined, HR employees check whether there are suitable internal candidates. This check is based on vector similarity search in Weviate, where it compares document embeddings of the job ad with embeddings of employee's biographies.
    - If potential internal candidates are available: the user task will be started by HR employees reaching out to these candidates to evaluate whether they should be considered for the open position, if there are no interested employees, the process goes on to advertise the position job ad on social media. 
    - If there are no potential candidates available: the position job ad is being published and advertised fully automated, simulated by pushing to Mastodon social media (open source alternative to Twitter) and realized via automated polling via the node worker app and the process is waiting for applicants.
    - Each application is a separate process. 
    - The process waits to receive the message whether a candiate should be considered for the shortlist.
    
    - 🔴 **TODO** to be continued... save business data to Google Sheet, publish job ad text to the topic exchange 🔴


### Profiles of the internal candidates and questions for the precheck

Here are a few pre-screening questions that we can use for the precheck (Gezim):
1. Can you confirm your eligibility to work in [country/region]?
2. Are you comfortable with the salary range provided in the job description?
3. Are you available to work the required hours/schedule for this position?
4. Are you willing to undergo a background check and/or drug test if required?
5. Do you have any upcoming commitments or planned absences that may impact your ability to start working within the next [timeframe]?

These questions can help the company gather essential information about each applicant's qualifications and compatibility with the job requirements. It can also help to narrow down the candidate pool before conducting in-depth interviews.

### API Interfaces

#### Camunda REST Engine

The Camunda REST Engine API is used to create a new process instance and handle external tasks (fetch external task for process instance, lock and mark as completed).

The implementation is in [./app/frontend/server-middleware/camunda/api.js](https://github.com/DigiBP/Team-Bananas/blob/main/app/frontend/server-middleware/camunda/api.js)

#### OpenAI API 

The OpenAI API is used to generate the job ad text automatically.

The implementaion of the OpenAI API is in [./app/frontend/server-middleware/ai/api.js](https://github.com/DigiBP/Team-Bananas/blob/main/app/frontend/server-middleware/ai/api.js). We use GPT-4 model via the ```createChatCompletion``` enpoint, which is included in the OpenAI JavaScript client. The prompt is the following:

```js
  const prompt = 'Please write a job ad with basic html formatting (allowd tags: h1, h2, ul, li, p). ' +
                 'The job ad should follow this format: Position Title, About Digisailors, Job Description, Requirements, Application. ' +
                 `The job ad is for the company "Digisailors" based in Olten and is for a position as "${req.body.title}". ` +
                 `The job add should include a section "About Digisailors" with the following text: "${about}". ` +
                 (skills ? `The job add should inlcude skills related to "${skills}" and extend to related and common skills for a "${req.body.title}". ` : '') +
                 'The applicants should apply online via "HR Buddy" on https://digisailors.ch/:'
```


#### Mastodon API

We simulate posting the job ad to Mastodon social media network (free, open source alternative to Twitter). This task is fully automated through a poller that connects to Camunda and waits for new tasks in the topic ```publish_social_media```. As soon as a new message (respectively: external task) is published on this topic, the automation grabs and locks the tasks, posts the tweet text against the Mastodon REST API and completes the external tasks (so that the token moves to the next stage of accepting candidate applications).

The implementation is in [./app/automation/entrypoint.js](https://github.com/DigiBP/Team-Bananas/blob/main/app/automation/entrypoint.js)

The Mastodon accounts with the tweets is to be found on [https://mstdn.social/@digisailors](https://mstdn.social/@digisailors)

----


## 💡 Considerations

There are some considerations when we build and digitalize the new process:

- error handling in the process
    - what error handling pattern to use
    - interrupting vs. non-interrupting error events
    - at least 1 error scenario should be covered (and we can elaborate in the paper further)
- service tasks:
    - are they synchronus or asynchronous
    - are they message producers or consumers
    - what data is exchanged
    - webhook, REST API call, messaging, ...
- how do we trigger a new process instance (e.g. via a ```POST``` on the Camunda REST API)
- how do we glue different services together? (MAKE.com as middleware, self-scripted middleware)
- how does the customer interact with the process, e.g. a chatbot or UI

#### ❓ Feedback from 1st Coaching

- the process should be extended a bit
- the process is pretty standard now (it is the most commonly choosed by students), we should make it a bit more unique and innovative when we design the to-be process
- we should add 1-2 more service tasks
- next step is to define the to-be process
- email communication can be done via MAKE / Integromat (Integromat can deal with emails sending, receiveing, saving attachments) 
- update the as-is process:
    - we have 3 roles (hiring manager, HR staff, candidate)
    - for as-is process we do not identify the markers (service task, user task, etc) as this would indicate that we already use a workflow engine (use a simple task instead)
- for parallel subtasks: ues expanded subprocess in Camunda and use parallel or sequential multi-instance (we need to check the Camunda 8 platform docs)
- for CVs we can simply store into a Google Drive and use MAKE integration (in MAKE we can also use the HTTP and the Web Hook)
- goal by next week: udpate the as-is process, define the to-be process, deploy to Camunda (we have a tenant ID for Team Bananas), business rules for the rules-based task, and may be try to have the Google Form ready that can trigger a new process instance. 

#### ❓ Feedback from 2nd Coaching

- the to-be-process is now good and sufficient
- try to use MAKE instead of own Java-Codes
- try to split the work balanced in the team
- next steps and goal are to define by next week: register and open the "trello" board with the open assigned task, sceleton of the user interface (openAI API) and connect with camunda API, prepare 20 different profiles of people (IT Manager, DevOps Engineer,...), create a Mastodon account with the Mastodon API, open and register for the Google API (in the Google Cloud Console) and create there an empty google-excel-sheet with 3 tabs (questions, candidates, job add), implement the Longlist-Category in the to-be-process in Camunda, Define questions for the Precheck and try to have the Google Form ready that can trigger a new process instance. 

#### ❓ Feedback from 3rd Coaching

