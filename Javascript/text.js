// Created Feburary 25, 2026
// Javascript for main game page

window.addEventListener("load", event => {

    const question = document.getElementById("question");
    const choices = Array.from(document.getElementsByClassName("choice-text"));

    let currentQuestion = {};
    let acceptAnswers = false;
    let score = 0;
    let stageCounter = 0;
    let currentStage = 0;
    let avalaibleQuestions = [];
    let timerInterval = null;
    let timeLeft = 0;

    // All trivia questions organized by difficulty
    const questionsByDifficulty = {
        easy: [
            {
                question: "Among the following, which is not a component of the human body?",
                choice1: "Water", choice2: "Earth", choice3: "Oil", choice4: "Iron",
                answer: 2
            },
            {
                question: "Every how many years does a leap year occur?",
                choice1: "4", choice2: "7", choice3: "3", choice4: "9",
                answer: 1
            },
            {
                question: "What are the 3 primary colours?",
                choice1: "Orange, Green, Purple", choice2: "Red, Yellow, Blue",
                choice3: "Magenta, Cyan, Yellow", choice4: "Red, Green, Blue",
                answer: 2
            },
            {
                question: "Which among these species has the longest lifespan?",
                choice1: "Cat", choice2: "Human", choice3: "Frog", choice4: "Llama",
                answer: 2
            },
        ],
        medium: [
            {
                question: "How many legs does a lobster have?",
                choice1: "6", choice2: "8", choice3: "10", choice4: "12",
                answer: 3
            },
            {
                question: "What percentage of blood loss causes death in humans?",
                choice1: "40%", choice2: "45%", choice3: "50%", choice4: "55%",
                answer: 1
            },
            {
                question: "What is the powerhouse of the cell?",
                choice1: "Chloroplast", choice2: "Nucleus", choice3: "Cytoplasm", choice4: "Mitochondria",
                answer: 4
            },
            {
                question: "Leonardo da Vinci's “Mona Lisa” hangs in what museum?",
                choice1: "Royal Ontario Museum", choice2: "National Palace Museum", choice3: "Louvre", choice4: "Tate Madern",
                answer: 3
            },
        ],
        hard: [
            {
                question: "Which among these characters was transformed into a Laurel tree while escaping the god Apollo?",
                choice1: "Daphne", choice2: "Hyacinthus", choice3: "Medea", choice4: "Kyrene",
                answer: 1
            },
            {
                question: "How many keys does a piano have?",
                choice1: "64", choice2: "76", choice3: "80", choice4: "88",
                answer: 4
            },
            {
                question: "What pioneering English woman is considered the founder of modern nursing?",
                choice1: "Clara Barton", choice2: "Jessica Peck", choice3: "Florence Nightingale", choice4: "Mary Seacole",
                answer: 3
            },
            {
                question: "What is the Pillsbury Doughboy's real name?",
                choice1: "Poppin' Fresh", choice2: "Gidget", choice3: "Twinkie the Kid", choice4: "Sonny",
                answer: 1
            },
        ]
    };

    const stages = ["easy", "medium", "hard"]; //difficulty order
    const questionsPerStage = 4;
    const bonusByStage = { easy: 25, medium: 50, hard: 100 };
    const timeByStage = { easy: 15, medium: 10, hard: 7 };


    // Resets all game state and begins from the easy stage
    const startGame = () => {
        currentStage = 0;
        stageCounter = 0;
        score = 0;
        loadStage();
    };

    const loadStage = () => {
        const stage = stages[currentStage];
        avalaibleQuestions = [...questionsByDifficulty[stage]];
        stageCounter = 0;

        question.innerText = `Stage: ${stage.toUpperCase()}`;
        setTimeout(() => {
            getNewQuestion();
        }, 1000);
    };

    // Bar shrinks and changes colour as time runs out — game over if it hits 0
    const startTimer = (seconds) => {
        clearInterval(timerInterval); // clear any existing timer
        timeLeft = seconds;

        const timerBar = document.getElementById("timer-bar");
        timerBar.style.width = "100%";
        timerBar.style.backgroundColor = "darkgreen";

        timerInterval = setInterval(() => {
            timeLeft--;

            // update bar width as percentage
            timerBar.style.width = `${(timeLeft / seconds) * 100}%`;

            // turn yellow when under half, red when under 25%
            if (timeLeft <= seconds * 0.25) {
                timerBar.style.backgroundColor = "darkred";
            } else if (timeLeft <= seconds * 0.5) {
                timerBar.style.backgroundColor = "goldenrod";
            }

            // time ran out — game over
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                acceptAnswers = false;
                const container = document.querySelector(".container");
                container.style.backgroundImage = "url('../Images/fire1.gif')";
                container.style.backgroundSize = "cover";
                container.style.backgroundRepeat = "no-repeat";

                // hide the choices and hud
                document.getElementById("game").style.display = "none";
                document.getElementById("hud").style.display = "none";

                // show game over text on top
                const gameOver = document.createElement("div");
                gameOver.id = "gameOverScreen";
                gameOver.innerHTML = "TIME'S UP!";
                container.appendChild(gameOver);
                setTimeout(() => {
                    localStorage.setItem("mostRecentScore", score);
                    window.location.assign("end.html");
                }, 2000);
            }
        }, 1000);
    };

    const stopTimer = () => {
        clearInterval(timerInterval);
    };


    const getNewQuestion = () => {
        if (stageCounter >= questionsPerStage) {
            currentStage++;

            if (currentStage >= stages.length) {
                stopTimer();
                localStorage.setItem("mostRecentScore", score);
                return window.location.assign("end.html");
            }
            //move on to next difficulty
            loadStage();
            return;
        }

        // Pick a random question from the remaining available questions
        const questionIndex = Math.floor(Math.random() * avalaibleQuestions.length);
        currentQuestion = avalaibleQuestions[questionIndex];
        question.innerText = currentQuestion.question;

        choices.forEach(choice => {
            const number = choice.dataset["number"];
            choice.innerText = currentQuestion["choice" + number];
        });

        avalaibleQuestions.splice(questionIndex, 1);
        stageCounter++;
        acceptAnswers = true;
        startTimer(timeByStage[stages[currentStage]]);
    };

    // Sound effects for correct and wrong answers
    const right = new Audio("../Sound/correct.wav");
    const wrong = new Audio("../Sound/wrong.wav");

    // Click handler for all four answer choices
    choices.forEach(choice => {
        choice.addEventListener("click", e => {
            if (!acceptAnswers) return;
            acceptAnswers = false;
            stopTimer();

            const selectedChoice = e.target;
            const selectedAnswer = selectedChoice.dataset["number"];
            const isCorrect = parseInt(selectedAnswer) === currentQuestion.answer;

            if (isCorrect) {
                right.currentTime = 0;
                right.play();
                updateScore(bonusByStage[stages[currentStage]]);
                selectedChoice.parentElement.classList.add("correct");
                setTimeout(() => {
                    selectedChoice.parentElement.classList.remove("correct");
                    getNewQuestion();
                }, 1000);
            } else {
                wrong.currentTime = 0;
                wrong.play();
                selectedChoice.parentElement.classList.add("incorrect");
                setTimeout(() => {
                    const container = document.querySelector(".container");
                    container.style.backgroundImage = "url('../Images/fire1.gif')";
                    container.style.backgroundSize = "cover";
                    container.style.backgroundRepeat = "no-repeat";

                    // hide the choices and hud
                    document.getElementById("game").style.display = "none";
                    document.getElementById("hud").style.display = "none";

                    // show game over text on top
                    const gameOver = document.createElement("div");
                    gameOver.id = "gameOverScreen";
                    gameOver.innerHTML = "WRONG ANSWER!";
                    container.appendChild(gameOver);
                    setTimeout(() => {
                        localStorage.setItem("mostRecentScore", score);
                        window.location.assign("end.html");
                    }, 2000);
                }, 1000);
            }
        });
    });

    // Adds points to score and updates the score display on screen
    const updateScore = num => {
        score += num;
        document.getElementById("score").innerText = score;
    };

    startGame();
});
