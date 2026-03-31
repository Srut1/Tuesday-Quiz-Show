// Created Feburary 25, 2026
// Javascript for ending game page

window.addEventListener("load", event => {
    const username = document.getElementById("username");
    const saveBtn = document.getElementById("saveScoreBtn");
    const finalScore = document.getElementById("finalScore");

    // Retrieve the score saved to localStorage when the game ended
    const mostRecentScore = localStorage.getItem("mostRecentScore");

    // Load existing high scores from localStorage, or start with empty array
    const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

    const maxHighScores = 5;
    finalScore.innerText = mostRecentScore; // display the score on screen

    // Enable the Save button only when the username field has text
    username.addEventListener("keyup", () => {
        saveBtn.disabled = !username.value;
    });

    // Play background music on the end screen
    const bgm = new Audio("../Sound/bgm.mp3");
    bgm.loop = true;
    bgm.volume = 0.5;
    bgm.play();


    // Saves the player's score and name to localStorage, keeps only top 5, then redirects
    window.saveHighScore = e => {
        e.preventDefault(); //prefents form from posting to different page

        const score = {
            score: mostRecentScore,
            name: username.value,
        };
        highScores.push(score);

        // Sort highest score to lowest
        highScores.sort((a, b) => {
            return b.score - a.score;
        })

        highScores.splice(5); // removes everything below top 5
        localStorage.setItem("highScores", JSON.stringify(highScores));
        window.location.assign("highscore.html");
    }
})
