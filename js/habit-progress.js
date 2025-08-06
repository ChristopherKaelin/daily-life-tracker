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
    const habitProgressEntries = getProgressForHabit(yearMonth);
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
  console.log(todaysWork);

  // Generate HTML for progress today and monthly
  todaysWorkHTML += "<div class='progress-content'>";
  monthlyWorkHTML += "<div class='progress-content'>";
  for (const habitDef of trackedHabits) {

    if (habitDef.goalType === 'daily') {
      // Today's Work
      if (todaysWork.filter(entry => entry.habitMonthGoalId === habitDef.id).length === 0) {
        todayIncrement = "<span class='not-done'> </span>";
      } else {
        todayIncrement = "<span class='done'> </span>";
      }
      
      // Monthly Work
      monthIncrement = monthlyWork.filter(entry => entry.habitMonthGoalId === habitDef.id).length;
    } else {
      todayIncrement = todaysWork
        .filter(entry => entry.habitMonthGoalId === habitDef.id)
        .reduce((sum, entry) => sum + entry.dailyValue, 0)
        * allHabitDefinitions.find(h => h.id === habitDef.habitDefId).incrementAmount;

      monthIncrement = monthlyWork
        .filter(entry => entry.habitMonthGoalId === habitDef.id)
        .reduce((sum, entry) => sum + entry.dailyValue, 0)
        * allHabitDefinitions.find(h => h.id === habitDef.habitDefId).incrementAmount;

    }
    todaysWorkHTML += `<div class="habit-entry"><span class="habit-name">${habitDef.name}:</span> ${todayIncrement} ${habitDef.measurement}</div>`;
    monthlyWorkHTML += `<div class="habit-entry"><span class="habit-name">${habitDef.name}:</span> ${monthIncrement} ${habitDef.measurement}</div>`;
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