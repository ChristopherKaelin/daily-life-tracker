/**
 * Returns detailed information about a given date string or the current date if none is provided.
 * Parses the date and returns year, month, day, day of week, month name, day name, and formatted strings for use in the app.
 *
 * @param {string|null} inputDate - The date string in 'yyyy-mm-dd' format, or null for today
 * @returns {Object} An object containing year, month, day, dayOfWeek, dayName, monthName, and formatted date strings
 */
function getDateInfo(inputDate = null) {
    // Use passed date or default to current date
    let targetDate;
    if (inputDate) {
        // Parse as local date, not UTC
        const [year, month, day] = inputDate.split('-');
        targetDate = new Date(year, month - 1, day); 
    } else {
        targetDate = new Date();//.toISOString();
    }

    const targetYear = targetDate.getFullYear();

    //  Returns a zero based MONTH (Jan=0, Feb=1, Mar=2, etc.) 
    const targetMonth = targetDate.getMonth();
    const targetMonthName = monthToMonthName[targetMonth];
    const targetYearMonth = `${targetYear}-${(targetMonth+1).toString().padStart(2, '0')}`;
    const targetDayofMonth = targetDate.getDate();
    const targetYearMonthDay = `${targetYear}-${(targetMonth+1).toString().padStart(2, '0')}-${(targetDayofMonth).toString().padStart(2, '0')}`;
    const targetDayOrdinal = targetDayofMonth + getOrdinalSuffix(targetDayofMonth);

    //  Returns a zero based DAY (Sun=0, Mon=1, Tue=2, etc.)
    const targetDayofWeek = targetDate.getDay();
    const targetDayName = dayToDayName[targetDayofWeek];
    
    //  Since getMonth() returns a zero based number, need to add one to move to the next month, 
    //  then using a zero for the day will move it back to the last day in the create date.
    const daysIntargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();

    return {
        year: targetYear,
        yearMonth: targetYearMonth,
        month: targetMonth,
        monthName: targetMonthName,
        day: targetDayofMonth,
        dayOrdinal:  targetDayOrdinal,
        dayOfWeek: targetDayofWeek,
        dayName: targetDayName,
        daysInMonth: daysIntargetMonth,
        date: targetYearMonthDay
    }
}


/**
 * Returns the ordinal suffix ('st', 'nd', 'rd', 'th') for a given day number.
 * Handles special cases for numbers ending in 11-19 and standard cases for other numbers.
 *
 * @param {number} dayNum - The day of the month
 * @returns {string} The ordinal suffix for the day
 */
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
