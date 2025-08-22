/**
 * @file habit-definitions.js
 * This file handles the initialization and management of habit definitions.
 * It includes functions to add, update, delete, and restore habit definitions,
 * as well as displaying them in the UI.
 * It also includes validation for habit definitions and event listeners for user interactions.
 */


document.addEventListener('DOMContentLoaded', function() {
    
    generateHabitDefinitionsDisplay();
    initializeHabitDefinitionEventListeners() 

    //==========================================
    //  TESTING 
    //==========================================
    //
});


const DEFAULT_HABIT_DEFINITION = {
    id: '',             // 'habit-0001', 'habit-0002', etc.
    name: '',
    goalType: '',       // 'daily' or 'cumulative'
    // Cumulative habits details:
    measurement: '',
    goalAmount: 0,
    incrementAmount: 0,
    // All habits details:
    isActive: true,
    createdAt: '',
    updatedAt: '',
};

/**
 * Retrieves active habit definitions from localStorage, sorted by goal type and name.
 *
 * @returns {Array} Array of active habit definitions
 */
function getActiveHabitDefinitions() {
    // Always get fresh data from storage
    const allHabits = JSON.parse(localStorage.getItem('dailyLifeHabitDefinitions')) || [];
    const sortedHabits = 
      allHabits
      .filter(hd => hd.isActive)
      .sort((a, b) => {
        // Sort by goalType first (daily before cumulative)
        if (a.goalType !== b.goalType) {
          return a.goalType === 'daily' ? -1 : 1;
        }
        // Then sort alphabetically by name within each group
        return a.name.localeCompare(b.name);
      });
    return sortedHabits;
}

/**
 * Retrieves inactive habit definitions from localStorage.
 *
 * @returns {Array} Array of inactive habit definitions
 */
function getInactiveHabitDefinitions() {
    // Always get fresh data from storage
    const allHabits = JSON.parse(localStorage.getItem('dailyLifeHabitDefinitions')) || [];
    return allHabits.filter(hd => !hd.isActive);
}

/**
 * Saves all habit definitions to localStorage.
 * Returns true if successful, false otherwise.
 *
 * @returns {boolean} Success status
 */
function saveAllHabitDefinitionsToStorage() {
    try {
        localStorage.setItem('dailyLifeHabitDefinitions', JSON.stringify(allHabitDefinitions));
        return true;
    } catch (error) {
        console.error('Error saving habit definitions to storage:', error);
        return false;
    }
}

/**
 * Adds a new habit definition to the list and saves it to localStorage.
 *
 * @param {HabitDefinition} habitData - The habit definition data to add
 * @returns {boolean} Success status
 */
function addHabitDefinition(habitData) {
    try {
        // Generate next sequential ID
        const nextNumber = allHabitDefinitions.length + 1;
        let nextHabitDefinitionId = `habitDefinition-${nextNumber.toString().padStart(4, '0')}`;
        
        // Create the new habit definition object
        let newHabitDefinition = {
            id: nextHabitDefinitionId,
            name: habitData.name || '',
            goalType: habitData.goalType || 'daily',
            measurement: habitData.measurement || '',
            goalAmount: habitData.goalAmount || 0,
            incrementAmount: habitData.incrementAmount || 0,
            isActive: true,
            createdAt: new Date().toISOString(),
        };

        // Add to allHabitDefinitions array
        allHabitDefinitions.push(newHabitDefinition);
        
        // Save updated array to localStorage
        return saveAllHabitDefinitionsToStorage();
        
    } catch (error) {
        // Error handling
        console.error('Error saving habit definition:', error);
        return false;
    }
}

/**
 * Updates an existing habit definition with new data and saves to localStorage.
 *
 * @param {string} habitDefId - The ID of the habit definition to update
 * @param {Partial<HabitDefinition>} updatedData - The updated habit definition fields
 * @returns {boolean} Success status
 */
function updateHabitDefinition(habitDefId, updatedData) {
    try {
        // Find the habit definition in allHabitDefinitions array by ID
        const updateIndex = allHabitDefinitions.findIndex(hd => hd.id === habitDefId);
        if (updateIndex === -1) {
            console.error('Habit Definition not found:', habitDefId);
            return false;
        }
        
        // Update the fields that were provided
        allHabitDefinitions[updateIndex].name = updatedData.name || allHabitDefinitions[updateIndex].name;
        allHabitDefinitions[updateIndex].goalType = updatedData.goalType || allHabitDefinitions[updateIndex].goalType;
        allHabitDefinitions[updateIndex].measurement = updatedData.measurement || allHabitDefinitions[updateIndex].measurement;
        allHabitDefinitions[updateIndex].goalAmount = updatedData.goalAmount || allHabitDefinitions[updateIndex].goalAmount;
        allHabitDefinitions[updateIndex].incrementAmount = updatedData.incrementAmount || allHabitDefinitions[updateIndex].incrementAmount;
        allHabitDefinitions[updateIndex].isActive = updatedData.isActive || allHabitDefinitions[updateIndex].isActive;
        
        // Update timestamp
        allHabitDefinitions[updateIndex].updatedAt = new Date().toISOString();
        
        // Save updated array to localStorage
        return saveAllHabitDefinitionsToStorage();
        
    } catch (error) {
        // Error handling
        console.error(`Error updating habit definition ${keyDateId}: `, error);
        return false;
    }
}

/**
 * Shows a confirmation dialog to restore an inactive habit definition.
 *
 * @param {string} habitDefinitionId - The ID of the habit definition to restore
 * @param {string} habitDefinitionsDescription - Description for the dialog
 */
function confirmRestoreHabitDefinition(habitDefinitionId, habitDefinitionsDescription) {
    // Set the habit defifinition info in the dialog
    const restoreInfoElement = document.getElementById('restoreHabitDefinitionInfo');
    const confirmButton = document.getElementById('confirmRestore');
    if (confirmButton) {
        confirmButton.onclick = () => executeRestoreHabitDefinition(habitDefinitionId);
    }
    restoreInfoElement.textContent = `${habitDefinitionsDescription}`;
    // Show the confirmation dialog
    toggleShowHideForm('restoreHabitDefinitionConfirmForm');
}

/**
 * Executes restoration of an inactive habit definition and updates the display.
 *
 * @param {string} habitDefId - The ID of the habit definition to restore
 */
function executeRestoreHabitDefinition(habitDefId) {
    const habitData = { isActive: true };
    const success = updateHabitDefinition(habitDefId, habitData);
    
    if (success) {
       
        // Refresh the calendar and key dates display
        generateHabitDefinitionsDisplay();
        
        // Close the confirmation dialog
        toggleShowHideForm('restoreHabitDefinitionConfirmForm');
    } else {
        alert('Failed to restore habit definition. Please try again.');
    }
}

/**
 * Marks a habit definition as inactive and saves to localStorage.
 *
 * @param {string} habitDefinitionId - The ID of the habit definition to delete
 * @returns {boolean} Success status
 */
function deleteHabitDefinition(habitDefinitionId) {
    try {
        // Find the habit definition in allHabitDefinitions array by ID
        const deleteIndex = allHabitDefinitions.findIndex(hd => hd.id === habitDefinitionId);
        
        if (deleteIndex === -1) {
            console.error('Habit definition not found:', habitDefinitionId);
            return false;
        }
        
        // Mark as inactive instead of deleting
        allHabitDefinitions[deleteIndex].isActive = false;
        allHabitDefinitions[deleteIndex].updatedAt = new Date().toISOString();
        
        // Save updated array to localStorage
        return saveAllHabitDefinitionsToStorage();
        
    } catch (error) {
        console.error('Error deleting habit definition:', error);
        return false;
    }
}

/**
 * Shows a confirmation dialog to delete (inactivate) a habit definition.
 *
 * @param {string} habitDefId - The ID of the habit definition to delete
 * @param {string} habitDefDesc - Description for the dialog
 */
function confirmDeleteHabitDefinition(habitDefId, habitDefDesc) {
    // Set the habit defifinition info in the dialog
    const deleteInfoElement = document.getElementById('deleteHabitDefinitionInfo');
    const confirmButton = document.getElementById('confirmDelete');
    if (confirmButton) {
        confirmButton.onclick = () => executeDeleteHabitDefinition(habitDefId);
    }
    deleteInfoElement.textContent = `${habitDefDesc}`;
    // Show the confirmation dialog
    toggleShowHideForm('deleteHabitDefinitionConfirmForm');
}

/**
 * Executes the deletion (inactivation) of a habit definition and updates the display.
 *
 * @param {string} habitDefId - The ID of the habit definition to delete
 */
function executeDeleteHabitDefinition(habitDefId) {
    const success = deleteHabitDefinition(habitDefId);
    
    if (success) {
       
        // Refresh habit definition display
        generateHabitDefinitionsDisplay();
        
        // Close the confirmation dialog
        toggleShowHideForm('deleteHabitDefinitionConfirmForm');
    } else {
        alert('Failed to delete habit definition. Please try again.');
    }
}

/**
 * Validates a cumulative habit definition object.
 * Checks measurement, goal amount, and increment amount fields for correctness.
 * Returns an object with isValid and errors array.
 *
 * @param {HabitDefinition} habitDefinition - The habit definition to validate
 * @returns {{isValid: boolean, errors: string[]}} Validation result
 */
function validateCumulativeHabitDefinition(habitDefinition) {
    const cumulativeErrors = [];
    
    if (!habitDefinition.measurement || habitDefinition.measurement.trim() === '') {
        cumulativeErrors.push('Measurement unit is required (miles, hours, pages, etc.)');
    }
    
    if (!habitDefinition.goalAmount || habitDefinition.goalAmount <= 0) {
        cumulativeErrors.push('Goal amount must be greater than 0');
    }
    
    if (!habitDefinition.incrementAmount || habitDefinition.incrementAmount <= 0) {
        cumulativeErrors.push('Increment amount must be greater than 0');
    }
    
    if (habitDefinition.incrementAmount > habitDefinition.goalAmount) {
        cumulativeErrors.push('Increment amount cannot be larger than goal amount');
    }
    
    return {
        isValid: cumulativeErrors.length === 0,
        errors: cumulativeErrors
    };
}

/**
 * Checks if a habit is a daily completion type.
 * 
 * @param {HabitDefinition} habitDefinition - The habit definition object
 * @returns {boolean} True if habit type is 'daily'
 */
function isDailyHabit(habitDefinition) {
    return habitDefinition.goalType === 'daily';
}

/**
 * Checks if a habit is a cumulative progress type.
 * 
 * @param {HabitDefinition} habitDefinition - The habit definition object  
 * @returns {boolean} True if habit type is 'cumulative'
 */
function isCumulativeHabit(habitDefinition) {
    return habitDefinition.goalType === 'cumulative';
}

/**
 * Calculates the total number of checkboxes needed for a habit definition.
 * Returns 1 for daily habits, or the ceiling of goalAmount/incrementAmount for cumulative habits.
 *
 * @param {HabitDefinition} habitDefinition - The habit definition object
 * @returns {number} Number of checkboxes needed
 */
function calculateTotalCheckboxes(habitDefinition) {
    // Return number of checkboxes needed
    if (isCumulativeHabit(habitDefinition)) {
        return Math.ceil(habitDefinition.goalAmount / habitDefinition.incrementAmount);
    } else if (isDailyHabit(habitDefinition)) {
        return 1;
    }
}

/**
 * Calculates the progress percentage of a habit definition based on completed checkboxes.
 * Returns 0 if total checkboxes is 0 to avoid division by zero.
 *
 * @param {HabitDefinition} habitDefinition - The habit definition object
 * @param {number} completedCheckboxes - Number of completed checkboxes
 * @returns {number} Percentage of completion
 */
function calculateHabitProgress(habitDefinition, completedCheckboxes) {
    const totalCheckboxes = calculateTotalCheckboxes(habitDefinition);
    if (totalCheckboxes === 0) return 0; 
    return (completedCheckboxes / totalCheckboxes) * 100; 
}

/**
 * Returns a formatted string for the habit definition's goal.
 * For daily habits, returns just the name. For cumulative, includes goal details.
 *
 * @param {HabitDefinition} habitDefinition - The habit definition object
 * @returns {string} Formatted goal display text
 */
function getHabitGoalDisplayText(habitDefinition) {
    if (isDailyHabit(habitDefinition)) {
        return habitDefinition.name; // Just the name
    } else if (isCumulativeHabit(habitDefinition)) {
        return  `${habitDefinition.name} - Goal: ${habitDefinition.goalAmount} ${habitDefinition.measurement} in ${habitDefinition.incrementAmount} ${habitDefinition.measurement} increments.`;
    } else {
        return habitDefinition.name; // Fallback
    }
}

/**
 * Handles the change event for the goal type select element.
 * Shows or hides cumulative fields based on selected goal type.
 *
 * @returns {void}
 */
function handleGoalTypeChange() {
    const goalTypeSelect = document.getElementById('habitGoalType');
    const cumulativeFields = document.getElementById('cumulativeFields');
    
    if (goalTypeSelect && cumulativeFields) {
        if (goalTypeSelect.value === 'cumulative') {
            cumulativeFields.style.display = 'block';
        } else {
            cumulativeFields.style.display = 'none';
        }
    }
}

/**
 * Retrieves and returns the habit definition form data from the DOM.
 * Includes name, goal type, measurement, goal amount, and increment amount.
 *
 * @returns {Partial<HabitDefinition>} Form data for the habit definition
 */
function getHabitDefinitionFormData() {
    const nameInput = document.getElementById('habitName').value.trim();
    const goalTypeSelect = document.getElementById('habitGoalType').value;
    let measurementInput;
    let goalAmountInput;
    let incrementAmountInput
    if (goalTypeSelect === 'cumulative') {
        measurementInput = document.getElementById('habitMeasurement').value.trim();
        goalAmountInput = parseFloat(document.getElementById('habitGoalAmount').value);
        incrementAmountInput = parseFloat(document.getElementById('habitIncrementAmount').value);
    }
    
    return {
        name: nameInput,
        goalType: goalTypeSelect,
        measurement: measurementInput || '',
        goalAmount: goalAmountInput || 0,
        incrementAmount: incrementAmountInput || 0
    };
}

/**
 * Handles the submission of the habit definition form.
 * Validates and saves the habit definition, updating the display or showing errors.
 *
 * @param {Event} event - The form submit event
 */
function submitHabitDefinitionForm(event) {
    event.preventDefault();
    
    // Get form data
    const formHabitDefinitionData = getHabitDefinitionFormData();

    // Validate the form
    const habitValidation = validateHabitDefinition(formHabitDefinitionData);
    
    // Add/Update the habit definition
    if (!habitValidation.isValid) {
        displayValidationErrors(habitValidation.errors, 'habitDefinitionsForm');
        return;
    } else {
        const form = document.getElementById('habitDefinitionsInput');
        const editingId = form.dataset.editingId;
        if (editingId) {
            saveSuccess = updateHabitDefinition(editingId, formHabitDefinitionData);
        } else {
            saveSuccess = addHabitDefinition(formHabitDefinitionData);
        }
        if (!saveSuccess) {
            console.error('Failed to save habit definition');
            displayValidationErrors(['Failed to save habit definition'], 'habitDefinitionsForm');
            return;
        } else {
            document.getElementById('habitDefinitionsForm').reset();
            toggleShowHideForm('habitDefinitionsInput');
            generateHabitDefinitionsDisplay();
        }
    }
}

/**
 * Clears the habit definition form by resetting all input fields and modal title.
 * Calls handleGoalTypeChange to ensure correct fields are displayed.
 *
 * @returns {void}
 */
function clearHabitDefinitionForm() {
    // Reset modal title
    const modalTitle = document.getElementById('habit-title');
    if (modalTitle) {
        modalTitle.textContent = 'Add Habit Definition';
    }
  
    const form = document.getElementById('habitDefinitionsForm');
    if (form) {
        form.reset();
        handleGoalTypeChange();
    }
}

/**
 * Opens the habit definition form for adding or editing a habit definition.
 * If mode is 'edit', populates the form with existing data.
 *
 * @param {'add'|'edit'} mode - The mode for the form
 * @param {string} habitDefId - The ID of the habit definition to edit (if editing)
 */
function openHabitDefinitionForm(mode, habitDefId) {
  clearHabitDefinitionForm();
  if (mode === 'edit') {
    populateHabitDefinitionForm(habitDefId);
  }
  toggleShowHideForm('habitDefinitionsInput');
}

/**
 * Populates the habit definition form with the data of the specified habit definition.
 * Sets form fields and modal title for editing.
 *
 * @param {string} habitDefinitionId - The ID of the habit definition to populate
 * @returns {void}
 */
function populateHabitDefinitionForm(habitDefinitionId) {
    clearHabitDefinitionForm();

    const editHabitDefinition = allHabitDefinitions.find(hd => hd.id === habitDefinitionId);
    if (!editHabitDefinition) {
        console.error(`Habit definition not found: ${habitDefinitionId}`);
        return;
    }

    const nameInput = document.getElementById('habitName');
    if (nameInput) nameInput.value = editHabitDefinition.name;

    const goalTypeSelect = document.getElementById('habitGoalType');
    if (goalTypeSelect) goalTypeSelect.value = editHabitDefinition.goalType;

    let measurementInput;
    let goalAmountInput;
    let incrementAmountInput
    if (goalTypeSelect === 'cumulative') {
        measurementInput = document.getElementById('habitMeasurement');
        if (measurementInput) measurementInput.value = editHabitDefinition.measurement;

        goalAmountInput = document.getElementById('habitGoalAmount');
        if (goalAmountInput) goalAmountInput.value = editHabitDefinition.goalAmount;

        incrementAmountInput = document.getElementById('habitIncrementAmount');
        if (incrementAmountInput) incrementAmountInput.value = editHabitDefinition.incrementAmount; 
    }

    handleGoalTypeChange();
    
    // Change modal title
    const modalTitle = document.getElementById('habit-title');
    if (modalTitle) {
        modalTitle.textContent = 'Edit Habit Definition';
    }
    document.getElementById('habitDefinitionsInput').dataset.editingId = habitDefinitionId;
}

/**
 * Generates and displays the HTML for active and inactive habit definitions.
 * Updates the DOM with the current habit definitions.
 *
 * @returns {void}
 */
function generateHabitDefinitionsDisplay() {
    // Generate HTML
    let habitDefinitionsHTML = "";

    activeHabitDefinitions = getActiveHabitDefinitions();
    inactiveHabitDefinitions = getInactiveHabitDefinitions()

    if (activeHabitDefinitions.length === 0) {
      habitDefinitionsHTML += '<p class="no-habit-defs">No active habit definitions</p>';
    } else {
      habitDefinitionsHTML += '<p class="habit-defs-title">Acitve</p><ul class="habit-defs-list">';
      activeHabitDefinitions.forEach(habitDefinition => {
        habitDefText = getHabitGoalDisplayText(habitDefinition);
        habitDefinitionsHTML += 
          `<li class="habit-def-item" data-habit-def-id="${habitDefinition.id}" data-habit-def-info="${habitDefinition.name} - ${habitDefinition.goalType}">
            <span class="habit-def-info">${habitDefText}</span>
            <img class="edit icon icon-md" src="./assets/images/edit.svg" alt="edit icon">
            <img class="delete icon icon-md" src="./assets/images/delete.svg" alt="delete icon">
          </li>`;
      });
      habitDefinitionsHTML += '</ul>';
    }

    if (inactiveHabitDefinitions.length === 0) {
      habitDefinitionsHTML += '<p class="no-habit-defs">No inactive habit definitions</p>';
    } else {
      habitDefinitionsHTML += '<p class="habit-defs-title">Inacitve</p><ul class="habit-defs-list">';
      inactiveHabitDefinitions.forEach(habitDefinition => {
        habitDefText = getHabitGoalDisplayText(habitDefinition);
        habitDefinitionsHTML += 
          `<li class="habit-def-item" data-habit-def-id="${habitDefinition.id}" data-habit-def-info="${habitDefinition.name} - ${habitDefinition.goalType}">
            <span class="habit-def-info">${habitDefText}</span>
            <img class="restore icon icon-md" src="./assets/images/undo.svg" alt="undo icon">
          </li>`;
      });
      habitDefinitionsHTML += '</ul>';
    }

    // Display in the key dates element`
    const habitDefinitionsElement = document.getElementById('habitDefinitionsDisplay');
    if (habitDefinitionsElement) {
      habitDefinitionsElement.innerHTML = habitDefinitionsHTML;
    }
}

/**
 * Sets up click handlers for edit, delete, and restore actions on habit definition items in the display.
 * Listens for clicks and determines the action based on the clicked element's class.
 *
 * @returns {void}
 */
function initializeHabitDefinitionEventListeners() {
    const habitDefinitionContainer = document.getElementById('habitDefinitionsDisplay');

    if (habitDefinitionContainer) {
        habitDefinitionContainer.addEventListener('click', function(e) {
            // Handle edit button clicks
            if (e.target.classList.contains('edit')) {
                const habitDefinitionItem = e.target.closest('.habit-def-item');
                const habitDefId = habitDefinitionItem.dataset.habitDefId;
                openHabitDefinitionForm('edit', habitDefId);
            }
            
            // Handle delete button clicks
            if (e.target.classList.contains('delete')) {
                const habitDefinitionItem = e.target.closest('.habit-def-item');
                const id = habitDefinitionItem.dataset.habitDefId;
                const description = habitDefinitionItem.dataset.habitDefInfo; 
                confirmDeleteHabitDefinition(id, description);
            }
            
            // Handle restore button clicks
            if (e.target.classList.contains('restore')) {
                const habitDefinitionItem = e.target.closest('.habit-def-item');
                const id = habitDefinitionItem.dataset.habitDefId;
                const description = habitDefinitionItem.dataset.habitDefInfo; 
                confirmRestoreHabitDefinition(id, description);
            }
        });
    }
}