// Created Feburary 25, 2026
// Javascript for beginning dialoge and splash page

// ---- TEXT MESSAGE ----
class TextMessage {
    constructor({ text, onComplete }) {
        this.text = text;
        this.onComplete = onComplete;
        this.element = null;
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("TextMessage");
        this.element.innerHTML = (`
                <p class="textButtonP"></p>
                <button class="textButton"> Next </button>
            `);

        this.RevealingText = new RevealingText({
            element: this.element.querySelector(".textButtonP"),
            text: this.text
        });

        this.element.querySelector("button").addEventListener("click", () => {
            this.done();
        });
    }

    done() {
        if (this.RevealingText.isDone) {
            this.element.remove();
            this.onComplete();
        } else {
            this.RevealingText.skipToDone();
        }
    }

    initial(container) {
        this.createElement();
        container.appendChild(this.element);
        this.RevealingText.initial();
    }
}

// ---- REVEALING TEXT ----
class RevealingText {
    constructor(config) {
        this.element = config.element;
        this.text = config.text;
        this.speed = config.speed || 20;
        this.timeout = null;
        this.isDone = false;
    }

    revealOneChar(list) {
        const next = list.splice(0, 1)[0];
        next.span.classList.add("revealed");
        if (list.length > 0) {
            this.timeout = setTimeout(() => {
                this.revealOneChar(list);
            }, next.delayAfter);
        } else {
            this.isDone = true;
        }
    }

    skipToDone() {
        clearTimeout(this.timeout);
        this.isDone = true;
        this.element.querySelectorAll("span").forEach(s => {
            s.classList.add("revealed");
        });
    }

    initial() {
        let characters = [];
        this.text.split("").forEach(character => {
            let span = document.createElement("span");
            span.textContent = character;
            this.element.appendChild(span);
            characters.push({
                span,
                delayAfter: character === " " ? 0 : this.speed
            });
        });
        this.revealOneChar(characters);
    }
}


window.addEventListener("load", event => {

    const c = document.getElementById("gameCanvas");
    const ctx = c.getContext("2d");

    //SPLASH PAGE ANIMATION
    function splash() {
        const imageSources = [
            "Images/SplashPage/1.png",
            "Images/SplashPage/2.png",
            "Images/SplashPage/3.png",
            "Images/SplashPage/4.png",
            "Images/SplashPage/5.png",
            "Images/SplashPage/6.png"
        ];

        const images = [];
        let loadedCount = 0;
        let currentFrame = 0;
        let animationInterval = null;

        imageSources.forEach((src, index) => {
            images[index] = new Image();
            images[index].onload = () => {
                loadedCount++;
                if (loadedCount === imageSources.length) {
                    startAnimation();
                }
            };
            images[index].src = src;
        });

        function startAnimation() {
            animationInterval = setInterval(() => {
                ctx.clearRect(0, 0, c.width, c.height);
                ctx.drawImage(images[currentFrame], 0, 0, c.width, c.height);
                currentFrame = (currentFrame + 1) % images.length;
            }, 500);
        }

        // Return a way to stop the animation later
        return function stop() {
            clearInterval(animationInterval);
        }
    }

    const stopSplash = splash();

    function showDialogue(text, onComplete) {
        const box = document.getElementById("dialogueBox");
        const message = new TextMessage({
            text: text,
            onComplete: () => {
                box.style.display = "none"; // hide when done
                if (onComplete) onComplete();
            }
        });
        box.style.display = "block"; // show the box
        message.initial(box);
    }

        //Help button
    const helpText = document.getElementById("help-text");
    const helpButton = document.getElementById("helpButton");

    helpButton.addEventListener("click", () => {
        if (helpText.style.display === "none") {
            helpText.style.display = "block";
            helpButton.value = "Close";
        } else {
            helpText.style.display = "none";
            helpButton.value = "Help";
        }
    });


    //---- START BUTTON ----
    const startButton = document.getElementById("startButton");
    startButton.addEventListener("click", () => {
        const bgm = document.getElementById("bgm");

        document.addEventListener("click", () => {
            bgm.play();
        }, { once: true });
        stopSplash(); // stop the splash animation
        startButton.remove();
        helpButton.remove();
        const showBackground = new Image();
        showBackground.src = "Images/showbg.jpg";
        const host = new Image();
        host.src = "Images/host.png";
        // wait for both images to load before drawing
        let loadedCount = 0;

        function onImageLoad() {
            loadedCount++;
            if (loadedCount === 2) {
                ctx.clearRect(0, 0, c.width, c.height);
                ctx.drawImage(showBackground, 0, 0, c.width, c.height); // draw first (bottom)
                ctx.drawImage(host, 0, 0, c.width, c.height);           // draw second (on top)
            }
        }

        showBackground.onload = onImageLoad;
        host.onload = onImageLoad;
        // chain dialogues — each starts only when previous is complete
        showDialogue("Good evening, viewers! The joy of Tuesday, the heat of Tuesday.", () => {
            showDialogue("You are now watching! The 'Tuesday Quiz Show!'", () => {
                showDialogue("Have you all been waiting for Tuesday? So have I! After all, it's the only day we get to see our lovely new quiz show contestants!", () => {
                    showDialogue("Incredibly... for the past several weeks, there hasn't been a single contestant who got an answer wrong! It's unbelieveable, truly...", () => {
                        showDialogue("Will the contestants get the answers right this time as well?", () => {
                            // all dialogues done — go to trivia page
                            window.location.assign("Pages/trivia.html");
                        });
                    });
                });
            });
        });


    });

});
