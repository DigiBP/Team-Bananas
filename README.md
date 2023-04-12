# 🍌 Team Bananas

## 🗂️ Table of Contents

- [🍌 Team Bananas](#-team-bananas)
  - [🗂️ Table of Contents](#️-table-of-contents)
  - [👥 Team Members](#-team-members)
  - [🔁 Business Process](#-business-process)
    - [🔍 Status Quo of the Business Process](#-status-quo-of-the-business-process)
  - [💡 Considerations](#-considerations)
  - [🚀 Change Project](#-change-project)
  - [⚙️ Implementation](#️-implementation)

## 👥 Team Members

- Afrodita Abdili
- Dietrich Rordorf
- Gabriela Caldeira Goncalves
- Gezim Gjoklaj
- Tim Käser

## 🔁 Business Process

<img src="https://raw.githubusercontent.com/DigiBP/Team-Bananas/main/docs/employee-recruitment-process.png" style="width:100%; height:auto;" />

### 🔍 Questions for the Coachings

1. How to deal with the parallel subtasks, i.e., we need to model parallel subtasks for scheduling and holding interviews with the candidates
1. How to deal with documents, i.e., each candiate has a CV (may be just simluate as a text field?)

### 🔍 Status Quo of the Business Process

 - Each job vacancy is a process instance
 - Each internal candidate interview scheduling & interviewing will be a subtask
 

❌ Problems in current process:

- everything is done manually, there are many process steps
- some tasks like screening of CVs are standard tasks that can be automated
- there is little support of the hiring manager in the current process (i.e., the hiring manager has to enter everything manually into a Word file for HR to process)

✅ Potentials for process improvements and digitization:

- Google Form to start the process: via Integromat and Camunda API a new process instance can be started
  - form is prefilled with standard job description text
  - hiring manager enters job title, job description
  - hiring manager selects required skills, maturity level, proposed salary range from dropdowns or checkboxes in the form
- Automate the internal candidate screening using a small database with test data and an API
- Automate the job posting: we can simulate publishing the job ad by posting the job add via API to a Twitter account
- Error handling scenario: job can not be posted on Twitter, a human needs to intervene to post it manually otherwise there will be no candidates for the vacancy
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
