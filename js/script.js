

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
        })
        .catch(err => {
            console.error(err);
        });

        return 'Complete';
}

function generateMonthes(data, monthCount) {
    console.log(data);
    // let date = new Date(2021, 3, 3);
    let date = new Date()
    let grid = document.querySelector('.calendar__grid');

    for(let i = 0; i < monthCount; i++) {
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        firstDay.setDate(firstDay.getDate() - firstDay.getDay() + 1);
        
        let dates = ``;
        for (let currentDate = firstDay; currentDate <= lastDay; ) {

            let isDayOff = isWeekend(currentDate, data.dayOffs);
            dates += (currentDate.getMonth() != lastDay.getMonth()) 
            ? `<div class='calendar__item-day'></div>` 
            : `<div class='calendar__item-day ${isDayOff ? 'weekend' : ''}'>${currentDate.getDate()}</div>`;

            currentDate.setDate(currentDate.getDate() + 1);
        }

        grid.insertAdjacentHTML('beforeEnd', `<div class='calendar__item'>${dates}</div>`);
        date = new Date(lastDay.getFullYear(), lastDay.getMonth() + 1, 1);
    }
}

function isWeekend(date, dayOffs) {
    let d = date.toISOString().slice(0,10);
    console.log(d);
    console.log(dayOffs);

    return date.getDay() == 6 || date.getDay() == 0;// || dayOffs.indexOf(date.toISOString().slice(0,10));
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