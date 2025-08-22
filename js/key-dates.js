//  KEY DATES FUNCTIONS
//==========================================

// Key date structure for monthly notes
const DEFAULT_KEY_DATE = {
    id: '',
    date: '',
    description: '',
    createdAt: '',
};


/**
 * Loads all key dates from localStorage and returns them as an array.
 * If no key dates are found, returns an empty array.
 *
 * @returns {Array<KeyDate>} Array of key date objects
 */
function loadAllKeyDatesFromStorage() {
  return JSON.parse(localStorage.getItem('dailyLifeKeyDates')) || [];
}


/**
 * Filters the global key dates array for dates matching the specified year and month.
 * Returns only key dates that start with the given 'yyyy-mm' string.
 *
 * @param {string} yearMonth - The year and month in 'yyyy-mm' format
 * @returns {Array<KeyDate>} Array of key dates for the month
 */
function getKeyDatesForMonth(yearMonth) {
  return allKeyDates.filter(kd => kd.date.startsWith(`${yearMonth}`));
}


/**
 * Saves the global key dates array to localStorage.
 * Returns true if successful, false if an error occurs.
 *
 * @returns {boolean} Success status
 */
function saveAllKeyDatesToStorage() {
    try {
        localStorage.setItem('dailyLifeKeyDates', JSON.stringify(allKeyDates));
        return true;
    } catch (error) {
        console.error('Error saving key dates to storage:', error);
        return false;
    }
}


/**
 * Validates the key date data for correct format and description length.
 * Returns an object with isValid and an array of error messages.
 *
 * @param {string} dateString - The date string in 'yyyy-mm-dd' format
 * @param {string} description - The description for the key date
 * @returns {{isValid: boolean, errors: string[]}} Validation result
 */
function validateKeyDateData(dateString, description) {
    const errors = [];
    
    // Validate description
    if (!description || description.trim() === '') {
        errors.push('Description is required');
    } else if (description.length > 50) {
        errors.push('Description must be 50 characters or less');
    }
    
    // Validate date string format (2025-07-16)
    if (!dateString || dateString === '') {
        errors.push('Date is required');
    } else {
        const testDate = new Date(dateString);
        if (isNaN(testDate.getTime()) || testDate.toISOString().substring(0, 10) !== dateString) {
            errors.push('Invalid date');
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}


/**
 * Opens the key date form for adding a new key date, pre-filling the date field.
 * Also resets the description field and updates the modal title.
 */
function openKeyDateForm() {
    // Format date for HTML date input (YYYY-MM-DD)
    if (todayDateInfo.date === appDateInfo.date) {
      defaultDate = `${todayDateInfo.date}`;
    } else {
      defaultDate = `${appDateInfo.date}`;
    }

    const dateInput = document.getElementById('keyDateDate');
    if (dateInput) {
        dateInput.value = defaultDate;
    }
    // Clear description field
    const keyDateDescription = document.getElementById('keyDateDescription');
    if (keyDateDescription) {
        keyDateDescription.value = '';
    }
    
    // Change modal title
    const modalTitle = document.getElementById('key-date-title');
    if (modalTitle) {
        modalTitle.textContent = 'Add Key Date';
    }

    toggleShowHideForm('keyDates');
}


/**
 * Handles submission of the key date form, validating and saving the key date.
 * Updates the display and shows errors if validation fails.
 *
 * @param {Event} event - The form submit event
 */
function submitKeyDateForm(event) {
    // Prevent page refresh
    event.preventDefault(); 

    // Get form data
    const formData = getKeyDateFormData();

    // Validate the form
    const validation = validateKeyDateData(formData.date, formData.description);
    
    if (validation.isValid) {
        const form = document.getElementById('keyDateForm');
        const editingId = form.dataset.editingId;
        
        let success;
        if (editingId) {
            // We're editing - call updateKeyDate()
            success = updateKeyDate(editingId, formData.date, formData.description);
        } else {
            // We're adding new - call addKeyDate()
            success = addKeyDate(formData.date, formData.description);
        }

        if (success) {
            delete form.dataset.editingId;
            const modalTitle = document.getElementById('key-date-title');
            if (modalTitle) {
                modalTitle.textContent = 'Edit Key Date';
            }
            toggleShowHideForm('keyDates');
        } else {
            console.error('Failed to save key date. Please try again');
        }
    } else {
        // Show validation errors
        console.error('Validation errors:', validation.errors);
        displayValidationErrors(validation.errors, 'keyDateForm');
    }
    generateCalendarDisplay(appDateInfo);
    generateKeyDatesDisplay(appDateInfo, allKeyDates);

}


/**
 * Opens the key date form for editing an existing key date, pre-filling fields.
 * Updates the modal title and sets the editing ID in the form dataset.
 *
 * @param {string} keyDateId - The ID of the key date to edit
 */
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
  
  // Change modal title
  const modalTitle = document.getElementById('key-date-title');
  if (modalTitle) {
    modalTitle.textContent = 'Edit Key Date';
  }
  
  document.getElementById('keyDateForm').dataset.editingId = keyDateId;
  
  toggleShowHideForm('keyDates');
}


/**
 * Adds a new key date to the global array and saves it to localStorage.
 * Generates a new sequential ID and formats the date string.
 *
 * @param {string} newDate - The date for the new key date
 * @param {string} newDescription - The description for the new key date
 * @returns {boolean} Success status
 */
function addKeyDate(newDate, newDescription) {
    const dateInfo = newDate ? getDateInfo(newDate) : appDateInfo;

    try {
        // Generate next sequential ID for the month
        const existingIds = allKeyDates.map(kd => parseInt(kd.id.split('-')[1]));
        const nextNumber = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
        let nextKeyDateId = `keydate-${nextNumber.toString().padStart(4, '0')}`;

        const newKeyDate = {
            id: nextKeyDateId,
            date: `${dateInfo.year}-${(dateInfo.month+1).toString().padStart(2, '0')}-${dateInfo.day.toString().padStart(2, '0')}`,
            description: newDescription,
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


/**
 * Retrieves key date form data from the DOM fields.
 * Returns an object with date and description properties.
 *
 * @returns {{date: string, description: string}} Form data for key date
 */
function getKeyDateFormData() {
    const keyDateSelect = document.getElementById('keyDateDate');
    const DescriptionInput = document.getElementById('keyDateDescription');
    
    return {
        date: keyDateSelect.value,
        description: DescriptionInput.value.trim()
    };
}


/**
 * Updates an existing key date in the global array and saves changes to localStorage.
 * Finds the key date by ID and updates its date and description.
 *
 * @param {string} keyDateId - The ID of the key date to update
 * @param {string} newDate - The new date value
 * @param {string} newDescription - The new description value
 * @returns {boolean} Success status
 */
function updateKeyDate(keyDateId, newDate, newDescription) {
    try {
        // Find the key date in allKeyDates array by ID
        const updateIndex = allKeyDates.findIndex(kd => kd.id === keyDateId);
        if (updateIndex === -1) {
            console.error('Key date not found:', keyDateId);
            return false;
        }
                
        // Update the fields
        allKeyDates[updateIndex].date = newDate;
        allKeyDates[updateIndex].description = newDescription;

        // Save updated array to localStorage
        return saveAllKeyDatesToStorage();
        
    } catch (error) {
        // Error handling
        console.error(`Error updating key date ${keyDateId}: `, error);
        return false;        
    }
}

/**
 * Deletes a key date from the global array by its ID and saves changes to localStorage.
 * Returns true if successful, false if the key date is not found or an error occurs.
 *
 * @param {string} keyDateId - The ID of the key date to delete
 * @returns {boolean} Success status
 */
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


/**
 * Shows a confirmation dialog for deleting a key date, displaying its info.
 * Sets up the confirmation button to execute the deletion.
 *
 * @param {string} keyDateId - The ID of the key date to delete
 * @param {string} keyDateText - The description or info to display in the dialog
 */
function confirmDeleteKeyDate(keyDateId, keyDateText) {
    // Set the key date info in the dialog
    const deleteInfoElement = document.getElementById('deleteKeyDateInfo');
    const confirmButton = document.getElementById('confirmDelete');
    if (confirmButton) {
        confirmButton.onclick = () => executeDeleteKeyDate(keyDateId);
    }
    deleteInfoElement.textContent = `${keyDateText}`;
    // Show the confirmation dialog
    toggleShowHideForm('deleteKeyDateConfirmForm');
}


/**
 * Executes the deletion of a key date and updates the calendar and key dates display.
 * Closes the confirmation dialog or alerts on failure.
 *
 * @param {string} keyDateId - The ID of the key date to delete
 */
function executeDeleteKeyDate(keyDateId) {
    const success = deleteKeyDate(keyDateId);
    
    if (success) {
        // Refresh the calendar and key dates display
        generateCalendarDisplay(appDateInfo);
        generateKeyDatesDisplay(appDateInfo);
        
        // Close the confirmation dialog
        toggleShowHideForm('deleteKeyDateConfirmForm');
    } else {
        alert('Failed to delete key date. Please try again.');
    }
}


/**
 * Generates and displays the list of key dates for the given date info.
 * Sorts key dates by date and updates the DOM with the formatted list.
 *
 * @param {Object} dateInfo - The date information object containing yearMonth
 */
function generateKeyDatesDisplay(dateInfo) {
    // Get key dates for current month
    const currentMonthKeyDates = getKeyDatesForMonth(dateInfo.yearMonth);
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
                `<li class="key-date-item" data-key-date-id="${keyDate.id}" data-description="${keyDate.description}">
                    <span class="key-date-info">${key_date_info}</span>
                    <img class="edit icon icon-md" src="./assets/images/edit.svg" alt="edit icon">
                    <img class="delete icon icon-md" src="./assets/images/delete.svg" alt="delete icon">
                </li>`;
        });
        keyDatesHTML += '</ul>';
    }
    
    // Display in the key dates element
    const keyDatesElement = document.getElementById('keyDatesDisplay');
    if (keyDatesElement) {
        keyDatesElement.innerHTML = keyDatesHTML;
    }
}


/**
 * Sets up click handlers for edit and delete actions on key date items in the display.
 * Uses event delegation to handle clicks on dynamically generated elements.
 */
function initializeKeyDatesClickHandlers() {
    const keyDatesContainer = document.getElementById('keyDatesDisplay');
    
    if (keyDatesContainer) {
        keyDatesContainer.addEventListener('click', function(e) {
            // Handle delete button clicks
            if (e.target.classList.contains('delete')) {
                const keyDateItem = e.target.closest('.key-date-item');
                const id = keyDateItem.dataset.keyDateId;
                const description = keyDateItem.dataset.description;
                confirmDeleteKeyDate(id, description);
            }
            
            // Handle edit button clicks
            if (e.target.classList.contains('edit')) {
                const keyDateItem = e.target.closest('.key-date-item');
                const id = keyDateItem.dataset.keyDateId;
                openEditKeyDateForm(id);
            }
        });
    }
}
