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
        var sync = $firebase(new Firebase("https://mood-track.firebaseio.com/Moods"));

        $scope.name = {
            text: null
        };
        $scope.scale = {
            num: 5
        };
        $scope.comment = {
            text: null
        };
        $scope.date = {
            today: null
        };
        $scope.date.today = new Date().toISOString();

        $scope.saveMood = function() {

            if ($scope.name.text === '') {
                return;
            }

            sync.$push({
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

    $scope.rawdata = sync.$asArray();
    $scope.data2 = [];

    $scope.getTodayData = function() {
        var today = new Date().toISOString();
        today = today.substring(0, today.indexOf('T'));
        $scope.data = $scope.rawdata.map(function(e) {
            var edate = e["date"].substring(0, e["date"].indexOf('T'));
            var time = e["date"].split("T").pop().substring(0, 8);
            if (edate === today) {
              if (e["name"] === "Happy") {
                var color = '#F4FA58';
              }
              else if (e["name"] === "Sad") {
                var color = '#81DAF5';
              }
              else if (e["name"] === "Stressed") {
                var color = '#FA5858';
              }
              else if (e["name"] === "Neutral") {
                var color = '#81F781';
              }
    
                return {
                    name: time,
                    score: parseInt(e["scale"]),
                    mood: e["name"],
                    color: color
                };
            }
        })
    }

    $scope.onClick = function(item) {

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