//  User Settings Data Model
//  ****************************************

// Initialize user settings on app load
function initializeUserSettings() {
    console.log('Initializing user settings...');
    
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
    
    // Log current settings state
    console.log('User settings initialized:', userSettings);
    console.log('Setup completed:', hasUserCompletedSetup());
    
    return userSettings;
}

// Default user settings structure
const DEFAULT_USER_SETTINGS = {
    name: 'Chris Kaelin',
    city: 'Lexington, KY',
    preferences: {
        weatherUnit: 'fahrenheit',  // 'fahrenheit' or 'celsius'
        quoteTheme: 'motivation',   // for future use
        theme: 'default'            // for future dark mode, etc.
    },
    createdAt: null,
    lastUpdated: null
};

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
            console.log('User settings loaded:', userSettings);
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


//  ****************************************
//  TEST FUNCTIONS - Remove after testing
//  ****************************************

