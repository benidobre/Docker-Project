var app = angular.module('catsvsdogs', []);
var socket = io.connect({transports:['polling']});

var bg1 = document.getElementById('background-stats-1');
var bg2 = document.getElementById('background-stats-2');
var cookie = document.cookie;

app.controller('statsCtrl', function($scope){
  $scope.aPercent = "bla";
  $scope.bPercent = "bla";
  $scope.cPercent = "";
  $scope.dPercent = "";

  var updateScores = function(){
    socket.on('scores', function (json) {
       data = JSON.parse(json);
       var votes = data.answers
       var sorted = []
       for(i=3; i >= 0; i--) {
           votes.forEach(function (vote) {
                if(vote["score"] == i) {
                    sorted.push(vote);
                }
           })
       }

       var parts = cookie.split('=');
       var you = "no cookie";
       if(parts.length > 1) {
         var i = 1
         sorted.forEach(function (vote) {
                if(vote["user"] == parts[1]) {
                    you = i+". YOU: " + vote["score"];
                }
                i++;
           })
       }
       bg1.style.width = 50 + "%";
       bg2.style.width = 50 + "%";
       
      
       var leaderboard = "no entries";
       var snd = "";
       var trd = "";
       if(sorted.length > 0) {
         var first = sorted[0]
         leaderboard = "1. " + first["user"] + ": " + first["score"];
       }
       if (sorted.length > 1) {
         var second = sorted[1]
         snd += "2. " + second["user"] + ": " + second["score"];
       }
       if (sorted.length > 2) {
         var third = sorted[2]
         trd += "3. " + third["user"] + ": " + third["score"];
       }

       $scope.$apply(function () {
         $scope.aPercent = leaderboard;
         $scope.bPercent = you;
         $scope.cPercent = snd;
         $scope.dPercent = trd;
         $scope.total = sorted.length;
       });
    });
  };

  var init = function(){
    document.body.style.opacity=1;
    updateScores();
  };
  socket.on('message',function(data){
    init();
  });
});

function getPercentages(a, b) {
  var result = {};

  if (a + b > 0) {
    result.a = Math.round(a / (a + b) * 100);
    result.b = 100 - result.a;
  } else {
    result.a = result.b = 50;
  }

  return result;
}
