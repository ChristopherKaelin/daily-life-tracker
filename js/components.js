function toggleShowHideForm(toggleForm) {
    console.log("Show/Hide settings form.");
    let formElement = document.getElementById(toggleForm);
    formElement.classList.toggle('hidden');
}

//  USER SETTINGS FORM
//  ****************************************

    // Open settings form
    function openSettingsForm() {
        loadCurrentSettingsIntoForm();
        toggleShowHideForm('settingsForm');
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
        
        console.log('Current settings loaded into form');
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
                toggleShowHideForm('settingsForm');
            } else {
                console.error('Failed to save settings');
            }
        } else {
            // Show validation errors
            console.log('Validation errors:', validation.errors);
            alert('Please fix the following errors:\n' + validation.errors.join('\n'));
            displayValidationErrors(validation.errors);
        }
    }

    // Display validation errors in the form
    function displayValidationErrors(errors) {
        // Remove any existing error messages
        clearValidationErrors();
        
        if (errors.length > 0) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'validation-errors';
            errorDiv.innerHTML = errors.map(error => `<p>${error}</p>`).join('');
            
            const form = document.getElementById('userSettingsForm');
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