//All house/home and appliance combinations....
var allHouses = JSON.parse(JSON.stringify(homeData.Houses)); //not to refer
var applObject = {};
var temp = {};
allHouses.forEach(function (home) {
    home.appliances.forEach(function (appl) {
        applObject["y" + home.original_name.split("#")[1] + "_" + appl.meters[0]] = appl.type;
        temp[appl.type] = true;
    })
})

var applUniqueArray = [];
for (var key in temp) {
    applUniqueArray.push(key);
}


var allApplObj = {};
applUniqueArray.forEach(function (appl) {
    allApplObj[appl] = [];
    for (var key in applObject) {
        if (applObject[key] === appl) {
            allApplObj[appl].push(key)
        }
    }
})

var finalDataArray = [];
data.forEach(function (dataObj) {
    var applItr = 0;
    var finalDataObject = {};
    for (var key in allApplObj) {
        var test = 0;
        finalDataObject["x"] = dataObj["x"];
        allApplObj[key].forEach(function (d) {
            test = test + dataObj[d];
        })
        finalDataObject["y" + applItr] = test;
        applItr++;
    }
    finalDataArray.push(finalDataObject);
})

var sumResult = {};
sumResult["total"] = 0;
for (var key in finalDataArray[0]) {
    if (key != "x") {
        sumResult[key] = 0;
        finalDataArray.forEach(function (dataObj) {
            sumResult[key] = sumResult[key] + dataObj[key];
            sumResult["total"] = sumResult["total"] + dataObj[key];
        })
    }
}
console.log(sumResult);


/*BuildingMetaData*/

//Home0
let metaData = {
    data: [{
        homeId: 0,
        homeTitle: "Draw Retired Couple",
        houseType: "detached",
        noOfFloors: 2,
        homeDescription: "This is a detached house with 2 floors in Spittal an der Drau (AT). The residents are a retired couple, spending most of time at home.",
        applianceId: 0,
        applianceTitle: "Coffee Machine",
        applianceDescription: "Coffee Machine",
        applMongoCode: 0
    }, {
        homeId: 0,
        homeTitle: "Draw Retired Couple",
        houseType: "detached",
        noOfFloors: 2,
        homeDescription: "This is a detached house with 2 floors in Spittal an der Drau (AT). The residents are a retired couple, spending most of time at home.",
        applianceId: 1,
        applianceTitle: "Washing Machine",
        applianceDescription: "Washing Machine",
        applMongoCode: 1
    }, {
        homeId: 0,
        homeTitle: "Draw Retired Couple",
        houseType: "detached",
        noOfFloors: 2,
        homeDescription: "This is a detached house with 2 floors in Spittal an der Drau (AT). The residents are a retired couple, spending most of time at home.",
        applianceId: 2,
        applianceTitle: "Radio",
        applianceDescription: "radio w/ amplifier",
        applMongoCode: 2
    }, {
        homeId: 0,
        homeTitle: "Draw Retired Couple",
        houseType: "detached",
        noOfFloors: 2,
        homeDescription: "This is a detached house with 2 floors in Spittal an der Drau (AT). The residents are a retired couple, spending most of time at home.",
        applianceId: 3,
        applianceTitle: "Kettle",
        applianceDescription: "Water Kettle",
        applMongoCode: 3
    }, {
        homeId: 0,
        homeTitle: "Draw Retired Couple",
        houseType: "detached",
        noOfFloors: 2,
        homeDescription: "This is a detached house with 2 floors in Spittal an der Drau (AT). The residents are a retired couple, spending most of time at home.",
        applianceId: 4,
        applianceTitle: "Fridge",
        applianceDescription: "Fridge w/ freezer",
        applMongoCode: 4
    }, {
        homeId: 0,
        homeTitle: "Draw Retired Couple",
        houseType: "detached",
        noOfFloors: 2,
        homeDescription: "This is a detached house with 2 floors in Spittal an der Drau (AT). The residents are a retired couple, spending most of time at home.",
        applianceId: 5,
        applianceTitle: "Dishwasher",
        applianceDescription: "Dishwasher",
        applMongoCode: 5
    }, {
        homeId: 0,
        homeTitle: "Draw Retired Couple",
        houseType: "detached",
        noOfFloors: 2,
        homeDescription: "This is a detached house with 2 floors in Spittal an der Drau (AT). The residents are a retired couple, spending most of time at home.",
        applianceId: 6,
        applianceTitle: "Lamp",
        applianceDescription: "Kitchen Lamp",
        applMongoCode: 6
    }, {
        homeId: 0,
        homeTitle: "Draw Retired Couple",
        houseType: "detached",
        noOfFloors: 2,
        homeDescription: "This is a detached house with 2 floors in Spittal an der Drau (AT). The residents are a retired couple, spending most of time at home.",
        applianceId: 7,
        applianceTitle: "TV",
        applianceDescription: "TV",
        applMongoCode: 7
    },
    
    
    
    //    Home1
    {
        homeId: 1,
        homeTitle: "Klagenfurt working Young Couple",
        houseType: "appartment",
        noOfFloors: 1,
        homeDescription: "This is an apartment with 1 floor in Klagenfurt (AT). The residents are a young couple, spending most of daylight time at work during weekdays, mostly being at home in evenings and weekend.",
        applianceId: 4,
        applianceTitle: "Fridge",
        applianceDescription: "Fridge w/ freezer",
        applMongoCode: 0
    }, {
        homeId: 1,
        homeTitle: "Klagenfurt working Young Couple",
        houseType: "appartment",
        noOfFloors: 1,
        homeDescription: "This is an apartment with 1 floor in Klagenfurt (AT). The residents are a young couple, spending most of daylight time at work during weekdays, mostly being at home in evenings and weekend.",
        applianceId: 5,
        applianceTitle: "Dishwasher",
        applianceDescription: "Dishwasher",
        applMongoCode: 1
    }, {
        homeId: 1,
        homeTitle: "Klagenfurt working Young Couple",
        houseType: "appartment",
        noOfFloors: 1,
        homeDescription: "This is an apartment with 1 floor in Klagenfurt (AT). The residents are a young couple, spending most of daylight time at work during weekdays, mostly being at home in evenings and weekend.",
        applianceId: 8,
        applianceTitle: "Oven",
        applianceDescription: "Microwave Oven",
        applMongoCode: 2
    }, {
        homeId: 1,
        homeTitle: "Klagenfurt working Young Couple",
        houseType: "appartment",
        noOfFloors: 1,
        homeDescription: "This is an apartment with 1 floor in Klagenfurt (AT). The residents are a young couple, spending most of daylight time at work during weekdays, mostly being at home in evenings and weekend.",
        applianceId: 3,
        applianceTitle: "Kettle",
        applianceDescription: "Water Kettle",
        applMongoCode: 3
    }, {
        homeId: 1,
        homeTitle: "Klagenfurt working Young Couple",
        houseType: "appartment",
        noOfFloors: 1,
        homeDescription: "This is an apartment with 1 floor in Klagenfurt (AT). The residents are a young couple, spending most of daylight time at work during weekdays, mostly being at home in evenings and weekend.",
        applianceId: 1,
        applianceTitle: "Washing Machine",
        applianceDescription: "Washing Machine",
        applMongoCode: 4
    }, {
        homeId: 1,
        homeTitle: "Klagenfurt working Young Couple",
        houseType: "appartment",
        noOfFloors: 1,
        homeDescription: "This is an apartment with 1 floor in Klagenfurt (AT). The residents are a young couple, spending most of daylight time at work during weekdays, mostly being at home in evenings and weekend.",
        applianceId: 2,
        applianceTitle: "Radio",
        applianceDescription: "radio w/ amplifier",
        applMongoCode: 5
    }, {
        homeId: 1,
        homeTitle: "Klagenfurt working Young Couple",
        houseType: "appartment",
        noOfFloors: 1,
        homeDescription: "This is an apartment with 1 floor in Klagenfurt (AT). The residents are a young couple, spending most of daylight time at work during weekdays, mostly being at home in evenings and weekend.",
        applianceId: 9,
        applianceTitle: "Hair Drier",
        applianceDescription: "Hair Drier",
        applMongoCode: 6
    }, {
        homeId: 1,
        homeTitle: "Klagenfurt working Young Couple",
        houseType: "appartment",
        noOfFloors: 1,
        homeDescription: "This is an apartment with 1 floor in Klagenfurt (AT). The residents are a young couple, spending most of daylight time at work during weekdays, mostly being at home in evenings and weekend.",
        applianceId: 10,
        applianceTitle: "Kitchen ware",
        applianceDescription: "Mixer and fruid juicer",
        applMongoCode: 7
    }, {
        homeId: 1,
        homeTitle: "Klagenfurt working Young Couple",
        houseType: "appartment",
        noOfFloors: 1,
        homeDescription: "This is an apartment with 1 floor in Klagenfurt (AT). The residents are a young couple, spending most of daylight time at work during weekdays, mostly being at home in evenings and weekend.",
        applianceId: 6,
        applianceTitle: "Lamp",
        applianceDescription: "Bedside light",
        applMongoCode: 8
    },
    
    //    Home2
    {
        homeId: 2,
        homeTitle: "Klagenfurt working Young Couple",
        houseType: "detached",
        noOfFloors: 2,
        homeDescription: "This is a detached house with 2 floors in Spittal an der Drau (AT). The residents are a mature couple (1 housewife and 1 employed) and an employed adult son (28 years).",
        applianceId: 7,
        applianceTitle: "TV",
        applianceDescription: "TV",
        applMongoCode: 0
    }, {
        homeId: 2,
        homeTitle: "Klagenfurt working Young Couple",
        houseType: "detached",
        noOfFloors: 2,
        homeDescription: "This is a detached house with 2 floors in Spittal an der Drau (AT). The residents are a mature couple (1 housewife and 1 employed) and an employed adult son (28 years).",
        applianceId: 11,
        applianceTitle: "NAS",
        applianceDescription: "Network Attached Storage",
        applMongoCode: 1
    }, {
        homeId: 2,
        homeTitle: "Klagenfurt working Young Couple",
        houseType: "detached",
        noOfFloors: 2,
        homeDescription: "This is a detached house with 2 floors in Spittal an der Drau (AT). The residents are a mature couple (1 housewife and 1 employed) and an employed adult son (28 years).",
        applianceId: 1,
        applianceTitle: "Washing Machine",
        applianceDescription: "Washing Machine",
        applMongoCode: 2
    }, {
        homeId: 2,
        homeTitle: "Klagenfurt working Young Couple",
        houseType: "detached",
        noOfFloors: 2,
        homeDescription: "This is a detached house with 2 floors in Spittal an der Drau (AT). The residents are a mature couple (1 housewife and 1 employed) and an employed adult son (28 years).",
        applianceId: 12,
        applianceTitle: "Spin Drier",
        applianceDescription: "Cloth Drier",
        applMongoCode: 3
    }, {
        homeId: 2,
        homeTitle: "Klagenfurt working Young Couple",
        houseType: "detached",
        noOfFloors: 2,
        homeDescription: "This is a detached house with 2 floors in Spittal an der Drau (AT). The residents are a mature couple (1 housewife and 1 employed) and an employed adult son (28 years).",
        applianceId: 5,
        applianceTitle: "Dishwasher",
        applianceDescription: "Dishwasher",
        applMongoCode: 4
    }, {
        homeId: 2,
        homeTitle: "Klagenfurt working Young Couple",
        houseType: "detached",
        noOfFloors: 2,
        homeDescription: "This is a detached house with 2 floors in Spittal an der Drau (AT). The residents are a mature couple (1 housewife and 1 employed) and an employed adult son (28 years).",
        applianceId: 13,
        applianceTitle: "Notebook",
        applianceDescription: "Laptop",
        applMongoCode: 5
    }, {
        homeId: 2,
        homeTitle: "Klagenfurt working Young Couple",
        houseType: "detached",
        noOfFloors: 2,
        homeDescription: "This is a detached house with 2 floors in Spittal an der Drau (AT). The residents are a mature couple (1 housewife and 1 employed) and an employed adult son (28 years).",
        applianceId: 10,
        applianceTitle: "Kitchen ware",
        applianceDescription: "Mixer and fruid juicer",
        applMongoCode: 6
    }, {
        homeId: 2,
        homeTitle: "Klagenfurt working Young Couple",
        houseType: "detached",
        noOfFloors: 2,
        homeDescription: "This is a detached house with 2 floors in Spittal an der Drau (AT). The residents are a mature couple (1 housewife and 1 employed) and an employed adult son (28 years).",
        applianceId: 0,
        applianceTitle: "Coffee Machine",
        applianceDescription: "Coffee Machine",
        applMongoCode: 7
    }, {
        homeId: 2,
        homeTitle: "Klagenfurt working Young Couple",
        houseType: "detached",
        noOfFloors: 2,
        homeDescription: "This is a detached house with 2 floors in Spittal an der Drau (AT). The residents are a mature couple (1 housewife and 1 employed) and an employed adult son (28 years).",
        applianceId: 14,
        applianceTitle: "Bread Machine",
        applianceDescription: "Bread Machine",
        applMongoCode: 8
    },
    
    //    Home3
    {
        homeId: 3,
        homeTitle: "Klagenfurt working Young Couple",
        houseType: "detached",
        noOfFloors: 2,
        homeDescription: "This is a detached house with 2 floors in Klagenfurt (AT). The residents are a mature couple (1 working part-time and 1 full time), living with two young kids.",
        applianceId: 15,
        applianceTitle: "Vaccum Cleaner",
        applianceDescription: "Entrance Outlet",
        applMongoCode: 0
    }, {
        homeId: 3,
        homeTitle: "Klagenfurt working Young Couple",
        houseType: "detached",
        noOfFloors: 2,
        homeDescription: "This is a detached house with 2 floors in Klagenfurt (AT). The residents are a mature couple (1 working part-time and 1 full time), living with two young kids.",
        applianceId: 5,
        applianceTitle: "Dishwasher",
        applianceDescription: "Dishwasher",
        applMongoCode: 1
    }, {
        homeId: 3,
        homeTitle: "Klagenfurt working Young Couple",
        houseType: "detached",
        noOfFloors: 2,
        homeDescription: "This is a detached house with 2 floors in Klagenfurt (AT). The residents are a mature couple (1 working part-time and 1 full time), living with two young kids.",
        applianceId: 3,
        applianceTitle: "Kettle",
        applianceDescription: "Water Kettle",
        applMongoCode: 2
    }, {
        homeId: 3,
        homeTitle: "Klagenfurt working Young Couple",
        houseType: "detached",
        noOfFloors: 2,
        homeDescription: "This is a detached house with 2 floors in Klagenfurt (AT). The residents are a mature couple (1 working part-time and 1 full time), living with two young kids.",
        applianceId: 4,
        applianceTitle: "Fridge",
        applianceDescription: "Fridge w/ freezer",
        applMongoCode: 3
    }, {
        homeId: 3,
        homeTitle: "Klagenfurt working Young Couple",
        houseType: "detached",
        noOfFloors: 2,
        homeDescription: "This is a detached house with 2 floors in Klagenfurt (AT). The residents are a mature couple (1 working part-time and 1 full time), living with two young kids.",
        applianceId: 1,
        applianceTitle: "Washing Machine",
        applianceDescription: "Washing Machine",
        applMongoCode: 4
    }, {
        homeId: 3,
        homeTitle: "Klagenfurt working Young Couple",
        houseType: "detached",
        noOfFloors: 2,
        homeDescription: "This is a detached house with 2 floors in Klagenfurt (AT). The residents are a mature couple (1 working part-time and 1 full time), living with two young kids.",
        applianceId: 9,
        applianceTitle: "Hair Drier",
        applianceDescription: "Hair Drier",
        applMongoCode: 5
    }, {
        homeId: 3,
        homeTitle: "Klagenfurt working Young Couple",
        houseType: "detached",
        noOfFloors: 2,
        homeDescription: "This is a detached house with 2 floors in Klagenfurt (AT). The residents are a mature couple (1 working part-time and 1 full time), living with two young kids.",
        applianceId: 16,
        applianceTitle: "Computer",
        applianceDescription: "Computer",
        applMongoCode: 6
    }, {
        homeId: 3,
        homeTitle: "Klagenfurt working Young Couple",
        houseType: "detached",
        noOfFloors: 2,
        homeDescription: "This is a detached house with 2 floors in Klagenfurt (AT). The residents are a mature couple (1 working part-time and 1 full time), living with two young kids.",
        applianceId: 0,
        applianceTitle: "Coffee Machine",
        applianceDescription: "Coffee Machine",
        applMongoCode: 7
    }, {
        homeId: 3,
        homeTitle: "Klagenfurt working Young Couple",
        houseType: "detached",
        noOfFloors: 2,
        homeDescription: "This is a detached house with 2 floors in Klagenfurt (AT). The residents are a mature couple (1 working part-time and 1 full time), living with two young kids.",
        applianceId: 7,
        applianceTitle: "TV",
        applianceDescription: "TV",
        applMongoCode: 8
    },
    
    //    Home4
    {
        homeId: 4,
        homeTitle: "Klagenfurt working Young Couple",
        houseType: "appartment",
        noOfFloors: 2,
        homeDescription: "This is an apartment with 2 floors in Udine (IT). The residents are a young couple, spending most of daylight time at work during weekdays, although being at home in evenings and weekend.",
        applianceId: 7,
        applianceTitle: "TV",
        applianceDescription: "Kitchen TV",
        applMongoCode: 2
    }, {
        homeId: 4,
        homeTitle: "Klagenfurt working Young Couple",
        houseType: "appartment",
        noOfFloors: 2,
        homeDescription: "This is an apartment with 2 floors in Udine (IT). The residents are a young couple, spending most of daylight time at work during weekdays, although being at home in evenings and weekend.",
        applianceId: 7,
        applianceTitle: "TV",
        applianceDescription: "Living room TV",
        applMongoCode: 3
    }, {
        homeId: 4,
        homeTitle: "Klagenfurt working Young Couple",
        houseType: "appartment",
        noOfFloors: 2,
        homeDescription: "This is an apartment with 2 floors in Udine (IT). The residents are a young couple, spending most of daylight time at work during weekdays, although being at home in evenings and weekend.",
        applianceId: 4,
        applianceTitle: "Fridge",
        applianceDescription: "Fridge w/ freezer",
        applMongoCode: 4
    }, {
        homeId: 4,
        homeTitle: "Klagenfurt working Young Couple",
        houseType: "appartment",
        noOfFloors: 2,
        homeDescription: "This is an apartment with 2 floors in Udine (IT). The residents are a young couple, spending most of daylight time at work during weekdays, although being at home in evenings and weekend.",
        applianceId: 8,
        applianceTitle: "Oven",
        applianceDescription: "Electric Oven",
        applMongoCode: 5
    }, {
        homeId: 4,
        homeTitle: "Klagenfurt working Young Couple",
        houseType: "appartment",
        noOfFloors: 2,
        homeDescription: "This is an apartment with 2 floors in Udine (IT). The residents are a young couple, spending most of daylight time at work during weekdays, although being at home in evenings and weekend.",
        applianceId: 16,
        applianceTitle: "Computer",
        applianceDescription: "Computer",
        applMongoCode: 6
    }, {
        homeId: 4,
        homeTitle: "Klagenfurt working Young Couple",
        houseType: "appartment",
        noOfFloors: 2,
        homeDescription: "This is an apartment with 2 floors in Udine (IT). The residents are a young couple, spending most of daylight time at work during weekdays, although being at home in evenings and weekend.",
        applianceId: 1,
        applianceTitle: "Washing Machine",
        applianceDescription: "Washing Machine",
        applMongoCode: 7
    }, {
        homeId: 4,
        homeTitle: "Klagenfurt working Young Couple",
        houseType: "appartment",
        noOfFloors: 2,
        homeDescription: "This is an apartment with 2 floors in Udine (IT). The residents are a young couple, spending most of daylight time at work during weekdays, although being at home in evenings and weekend.",
        applianceId: 17,
        applianceTitle: "Hood",
        applianceDescription: "Kitchen Hood",
        applMongoCode: 8
    },
    
    //    Home5
    {
        homeId: 5,
        homeTitle: "Collarado di plato family",
        houseType: "detached",
        noOfFloors: 2,
        homeDescription: "This is a detached house with 2 floors in Colloredo di Prato (IT). The residents are a mature couple (1 housewife and 1 employed) and an employed adult son (30 years).",
        applianceId: 7,
        applianceTitle: "TV",
        applianceDescription: "Plasma TV",
        applMongoCode: 0
    }, {
        homeId: 5,
        homeTitle: "Collarado di plato family",
        houseType: "detached",
        noOfFloors: 2,
        homeDescription: "This is a detached house with 2 floors in Colloredo di Prato (IT). The residents are a mature couple (1 housewife and 1 employed) and an employed adult son (30 years).",
        applianceId: 6,
        applianceTitle: "Lamp",
        applianceDescription: "Lamp",
        applMongoCode: 1
    }, {
        homeId: 5,
        homeTitle: "Collarado di plato family",
        houseType: "detached",
        noOfFloors: 2,
        homeDescription: "This is a detached house with 2 floors in Colloredo di Prato (IT). The residents are a mature couple (1 housewife and 1 employed) and an employed adult son (30 years).",
        applianceId: 18,
        applianceTitle: "Toaster",
        applianceDescription: "Toaster",
        applMongoCode: 2
    }, {
        homeId: 5,
        homeTitle: "Collarado di plato family",
        houseType: "detached",
        noOfFloors: 2,
        homeDescription: "This is a detached house with 2 floors in Colloredo di Prato (IT). The residents are a mature couple (1 housewife and 1 employed) and an employed adult son (30 years).",
        applianceId: 19,
        applianceTitle: "Hob",
        applianceDescription: "Stove or radiator",
        applMongoCode: 3
    }, {
        homeId: 5,
        homeTitle: "Collarado di plato family",
        houseType: "detached",
        noOfFloors: 2,
        homeDescription: "This is a detached house with 2 floors in Colloredo di Prato (IT). The residents are a mature couple (1 housewife and 1 employed) and an employed adult son (30 years).",
        applianceId: 20,
        applianceTitle: "Iron",
        applianceDescription: "Cloth iron box",
        applMongoCode: 4
    }, {
        homeId: 5,
        homeTitle: "Collarado di plato family",
        houseType: "detached",
        noOfFloors: 2,
        homeDescription: "This is a detached house with 2 floors in Colloredo di Prato (IT). The residents are a mature couple (1 housewife and 1 employed) and an employed adult son (30 years).",
        applianceId: 7,
        applianceTitle: "TV",
        applianceDescription: "LCD TV",
        applMongoCode: 6
    }, {
        homeId: 5,
        homeTitle: "Collarado di plato family",
        houseType: "detached",
        noOfFloors: 2,
        homeDescription: "This is a detached house with 2 floors in Colloredo di Prato (IT). The residents are a mature couple (1 housewife and 1 employed) and an employed adult son (30 years).",
        applianceId: 16,
        applianceTitle: "Computer",
        applianceDescription: "Computer w/ scanner and printer",
        applMongoCode: 5
    }, {
        homeId: 5,
        homeTitle: "Collarado di plato family",
        houseType: "detached",
        noOfFloors: 2,
        homeDescription: "This is a detached house with 2 floors in Colloredo di Prato (IT). The residents are a mature couple (1 housewife and 1 employed) and an employed adult son (30 years).",
        applianceId: 1,
        applianceTitle: "Washing Machine",
        applianceDescription: "Washing Machine",
        applMongoCode: 7
    }, {
        homeId: 5,
        homeTitle: "Collarado di plato family",
        houseType: "detached",
        noOfFloors: 2,
        homeDescription: "This is a detached house with 2 floors in Colloredo di Prato (IT). The residents are a mature couple (1 housewife and 1 employed) and an employed adult son (30 years).",
        applianceId: 4,
        applianceTitle: "Fridge",
        applianceDescription: "Fridge w/ freezer",
        applMongoCode: 8
    }]
}


//sample queries

db.getCollection('buildingMeta').find({
    "applianceId": 0
})
db.getCollection('buildingMeta').find({
    "homeId": 0
})

//multiple appliance inputs
db.getCollection('buildingMeta').find({
    $or: [{
        "applianceId": 0
    }, {
        "applianceId": 1
    }]
})
//multiple appliance with sort
db.getCollection('buildingMeta').find({
    $or: [{
        "applianceId": 0
    }, {
        "applianceId": 1
    }, {
        "applianceId": 2
    }, {
        "applianceId": 3
    }]
}).sort({
    "applianceId": 1
})


//multiple appliance and home combination
db.getCollection('buildingMeta').find({
    $and: [{
        $or: [{
            "applianceId": 0
        }, {
            "applianceId": 1
        }, {
            "applianceId": 2
        }, {
            "applianceId": 3
        }]
    }, {
        $or: [{
            "homeId": 0
        }, {
            "homeId": 1
        }]
    }]
}).sort({
    "homeId": 1
})



[{
    "$match": {
        $and: [{
            $or: [{
                "applianceId": 0
            }, {
                "applianceId": 1
            }, {
                "applianceId": 2
            }, {
                "applianceId": 3
            }]
        }, {
            $or: [{
                "homeId": 0
            }, {
                "homeId": 1
            }]
        }]
    }
}, {
    "$group": {
        "_id": {
            "hour": {
                "$hour": "$_id"
            },
            "minute": {
                "$floor": {
                    "$divide": [{
                        "$minute": "$_id"
                    }, 60]
                }
            }
        },
        "x": {
            "$first": "$value.key"
        },
        "y3": {
            "$avg": {
                "$sum": ["$value.appliance7"]
            }
        }
    }
}, {
        "$sort": {
            "homeId": 1
        }
    }]





db.buildingMeta.mapReduce(
    function () {
        emit(this.homeId, this);
    },
    function (homeId, data) {
        return data[1];
    }, {
        //            out:{"merge": "test"},
        out: "test",
        query: {
            $and: [{
                $or: [{
                    "applianceId": 0
                }, {
                    "applianceId": 1
                }, {
                    "applianceId": 2
                }, {
                    "applianceId": 3
                }]
            }, {
                $or: [{
                    "homeId": 0
                }, {
                    "homeId": 1
                }]
            }]
        },

    }
)
$and: [{
    $or: [{
        "applianceId": 0
    }, {
        "applianceId": 1
    }, {
        "applianceId": 2
    }, {
        "applianceId": 3
    }]
}, {
    $or: [{
        "homeId": 0
    }, {
        "homeId": 1
    }]
}]


//all homes
db.getCollection("buildingMeta").group({
    key: {
        "homeId": 1,
        "homeTitle": 1,
        "homeDescription": 1
    },
    reduce: function (curr, result) { },
    initial: {},
    callback: function (err, docs) {
        if (!err) {
            console.log("docs")
        }
    }
})
db.getCollection("buildingMeta").group({
    key: {
        "homeId": 1,
        "homeTitle": 1,
        "homeDescription": 1
    },
    reduce: function (curr, result) { },
    initial: {},
    callback: function (err, docs) {
        console.log("docs")
    }
})

db.getCollection("buildingMeta").aggregate({
    $group: {
        "_id": "$homeId",
        homeTitle: {
            $first: "$homeTitle"
        },
        homeDescription: {
            $first: "$homeDescription"
        }
    }
}, {
        "$sort": {
            "_id": 1
        }
    })


//all appliances
db.getCollection("buildingMeta").group({
    key: {
        "applianceId": 1,
        "applianceTitle": 1
    },
    reduce: function (curr, result) { },
    initial: {}
})

//homes based on appliance inputs
db.getCollection("buildingMeta").group({
    key: {
        "homeId": 1,
        "homeTitle": 1,
        "homeDescription": 1
    },
    cond: {
        $or: [{
            "applianceId": 0
        }, {
            "applianceId": 1
        }, {
            "applianceId": 2
        }, {
            "applianceId": 3
        }]
    },
    reduce: function (curr, result) { },
    initial: {}
})

//appliance based on home inputs
db.getCollection("buildingMeta").group({
    key: {
        "applianceId": 1,
        "applianceTitle": 1
    },
    cond: {
        $or: [{
            "homeId": 0
        }, {
            "homeId": 1
        }]
    },
    reduce: function (curr, result) { },
    initial: {}
})

var homeIdArray = [0, 1, 2, 3, 4, 5] //we will give this as input obviously
//var applIdArray = [0, 1, 2, 3, 4, 5] //this also we'll give as input

homeDataObj = {};
homeIdArray.forEach(function (id) {
    homeDataObj[id] = [];
    data.forEach(function (e) {
        if (id === e.homeId) {
            homeDataObj[id].push(e.applMongoCode)
        }
    })

})

db.getCollection("buildingMeta").aggregate([{
    "$match": {
        homeId: 0
    }
}])




var temp = {},
    applUniqueArray = [];
applHomeRefCode.forEach(function (d) {
    temp[d.applianceId] = true;
})
for (var key in temp) {
    applUniqueArray.push(Number(key));
}
var finalDataArray = [];
resultToSend.forEach(function (r) {
    var finalDataObject = {};
    applUniqueArray.forEach(function (u) {
        finalDataObject["y" + u] = 0;
        applHomeRefCode.forEach(function (d) {
            if (u === d.applianceId) {
                // console.log(u,d._id,resultToSend[0]["y"+d._id]);
                finalDataObject["y" + u] = finalDataObject["y" + u] + r["y" + d._id];
            }
        })
    })
    finalDataArray.push(finalDataObject)
})
console.log(finalDataArray);




db.getCollection("buildingMeta").aggregate([{
    "$match": {
        "$or": [{
            "homeId": 0
        }, {
            "homeId": 1
        }, {
            "homeId": 2
        }, {
            "homeId": 3
        }]
    }
}, {
    "$group": {
        "_id": {
            "$concat": [{
                "$substr": ["$homeId", 0, 2]
            }, "_", {
                "$substr": ["$applMongoCode", 0, 2]
            }]
        },
        "mongoRefCode": {
            "$first": {
                "$concat": [{
                    "$substr": ["$homeId", 0, 2]
                }, "_", {
                    "$substr": ["$applMongoCode", 0, 2]
                }]
            }
        },
        "applianceId": {
            "$first": "$applianceId"
        }
    }
}, {
    "$sort": {
        "applianceId": 1
    }
}])



var dateForm = function (inputDate) {
    return new Date(new Date(inputDate).getFullYear() + "-" + (new Date(inputDate).getMonth() + 1) + "-" + new Date(inputDate).getDate());
}
var resultToSend = [];

var uniqueTimeArray = function (data) {
    var timeUniq = {};
    var resArr = [];
    data.forEach(function (d) {
        d.forEach(function (e) {
            timeUniq[dateForm(e["x"])] = true;
        })
    })
    for (var key in timeUniq) {
        resArr.push({ x: key });
    }
    return resArr;
}

data.forEach(function (docs, objCount, c) {
    docs.forEach(function (doc, k, j) {
        resultToSend.forEach(function (d, e, f) {
            if (dateForm(d.x).getTime() === dateForm(doc.x).getTime()) {
                for (var key in doc) {
                    if (key != "x" && key != "_id")
                        d[key] = doc[key];
                }
            }
        })
    })
})
data.forEach(function (docs, objCount, c) {
    if (objCount === 0) {
        docs.forEach(function (doc) {
            var eachObj = {};
            for (var keyRes in doc) {
                if (keyRes === "x") {
                    eachObj[keyRes] = dateForm(doc[keyRes]);
                } else if (keyRes != "_id") {
                    eachObj[keyRes] = doc[keyRes];
                }
            }
            resultToSend.push(eachObj);
        })

    } else {
        resultToSend.forEach(function (d, e, f) {
            /*var f = resultToSend;
            for(var e=0;e<f.length;e++) {
                d = f[e];*/
            docs.forEach(function (doc, k, j) {
                if (dateForm(d.x).getTime() === dateForm(doc["x"]).getTime()) {
                    for (var keyRes in doc) {
                        if (keyRes != "_id" && keyRes != "x")
                            resultToSend[e][keyRes] = doc[keyRes];
                    }
                    console.log("yo");
                } else if (k === j.length - 1) {
                    console.log("no shit");
                    var eachObj = {};
                    for (var keyRes in doc) {
                        if (keyRes === "x") {
                            eachObj[keyRes] = dateForm(doc[keyRes]);
                        } else if (keyRes != "_id") {
                            eachObj[keyRes] = doc[keyRes];
                        }
                    }
                    resultToSend.push(eachObj);
                }
            });
        })
    }
})
resultToSend.sort(function (x, y) {
    return d3.ascending(x.x, y.x);
})



/* Total Usage:

"y0": 7622497.050507307,
"y1": 61611655.03620526,
"y2": 1755504.070712805,
"y3": 2782603.0563330078,
"y4": 88523934.8754656,
"y5": 56036838.69917626,
"y6": 5701801.400215702,
"y7": 131173633.28824146,
"y8": 2609879.3047886053,
"y9": 3312570.10322936,
"y10": 2915475.2189737787,
"y11": 38498203.558285795,
"y12": 40995874.56598495,
"y13": 3149714.1776623973,
"y14": 50620.33180859743,
"y15": 794169.0976734122,
"y16": 13470180.605967445,
"y17": 706293.564634186,
"y18": 0,
"y19": 27213537.709061302,
"y20": 2031371.351551849 */


/*

1. Coffee Machine
{
    "0": [
        0
    ],
    "2": [
        7
    ],
    "3": [
        7
    ]
}

2. Washing Machine
{
    "0": [
        1
    ],
    "1": [
        4
    ],
    "2": [
        2
    ],
    "3": [
        4
    ],
    "4": [
        7
    ],
    "5": [
        7
    ]
}

3. Radio
{
    "0": [
        2
    ],
    "1": [
        5
    ]
}

4. Kettle
{
    "0": [
        3
    ],
    "1": [
        3
    ],
    "3": [
        2
    ]
}

5. Fridge
{
    "0": [
        4
    ],
    "1": [
        0
    ],
    "3": [
        3
    ],
    "4": [
        4
    ],
    "5": [
        8
    ]
}

6. Dishwasher
{
    "0": [
        5
    ],
    "1": [
        1
    ],
    "2": [
        4
    ],
    "3": [
        1
    ]
}

7. Lamp
{
    "0": [
        6
    ],
    "1": [
        8
    ],
    "5": [
        1
    ]
}

8. TV
{
    "0": [
        7
    ],
    "2": [
        0
    ],
    "3": [
        8
    ],
    "4": [
        2,
        3
    ],
    "5": [
        0,
        6
    ]
}

9. Oven
{
    "1": [
        2
    ],
    "4": [
        5
    ]
}

10. Hair Drier
{
    "1": [
        6
    ],
    "3": [
        5
    ]
}

11. Kitchen ware
{
    "1": [
        7
    ],
    "2": [
        6
    ]
}

12. NAS
{
    "2": [
        1
    ]
}

13. Spin Drier
{
    "2": [
        3
    ]
}

14. Notebook
{
    "2": [
        5
    ]
}

15. Bread Machine
{
    "2": [
        8
    ]
}

16. Vaccum Cleaner
{
    "3": [
        0
    ]
}

17. Computer
{
    "3": [
        6
    ],
    "4": [
        6
    ],
    "5": [
        5
    ]
}

18. Hood
{
    "4": [
        8
    ]
}

19. Toaster
{
    "5": [
        2
    ]
}

20. Hob
{
    "5": [
        3
    ]
}

21. Iron
{
    "5": [
        4
    ]
}
*/
