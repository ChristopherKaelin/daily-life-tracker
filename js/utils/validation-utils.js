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
    } else if (habitDefinition.goalType !== 'daily') {
        // Invalid goal type
        errors.push('Invalid goal type. Must be "daily" or "cumulative"');
    }
    
    // Combine and return results
    return {
        isValid: errors.length === 0,
        errors: errors
    };
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

