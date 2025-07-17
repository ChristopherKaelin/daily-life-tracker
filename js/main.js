// main.js - App initialization

// App initialization - runs when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Daily Life Tracker starting...');
    
    // Initialize user settings
    console.log('Initialize user settings.');
    initializeUserSettings();

    // Initialize user name display
    console.log('Initialize user name display')
    initializeUserNameDisplay();

    // Initialize Today Is
    console.log('// Initialize Today Is');
    updateTodayIsDisplay();

    //  ****************************************
    //  TEST FUNCTIONS - Remove after testing
    //  ****************************************
    testFunction();

});

function testFunction() {
    console.log('Starting test function.');
    generateCalendar();
    console.log('Finished test function.');
}