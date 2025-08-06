// App initialization - runs when page loads
document.addEventListener('DOMContentLoaded', function() {
    
    // Get Dashboard Data
    appDateInfo = getDateInfo();
    allKeyDates = loadAllKeyDatesFromStorage();
    allHabitDefinitions = loadAllHabitDefinitions(); 
    
    // Initialize User settings
    initializeUserSettings();

    //  Initialize Calendar Section Display 
    generateCalendarDisplay(appDateInfo);
    generateKeyDatesDisplay(appDateInfo, allKeyDates);
    generateHabitTrackerDisplay(appDateInfo.yearMonth);
    initializeKeyDateEventListeners() 


    //==========================================
    //  TESTING - Remove after testing
    //==========================================
    // testFunction();

});

function testFunction() {
    console.log('===========  Testing Started  ============');
    console.log('==========================================')

    // Get App Wide Data
    allHabitDefinitions = loadAllHabitDefinitions(); 
    
    // currentProgressEntries = getProgressForMonth('2025-08');
    // console.log('Current Progress Entries for 2025-08:', currentProgressEntries);

    specificDate = new Date().toISOString().substring(0, 10)
    dateSpecificEntries = getProgressForDate(specificDate);
    console.log(`'Current Progress Entries for ${specificDate}:`, dateSpecificEntries);

    // Get Monthly Progress for a specific habit
    console.log(getMonthlyProgress('goal-0005','habitDefinition-0001', '2025-08'));
    console.log(getMonthlyProgress('goal-0006','habitDefinition-0002', '2025-08'));

    console.log('==========================================')
    console.log('===========  Testing Completed  ==========');
}
