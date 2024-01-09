"use strict";

class App {
  constructor() {
    this.questionHolder = document.querySelector("#question");
    this.optionElements = [
      document.querySelector("#option1"),
      document.querySelector("#option2"),
      document.querySelector("#option3"),
      document.querySelector("#option4"),
    ];
    this.noOfQuestions = 2;
    this.answerContainer = document.querySelector("#answerContainer");

    this.resultContainer = document.querySelector("#resultContainer");

    this.questionNumber = document.querySelector("#questionNumber")

    this.startQuizBtn = document.querySelector("#startBtn");

    this.catergoryMessage = document.querySelector("#catergory")

    this.timerContainer = document.querySelector("#timerContainer")

    this.questionContainer = document.querySelector("#questionContainer")

    this.card = document.querySelector("#card")


    this.team1Score = document.querySelector("#team1Score");
    this.team2Score = document.querySelector("#team2Score");
    this.team1QuestionCounter =1
    this.team2QuestionCounter =1

    this.titleContainer = document.querySelector("#titleContainer")

    this.resultMessageContainer = document.querySelector("#resultMessageContainer")

    // Bind methods to the instance
    this.optionSelected = this.optionSelected.bind(this);
    this.startQuiz = this.startQuiz.bind(this);

    const options = document.querySelectorAll(".option");
    options.forEach((option) => {
      option.addEventListener("click", this.optionSelected);
    });
    this.startQuizBtn.addEventListener("click", this.startQuiz);

    this.team1Points = 0;
    this.team2Points = 0;
    this.questionCounter = 0;
    this.activeTeam = "team1";
    this.gameState = true;
    this.noOfRounds = 7;
    this.category = "food_and_drink"
    this.timerCount = 60

    this.roundCounter = 0;
    this.categoryIndex = 0;
    this.categories = [
      "sport_and_leisure",
      "film_and_tV",
      "arts_and_literature",
      "history",
      "society_and_culture ",
      "geography",
      "general_knowledge",
    ];

  }

  startQuiz() {
    this.titleContainer.style.display ="none"
    this.startQuizBtn.style.display ="none"
    this.getQuestions();
    this.card.style.display ="block"
  }

  async getQuestions() {

    this.questionHolder.style.display ="block"
    this.questionContainer.style.display = "block"

    try {
      const response = await fetch(
        `https://the-trivia-api.com/api/questions?categories=${this.category}&difficulty=medium`
      );

      const questionData = await response.json();
      const question = questionData[0].question;

      this.incorrectAnswers = [
        questionData[0].incorrectAnswers[0],
        questionData[0].incorrectAnswers[1],
        questionData[0].incorrectAnswers[2],
      ];

      this.correctAnswer = questionData[0].correctAnswer;
      console.log(questionData);

      this.displayQuestion(question);
      // this.displayOptions(incorrectAnswers);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
    this.questionContainer.style.display = "block";
    this.card.style.display ="block"

  }

  displayQuestion(question) {

    const catergoryDisplay = this.category.replace(/_/g, " ") // Replace underscores with spaces
    .toLowerCase() // Convert the whole string to lowercase
    .replace(/(^\w|\s\w)/g, match => match.toUpperCase()).replace(/\bAnd\b/g, 'and');



    this.catergoryMessage.textContent = catergoryDisplay

    this.questionNumber.style.display = "block";
    this.questionHolder.textContent = question;
    if (this.activeTeam === "team1") {
      this.questionNumber.textContent = `Team 1 - Question: ${this.team1QuestionCounter}`;
      this.team1QuestionCounter++;
    } else {
      this.questionNumber.textContent = `Team 2 - Question: ${this.team2QuestionCounter}`;
      this.team2QuestionCounter++;
    }

    this.timer()
    this.displayOptions()
  }

  nextQuestionMessage(){
    this.timerContainer.innerHTML = "";
    
  }

  
 // Function to handle the timer for each question
 timer() {
  this.timerCount = 60
  this.intervalMessage()
  this.questionInterval = setInterval(() => {
    this.intervalMessage();
    if (this.timerCount === 0) {
      this.cancelIntervalTimer()

    }
    this.timerCount--;
  }, 1000);
}
 // Function to display interval messages during the timer countdown
 intervalMessage() {
  this.timerContainer.innerHTML = "";
  const html = `<h1>Time Left: ${this.timerCount}</h1>`;
  this.timerContainer.insertAdjacentHTML("afterbegin", html);
}

// Function to cancel the interval timer for each question
cancelIntervalTimer() {
  
  this.activeTeam = this.activeTeam === "team1" ? "team2" : "team1";
  clearInterval(this.questionInterval);
  this.questionCounter++;
  this.checkCount();
  this.card.style.display ="none"
  setTimeout(() => {
    this.loadNextQuestion();
  }, 1500); // Move to the next question once the timer reaches zero
}


  displayOptions() {

    this.answerContainer.style.display = "block";

    this.optionElements.forEach((optionElement) => {
      optionElement.textContent = "";
    });

    const randomIndex = Math.floor(Math.random() * 4);
    this.optionElements[randomIndex].textContent = this.correctAnswer;

    const remainingOptions = this.optionElements.filter(
      (element, index) => index !== randomIndex
    );

    remainingOptions.forEach((optionElement, index) => {
      optionElement.textContent = this.incorrectAnswers[index];
    });
  }

  optionSelected(event) {
    this.timerContainer.innerHTML = "";
    this.catergoryMessage.textContent =""
    this.questionNumber.textContent =""
    this.answerContainer.style.display = "none"
    this.questionHolder.style.display ="none"
    this.questionContainer.style.display = "none"
    this.card.style.display ="none"
 
    
    const selectedButton = event.target;
    const answer = selectedButton.textContent;

    if (answer === this.correctAnswer) {
      this.handleCorrectAnswer();
    } else {
      this.handleIncorrectAnswer();
    }

    this.activeTeam = this.activeTeam === "team1" ? "team2" : "team1";
    this.checkCount()
    this.questionCounter++;
    clearInterval(this.questionInterval);
    setTimeout(() => {
      this.loadNextQuestion();
    }, 1000);
  }

  handleCorrectAnswer() {
    this[this.activeTeam + "Points"]++;
  }


  loadNextQuestion() {
    console.log(this.questionCounter);
    this.displayScore(); // Update and display scores before loading the next question
    this.checkCount();
    this.timerContainer.innerHTML = "";


    if (this.gameState === true) {
      setTimeout(() => {
        this.getQuestions();
      }, 1000);
    }
  }

  checkCount() {
    if (this.questionCounter === this.noOfQuestions) {
      this.roundCounter++;
      this.questionCounter = 0; // Reset question counter for the next round
  
      if (this.roundCounter < this.noOfRounds) {
        // Increment category index for the next round  
        this.category = this.categories[this.roundCounter];
      } else {
        console.log("gameOver");
        this.gameState = false;
        this.displayFinalResults()

      }
    }
  }
  displayScore() {
    this.team1Score.textContent = `Team 1 Points: ${this.team1Points}`;
    this.team2Score.textContent = `Team 2 Points: ${this.team2Points}`;
  }

  displayFinalResults() {
    this.card.style.display ="block"
    this.resultMessageContainer.style.display = "block";
  
    if (this.team1Points > this.team2Points) {
      console.log("Team 1 wins");
      this.winningTeam = "Team 1 👑";
    } else if (this.team1Points < this.team2Points) {
      console.log("Team 2 wins");
      this.winningTeam = "Team 2 👑";
    } else {
      console.log("Draw!");
      this.winningTeam = "Neither! It was a draw";
    }
  
    this.questionNumber.style.display = "none";
    this.timerContainer.innerHTML = "";
    this.answerContainer.style.display = "none";
    this.catergoryMessage.style.display = "none"

    setTimeout(() => {
      this.displayOverallWinner();
    }, 3000);
  

  
  }

  displayOverallWinner(){
    const html = `<h1 id="resultMessageWinner">${this.winningTeam}!</h1>`;
    this.resultMessageContainer.innerHTML = html;

    this.resultContainer.style.display = "block"
  }
  
}

const app = new App();