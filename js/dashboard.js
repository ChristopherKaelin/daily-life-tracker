// App initialization - runs when page loads
document.addEventListener('DOMContentLoaded', function() {
    
    // Get Dashboard Data
    appDateInfo = getDateInfo();
    allKeyDates = loadAllKeyDatesFromStorage();
    
    // Initialize User settings
    initializeUserSettings();

    //  Initialize Calendar Section Display 
    generateCalendarDisplay(appDateInfo);
    generateKeyDatesDisplay(appDateInfo, allKeyDates);
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
