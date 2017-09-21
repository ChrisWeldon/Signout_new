var express = require('express');
var app = express();
var csvjson = require('csvjson');
var fs = require('fs');
var path = require("path");
var bodyParser = require('body-parser');

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
      if(students[key].first.toLowerCase().indexOf(sort) > -1 && students[key].first.toLowerCase().indexOf(sort) == 0 ){
        console.log(students[key].first);
        sendObj[students[key].id] = students[key];
      }
    }
  }
  res.send(sendObj);
});
app.get("/studentList", function(req, res){

  res.send(studentsId);
});

app.get("/sign/:studentId/:state/:loc", function(req, res){
  var student = req.params.studentId;
  var status = req.params.state;
  var loc = req.params.loc;
  if(status == "out"){
    studentsId[student].status = false;
    studentsId[student].location = loc;
  }else if(status == "in"){
    studentsId[student].status = true;
    studentsId[student].location = "Dorm";
  }
  //updateLocalSave();
  res.send(studentsId[req.params.studentId]);
});


function updateLocalSave(){
  fs.writeFile("StudentList.csv", students, 'utf8', function (err) {
      if (err) {
          return console.log(err);
      }
      console.log("Student list updated");
  });
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
