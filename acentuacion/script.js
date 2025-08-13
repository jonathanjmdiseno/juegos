/**
 * Elimina los acentos y diacríticos de una cadena de texto.
 * Utiliza la normalización Unicode para separar el carácter base de su diacrítico
 * y luego elimina los diacríticos.
 * @param {string} str La cadena de texto a limpiar.
 * @returns {string} La cadena de texto sin acentos.
 */
function removeAccents(str) {
    // Normaliza la cadena a su forma de descomposición canónica (NFD)
    // para separar los caracteres base de sus diacríticos.
    // Luego, reemplaza los caracteres diacríticos (rango Unicode \u0300-\u036f) con una cadena vacía.
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Compara dos cadenas de texto ignorando los acentos y la distinción entre mayúsculas y minúsculas.
 * Utiliza localeCompare con opciones específicas para el español.
 * @param {string} str1 La primera cadena a comparar.
 * @param {string} str2 La segunda cadena a comparar.
 * @returns {boolean} True si las cadenas son equivalentes ignorando acentos y caso, false en caso contrario.
 */
function compareStringsAccentInsensitive(str1, str2) {
    // 'es' especifica el locale español.
    // 'sensitivity: 'base'' ignora diferencias de acentos y mayúsculas/minúsculas.
    return str1.localeCompare(str2, 'es', { sensitivity: 'base' }) === 0;
}

/**
 * Valida la acentuación de una palabra ingresada por el usuario contra una respuesta correcta.
 * Proporciona retroalimentación detallada en función del tipo de error.
 * @param {string} userInput La palabra ingresada por el estudiante.
 * @param {string} correctAnswer La palabra correcta con su acentuación.
 * @returns {{correct: boolean, feedback: string}} Un objeto con el estado de corrección y el mensaje de retroalimentación.
 */
function validateAccentuation(userInput, correctAnswer) {
    // 1. Coincidencia exacta estricta (incluyendo acentos)
    if (userInput === correctAnswer) {
        return { correct: true, feedback: "¡Perfecto! La acentuación es impecable." };
    }

    // 2. Coincidencia insensible a los acentos (palabra base correcta, pero tilde incorrecta/ausente)
    // Se eliminan los acentos de ambas cadenas para comparar solo la base de la palabra.
    if (removeAccents(userInput) === removeAccents(correctAnswer)) {
        return {
            correct: false,
            feedback: `¡Casi! La palabra es correcta, pero le falta o tiene mal la tilde. La forma correcta es: "${correctAnswer}".`
        };
    }

    // 3. Palabra completamente incorrecta
    return { correct: false, feedback: `Incorrecto. La palabra esperada era "${correctAnswer}".` };
}

// Quiz Logic
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 60; // seconds
let userAnswers = []; // To store user's answers and correct answers for summary

const questionTextElement = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const textInput = document.getElementById('text-input');
const submitBtn = document.getElementById('submit-btn');
const feedbackElement = document.getElementById('feedback');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const timerElement = document.getElementById('time');
const quizContainer = document.querySelector('.quiz-container');
const questionArea = document.querySelector('.question-area');
const resultsArea = document.querySelector('.results-area');
const finalScoreElement = document.getElementById('final-score');
const totalQuestionsElement = document.getElementById('total-questions');
const answerSummaryElement = document.getElementById('answer-summary');

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 60;
    userAnswers = [];

    questionArea.style.display = 'block';
    resultsArea.style.display = 'none';
    restartBtn.style.display = 'none';
    nextBtn.style.display = 'block'; // Ensure next button is visible at start

    startTimer();
    displayQuestion();
}

function displayQuestion() {
    feedbackElement.textContent = '';
    textInput.value = '';
    textInput.style.display = 'none';
    submitBtn.style.display = 'none';
    optionsContainer.innerHTML = '';
    optionsContainer.style.display = 'grid'; // Default to grid for options

    if (currentQuestionIndex < quizData.length) {
        const currentQuestion = quizData[currentQuestionIndex];
        questionTextElement.textContent = currentQuestion.question;

        if (currentQuestion.type === "multiple-choice") {
            currentQuestion.options.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option;
                button.classList.add('option-button');
                button.onclick = () => selectOption(option, currentQuestion.correctAnswer);
                optionsContainer.appendChild(button);
            });
        } else if (currentQuestion.type === "text-input") {
            optionsContainer.style.display = 'none'; // Hide options for text input
            textInput.style.display = 'block';
            submitBtn.style.display = 'block';
            submitBtn.onclick = () => checkAnswer(textInput.value, currentQuestion.correctAnswer);
        }
    } else {
        endQuiz();
    }
}

function selectOption(selectedOption, correctAnswer) {
    checkAnswer(selectedOption, correctAnswer);
}

function checkAnswer(userInput, correctAnswer) {
    const result = validateAccentuation(userInput, correctAnswer);
    feedbackElement.textContent = result.feedback;

    userAnswers.push({
        question: quizData[currentQuestionIndex].question,
        userInput: userInput,
        correctAnswer: correctAnswer,
        isCorrect: result.correct,
        feedback: result.feedback
    });

    if (result.correct) {
        score++;
    }
    // Disable input/options after answer
    if (quizData[currentQuestionIndex].type === "multiple-choice") {
        Array.from(optionsContainer.children).forEach(button => button.disabled = true);
    } else if (quizData[currentQuestionIndex].type === "text-input") {
        textInput.disabled = true;
        submitBtn.disabled = true;
    }
}

function nextQuestion() {
    // Re-enable input/options for next question
    if (quizData[currentQuestionIndex] && quizData[currentQuestionIndex].type === "multiple-choice") {
        Array.from(optionsContainer.children).forEach(button => button.disabled = false);
    } else if (quizData[currentQuestionIndex] && quizData[currentQuestionIndex].type === "text-input") {
        textInput.disabled = false;
        submitBtn.disabled = false;
    }

    currentQuestionIndex++;
    displayQuestion();
}

function endQuiz() {
    clearInterval(timer);
    questionArea.style.display = 'none';
    resultsArea.style.display = 'block';
    restartBtn.style.display = 'block';
    nextBtn.style.display = 'none'; // Hide next button at end

    finalScoreElement.textContent = score;
    totalQuestionsElement.textContent = quizData.length;

    answerSummaryElement.innerHTML = '';
    userAnswers.forEach((answer, index) => {
        const p = document.createElement('p');
        p.innerHTML = `<strong>Pregunta ${index + 1}:</strong> ${answer.question}<br>
                       Tu respuesta: "${answer.userInput}" ${answer.isCorrect ? '✅' : '❌'}<br>
                       Respuesta correcta: "${answer.correctAnswer}"<br>
                       Feedback: ${answer.feedback}`;
        answerSummaryElement.appendChild(p);
    });
}

function startTimer() {
    clearInterval(timer); // Clear any existing timer
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            endQuiz();
        }
    }, 1000);
}

// Event Listeners
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', startQuiz);

// Initial call to start the quiz when the page loads
document.addEventListener('DOMContentLoaded', startQuiz);
