//  UTILITY FUNCTIONS
//==========================================

function getCurrentDateInfo(inputDate = null) {
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

function initializeHeaderDisplay(dateInfo) {
    updateGreetingDisplay();
    updateUserNameDisplay();
    updateTodayIsDisplay(dateInfo);
}

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

function updateTodayIsDisplay(dateInfo) {
    const todayIsElement = document.getElementById('todayIsDisplay');
    if (todayIsElement) {
        todayIsElement.textContent = `Today is ${dateInfo.dayName}, ${dateInfo.monthName} ${dateInfo.dayOrdinal}, ${dateInfo.year}`;
    }
}

// Generate calendar grid for current month
function generateCalendarDisplay(dateInfo) {
    
    //  Create month/year header
    const monthYearHeader = `<h3>${dateInfo.monthName} ${dateInfo.year}</h3>`;
    
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
    console.log('Display calendar grid');
    const calendarElement = document.getElementById('calendarDisplay');

    if (calendarElement) {
        calendarElement.innerHTML = 
            monthYearHeader + 
            `<div class="calendar-grid">${dayOfWeekHeader} ${calendarGrid}</div>`;
    }
}

function updateCalendarDisplay(dateInfo) {
    const calendarElement = document.getElementById('calendar');
    if (calendarElement) {
        calendarElement.textContent = `Today is ${dateInfo.dayName}, ${dateInfo.monthName} ${dateInfo.dayOrdinal}, ${dateInfo.year}`;
    }
}

// Key date structure for monthly notes
const DEFAULT_KEY_DATE = {
    id: '',
    date: '',
    description: '',
    createdAt: '',
};

// Add new key date to localStorage
function addKeyDate(description, selectedDate = null) {
    console.log('selectedDate passed in:', selectedDate);
    const dateInfo = selectedDate ? getCurrentDateInfo(selectedDate) : appDateInfo;
    console.log('dateInfo after getCurrentDateInfo:', dateInfo);

    try {
        // Validate the key date data
        const dateString = `${dateInfo.year}-${(dateInfo.month+1).toString().padStart(2, '0')}-${dateInfo.day.toString().padStart(2, '0')}`;
        const validation = validateKeyDateData(dateString, description);
        if (!validation.isValid) {
            console.error('Invalid key date data:', validation.errors);
            return false;
        }

        // Generate next sequential ID for the month
        const nextNumber = allKeyDates.length + 1;
        let nextKeyDateId = `keydate-${nextNumber.toString().padStart(4, '0')}`;

        const newKeyDate = {
            id: nextKeyDateId,
            date: `${dateInfo.year}-${(dateInfo.month+1).toString().padStart(2, '0')}-${dateInfo.day.toString().padStart(2, '0')}`,
            description: description,
            createdAt: new Date().toISOString(),
        }

        // Add to keyDates array
        allKeyDates.push(newKeyDate);
        
        // Save updated array to localStorage
        return saveAllKeyDatesToStorage();
        
    } catch (error) {
        console.error('Error saving key date:', error);
        return false;
    }
}

// Save all key dates to localStorage
function saveAllKeyDatesToStorage() {
    try {
        localStorage.setItem('dailyLifeKeyDates', JSON.stringify(allKeyDates));
        console.log('Key dates saved to storage successfully');
        return true;
    } catch (error) {
        console.error('Error saving key dates to storage:', error);
        return false;
    }
}


// Update existing key date by ID
function updateKeyDate(keyDateId, newDescription) {
    try {
        // Find the key date in allKeyDates array by ID
        const updateIndex = allKeyDates.findIndex(kd => kd.id === keyDateId);
        if (updateIndex === -1) {
            console.error('Key date not found:', keyDateId);
            return false;
        }
                
        // Update the fields
        allKeyDates[updateIndex].description = newDescription;

        // Save updated array to localStorage
        return saveAllKeyDatesToStorage();
        
        // Return success/failure
        
    } catch (error) {
        // Error handling
        console.error(`Error updating key date ${keyDateId}: `, error);
        return false;
        
    }
}

// Delete key date by ID
function deleteKeyDate(keyDateId) {
    try {
        // Find and remove the key date from allKeyDates array
        const deleteIndex = allKeyDates.findIndex(kd => kd.id === keyDateId);
        if (deleteIndex === -1) {
            console.error('Key date not found:', keyDateId);
            return false;
        } else {
            allKeyDates.splice(deleteIndex, 1);
        }
        
        // Save updated array to localStorage & Return success/failure
        return saveAllKeyDatesToStorage();
        
        
    } catch (error) {
        // Error handling
        console.error(`Error deleting key date ${keyDateId}: `, error);
        return false;

    }
}

function getAllKeyDates() {
    return JSON.parse(localStorage.getItem('dailyLifeKeyDates')) || [];
}

function getKeyDatesForMonth(year, month) {
    const yearMonth = `${year}-${month.toString().padStart(2, '0')}`;
    return allKeyDates.filter(kd => kd.date.startsWith(`${yearMonth}`));
}

function validateKeyDateData(dateString, description) {
    const errors = [];
    
    // Validate description
    if (!description || description.trim() === '') {
        errors.push('Description is required');
    } else if (description.length > 50) {
        errors.push('Description must be 50 characters or less');
    }
    
    // Validate date string format (2025-07-16)
    const testDate = new Date(dateString);
    if (isNaN(testDate.getTime()) || testDate.toISOString().substring(0, 10) !== dateString) {
        errors.push('Invalid date');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

function generateKeyDatesDisplay(dateInfo) {
    // Get key dates for current month
    const currentMonthKeyDates = getKeyDatesForMonth(dateInfo.year, (dateInfo.month + 1).toString().padStart(2, '0'));
    currentMonthKeyDates.sort((a, b) => a.date.localeCompare(b.date));

    // Generate HTML
    let keyDatesHTML;
    if (currentMonthKeyDates.length === 0) {
        keyDatesHTML = '<p class="no-key-dates">No key dates for this month</p>';
    } else {
        keyDatesHTML = '<ul class="key-dates-list">';
        currentMonthKeyDates.forEach(keyDate => {
            const day = parseInt(keyDate.date.split('-')[2]);
            const key_date_info = `${day}${getOrdinalSuffix(day)} - ${keyDate.description || 'No description'}`;
            keyDatesHTML += 
                `<li class="key-date-item">
                    <span class="key-date-info">${key_date_info}</span>
                    <img class="edit" src="./assests/images/edit-icon.svg" alt="edit icon" 
                        onclick="openEditKeyDateForm('${keyDate.id}', 'edit')">
                    <img class="delete" src="./assests/images/delete-icon.svg" alt="delete icon" 
                        onclick="confirmDeleteKeyDate('${keyDate.id}', '${key_date_info}')">
                </li>`;
        });
        keyDatesHTML += '</ul>';
    }
    
    // Display in the key dates element`
    const keyDatesElement = document.getElementById('keyDatesDisplay');
    if (keyDatesElement) {
        keyDatesElement.innerHTML = keyDatesHTML;
    }
}

//  USER SETTING FUNCTIONS
//==========================================
// Default user settings structure
const DEFAULT_USER_SETTINGS = {
    name: '',
    city: '',
    preferences: {
        weatherUnit: 'fahrenheit',  // 'fahrenheit' or 'celsius'
        quoteTheme: 'motivation',   // for future use
        theme: 'default'            // for future dark mode, etc.
    },
    createdAt: null,
    lastUpdated: null
};

// Simple validation for user settings
function validateUserSettings(settings) {
    const errors = [];
    
    // Validate name
    if (settings.name && settings.name.length > 50) {
        errors.push('Name must be 50 characters or less');
    }
    
    // Validate city
    if (settings.city && settings.city.length > 100) {
        errors.push('City name must be 100 characters or less');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Current user settings (will be loaded from localStorage)
let userSettings = { ...DEFAULT_USER_SETTINGS };

// Save user settings to localStorage
function saveUserSettings(settings) {
    try {
        // Update timestamps
        const settingsToSave = {
            ...settings,
            lastUpdated: new Date().toISOString(),
            createdAt: settings.createdAt || new Date().toISOString()
        };
        
        // Save to localStorage
        localStorage.setItem('dailyLifeUserSettings', JSON.stringify(settingsToSave));
        
        // Update global userSettings object
        userSettings = { ...settingsToSave };
        
        console.log('User settings saved successfully:', settingsToSave);
        return true;
        
    } catch (error) {
        console.error('Error saving user settings:', error);
        return false;
    }
}

// Get user settings from localStorage
function getUserSettings() {
    try {
        // Try to get settings from localStorage
        const savedSettings = localStorage.getItem('dailyLifeUserSettings');
        
        if (savedSettings) {
            // Parse and merge with defaults (in case new fields were added)
            const parsedSettings = JSON.parse(savedSettings);
            const mergedSettings = {
                ...DEFAULT_USER_SETTINGS,
                ...parsedSettings,
                preferences: {
                    ...DEFAULT_USER_SETTINGS.preferences,
                    ...parsedSettings.preferences
                }
            };
            
            // Update global userSettings object
            userSettings = mergedSettings;
            return userSettings;
            
        } else {
            // No saved settings, return defaults
            userSettings = { ...DEFAULT_USER_SETTINGS };
            console.log('No saved settings found, using defaults');
            return userSettings;
        }
        
    } catch (error) {
        console.error('Error loading user settings:', error);
        // Return defaults on error
        userSettings = { ...DEFAULT_USER_SETTINGS };
        return userSettings;
    }
}

// Update specific user settings without replacing everything
function updateUserSettings(updates) {
    try {
        // Get current settings
        const currentSettings = getUserSettings();
        
        // Merge updates with current settings
        const updatedSettings = {
            ...currentSettings,
            ...updates,
            preferences: {
                ...currentSettings.preferences,
                ...(updates.preferences || {})
            }
        };
        
        // Save the updated settings
        const saveSuccess = saveUserSettings(updatedSettings);
        
        if (saveSuccess) {
            console.log('User settings updated successfully:', updates);
            return updatedSettings;
        } else {
            console.error('Failed to save updated settings');
            return null;
        }
        
    } catch (error) {
        console.error('Error updating user settings:', error);
        return null;
    }
}

// Check if user has completed initial setup
function hasUserCompletedSetup() {
    const settings = getUserSettings();
    return settings.name && settings.name.trim() !== '' && 
           settings.city && settings.city.trim() !== '';
}

// Check if user has entered their name
function hasUserName() {
    const settings = getUserSettings();
    return settings.name && settings.name.trim() !== '';
}

// Check if user has selected a city
function hasUserCity() {
    const settings = getUserSettings();
    return settings.city && settings.city.trim() !== '';
}

// Get user's display name (or fallback)
function getUserDisplayName() {
    const settings = getUserSettings();
    return settings.name && settings.name.trim() !== '' ? settings.name : 'User';
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

// Initialize user settings on app load
function initializeUserSettings() {
    
    // Load existing settings or create defaults
    const settings = getUserSettings();
    
    // If this is a completely new user (no createdAt timestamp)
    if (!settings.createdAt) {
        console.log('New user detected, setting up defaults...');
        
        // Save default settings with creation timestamp
        const defaultSettings = {
            ...DEFAULT_USER_SETTINGS,
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };
        
        saveUserSettings(defaultSettings);
    }
    
    return userSettings;
}
