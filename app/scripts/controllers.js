'use strict';
angular.module('Moodtracker.controllers', [])
    // DASH
    .controller('DashCtrl', function($scope, $firebase) {

        $scope.first = {
            text: null
        };
        $scope.last = {
            text: null
        };
        $scope.email = {
            text: null
        };

        // $scope.moods = $firebase(new Firebase("https://mood-track.firebaseio.com/Moods"));

        $scope.signUp = function() {

            if ($scope.first.text === '') {
                return;
            }
            if ($scope.last.text === '') {
                return;
            }
            if ($scope.email.text === '') {
                return;
            }

            $scope.moods.$push({
                name: $scope.name.text,
                scale: $scope.scale.num,
                comment: $scope.comment.text
            });

        }

    })
    // MOOD ENTRY
    .controller('MoodEntryCtrl', function($scope, $firebase) {

        $scope.name = {};
        $scope.scale = {};
        $scope.comment = {};
        $scope.date = {};
        $scope.date.today = new Date().toString();

        $scope.saveMood = function() {


            if ($scope.name.text === '') {
                return;
            }
            $scope.moods.$push({
                name: $scope.name.text,
                scale: $scope.scale.num,
                comment: $scope.comment.text,
                date: $scope.date.today
            });
        }
    })


// DATA CHARTS
.controller('DataCtrl', function($scope, $firebase) {

    var sync = $firebase(new Firebase("https://mood-track.firebaseio.com/Moods"));

    $scope.data = sync.$asObject()

    $scope.greeting = "Resize the page to see the re-rendering";

    $scope.data = [{
        name: "Greg",
        score: 98
    }, {
        name: "Ari",
        score: 96
    }, {
        name: 'Q',
        score: 75
    }, {
        name: "Loser",
        score: 48
    }];

    $scope.onClick = function(item) {
        alert('clicked!');
        $scope.$apply(function() {
            if (!$scope.showDetailPanel)
                $scope.showDetailPanel = true;
            $scope.detailItem = item;
        });
    };

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