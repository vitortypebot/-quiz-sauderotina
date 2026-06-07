/* ============================================
   5 MINUTE WORK FACE SYSTEM - QUIZ LOGIC
   ============================================ */

// Quiz State
let currentQuestion = 0;
const totalQuestions = 10;
let answers = {};

// DOM Elements
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const screens = document.querySelectorAll('.quiz-screen');

// Initialize Quiz
function init() {
    updateProgress();
    setupEventListeners();
}

// Start Quiz
function startQuiz() {
    currentQuestion = 1;
    showScreen('question1');
    updateProgress();
}

// Show Screen
function showScreen(screenId) {
    // Hide all screens
    screens.forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('exit');
    });
    
    // Remove exit class after animation
    setTimeout(() => {
        screens.forEach(screen => {
            screen.classList.remove('exit');
        });
    }, 500);
    
    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        setTimeout(() => {
            targetScreen.classList.add('active');
        }, 100);
    }
}

// Select Option
function selectOption(questionNumber, option) {
    // Store answer
    answers[questionNumber] = option;
    
    // Update UI
    const screen = document.getElementById(`question${questionNumber}`);
    const options = screen.querySelectorAll('.option');
    
    options.forEach(opt => {
        opt.classList.remove('selected');
        if (opt.querySelector('.option-letter').textContent === option) {
            opt.classList.add('selected');
        }
    });
    
    // Move to next question after delay
    setTimeout(() => {
        if (questionNumber < totalQuestions) {
            currentQuestion = questionNumber + 1;
            showScreen(`question${questionNumber + 1}`);
            updateProgress();
        } else {
            showResult();
        }
    }, 400);
}

// Update Progress Bar
function updateProgress() {
    const progress = (currentQuestion / totalQuestions) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${Math.round(progress)}%`;
}

// Show Result
function showResult() {
    // Calculate result based on answers
    const result = calculateResult();
    
    // Update result screen
    document.getElementById('resultTime').textContent = result.time;
    document.getElementById('resultStyle').textContent = result.style;
    
    // Show result screen
    showScreen('resultScreen');
    
    // Update progress to 100%
    progressBar.style.width = '100%';
    progressText.textContent = '100%';
}

// Calculate Result
function calculateResult() {
    // Simple result calculation based on answers
    const timeAnswers = ['A', 'B', 'C', 'D'];
    const styleAnswers = ['A', 'B', 'C', 'D'];
    
    // Get time answer (question 2)
    const timeAnswer = answers[2] || 'B';
    const timeIndex = timeAnswers.indexOf(timeAnswer);
    const times = ['3 min', '5 min', '10 min', '15 min'];
    
    // Get style answer (question 7)
    const styleAnswer = answers[7] || 'B';
    const styleIndex = styleAnswers.indexOf(styleAnswer);
    const styles = ['Natural', 'Profissional', 'Sofisticado', 'Rápido'];
    
    return {
        time: times[timeIndex],
        style: styles[styleIndex]
    };
}

// Setup Event Listeners
function setupEventListeners() {
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key >= '1' && e.key <= '4') {
            const optionIndex = parseInt(e.key) - 1;
            const options = ['A', 'B', 'C', 'D'];
            if (currentQuestion > 0 && currentQuestion <= totalQuestions) {
                selectOption(currentQuestion, options[optionIndex]);
            }
        }
        
        if (e.key === 'Enter' && currentQuestion === 0) {
            startQuiz();
        }
    });
    
    // Touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX - touchStartX > swipeThreshold) {
            // Swipe right - could go back
        }
        if (touchStartX - touchEndX > swipeThreshold) {
            // Swipe left - could go forward
        }
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', init);

// Add loading state when transitioning to Typebot
document.querySelector('.result-button')?.addEventListener('click', function(e) {
    // Show loading state
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loading);
    
    // Remove loading after redirect
    setTimeout(() => {
        loading.remove();
    }, 1000);
});
