//  USER SETTINGS FUNCTIONS
//==========================================
// Default user settings structure
const DEFAULT_USER_SETTINGS = {
    name: '',
    city: '',
    preferences: {
        weatherUnit: 'fahrenheit',  // 'fahrenheit' or 'celsius'
        theme: 'default'            // for future dark mode, etc.
    },
    createdAt: null,
    lastUpdated: null
};


/**
 * Initializes user settings, loading from storage or prompting for new user setup.
 */
function initializeUserSettings() {
    
    // Load existing settings or create defaults
    const savedSettings = getUserSettings();
    
    // If this is a completely new user (no createdAt timestamp)
    if (!savedSettings.createdAt) {
        // Small delay to let page load completely
        setTimeout(() => {
            openSettingsForm();
        }, 500);
    }
}

/**
 * Saves user settings to localStorage and updates global settings.
 *
 * @param {UserSettings} settings - The user settings to save
 * @returns {boolean} Success status
 */
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
        appUserSettings = { ...settingsToSave };
        
        return true;
        
    } catch (error) {
        console.error('Error saving user settings:', error);
        return false;
    }
}


/**
 * Updates specific fields in user settings and saves them.
 *
 * @param {Partial<UserSettings>} updates - Fields to update in user settings
 * @returns {UserSettings|null} Updated settings or null on failure
 */
function updateUserSettings(updates) {
    try {
        // Get current settings
        const updatedSettings = getUserSettings();
        
        // Update specific fields
        if (updates.name !== undefined) {
            updatedSettings.name = updates.name;
        }
        if (updates.city !== undefined) {
            updatedSettings.city = updates.city;
        }
        
        // Save the updated settings
        const saveSuccess = saveUserSettings(updatedSettings);
        
        if (saveSuccess) {
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


/**
 * Opens the user settings form and loads current settings into it.
 */
function openSettingsForm() {
    loadCurrentSettingsIntoForm();
    toggleShowHideForm('userSettings');
}

/**
 * Loads current user settings into the settings form fields.
 */
function loadCurrentSettingsIntoForm() {
    const currentSettings = appUserSettings;
    
    // Load name
    const nameInput = document.getElementById('userName');
    if (nameInput && currentSettings.name) {
        nameInput.value = currentSettings.name;
    }
    
    // Load city
    const citySelect = document.getElementById('userCity');
    if (citySelect && currentSettings.city) {
        citySelect.value = currentSettings.city;
    }
}

/**
 * Retrieves user settings data from the settings form fields.
 *
 * @returns {Object} Form data for user settings
 */
function getSettingsFormData() {
    const nameInput = document.getElementById('userName');
    const citySelect = document.getElementById('userCity');
    
    return {
        name: nameInput.value.trim(),
        city: citySelect.value
    };
}

/**
 * Handles submission of the user settings form, validates and saves settings.
 *
 * @param {Event} event - The form submit event
 */
function submitSettingsForm(event) {
    // Prevent page refresh
    event.preventDefault(); 
    
    // Get form data
    const formData = getSettingsFormData();
    
    // Validate the form
    const validation = validateSettingsForm(formData);
    
    if (validation.isValid) {
        // Create settings object
        const newSettings = {
            name: formData.name,
            city: formData.city
        };
        
        // Save settings
        const success = updateUserSettings(newSettings);
        
        if (success) {
            updateUserNameDisplay();
            generateWeatherDisplay();
            toggleShowHideForm('userSettings');
        } else {
            console.error('Failed to save settings');
        }
    } else {
        // Show validation errors
        console.error('Validation errors:', validation.errors);
        displayValidationErrors(validation.errors, 'userSettingsForm');
    }
}


