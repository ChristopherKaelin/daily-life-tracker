// Global Info
let appDateInfo = null;
let allKeyDates = [];


// App initialization - runs when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Daily Life Tracker starting...');
    
    // Get App Wide Data
    appDateInfo = getCurrentDateInfo();
    allKeyDates = getAllKeyDates();

    
    // Initialize User settings
    console.log('Initialize user settings.');
    initializeUserSettings();

    // Initialize Header Display
    console.log('Initialize Header display')
    initializeHeaderDisplay(appDateInfo);

    //  Initialize Calendar Display
    generateCalendar(appDateInfo);


    //==========================================
    //  TESTING - Remove after testing
    //==========================================
    // testFunction();

});

function testFunction() {
    console.log('=== Testing saveKeyDate() ===');
    let keyDateId = '';
    let result = false;

    // Display Starting localStorage State
    savedData = localStorage.getItem('dailyLifeKeyDates');
    console.log('Raw localStorage data:', JSON.parse(savedData));

    // Test: DELETE sample key date from middle of array
    // result = deleteKeyDate('keydate-003');
    // console.log('Save result:', result);

    // // Test: UPDATE a sample key date
    result = updateKeyDate('keydate-001', 'Updated Description');
    console.log('Save result:', result);

    
    // // Test 1: DELETE sample key date end the array
    // testDescription = "Peyton's Birthday";
    // result = saveKeyDate(appDateInfo, testDescription);
    
    // // Test: Check localStorage
    // savedData = localStorage.getItem('dailyLifeKeyDates');
    // console.log('Raw localStorage data:', savedData);
    
    // // Test: ADD NEW key date to test sequential IDs
    result = addKeyDate(appDateInfo, "Doctor Appointment");
    console.log('Second save result:', result);

    // Display Ending localStorage State
    savedData = localStorage.getItem('dailyLifeKeyDates');
    console.log('Raw localStorage data:', JSON.parse(savedData));

    console.log('=== Test Complete ===');
}

