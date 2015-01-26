'use strict';
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('Moodtracker', ['ionic', 'config', 'firebase', 'd3', 'ui.router', 'uiGmapgoogle-maps', 'timer', 'Moodtracker.controllers', 'Moodtracker.services', 'Moodtracker.directives'])

.run(function($ionicPlatform, $rootScope) {
        // rootscope variables
        $rootScope.submitted = false;
        $rootScope.timerRunning = false;
        $rootScope.minute = {
            num: 0
        };
        $rootScope.hour = {
            num: 0
        };
        $rootScope.second = {
            num: 0
        };
        $rootScope.countdown = {
            num: 0
        }




        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

        });
    })
    .config(function(uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            //    key: 'your api key',
            key: 'AIzaSyAio9PTakspJUDRJkVFzLe_Dx33q9qsdS4',
            v: '3.17',
            libraries: 'weather,geometry,visualization'
        })
    })

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
        .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
    })

    // Each tab has its own nav history stack:

    .state('tab.dash', {
        url: '/dash',
        views: {
            'tab-dash': {
                templateUrl: 'templates/tab-dash.html',
                controller: 'DashCtrl'
            }
        }
    })

    .state('tab.moodentry', {
        url: '/entry',
        views: {
            'tab-entry': {
                templateUrl: 'templates/tab-moodentry.html',
                controller: 'MoodEntryCtrl'
            }
        }
    })

    .state('tab.data', {
        url: '/data',
        views: {
            'tab-data': {
                templateUrl: 'templates/tab-data.html',
                controller: 'DataCtrl'
            }
        }
    })

    .state('tab.account', {
        url: '/account',
        views: {
            'tab-account': {
                templateUrl: 'templates/tab-account.html',
                controller: 'AccountCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/dash');

});