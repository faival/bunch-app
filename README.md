# Bunch.io Code Challenge

First of all I wanted to showcase an end2end delivery rather than focus on the specifics.

This challenge makes use of the following stack:

* material design components
* d3
* react
* redux
* express
* node
* firebase 


# TODOS

* fix propertyTypes required errors in console
* add testing to assert core logic done at reducers
* deeper componetize StepsComponent
* Better handle UX interactions, e.g. form submit on enter, etc. 
* Add auth for users
* use localstorage for saving steps
* use BE for any transaction: e.g steps data should be pushed on every step and not at the end of the questionare
* use BE to retrieve next step data and leverage database performance on lookup


# Outcome

Didn't have time to accomplish with the TODOS, in general I was very motivated by the code challenge. Please find additional comments along the code.

Additional metadata could be used to greater improve the core logic used to propose questions:

ATM only these fields are taken into account when proposing the next set of questions:

dimensions.used
dimensions.selected

answers.selected
answers.unselected

* It will be interesting to provide a slider to let users rate the `difficulty` of the two questions being exposed, this way this additinal metadata could be used to retrieve answers based on difficulty

* We could track the amount of time a user takes to answer the question as an additional `dificulty` metadata, and take into consideration this information for analitics and to dynamically filter answers for next steps



