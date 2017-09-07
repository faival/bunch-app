const dimensionsQuestionsDataset = require('../config/dimensionsQuestionsDataset.json')

class BunchApi {

  constructor() {
    this.apiRoot = `api`;
  }
  fetchData(endpoint) {
    const fetchUrl = `${this.apiRoot}/${endpoint}`

    //TODO: integrate
    return dimensionsQuestionsDataset
  }
}

export default BunchApi