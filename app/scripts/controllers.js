'use strict';
angular.module('Moodtracker.controllers', [])

.controller('DashCtrl', function($scope,  $firebase) {

  $scope.first = {text: null};
  $scope.last = {text:null};
  $scope.email ={text:null};

  // $scope.moods = $firebase(new Firebase("https://mood-track.firebaseio.com/Moods"));

  $scope.signUp = function() {

        if ($scope.name.text === '') {
            return;
        }
         if ($scope.last.text === '') {
            return;
        }
        if ($scope.email.text === '') {
            return;
        }

    $scope.moods.$push({name: $scope.name.text, scale: $scope.scale.num, comment: $scope.comment.text});

  }

})

.controller('MoodEntryCtrl', function($scope, $firebase) {

$scope.date = new Date();


  $scope.name = {text: null};
  $scope.scale = {num:0};
  $scope.comment ={text:null};


  $scope.moods = $firebase(new Firebase("https://mood-track.firebaseio.com/Moods"));

  $scope.saveMood = function() {

        if ($scope.name.text === '') {
            return;
        }
    $scope.moods.$push({name: $scope.name.text, scale: $scope.scale.num, comment: $scope.comment.text, date:$scope.date});

  }
})

.controller('DataCtrl', function($scope, $firebase) {


  // $scope.name = {text: null};
  // $scope.scale = {num:0};
  // $scope.comment ={text:null};
  // $scope.currentDate =  new time.Date();

  // $scope.moods = $firebase(new Firebase("https://mood-track.firebaseio.com/Moods"));

  // $scope.saveMood = function() {

  //       if ($scope.name.text === '') {
  //           return;
  //       }
  //   $scope.moods.$push({name: $scope.name.text, scale: $scope.scale.num, comment: $scope.comment.text});

  // }
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {

});
