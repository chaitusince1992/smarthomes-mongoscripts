const testFolder = './';
const fs = require('fs');
const es = require('event-stream');
const homeData = require('./building-meta.js')
var mongo = require('./mongo.js');
var db;
mongo.getCollection(function (dbs) {
  db = dbs;
  readFiles();
}, function () {
  console.log("error connecting to db...")
})

const indexOfBuilding = 4;
const baseFolder = "building" + indexOfBuilding;
function readFiles() {
  let dir = testFolder + baseFolder;
  fs.readdir(dir, (err, filesArr) => {
    iterateEachFile(filesArr.length, filesArr, dir);
  })
}

let failedCount = 0;
function iterateEachFile(fileIndex, fileArray, fullDir) {
  fileIndex--;
  if (fileIndex >= 0) {
    let file;
    if (fileArray && fileArray[fileIndex]) {
      file = fileArray[fileIndex];
    } else {
      console.log("something is wrong...", fileIndex);
    }
    if (file && file.indexOf(".csv") != -1) {
      // console.log(file + "___________");
      let lineStream = [];
      let lineCount = 0;
      fs.createReadStream(`${fullDir}/${file}`)
        .pipe(es.split())
        .pipe(
          es.mapSync(line => {
            lineCount++;
            lineStream.push(line);
            // console.log(lineCount,line);
          })
            .on('error', err => {

            })
            .on('end', () => {
              console.log(lineCount, lineStream[1]);
              let dataArray = parseCSV(lineStream);
              let gte = new Date(dataArray[0].timestamp * 1000);
              let lte = new Date(dataArray[dataArray.length - 1].timestamp * 1000);
              // console.log(dataArray);
              // dataArray.forEach((d, j) => {
              db.collection(baseFolder).insertMany(dataArray).then(() => {
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                process.stdout.write(`done inserting... ${fullDir}/${file}\n`);
                // iterateEachFile(i, fileArray, fullDir);
                mapReduceMinute(fileIndex, fileArray, fullDir, gte, lte);
              }, (e) => {
                console.log(`Failed ${fullDir}/${file}\n`);
                failedCount++;
                mapReduceMinute(fileIndex, fileArray, fullDir, gte, lte);
                // iterateEachFile(fileIndex, fileArray, fullDir);
              })
              // })
            })
        )
    } else {
      iterateEachFile(fileIndex, fileArray, fullDir);
    }

  } else {
    console.log(`End of files ${fullDir}`);
    // its the end
    console.log(failedCount);
  }
}

function mapReduceMinute(ind, fileArray, fullDir, gte, lte) {
  db.collection(baseFolder).mapReduce(
    function () {
      var date = new Date(this.timestamp * 1000);
      date.setHours(date.getHours());
      // let today = new Date();
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
        //a9: !isNaN(Number(this.a9)) ? this.a9 : 0, // for building 5
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
    {
      out: { inline: 1 },
      query: {
        _id:
        {
          $gte: gte,
          $lt: lte
        }
      },
    },

    function (err, docs) {
      /* if (err) {
        throw err;
      } */
      if (!err) {
        console.log(docs.length);
        let allDocs = [];
        if(docs.length === 0) {
          iterateEachFile(ind, fileArray, fullDir);
        }
        docs.forEach((d, i) => {
          let pushObj = { ...d.value };
          pushObj["_id"] = d._id;
          // console.log(d._id);
          pushObj["timestamp"] = new Date(d._id).getTime() / 1000;
          allDocs.push(pushObj);
          if (i === docs.length - 1) {

            db.collection(baseFolder + "minute").insertMany(allDocs).then(() => {
              process.stdout.clearLine();
              process.stdout.cursorTo(0);
              process.stdout.write(`done mapreduce minute... \n`);
              mapReduceHour(ind, fileArray, fullDir, gte, lte);
              // iterateEachFile(ind, fileArray, fullDir);
            }, (e) => {
              console.log(`Failed map reduce minute \n`);
              // iterateEachFile(ind, fileArray, fullDir);
              mapReduceHour(ind, fileArray, fullDir, gte, lte);
            })
          }
        })
      } else {
        console.log("Failed map reduce");
        iterateEachFile(ind, fileArray, fullDir);
      }
    }
  )
};

function mapReduceHour(ind, fileArray, fullDir, gte, lte) {
  db.collection(baseFolder + "minute").mapReduce(
    function () {
      var date = new Date(this.timestamp * 1000);
      date.setHours(date.getHours());
      today = new Date();
      //var timeBase = Math.floor(date.getTime() / (1000 * 60)) * 60000; // minute
      var timeBase = Math.floor(date.getTime() / (1000 * 60 * 60)) * 60000 * 60; // hours
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
        //a9: !isNaN(Number(this.a9)) ? this.a9 : 0, // for building 5
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
    {
      out: { inline: 1 },
      query: {
        _id:
        {
          $gte: gte,
          $lt: lte
        }
      },
    },
    function (err, docs) {
      if (!err) {
        console.log(docs.length);
        let allDocs = [];
        if(docs.length === 0) {
          iterateEachFile(ind, fileArray, fullDir);
        }
        docs.forEach((d, i) => {
          let pushObj = { ...d.value };
          pushObj["_id"] = d._id;
          pushObj["timestamp"] = new Date(d._id).getTime() / 1000;
          allDocs.push(pushObj);
          if (i === docs.length - 1) {

            db.collection(baseFolder + "hour").insertMany(allDocs).then(() => {
              process.stdout.clearLine();
              process.stdout.cursorTo(0);
              process.stdout.write(`done inserting mapreduce hour... \n`);
              mapReduceDay(ind, fileArray, fullDir, gte, lte);
            }, () => {
              console.log(`Failed map reduce hour  \n`);
              // iterateEachFile(ind, fileArray, fullDir);
              mapReduceDay(ind, fileArray, fullDir, gte, lte);
            })
          }
        })
      } else {
        console.log("Failed map reduce");
        iterateEachFile(ind, fileArray, fullDir);
      }
    }
  )
}

function mapReduceDay(ind, fileArray, fullDir, gte, lte) {
  db.collection(baseFolder + "hour").mapReduce(
    function () {
      var date = new Date(this.timestamp * 1000);
      date.setHours(date.getHours());
      today = new Date();
      // var timeBase = Math.floor(date.getTime() / (1000 * 60)) * 60000; // minute
      // var timeBase = Math.floor(date.getTime() / (1000 * 60 * 60)) * 60000 * 60; // hours
      var timeBase = Math.floor(date.getTime() / (1000 * 60 * 60 * 24)) * 60000 * 60 * 24; // days
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
        //a9: !isNaN(Number(this.a9)) ? this.a9 : 0, // for building 5
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
    {
      out: { inline: 1 },
      query: {
        _id:
        {
          $gte: gte,
          $lt: lte
        }
      }
    },
    function (err, docs) {
      if (!err) {
        console.log(docs.length);
        let allDocs = [];
        if(docs.length === 0) {
          iterateEachFile(ind, fileArray, fullDir);
        }
        docs.forEach((d, i) => {
          let pushObj = { ...d.value };
          pushObj["_id"] = d._id;
          pushObj["timestamp"] = new Date(d._id).getTime() / 1000;
          console.log(d._id)
          allDocs.push(pushObj);
          if (i === docs.length - 1) {

            db.collection(baseFolder + "day").insertMany(allDocs).then(() => {
              process.stdout.clearLine();
              process.stdout.cursorTo(0);
              process.stdout.write(`done inserting map reduce day... \n`);
              iterateEachFile(ind, fileArray, fullDir);
            }, () => {
              console.log(`Failed map reduce day \n`);
              iterateEachFile(ind, fileArray, fullDir);
            })
          }
        })
      } else {
        console.log("Failed map reduce");
        iterateEachFile(ind, fileArray, fullDir);
      }
    }
  )
}


function parseCSV(lines) {
  let buildingData = [];
  // let lines = csvData.split('\n');
  let csvNames = homeData["blocks"][indexOfBuilding]


  let headLine = lines[0].split(",");
  lines.forEach((line, i) => {
    if (line && i > 0) {
      // console.log(line.split(","));
      let cells = line.split(",");
      if (Number(cells[0])) {

        let buildObj = {};
        // buildObj["_id"] = cells[0] * 1000;
        buildObj["_id"] = new Date(cells[0] * 1000);
        // console.log(cells[0]);

        headLine.forEach((h, j) => {
          buildObj[csvNames[h]] = cells[j];
        })
        buildingData.push(buildObj);
      }
    }
  })
  // console.log(buildingData);
  return buildingData;
}
