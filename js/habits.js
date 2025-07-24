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

// Validate cumulative habit definition
function validateCumulativeHabitDefinition(habitDefinition) {
    const errors = [];
    
    if (!habitDefinition.measurement || habitDefinition.measurement.trim() === '') {
        errors.push('Measurement unit is required (miles, hours, pages, etc.)');
    }
    
    if (!habitDefinition.goalAmount || habitDefinition.goalAmount <= 0) {
        errors.push('Goal amount must be greater than 0');
    }
    
    if (!habitDefinition.incrementAmount || habitDefinition.incrementAmount <= 0) {
        errors.push('Increment amount must be greater than 0');
    }
    
    if (habitDefinition.incrementAmount > habitDefinition.goalAmount) {
        errors.push('Increment amount cannot be larger than goal amount');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
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
        const cumulativeValidation = validateCumulativeHabit(habitDefinition);
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
        return  `${habitDefinition.name} ${habitDefinition.goalAmount} ${habitDefinition.measurement} (${habitDefinition.incrementAmount} ${habitDefinition.measurement} increments)`;
    } else {
        return habitDefinition.name; // Fallback
    }
}
