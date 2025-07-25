// App initialization - runs when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard.JS DOMContentLoaded Add Event Listner Running');
    
    // Get Dashboard Data
    allKeyDates = loadAllKeyDatesFromStorage();
    
    // Initialize User settings
    console.log('Initialize user settings.');
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