// App initialization - runs when page loads
document.addEventListener('DOMContentLoaded', function() {
    
    // Get Dashboard Data
    appDateInfo = getDateInfo();
    allKeyDates = loadAllKeyDatesFromStorage();
    allHabitDefinitions = loadAllHabitDefinitions(); 
    
    // Initialize User settings
    initializeUserSettings();

    //  Initialize Calendar Section Display
    generateWeatherDisplay();
    generateQuoteDisplay();
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



    console.log('==========================================')
    console.log('===========  Testing Completed  ==========');
}
