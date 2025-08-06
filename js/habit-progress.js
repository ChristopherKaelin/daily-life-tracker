const DEFAULT_PROGRESS_ENTRY = {
    id: '',
    habitMonthGoalId: '',   // Links to the month goal data model
    date: '',
    dailyValue: 0,          // 1 for daily, amount of increments for cumulative habits
    updatedAt: ''
};


function saveProgressEntry(progressData) {
  try {
    // Generate next sequential ID for the month
    const yearMonth = progressData.date ? progressData.date.substring(0, 7) : appDateInfo.yearMonth;
    console.log(`Saving progress for yearMonth: ${yearMonth}`);
    const habitProgressEntries = getProgressForMonth(yearMonth);
    console.log(`Current entries for ${yearMonth}:`, habitProgressEntries);
    const lastEntry = habitProgressEntries[habitProgressEntries.length - 1];

    let nextNumber = 1;
    if (lastEntry) {
        const lastNumber = parseInt(lastEntry.id.split('-')[1]);
        nextNumber = lastNumber + 1;
    }
    let nextProgressEntryId = `progress-${nextNumber.toString().padStart(4, '0')}`;

    // Create the progress entry
    const newProgressEntry = {
        ...progressData,
        id: nextProgressEntryId,
        updatedAt: new Date().toISOString()
    };

    // Add to array and save
    habitProgressEntries.push(newProgressEntry);
    return saveAllProgressToStorage(habitProgressEntries, yearMonth);
  } catch (error) {
      console.error('Error saving progress entry:', error);
      return false;
  }
}


function saveAllProgressToStorage(habitProgressEntries, yearMonth) {
   try {
       const storageKey = `dailyLifeHabitProgress-${yearMonth}`;
       localStorage.setItem(storageKey, JSON.stringify(habitProgressEntries));
       return true;
   } catch (error) {
       console.error('Error saving progress to storage:', error);
       return false;
   }
}


function getProgressForMonth(progressYearMonth) {
   try {
       const storageKey = `dailyLifeHabitProgress-${progressYearMonth}`;
       const storedData = localStorage.getItem(storageKey);
       return storedData ? JSON.parse(storedData) : [];
   } catch (error) {
       console.error('Error loading progress entries:', error);
       return [];
   }
}


function getProgressForDate(progressDate, monthlyWork = null) {
  try {
    // Validate date format
    if (progressDate && !/^\d{4}-\d{2}-\d{2}$/.test(progressDate)) {
        throw new Error('Date must be in YYYY-MM-DD format');
    }
    if (!monthlyWork) {
      console.log(`Loading monthly work for date: ${progressDate}`);
      const yearMonth = progressDate ? progressDate.substring(0, 7) : `${appDateInfo.year}-${appDateInfo.month.toString().padStart(2, '0')}`;
      monthlyWork = getProgressForMonth(yearMonth);
    }

    return monthlyWork.filter(entry => entry.date === progressDate);

  } catch (error) {
      console.error('Error getting progress for date:', error);
      return [];
  }
}


function getMonthlyProgress(habitMonthGoalId, habitDefId, yearMonth) {
  try {
    console.log(`Getting monthly progress for goal: ${habitMonthGoalId}, habit: ${habitDefId}, month: ${yearMonth}`);
    // Validate yearMonth format
    if (yearMonth && !/^\d{4}-\d{2}$/.test(yearMonth)) {
      throw new Error('yearMonth must be in YYYY-MM format');
    }

    // Validate habitDefId format
    if (!habitMonthGoalId || !habitMonthGoalId.startsWith('goal-')) {
      throw new Error('Invalid habit goal ID format');
    }

    // Load all progress entries for the month
    const progressEntries = getProgressForMonth(yearMonth);
    const habitEntries = progressEntries.filter(entry => entry.habitMonthGoalId === habitMonthGoalId);
    console.log(`Found ${habitEntries.length} entries for habit goal: ${habitMonthGoalId}`);

    // Get habit definition to check goalAmount
    const habitDef = allHabitDefinitions.find(habit => habit.id === habitDefId);
    if (!habitDef) {
      throw new Error(`Habit definition not found: ${habitDefId}`);
    }
    
    if (habitDef.goalType === 'daily') {
      completedProgress = habitEntries.length;
      goalTotal = (new Date()).getDate();     // number of days elapsed in the month
    } else {
      completedProgress = habitEntries.reduce((sum, entry) => sum + entry.dailyValue, 0);
      goalTotal = habitDef.goalAmount;        // Cumulative goal amount from habit definition
    }

    return {
      habitName: habitDef.name,
      goalType: habitDef.goalType,   // 'daily' or 'cumulative'
      completedProgress: completedProgress,
      goalTotal: goalTotal
};

  } catch (error) {
      console.error('Error getting monthly progress:', error);
  }

}


function getProgressTrackingFormData() {
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


function submitProgressTrackingForm(event) {
  event.preventDefault();
  const formData = getProgressTrackingFormData();

  // Validate here
  const validation = validateProgressEntry(formData);
  if (!validation.isValid) {
      displayValidationErrors(validation.errors, 'progressTrackingForm');
      return;
  }
  
  const success = saveProgressEntry(formData);
  if (success) {
    // Clear form and close modal
    document.getElementById('progressTrackingForm').reset();
    toggleShowHideForm('progressTrackingModal');
    
    // Refresh any displays that show progress
    // generateHabitsDisplay() or similar
  } else {
    displayValidationErrors(['Failed to save progress'], 'progressTrackingForm');
  }
}


function generateHabitTrackerDisplay(yearMonth = null) {
  if (!yearMonth) {
    yearMonth = appDateInfo.yearMonth;
  }

  let todaysWorkHTML = "<h4>Today's Progress:</h4>";
  let monthlyWorkHTML = "<h4>Your Monthly Progress:</h4>";

  // Get the list of habits being tracked for the month
  trackedHabits = getTrackedHabitDefinitions(yearMonth);

  // Get the monthly and today progress entries
  let monthlyWork = getProgressForMonth(yearMonth);
  let todaysWork = getProgressForDate(`${yearMonth}-${appDateInfo.day.toString().padStart(2, '0')}`, monthlyWork);

  // Generate HTML for progress today and monthly
  todaysWorkHTML += "<div class='progress-content'>";
  monthlyWorkHTML += "<div class='progress-content'>";
  for (const habitDef of trackedHabits) {

    if (habitDef.goalType === 'daily') {
      // Today's Work
      const isCompleted = todaysWork.filter(entry => entry.habitMonthGoalId === habitDef.id).length > 0;
      const checkboxChecked = isCompleted ? 'checked' : '';
      const todayDisplay = `<input type="checkbox" ${checkboxChecked} onchange="toggleDailyHabit('${habitDef.id}')" class="habit-checkbox">`;
      
      // Monthly Work
      const monthCount = monthlyWork.filter(entry => entry.habitMonthGoalId === habitDef.id).length;
      todaysWorkHTML += `<div class="habit-entry">
        <span class="habit-name">${habitDef.name}:</span> 
        ${todayDisplay}
      </div>`;
      
    } else {
      // Cumulative habits - get current values
      const todayValue = todaysWork
        .filter(entry => entry.habitMonthGoalId === habitDef.id)
        .reduce((sum, entry) => sum + entry.dailyValue, 0);
      
      // Get habit definition for increment amount
      const habitDefinition = allHabitDefinitions.find(h => h.id === habitDef.habitDefId);
      const incrementAmount = habitDefinition ? habitDefinition.incrementAmount : 0.5;
      
      // Calculate display values
      const todayDisplayValue = (todayValue * incrementAmount).toFixed(1);

      todaysWorkHTML += 
        `<div class="habit-entry">
          <span class="habit-name">${habitDef.name}:</span>
          <div class="habit-controls">
            <img src="./assets/images/remove.svg" alt="decrease" class="delete-icon-sm" onclick="decrementHabit('${habitDef.id}', ${incrementAmount})">
            <span class="habit-progress">${todayDisplayValue} ${habitDef.measurement}</span>
            <img src="./assets/images/add.svg" alt="increase" class="add-icon-sm" onclick="incrementHabit('${habitDef.id}', ${incrementAmount})">
          </div>
        </div>`;
    }
    
    // Monthly Work with Progress Bars
    const monthValue = monthlyWork
      .filter(entry => entry.habitMonthGoalId === habitDef.id)
      .reduce((sum, entry) => sum + entry.dailyValue, 0);

    let monthDisplayValue, progressPercentage, goalTotal;

    if (habitDef.goalType === 'daily') {
      monthDisplayValue = monthValue;
      goalTotal = new Date().getDate();
      progressPercentage = (monthDisplayValue / goalTotal) * 100, 100;
    } else {
      const habitDefinition = allHabitDefinitions.find(h => h.id === habitDef.habitDefId);
      const incrementAmount = habitDefinition ? habitDefinition.incrementAmount : 0.5;
      monthDisplayValue = (monthValue * incrementAmount).toFixed(1);
      goalTotal = habitDefinition ? habitDefinition.goalAmount : 1;
      progressPercentage = (monthDisplayValue / goalTotal) * 100, 100;
    }

    monthlyWorkHTML += `
      <div class="habit-progress-item">
        <div class="habit-progress-header">
          <span class="habit-name">${habitDef.name}:</span>
          <span class="habit-value">${monthDisplayValue} ${habitDef.measurement || (habitDef.goalType === 'daily' ? 'days' : '')}</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar">
            <div class="progress-fill ${getProgressColorClass(progressPercentage)}" style="width: ${progressPercentage}%"></div>
          </div>
          <span class="progress-percentage">${Math.round(progressPercentage)}%</span>
        </div>
      </div>
    `;
  }

  todaysWorkHTML += "</div>";
  monthlyWorkHTML += "</div>";

  // Update the display for habits completed today
  // <div id="completed-today"></div>
  const todaysWorkElement = document.getElementById('today-work');
  todaysWorkElement.innerHTML = todaysWorkHTML;

  // Update the display for monthly progress
  // <div id="monthly-progress"></div>
  const monthlyWorkElement = document.getElementById('monthly-work');
  monthlyWorkElement.innerHTML = monthlyWorkHTML;
}


// Handle daily habit checkbox toggle
function toggleDailyHabit(habitMonthGoalId) {
  const today = new Date().toISOString().split('T')[0];
  const yearMonth = today.substring(0, 7);
  
  // Get current progress for this habit today
  const todaysEntries = getProgressForDate(today);
  const existingEntry = todaysEntries.find(entry => entry.habitMonthGoalId === habitMonthGoalId);
  
  if (existingEntry) {
    // Remove the entry (uncheck)
    removeProgressEntry(existingEntry.id, yearMonth);
  } else {
    // Add new entry (check)
    const progressData = {
      habitMonthGoalId: habitMonthGoalId,
      date: today,
      dailyValue: 1
    };
    saveProgressEntry(progressData);
  }
  
  // Refresh display
  generateHabitTrackerDisplay();
}


// Handle increment for cumulative habits
function incrementHabit(habitMonthGoalId, incrementAmount) {
  const today = new Date().toISOString().split('T')[0];
  
  // Get today's entry or create new one
  const todaysEntries = getProgressForDate(today);
  const existingEntry = todaysEntries.find(entry => entry.habitMonthGoalId === habitMonthGoalId);
  
  if (existingEntry) {
    // Update existing entry
    updateProgressEntry(existingEntry.id, existingEntry.dailyValue + 1);
  } else {
    // Create new entry
    const progressData = {
      habitMonthGoalId: habitMonthGoalId,
      date: today,
      dailyValue: 1
    };
    saveProgressEntry(progressData);
  }
  
  // Refresh display
  generateHabitTrackerDisplay();
}


// Handle decrement for cumulative habits
function decrementHabit(habitMonthGoalId, incrementAmount) {
  const today = new Date().toISOString().split('T')[0];
  const yearMonth = today.substring(0, 7);
  
  // Get today's entry
  const todaysEntries = getProgressForDate(today);
  const existingEntry = todaysEntries.find(entry => entry.habitMonthGoalId === habitMonthGoalId);
  
  if (existingEntry && existingEntry.dailyValue > 1) {
    // Decrease the value
    updateProgressEntry(existingEntry.id, existingEntry.dailyValue - 1);
  } else if (existingEntry && existingEntry.dailyValue === 1) {
    // Remove the entry entirely
    removeProgressEntry(existingEntry.id, yearMonth);
  }
  // If no entry exists, do nothing (can't go below 0)
  
  // Refresh display
  generateHabitTrackerDisplay();
}


// Update existing progress entry
function updateProgressEntry(entryId, newDailyValue) {
  const yearMonth = appDateInfo.yearMonth;
  const progressEntries = getProgressForMonth(yearMonth);
  
  const entryIndex = progressEntries.findIndex(entry => entry.id === entryId);
  if (entryIndex !== -1) {
    progressEntries[entryIndex].dailyValue = newDailyValue;
    progressEntries[entryIndex].updatedAt = new Date().toISOString();
    saveAllProgressToStorage(progressEntries, yearMonth);
  }
}


// Remove progress entry
function removeProgressEntry(entryId, yearMonth) {
  const progressEntries = getProgressForMonth(yearMonth);
  const filteredEntries = progressEntries.filter(entry => entry.id !== entryId);
  saveAllProgressToStorage(filteredEntries, yearMonth);
}

function getProgressColorClass(percentage) {
  if (percentage > 100) return 'progress-exceeded';
  if (percentage >= 90) return 'progress-full';
  if (percentage >= 70) return 'progress-high';
  if (percentage >= 50) return 'progress-medium'
  if (percentage >= 30) return 'progress-low-medium';
  return 'progress-low';
}
