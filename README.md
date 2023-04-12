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
1. How to deal with documents, i.e., each candiate

### 🔍 Status Quo of the Business Process

 - Each job vacancy is a process instance
 - Each internal candidate 
 

❌ Problems in current process:

- ...
- ...

✅ Potentials for process improvements and digitization:

- Google Form to start the process: hiring manager enters job title, job description, salary range, required skills
- Automate the internal candidate screening using a small database with test data and an API
- Automate the job posting: we can simulate publishing the job ad by posting the job add via API to a Twitter account
- iSaaS: Integromat possibly for starting process instances via a Google Form and posting the job ad to Twitter

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
- how do we trigger a new process instance (e.g. via a ```POST``` on the Camiunda REST API)
- how do we glue different services together? (MAKE.com as middleware, self-scripted middleware)
- how does the customer interact with the process, e.g. a chatbot or UI

## 🚀 Change Project

...

## ⚙️ Implementation

...
