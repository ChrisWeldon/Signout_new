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

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get("/studentList", function(req, res){
  res.send(students);
});

app.post("/sign", function(req, res){
  var student = req.body.student;
  var status = req.body.status;
  if(status == "out"){
    var loc = req.body.loc;
    students[student].status = false;
    students[student].loc = loc;
  }else if(status == "in"){
    students[student].status = true;
    students[student].loc = "Dorm";
  }

  fs.writeFile("StudentList.csv", students, 'utf8', function (err) {
      if (err) {
          return console.log(err);
      }
      console.log("Student list updated");
  });

});


console.log(students);

app.use(express.static('public'));

var server = app.listen(8081, function() {
  var port = server.address().port;
  require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('Example app listening at http://%s:%s', add, port);
  })
});
