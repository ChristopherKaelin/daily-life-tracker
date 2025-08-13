// Global Info
let selectedHabitDate = null;
let todayDateInfo = null; 
let appDateInfo = null;
let appUserSettings = null;
let allKeyDates = [];
let allHabitDefinitions = [];

// App initialization - runs when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log(`<=====  MAIN.JS  =====>`);

    // Get App Wide Data
    todayDateInfo = getDateInfo()
    appDateInfo = getDateInfo();
    appUserSettings = getUserSettings(); 
    allHabitDefinitions = loadAllHabitDefinitions();
        
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

// Load all habit definitions from localStorage
function loadAllHabitDefinitions() {
  const allHabits = JSON.parse(localStorage.getItem('dailyLifeHabitDefinitions')) || [];
  allHabitDefinitions = JSON.parse(localStorage.getItem('dailyLifeHabitDefinitions')) || [];

  return allHabitDefinitions;
}
                                
