// App initialization - runs when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log(`<=====  DASHBOARD.JS  =====>`);

    // Get Dashboard Data
    allKeyDates = loadAllKeyDatesFromStorage();
    allHabitDefinitions = loadAllHabitDefinitions(); 
    
    //  Generate Display
    generateCalendarDisplay(appDateInfo);
    generateWeatherDisplay();
    generateQuoteDisplay();
    // TODO: GenerateBibleVerseDisplay()
    generateKeyDatesDisplay(appDateInfo, allKeyDates);
    generateHabitTrackerDisplay(appDateInfo.yearMonth);

    //  Initialize Click Handlers
    initializeCalendarClickHandler();
    initializeKeyDatesClickHandlers();
    

    //==========================================
    //  TESTING Function
    //==========================================
    // testFunction();

});
  
function testFunction() {
    console.log('===========  Testing Started  ============');
    console.log('==========================================')



    console.log('==========================================')
    console.log('===========  Testing Completed  ==========');
}
