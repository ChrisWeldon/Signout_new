var express = require('express');
var app = express();
var csvjson = require('csvjson');
var fs = require('fs');
var path = require("path");
var bodyParser = require('body-parser');
var todayLog;

var students = csvjson.toObject(fs.readFileSync(path.join(__dirname, 'StudentList.csv'), { encoding : 'utf8'}), {
  delimiter : ',', // optional
  quote     : '"' // optional
});
var studentsId = {};
makeIds();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get("/studentList/:sort", function(req, res){
  var sendObj = {}
  var sort = req.params.sort;
  for (var key in students) {
    if (students.hasOwnProperty(key)) {
      if(students[key].last.toLowerCase().indexOf(sort) > -1 && students[key].last.toLowerCase().indexOf(sort) == 0 ){
        sendObj[students[key].id] = students[key];
      }
    }
  }
  res.send(sendObj);
});
app.get("/studentList", function(req, res){

  res.send(studentsId);
});

app.get("/signedout", function(req, res){
  var studentsOut = [];
  for(key in studentsId){
    if(studentsId.hasOwnProperty(key)){
      if(studentsId[key].status == false){
        studentsOut.push(studentsId[key]);
      }
    }
  }
  res.send(studentsOut);
});

app.get("/sign/:studentId/:state/:loc", function(req, res){

  todayLog = checkDate();

  var student = req.params.studentId;
  var status = req.params.state;
  var loc = req.params.loc;
  if(status == "out"){
    studentsId[student].status = false;
    studentsId[student].location = loc;
    studentsId[student].timeout = getTime();
  }else if(status == "in"){
    updateLog(studentsId[student]);
    displayPermToday();
    studentsId[student].status = true;
    studentsId[student].location = "Dorm";
  }

  res.send(studentsId[req.params.studentId]);
});

app.get("/get-today-log", function(req, res){
  todaypermlog = csvjson.toObject(fs.readFileSync(path.join(__dirname, todayLog), { encoding : 'utf8'}), {
    delimiter : ',', // optional
    quote     : '"' // optional
  });
  console.log(todaypermlog)
  res.send(todaypermlog);
});

app.get("/getlog/:date", function(req, res){
  var datepermlog = csvjson.toObject(fs.readFileSync(path.join(__dirname, "logs/" + req.params.date + ".csv"), { encoding : 'utf8'}), {
    delimiter : ',', // optional
    quote     : '"' // optional
  });
  res.send(datepermlog);
});

function updateLog(student){
  var val = student.id + "," + student.location + ","+ student.timeout + "," + getTime() + "\r\n";
  fs.appendFile(todayLog, val, function (err) {
  if (err) throw err;
  console.log('Saved!');
});
}


function getDate() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    //return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
    return month + "-" + day + "-" + year
}

function getTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    //return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
    if(hour - 12 > 0 ){
      return hour-12 + ":" + min + " pm";
    }else{
      return hour + ":" + min + " am";
    }
}


function updateLocalSave(){
  fs.writeFile("StudentList.csv", students, 'utf8', function (err) {
      if (err) {
          return console.log(err);
      }
      console.log("Student list updated");
  });
}

function checkDate(){

  if (!fs.existsSync("logs/" + getDate() +".csv")) {
    console.log("path doesn't exist")
    var header = "student, location, timeout, timein \r\n"
    fs.writeFile("logs/" + getDate() +".csv", header, 'utf8', function (err) {
       if (err) {
           return console.log(err);
       }
       console.log("Student list updated");
    });
  }
  //TODO fill this with stuff
  return "logs/" + getDate() +".csv"
}


function makeIds(){  //this should be in the csv file but I am making it procedurally cause its easier for now
  for(var i in students){
    if(students.hasOwnProperty(i)){
      var id = students[i].last.toLowerCase() + students[i].first[0].toLowerCase();
      studentsId[id] = students[i];
      studentsId[id].id = id;
    }
  }
  console.log(studentsId);
}



app.use(express.static('public'));

var server = app.listen(8081, function() {
  var port = server.address().port;
  require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('Example app listening at http://%s:%s', add, port);
  })
});
