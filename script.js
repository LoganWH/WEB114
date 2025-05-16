// ====== Global Variables ======
let timer;
let timeLeft = 10;
let currentQuestion = 0;
let score = 0;
let answered = false;

const questions = [
    {
        question: "What does ** do in JavaScript?",
        choices: ["Modulo", "Exponentiation", "Division", "Comparison"],
        answer: "Exponentiation"
    },
    {
        question: "What is the result of: 10 % 3?",
        choices: ["3", "0", "1", "10"],
        answer: "1"
    },
    {
        question: "Which operator adds two values in JavaScript?",
        choices: ["++", "+", "add()", "="],
        answer: "+"
    }
];

// ====== DOM Elements ======
const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const feedbackEl = document.getElementById("feedback");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const nextBtn = document.getElementById("next-btn");

// ====== Load Question ======
function loadQuestion() {
    const q = questions[currentQuestion];
    answered = false;
    typeOut(q.question, questionEl);
    resetChoices();

    timeLeft = 10;
    updateTimer();
    startTimer();

    q.choices.forEach(choice => {
        const btn = document.createElement("button");
        btn.textContent = choice;
        btn.onclick = () => {
            if (!answered) {
                stopTimer();
                checkAnswer(choice);
            }
        };
        choicesEl.appendChild(btn);
    });

    nextBtn.disabled = true;
}

// ====== Reset Choices ======
function resetChoices() {
    choicesEl.innerHTML = "";
    feedbackEl.textContent = "";
}

// ====== Check Answer ======
function checkAnswer(choice) {
    answered = true;
    const correct = questions[currentQuestion].answer;

    if (choice === correct) {
        feedbackEl.textContent = "✅ Correct!";
        score += 10;
    } else {
        feedbackEl.textContent = `❌ Wrong! The correct answer was "${correct}".`;
        score -= 5;
    }

    // Color feedback on choices
    Array.from(choicesEl.children).forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correct) {
            btn.style.backgroundColor = "green";
        } else if (btn.textContent === choice) {
            btn.style.backgroundColor = "red";
        }
    });

    // Score update & animation
    scoreEl.textContent = score;
    scoreEl.classList.add("pop");
    setTimeout(() => scoreEl.classList.remove("pop"), 300);

    nextBtn.disabled = false;
}

// ====== Handle Timeout ======
function handleTimeout() {
    if (answered) return;
    answered = true;

    const correct = questions[currentQuestion].answer;
    feedbackEl.textContent = `⏱️ Time's up! The correct answer was "${correct}".`;
    score -= 5;
    scoreEl.textContent = score;

    Array.from(choicesEl.children).forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correct) {
            btn.style.backgroundColor = "green";
        }
    });

    nextBtn.disabled = false;
}

// ====== Timer Functions ======
function updateTimer() {
    timerEl.textContent = timeLeft;
    timerEl.style.color = timeLeft <= 5 ? "red" : "white";
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            stopTimer();
            handleTimeout();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

// ====== Typing Effect ======
function typeOut(text, element, speed = 30, callback) {
    let i = 0;
    element.textContent = "";
    const interval = setInterval(() => {
        element.textContent += text.charAt(i);
        i++;
        if (i >= text.length) {
            clearInterval(interval);
            if (callback) callback();
        }
    }, speed);
}

// ====== Event Listeners ======
nextBtn.addEventListener("click", () => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        stopTimer();
        questionEl.textContent = "🎉 You've completed the JavaScript Quest!";
        choicesEl.innerHTML = "";
        feedbackEl.textContent = `Final Score: ${score}`;
        nextBtn.disabled = true;
    }
});

// ====== Start Game ======
loadQuestion();
