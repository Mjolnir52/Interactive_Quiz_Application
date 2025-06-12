document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultScreen = document.getElementById('result-screen');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options-container');
    const questionNumberElement = document.getElementById('question-number');
    const totalQuestionsElement = document.getElementById('total-questions');
    const currentScoreElement = document.getElementById('current-score');
    const finalScoreElement = document.getElementById('final-score');
    const maxScoreElement = document.getElementById('max-score');
    const resultMessageElement = document.getElementById('result-message');
    const timerElement = document.getElementById('time');

    // Quiz questions - 10 web development focused questions
    const quizQuestions = [
        {
            question: "What does HTML stand for?",
            options: [
                "Hyper Text Markup Language",
                "High Tech Modern Language",
                "Hyperlinks and Text Markup Language",
                "Home Tool Markup Language"
            ],
            answer: "Hyper Text Markup Language",
            points: 1
        },
        {
            question: "Which CSS property is used to change the text color of an element?",
            options: [
                "text-color",
                "font-color",
                "color",
                "text-style"
            ],
            answer: "color",
            points: 1
        },
        {
            question: "Which of the following is NOT a JavaScript data type?",
            options: [
                "String",
                "Boolean",
                "Number",
                "Element"
            ],
            answer: "Element",
            points: 1
        },
        {
            question: "What does the 'C' stand for in CSS?",
            options: [
                "Computer",
                "Cascading",
                "Creative",
                "Colorful"
            ],
            answer: "Cascading",
            points: 1
        },
        {
            question: "Which HTML tag is used to link an external JavaScript file?",
            options: [
                "<script>",
                "<javascript>",
                "<js>",
                "<link>"
            ],
            answer: "<script>",
            points: 2
        },
        {
            question: "What is the purpose of media queries in CSS?",
            options: [
                "To apply styles based on device characteristics",
                "To play audio and video files",
                "To query a database",
                "To create animations"
            ],
            answer: "To apply styles based on device characteristics",
            points: 2
        },
        {
            question: "Which method is used to add an element to the end of an array in JavaScript?",
            options: [
                "array.push()",
                "array.pop()",
                "array.shift()",
                "array.unshift()"
            ],
            answer: "array.push()",
            points: 2
        },
        {
            question: "What does API stand for?",
            options: [
                "Application Programming Interface",
                "Automated Programming Interface",
                "Advanced Programming Instruction",
                "Application Process Integration"
            ],
            answer: "Application Programming Interface",
            points: 1
        },
        {
            question: "Which HTML5 element is used to draw graphics on a web page?",
            options: [
                "<graphic>",
                "<canvas>",
                "<draw>",
                "<svg>"
            ],
            answer: "<canvas>",
            points: 2
        },
        {
            question: "What is the purpose of the 'alt' attribute in an <img> tag?",
            options: [
                "To provide alternative text for screen readers",
                "To specify the image alignment",
                "To add a caption below the image",
                "To link to a higher resolution version"
            ],
            answer: "To provide alternative text for screen readers",
            points: 1
        }
    ];

    // Quiz state
    let currentQuestionIndex = 0;
    let score = 0;
    let timer;
    let timeLeft = 30;
    let userAnswers = new Array(quizQuestions.length).fill(null);
    let quizCompleted = false;

    // Initialize the quiz
    function initQuiz() {
        totalQuestionsElement.textContent = quizQuestions.length;
        updateQuestionCounter();
        showQuestion();
        startTimer();
    }

    // Show current question
    function showQuestion() {
        const currentQuestion = quizQuestions[currentQuestionIndex];
        questionElement.textContent = currentQuestion.question;
        optionsContainer.innerHTML = '';

        currentQuestion.options.forEach((option, index) => {
            const optionButton = document.createElement('button');
            optionButton.classList.add('option-btn');
            optionButton.textContent = option;
            
            // Highlight selected answer
            if (userAnswers[currentQuestionIndex] === option) {
                optionButton.classList.add('selected');
            }
            
            optionButton.addEventListener('click', () => selectOption(option));
            optionsContainer.appendChild(optionButton);
        });

        // Update navigation buttons
        prevBtn.disabled = currentQuestionIndex === 0;
        nextBtn.disabled = false;
        
        // Show submit button on last question
        if (currentQuestionIndex === quizQuestions.length - 1) {
            nextBtn.classList.add('hidden');
            submitBtn.classList.remove('hidden');
        } else {
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
        }
    }

    // Select an option
    function selectOption(selectedOption) {
        // Remove selected class from all options
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Add selected class to clicked option
        event.target.classList.add('selected');
        
        // Store user's answer
        userAnswers[currentQuestionIndex] = selectedOption;
    }

    // Move to next question
    function nextQuestion() {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            currentQuestionIndex++;
            updateQuestionCounter();
            resetTimer();
            showQuestion();
        }
    }

    // Move to previous question
    function prevQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            updateQuestionCounter();
            resetTimer();
            showQuestion();
        }
    }

    // Update question counter
    function updateQuestionCounter() {
        questionNumberElement.textContent = currentQuestionIndex + 1;
    }

    // Start the quiz
    function startQuiz() {
        startScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');
        initQuiz();
    }

    // Submit the quiz
    function submitQuiz() {
        clearInterval(timer);
        quizCompleted = true;
        calculateScore();
        showResults();
    }

    // Calculate final score
    function calculateScore() {
        score = 0;
        quizQuestions.forEach((question, index) => {
            if (userAnswers[index] === question.answer) {
                score += question.points;
            }
        });
    }

    // Show results
    function showResults() {
        quizScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
        
        const maxScore = quizQuestions.reduce((total, question) => total + question.points, 0);
        finalScoreElement.textContent = score;
        maxScoreElement.textContent = maxScore;
        
        // Set result message based on score
        const percentage = (score / maxScore) * 100;
        if (percentage >= 80) {
            resultMessageElement.textContent = "Excellent work! You're a web development expert!";
        } else if (percentage >= 50) {
            resultMessageElement.textContent = "Good job! You have solid web development knowledge!";
        } else {
            resultMessageElement.textContent = "Keep practicing to improve your web development skills!";
        }
        
        // Render score chart
        renderScoreChart(score, maxScore - score);
    }

    // Render score chart
    function renderScoreChart(correct, incorrect) {
        const ctx = document.getElementById('score-chart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Correct Answers', 'Incorrect Answers'],
                datasets: [{
                    data: [correct, incorrect],
                    backgroundColor: ['#2ecc71', '#e74c3c'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Timer functions
    function startTimer() {
        timeLeft = 30;
        updateTimerDisplay();
        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                if (!quizCompleted) {
                    if (currentQuestionIndex < quizQuestions.length - 1) {
                        nextQuestion();
                    } else {
                        submitQuiz();
                    }
                }
            }
        }, 1000);
    }

    function resetTimer() {
        clearInterval(timer);
        startTimer();
    }

    function updateTimerDisplay() {
        timerElement.textContent = timeLeft;
        
        // Change color when time is running low
        if (timeLeft <= 10) {
            timerElement.style.color = '#e74c3c';
        } else {
            timerElement.style.color = '#2c3e50';
        }
    }

    // Restart the quiz
    function restartQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        userAnswers = new Array(quizQuestions.length).fill(null);
        quizCompleted = false;
        
        resultScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
        
        // Clear chart
        document.getElementById('score-chart').remove();
        const canvas = document.createElement('canvas');
        canvas.id = 'score-chart';
        canvas.width = 300;
        canvas.height = 300;
        document.querySelector('.result-details').appendChild(canvas);
    }

    // Event listeners
    startBtn.addEventListener('click', startQuiz);
    restartBtn.addEventListener('click', restartQuiz);
    prevBtn.addEventListener('click', prevQuestion);
    nextBtn.addEventListener('click', nextQuestion);
    submitBtn.addEventListener('click', submitQuiz);
});