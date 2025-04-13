// Array of questions with their options and correct answers
const questions = [
    {
        question: "What is the full form of EVM?",
        options: [
            "Electronic Voting Machine",
            "Electronic Value Machine",
            "Electronic Verification Machine", 
            "Electronic Virtual Machine"
        ],
        correctAnswer: 0
    },
    {
        question: "Which country has the largest land area in Europe?",
        options: [
            "France",
            "Ukraine", 
            "Russia",
            "Germany"
        ],
        correctAnswer: 2
    },
    {
        question: "When did World War 1 end?",
        options: [
            "1917",
            "1918",
            "1919",
            "1920"
        ],
        correctAnswer: 1
    },
    {
        question: "Which empire collapsed after World War 1?",
        options: [
            "British Empire",
            "Ottoman Empire",
            "Roman Empire",
            "Persian Empire"
        ],
        correctAnswer: 1
    }
];

let currentQuestionIndex = 0;
let isAnswerChecked = false;

// Function to display the current question and options
function displayQuestion() {
    const questionElement = document.querySelector('.question h2');
    const optionsContainer = document.querySelector('.answer');
    const currentQuestion = questions[currentQuestionIndex];

    // Reset button state
    const submitButton = document.querySelector('.check');
    submitButton.textContent = 'Submit';
    submitButton.style.background = 'linear-gradient(45deg, rgb(0, 180, 156), rgb(0, 255, 221))';
    submitButton.style.color = 'white';
    isAnswerChecked = false;

    // Update question text
    questionElement.textContent = `Q${currentQuestionIndex + 1} ${currentQuestion.question}`;

    // Clear previous options
    optionsContainer.innerHTML = '';

    // Create and append new options
    currentQuestion.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = `opt-${index + 1} opt`;
        
        optionDiv.innerHTML = `
            <div class="optname">${index + 1}</div>
            <h3>${option}</h3>
        `;
        
        optionsContainer.appendChild(optionDiv);
    });

    // Reattach event listeners to new options
    handleOptionSelection();
}

// Function to handle option selection
function handleOptionSelection() {
    // Get all option elements
    const options = document.querySelectorAll('.opt');
    
    // Add click event listener to each option
    options.forEach(option => {
        option.addEventListener('click', function() {
            if (isAnswerChecked) return; // Don't allow selection after answer is checked
            
            // Remove selected class from all options first
            options.forEach(opt => {
                opt.classList.remove('selected');
                opt.style.backgroundColor = '';
                opt.style.border = '';
                opt.style.color = '';
            });
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Add visual styling to selected option
            this.style.backgroundColor = '#5cdbfb';
            this.style.border = '2px solid white';
            this.style.color = 'white';
        });
    });
}

// Function to handle next question
function handleNextQuestion() {
    currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
    displayQuestion();
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    displayQuestion();
    
    const submitButton = document.querySelector('.check');
    
    submitButton.addEventListener('click', () => {
        const selectedOption = document.querySelector('.selected');
        
        // Check if an option is selected
        if (!selectedOption) {
            alert('Please select an answer before submitting');
            return;
        }

        if (!isAnswerChecked) {
            const optionNumber = parseInt(selectedOption.querySelector('.optname').textContent);
            const correctAnswer = questions[currentQuestionIndex].correctAnswer + 1;

            if (optionNumber === correctAnswer) {
                // Correct answer handling
                selectedOption.style.backgroundColor = '#4CAF50'; // Green for correct
                submitButton.textContent = 'Next';
                submitButton.style.background = 'rgb(255 110 231)';
                isAnswerChecked = true;
            } else {
                // Wrong answer handling
                selectedOption.style.backgroundColor = '#FF5252'; // Red for wrong
                setTimeout(() => {
                    selectedOption.style.backgroundColor = '';
                    selectedOption.classList.remove('selected');
                }, 1000);
                alert('Wrong Answer! Try again.');
            }
        } else {
            handleNextQuestion();
        }
    });
});

