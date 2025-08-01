// Update the header display with personalized information
function initializeHeaderDisplay(dateInfo) {
    updateGreetingDisplay();
    updateUserNameDisplay();
    updateTodayIsDisplay(dateInfo);
}


// Update greeting display based on current time
function updateGreetingDisplay() {
    const greetingElement = document.getElementById('userGreeting');
    let greetingText = "Hello"
    if (greetingElement) {
        const currentHour = (new Date()).getHours();
        if (currentHour < 12) {
            greetingText = "Good Morning";
        } else if (currentHour <= 17) {
            greetingText = "Good Afternoon";
        } else {
            greetingText = "Good Evening";
        }
        greetingElement.textContent = greetingText;
    }
}


// Update user name display in the UI
function updateUserNameDisplay() {
    const userNameElement = document.getElementById('userDisplayName');
    if (userNameElement) {
        const displayName = getUserDisplayName();
        userNameElement.textContent = displayName;
        
        // Add different styling if no name is set
        if (displayName === 'User') {
            userNameElement.classList.add('placeholder-name');
        } else {
            userNameElement.classList.remove('placeholder-name');
        }
    }
}


// Update "Today is" header display with formatted date
function updateTodayIsDisplay(dateInfo) {
    const todayIsElement = document.getElementById('todayIsDisplay');
    if (todayIsElement) {
        todayIsElement.textContent = `Today is ${dateInfo.dayName}, ${dateInfo.monthName} ${dateInfo.dayOrdinal}, ${dateInfo.year}`;
    }
}


// Get user's display name (or fallback)
function getUserDisplayName() {
    const settings = getUserSettings();
    return settings.name && settings.name.trim() !== '' ? settings.name : 'User';
}


// Toggle visibility of a form by its ID
function toggleShowHideForm(toggleForm) {
    let formElement = document.getElementById(toggleForm);
    formElement.classList.toggle('hidden');
}


//  VALIDATION ERROR DISPLAY FUNCTIONS
//==========================================

// Display validation errors in the form
function displayValidationErrors(errors, formId) {
    // Remove any existing error messages
    clearValidationErrors();
    
    if (errors.length > 0) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'validation-errors';
        errorDiv.innerHTML = errors.map(error => `<p>${error}</p>`).join('');
        
        const form = document.getElementById(formId);
        form.insertBefore(errorDiv, form.firstChild);
    }

    // Auto-clear after 4 seconds
    setTimeout(() => {
        clearValidationErrors(formId);
    }, 4000);    
}

// Clear validation error messages
function clearValidationErrors() {
    const existingErrors = document.querySelector('.validation-errors');
    if (existingErrors) {
        existingErrors.remove();
    }
}
