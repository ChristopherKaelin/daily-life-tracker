// Global Habit Info


// Habit Initialization - runs when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Habit Definitions starting...');
    
    // Get Habit Definition Data
    allHabitDefinitions = loadAllHabitDefinitions();
    
    generateHabitDefinitionsDisplay();
    initializeHabitDefinitionEventListeners() 

    //==========================================
    //  TESTING - Remove after testing
    //==========================================
    //

});
const DEFAULT_HABIT_DEFINITION = {
    id: '',             // 'habit-0001', 'habit-0002', etc.
    name: '',
    goalType: '',       // 'binary' or 'cumulative'
    // Cumulative habits details:
    measurement: '',
    goalAmount: 0,
    incrementAmount: 0,
    // All habits details:
    isActive: true,
    createdAt: '',
    updatedAt: '',
};

// Load all habit definitions from localStorage
function loadAllHabitDefinitions() {
    allHabitDefinitions = JSON.parse(localStorage.getItem('dailyLifeHabitDefinitions')) || [];
    return allHabitDefinitions;
}

// Get active habit definitions
function getActiveHabitDefinitions() {
    // Always get fresh data from storage
    const allHabits = JSON.parse(localStorage.getItem('dailyLifeHabitDefinitions')) || [];
    return allHabits.filter(hd => hd.isActive);
}

// Get active habit definitions
function getInactiveHabitDefinitions() {
    // Always get fresh data from storage
    const allHabits = JSON.parse(localStorage.getItem('dailyLifeHabitDefinitions')) || [];
    return allHabits.filter(hd => !hd.isActive);
}

// Save all habit definitions to localStorage
function saveAllHabitDefinitionsToStorage() {
    try {
        localStorage.setItem('dailyLifeHabitDefinitions', JSON.stringify(allHabitDefinitions));
        console.log('Habit definitions saved to storage successfully');
        return true;
    } catch (error) {
        console.error('Error saving habit definitions to storage:', error);
        return false;
    }
}

// Save habit definition to localStorage
function saveHabitDefinition(habitData) {
    try {
        // Generate next sequential ID
        const nextNumber = allHabitDefinitions.length + 1;
        let nextHabitDefinitionId = `habitDefinition-${nextNumber.toString().padStart(4, '0')}`;
        console.log('Next Habit Definition ID:', nextHabitDefinitionId);
        
        // Create the new habit definition object
        let newHabitDefinition = {
            id: nextHabitDefinitionId,
            name: habitData.name || '',
            goalType: habitData.goalType || 'binary',
            measurement: habitData.measurement || '',
            goalAmount: habitData.goalAmount || 0,
            incrementAmount: habitData.incrementAmount || 0,
            isActive: true,
            createdAt: new Date().toISOString(),
        };

        // Add to keyDates array
        allHabitDefinitions.push(newHabitDefinition);
        
        // Save updated array to localStorage
        return saveAllHabitDefinitionsToStorage();
        
    } catch (error) {
        // Error handling
        console.error('Error saving habit definition:', error);
        return false;
    }
}

// Update existing habit definition
function updateHabitDefinition(habitDefinitionId, updatedData) {
    console.log(`Attempting to update ${habitDefinitionId}`)
    try {
        // Find the habit definition in allHabitDefinitions array by ID
        const updateIndex = allHabitDefinitions.findIndex(hd => hd.id === habitDefinitionId);
        if (updateIndex === -1) {
            console.error('Habit Definition not found:', habitDefinitionId);
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

// Show delete confirmation dialog
function confirmRestoreHabitDefinition(habitDefinitionId, habitDefinitionsDescription) {
    console.log(`Delete ${habitDefinitionId} - ${habitDefinitionsDescription}`);
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

// Execute the habit definition deletion
function executeRestoreHabitDefinition(habitDefId) {
    console.log("executeRestoreHabitDefinition");
    const habitData = { isActive: true };
    const success = updateHabitDefinition(habitDefId, habitData);
    
    if (success) {
       
        // Refresh the calendar and key dates display
        console.log("Regenerate Habit Def Display");
        generateHabitDefinitionsDisplay();
        
        // Close the confirmation dialog
        toggleShowHideForm('restoreHabitDefinitionConfirmForm');
    } else {
        alert('Failed to restore habit definition. Please try again.');
    }
}

// Delete (Inactivate) habit definition
function deleteHabitDefinition(habitDefinitionId) {
    console.log("deleteHabitDefinition")
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

// Show delete confirmation dialog
function confirmDeleteHabitDefinition(habitDefinitionId, habitDefinitionsDescription) {
    console.log(`Delete ${habitDefinitionId} - ${habitDefinitionsDescription}`);
    // Set the habit defifinition info in the dialog
    const deleteInfoElement = document.getElementById('deleteHabitDefinitionInfo');
    const confirmButton = document.getElementById('confirmDelete');
    if (confirmButton) {
        confirmButton.onclick = () => executeDeleteHabitDefinition(habitDefinitionId);
    }
    deleteInfoElement.textContent = `${habitDefinitionsDescription}`;
    // Show the confirmation dialog
    toggleShowHideForm('deleteHabitDefinitionConfirmForm');
}

// Execute the habit definition deletion
function executeDeleteHabitDefinition(habitDefId) {
    console.log("executeDeleteHabitDefinition");
    const success = deleteHabitDefinition(habitDefId);
    
    if (success) {
       
        // Refresh habit definition display
        console.log("Regenerate Habit Def Display");
        generateHabitDefinitionsDisplay();
        
        // Close the confirmation dialog
        toggleShowHideForm('deleteHabitDefinitionConfirmForm');
    } else {
        alert('Failed to delete habit definition. Please try again.');
    }
}

// Validate cumulative habit definition
function validateCumulativeHabitDefinition(habitDefinition) {
    const cumulativeErrors = [];
    console.log('Validating cumulative habit definition:', habitDefinition);
    
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

// Main validation function that handles both goal types
function validateHabitDefinition(habitDefinition) {
    const errors = [];

    // Common validation for all habit types
    if (!habitDefinition.name || habitDefinition.name.trim() === '') {
        errors.push('Habit name is required');
    }
    if (!habitDefinition.goalType || habitDefinition.goalType.trim() === '') {
        errors.push('Habit goal type is required');
    }
    
    // Goal type specific validation
    if  (habitDefinition.goalType === 'cumulative') {
        const cumulativeValidation = validateCumulativeHabitDefinition(habitDefinition);
        errors.push(...cumulativeValidation.errors);
    } else if (habitDefinition.goalType !== 'binary') {
        // Invalid goal type
        errors.push('Invalid goal type. Must be "binary" or "cumulative"');
    }
    
    // Combine and return results
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Check if habit is binary type
function isBinaryHabit(habitDefinition) {
    return habitDefinition.goalType === 'binary';
}

// Check if habit is cumulative type  
function isCumulativeHabit(habitDefinition) {
    return habitDefinition.goalType === 'cumulative';
}

// Calculate total number of checkboxes needed for cumulative habit
function calculateTotalCheckboxes(habitDefinition) {
    // Return number of checkboxes needed
    if (isCumulativeHabit(habitDefinition)) {
        return Math.ceil(habitDefinition.goalAmount / habitDefinition.incrementAmount);
    } else if (isBinaryHabit(habitDefinition)) {
        return 1;
    }
}

// Calculate progress percentage for cumulative habit
function calculateHabitProgress(habitDefinition, completedCheckboxes) {
    const totalCheckboxes = calculateTotalCheckboxes(habitDefinition);
    if (totalCheckboxes === 0) return 0; 
    return (completedCheckboxes / calculateTotalCheckboxes(habitDefinition)) * 100; 
}

// Get display text for habit goal
function getHabitGoalDisplayText(habitDefinition) {
    if (isBinaryHabit(habitDefinition)) {
        return habitDefinition.name; // Just the name
    } else if (isCumulativeHabit(habitDefinition)) {
        return  `${habitDefinition.name} - Goal: ${habitDefinition.goalAmount} ${habitDefinition.measurement} in ${habitDefinition.incrementAmount} ${habitDefinition.measurement} increments.`;
    } else {
        return habitDefinition.name; // Fallback
    }
}

// Handle goal type selection change
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

function getHabitDefinitionFormData() {
    const nameInput = document.getElementById('habitName');
    const goalTypeSelect = document.getElementById('habitGoalType');
    const measurementInput = document.getElementById('habitMeasurement');
    const goalAmountInput = document.getElementById('habitGoalAmount');
    const incrementAmountInput = document.getElementById('habitIncrementAmount');
    
    return {
        name: nameInput.value.trim(),
        goalType: goalTypeSelect.value,
        measurement: measurementInput.value.trim(),
        goalAmount: parseFloat(goalAmountInput.value) || 0,
        incrementAmount: parseFloat(incrementAmountInput.value) || 0
    };
}

// Handle habit definition form submission
function submitHabitDefinitionForm(event) {
    event.preventDefault();
    
    // Get form data
    const formHabitDefinitionData = getHabitDefinitionFormData();

    console.log(formHabitDefinitionData);  // REMOVE after testing

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
            saveSuccess = saveHabitDefinition(formHabitDefinitionData);
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

// Clear Habit Definition Form
function clearHabitDefinitionForm() {
    const form = document.getElementById('habitDefinitionsForm');
    if (form) {
        form.reset();
        handleGoalTypeChange();
    }
}

// Open Habit Definition Form For Addition
function openHabitDefinitionFormForAddition() {
    clearHabitDefinitionForm();
    toggleShowHideForm('habitDefinitionsInput');
    handleGoalTypeChange();
}

// Open Habit Definition Form for Editing
function openHabitDefinitionFormForEditing(habitDefinitionId) {
    console.log(`Opening habit definition form for editing: ${habitDefinitionId}`);
    clearHabitDefinitionForm();

    const editHabitDefinition = allHabitDefinitions.find(hd => hd.id === habitDefinitionId);
    if (!editHabitDefinition) {
        console.error(`Habit definition not found: ${habitDefinitionId}`);
        return;
    }

    const nameInput = document.getElementById('habitName');
    const goalTypeSelect = document.getElementById('habitGoalType');
    const measurementInput = document.getElementById('habitMeasurement');
    const goalAmountInput = document.getElementById('habitGoalAmount');
    const incrementAmountInput = document.getElementById('habitIncrementAmount');

    if (nameInput) nameInput.value = editHabitDefinition.name;
    if (goalTypeSelect) goalTypeSelect.value = editHabitDefinition.goalType;
    if (measurementInput) measurementInput.value = editHabitDefinition.measurement;
    if (goalAmountInput) goalAmountInput.value = editHabitDefinition.goalAmount;
    if (incrementAmountInput) incrementAmountInput.value = editHabitDefinition.incrementAmount; 

    console.log('// Trigger goal type change to show/hide fields')
    handleGoalTypeChange();
    
    // Change modal title
    const modalTitle = document.getElementById('habit-title');
    if (modalTitle) {
        modalTitle.textContent = 'Edit Habit Definition';
    }    
    document.getElementById('habitDefinitionsInput').dataset.editingId = habitDefinitionId;

    toggleShowHideForm('habitDefinitionsInput');
}

function generateHabitDefinitionsDisplay() {
    // Generate HTML
    let habitDefinitionsHTML = "";
    console.log(allHabitDefinitions);

    activeHabitDefinitions = getActiveHabitDefinitions();
    inactiveHabitDefinitions = getInactiveHabitDefinitions()

    if (activeHabitDefinitions.length === 0) {
        habitDefinitionsHTML += '<p class="no-habit-defs">No active habit definitions</p>';
    } else {
        habitDefinitionsHTML += '<p>Acitve</p><ul class="habit-defs-list">';
        activeHabitDefinitions.forEach(habitDefinition => {
                habitDefText = getHabitGoalDisplayText(habitDefinition);
                habitDefinitionsHTML += 
                    `<li class="habit-def-item" data-habit-def-id="${habitDefinition.id}" data-habit-def-info="${habitDefinition.name} - ${habitDefinition.goalType}">
                        <span class="habit-def-info">${habitDefText}</span>
                        <img class="edit" src="./assests/images/edit-icon.svg" alt="edit icon">
                        <img class="delete" src="./assests/images/delete-icon.svg" alt="delete icon">
                    </li>`;
            });
        habitDefinitionsHTML += '</ul>';
    }

    if (inactiveHabitDefinitions.length === 0) {
        habitDefinitionsHTML += '<p class="no-habit-defs">No inactive habit definitions</p>';
    } else {
        habitDefinitionsHTML += '<p>Inacitve</p><ul class="habit-defs-list">';
        inactiveHabitDefinitions.forEach(habitDefinition => {
                habitDefText = getHabitGoalDisplayText(habitDefinition);
                habitDefinitionsHTML += 
                    `<li class="habit-def-item" data-habit-def-id="${habitDefinition.id}" data-habit-def-info="${habitDefinition.name} - ${habitDefinition.goalType}">
                        <span class="habit-def-info">${habitDefText}</span>
                        <img class="restore" src="./assests/images/undo-icon.svg" alt="undo icon">
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

// Event delegation for key date actions 
function initializeHabitDefinitionEventListeners() {
    const habitDefinitionContainer = document.getElementById('habitDefinitionsDisplay');

    if (habitDefinitionContainer) {
        habitDefinitionContainer.addEventListener('click', function(e) {
            // Handle edit button clicks
            if (e.target.classList.contains('edit')) {
                const habitDefinitionItem = e.target.closest('.habit-def-item');
                const id = habitDefinitionItem.dataset.habitDefId;
                openHabitDefinitionFormForEditing(id);
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