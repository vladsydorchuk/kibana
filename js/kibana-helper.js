function getMateId(mates, mateCounter) {
    return mates[(mateCounter - 1) % mates.length].id;
}

function isCurrentSprint(startDate, endDate, currentDate) {
    return currentDate >= startDate && currentDate < endDate;
}

function getStartSprintDate(today, startSprintDate) {
    let startDate = new Date(startSprintDate);

    while (true) {
        if (today < startDate.setDate(startDate.getDate() + 14)) {
            break;
        }
    }
    startDate.setDate(startDate.getDate() - 14);
    return startDate;
}

function showStartEndSpringDate(start, end) {
    const container = document.querySelector('.calendar__sprint');
    end.setDate(end.getDate() - 1);

    let s = `${start.getDate().toString().padStart(2, '0')}.${(start.getMonth() + 1).toString().padStart(2, '0')}.${start.getFullYear()}`
    let e = `${end.getDate().toString().padStart(2, '0')}.${(end.getMonth() + 1).toString().padStart(2, '0')}.${end.getFullYear()}`
    
    container.insertAdjacentHTML('beforeEnd', `<p class='calendar__sprint-dates'>${s} - ${e}</p>`);
}

function getMateHours(id) {
    return document.querySelectorAll(`[data-mate-id=${id}]`).length * 6;
}

function isWeekendDay(date, dayOffs, workDays) {
    let d = getDateWithZeroTime(date);
    return workDays.indexOf(d) == -1 && (date.getDay() == 6 || date.getDay() == 0 || dayOffs.indexOf(d) != -1);
}

function isPastDay(today, date) {
    return today > date;
}

function isTodayDay(today, date) {
    return today.toLocaleDateString() == date.toLocaleDateString();
}

function getMonthName(date) {
    return new Intl.DateTimeFormat('en-US', { month: "long" }).format(date);
}

function getDateWithZeroTime(date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}T00:00:00`
}

function getDayName(date) {
    return new Intl.DateTimeFormat('en-US', { weekday: "short" }).format(date);
}

function findDuty() {
    let mateId = document.querySelector('.today').getAttribute('data-mate-id');

    if (mateId == null) {
        return;
    }

    let mateItem = document.querySelector(`.calendar__teammates-item[data-mate-id="${mateId}"]`);
    mateItem.classList.toggle('calendar__teammates-item--duty')
}

export {
    getMateId,
    isCurrentSprint, 
    getStartSprintDate,
    showStartEndSpringDate,
    getMateHours,
    isWeekendDay,
    isPastDay,
    isTodayDay,
    getMonthName,
    getDateWithZeroTime,
    getDayName,
    findDuty
}