const DEFAULT_PROGRESS_ENTRY = {
    id: '',
    habitMonthGoalId: '',   // Links to the month goal data model
    date: '',
    dailyValue: 0,          // 1 for daily, amount of increments for cumulative habits
    updatedAt: ''
};


/**
 * Saves a new progress entry for a habit, generating a unique ID and updating localStorage.
 * Returns true if successful, or false if an error occurs during saving.
 *
 * @param {Object} progressData - The progress entry data to save
 * @returns {boolean} Success status
 */
function saveProgressEntry(progressData) {
  try {
    // Generate next sequential ID for the month
    const yearMonth = progressData.date ? progressData.date.substring(0, 7) : appDateInfo.yearMonth;
    const habitProgressEntries = getProgressForMonth(yearMonth);
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


/**
 * Saves all progress entries for a given month to localStorage.
 * Returns true if successful, or false if an error occurs during saving.
 *
 * @param {Array} habitProgressEntries - Array of progress entries to save
 * @param {string} yearMonth - The year and month in 'yyyy-mm' format
 * @returns {boolean} Success status
 */
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


/**
 * Loads all progress entries for a specific month from localStorage.
 * Returns an array of progress entries, or an empty array if none are found.
 *
 * @param {string} progressYearMonth - The year and month in 'yyyy-mm' format
 * @returns {Array} Array of progress entries
 */
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


/**
 * Retrieves progress entries for a specific date, optionally using a provided monthly work array.
 * Returns an array of entries for the given date, or an empty array if none are found.
 *
 * @param {string} progressDate - The date in 'yyyy-mm-dd' format
 * @param {Array|null} monthlyWork - Optional array of monthly progress entries
 * @returns {Array} Array of progress entries for the date
 */
function getProgressForDate(progressDate, monthlyWork = null) {
  try {
    // Validate date format
    if (progressDate && !/^\d{4}-\d{2}-\d{2}$/.test(progressDate)) {
        throw new Error('Date must be in YYYY-MM-DD format');
    }
    if (!monthlyWork) {
      const yearMonth = progressDate ? progressDate.substring(0, 7) : `${appDateInfo.year}-${appDateInfo.month.toString().padStart(2, '0')}`;
      monthlyWork = getProgressForMonth(yearMonth);
    }

    return monthlyWork.filter(entry => entry.date === progressDate);

  } catch (error) {
      console.error('Error getting progress for date:', error);
      return [];
  }
}


/**
 * Calculates the monthly progress for a habit, including completed progress and goal total.
 * Returns an object with habit name, type, completed progress, and goal total.
 *
 * @param {string} habitMonthGoalId - The ID of the habit month goal
 * @param {string} habitDefId - The ID of the habit definition
 * @param {string} yearMonth - The year and month in 'yyyy-mm' format
 * @returns {Object} Monthly progress summary
 */
function getMonthlyProgress(habitMonthGoalId, habitDefId, yearMonth) {
  try {
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


/**
 * Generates and displays the habit tracker for the selected date and month.
 * Updates the UI with today's progress and monthly progress for all tracked habits.
 */
function generateHabitTrackerDisplay() {
  const dateToUse = selectedHabitDate || appDateInfo.date;
  const dateToUseInfo = getDateInfo(dateToUse);
  yearMonth = dateToUseInfo.yearMonth;

  let todaysWorkHTML = `<h4> ${dateToUseInfo.dayName}, ${dateToUseInfo.monthName} ${dateToUseInfo.dayOrdinal} Progress: </h4>`;
  let monthlyWorkHTML = `<h4>${dateToUseInfo.monthName}'s Monthly Progress:</h4>`;

  // Get the list of habits being tracked for the month
  trackedHabits = getTrackedHabitDefinitions(yearMonth);

  // Get the monthly and today progress entries
  const monthlyWork = getProgressForMonth(yearMonth);
  let todaysWork = getProgressForDate(dateToUse, monthlyWork);

  // Generate HTML for progress today and monthly
  todaysWorkHTML += "<div class='progress-content'>";
  monthlyWorkHTML += "<div class='progress-content'>";
  for (const habitDef of trackedHabits) {

    if (habitDef.goalType === 'daily') {
      // Today's Work
      let todayDisplay = '';

      if (dateToUseInfo.date <= todayDateInfo.date) {
        const isCompleted = todaysWork.filter(entry => entry.habitMonthGoalId === habitDef.id).length > 0;
        const checkboxChecked = isCompleted ? 'checked' : '';
        todayDisplay = `<input type="checkbox" ${checkboxChecked} onchange="toggleDailyHabit('${habitDef.id}')" class="habit-checkbox">`;
      }
      
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
          <span class="habit-name">${habitDef.name}:</span>`;
      if (dateToUseInfo.date <= todayDateInfo.date) {
        todaysWorkHTML +=
          `<div class="habit-controls">
            <img src="./assets/images/remove.svg" alt="decrease" class="icon icon-sm" onclick="decrementHabit('${habitDef.id}')">
            <span class="habit-progress">${todayDisplayValue} ${habitDef.measurement}</span>
            <img src="./assets/images/add.svg" alt="increase" class="icon icon-sm" onclick="incrementHabit('${habitDef.id}')">
          </div>`;
      }
      todaysWorkHTML +=
          `</div>`;
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
  const todaysWorkElement = document.getElementById('today-work');
  todaysWorkElement.innerHTML = todaysWorkHTML;

  // Update the display for monthly progress
  const monthlyWorkElement = document.getElementById('monthly-work');
  monthlyWorkElement.innerHTML = monthlyWorkHTML;
}


/**
 * Handles toggling of daily habit completion for the selected date.
 * Adds or removes the progress entry and refreshes the tracker display.
 *
 * @param {string} habitMonthGoalId - The ID of the habit month goal
 */
function toggleDailyHabit(habitMonthGoalId) {
  //  If selectedHabitDate is null, getDateInfo() will use today's date
  const selectedDateInfo = getDateInfo(selectedHabitDate);
  const today = selectedDateInfo.date;
  const yearMonth = selectedDateInfo.yearMonth;
  
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


/**
 * Increments the progress value for a cumulative habit for the selected date.
 * Updates or creates the progress entry and refreshes the tracker display.
 *
 * @param {string} habitMonthGoalId - The ID of the habit month goal
 */
function incrementHabit(habitMonthGoalId) {
  //  If selectedHabitDate is null, getDateInfo() will use today's date
  const selectedDateInfo = getDateInfo(selectedHabitDate);
  const today = selectedDateInfo.date;
    
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


/**
 * Decrements the progress value for a cumulative habit for the selected date.
 * Updates or removes the progress entry and refreshes the tracker display.
 *
 * @param {string} habitMonthGoalId - The ID of the habit month goal
 */
function decrementHabit(habitMonthGoalId) {
  //  If selectedHabitDate is null, getDateInfo() will use today's date
  const selectedDateInfo = getDateInfo(selectedHabitDate);
  const today = selectedDateInfo.date;
  const yearMonth = selectedDateInfo.yearMonth;
  
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


/**
 * Updates the daily value of an existing progress entry and saves changes to localStorage.
 *
 * @param {string} entryId - The ID of the progress entry to update
 * @param {number} newDailyValue - The new daily value to set
 */
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


/**
 * Removes a progress entry by its ID for the specified month and saves changes to localStorage.
 *
 * @param {string} entryId - The ID of the progress entry to remove
 * @param {string} yearMonth - The year and month in 'yyyy-mm' format
 */
function removeProgressEntry(entryId, yearMonth) {
  const progressEntries = getProgressForMonth(yearMonth);
  const filteredEntries = progressEntries.filter(entry => entry.id !== entryId);
  saveAllProgressToStorage(filteredEntries, yearMonth);
}

/**
 * Returns a CSS class name based on the progress percentage for visual feedback.
 * Used to style progress bars according to completion level.
 *
 * @param {number} percentage - The progress percentage
 * @returns {string} CSS class name for progress color
 */
function getProgressColorClass(percentage) {
  if (percentage > 100) return 'progress-exceeded';
  if (percentage >= 90) return 'progress-full';
  if (percentage >= 70) return 'progress-high';
  if (percentage >= 50) return 'progress-medium'
  if (percentage >= 30) return 'progress-low-medium';
  return 'progress-low';
}
