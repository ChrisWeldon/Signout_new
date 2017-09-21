$(document).ready(function(){
  console.log("doc ready");
  signOut("id", "loc");
  displayAll();
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
  $("#" + user.id).empty()
  $("#" + user.id).append('<td>'+user.first+'</td><td>'+user.last+'</td><td>'+ dropdown(user.status, user.id) + '</td>');
}

function search(ch){
  displaySort(ch);
}

function dropdown(bool, id){
  if(bool || bool == "TRUE"){
    return '<div class="dropdown"><button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Sign Out<span class="caret"></span></button><ul class="dropdown-menu"><li><a onclick="signOut(\''+id+'\','+ '\'mikes\''+ ')" >Mikes</a></li><li><a onclick="signOut(\''+id+'\','+ '\'manaus\''+ ')">Manaus</a></li><li><div><a ><div class="form-group"><input type="location" class="form-control" id="location"></div></a></div></li></ul></div>';
  }else{
    return '<button onclick="signIn(\''+id+'\')">Sign In</button>'
  }
}

function signOut(id, loc){
  console.log("signed out: "+ id + " to " + loc+" called")
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
