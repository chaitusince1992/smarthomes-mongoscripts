today = new Date();
minSec = Math.floor(today.getTime());
console.log(new Date(minSec).toUTCString());
minSec = Math.floor(today.getTime() / (1000 * 60)) * 60000; // min
console.log(new Date(minSec).toUTCString());
minSec = Math.floor(today.getTime() / (1000 * 60 * 60)) * 60000 * 60; // hours
console.log(new Date(minSec).toUTCString());
minSec = Math.floor(today.getTime() / (1000 * 60 * 60 * 24)) * 60000 * 60 * 24; // days
console.log(new Date(minSec).toUTCString());

db.building0.mapReduce(
    function () {
        var date = new Date(this.timestamp * 1000);
        date.setHours(date.getHours());
        today = new Date();
        var timeBase = Math.floor(date.getTime() / (1000 * 60)) * 60000; // minute
        // var timeBase = Math.floor(date.getTime() / (1000 * 60 * 60)) * 60000 * 60; // hours
        // var timeBase = Math.floor(date.getTime() / (1000 * 60 * 60 * 24)) * 60000 * 60 * 24; // days
        var time = new Date(timeBase);
        emit(time, {
            a0: !isNaN(Number(this.a0)) ? this.a0 : 0,
            a1: !isNaN(Number(this.a1)) ? this.a1 : 0,
            a2: !isNaN(Number(this.a2)) ? this.a2 : 0,
            a3: !isNaN(Number(this.a3)) ? this.a3 : 0,
            a4: !isNaN(Number(this.a4)) ? this.a4 : 0,
            a5: !isNaN(Number(this.a5)) ? this.a5 : 0,
            a6: !isNaN(Number(this.a6)) ? this.a6 : 0,
            a7: !isNaN(Number(this.a7)) ? this.a7 : 0,
            //b3: !isNaN(Number(this.a3)) ? this.a3 : 0,
            time: this.timestamp
        });
    },
    function (key, values) {
        //var returnObj = {sum: 0, time: 0};
        //var sum1 = 0;
        let objList = [];
        for (let k in values[0]) {
            k != 'time' ? objList.push(k) : '';
        }
        var returnObj = {};
        objList.forEach(prop => {
            let avg = 0;
            let totalSum = 0;
            values.forEach((d, i, arr) => {
                if (i > 1) {
                    let prevNumber = Number(arr[i - 1][prop]);
                    let currNumber = Number(d[prop]);
                    let area = (0.5) * (d.time - arr[i - 1].time) * (prevNumber + currNumber);
                    totalSum = totalSum + area;
                    //}
                }
                if (i == arr.length - 1) {
                    let firstTime = arr[0].time ? arr[0].time : arr[1].time;
                    let lastTime = d.time ? d.time : arr[i - 1].time;
                    avg = (lastTime - firstTime) > 0 ? totalSum / (lastTime - firstTime) : 0;
                }

            })
            returnObj[prop] = avg;
        })

        return returnObj;
    },
    { out: "map_red_test" }
)


var totalSum = 0;
dataToTrap.forEach((d, i, arr) => {
    console.log(d.y);
    if (i > 1) {
        let prevNumber = Number(arr[i - 1].y);
        let currNumber = Number(d.y);
        //console.log(prevNumber + currNumber, d.x - arr[i-1].x, totalSum);
        let area = (0.5) * (d.x - arr[i - 1].x) * (prevNumber + currNumber);
        totalSum = totalSum + area;
    }
    if (i == arr.length - 1) {
        console.log((d.x - arr[0].x), totalSum, totalSum / (d.x - arr[1].x))
    }

})

