'use strict';
angular.module('Moodtracker.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [
    { id: 0, name: 'Scruff McGruff' },
    { id: 1, name: 'G.I. Joe' },
    { id: 2, name: 'Miss Frizzle' },
    { id: 3, name: 'Ash Ketchum' }
  ];

  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  };
})

// .factory("ItemModel", function($rootScope,$firebase) {

// var refMoods = new Firebase("https://mood-track.firebaseio.com/Moods");
// var scope = $rootScope.$new();
// scope.moods = [];
// $firebase(refMoods,scope,'moods');
// return scope;

//   // var scope = $rootScope.$new(),
//   //     url = 'https://mood-track.firebaseio.com/Moods';
//   // scope.items = [];
//   // var promise = $firebase(new Firebase(url).child('Moods'), scope, 'items');
//   // return scope;
// })
