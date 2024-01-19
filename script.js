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

            resultContainer.textContent = `Your total score: ${totalScore} points`;
        })
        .catch(error => {
            console.error('Error fetching answers and points from CSV:', error);
        });
}

// Fetch questions when the page loads
fetchQuestions();
