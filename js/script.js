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
        })
        .catch(err => {
            console.error(err);
        });

        return 'Complete';
}

function generateMonthes(data, monthCount) {
    const container = document.querySelector('.calendar__grid');

    // console.log(data);
    let today = new Date(2021, 2, 7);
    // let today = new Date();
    let firstDay = new Date()
    for(let i = 0; i < monthCount; i++) {
        firstDay = new Date(firstDay.getFullYear(), firstDay.getMonth(), 1);
        var lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0);

        firstDay.setDate(firstDay.getDate() - firstDay.getDay() + 1);
        
        let monthTitle = ``
        let daysTitle = ``;
        let dates = ``;
        let count = 0;
        for (let currentDate = firstDay; currentDate <= lastDay; ) {

            if (count == 0) {
                monthTitle = `<p class='calendar__item-title'>${getMonthName(lastDay)}</p>`;
            }

            if (++count <= 7) {
                daysTitle += `<p class='calendar__item-day-title'>${getDayName(currentDate)}</p>`;
            }

            dates += (currentDate.getMonth() != lastDay.getMonth()) 
            ? `<div class='calendar__item-day'></div>` 
            : `<div class='calendar__item-day 
                ${isPastDay(today, currentDate) ? 'past-day' : ''} 
                ${isWeekend(currentDate, data.dayOffs) ? 'weekend' : ''} 
                ${isToday(today, currentDate) ? 'today' : ''}
                '><span>${currentDate.getDate()}</span></div>`;

            currentDate.setDate(currentDate.getDate() + 1);
        }

        container.insertAdjacentHTML('beforeEnd', `<div class='calendar__item'>${monthTitle} ${daysTitle} ${dates}</div>`);
        firstDay = new Date(lastDay.getFullYear(), lastDay.getMonth() + 1, 1);
    }
}

function generateLegend(teammates) {
    const container = document.querySelector('.calendar__teammates');
    container.insertAdjacentHTML('beforeEnd', teammates.map(item => (
        `<div class="calendar__teammates-item">
            <img class="calendar__teammates-img" src="${item.img}" alt="${item.name}">
            <span class="calendar__teammates-name">${item.name}</span>
            <div class="calendar__teammates-color" style="background-color: ${item.backgroundColor};"></div>
        </div>`
    )).join(''));
}

function isWeekend(date, dayOffs) {
    let d = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
    return date.getDay() == 6 || date.getDay() == 0 || dayOffs.indexOf(d) != -1;
}

function isPastDay(today, date) {
    return today > date;
}

function isToday(today, date) {
    return today.toLocaleDateString() == date.toLocaleDateString();
}

function getMonthName(date) {
    return  new Intl.DateTimeFormat('en-US', { month: "long" }).format(date);
}



function getDayName(date) {
    return new Intl.DateTimeFormat('en-US', { weekday: "short" }).format(date);
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