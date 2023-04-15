# 🍌 Team Bananas - Job Vacancy & Hiring Process


## 👥 Team Members

| Name                        | Email                                         |
| --------------------------- | --------------------------------------------- |
| Afrodita Abdili             | <afrodita.abdili@students.fhnw.ch>            |
| Dietrich Rordorf            | <dietrichhanspaul.rordorf@students.fhnw.ch>.  |
| Gabriela Caldeira Goncalves | <gabriela.caldeiragoncalves@students.fhnw.ch> |
| Gezim Gjoklaj               | <gezim.gjoklaj@students.fhnw.ch>              |
| Tim Käser                   | <tim.kaeser@students.fhnw.ch>                 |

Our marvellous coach is Charuta Pande.

## 🔁 Business Process

### 🔍 As-Is Business Process

🔴 **TODO** rewrite as a process profiles according to BPM lecture (Gabriela) 🔴

We choose a mostly company-internal business process of filling a job vacancy as our process to digitalize.

Description of the process/use case: A typical use case for an employee recruitment process in a company involves identifying the need for a new employee, creating a job description and job advertisement, posting the advertisement on various job boards, receiving and reviewing resumes and cover letters from candidates, conducting phone and in-person interviews, selecting the most suitable candidate, making an offer of employment, and onboarding the new employee. During the process, the recruitment team may also conduct background checks, reference checks, and skill assessments to ensure the candidate is qualified and suitable for the role. The entire process may be managed through a recruitment software or applicant tracking system, which allows for efficient tracking and communication with candidates throughout the process. The ultimate goal of the process is to attract, evaluate, and hire the best possible candidate for the position while ensuring fairness, efficiency, and compliance with relevant laws and regulations.

The process has 3 roles: hiring manager, HR staff, and candidates. The hiring manager is the person that initiates the process by filing a new job vacancy request. The HR staff receives the request and processes the job vacancy through aministrative stages (job posting, candidate screening, scheduling interviews, etc.). The candidate sends in his/her application for the job vacancy, participates the interview, and may recieve a job offer at the end of the process. The hiring manager participates the shortlisting, the interviews and makes the final hiring decisions.

Each job vacancy will be represented as a process instance and candidates that apply to the job will be treated in paralell as subtasks of the main process.

<img src="https://github.com/DigiBP/Team-Bananas/blob/main/docs/Employee%20recruitment_asis.png" style="width:100%; height:auto;" />

### ❌ Problems in current process:

- everything is done manually, there are many process steps
- some tasks like screening of CVs are standard tasks that can be automated
- there is little support of the hiring manager in the current process (i.e., the hiring manager has to enter everything manually into a Word file for HR to process)

### 🔍To-Be Process

🔴 **TODO** draw the to be process (Tim) 🔴

🔴 **TODO** describe the to-be process (Afrodita) 🔴

🔴 **TODO** describe the rules that we can later use in decision table for candidate screening (Gezim) 🔴

Description of ToBe Process:
The process is initiated by the hiring manager, who requests a recruitment and clarifies the recruitment assignment. Then the following process steps are initialized:

- Job Posting: The recruitment process starts with creating a job posting that outlines the job requirements, responsibilities, and qualifications. This job posting is then shared on the company's career website, job boards, and social media platforms.

- Candidate Application: As soon as a candidate applies for the job, the candidates are required to fill out an online application form. The form captures the candidate's personal information, work history, education, and other relevant details indicated by the form. The system then automatically parses and extracts relevant data from the application.

- Resume Review: After receipt of the application, the system automatically evaluates the candidate's application details and resume against the stated job requirements and filters out unqualified candidates. This automated screening process of the application saves time and effort for recruiters compared to evaluating it manually.

- Automated Assessment: The next step in the process is an automated assessment where candidates are invited to perform online assessments that tests their skills, knowledge, and cognitive abilities within a series of different tests, simulations, or other assessments.

- Video Interview: If a qualified candidate is identified during the automated assessments, the system will schedule video interviews. During these video interviews, the system uses AI-powered tools to analyze the candidate's responses and facial expressions to assess their fit for the job.

- Technical Interview: To evaluate the skills of the qualified candidate further, the system will schedule a technical interview as as a second step. These predefined technical inerviews assesses the candidate's skills and experience in a particular domain.

- Background Check: Once the technical interview is completed, the system conducts a background check on the candidate to verify their employment history, education, and criminal record or other needed information for a specific job.

- Offer Letter: Finally, if the background check has been successful, the system generates an offer letter for the selected candidate. The systems automatically sends the offer letter to the candidate by offering an online form to accept or reject the offer directly online. 

Overall, several process steps in this HR recruitment process are automated and complemented with innovative technology with the aim to save time and effort for recruiters. Furthermore, the to-be process ensures that the hiring process is fair, consistent, and objective. By automating the evaluation of a candidate's application, unconscious biases can be eliminated. Providing these services in a digital way also provides a positive experience and fast application journey for candidates. All these factors can help to improve the company's reputation and attract top talents in the future.

<img src="https://github.com/DigiBP/Team-Bananas/blob/main/docs/Employee%20recruitment_tobe.png" style="width:100%; height:auto;" />

In the DRD-Decision are the "Longlist" and "Points" decision tables.

<img src="https://github.com/DigiBP/Team-Bananas/blob/main/docs/drd_decision.png" style="width:50%; height:auto;" />

Our 15 Business Rules are defined below:

<img src="https://github.com/DigiBP/Team-Bananas/blob/main/docs/dmn_points_list.png" style="width:100%; height:auto;" />

The following criterias were defined with the possible inputs in the brackets:
- Years of relevant experience ("<=5", [6..10], "11<")
- Degree level ("Elementary school", "Higher Technical School", "Bachelor", "Master", "Doctorate")
- Years of working experience ("<=5", [6..20], ">21")
- Can you speak english and german? ("yes", "no")
- Age ("<=25", [26..45], [46..65])
- Is the application complete? ("yes", "no")
- Gender ("Man", "Woman", "Other")

Our 3 longlist categories:
- A, this is the highest category, which means 3 stars. The assigned candidates are invited directly to the first interview.
- B, this is the medium category, which means 2 stars. These assigned candidates will be placed on the waiting list.
- C, this is the lowest category, which means 1 star. These assigned candidates are rejected directly.
- R, means return for application completation.

<img src="https://github.com/DigiBP/Team-Bananas/blob/main/docs/longlist_category.png" style="width:50%; height:auto;" />

## 🚀 Change Project


### Service Architecture

<img src="https://raw.githubusercontent.com/DigiBP/Team-Bananas/main/docs/service-architecture.png" style="width:100%; height:auto;" />

### ✅ Scope of the process improvements and digitization:

- Google Form to start the process: via Integromat and Camunda API a new process instance can be started
  - form is prefilled with standard job description text
  - hiring manager enters job title, job description
  - hiring manager selects required skills, maturity level, proposed salary range from dropdowns or checkboxes in the form
- Automate the internal candidate screening using a small database with test data and an API
- Google Form to simulate the application of candidates: the Google Form submission triggers the event-base, multi-instance expanded subtask is triggered for the candidate 
- Automate the job posting: we can simulate publishing the job ad by posting the job add via API to a Twitter account
- We should add an extra step for the job advertisment: e.g., use ChatGTP to create the job add
- Use a chatbot to collect information from the candidate: do the screening of the candiates via the Chatbot
- Scheduling integration (e.g., Calendly)
- Error handling scenario: job can not be posted on Twitter, a human needs to intervene to post it manually otherwise there will be no candidates for the vacancy
- Automate the rejection of candidates: after 14 days in the pipeline without anyone taking action, the candidates are rejected
- If another error scenario is required: we can simulate "error" handling for the case the final candidate rejects the employment offer and the process isntance is left without candidates 
- iSaaS: Integromat (MAKE.com) possibly for starting process instances via a Google Form and posting the job ad to Twitter
- Video interview: we only do a form for HR to leave the interview feedback (but do not automate the integration with video call tools)

## ⚙️ Implementation

### Deployment

🔴 **TODO** deploy to-be process model (Didi) 🔴

### Google Form to Start the Process Instance

🔴 **TODO** create google form to start process instance and connect with Camunda workflow engine (Didi) 🔴


----


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

