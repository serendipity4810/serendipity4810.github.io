// URL to CSV
const csvUrl = 'https://github.com/serendipity4810/serendipity4810.github.io/blob/main/Frågebatteri%20test%20-%20Blad1.csv';

// Reference to the form and result container
const quizForm = document.getElementById('quiz-form');
const resultContainer = document.getElementById('result-container');

// Function to fetch questions from CSV file
function fetchQuestions() {
    fetch(csvUrl)
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n');

            rows.forEach((row, index) => {
                const columns = row.split(',');
                if (columns.length >= 4) {
                    const question = columns[0];
                    const options = columns.slice(1, columns.length - 2); // Exclude Correct Answers and Points columns
                    const correctAnswers = columns[columns.length - 2].split(','); // Split correct answers
                    const points = columns[columns.length - 1].split(','); // Split points

                    createQuestionElement(index, question, options, correctAnswers, points);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching questions from CSV:', error);
        });
}

// Function to create question elements dynamically
function createQuestionElement(index, question, options, correctAnswers, points) {
    const questionContainer = document.createElement('div');
    questionContainer.className = 'question-container';

    const questionElement = document.createElement('p');
    questionElement.textContent = `${index + 1}. ${question}`;
    questionContainer.appendChild(questionElement);

    options.forEach((option, optionIndex) => {
        const optionInput = document.createElement('input');
        optionInput.type = 'checkbox';
        optionInput.id = `question${index}option${optionIndex}`;
        const optionLabel = document.createElement('label');
        optionLabel.textContent = option;
        optionLabel.setAttribute('for', `question${index}option${optionIndex}`);
        questionContainer.appendChild(optionInput);
        questionContainer.appendChild(optionLabel);
    });

    quizForm.appendChild(questionContainer);
}

// Function to calculate and display the total score
function calculateScore() {
    fetch(csvUrl)
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n');
            let totalScore = 0;

            rows.forEach((row, index) => {
                const columns = row.split(',');
                if (columns.length >= 4) {
                    const correctAnswers = columns[columns.length - 2].split(',');
                    const points = columns[columns.length - 1].split(',');

                    const userAnswers = getSelectedOptions(index);
                    const questionScore = calculateQuestionScore(correctAnswers, points, userAnswers);

                    totalScore += questionScore;
                }
            });

            displayResult(totalScore);
        })
        .catch(error => {
            console.error('Error fetching answers and points from CSV:', error);
        });
}

// Function to get the selected options for a question
function getSelectedOptions(questionIndex) {
    const options = document.querySelectorAll(`#quiz-form .question-container:nth-child(${questionIndex + 1}) input[type="checkbox"]:checked`);
    return Array.from(options).map(option => option.nextElementSibling.textContent);
}

// Function to calculate the score for a question
function calculateQuestionScore(correctAnswers, points, userAnswers) {
    let questionScore = 0;

    correctAnswers.forEach((correctAnswer, index) => {
        if (userAnswers.includes(correctAnswer)) {
            questionScore += parseFloat(points[index]) || 0; // Add points for correct answers
        }
    });

    return questionScore;
}

// Function to display result based on the total score
function displayResult(totalScore) {
    let resultMessage = '';

    // Define score ranges and associated messages
    const scoreRanges = [
        { min: 0, max: 20, message: 'Resultat 1' },
        { min: 21, max: 40, message: 'Resultat 2' },
        { min: 41, max: 60, message: 'Resultat 3' },
        { min: 61, max: 80, message: 'Resultat 4' },
        { min: 81, max: 100, message: 'Resultat 5' }
    ];

    // Find the range that matches the total score
    for (const range of scoreRanges) {
        if (totalScore >= range.min && totalScore <= range.max) {
            resultMessage = range.message;
            break;
        }
    }

    resultContainer.textContent = `${resultMessage}`;
}

// Fetch questions when the page loads
fetchQuestions();
