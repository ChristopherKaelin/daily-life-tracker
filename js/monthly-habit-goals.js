//  HabitMonthGoals - tracks which habits to monitor each month
const DEFAULT_HABIT_MONTH_GOAL = {
 id: '',
 habitDefId: '',        // Links to the habit definition data model
 yearMonth: '',         //  "yyyy-mm" format
 updatedAt: ''
};


//  Open Manage Monthly Goals form   
function openManageMonthlyGoalsForm() {
    console.log('Opening Monthly Goals Form');
    generateManageMonthlyGoalsDisplay();
    toggleShowHideForm('monthlyGoalsModal');
    console.log('Monthly Goals Form opened');
}


//  Update the Manage Monthly Goals Form
//  Called when form is opened or when a habit goal is added/removed from being tracked
function generateManageMonthlyGoalsDisplay() {
    console.log('Generating Monthly Goals Display');
    populateTrackedHabitsList();
    populateAvailableHabitsList();
}


//  Populate list of habits BEING tracked for the given year/month
function populateTrackedHabitsList(yearMonth = null) {
  console.log('Populating Tracked Habits List for:', yearMonth);
  let trackedHabitsHTML = "";
  let trackedHabits = getTrackedHabitDefinitions(yearMonth);
  if (trackedHabits.length === 0) {
    trackedHabitsHTML = 'There are no habits being tracked.'
  } else {
    trackedHabitsHTML += "<ul>"
    for (habit of trackedHabits) {
        trackedHabitsHTML += `<li class='with-icon'>${habit.name}`;
        trackedHabitsHTML += (habit.goalType == 'cumulative') ? ` - ${habit.goalAmount} ${habit.measurement}` :  ``
        trackedHabitsHTML += `<img class="delete-icon" src="../assets/images/remove-target.svg" alt="remove target" onclick="removeHabitMonthGoal('${habit.id}')"></li>`;
    }
    trackedHabitsHTML += "</ul>"

  }
  const enrolledHabitsElement = document.getElementById('enrolledHabitsList');
  enrolledHabitsElement.innerHTML = trackedHabitsHTML;
}


//  Get Tracked Habit Definitions
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


//  Populate list of habits NOT BEING tracked for the given year/month
function populateAvailableHabitsList(yearMonth = null) {
  console.log('Populating Available Habits List for:', yearMonth);
  let availableHabitsHTML = "";
  let availableHabits = getAvailableHabitDefinitions(yearMonth);
  if (availableHabits.length === 0) {
    availableHabitsHTML = 'There are no untracked habits.';
  } else {
    availableHabitsHTML += "<ul>"
    for (habit of availableHabits) {
      availableHabitsHTML += `<li class='with-icon'>${habit.name}`;
      availableHabitsHTML += (habit.goalType == 'cumulative') ? ` - ${habit.goalAmount} ${habit.measurement}` :  ``
      availableHabitsHTML += `<img class="add-icon" src="../assets/images/add-target.svg" alt="add icon" onclick="saveNewHabitMonthGoal('${habit.id}')"></li>`;
    }
    availableHabitsHTML += "</ul>"
  }

  const availableHabitsElement = document.getElementById('availableHabitsList');
  availableHabitsElement.innerHTML = availableHabitsHTML;
}


//  Get Available (untracked) Habit Definitions
function getAvailableHabitDefinitions(yearMonth = null) {
    // Retrieve monthly gaols from localStorage
    const habitMonthGoals = getMonthlyHabitGoals(yearMonth) || [];
    
    // Returns array of habit definition ids being tracked for the given yearMonth
    const trackedHabitDefIds = habitMonthGoals
        .map(goal => goal.habitDefId);

    //  List of habit definitions that are not being tracked 
    const availableHabitDefinitions = allHabitDefinitions.filter(def => !trackedHabitDefIds.includes(def.id));

    return availableHabitDefinitions;
}


function saveNewHabitMonthGoal(habitDefId) {
    try {
        console.log('Saving new habit monthly goal for:', habitDefId);
        const habitMonthGoals = getMonthlyHabitGoals();
        console.log('Current habit month goals:', habitMonthGoals);
        const lastGoal = habitMonthGoals[habitMonthGoals.length - 1];
        console.log('Last goal:', lastGoal);

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


// Save all habit monthly goals to localStorage
function saveAllHabitMonthGoalsToStorage(habitMonthGoals, year = null) {
    try {
        if (!year) { year = appDateInfo.year; }

        localStorage.setItem(`dailyLifeHabitMonthGoals-${appDateInfo.year}`, JSON.stringify(habitMonthGoals));
        return true;
    } catch (error) {
        console.error('Error saving habit month goals to storage:', error);
        return false;
    }

}


// Load all habit definitions from localStorage
function getMonthlyHabitGoals(yearMonth = null) {
  if (!yearMonth) {
    yearMonth = `${appDateInfo.year}-${appDateInfo.month.toString().padStart(2, '0')}`;
  }
  monthlyGoals = JSON.parse(localStorage.getItem(`dailyLifeHabitMonthGoals-${appDateInfo.year}`)) || [];
  return monthlyGoals;
}

