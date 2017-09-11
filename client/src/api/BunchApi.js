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

  return fetch(`questionare`, {
    accept: "application/json"
  })
    .then(checkResponse)
    .then((response) => response.json())
    .then(cb);
}

export const pushParticipantData = (cb, state) => {

  console.log(`pushParticipantData`)

  return fetch(`questionare/${state.steps.name}?data=${JSON.stringify(state)}`, {
    accept: "application/json",
    method: 'POST',
  })
    .then(checkResponse)
    .then((response) => response.json())
    .then(cb);
}