const DEFAULT_PROGRESS_ENTRY = {
  id: '',
  habitDefId: '',
  date: '',
  amountDone: 0,
  yearMonth: '',
  updatedAt: ''
};

// 1. Save or update a progress entry
function saveProgressEntry(progressEntry) {
    let nextHabitDefinitionId = `habitDefinition-${nextNumber.toString().padStart(4, '0')}`;

  // Validate required fields (habitDefId, date, value)
  // Set timestamp to current datetime
  // Check if entry exists for this habitDefId + date
  // If exists: update existing entry, set updatedAt
  // If new: create new entry with new id
  // Calculate completed status based on habit type
  // Save to storage
  // Return saved entry or error
}

// 2. Get all progress entries for a specific habit
function getProgressForHabit(habitDefId, options = {}) {
  // options: { startDate, endDate, limit, sortOrder }
  // Query all entries matching habitDefId
  // Apply date range filters if provided
  // Sort by date (default ascending)
  // Apply limit if specified
  // Return array of progress entries
}

// 3. Get all progress entries for a specific date
function getProgressForDate(date) {
  // Convert date to consistent format (YYYY-MM-DD)
  // Query all entries matching the date
  // Sort by habitDefId or habit name
  // Return array of progress entries for that date
}

// 4. Get monthly summary/aggregation for cumulative habits
function getMonthlyProgress(habitDefId, yearMonth) {
  // yearMonth format: "2024-07"
  // Get all entries for habitDefId in specified month
  // Sum up all value amounts
  // Get habit definition to check goalAmount
  // Calculate completion percentage
  // Return { totalValue, goalAmount, completed, entries, completionPercentage }
}

function getHabitTrackingFormData() {
    const habitToTrackId = document.getElementById('habitDefinitionToTrackId').value;
    const habitTrackDate = document.getElementById('habitTrackDate').value;
    const amountDone = document.getElementById('habitMeasurement').value.trim();
    const yearMonth = parseFloat(document.getElementById('habitGoalAmount').value);
    const incrementAmountInput = parseFloat(document.getElementById('habitIncrementAmount').value);
    
    
    return {
        name: nameInput,
        goalType: goalTypeSelect,
        measurement: measurementInput || '',
        goalAmount: goalAmountInput || 0,
        incrementAmount: incrementAmountInput || 0
    };
}

