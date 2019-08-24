'strict';

const testFolder = './';
const fs = require('fs');
const util = require('util');
const path = require('path');
const es = require('event-stream');

// var mongodb = require('mongodb');
var mongo = require('../mongo.js');
var db;
mongo.getCollection(function (dbs) {
    db = dbs;
    readFiles();
}, function () {
    console.log("error connecting to db...")
})




const baseFolder = "building1";

function readFiles() {
    db.collection(baseFolder).mapReduce(
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
                a8: !isNaN(Number(this.a8)) ? this.a8 : 0,
                //b3: !isNaN(Number(this.a3)) ? this.a3 : 0,
                timestamp: this.timestamp
            });
        },
        function (key, values) {
            //var returnObj = {sum: 0, time: 0};
            //var sum1 = 0;
            let objList = [];
            for (let k in values[0]) {
                k != 'timestamp' ? objList.push(k) : '';
            }
            var returnObj = {};
            objList.forEach(prop => {
                let avg = 0;
                let totalSum = 0;
                values.forEach((d, i, arr) => {
                    if (i > 1) {
                        let prevNumber = Number(arr[i - 1][prop]);
                        let currNumber = Number(d[prop]);
                        let area = (0.5) * (d.timestamp - arr[i - 1].timestamp) * (prevNumber + currNumber);
                        totalSum = totalSum + area;
                        //}
                    }
                    if (i == arr.length - 1) {
                        let firstTime = arr[0].timestamp ? arr[0].timestamp : arr[1].timestamp;
                        let lastTime = d.timestamp ? d.timestamp : arr[i - 1].timestamp;
                        avg = (lastTime - firstTime) > 0 ? totalSum / (lastTime - firstTime) : 0;
                    }

                })
                returnObj[prop] = avg;
            })

            return returnObj;
        },
        { out: { inline: 1 } },
        function (err, docs) {
            if(err) {
                throw err;
            }
            if (!err) {
                console.log(docs.length, docs[0]);
                let allDocs = [];
                docs.forEach((d, i) => {
                    let pushObj = { ...d.value };
                    pushObj["_id"] = d._id;
                    pushObj["timestamp"] = new Date(d._id).getTime()/1000;
                    allDocs.push(pushObj);
                    if (i === docs.length - 1) {

                        db.collection(baseFolder + "minute").insertMany(allDocs).then(() => {
                            process.stdout.clearLine();
                            process.stdout.cursorTo(0);
                            process.stdout.write(`done inserting... \n`);

                        }, () => {
                            console.log(`Failed \n`);
                        })
                    }
                })
            }
        }
    )

}
// db.collection(baseFolder).insertMany(dataArray).then(() => {
//     process.stdout.clearLine();
//     process.stdout.cursorTo(0);
//     process.stdout.write(`done inserting... ${fullDir}/${file}\n`);
//     iterateEachFile(i, fileArray, fullDir);
// }, () => {
//     console.log(`Failed ${fullDir}/${file}\n`);
//     failedCount++;
//     iterateEachFile(i, fileArray, fullDir);
// })