const axios = require('axios')

// helper function to generate a business key
function generateBusinessKey (title, office) {
  const today = new Date()
  const date = today.toISOString().split('T')[0].replace(/-/g, '')
  const acronym = title
    .match(/[\p{Alpha}\p{Nd}]+/gu)
    .reduce((previous, next) => previous + ((+next === 0 || parseInt(next)) ? parseInt(next) : next[0] || ''), '')
    .toUpperCase()

  let officeAcronym = 'ANY'
  switch (office) {
    case 'Basel':
      officeAcronym = 'BSL'
      break
    case 'Bern':
      officeAcronym = 'BRN'
      break
    case 'Olten':
      officeAcronym = 'OLT'
      break
    case 'Zurich':
      officeAcronym = 'ZRH'
      break
  }

  return `${date}/${officeAcronym}/${acronym}`
}

// helper function to get the variables for a process isntance
async function getProcessVariables (baseUrl, commonHeaders, processInstanceId) {
  const processVariablesUrl = `${baseUrl}/process-instance/${processInstanceId}/variables`
  console.log('GET', processVariablesUrl) // eslint-disable-line no-console
  const processVariablesResponse = await axios.get(processVariablesUrl, {
    headers: commonHeaders
  })

  const variables = {}
  for (const [key, variable] of Object.entries(processVariablesResponse.data)) {
    variables[key] = variable.value
  }

  return variables
}

// helper function to get the current activity for a process instance
async function getProcessActivities (baseUrl, commonHeaders, processInstanceId) {
  const processActivityUrl = `${baseUrl}/process-instance/${processInstanceId}/activity-instances`
  console.log('GET', processActivityUrl) // eslint-disable-line no-console
  const processActivityResponse = await axios.get(processActivityUrl, {
    headers: commonHeaders
  })

  return processActivityResponse.data.childActivityInstances
}

// helper function to get and lock external task
async function getAndLockExternalTask (baseUrl, commonHeaders, processInstanceId, taskName) {
  let externalTaskId = null

  // get external task id
  const getExternalTaskUrl = `${baseUrl}/external-task?processInstanceId=${processInstanceId}&topicName=${taskName}`
  console.log('GET', getExternalTaskUrl) // eslint-disable-line no-console
  try {
    const getExternalTaskResponse = await axios.get(getExternalTaskUrl, {
      headers: commonHeaders
    })
    externalTaskId = getExternalTaskResponse.data[0].id
  } catch (error) {
    console.log(error.response.data) // eslint-disable-line no-console
    return false
  }

  // lock external task
  const lockExternalTaskUrl = `${baseUrl}/external-task/${externalTaskId}/lock`
  console.log('POST', lockExternalTaskUrl) // eslint-disable-line no-console
  try {
    await axios.post(lockExternalTaskUrl, {
      workerId: 'HR Buddy (digisailors.ch)',
      lockDuration: 10000
    }, {
      headers: commonHeaders
    })
  } catch (error) {
    console.log(error.response.data) // eslint-disable-line no-console
    return false
  }

  return externalTaskId
}

// helper fucntion to complete external task
async function completeExternalTask (baseUrl, commonHeaders, externalTaskId) {
  const completeExternalTaskUrl = `${baseUrl}/external-task/${externalTaskId}/complete`
  try {
    await axios.post(completeExternalTaskUrl, {
      workerId: 'HR Buddy (digisailors.ch)'
    }, {
      headers: commonHeaders
    })
  } catch (error) {
    console.log(error.response.data) // eslint-disable-line no-console
    return false
  }

  return true
}

export { generateBusinessKey, getProcessVariables, getProcessActivities, getAndLockExternalTask, completeExternalTask }
