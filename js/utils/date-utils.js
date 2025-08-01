//  Get current date information
function getDateInfo(inputDate = null) {
    // Use passed date or default to current date
    let currentDate;
    if (inputDate) {
        // Parse as local date, not UTC
        const [year, month, day] = inputDate.split('-');
        currentDate = new Date(year, month - 1, day); 
    } else {
        currentDate = new Date();
    }
    
    const currentYear = currentDate.getFullYear();

    //  Returns a zero based MONTH (Jan=0, Feb=1, Mar=2, etc.) 
    const currentMonth = currentDate.getMonth();
    const currentMonthName = monthToMonthName[currentMonth];
    const currentYearMonth = `${currentYear}-${(currentMonth+1).toString().padStart(2, '0')}`;
    const currentDayofMonth = currentDate.getDate();
    const currentDayOrdinal = currentDayofMonth + getOrdinalSuffix(currentDayofMonth);

    //  Returns a zero based DAY (Sun=0, Mon=1, Tue=2, etc.)
    const currentDayofWeek = currentDate.getDay();
    const currentDayName = dayToDayName[currentDayofWeek];
    
    //  Since getMonth() returns a zero based number, need to add one to move to the next month, 
    //  then using a zero for the day will move it back to the last day in the create date.
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    return {
        year: currentYear,
        yearMonth: currentYearMonth,
        month: currentMonth,
        monthName: currentMonthName,
        day: currentDayofMonth,
        dayOrdinal:  currentDayOrdinal,
        dayOfWeek: currentDayofWeek,
        dayName: currentDayName,
        daysInMonth: daysInCurrentMonth
    }
}


//  Get the correct 'st', 'nd', 'th' for the day.
function getOrdinalSuffix(dayNum) {
    if (dayNum >= 11 && dayNum <= 19) {
        return 'th'
    }

    const lastDigit = dayNum % 10;
    if (lastDigit == 1) {
        return 'st';
    } else if (lastDigit == 2 ) {
        return 'nd';
    } else if (lastDigit == 3) {
        return 'rd';
    } else {
        return 'th';
    }
}


//  Constants
//==========================================
const dayToDayName = {0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday'}
const monthToMonthName = {0: 'January', 1: 'February', 2: 'March', 3: 'April', 4: 'May', 5: 'June',  6: 'July', 7: 'August', 8: 'September', 9: 'October', 10: 'November', 11: 'December'}
