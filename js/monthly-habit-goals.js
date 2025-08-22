//  HabitMonthGoals - tracks which habits to monitor each month
const DEFAULT_HABIT_MONTH_GOAL = {
 id: '',
 habitDefId: '',        // Links to the habit definition data model
 yearMonth: '',         //  "yyyy-mm" format
 updatedAt: ''
};


/**
 * Opens the Manage Monthly Goals form and generates the display for tracked and available habits.
 */
function openManageMonthlyGoalsForm() {
    generateManageMonthlyGoalsDisplay();
    toggleShowHideForm('monthlyGoalsModal');
}


/**
 * Updates the Manage Monthly Goals form by populating both tracked and available habits lists.
 */
function generateManageMonthlyGoalsDisplay() {
    populateTrackedHabitsList();
    populateAvailableHabitsList();
}


/**
 * Populates the list of habits currently being tracked for the specified year and month.
 *
 * @param {string|null} yearMonth - The year and month in 'yyyy-mm' format, or null for current
 */
function populateTrackedHabitsList(yearMonth = null) {
  let trackedHabitsHTML = "";
  let trackedHabits = getTrackedHabitDefinitions(yearMonth);
  if (trackedHabits.length === 0) {
    trackedHabitsHTML = 'There are no habits being tracked.'
  } else {
    trackedHabitsHTML += "<ul>"
    for (habit of trackedHabits) {
        trackedHabitsHTML += `<li class='hdr-with-icon'>${habit.name}`;
        trackedHabitsHTML += (habit.goalType == 'cumulative') ? ` - ${habit.goalAmount} ${habit.measurement}` :  ``
        trackedHabitsHTML += `<img class="icon icon-md" src="../assets/images/remove-target.svg" alt="remove target" onclick="removeHabitMonthGoal('${habit.id}')"></li>`;
    }
    trackedHabitsHTML += "</ul>"

  }
  const enrolledHabitsElement = document.getElementById('enrolledHabitsList');
  enrolledHabitsElement.innerHTML = trackedHabitsHTML;
}


/**
 * Retrieves the habit definitions that are being tracked for the specified year and month.
 *
 * @param {string|null} yearMonth - The year and month in 'yyyy-mm' format, or null for current
 * @returns {Array} Array of tracked habit definitions with goal details
 */
function getTrackedHabitDefinitions(yearMonth = null) {
  const habitMonthGoals = getMonthlyHabitGoals(yearMonth);
  
  // Returns an array of month habit goals and the habit definition information
  return habitMonthGoals.map(goal => {
      const habitDef = allHabitDefinitions.find(def => def.id === goal.habitDefId) || {};
      return {
          ...goal,
          name: habitDef.name || '',
          goalType: habitDef.goalType || '',
          goalAmount: habitDef.goalAmount || '',
          measurement: habitDef.measurement || ''
      };
  });
}


/**
 * Removes a habit month goal by its ID and updates the display and localStorage.
 *
 * @param {string|null} goalID - The ID of the goal to remove
 * @returns {boolean|undefined} False on error, undefined on success
 */
function removeHabitMonthGoal(goalID = null) {
    try {
        // Get the current data
        let habitMonthGoals = JSON.parse(localStorage.getItem('dailyLifeHabitMonthGoals-2025'));

        // Filter out the item with id "goal-0002"
        habitMonthGoals = habitMonthGoals.filter(goal => goal.id !== goalID);

        // Save the updated array back to localStorage
        localStorage.setItem('dailyLifeHabitMonthGoals-2025', JSON.stringify(habitMonthGoals));

        //  Update the display form
        generateManageMonthlyGoalsDisplay();

    } catch (error) {
        // Error handling
        console.error('Error removing monthly habit goal:', error);
        return false;
    }

}


/**
 * Populates the list of habits not being tracked for the specified year and month.
 *
 * @param {string|null} yearMonth - The year and month in 'yyyy-mm' format, or null for current
 */
function populateAvailableHabitsList(yearMonth = null) {
  let availableHabitsHTML = "";
  let availableHabits = getAvailableHabitDefinitions(yearMonth);
  if (availableHabits.length === 0) {
    availableHabitsHTML = 'There are no untracked habits.';
  } else {
    availableHabitsHTML += "<ul>"
    for (habit of availableHabits) {
      availableHabitsHTML += `<li class='hdr-with-icon'>${habit.name}`;
      availableHabitsHTML += (habit.goalType == 'cumulative') ? ` - ${habit.goalAmount} ${habit.measurement}` :  ``
      availableHabitsHTML += `<img class="add icon icon-md" src="../assets/images/add-target.svg" alt="add icon" onclick="saveNewHabitMonthGoal('${habit.id}')"></li>`;
    }
    availableHabitsHTML += "</ul>"
  }

  const availableHabitsElement = document.getElementById('availableHabitsList');
  availableHabitsElement.innerHTML = availableHabitsHTML;
}


/**
 * Retrieves habit definitions that are not being tracked for the specified year and month.
 *
 * @param {string|null} yearMonth - The year and month in 'yyyy-mm' format, or null for current
 * @returns {Array} Array of available habit definitions
 */
function getAvailableHabitDefinitions(yearMonth = null) {
    // Retrieve monthly gaols from localStorage
    const habitMonthGoals = getMonthlyHabitGoals(yearMonth) || [];
    
    // Returns array of habit definition ids being tracked for the given yearMonth
    const trackedHabitDefIds = habitMonthGoals
        .map(goal => goal.habitDefId);

    //  List of habit definitions that are not being tracked 
    const availableHabitDefinitions = allHabitDefinitions
      .filter(def => !trackedHabitDefIds.includes(def.id))
      .filter(def => def.isActive);

    return availableHabitDefinitions;
}


/**
 * Saves a new habit month goal for the given habit definition ID and updates the display.
 *
 * @param {string} habitDefId - The ID of the habit definition to track
 * @returns {boolean|undefined} False on error, undefined on success
 */
function saveNewHabitMonthGoal(habitDefId) {
    try {
        const habitMonthGoals = getMonthlyHabitGoals();
        const lastGoal = habitMonthGoals[habitMonthGoals.length - 1];

        // Generate next sequential ID for the month
        let nextGoalNumber = 1;
        if (lastGoal) {
            const lastGoalNumber = parseInt(lastGoal.id.split('-')[1]);
            nextGoalNumber = lastGoalNumber + 1;
        }
        let nextMonthlyGoalId = `goal-${nextGoalNumber.toString().padStart(4, '0')}`;

        // Create the new habit definition object
        const newMonthlyGoal = {
            id: nextMonthlyGoalId,
            habitDefId: habitDefId,
            yearMonth: appDateInfo.yearMonth,
            updatedAt: new Date().toISOString()
        };    

        // Add to habitMonthGoals array
        habitMonthGoals.push(newMonthlyGoal);

        // Save updated array to localStorage
        saveAllHabitMonthGoalsToStorage(habitMonthGoals);

        //  Update the display form
        generateManageMonthlyGoalsDisplay();
        
    } catch (error) {
        // Error handling
        console.error('Error saving habit monthly goal:', error);
        return false;
    }
    
}


/**
 * Saves all habit monthly goals to localStorage for the specified year, updating only the current month.
 *
 * @param {Array} habitMonthGoals - Array of habit month goals to save
 * @param {number|null} year - The year for which to save goals, or null for current year
 * @returns {boolean} Success status
 */
function saveAllHabitMonthGoalsToStorage(habitMonthGoals, year = null) {
    try {
        if (!year) { year = appDateInfo.year; }
        
        // Get ALL months' data for the year
        const allYearGoals = JSON.parse(localStorage.getItem(`dailyLifeHabitMonthGoals-${year}`)) || [];
        
        // Remove current month's goals from the full dataset
        const currentYearMonth = appDateInfo.yearMonth;
        const otherMonthsGoals = allYearGoals.filter(goal => goal.yearMonth !== currentYearMonth);
        
        // Add current month's goals back in
        const updatedGoals = [...otherMonthsGoals, ...habitMonthGoals];
        
        localStorage.setItem(`dailyLifeHabitMonthGoals-${year}`, JSON.stringify(updatedGoals));
        return true;
    } catch (error) {
        console.error('Error saving habit month goals to storage:', error);
        return false;
    }
}


/**
 * Loads all habit month goals for the specified year and month from localStorage.
 *
 * @param {string|null} yearMonth - The year and month in 'yyyy-mm' format, or null for current
 * @returns {Array} Array of monthly habit goals
 */
function getMonthlyHabitGoals(yearMonth = null) {
  if (!yearMonth) {
    yearMonth = `${appDateInfo.yearMonth}`;
  }
  yearlyGoals = JSON.parse(localStorage.getItem(`dailyLifeHabitMonthGoals-${appDateInfo.year}`)) || [];
  monthlyGoals = yearlyGoals.filter(goal => goal.yearMonth === yearMonth);
  return monthlyGoals;
}

