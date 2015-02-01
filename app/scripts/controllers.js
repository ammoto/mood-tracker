'use strict';
angular.module('Moodtracker.controllers', [])
    // DASH
    .controller('DashCtrl', function($scope, $rootScope, $firebase, $timeout, $state) {

        // $scope.minute = {
        //     num: 0
        // };
        // $scope.hour = {
        //     num: 0
        // };
        //  $scope.second = {
        //     num: 0
        // };
        // $scope.countdown = {
        //     num:0
        // }
        // $scope.$broadcast('timer-clear');



        if ($rootScope.timerRunning === true) {
            $timeout(function() {
                // console.log('countdown is ', $scope.countdown.num, 'counter started!')
                $scope.$broadcast('timer-start');
            }, 2)
        } else {
            $timeout(function() {
                // console.log('at stoptimer() countdown.num is ', $rootScope.countdown.num)
                $scope.$broadcast('timer-stop');
                $rootScope.timerRunning = false;
                $scope.$apply();
            }, 2);
        }

        console.log('AT PAGE LOAD rootscope.timerrunning is ', $rootScope.timerRunning);
        console.log('AT PAGE LOAD countdown.num is ', $rootScope.countdown.num);

        $scope.startTimer = function() {
            $rootScope.countdown.num = ($rootScope.minute.num * 60) + ($rootScope.hour.num * 3600) + $rootScope.second.num;

            $timeout(function() {
                console.log('AT START TRACKING, countdown.num is ', $rootScope.countdown.num)
                $scope.$broadcast('timer-start');
                $rootScope.timerRunning = true;
            }, 0);

        };


        $scope.stopTimer = function() {
            $rootScope.countdown.num = 0;
            $timeout(function() {
                console.log('AT STOP TRACKING countdown.num is ', $rootScope.countdown.num)
                $scope.$broadcast('timer-stop');
                $rootScope.timerRunning = false;
                $scope.$apply();
            }, 2);


        };

        $scope.$on('timer-stopped', function(event, data) {
            console.log('Timer Stopped ');
        });

        $scope.callbackTimer = function() {
            // var element = document.querySelector('#speaker');
            // element.speak();
            console.log('Timer finished!')
            $timeout(function() {
                $rootScope.countdown.num = ($rootScope.minute.num * 60) + ($rootScope.hour.num * 3600) + $rootScope.second.num;
                $scope.$apply();
                console.log('AT TIMER CALLBACK countdown.num is ', $rootScope.countdown.num);
                $state.go('tab.moodentry');
            }, 0);


        }

        // TODO: FINISH LOGIN
        $scope.login = function(form) {
            $rootScope.submitted = true;

            var ref = new Firebase("https://mood-track.firebaseio.com");
            ref.authWithOAuthPopup("twitter", function(error, authData) {
                if (error) {
                    console.log("Login Failed!", error);
                } else {
                    console.log("Authenticated successfully with payload:", authData);
                    $rootScope.authData = authData;
                }
            });

            // if (form.$valid) {
            //     Auth.login({
            //             email: $scope.user.email,
            //             password: $scope.user.password
            //         })
            //         .then(function() {
            //             $location.path('/');
            //         })
            //         .catch(function(err) {
            //             $scope.errors.other = err.message;
            //         });
            // }
        };
        // $scope.loginOauth = function(provider) {
        //     $window.location.href = '/auth/' + provider;
        // };



    })
    // MOOD ENTRY
    .controller('MoodEntryCtrl', function($scope, $firebase, $state, $ionicLoading, LocationService, speak, $rootScope) {

        var sync = $firebase(new Firebase("https://mood-track.firebaseio.com/Moods"));
        $scope.data = sync.$asArray();

        speak('How are you feeling right now?');
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



        $scope.saveMood = function() {

            if ($scope.name.text === '') {
                return;
            }

            if ($rootScope.auto.checked === true) {
                console.log('autotweet on...')
            }

            var today = new Date().toUTCString();

            var array = today.split(' ');
            var date = array[1] + ' ' + array[2] + ' ' + array[3];
            var time = array[4];

            $scope.date.today = today;

            LocationService.getLatLong().then(
                function(latLong) {
                    $scope.location.latLong = latLong;

                    //Save to firebase
                    sync.$push({
                        name: $scope.name.text,
                        scale: $scope.scale.num,
                        comment: $scope.comment.text,
                        date: date,
                        time: time,
                        latLong: $scope.location.latLong
                    });
                    $state.go('tab.dash');
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
    $scope.data = [];
    
     $scope.ldata = [
  {x: 0, value: 4, otherValue: 14},
  {x: 1, value: 8, otherValue: 1},
  {x: 2, value: 15, otherValue: 11},
  {x: 3, value: 16, otherValue: 147},
  {x: 4, value: 23, otherValue: 87},
  {x: 5, value: 42, otherValue: 45}
];

$scope.options = {
  axes: {
    x: {key: 'x', labelFunction: function(value) {return value;}, type: 'linear', min: 0, max: 10, ticks: 2},
    y: {type: 'linear', min: 0, max: 1, ticks: 5},
    y2: {type: 'linear', min: 0, max: 1, ticks: [1, 2, 3, 4]}
  },
  series: [
    {y: 'value', color: 'steelblue', thickness: '2px', type: 'area', striped: true, label: 'Pouet'},
    {y: 'otherValue', axis: 'y2', color: 'lightsteelblue', visible: false, drawDots: true, dotSize: 2}
  ],
  lineMode: 'linear',
  tension: 0.7,
  tooltip: {mode: 'scrubber', formatter: function(x, y, series) {return 'pouet';}},
  drawLegend: true,
  drawDots: true,
  columnsHGap: 5
}

      

     //   $scope.nvdata = [ {
     //                "key": "Series 1",
     //                "values": $scope.rawdata}]
     // });

    // $scope.nvdata = [
    //             {
    //                 "key": "Series 1",
    //                 "values": $scope.rawdata}

    //             // {
    //             //     "key": "Series 2",
    //             //     "area": true,
    //             //     "values": [ [ 1025409600000 , 4] , [ 1028088000000 , 8] , [ 1030766400000 , 10] , [ 1033358400000 , 14] , [ 1036040400000 , 3] , [ 1038632400000 , 9] , [ 1041310800000 , -5.5310285460542] , [ 1043989200000 , -5.7838296963382] , [ 1046408400000 , -7.3249341615649] , [ 1049086800000 , -6.7078630712489] , [ 1051675200000 , 0.44227126150934] , [ 1054353600000 , 7.2481659343222] , [ 1056945600000 , 9.2512381306992] , [ 1059624000000 , 11.341210982529] , [ 1062302400000 , 14.734820409020] , [ 1064894400000 , 12.387148007542] , [ 1067576400000 , 18.436471461827] , [ 1070168400000 , 19.830742266977] , [ 1072846800000 , 22.643205829887] , [ 1075525200000 , 26.743156781239] , [ 1078030800000 , 29.597478802228] , [ 1080709200000 , 30.831697585341] , [ 1083297600000 , 28.054068024708] , [ 1085976000000 , 29.294079423832] , [ 1088568000000 , 30.269264061274] , [ 1091246400000 , 24.934526898906] , [ 1093924800000 , 24.265982759406] , [ 1096516800000 , 27.217794897473] , [ 1099195200000 , 30.802601992077] , [ 1101790800000 , 36.331003758254] , [ 1104469200000 , 43.142498700060] , [ 1107147600000 , 40.558263931958] , [ 1109566800000 , 42.543622385800] , [ 1112245200000 , 41.683584710331] , [ 1114833600000 , 36.375367302328] , [ 1117512000000 , 40.719688980730] , [ 1120104000000 , 43.897963036919] , [ 1122782400000 , 49.797033975368] , [ 1125460800000 , 47.085993935989] , [ 1128052800000 , 46.601972859745] , [ 1130734800000 , 41.567784572762] , [ 1133326800000 , 47.296923737245] , [ 1136005200000 , 47.642969612080] , [ 1138683600000 , 50.781515820954] , [ 1141102800000 , 52.600229204305] , [ 1143781200000 , 55.599684490628] , [ 1146369600000 , 57.920388436633] , [ 1149048000000 , 53.503593218971] , [ 1151640000000 , 53.522973979964] , [ 1154318400000 , 49.846822298548] , [ 1156996800000 , 54.721341614650] , [ 1159588800000 , 58.186236223191] , [ 1162270800000 , 63.908065540997] , [ 1164862800000 , 69.767285129367] , [ 1167541200000 , 72.534013373592] , [ 1170219600000 , 77.991819436573] , [ 1172638800000 , 78.143584404990] , [ 1175313600000 , 83.702398665233] , [ 1177905600000 , 91.140859312418] , [ 1180584000000 , 98.590960607028] , [ 1183176000000 , 96.245634754228] , [ 1185854400000 , 92.326364432615] , [ 1188532800000 , 97.068765332230] , [ 1191124800000 , 105.81025556260] , [ 1193803200000 , 114.38348777791] , [ 1196398800000 , 103.59604949810] , [ 1199077200000 , 101.72488429307] , [ 1201755600000 , 89.840147735028] , [ 1204261200000 , 86.963597532664] , [ 1206936000000 , 84.075505208491] , [ 1209528000000 , 93.170105645831] , [ 1212206400000 , 103.62838083121] , [ 1214798400000 , 87.458241365091] , [ 1217476800000 , 85.808374141319] , [ 1220155200000 , 93.158054469193] , [ 1222747200000 , 65.973252382360] , [ 1225425600000 , 44.580686638224] , [ 1228021200000 , 36.418977140128] , [ 1230699600000 , 38.727678144761] , [ 1233378000000 , 36.692674173387] , [ 1235797200000 , 30.033022809480] , [ 1238472000000 , 36.707532162718] , [ 1241064000000 , 52.191457688389] , [ 1243742400000 , 56.357883979735] , [ 1246334400000 , 57.629002180305] , [ 1249012800000 , 66.650985790166] , [ 1251691200000 , 70.839243432186] , [ 1254283200000 , 78.731998491499] , [ 1256961600000 , 72.375528540349] , [ 1259557200000 , 81.738387881630] , [ 1262235600000 , 87.539792394232] , [ 1264914000000 , 84.320762662273] , [ 1267333200000 , 90.621278391889] , [ 1270008000000 , 102.47144881651] , [ 1272600000000 , 102.79320353429] , [ 1275278400000 , 90.529736050479] , [ 1277870400000 , 76.580859994531] , [ 1280548800000 , 86.548979376972] , [ 1283227200000 , 81.879653334089] , [ 1285819200000 , 101.72550015956] , [ 1288497600000 , 107.97964852260] , [ 1291093200000 , 106.16240630785] , [ 1293771600000 , 114.84268599533] , [ 1296450000000 , 121.60793322282] , [ 1298869200000 , 133.41437346605] , [ 1301544000000 , 125.46646042904] , [ 1304136000000 , 129.76784954301] , [ 1306814400000 , 128.15798861044] , [ 1309406400000 , 87.92388706072] , [ 1312084800000 , 35.70036100870] , [ 1314763200000 , 78.367701837033] , [ 1317355200000 , 29.159665765725] , [ 1320033600000 , 39.793568139753] , [ 1322629200000 , 75.903834028417] , [ 1325307600000 , 72.704218209157] , [ 1327986000000 , 84.936990804097] , [ 1330491600000 , 93.388148670744]]
    //             // }
    //             ];;



    //RETRIEVE MOOD DATA FOR TODAY
    $scope.getTodayData = function() {
        var today = new Date().toUTCString();
        // today = today.substring(0, today.indexOf('T'));
        $scope.data = $scope.rawdata.map(function(e) {
            var date = new Date().toUTCString();
            var array = date.split(' ');
            var today = array[1] + ' ' + array[2] + ' ' + array[3];


            if (e["date"] === today) {
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
                    name: e["time"],
                    date: e["date"],
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
        console.log('getting overall data...')
        $scope.data = $scope.rawdata.map(function(e) {

            return {
                name: e["time"],
                date: e["date"],
                scale: e["scale"],
                mood: e["name"],
                comment: e["comment"],
                latLong: e["latLong"]
            };
        })

        $scope.nvdata = $scope.rawdata.map(function(e) {

            return {
                "key": "Series 1",
                "values": [1,2]
            };

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
            $scope.detailDate = item.date;
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
                    zoom: 17
                };
            });
            $scope.modal.show();

        });
    };



})


//ACCOUNT CONTROLLER
.controller('AccountCtrl', function($scope, $rootScope, $timeout) {

    $scope.auto = {
        checked: false
    }

    $scope.toggleAuto = function() {
        $timeout(function() {
            $scope.auto.checked = true;
            $rootScope.auto.checked = $scope.auto.checked;
            console.log('auto is ', $scope.auto.checked, 'rootauto is ', $rootScope.auto.checked)
        }, 3);

    }



});