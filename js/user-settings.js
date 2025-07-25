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

// Current user settings (will be loaded from localStorage)
let userSettings = { ...DEFAULT_USER_SETTINGS };

// Initialize user settings
function initializeUserSettings() {
    
    // Load existing settings or create defaults
    const savedSettings = getUserSettings();
    
    // If this is a completely new user (no createdAt timestamp)
    if (!savedSettings.createdAt) {
        console.log('New user detected, opening settings...');
        // Small delay to let page load completely
        setTimeout(() => {
            openSettingsForm();
        }, 500);
    }
}

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
// Part of main.js since it will be used by multiple pages

// Update specific user settings without replacing everything
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

// Open settings form   
function openSettingsForm() {
    loadCurrentSettingsIntoForm();
    toggleShowHideForm('userSettings');
}

// Load current settings into the form
function loadCurrentSettingsIntoForm() {
    const currentSettings = getUserSettings();
    
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

//  Validate settings form inputs
function validateSettingsForm(formData) {
    const errors = [];
    
    // Validate name
    if (!formData.name || formData.name.trim() === '') {
        errors.push('Name is required');
    } else if (formData.name.length > 50) {
        errors.push('Name must be 50 characters or less');
    }
    
    // Validate city
    if (!formData.city || formData.city === '') {
        errors.push('Please select a city');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Get Form Data
function getSettingsFormData() {
    const nameInput = document.getElementById('userName');
    const citySelect = document.getElementById('userCity');
    
    return {
        name: nameInput.value.trim(),
        city: citySelect.value
    };
}

// Handle settings form submission
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
            console.log('Settings saved successfully');
            updateUserNameDisplay();
            toggleShowHideForm('userSettings');
        } else {
            console.error('Failed to save settings');
        }
    } else {
        // Show validation errors
        console.log('Validation errors:', validation.errors);
        displayValidationErrors(validation.errors, 'userSettingsForm');
    }
}


