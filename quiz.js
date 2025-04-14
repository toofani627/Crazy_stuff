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
        question: "What is the chemical symbol for Gold?",
        options: [
            "Au",
            "Ag",
            "Fe",
            "Cu"
        ],
        correctAnswer: 0
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: [
            "Venus",
            "Jupiter",
            "Mars", 
            "Saturn"
        ],
        correctAnswer: 2
    },
    {
        question: "What is the hardest natural substance on Earth?",
        options: [
            "Gold",
            "Iron",
            "Platinum",
            "Diamond"
        ],
        correctAnswer: 3
    }
    ,
    {
        question: "Which is the largest organ in the human body?",
        options: [
            "Heart",
            "Brain",
            "Liver",
            "Skin"
        ],
        correctAnswer: 3
    },
    {
        question: "What is the process by which plants make their own food called?",
        options: [
            "Photosynthesis",
            "Respiration", 
            "Digestion",
            "Absorption"
        ],
        correctAnswer: 0
    },
    {
        question: "What is the smallest unit of matter?",
        options: [
            "Cell",
            "Atom",
            "Molecule",
            "Electron"
        ],
        correctAnswer: 1
    },
    {
        question: "Which gas makes up most of Earth's atmosphere?",
        options: [
            "Oxygen",
            "Carbon Dioxide",
            "Nitrogen",
            "Hydrogen"
        ],
        correctAnswer: 2
    }
    
];

let points = 0;
const totalPoints = questions.length;
let currentQuestionIndex = 0;
let isAnswerChecked = false;


function displayResult(){
    const main = document.querySelector('.main-con');
    main.innerHTML = '';
    main.innerHTML = `<div id="result">
        <img src="img/result.png" alt="" id="result-img">
        <div>
          <h2>Congratulations! 🎉🥳</h2>
          <p>You have completed the quiz.</p>
          <h3>Your Points are :</h3>
          <h4>Points : <span id="points">${points}</span></h4>
          <h4>Total Points : <span id="totalPoints">${totalPoints}</span></h4>
          
        </div>
       </div>`;
       let btn = document.querySelector('.check')
       btn.innerHTML = 'Back to Home';
       btn.style.backgroundColor = 'black';
       btn.style.color = 'white';
       btn.addEventListener('click',()=>{
        window.location.href = 'index.html';
       });
       
    
}

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
                points++;
                console.log(points);
                selectedOption.style.backgroundColor = '#4CAF50'; // Green for correct
                submitButton.textContent = 'Next';
                submitButton.style.background = 'rgb(255 110 231)';
                isAnswerChecked = true;
                if(currentQuestionIndex === questions.length - 1){
                    displayResult();
                }
            } else {
                // Wrong answer handling
                selectedOption.style.backgroundColor = '#FF5252'; // Red for wrong
                // alert('Wrong Answer! Try again.');
                setTimeout(() => {
                    selectedOption.style.backgroundColor = '';
                    selectedOption.style.color = 'black';
                    selectedOption.classList.remove('selected');
                }, 700);

                 
            }
        } else {
            handleNextQuestion();
        }
    });
});

