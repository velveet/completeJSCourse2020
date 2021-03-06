//module pattern used for handling this library

//          QUIZ CONTROLLER
let quizController = (function() {

  //QUESTION CONSTRUCTOR
  function Question(id, questionText, options, correctAnswer) {
    this.id = id;
    this.questionText = questionText;
    this.options = options;
    this.correctAnswer = correctAnswer;
  }

  let questionLocalStorage = {
    setQuestionCollection: function(newCollection) {
      localStorage.setItem('questionCollection', JSON.stringify(newCollection));
    },
    getQuestionCollection: function() {
      return JSON.parse(localStorage.getItem('questionCollection'));
    },
    removeQuestionCollection: function() {
      localStorage.clear();
      //localStorage.remove('questionCollection'); //it changed : it didn't recognised the method above as part of the stack
    }
  };

  //if there's nothing in the local storage.. then it will create an empty array
  if(questionLocalStorage.getQuestionCollection() === null) {
    questionLocalStorage.setQuestionCollection([]);
  }

  //quiz progress index, it increases along the quiz
  let quizProgress = {
    questionIndex: 0
  };

  //**** PERSON CONSTRUCTOR ****//
  function Person(id, firstname, lastname, score) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.score = score;
  }

  let currPersonData = {
    fullname: [],
    score: 0
  }

  let adminFullName = ['John', 'Smith'];

  let personLocalStorage = {
    setPersonData: function(newPersonData) {
      localStorage.setItem('personData', JSON.stringify(newPersonData));
    },
    getPersonData: function() {
      return JSON.parse(localStorage.getItem('personData'));
    },
    removePersonData: function() {
      localStorage.removeItem('personData')
    }
  };

  if (personLocalStorage.getPersonData() == null) {
    personLocalStorage.setPersonData([]);
  }

  return {

    getQuizProgress: quizProgress,

    getQuestionLocalStorage: questionLocalStorage,

    addQuestionOnLocalStorage: function(newQuestText, opts) {

      //variable declarations
      let optionsArr, corrAns, questionId, newQuestion, getStoredQuests;

      //initializing variables n arrays
      corrAns = "";
      optionsArr = [];
      getStoredQuests = [];

      if(questionLocalStorage.getQuestionCollection() === null) {
        questionLocalStorage.setQuestionCollection([]);
      }

      //obtainning the 'options array' and the 'correct answer'
      for (var i = 0; i < opts.length; i++) {

        if (opts[i].value !== "") {
          optionsArr.push(opts[i].value);
        }

        if (opts[i].previousElementSibling.checked && opts[i].value !== "") {
          corrAns = opts[i].value;
        }
      }

      // defining the id's for each question
      if (questionLocalStorage.getQuestionCollection().length > 0) {
        questionId = questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length - 1].id + 1;
      } else {
        questionId = 0;
      }

      //bulletproofing the form non sense values
      if(newQuestText.value !== "" && optionsArr.length > 1  && corrAns !== "") {
        //creating the new question object
        newQuestion = new Question(questionId, newQuestText.value, optionsArr, corrAns);

        getStoredQuests = questionLocalStorage.getQuestionCollection();
        getStoredQuests.push(newQuestion);
        questionLocalStorage.setQuestionCollection(getStoredQuests);

        newQuestText.value = "";

        for (var k = 0; k < opts.length; k++) {
          opts[k].value = "";
          opts[k].previousElementSibling.checked = false;
        }

        console.log(questionLocalStorage.getQuestionCollection());

        return true;
      } else {
        alert('Please check if there is a question, possible answers (it means more than one) and the correct answer. Otherwise it will be an imcomplete Quiz.');
        return false;
      }
    },

    checkAnswer: function(ans) {
      if (questionLocalStorage.getQuestionCollection()[quizProgress.questionIndex].correctAnswer === ans.textContent) {
        currPersonData.score++;
        return true;
      } else {
        return false;
      }
    },

    isFinished: function() {
      return quizProgress.questionIndex + 1 === questionLocalStorage.getQuestionCollection().length;
    },

    addPerson: function() {
      let newPerson, personId, personData;

      if (personLocalStorage.getPersonData().legnth > 0) {
        personId = personLocalStorage.getPersonData()[personLocalStorage.getPersonData().length - 1].id + 1;
      } else {
        personId = 0;
      }

      newPerson = new Person(personId, currPersonData.fullname[0], currPersonData.fullname[1], currPersonData.score);

      personData = personLocalStorage.getPersonData();

      personData.push(newPerson);

      personLocalStorage.setPersonData(personData);

      console.log(newPerson);
    },

    getCurrPersonData: currPersonData,

    getAdminFullName: adminFullName,

    getPersonLocalStorage: personLocalStorage

  };
})();



//          UI CONTROLLER
let uiController = (function() {

  let domItems = {
    //ADMIN PANEL ELEMENTS
    adminSection: document.querySelector('.admin-panel-container'),
    questInsertBtn: document.getElementById('question-insert-btn'),
    newQuestionText: document.getElementById('new-question-text'),
    adminOptions: document.querySelectorAll('.admin-option'),
    adminOptionsContainer: document.querySelector('.admin-options-container'),
    insertedQuestsWrapper: document.querySelector('.inserted-questions-wrapper'),
    questionUpdateBtn: document.getElementById('question-update-btn'),
    questionDeleteBtn: document.getElementById('question-delete-btn'),
    questsClearBtn: document.getElementById('questions-clear-btn'),
    resultsListWrapper: document.querySelector('.results-list-wrapper'),
    //QUIZ SECTION ELEMENTS
    quizSection: document.querySelector('.quiz-container'),
    askedQuestText: document.getElementById('asked-question-text'),
    quizOptionsWrapper: document.querySelector('.quiz-options-wrapper'),
    progressBar: document.querySelector('progress'),
    progressParagrah: document.getElementById('progress'),
    instAnsContainer: document.querySelector('.instant-answer-container'),
    instAnsText: document.getElementById('instant-answer-text'),
    instAnsDiv: document.getElementById('instant-answer-wrapper'),
    instAnsImg: document.getElementById('emotion'),
    nextQstBtn: document.getElementById('next-question-btn'),
    //LANDING PAGE ELEMENTS
    landingPageSection: document.querySelector('.landing-page-container'),
    startQuizBtn: document.getElementById('start-quiz-btn'),
    firstNameInput: document.getElementById('firstname'),
    lastNameInput: document.getElementById('lastname'),
    //FINAL RESULT SECTION
    finalResultSection: document.querySelector('.final-result-container'),
    finalScoreText: document.getElementById('final-score-text')
  };

  //it must be return to make public and accesible from other methods
  return {
    getDomItems: domItems,

    addInputsDynamically: function() {

      let addInput = function() {

        let inputHTML, counter;

        //options counter
        counter = document.querySelectorAll('.admin-option').length;

        inputHTML = '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' + counter + '" name="answer" value="' + counter + '"><input type="text" class="admin-option admin-option-' + counter + '" value=""></div>';

        domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHTML);

        //removing the event from the previous element
        domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus', addInput);

        //attaching the event to the new 'last' element
        domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
      };

      domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
    },

    createQuestionList: function(getQuestions) {

      let questionHTML;

      //clearing the question lists
      domItems.insertedQuestsWrapper.innerHTML = "";

      //populating the wrapper with the updated questions
      for(var i = 0; i < getQuestions.getQuestionCollection().length; i++){
        //creating the question in the ith iteration
        questionHTML = '<p><span>' + (parseInt(getQuestions.getQuestionCollection()[i].id) + 1) + '. ' + getQuestions.getQuestionCollection()[i].questionText + '</span><button id="question-' + getQuestions.getQuestionCollection()[i].id + '">Edit</button></p>';
        //updating the list
        domItems.insertedQuestsWrapper.insertAdjacentHTML('beforeend', questionHTML);
      }

    },

    //edit question list
    editQuestsList: function(event, storageQuestList, addInputsDynFn, updateQuestsListFn) {
      let getId, getStorageQuestList, foundItem, placeInArr, optionsHTML;

      if ('question-'.indexOf(event.target.id)) {
        //splitting the id from the string value
        getId = event.target.id.split('-')[1];

        //recovering the question list from the local storage
        getStorageQuestList = storageQuestList.getQuestionCollection();

        //looking for the question value
        for (var i = 0; i < getStorageQuestList.length; i++) {
          if (getStorageQuestList[i].id == getId) {
            foundItem = getStorageQuestList[i];
            placeInArr = i;
          }
        }

        //printing out the question value and its id
        //console.log(foundItem, placeInArr);
      }

      //gathering the question value for editing from the localstorage
      domItems.newQuestionText.value = foundItem.questionText;

      //selecting the options container
      domItems.adminOptionsContainer.innerHTML = '';

      optionsHTML = '';

      //populating the options
      for (var x = 0; x < foundItem.options.length; x++) {
      optionsHTML += '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' + x + '" name="answer" value="' + x + '"><input type="text" class="admin-option admin-option-' + x + '" value="' + foundItem.options[x] + '"></div>';
      }

      //showing the options on the UI
      domItems.adminOptionsContainer.innerHTML = optionsHTML;

      //adding inputs dynamically method
      addInputsDynFn();

      //showing update & delete buttons
      domItems.questionUpdateBtn.style.visibility = 'visible';
      domItems.questionDeleteBtn.style.visibility = 'visible';

      //hiding insert & clear buttons
      domItems.questInsertBtn.style.visibility = 'hidden';
      domItems.questsClearBtn.style.pointerEvents = 'none';

      //rendering backDefaultView
      let backDefaultView = function(optionEls) {
        //clearing up the interface when the updating process is done
        domItems.newQuestionText.value = '';

        //it's possible to use the i variable for this loop method due to the context
        for (var i = 0; i < optionEls.length; i++) {
          optionEls[i].value = '';
          optionEls[i].previousElementSibling.checked = false;
        }

        //hiding update & delete buttons
        domItems.questionUpdateBtn.style.visibility = 'hidden';
        domItems.questionDeleteBtn.style.visibility = 'hidden';

        //showing insert button
        domItems.questInsertBtn.style.visibility = 'visible';
        domItems.questsClearBtn.style.pointerEvents = '';

        //update questions list method
        updateQuestsListFn(storageQuestList);
      }

      //selecting possible answers to the question
      let optionEls = document.querySelectorAll('.admin-option'); //it must be declare 'globally' because of the scope

      //updating content function
      let updateQuestion = function() {

        //initialize vector for avoiding errors
        let newOptions = [];

        //updating the question text on the UI
        foundItem.questionText = domItems.newQuestionText.value;

        //cleaning previous correct answer
        foundItem.correctAnswer = '';

        //saving the options (possible answers) recovered from the UI on the vector
        for (var i = 0; i < optionEls.length; i++) {
          if (optionEls[i].value !== "") {
            newOptions.push(optionEls[i].value);
            if (optionEls[i].previousElementSibling.checked) {
                foundItem.correctAnswer = optionEls[i].value;
            }
          }
        }

        //setting the updated options to the question object -> foundItem
        foundItem.options = newOptions;

        if (foundItem.questionText !== "" && foundItem.options.length > 1 && foundItem.correctAnswer !== "") {

          //replacing the question on the web local storage
          getStorageQuestList.splice(placeInArr, 1, foundItem);
          //setting the new data on the local storage
          storageQuestList.setQuestionCollection(getStorageQuestList);

          //rendering the default view
          backDefaultView(optionEls);

        } else {
          alert('Please check if there is a question, possible answers (it means more than one) and the correct answer. Otherwise it will be an imcomplete Quiz.');
        }

      }

      //onclick event for updating the question
      domItems.questionUpdateBtn.onclick = updateQuestion;

      //deleting content function
      let deleteQuestion = function() {
        //deleting the question using its identifier
        getStorageQuestList.splice(placeInArr, 1);

        //updating the question collection on the local storage
        storageQuestList.setQuestionCollection(getStorageQuestList);

        //rendering the default view
        backDefaultView(optionEls);
      }

      //onclick event for deleting the question
      domItems.questionDeleteBtn.onclick = deleteQuestion;

    },

    clearQuestList: function(storageQuestList) {

      if (storageQuestList.getQuestionCollection() !== null) {
        if (storageQuestList.getQuestionCollection().length > 0) {
          let consent = confirm('warning the entire question list');
          if (consent) {
              //delete collection
              storageQuestList.removeQuestionCollection();

              //clearing the question lists
              domItems.insertedQuestsWrapper.innerHTML = "";
          }
        }
      }

    },

    displayQuestions: function(storageQuestList, progress) {
      let newOptionHTML, characterArr;

      //options letter array for the different options on each question
      characterArr = ['A', 'B', 'C', 'D', 'E', 'F'];

      if (storageQuestList.getQuestionCollection().length > 0) {

        //showing the question on the ith position on the quiz section
        domItems.askedQuestText.textContent = storageQuestList.getQuestionCollection()[progress.questionIndex].questionText;
        //clearing up the quiz Options Wrapper
        domItems.quizOptionsWrapper.innerHTML = '';

        for (var i = 0; i < storageQuestList.getQuestionCollection()[progress.questionIndex].options.length; i++) {

          //creating each option on each iteration
          newOptionHTML = '<div class="choice-' + i + '"><span class="choice-' + i + '">' + characterArr[i] + '</span><p  class="choice-' + i + '">' + storageQuestList.getQuestionCollection()[progress.questionIndex].options[i] + '</p></div>';
          //populating the quiz options wrapper with the actual options
          domItems.quizOptionsWrapper.insertAdjacentHTML('beforeend', newOptionHTML);

        }

      }

    },

    displayProgress: function(storageQuestList, progress) {
      domItems.progressBar.max = storageQuestList.getQuestionCollection().length;
      domItems.progressBar.value = progress.questionIndex + 1;
      domItems.progressParagrah.textContent = (domItems.progressBar.value) + ' / ' + domItems.progressBar.max;
    },

    answerDesign: function(ansResult, selectedAnswer) {
      let ansUIOptions, index;

      index = 0;

      //if the result is true, the index changes
      if (ansResult) {
        index = 1;
      }

      //possible feedback depending on the answers
      ansUIOptions = {
        instAnswerText: ['This is a wrong answer', 'This is a correct answer'],
        instAnswerClass: ['red', 'green'],
        instAnswerFace: ['images/sad.png','images/happy.png'],
        instAnsSpan: ['rgba(200, 0, 0, .7)', 'rgba(0, 250, 0, .2)']
      }

      //changing the UI style
      domItems.quizOptionsWrapper.style.cssText = 'opacity: 0.6; pointer-events: none;';
      domItems.instAnsContainer.style.opacity = '1';

      //selecting answer options depending upon the result
      domItems.instAnsText.textContent = ansUIOptions.instAnswerText[index];

      //showing the color depending on the user's answer
      domItems.instAnsDiv.className = ansUIOptions.instAnswerClass[index];

      //showing the face image depending on the user's answer
      domItems.instAnsImg.src = ansUIOptions.instAnswerFace[index];

      //choices background color depending upon the user's answer
      selectedAnswer.previousElementSibling.style.backgroundColor = ansUIOptions.instAnsSpan[index];
    },

    resetDesign: function() {
      domItems.quizOptionsWrapper.style.cssText = '';
      domItems.instAnsContainer.style.opacity = '0';
    },

    getFullName: function(currPersonData, storageQuestList, admin) {

      if (domItems.firstNameInput.value !== '' && domItems.lastNameInput.value !== '') {

        if (!(domItems.firstNameInput.value === admin[0] && domItems.lastNameInput.value === admin[1])) {
          currPersonData.fullname.push(domItems.firstNameInput.value);
          currPersonData.fullname.push(domItems.lastNameInput.value);
          domItems.landingPageSection.style.display = 'none';
          domItems.quizSection.style.display = 'block';
          console.log(currPersonData);
          console.log('Quiz has started');
        } else {
          domItems.landingPageSection.style.display = 'none';
          domItems.adminSection.style.display = 'block';
        }

      } else {
        alert('Please, enter your first name & your last name');
      }

    },

    finalResult: function(currPersonData) {

      domItems.finalScoreText.textContent = currPersonData.fullname[0] + ' ' + currPersonData.fullname[1] + ', your final score is ' + currPersonData.score;
      domItems.quizSection.style.display = 'none';
      domItems.finalResultSection.style.display = 'block';

    },

    addResultOnPanel: function(userData) {
      let resultHTML;

      domItems.resultsListWrapper.innerHTML = '';

      for (var i = 0; i < userData.getPersonData().length; i++) {
        resultHTML = '<p class="person person- ' + i + ' "><span class="person- ' + i + ' "> ' + userData.getPersonData()[i].firstname + ' ' + userData.getPersonData()[i].lastname + ' - ' + userData.getPersonData()[i].score + ' Points</span><button id="delete-result-btn_' + userData.getPersonData()[i].id + '" class="delete-result-btn">Delete</button></p>';
        domItems.resultsListWrapper.insertAdjacentHTML('afterbegin', resultHTML);
      }
    },

    deleteResult: function(event, userData) {
      let getId;
      if ('delete-result-btn_'.indexOf(event.target.id)) {
        getId = parseInt(event.target.id.split('_')[1]);
        console.log(getId);
      }
    }

  };

})();



//          CONTROLLER
//controller is the interface between
let controller = (function(quizCtrl, uiCtrl) {

  //getting the variables from the UI
  let selectedDomItems = uiCtrl.getDomItems;

  //invoking addInputsDynamically method from UI controller
  uiCtrl.addInputsDynamically();

  //invoking questionList method from UI controller
  uiCtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);

  //method called when the insert button is pressed on the UI
  selectedDomItems.questInsertBtn.addEventListener('click', function() {
    //selecting admin options again
    let adminOptions = document.querySelectorAll('.admin-option');
    let checkedAns = quizCtrl.addQuestionOnLocalStorage(selectedDomItems.newQuestionText, adminOptions);
    if (checkedAns) {
      uiCtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);
    }
  });

  //method called when editing button is pressed
  selectedDomItems.insertedQuestsWrapper.addEventListener('click', function(e) {
    uiCtrl.editQuestsList(e, quizCtrl.getQuestionLocalStorage, uiCtrl.addInputsDynamically, uiCtrl.createQuestionList);
  });

  //method called when the 'clear list' button is pressed
  selectedDomItems.questsClearBtn.addEventListener('click', function(){
    uiCtrl.clearQuestList(quizCtrl.getQuestionLocalStorage);
  });

  //display questions on the quiz section
  uiCtrl.displayQuestions(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

  //display questions on the quiz section
  uiCtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

  //selecting the right answer
  selectedDomItems.quizOptionsWrapper.addEventListener('click', function(e) {
    let updatedOptionsDiv = selectedDomItems.quizOptionsWrapper.querySelectorAll('div');

    for (var i = 0; i < updatedOptionsDiv.length; i++) {
      if (e.target.className === 'choice-' + i) {
        let answer = document.querySelector('.quiz-options-wrapper div p.' + e.target.className);
        let answerResult = quizCtrl.checkAnswer(answer);
        uiCtrl.answerDesign(answerResult, answer);
        if (quizCtrl.isFinished()) {
          selectedDomItems.nextQstBtn.textContent = 'Finish';
        }

        let nextQuestion = function(questData, progress){
          if (quizCtrl.isFinished()) {
            quizCtrl.addPerson();
            uiCtrl.finalResult(quizCtrl.getCurrPersonData);
            console.log('finished');
          } else {
            uiCtrl.resetDesign();
            quizCtrl.getQuizProgress.questionIndex++;
            uiCtrl.displayQuestions(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
            uiCtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
          }
        }

        selectedDomItems.nextQstBtn.onclick = function(){
          nextQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
        }
      }
    }

  });

  selectedDomItems.startQuizBtn.addEventListener('click', function(){
    uiCtrl.getFullName(quizCtrl.getCurrPersonData, quizCtrl.getQuestionCollection, quizCtrl.getAdminFullName);
  });

  selectedDomItems.lastNameInput.addEventListener('focus', function() {
    selectedDomItems.lastNameInput.addEventListener('keydown', function(e) {
      if (e.keycode === 36) {
        uiCtrl.getFullName(quizCtrl.getCurrPersonData, quizCtrl.getQuestionCollection, quizCtrl.getAdminFullName);
      }
    });
  });

  uiCtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);

  selectedDomItems.resultsListWrapper.addEventListener('click', function(e){
    uiCtrl.deleteResult(e, quizCtrl.getPersonLocalStorage);
  });

})(quizController, uiController);
