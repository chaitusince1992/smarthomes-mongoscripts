'strict';

const testFolder = './';
const fs = require('fs');
const util = require('util');
const path = require('path');
const es = require('event-stream');
const homeData = require('./building-meta.js')
// var mongodb = require('mongodb');
var mongo = require('./mongo.js');
var db;
mongo.getCollection(function (dbs) {
  db = dbs;
  readFiles2();
}, function () {
  console.log("error connecting to db...")
})

// lineCount = 0;
const indexOfBuilding = 1;
const baseFolder = "building" + indexOfBuilding;
function readFiles2() {

  // fs.readdir(testFolder, (err, dirArr) => {
  //   iterateEachDir(dirArr.length, dirArr, testFolder);
  // });
  let dir = testFolder + baseFolder;
  fs.readdir(dir, (err, filesArr) => {
    iterateEachFile(filesArr.length, filesArr, dir);
  })
}

function iterateEachDir(j, dirArray, dir) {
  j--;
  if (j >= 0) {
    let subDir;
    if (dirArray && dirArray[j]) {
      subDir = dirArray[j];
    } else {
      console.log("something is wrong...", dirArray, j);
    }
    if (subDir && subDir.indexOf("building") != -1) {
      // console.log(subDir, "+++++++");
      fs.readdir(dir + subDir, (err, buildFileArr) => {
        iterateEachFile(buildFileArr.length, buildFileArr, dir + subDir, j, dirArray, dir);
      })
    } else {
      iterateEachDir(j, dirArray, dir);
    }
  } else {
    console.log("The end");
  }
}

let failedCount = 0;
function iterateEachFile(i, fileArray, fullDir) {
  i--;
  if (i >= 0) {
    let file;
    if (fileArray && fileArray[i]) {
      file = fileArray[i];
    } else {
      console.log("something is wrong...", fileArray, i);
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
              console.log(lineCount);
              let dataArray = parseCSV(lineStream);

              // dataArray.forEach((d, j) => {
              db.collection(baseFolder).insertMany(dataArray).then(() => {
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                process.stdout.write(`done inserting... ${fullDir}/${file}\n`);
                iterateEachFile(i, fileArray, fullDir);
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
    // collectionCount--;
    // its the end
    // iterateEachDir(j, dirArray, dir);
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














// fs.readFile('./building0/dataset_2014-10-03.csv', "utf-8",  (e, data) => {
//   if (e) throw e;
//   console.log(data);
// });




// csvData = `timestamp,000D6F0002907BA2,000D6F0002907BC8,000D6F0002907BDF,000D6F0002907BF5,000D6F0002907C89,000D6F0002908150,000D6F0002908162,000D6F00029C506A
// 1386374137.122849,0.0,0.0,0.0,6.580665311387137,0.0,NULL,12.885029880714516,0.0
// 1386374138.125722,0.0,2.2675751981909307,0.0,6.580665311387137,0.0,NULL,10.760647597181261,0.0
// 1386374139.125807,0.0,0.0,0.0,6.580665311387137,0.0,NULL,12.885029880714516,0.0
// 1386374140.128412,0.0,0.0,0.0,6.580665311387137,0.0,NULL,10.760647597181261,0.0
// 1386374141.127958,0.0,0.0,0.0,6.580665311387137,0.0,NULL,10.760647597181261,0.0
// 1386374142.123352,0.0,0.0,0.0,6.580665311387137,0.0,NULL,12.885029880714516,0.0
// 1386374143.135194,0.0,0.0,0.0,6.580665311387137,0.0,NULL,10.760647597181261,0.0
// `
// let buildingData = [];
// let lines = csvData.split('\n');
// let headLine = lines[0].split(",");
// eachLine.forEach((line, i) => {
//   if (line && i > 0) {
//     // console.log(line.split(","));
//     let cells = line.split(",");
//     let buildObj = {};
//     headLine.forEach((h, j) => {
//       // buildingData.push({
//       buildObj[h] = cells[j];
//       // })
//     })
//     buildingData.push(buildObj);
//   }
// })
// console.log(buildingData);




function tempMethod() {

  fs.readdir(testFolder + file, (err, build) => {
    // console.log(typeof build, build.length);
    if (indexTest < 0)
      doSomething();
    build.forEach((d, i) => {
      if (d.indexOf(".csv") != -1 && i < 3) {

        /* let lineStream = [];
        let lineCount = 0;
        fs.createReadStream(`${file}/${d}`)
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
                console.log(lineCount);
                let dataArray = parseCSV(lineStream);

                // dataArray.forEach((d, j) => {
                db.collection('test').insertMany(dataArray).then(() => {
                  // console.log("done inserting...", i, "and " + j + " of ", build.length);
                  process.stdout.clearLine();
                  process.stdout.cursorTo(0);
                  // process.stdout.write(`done inserting...  ${j} of, ${lineCount} and , ${i} file`);
                  process.stdout.write(`done inserting... ${lineCount}, ${i} file  ${build.length}`);
                }, () => {
                  console.log("Failed", i, j, d._id, d.timestamp)
                })
                // })
              })
          ) */
        /* fs.readFile(file + "/" + d, "utf-8", (e, data) => {
          fs.writeFile(file + "/" + "dataset-all.csv", data, e => {
            console.log("Written to file", i);
          })
        }) */
        fs.createReadStream(`${file}/${d}`)
          .pipe(es.split())
          .pipe(
            es.mapSync(line => {
              fs.appendFileSync(file + "/" + "a-dataset-all.csv", line + '\n', e => {
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                process.stdout.write("Written to file", i);
              })
            })
              .on('error', err => {

              })
              .on('end', () => {
                console.log("Done...");
              })
          )
        /* fs.readFile(file + "/" + d, "utf-8", (e, data) => {
          if (e) throw e;
          let dataArray = parseCSV(data);
          // console.log(file, d, dataArray.length);
          // setTimeout(() => {
          //   console.log("Waited 1 sec", i);
          // }, 1000);
          // await db.createCollection("test");
          dataArray.forEach((d, j) => {
            db.collection('test').insertOne(d).then(() => {
              // console.log("done inserting...", i, "and " + j + " of ", build.length);
              process.stdout.clearLine();
              process.stdout.cursorTo(0);
              process.stdout.write(`done inserting..., ${i}, and  ${j} of, ${build.length}`);
            }, () => {
              console.log("Failed", i, j, d._id, d.timestamp)
            })
          })
          // db.collection('test').insertMany(dataArray).then(() => {
          //   console.log("done inserting...", i, " of ", build.length);
          // }, () => {
          //   console.log("Failed")
          // })
        }); */
      }
      // console.log("---------" + d);
    })
  })
}
