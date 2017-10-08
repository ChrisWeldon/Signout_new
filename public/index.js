$(document).ready(function(){
  console.log("doc ready");
  signOut("id", "loc");
  displayAll();
  displayPermToday();
});

function displayAll(){
  $.getJSON("/studentList", {}, function(dat, stat){
    $("#directory_body").empty();
    console.log(dat);
    for(var key in dat){
      if(dat.hasOwnProperty(key)){
        $("#directory_body").append('<tr id="'+dat[key].id+'"><td>'+dat[key].first+'</td><td>'+dat[key].last+'</td><td>'+ dropdown(dat[key].status, dat[key].id) + '</td></tr>');
      }
    }
  });
}

function displayPermToday(){
  $.getJSON("/get-today-log", {}, function(dat, stat){
    $("#todaylog_body").empty();
    for(var key in dat){
      if(dat.hasOwnProperty(key)){
        $("#todaylog_body").append('<tr id="'+dat[key].student+'"><td>'+dat[key].student+'</td><td>'+ dat[key].location + '</td><td>'+ dat[key].timeout + '</td><td>'+ dat[key].timein + '</td></tr>');
      }
    }
  });
}

function displaySort(a){
  $.getJSON("/studentList/" + a, {}, function(dat, stat){
    $("#directory_body").empty();
    console.log(dat);
    for(var key in dat){
      if(dat.hasOwnProperty(key)){
        $("#directory_body").append('<tr id="'+dat[key].id+'"><td>'+dat[key].first+'</td><td>'+dat[key].last+'</td><td>'+ dropdown(dat[key].status, dat[key].id) + '</td></tr>');
      }
    }
  });
}

function refresh(user){
  //TODO make refresh just the single person
  $("#" + user.id).empty();
  $("#log_body").empty();
  $("#" + user.id).append('<td>'+user.first+'</td><td>'+user.last+'</td><td>'+ dropdown(user.status, user.id) + '</td>');
  $.getJSON("/signedOut", function(dat, stat){
    console.log(dat);
    for(var i in dat){
      $("#log_body").append('<tr><td>'+dat[i].first+'</td><td>'+dat[i].last+'</td><td>'+dat[i].location+'</td><td>'+dat[i].timeout +'</td><td><button onclick="signIn(\''+dat[i].id+'\')">Sign In</button></td></tr>');
    }
  });
}

function search(ch){
  displaySort(ch);
}

$(document).keypress(function(e) {
   if(e.which == 13) {
     var focusId = $(':focus').attr("id").substring(15,$(':focus').attr("id").length);
     signOut(focusId, $(':focus').val());

   }
});


function dropdown(bool, id){
  if(bool || bool == "TRUE"){
    return '<div class="dropdown"><button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Sign Out<span class="caret"></span></button><ul class="dropdown-menu"><li><a onclick="signOut(\''+id+'\','+ '\'mikes\''+ ')" >Mikes</a></li><li><a onclick="signOut(\''+id+'\','+ '\'manaus\''+ ')">Manaus</a></li><li><a onclick="signOut(\''+id+'\','+ '\'Albears\''+ ')" >Albears</a></li><li><div><a ><div class="form-group"><input type="text" class="form-control" id="location_input_'+id+'"></div></a></div></li></ul></div>';
  }else{
    return '<button onclick="signIn(\''+id+'\')">Sign In</button>'
  }
}

function signOut(id, loc){
  $.getJSON("/sign/"+id+"/out/"+loc, {}, function(dat, stat){
    refresh(dat);
  });
  return false;
}

function signIn(id){
  $.getJSON("/sign/"+id+"/in/Dorm", {}, function(dat, stat){
    refresh(dat);
  });
  return false;
}
