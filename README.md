# 🍌 Team Bananas - Job Vacancy & Hiring Process

## 🗂️ Table of Contents

- [🍌 Team Bananas](#-team-bananas)
  * [🗂️ Table of Contents](#-table-of-contents)
  * [👥 Team Members](#-team-members)
  * [🔁 Business Process](#-business-process)
    + [❓ Questions for the 1st Coaching](#-questions-for-the-1st-coaching)
    + [🔍 Status Quo of the Business Process](#-status-quo-of-the-business-process)
    + [❌ Problems in current process:](#-problems-in-current-process-)
    + [✅ Potentials for process improvements and digitization:](#-potentials-for-process-improvements-and-digitization-)
  * [💡 Considerations](#-considerations)
  * [🚀 Change Project](#-change-project)
  * [⚙️ Implementation](#-implementation)

## 👥 Team Members

- Afrodita Abdili
- Dietrich Rordorf
- Gabriela Caldeira Goncalves
- Gezim Gjoklaj
- Tim Käser

## 🔁 Business Process

### 🔍 As-Is Business Process

We choose a mostly company-internal business process of filling a job vacancy as our process to digitalize. The process has 3 roles: hiring manager, HR staff, and candidates. The hiring manager is the person that initiates the process by filing a new job vacancy request. The HR staff receives the request and processes the job vacancy through aministrative stages (job posting, candidate screening, scheduling interviews, etc.). The candidate sends in his/her application for the job vacancy, participates the interview, and may recieve a job offer at the end of the process. The hiring manager particpates the shortlisting, the interviews and makes the final hiring decisions.

Each job vacancy will be represented as a process instance and candidates that apply to the job will be treated in paralell as subtasks of the main process.

<img src="https://raw.githubusercontent.com/DigiBP/Team-Bananas/main/docs/employee-recruitment-process.png" style="width:100%; height:auto;" />

### ❓ Questions for the 1st coaching session

1. How to deal with the parallel subtasks, i.e., we need to model parallel subtasks for scheduling and holding interviews with the candidates
1. How to deal with documents, i.e., each candiate has a CV (may be just simluate as a text field?)
1. How to deal with emails / messages in the workflow (i.e., applicaiton received or rejected message). Shall we simulate a small email server such as mailcatcher?
1. Based on the suggested list of "potentials for process improvements" further down, is the scope of the project enough / too much?

### ❌ Problems in current process:

- everything is done manually, there are many process steps
- some tasks like screening of CVs are standard tasks that can be automated
- there is little support of the hiring manager in the current process (i.e., the hiring manager has to enter everything manually into a Word file for HR to process)

### ✅ Potentials for process improvements and digitization:

- Google Form to start the process: via Integromat and Camunda API a new process instance can be started
  - form is prefilled with standard job description text
  - hiring manager enters job title, job description
  - hiring manager selects required skills, maturity level, proposed salary range from dropdowns or checkboxes in the form
- Automate the internal candidate screening using a small database with test data and an API
- Automate the job posting: we can simulate publishing the job ad by posting the job add via API to a Twitter account
- Error handling scenario: job can not be posted on Twitter, a human needs to intervene to post it manually otherwise there will be no candidates for the vacancy
- Automate the rejection of candidates: after 14 days in the pipeline without anyone taking action, the candidates are rejected
- If another error scenario is required: we can simulate "error" handling for the case the final candidate rejects the employment offer and the process isntance is left without candidates 
- iSaaS: Integromat (MAKE.com) possibly for starting process instances via a Google Form and posting the job ad to Twitter

## 💡 Considerations

There are some consideations when we build and digitalize the new process:

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

## 🚀 Change Project

...

## ⚙️ Implementation

...
