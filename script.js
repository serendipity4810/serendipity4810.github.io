// URL to your CSV file (replace with the actual URL)
const csvUrl = 'path/to/your/questions.csv';

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
                if (columns.length >= 3) {
                    const questionInput = document.createElement('input');
                    questionInput.type = 'text';
                    questionInput.placeholder = columns[0];
                    questionInput.id = `question${index}`;
                    quizForm.appendChild(questionInput);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching questions from CSV:', error);
        });
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
                if (columns.length >= 3) {
                    const userAnswer = document.getElementById(`question${index}`).value.trim();
                    const points = parseFloat(columns[2]);

                    if (!isNaN(points) && userAnswer.toLowerCase() === columns[1].toLowerCase()) {
                        totalScore += points;
                    }
                }
            });

            displayResult(totalScore);
        })
        .catch(error => {
            console.error('Error fetching answers and points from CSV:', error);
        });
}

// Function to display result based on the total score
function displayResult(totalScore) {
    let resultMessage = '';

    // Define score ranges and associated messages
    const scoreRanges = [
        { min: 0, max: 20, message: 'You can do better!' },
        { min: 21, max: 40, message: 'Good effort!' },
        { min: 41, max: 60, message: 'Well done!' },
        { min: 61, max: 80, message: 'Great job!' },
        { min: 81, max: 100, message: 'Excellent!' }
    ];

    // Find the range that matches the total score
    for (const range of scoreRanges) {
        if (totalScore >= range.min && totalScore <= range.max) {
            resultMessage = range.message;
            break;
        }
    }

    resultContainer.textContent = `Your total score: ${totalScore} points. ${resultMessage}`;
}
)
        .catch(error => {
            console.error('Error fetching answers and points from CSV:', error);
        });
}

// Fetch questions when the page loads
fetchQuestions();
