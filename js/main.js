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

/**
 * Retrieves user settings from localStorage, or returns defaults if none are found or on error.
 * This function ensures the app always has a valid user settings object to work with.
 *
 * @returns {UserSettings} The user settings object
 */
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

/**
 * Loads all habit definitions from localStorage and updates the global array.
 * Returns an array of all habit definitions, or an empty array if none are found.
 *
 * @returns {Array<HabitDefinition>} Array of habit definitions
 */
function loadAllHabitDefinitions() {
  const allHabits = JSON.parse(localStorage.getItem('dailyLifeHabitDefinitions')) || [];
  allHabitDefinitions = JSON.parse(localStorage.getItem('dailyLifeHabitDefinitions')) || [];

  return allHabitDefinitions;
}
                                
