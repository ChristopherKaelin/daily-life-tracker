// Global Info
let appDateInfo = null;
let allKeyDates = [];
let allHabitDefinitions = [];


// App initialization - runs when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Daily Life Tracker starting...');
    
    // Get App Wide Data
    appDateInfo = getDateInfo();
    allKeyDates = loadAllKeyDatesFromStorage();
    allHabitDefinitions = loadAllHabitDefinitions();
    
    // Initialize User settings
    console.log('Initialize user settings.');
    initializeUserSettings();

    // Initialize Header Display
    console.log('Initialize Header display')
    initializeHeaderDisplay(appDateInfo);

    //  Initialize Calendar Section Display 
    generateCalendarDisplay(appDateInfo);
    generateKeyDatesDisplay(appDateInfo, allKeyDates);
    initializeKeyDateEventListeners() 


    //==========================================
    //  TESTING - Remove after testing
    //==========================================
    // testFunction();

});

//  UTILITY FUNCTIONS
//==========================================
// Get current date information
function getDateInfo(inputDate = null) {
    // Use passed date or default to current date
    let currentDate;
    if (inputDate) {
        // Parse as local date, not UTC
        const [year, month, day] = inputDate.split('-');
        currentDate = new Date(year, month - 1, day); 
    } else {
        currentDate = new Date();
    }
    console.log('Current Date:', currentDate);
    
    const currentYear = currentDate.getFullYear();

    //  Returns a zero based MONTH (Jan=0, Feb=1, Mar=2, etc.)
    const currentMonth = currentDate.getMonth();
    const currentMonthName = monthToMonthName[currentMonth];
    const currentDayofMonth = currentDate.getDate();
    const currentDayOrdinal = currentDayofMonth + getOrdinalSuffix(currentDayofMonth);

    //  Returns a zero based DAY (Sun=0, Mon=1, Tue=2, etc.)
    const currentDayofWeek = currentDate.getDay();
    const currentDayName = dayToDayName[currentDayofWeek];
    
    //  Since getMonth() returns a zero based number, need to add one to move to the next month, 
    //  then using a zero for the day will move it back to the last day in the create date.
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    return {
        year: currentYear,
        month: currentMonth,
        monthName: currentMonthName,
        day: currentDayofMonth,
        dayOrdinal:  currentDayOrdinal,
        dayOfWeek: currentDayofWeek,
        dayName: currentDayName,
        daysInMonth: daysInCurrentMonth
    }
}

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
    console.log(`Show/Hide ${toggleForm} form.`);
    let formElement = document.getElementById(toggleForm);
    formElement.classList.toggle('hidden');
}

//  ERROR DISPLAY FUNCTIONS
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
}

// Clear validation error messages
function clearValidationErrors() {
    const existingErrors = document.querySelector('.validation-errors');
    if (existingErrors) {
        existingErrors.remove();
    }
}

function testFunction() {
    console.log('=== Testing Started ===');
    saveHabitDefinition();
    console.log('=== Testing Completed ===');
}

