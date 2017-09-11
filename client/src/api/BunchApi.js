import axios from 'axios'

const checkResponse = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(`HTTP Error ${response.statusText}`);
  error.status = response.statusText;
  error.response = response;
  console.log(error); // eslint-disable-line no-console
  throw error;
}
export const getInitialData = (cb) => {

  console.log(`getInitialData`)

  return axios.get(`questionare`, {
    accept: "application/json"
  })
    .then(checkResponse)
    .then((response) => response.data)
    .then(cb);
}

export const pushParticipantData = (cb, state) => {

  console.log(`pushParticipantData`)

  return axios.post(`questionare/${state.steps.name}`, {
    accept: "application/json",
    data: JSON.stringify(state),
    method: 'POST',
    contentType: 'application/json',
  })
    .then(checkResponse)
    .then((response) => response.data)
    .then(cb);
}