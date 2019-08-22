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

const indexOfBuilding = 3;
const baseFolder = "building" + indexOfBuilding;
function readFiles() {
  let dir = testFolder + baseFolder;
  fs.readdir(dir, (err, filesArr) => {
    iterateEachFile(filesArr.length, filesArr, dir);
  })
}

let failedCount = 0;
function iterateEachFile(i, fileArray, fullDir) {
  i--;
  if (i >= 0) {
    let file;
    if (fileArray && fileArray[i]) {
      file = fileArray[i];
    } else {
      console.log("something is wrong...", i);
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

              // dataArray.forEach((d, j) => {
              db.collection(baseFolder).insertMany(dataArray).then(() => {
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                process.stdout.write(`done inserting... ${fullDir}/${file}\n`);
                // iterateEachFile(i, fileArray, fullDir);
                mapReduceMinute(i, fileArray, fullDir);
              }, () => {
                console.log(`Failed ${fullDir}/${file}\n`);
                failedCount++;
                iterateEachFile(i, fileArray, fullDir);
              })
              // })
            })
        )
    } else {
      iterateEachFile(i, fileArray, fullDir);
    }

  } else {
    console.log(`End of files ${fullDir}`);
    // its the end
    console.log(failedCount);
  }
}

function mapReduceMinute(ind, fileArray, fullDir) {
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
      if (err) {
        throw err;
      }
      if (!err) {
        console.log(docs.length);
        let allDocs = [];
        docs.forEach((d, i) => {
          let pushObj = { ...d.value };
          pushObj["_id"] = d._id;
          pushObj["timestamp"] = new Date(d._id).getTime() / 1000;
          allDocs.push(pushObj);
          if (i === docs.length - 1) {

            db.collection(baseFolder + "minute").insertMany(allDocs).then(() => {
              process.stdout.clearLine();
              process.stdout.cursorTo(0);
              process.stdout.write(`done mapreduce minute... \n`);
              iterateEachFile(ind, fileArray, fullDir);
            }, () => {
              console.log(`Failed map reduce \n`);
            })
          }
        })
      }
    }
  )
};



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
        if (cells[0] === 0) {
          console.log(i);
        }
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
