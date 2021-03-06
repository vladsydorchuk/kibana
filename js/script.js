getDataFromJSON();

function getDataFromJSON() {
    fetch('https://raw.githubusercontent.com/vladsydorchuk/FalconsKibana/master/data.json')
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

    let today = new Date(2021, 2, 12);
    // let today = new Date();
    let firstDay = startDateCalculation;

    let startSprintDate = getStartSprintDate(today, data.startSprintDate);
    let endSprintDate = new Date(startSprintDate.getFullYear(), startSprintDate.getMonth(), startSprintDate.getDate() + 14)

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
            : `<div class='calendar__item-day
                ${isPast ? ' past-day' : ''}
                ${isWeekend ? ' weekend' : ''}
                ${isToday ? ' today' : ''}
                'style="background-color: ${getMateColor(data, startDateCalculation, currentDate, isPast, isWeekend, isToday)}" 
                ${isCurrentSprint(startSprintDate, endSprintDate, currentDate) && !isWeekend ? `data-mate-id=${getMateId(data.teammates)}` : ''}
                ><span>${currentDate.getDate()}</span></div>`;

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

function isCurrentSprint(startDate, endDate, currentDate) {
    return currentDate >= startDate && currentDate < endDate;
}

function getStartSprintDate(today, startSprintDate) {
    let startDate = new Date(startSprintDate);

    // console.log(today);
    while (true) {
        if (today < startDate.setDate(startDate.getDate() + 14)) {
            break;
        }
    }
    startDate.setDate(startDate.getDate() - 14);
    // console.log(`Start: ${startDate}`);
    return startDate;
}

let mateCounter = 0;
function getMateColor(data, startDate, currentDate, isPast, isWeekend, isToday) {
    let bgcolor = "transparent";

    let mate = data.teammates[mateCounter % data.teammates.length];
    let tmpCurrentDate = getDateWithZeroTime(currentDate);

    if (mate.dayOffs.indexOf(tmpCurrentDate) != -1) {
        ++mateCounter;
        return getMateColor(data, startDate, currentDate, isPast, isWeekend, isToday);
    }

    if (isWeekend || startDate > currentDate) {
        return bgcolor;
    }

    if (!isWeekend) {
        bgcolor = mate.backgroundColor;
    }

    if (isPast) {
        bgcolor += "42";
    }

    if (!isPast && !isToday) {
        bgcolor += "7a";
    }
    
    mateCounter++;
    return bgcolor;
}

function getMateId(mates) {
    return mates[(mateCounter - 1) % mates.length].id;
}

function getMateHours(id) {
    return document.querySelectorAll(`[data-mate-id=${id}]`).length * 6;
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

    //div[data-mate-id="${mateId}"
    let mateItem = document.querySelector(`.calendar__teammates-item[data-mate-id="${mateId}"]`);
    mateItem.classList.toggle('calendar__teammates-item--duty')
    console.log(mateItem);
    
}


























// var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
// var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);


// let days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];




// generateMonth(date);
// function generateMonth(date) {
//     var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
//     var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

//     let month = 
//     `<div class="calendar__item">
//         <h3 class="calendar__item-title">Март</h3>
//         <div class="calendar__item-days-name">
//             ${days.map(day => (
//                 `<p>${day}</p>`
//             )).join('')}
//         </div>
//         <div class="calendar__item-days">
//             ${getDates()}
//         </div>
//     </div>
//     `;

//     grid.innerHTML += month;
// }

// function getDates() {
//     return `<p>test</p>`;
// }