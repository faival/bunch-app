const express = require("express")
const fs = require("fs")
const app = express()
const firebase = require("firebase")
const dimensionsQuestionsDataSet = require(`./dimensionsQuestionsDataset.json`)
const bodyParser = require('body-parser');


const config = {
  apiKey: "AIzaSyBZJry2YfiOX9imcLD0lB2wE04fB7mUC54",
  authDomain: "bunch-app.firebaseapp.com",
  databaseURL: "https://bunch-app.firebaseio.com",
  projectId: "bunch-app",
  storageBucket: "bunch-app.appspot.com",
  messagingSenderId: "555016501738"
}
firebase.initializeApp(config)
// Listen for auth state changes


// let currentUID = null
// const onAuthStateChanged = (user) => {
//   // We ignore token refresh events.
//   if (user && currentUID === user.uid) {
//     return;
//   }

//   if (user) {
//     currentUID = user.uid;
//     startDatabaseQueries();
//   } else {
//     // Set currentUID to null.
//     currentUID = null;
//   }
// }
// firebase.auth().onAuthStateChanged(onAuthStateChanged)
const USER_EMAIL = 'faival@gmail.com'
const USER_PASS= 'bunch-app'

firebase.auth().signInWithEmailAndPassword(USER_EMAIL, USER_PASS).then(() => {
  const ref = firebase.database().ref(`dimensions/0`);
  ref.once(`value`)
    .then(function(snapshot) {
      const dimensionEntry = snapshot.exists();

      if (!dimensionEntry) {

          const initialState = getInitialState(dimensionsQuestionsDataSet)

          for (let dimensionIdx = 0; dimensionIdx < initialState.dimensions.length; dimensionIdx++) {
            firebase.database().ref(`dimensions/${initialState.dimensions[dimensionIdx].id}`).set(initialState.dimensions[dimensionIdx])
          }

          for (let answerIdx = 0; answerIdx < initialState.answers.length; answerIdx++) {
            firebase.database().ref(`answers/${initialState.answers[answerIdx].id}`).set(initialState.answers[answerIdx])
          }
      }
    })
})

app.set("port", process.env.PORT || 3001)
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodie

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"))
}

const getInitialState = (dimensionsDataSet) => {
  let answers = []
  let dimensions = []
  let steps = {
    initialized: false,
    currentStep: 0,
    steps: []
  }
  let answerId = 0

  dimensions = dimensionsDataSet.map((dimension, indexDimension) => {
    const dimensionObject = {}
    dimensionObject['selected'] = 0
    dimensionObject['used'] = 0
    dimensionObject['id'] = indexDimension
    dimensionObject['answers'] = dimension.answers.map((answer, indexAnswer) => {
      const answerAsObject = {
        id: answerId,
        indexInDimension: indexAnswer,
        dimension: indexDimension,
        dimensionName: dimension.name,
        selected: 0,
        unselected: 0,
        answer,
      }
      answerId = answerId + 1
      answers = [...answers, answerAsObject]
      return answerAsObject
    })
    return Object.assign({}, dimension, dimensionObject)
  })

  return {
    answers,
    dimensions,
    steps,
  }
}

const dimensionsRef = firebase.database().ref('dimensions')
const answersRef = firebase.database().ref('answers')





const COLUMNS = [
  "carbohydrate_g",
  "protein_g",
  "fa_sat_g",
  "fa_mono_g",
  "fa_poly_g",
  "kcal",
  "description"
]
app.get("/api/food", (req, res) => {
  const param = req.query.q

  if (!param) {
    res.json({
      error: "Missing required parameter `q`"
    });
    return;
  }
  
  res.json(['hello']);
  
})
app.get(`/questionare`, (req, res) => {

  console.log(`/questionare`)

  new Promise((resolve, reject) => {
    firebase.database().ref('/dimensions').once('value').then((snapshot) => {

      const dimensions = snapshot.val()

      firebase.database().ref('/answers').once('value').then((snapshot) => {

        const answers = snapshot.val()

        resolve({
          dimensions,
          answers
        })
      })
    })
  }).then((data) => res.json(data))
})

app.post(`/questionare/:userId`, (req, res) => {

  console.log(`/questionare/:userId`)


  console.log(req.body.data)

  const participantData = JSON.parse(req.body.data)
  
  participantData.steps.steps.map( step => {

    step.questions.map(answer => {
      const answerRefUrl = `/answers/${answer.id}`
      const answerRef = firebase.database().ref(answerRefUrl)
      return answerRef.once('value').then(snapshot => {
        const answerRefValue = snapshot.val()

        const dimensionRefUrl = `/dimensions/${answer.dimension}`
        const dimensionsRef = firebase.database().ref(dimensionRefUrl)
        return dimensionsRef.once('value').then(snapshot => {
          const dimensionRefValue = snapshot.val()


          const answerUpdates = {}

          console.log(answerRefValue.selected)
          console.log(answerRefValue.unselected)
          answerUpdates[answerRefUrl] = Object.assign(
            {}, 
            answerRefValue, 
            {
              used: answerRefValue.selected + 1,
              selected: (participantData.selected === answer.id) ? answerRefValue.selected + 1 : answerRefValue.selected,
              unselected: (participantData.selected !== answer.id) ? answerRefValue.unselected + 1 : answerRefValue.unselected,
            }
          )

          console.log(dimensionRefValue.selected)
          console.log(dimensionRefValue.used)

          const dimensionsUpdates = {}
          dimensionsUpdates[dimensionRefUrl] = Object.assign(
            {}, 
            dimensionRefValue, 
            {
              selected: (participantData.selected === answer.id)? dimensionRefValue.selected + 1 : dimensionRefValue.selected,
              used: dimensionRefValue.used + 1,
            }
          )

          return firebase.database().ref().update(answerUpdates).then(() => firebase.database().ref().update(dimensionsUpdates))
        })
      })
    })
  })

  const userUpdate = {}
  const userName = req.params.userId
  userUpdate[`/users/${userName}`] = participantData
  firebase.database().ref().update(userUpdate)


  res.json(['Success'])


})

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
})
