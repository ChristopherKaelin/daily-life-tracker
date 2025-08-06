// Generate calendar grid for current month
function generateCalendarDisplay(dateInfo) {
    //  Create month/year header
    const nonthYearHeader = `<h3>${dateInfo.monthName} ${dateInfo.year}</h3>`;
    
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
    //  Add in the days of the month
    for (let i = 1; i <= dateInfo.daysInMonth; i++) {
        const dayDateString = `${dateInfo.year}-${(dateInfo.month+1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;

        // Check if this day has key dates
        const currentMonthKeyDates = getKeyDatesForMonth(dateInfo.year, (dateInfo.month + 1).toString().padStart(2, '0'));
        const hasKeyDate = currentMonthKeyDates.some(kd => kd.date === dayDateString);
        const keyDateClass = hasKeyDate ? 'has-key-date' : '';  

        const onclickAction = `onclick="openKeyDateForm('${dayDateString}')"`;

        if (i == dateInfo.day) {
            isTodayClass = ` today`;
        } else {
            isTodayClass = ``;
        }
        calendarGrid += `<div class="${keyDateClass}${isTodayClass}" ${onclickAction}>${i}</div>`;
    }
    
    // Display the calendar
    const calendarElement = document.getElementById('calendarDisplay');

    if (calendarElement) {
        calendarElement.innerHTML = 
            nonthYearHeader + 
            `<div class="calendar-grid">${dayOfWeekHeader} ${calendarGrid}</div>`;
    }
}


function generateKeyDatesDisplay(dateInfo) {
    // Get key dates for current month
    const currentMonthKeyDates = getKeyDatesForMonth(dateInfo.year, (dateInfo.month + 1).toString().padStart(2, '0'));
    currentMonthKeyDates.sort((a, b) => a.date.localeCompare(b.date));

    // Generate HTML
    let keyDatesHTML;
    if (currentMonthKeyDates.length === 0) {
        keyDatesHTML = '<p class="no-key-dates">No key dates for this month</p>';
    } else {
        keyDatesHTML = '<ul class="key-dates-list">';
        currentMonthKeyDates.forEach(keyDate => {
            const day = parseInt(keyDate.date.split('-')[2]);
            const key_date_info = `${day}${getOrdinalSuffix(day)} - ${keyDate.description || 'No description'}`;
            keyDatesHTML += 
                `<li class="key-date-item" data-key-date-id="${keyDate.id}" data-description="${keyDate.description}">
                    <span class="key-date-info">${key_date_info}</span>
                    <img class="edit-icon" src="./assets/images/edit-icon.svg" alt="edit icon">
                    <img class="delete-icon" src="./assets/images/delete-icon.svg" alt="delete icon">
                </li>`;
        });
        keyDatesHTML += '</ul>';
    }
    
    // Display in the key dates element
    const keyDatesElement = document.getElementById('keyDatesDisplay');
    if (keyDatesElement) {
        keyDatesElement.innerHTML = keyDatesHTML;
    }
}


// Event delegation for key date actions 
function initializeKeyDateEventListeners() {
    const keyDatesContainer = document.getElementById('keyDatesDisplay');
    
    if (keyDatesContainer) {
        keyDatesContainer.addEventListener('click', function(e) {
            // Handle delete button clicks
            if (e.target.classList.contains('delete-icon')) {
                const keyDateItem = e.target.closest('.key-date-item');
                const id = keyDateItem.dataset.keyDateId;
                const description = keyDateItem.dataset.description;
                confirmDeleteKeyDate(id, description);
            }
            
            // Handle edit button clicks
            if (e.target.classList.contains('edit-icon')) {
                const keyDateItem = e.target.closest('.key-date-item');
                const id = keyDateItem.dataset.keyDateId;
                openEditKeyDateForm(id);
            }
        });
    }
}

