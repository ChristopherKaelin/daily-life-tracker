//  KEY DATES FUNCTIONS
//==========================================

// Key date structure for monthly notes
const DEFAULT_KEY_DATE = {
    id: '',
    date: '',
    description: '',
    createdAt: '',
};

// Load all key dates from localStorage
function loadAllKeyDatesFromStorage() {
    return JSON.parse(localStorage.getItem('dailyLifeKeyDates')) || [];
}

// Filter key dates for the current month
function getKeyDatesForMonth(year, month) {
    const yearMonth = `${year}-${month.toString().padStart(2, '0')}`;
    return allKeyDates.filter(kd => kd.date.startsWith(`${yearMonth}`));
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

// Open key date form 
function openKeyDateForm(clickedDate = null) {
    // Set default date to clicked date or today
    if (!clickedDate) {
        // Format today's date for HTML date input (YYYY-MM-DD)
        const today = new Date();
        const todayFormatted = today.toISOString().split('T')[0];
        clickedDate = todayFormatted;
    }
    const dateInput = document.getElementById('keyDateDate');
    if (dateInput) {
        dateInput.value = clickedDate;
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

// Handle settings form submission
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
            success = updateKeyDate(editingId, formData.description);
            console.log('Key date updated successfully');
        } else {
            // We're adding new - call addKeyDate()
            success = addKeyDate(formData.description, formData.date);
            console.log('Key date added successfully');
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
        console.log('Validation errors:', validation.errors);
        displayValidationErrors(validation.errors, 'keyDateForm');
    }
    generateCalendarDisplay(appDateInfo);
    generateKeyDatesDisplay(appDateInfo, allKeyDates);

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
    
    // Change modal title
    const modalTitle = document.getElementById('key-date-title');
    if (modalTitle) {
        modalTitle.textContent = 'Edit Key Date';
    }
    
    document.getElementById('keyDates').dataset.editingId = keyDateId;
    
    toggleShowHideForm('keyDates');
}

// Create new key date to localStorage
function addKeyDate(description, selectedDate = null) {
    const dateInfo = selectedDate ? getDateInfo(selectedDate) : appDateInfo;

    try {
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

// Read Form Data
function getKeyDateFormData() {
    console.log("Get Key Date Form Data");
    const keyDateSelect = document.getElementById('keyDateDate');
    const DescriptionInput = document.getElementById('keyDateDescription');
    
    return {
        date: keyDateSelect.value,
        description: DescriptionInput.value.trim()
    };
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

// Show delete confirmation dialog
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

// Execute the key date deletion
function executeDeleteKeyDate(keyDateId) {
    const success = deleteKeyDate(keyDateId);
    
    if (success) {
        console.log('Key date deleted successfully');
        
        // Refresh the calendar and key dates display
        generateCalendarDisplay(appDateInfo);
        generateKeyDatesDisplay(appDateInfo);
        
        // Close the confirmation dialog
        toggleShowHideForm('deleteKeyDateConfirmForm');
    } else {
        alert('Failed to delete key date. Please try again.');
    }
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
                `<li class="key-date-item" data-key-date-id="${keyDate.id}" data-description="${keyDate.description}">
                    <span class="key-date-info">${key_date_info}</span>
                    <img class="edit-icon" src="./assests/images/edit-icon.svg" alt="edit icon">
                    <img class="delete-icon" src="./assests/images/delete-icon.svg" alt="delete icon">
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

// Event delegation for key date actions 
function initializeKeyDateEventListeners() {
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