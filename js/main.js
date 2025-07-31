// Global Info
let appDateInfo = null;
let allKeyDates = [];
let allHabitDefinitions = [];

// App initialization - runs when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('MAIN.JS DOMContentLoaded Add Event Listner Running');

    // Get App Wide Data
    appDateInfo = getDateInfo();
    console.log('App Date Info');
    console.log(appDateInfo);

    allHabitDefinitions = loadAllHabitDefinitions(); 
    console.log('All Habit Definitions');
    console.log(allHabitDefinitions);
        
    // Initialize Header Display
    initializeHeaderDisplay(appDateInfo);
});

// Get user settings from localStorage
function getUserSettings() {
    try {
        // Try to get settings from localStorage
        const savedSettings = localStorage.getItem('dailyLifeUserSettings');
        
        if (savedSettings) {
            userSettings = JSON.parse(savedSettings);
        } else {
            // No saved settings, get defaults
            userSettings = DEFAULT_USER_SETTINGS;
        }
        return userSettings;
        
    } catch (error) {
        console.error('Error loading user settings:', error);
        // Return defaults on error
        userSettings = DEFAULT_USER_SETTINGS;
        return userSettings;
    }
}

//  UTILITY/SHARED FUNCTIONS
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
    
    const currentYear = currentDate.getFullYear();

    //  Returns a zero based MONTH (Jan=0, Feb=1, Mar=2, etc.)
    const currentMonth = currentDate.getMonth();
    const currentMonthName = monthToMonthName[currentMonth];
    const currentYearMonth = `${currentYear}-${(currentMonth+1).toString().padStart(2, '0')}`;
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
        yearMonth: currentYearMonth,
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
    let formElement = document.getElementById(toggleForm);
    formElement.classList.toggle('hidden');
}

// Load all habit definitions from localStorage
function loadAllHabitDefinitions() {
    const allHabits = JSON.parse(localStorage.getItem('dailyLifeHabitDefinitions')) || [];
    allHabitDefinitions = JSON.parse(localStorage.getItem('dailyLifeHabitDefinitions')) || [];
    return allHabitDefinitions;
}

//  CALENDAR FUNCTIONS
//==========================================
const dayToDayName = {0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday'}
const monthToMonthName = {0: 'January', 1: 'February', 2: 'March', 3: 'April', 4: 'May', 5: 'June',  6: 'July', 7: 'August', 8: 'September', 9: 'October', 10: 'November', 11: 'December'}

// Get the correct 'st', 'nd', 'th' for the day.
function getOrdinalSuffix(dayNum) {
    if (dayNum >= 11 && dayNum <= 19) {
        return 'th'
    }

    const lastDigit = dayNum % 10;
    if (lastDigit == 1) {
        return 'st';
    } else if (lastDigit == 2 ) {
        return 'nd';
    } else if (lastDigit == 3) {
        return 'rd';
    } else {
        return 'th';
    }
}

// Generate calendar grid for current month
function generateCalendarDisplay(dateInfo) {
    //  Create month/year header
    const nonthYearHeader = `<h3>${dateInfo.monthName} ${dateInfo.year}</h3>`;
    
    //  Add in day headers
    const dayOfWeekHeader = '<div>Sun</div> <div>Mon</div> <div>Tue</div> <div>Wed</div> <div>Thu</div> <div>Fri</div> <div>Sat</div>'

    // Calculate first day of month and number of days
    const firstDayOfMonth = new Date(dateInfo.year, dateInfo.month, 1).getDay();

    //  Create HTML for calendar grid
    let calendarGrid = '';
    //  Add in blank divs to push day to correct start
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarGrid += `<div class="empty-day"></div>`;
    }
    //  Add in the days of the month
    for (let i = 1; i <= dateInfo.daysInMonth; i++) {
        const dayDateString = `${dateInfo.year}-${(dateInfo.month+1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;

        // Check if this day has key dates
        const currentMonthKeyDates = getKeyDatesForMonth(dateInfo.year, (dateInfo.month + 1).toString().padStart(2, '0'));
        const hasKeyDate = currentMonthKeyDates.some(kd => kd.date === dayDateString);
        const keyDateClass = hasKeyDate ? 'has-key-date' : '';  

        const onclickAction = `onclick="openKeyDateForm('${dayDateString}')"`;

        if (i == dateInfo.day) {
            isTodayClass = ` today`;
        } else {
            isTodayClass = ``;
        }
        calendarGrid += `<div class="${keyDateClass}${isTodayClass}" ${onclickAction}>${i}</div>`;
    }
    
    // Display the calendar
    const calendarElement = document.getElementById('calendarDisplay');

    if (calendarElement) {
        calendarElement.innerHTML = 
            nonthYearHeader + 
            `<div class="calendar-grid">${dayOfWeekHeader} ${calendarGrid}</div>`;
    }
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

function testFunction() {
    console.log('=== Testing Started ===');

    deleteHabitDefinition('habitDefinition-0004');
    deleteHabitDefinition('habitDefinition-0005');
    openHabitDefinitionFormForEditing('habitDefinition-0001');      // Yes/No
    // openHabitDefinitionFormForEditing('habitDefinition-0002');   // Cumulative

    console.log('=== Testing Completed ===');
}

