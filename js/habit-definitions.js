// Global Habit Info


// Habit Initialization - runs when page loads
document.addEventListener('DOMContentLoaded', function() {
    
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
        return true;
    } catch (error) {
        console.error('Error saving habit definitions to storage:', error);
        return false;
    }
}

// Save habit definition to localStorage
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

// Update existing habit definition
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

// Show delete confirmation dialog
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

// Execute the habit definition deletion
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

// Delete (Inactivate) habit definition
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

// Show delete confirmation dialog
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

// Execute the habit definition deletion
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

// Validate cumulative habit definition
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

// Check if habit is daily type
function isDailyHabit(habitDefinition) {
    return habitDefinition.goalType === 'daily';
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
    } else if (isDailyHabit(habitDefinition)) {
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
    if (isDailyHabit(habitDefinition)) {
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

// Handle habit definition form submission
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

// Clear Habit Definition Form
function clearHabitDefinitionForm() {
    const form = document.getElementById('habitDefinitionsForm');
    if (form) {
        form.reset();
        handleGoalTypeChange();
    }
}

// Open Habit Definition Form For Addition
function openHabitDefinitionForm(mode, habitDefId) {
    clearHabitDefinitionForm();
    if (mode === 'edit') {
        populateHabitDefinitionForm(habitDefId);
    }
    toggleShowHideForm('habitDefinitionsInput');
}

// Open Habit Definition Form for Editing
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

    toggleShowHideForm('habitDefinitionsInput');
}

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
                        <img class="edit-icon" src="./assets/images/edit-icon.svg" alt="edit icon">
                        <img class="delete-icon" src="./assets/images/delete-icon.svg" alt="delete icon">
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
                        <img class="restore-icon" src="./assets/images/undo-icon.svg" alt="undo icon">
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
            if (e.target.classList.contains('edit-icon')) {
                const habitDefinitionItem = e.target.closest('.habit-def-item');
                const habitDefId = habitDefinitionItem.dataset.habitDefId;
                openHabitDefinitionForm('edit', habitDefId);
            }
            
            // Handle delete button clicks
            if (e.target.classList.contains('delete-icon')) {
                const habitDefinitionItem = e.target.closest('.habit-def-item');
                const id = habitDefinitionItem.dataset.habitDefId;
                const description = habitDefinitionItem.dataset.habitDefInfo; 
                confirmDeleteHabitDefinition(id, description);
            }
            
            // Handle restore button clicks
            if (e.target.classList.contains('restore-icon')) {
                const habitDefinitionItem = e.target.closest('.habit-def-item');
                const id = habitDefinitionItem.dataset.habitDefId;
                const description = habitDefinitionItem.dataset.habitDefInfo; 
                confirmRestoreHabitDefinition(id, description);
            }
        });
    }
}