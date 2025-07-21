function toggleShowHideForm(toggleForm) {
    console.log(`Show/Hide ${toggleForm} form.`);
    let formElement = document.getElementById(toggleForm);
    formElement.classList.toggle('hidden');
}

//  USER SETTINGS FORM
//==========================================

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
            displayValidationErrors(validation.errors, 'userSettingsForm');
        }
    }


//  KEY DATES FORM
//==========================================

    // Open key date form 
    function openKeyDateForm(clickedDate = null) {
        // Set default date to clicked date or today
        if (!clickedDate) {
            // Format today's date for HTML date input (YYYY-MM-DD)
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];
            clickedDate = formattedDate;
        }
        const dateInput = document.getElementById('keyDateDate');
        if (dateInput) {
            dateInput.value = clickedDate;
        }
        
        toggleShowHideForm('keyDateForm');
    }

    // Handle settings form submission
    function submitKeyDateForm(event) {
        // Prevent page refresh
        event.preventDefault(); 

        // Get form data
        const formData = getKeyDateFormData();

        // Validate the form
        const validation = validateKeyDateForm(formData);
        
        if (validation.isValid) {
            const form = document.getElementById('addKeyDateForm');
            const editingId = form.dataset.editingId;
            
            let success;
            if (editingId) {
                // We're editing - call updateKeyDate()
                success = updateKeyDate(editingId, formData.description);
                console.log('Key date updated successfully');
            } else {
                // We're adding new - call addKeyDate()
                success = addKeyDate(formData.description, formData.date);
                console.log('Key date added successfully');
            }

            if (success) {
                delete form.dataset.editingId;
                const modalTitle = document.getElementById('.modal-title');
                if (modalTitle) {
                    modalTitle.textContent = 'Edit Key Date';
                }
                toggleShowHideForm('keyDateForm');
            } else {
                console.error('Failed to save key date. Please try again');
            }
        } else {
            // Show validation errors
            console.log('Validation errors:', validation.errors);
            displayValidationErrors(validation.errors, 'addKeyDateForm');
        }
    }

    // Get Form Data
    function getKeyDateFormData() {
        console.log("Get Key Date Form Data");
        const keyDateSelect = document.getElementById('keyDateDate');
        const DescriptionInput = document.getElementById('keyDateDescription');
        
        return {
            date: keyDateSelect.value,
            description: DescriptionInput.value.trim()
        };
    }

    // Validate key date form inputs
    function validateKeyDateForm(formData) {
        const errors = [];
        
        // Validate date
        if (!formData.date || formData.date === '') {
            errors.push('Date is required');
        } else {
            // Check if date is valid
            const testDate = new Date(formData.date);
            if (isNaN(testDate.getTime())) {
                errors.push('Please enter a valid date');
            }
        }
        
        // Validate description
        if (!formData.description || formData.description.trim() === '') {
            errors.push('Description is required');
        } else if (formData.description.length > 50) {
            errors.push('Description must be 50 characters or less');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Open key date form for editing
    function openEditKeyDateForm(keyDateId) {
        // Find the key date in the global array
        const keyDate = allKeyDates.find(kd => kd.id === keyDateId);
        
        if (!keyDate) {
            console.error('Key date not found:', keyDateId);
            return;
        }
        
        // Pre-populate form fields 
        const dateInput = document.getElementById('keyDateDate');
        const descriptionInput = document.getElementById('keyDateDescription');
        
        if (dateInput && descriptionInput) {
            dateInput.value = keyDate.date; // Already in YYYY-MM-DD format
            descriptionInput.value = keyDate.description;
        }
        
        // Change modal title and store the ID for updating
        const modalTitle = document.getElementById('.modal-title');
        if (modalTitle) {
            modalTitle.textContent = 'Edit Key Date';
        }
        
        // Store the ID so we know we're editing
        document.getElementById('addKeyDateForm').dataset.editingId = keyDateId;
        
        toggleShowHideForm('keyDateForm');
    }


//  ERROR DISPLAY
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
