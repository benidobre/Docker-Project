var app = angular.module('catsvsdogs', []);
var socket = io.connect({transports:['polling']});

var bg1 = document.getElementById('background-stats-1');
var bg2 = document.getElementById('background-stats-2');

app.controller('statsCtrl', function($scope){
  $scope.aPercent = "bla";
  $scope.bPercent = 50;

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
           }
       }

       bg1.style.width = 50 + "%";
       bg2.style.width = 50 + "%";
       var first = sorted[0]

       $scope.$apply(function () {
         $scope.aPercent = first["user"];
         $scope.total = first["score"];
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
