var DocumentDBClient = require('documentdb').DocumentClient;
const testFolder = './';
const fs = require('fs');
const es = require('event-stream');
const homeData = require('./building-meta.js')

console.log("Cosmos DB");
var config = {}

config.host = process.env.HOST || "https://localhost:8081/";
config.authKey = process.env.AUTH_KEY || "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";
config.databaseId = "smarthomes";
config.collectionId = "building0minute";

//Todo App:
var docDbClient = new DocumentDBClient(config.host, {
  masterKey: config.authKey
});

var querySpec = {
  query: 'SELECT * FROM root r WHERE r.id= @id',
  parameters: [{
    name: '@id',
    value: config.databaseId
  }]
};
docDbClient.queryDatabases(querySpec).toArray(function (err, results) {
  if (err) {
    // callback(err);
    console.log("Failed...", err, results);
  } else {
    if (results.length === 0) {
      var databaseSpec = {
        id: config.databaseId
      };

      docDbClient.createDatabase(databaseSpec, function (err, created) {

        databaseCreated(created);
      });

    } else {
      // callback(null, results[0]);
      databaseCreated(results[0]);
    }
  }
});

function databaseCreated(db) {
  console.log(db);
  /*db = { id: 'smarthomes',
_rid: '8gEXAA==',
_self: 'dbs/8gEXAA==/',
_etag: '"00000000-0000-0000-59e3-d999c86901d5"',
_colls: 'colls/',
_users: 'users/',
_ts: 1566586322 } */
  var querySpec = {
    query: 'SELECT * FROM root r WHERE r.id=@id',
    parameters: [{
      name: '@id',
      value: config.collectionId
    }]
  };

  docDbClient.queryCollections(db._self, querySpec).toArray(function (err, results) {
    if (err) {
      // callback(err);

    } else {
      if (results.length === 0) {
        var collectionSpec = {
          id: config.collectionId
        };

        docDbClient.createCollection(db._self, collectionSpec, function (err, created) {
          collectionCreated(created);
        });

      } else {
        collectionCreated(results[0]);
      }
    }
  });
}





function collectionCreated(coll) {
  console.log(coll);
  readFiles(coll._self);
};

const indexOfBuilding = 0;
const baseFolder = "building" + indexOfBuilding;

function readFiles(colId) {
  let dir = testFolder + baseFolder;
  fs.readdir(dir, (err, filesArr) => {
    iterateEachFile(filesArr.length, filesArr, dir, colId);
  })
}

let failedCount = 0;
function iterateEachFile(fileIndex, fileArray, fullDir, colId) {
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
              let minuteData = mapReduceMinute(dataArray);
              /* documentInsert(minuteData.length, minuteData, colId, function (colId2) {
                console.log("ended on file");
                iterateEachFile(fileIndex, fileArray, fullDir, colId2);
              }, function(err) {

              }); */
              documentInsert(minuteData.length, minuteData, colId, fileIndex, fileArray, fullDir);
            })
        )
    } else {
      iterateEachFile(fileIndex, fileArray, fullDir, colId);
    }

  } else {
    console.log(`End of files ${fullDir}`);
    // its the end
    console.log(failedCount);
  }
}



function parseCSV(lines) {
  let buildingData = [];
  // let lines = csvData.split('\n');
  let csvNames = homeData["blocks"][indexOfBuilding]


  let headLine = lines[0].split(",");
  lines.forEach((line, i) => {
    if (line && i > 0) {
      let cells = line.split(",");
      if (Number(cells[0])) {

        let buildObj = {};
        buildObj["id"] = new Date(cells[0] * 1000).toISOString();

        headLine.forEach((h, j) => {
          // csvNames[h] === 'timestamp' ?
          //   buildObj[csvNames[h]] = Number(cells[j]) :
          buildObj[csvNames[h]] = Number(cells[j]);
        })
        buildingData.push(buildObj);
      }
    }
  })
  // console.log(buildingData);
  return buildingData;
}


function documentInsert(itemIndex, itemArray, colId, fileIndex, fileArray, fullDir) {
  itemIndex--;
  if (itemIndex >= 0 && itemIndex <= itemArray.length) {
    let item = itemArray[itemIndex];
    docDbClient.createDocument(colId, item, function (err, doc) {
      if (err) {
        console.log("error", itemIndex);
        documentInsert(itemIndex, itemArray, colId, fileIndex, fileArray, fullDir);

      } else {
        console.log("Success", itemIndex);
        documentInsert(itemIndex, itemArray, colId, fileIndex, fileArray, fullDir);
      }
    });
  } else if (itemIndex < 0) {
    iterateEachFile(fileIndex, fileArray, fullDir, colId);
  }
}

function mapReduceMinute(itemArray) {
  let mapReduceArray = [];
  let uniqMinutes = {};
  itemArray.forEach(d => {
    let date = new Date(d.timestamp * 1000);
    let timeBase = Math.floor(date.getTime() / (1000 * 60)) * 60000; // minute
    uniqMinutes[timeBase] = true;
  })
  for (let time in uniqMinutes) {
    let filteredArr = itemArray.filter(d => {
      let date = new Date(d.timestamp * 1000);
      let timeBase = Math.floor(date.getTime() / (1000 * 60)) * 60000;
      // console.log(timeBase, time);
      return timeBase === Number(time);
    })
    // console.log(filteredArr[0]);
    let objList = [];
    for (let k in filteredArr[0]) {
      (k == 'timestamp' || k == 'id') ? '' : objList.push(k);
    }
    // console.log(objList);
    let returnObj = {};
    objList.forEach(prop => {
      let avg = 0;
      let totalSum = 0;
      filteredArr.forEach((d, i, arr) => {
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
      returnObj[prop] = Number(avg);
    })
    returnObj['id'] = new Date(Number(time)).toISOString();
    returnObj['timestamp'] = Number(time) / 1000;
    mapReduceArray.push(returnObj);
  }
  console.log(mapReduceArray[0], "map red arra");
  return mapReduceArray;
}


function mapReduceHour(itemArray) {
  let mapReduceArray = [];
  let uniqMinutes = {};
  itemArray.forEach(d => {
    let date = new Date(d.timestamp * 1000);
    let timeBase = Math.floor(date.getTime() / (1000 * 60 * 60)) * 60000 * 60; // hours
    uniqMinutes[timeBase] = true;
  })
  for (let time in uniqMinutes) {
    let filteredArr = itemArray.filter(d => {
      let date = new Date(d.timestamp * 1000);
      let timeBase = Math.floor(date.getTime() / (1000 * 60 * 60)) * 60000 * 60; // hours
      // console.log(timeBase, time);
      return timeBase === Number(time);
    })
    // console.log(filteredArr[0]);
    let objList = [];
    for (let k in filteredArr[0]) {
      (k == 'timestamp' || k == 'id') ? '' : objList.push(k);
    }
    // console.log(objList);
    let returnObj = {};
    objList.forEach(prop => {
      let avg = 0;
      let totalSum = 0;
      filteredArr.forEach((d, i, arr) => {
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
      returnObj[prop] = Number(avg);
    })
    returnObj['id'] = new Date(Number(time)).toISOString();
    returnObj['timestamp'] = Number(time) / 1000;
    mapReduceArray.push(returnObj);
  }
  console.log(mapReduceArray[0], "map red hour arra");
  return mapReduceArray;
}