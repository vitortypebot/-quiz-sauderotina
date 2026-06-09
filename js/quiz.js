/* ============================================
   5 MINUTE WORK FACE SYSTEM - QUIZ LOGIC
   ============================================ */

// Quiz State
let currentQuestion = 0;
const totalQuestions = 10;
let answers = {};
let userEmail = '';

// DOM Elements
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const screens = document.querySelectorAll('.quiz-screen');

// Initialize Quiz
function init() {
    updateProgress();
    setupEventListeners();
    setupEmailForm();
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
            showEmailScreen();
        }
    }, 400);
}

// Show Email Screen
function showEmailScreen() {
    showScreen('emailScreen');
    progressBar.style.width = '100%';
    progressText.textContent = '100%';
}

// Setup Email Form
function setupEmailForm() {
    const emailForm = document.getElementById('emailForm');
    if (emailForm) {
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = document.getElementById('emailInput');
            userEmail = emailInput.value;
            
            // Track email capture with Facebook Pixel
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Lead', {
                    content_name: 'Quiz Email Capture',
                    content_category: '5 Minute Work Face System'
                });
            }
            
            showResult();
        });
    }
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
    document.getElementById('resultMoney').textContent = result.money;
    document.getElementById('resultHours').textContent = result.hours;
    
    // Show result screen
    showScreen('resultScreen');
    
    // Start result timer
    startResultTimer();
}

// Calculate Result
function calculateResult() {
    // Calculate based on answers
    const timeAnswer = answers[2] || 'B';
    const challengeAnswer = answers[1] || 'A';
    const experienceAnswer = answers[9] || 'B';
    
    // Time calculations
    let timeSpent = '30+ min';
    let moneySaved = '$150+';
    let hoursWasted = '18+ hrs';
    
    // Adjust based on time answer
    if (timeAnswer === 'A') {
        timeSpent = '15+ min';
        moneySaved = '$80+';
        hoursWasted = '9+ hrs';
    } else if (timeAnswer === 'B') {
        timeSpent = '20+ min';
        moneySaved = '$100+';
        hoursWasted = '12+ hrs';
    } else if (timeAnswer === 'C') {
        timeSpent = '30+ min';
        moneySaved = '$150+';
        hoursWasted = '18+ hrs';
    } else if (timeAnswer === 'D') {
        timeSpent = '45+ min';
        moneySaved = '$200+';
        hoursWasted = '27+ hrs';
    }
    
    // Adjust based on challenge
    if (challengeAnswer === 'A') {
        moneySaved = '$120+';
    } else if (challengeAnswer === 'B') {
        hoursWasted = '15+ hrs';
    }
    
    return {
        time: timeSpent,
        money: moneySaved,
        hours: hoursWasted
    };
}

// Start Result Timer
function startResultTimer() {
    // Set timer to 3 hours from now
    const now = new Date();
    const endTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    
    const timerElement = document.getElementById('resultTimer');
    if (!timerElement) return;
    
    function updateTimer() {
        const now = new Date().getTime();
        const diff = endTime - now;
        
        if (diff <= 0) {
            // Timer expired, reset
            startResultTimer();
            return;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        timerElement.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
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

// Add loading state when transitioning to landing page
document.querySelector('.result-button')?.addEventListener('click', function(e) {
    // Track checkout click
    if (typeof fbq !== 'undefined') {
        fbq('track', 'InitiateCheckout', {
            content_name: '5 Minute Work Face System',
            value: 17.90,
            currency: 'USD'
        });
    }
    
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
