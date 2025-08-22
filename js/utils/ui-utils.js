/**
 * Updates the header display with personalized greeting and user name.
 * Calls helper functions to update greeting and user name in the UI.
 *
 * @param {Object} dateInfo - The date information object
 */
function initializeHeaderDisplay(dateInfo) {
    updateGreetingDisplay();
    updateUserNameDisplay();
}


/**
 * Updates the greeting display in the UI based on the current time of day.
 * Sets the greeting text to morning, afternoon, or evening.
 */
function updateGreetingDisplay() {
  const greetingElement = document.getElementById('userGreeting');
  let greetingText = "Hello"
  if (greetingElement) {
    const currentHour = (new Date()).getHours();
    if (currentHour < 5) {
      greetingText = "Early morning";
    } else if (currentHour < 12) {
      greetingText = "Good morning";
    } else if (currentHour <= 17) {
      greetingText = "Good afternoon";
    } else if (currentHour <= 21) {
      greetingText = "Good evening";
    } else {
      greetingText = "Still awake?";
    }
    greetingElement.textContent = greetingText;
  }
}


/**
 * Updates the user name display in the UI, using the user's name or a placeholder.
 * Adds or removes styling based on whether a name is set.
 */
function updateUserNameDisplay() {
  const userNameElement = document.getElementById('userDisplayName');
  if (userNameElement) {
    const displayName = appUserSettings.name || 'User';
    userNameElement.textContent = displayName;
    
    // Add different styling if no name is set
    if (displayName === 'User') {
      userNameElement.classList.add('placeholder-name');
    } else {
      userNameElement.classList.remove('placeholder-name');
    }
  }
}


/**
 * Toggles the visibility of a form element by its ID, showing or hiding it.
 * Uses the 'hidden' CSS class to control visibility.
 *
 * @param {string} toggleForm - The ID of the form element to toggle
 */
function toggleShowHideForm(toggleForm) {
    let formElement = document.getElementById(toggleForm);
    formElement.classList.toggle('hidden');
}


//  VALIDATION ERROR DISPLAY FUNCTIONS
//==========================================

/**
 * Displays validation error messages in the specified form, auto-clearing after 4 seconds.
 * Creates an error div and inserts it at the top of the form.
 *
 * @param {Array<string>} errors - Array of error messages to display
 * @param {string} formId - The ID of the form to display errors in
 */
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


/**
 * Clears any validation error messages currently displayed in the UI.
 * Removes the error div if it exists.
 */
function clearValidationErrors() {
    const existingErrors = document.querySelector('.validation-errors');
    if (existingErrors) {
        existingErrors.remove();
    }
}
