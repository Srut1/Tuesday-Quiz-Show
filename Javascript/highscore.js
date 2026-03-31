// Created Feburary 25, 2026
// Javascript for displaying scores 

window.addEventListener("load", event => {
    // Retrieve high scores from localStorage, or use empty array if none exist
    const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
    const highScoresList = document.getElementById("highScoresList");

    // Play background music on the high scores screen
    const bgm = new Audio("../Sound/bgm.mp3");
    bgm.loop = true;
    bgm.volume = 0.5;
    bgm.play();


    // Build the list by mapping each score entry to an <li> element and joining them
    highScoresList.innerHTML =
        highScores.map(score => {
            return `<li class="high-score"> ${score.name} - ${score.score}</li>`;
        }).join("");
})
