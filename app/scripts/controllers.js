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
    .controller('MoodEntryCtrl', function($scope, $firebase, $ionicLoading, LocationService) {
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
        $scope.location = {
            latLong: null
        }

        $scope.date.today = new Date().toISOString();

        $scope.saveMood = function() {

            if ($scope.name.text === '') {
                return;
            }

            LocationService.getLatLong().then(
                function(latLong) {
                    $scope.location.latLong = latLong;
                    console.log('LatLong=');
                    console.log($scope.location.latLong);
                    //Save to firebase
                    sync.$push({
                        name: $scope.name.text,
                        scale: $scope.scale.num,
                        comment: $scope.comment.text,
                        date: $scope.date.today,
                        latLong: $scope.location.latLong
                    });
                },
                function(error) {
                    alert(error);
                })


        }
    })


// DATA CHARTS



.controller('DataCtrl', function($scope, $firebase, $ionicModal, uiGmapGoogleMapApi, $ionicLoading, $compile) {

    var sync = $firebase(new Firebase("https://mood-track.firebaseio.com/Moods"));
    $scope.rawdata = sync.$asArray();
    $scope.data2 = [];

    //RETRIEVE MOOD DATA FOR TODAY
    $scope.getTodayData = function() {
        var today = new Date().toISOString();
        today = today.substring(0, today.indexOf('T'));
        $scope.data = $scope.rawdata.map(function(e) {
            var edate = e["date"].substring(0, e["date"].indexOf('T'));
            var time = e["date"].split("T").pop().substring(0, 8);
            if (edate === today) {
                if (e["name"] === "Happy") {
                    var color = '#F4FA58';
                } else if (e["name"] === "Sad") {
                    var color = '#81DAF5';
                } else if (e["name"] === "Stressed") {
                    var color = '#FA5858';
                } else if (e["name"] === "Neutral") {
                    var color = '#81F781';
                }

                return {
                    name: time,
                    date: today,
                    score: parseInt(e["scale"]),
                    mood: e["name"],
                    color: color,
                    comment: e["comment"],
                    latLong: e["latLong"]
                };
            }
        })
    }

    //RETRIEVE OVERALL MOOD DATA 
    $scope.getOverallData = function() {
        var today = new Date().toISOString();
        today = today.substring(0, today.indexOf('T'));
        $scope.data2 = $scope.rawdata.map(function(e) {
            var edate = e["date"].substring(0, e["date"].indexOf('T'));
            var time = e["date"].split("T").pop().substring(0, 8);
            if (edate === today) {
                if (e["name"] === "Happy") {
                    var color = '#F4FA58';
                } else if (e["name"] === "Sad") {
                    var color = '#81DAF5';
                } else if (e["name"] === "Stressed") {
                    var color = '#FA5858';
                } else if (e["name"] === "Neutral") {
                    var color = '#81F781';
                }

                return {
                    date: edate,
                    time: time,
                    score: parseInt(e["scale"]),
                    mood: e["name"],
                    color: color,
                    comment: e["comment"]
                };
            }
        })
    }

    //MODAL SETUP
    $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        console.log('modal loaded')
        $scope.modal = modal;
    });
    $scope.openModal = function() {
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });





    //ONCLICK FUNCTION
    $scope.onClick = function(item) {

        $scope.$apply(function() {
            if (!$scope.showDetailPanel)
                $scope.showDetailPanel = true;
            $scope.detailMood = item.mood;
            $scope.detailDate = item.date ;
            $scope.detailTime = item.name;
            $scope.detailComment = item.comment;
            $scope.lat = item.latLong["lat"];
            $scope.lon = item.latLong["long"];
            //INITIALIZE GOOGLE MAPS 
            uiGmapGoogleMapApi.then(function(maps) {
                $scope.marker = {
                    id: 0,
                    coords: {
                        latitude: $scope.lat,
                        longitude: $scope.lon
                    }
                };

                $scope.map = {
                    center: {
                        latitude: $scope.lat,
                        longitude: $scope.lon
                    },
                    zoom: 13
                };
            });
            $scope.modal.show();

        });
    };



})






.controller('AccountCtrl', function($scope) {

});