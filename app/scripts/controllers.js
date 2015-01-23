'use strict';
angular.module('Moodtracker.controllers', [])

.controller('DashCtrl', function($scope,  $firebase) {

// $scope.projectsList = $firebase(new Firebase("https://mood-track.firebaseio.com/projects"));
  
  $scope.name = {text: null};
  $scope.scale = 0;
  $scope.comment ={text:null};

  $scope.moods = $firebase(new Firebase("https://mood-track.firebaseio.com/Moods"));

  $scope.saveMood = function() {

    console.log($scope.name.text);
        // if ($scope.name === '') {
        //     return;
        // }
    $scope.moods.$push({name: $scope.name, scale: $scope.scale, comment: $scope.comment.text});

  }

})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {

});
