// Generate calendar grid for current month
function generateCalendarDisplay(dateInfo) {

  //  Create month/year header
  const nonthYearHeader = 
    `<div class="calendar-header">
      <img class="icon icon-md nav-arrow-left" src="./assets/images/arrow.svg" onclick='navigateMonth(-1)';>
      <h3 class="year-month">${dateInfo.monthName} ${dateInfo.year}</h3>
      <img class="icon icon-md nav-arrow-right " src="./assets/images/arrow.svg" onclick='navigateMonth(1)';>
    </div>`;
  
  //  Add in day headers
  const dayOfWeekHeader = '<div>Sun</div> <div>Mon</div> <div>Tue</div> <div>Wed</div> <div>Thu</div> <div>Fri</div> <div>Sat</div>'

  // Calculate first day of month and number of days
  const firstDayOfMonth = new Date(dateInfo.year, dateInfo.month, 1).getDay();

  //  Create HTML for calendar grid
  let calendarGrid = '';
  //  Add in blank divs to push day to correct start
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarGrid += `<div class="empty-day"></div>`;
  }
  
  const currentMonthKeyDates = getKeyDatesForMonth(dateInfo.yearMonth);

  //  Add in the days of the month
  for (let i = 1; i <= dateInfo.daysInMonth; i++) {
    let dateClassList = '';

    // Check if this day has key dates
    const dayDateString = `${dateInfo.yearMonth}-${(i).toString().padStart(2,'0')}`;
    const hasKeyDate = currentMonthKeyDates.some(kd => kd.date === dayDateString);
    dateClassList += hasKeyDate ? 'has-key-date ' : '';  

    dateClassList += dayDateString == todayDateInfo.date ? `is-today ` : ``;
    dateClassList += dayDateString > todayDateInfo.date ? 'future-date ' : ``;
    dateClassList += dayDateString === selectedHabitDate ? 'selected-date ' : '';
    
    calendarGrid += `<div class="${dateClassList}" >${i}</div>`;
  }
  
  // Display the calendar
  const calendarElement = document.getElementById('calendarDisplay');

  if (calendarElement) {
    calendarElement.innerHTML = 
      nonthYearHeader + 
      `<div class="calendar-grid">${dayOfWeekHeader} ${calendarGrid}</div>`;
  }
}


// Add calendar click handler for habit date selection
function initializeCalendarClickHandler() {
  console.log('<=====  initializeCalendarClickHandler  =====>');
  const calendarElement = document.getElementById('calendarDisplay');
  
  if (calendarElement) {
    calendarElement.addEventListener('click', function(e) {
        // Check if clicked element is a calendar day (has a number and isn't empty)
        const clickedDay = e.target;
        if (clickedDay.textContent && !clickedDay.classList.contains('empty-day') && clickedDay.tagName === 'DIV'
          && !clickedDay.classList.contains('future-date') && !clickedDay.classList.contains('calendar-grid')) 
          {
            const dayNumber = parseInt(clickedDay.textContent);
            if (!isNaN(dayNumber)) {
              // Build the selected date string
              const selectedDate = `${appDateInfo.yearMonth}-${(dayNumber).toString().padStart(2,'0')}`;
              console.log(selectedDate);

              // Update global selected date
              selectedHabitDate = selectedDate;

              // Remove previous selection
              document.querySelectorAll('.selected-date').forEach(el => el.classList.remove('selected-date'));

              // Add to clicked day  
              if (selectedHabitDate != todayDateInfo.date) {
                clickedDay.classList.add('selected-date');
              }

              // Update habit tracker display for selected date
              generateHabitTrackerDisplay(selectedDate);

            }
        }
    });
  }
}


// Navigate to previous/next month
function navigateMonth(direction) {
  // Calculate new month and year
  let newMonth = appDateInfo.month + direction;
  let newYear = appDateInfo.year;
  
  // Handle month overflow/underflow
  if (newMonth > 11) {
      newMonth = 0;
      newYear++;
  } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
  }
  
  // Create date string for the first day of the new month
  const newDateString = `${newYear}-${(newMonth + 1).toString().padStart(2, '0')}-01`;
  
  // Update appDateInfo with new month data
  appDateInfo = getDateInfo(newDateString);
  selectedHabitDate = appDateInfo.date;

  // Refresh displays with new month data
  generateCalendarDisplay(appDateInfo);
  generateKeyDatesDisplay(appDateInfo);
  generateHabitTrackerDisplay(appDateInfo.yearMonth);
}