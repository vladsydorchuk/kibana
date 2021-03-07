import {
    getMateColor,
    getMateId,
    isCurrentSprint, 
    getStartSprintDate,
    showStartEndSpringDate,
    getMateHours,
    isWeekendDay,
    isPastDay,
    isTodayDay,
    getMonthName,
    getDayName,
    findDuty
} from './kibana-helper.js';

getDataFromJSON();

function getDataFromJSON() {
    fetch('https://raw.githubusercontent.com/vladsydorchuk/FalconsKibana/master/settings.json')
        .then(response => {
            if (!response.ok) {
                throw new Exception("HTTP error " + response.status);
            }

            return response.json();
        })
        .then(json => {
            generateMonthes(json, 2);
            generateLegend(json.teammates);
            findDuty();
        })
        .catch(err => {
            console.error(err);
        });

        return 'Complete';
}

function generateMonthes(data, monthCount) {
    const container = document.querySelector('.calendar__grid');
    const startDateCalculation = new Date(data.startDate);

    let today = new Date(2021, 2, 8);
    // let today = new Date();
    let firstDay = startDateCalculation;

    let startSprintDate = getStartSprintDate(today, data.startSprintDate);
    let endSprintDate = new Date(startSprintDate.getFullYear(), startSprintDate.getMonth(), startSprintDate.getDate() + 14)
    showStartEndSpringDate(startSprintDate, endSprintDate);

    for(let i = 0; i < monthCount; i++) {
        firstDay = new Date(firstDay.getFullYear(), firstDay.getMonth(), 1);
        var lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0);

        firstDay.setDate(firstDay.getDate() - firstDay.getDay() + 1);
        
        let monthTitle = ``
        let daysTitle = ``;
        let dates = ``;
        let count = 0;
        for (let currentDate = firstDay; currentDate <= lastDay;) {
            if (count == 0) {
                monthTitle = `<p class='calendar__item-title'>${getMonthName(lastDay) + " " + lastDay.getFullYear()}</p>`;
            }

            if (++count <= 7) {
                daysTitle += `<p class='calendar__item-day-title'>${getDayName(currentDate)}</p>`;
            }

            const isPast = isPastDay(today, currentDate);
            const isWeekend = isWeekendDay(currentDate, data.dayOffs, data.workDays);
            const isToday = isTodayDay(today, currentDate);

            dates += (currentDate.getMonth() != lastDay.getMonth()) 
            ? `<div class='calendar__item-day'></div>` 
            : `<div class='calendar__item-day${isPast ? ' past-day' : ''}${isWeekend ? ' weekend' : ''}${isToday ? ' today' : ''}'style="background-color: ${getMateColor(data, startDateCalculation, currentDate, isPast, isWeekend, isToday)}" ${isCurrentSprint(startSprintDate, endSprintDate, currentDate) && !isWeekend ? `data-mate-id=${getMateId(data.teammates)}` : ''}><span>${currentDate.getDate()}</span></div>`;

            currentDate.setDate(currentDate.getDate() + 1);
        }

        firstDay = new Date(lastDay.getFullYear(), lastDay.getMonth() + 1, 1);
        
        if (today > firstDay) {
            monthCount++;
            continue;
        }

        container.insertAdjacentHTML('beforeEnd', `<div class='calendar__item'>${monthTitle} ${daysTitle} ${dates}</div>`);
    }
}

function generateLegend(mates) {
    const container = document.querySelector('.calendar__teammates');
    container.insertAdjacentHTML('beforeEnd', mates.map(item => (
        `<div data-mate-id='${item.id}' class="calendar__teammates-item">
            <img class="calendar__teammates-img" src="${item.img}" alt="${item.name}">
            <div class="calendar__teammates-info">
                <span class="calendar__teammates-name">${item.name}</span>
                <span class="calendar__teammates-hours">${getMateHours(item.id)}</span>
            </div>
            <div class="calendar__teammates-color" style="background-color: ${item.backgroundColor};"></div>
        </div>`
    )).join(''));
}
