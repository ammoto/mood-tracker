'use strict';
angular.module('Moodtracker.services', [])

.factory('LocationService', function($q) {
    
    var latLong = null;
    
    var getLatLong = function(refresh) {
        
        var deferred = $q.defer();
        
        if( latLong === null || refresh ) {
        
            console.log('Getting lat long');
            navigator.geolocation.getCurrentPosition(function(pos) {
                console.log('Position=')
                console.log(pos);
                latLong =  { 'lat' : pos.coords.latitude, 'long' : pos.coords.longitude } 
                deferred.resolve(latLong);

            }, function(error) {
                console.log('Got error!');
                console.log(error);
                latLong = null
                
                deferred.reject('Failed to Get Lat Long')

            });
            
        }  else {
            deferred.resolve(latLong);
        }
        
        return deferred.promise;

    };      
    
    return {
        
        getLatLong : getLatLong
        
    }
})

 .service('speak', function () {


    // AngularJS will instantiate a singleton by calling "new" on this function
        return function (message,callback) {
            var msg = new SpeechSynthesisUtterance();
          var voices = window.speechSynthesis.getVoices();
          msg.voice = voices[10]; // Note: some voices don't support altering params
          msg.voiceURI = 'native';
          msg.volume = 1; // 0 to 1
          msg.rate = .75; // 0.1 to 10
          msg.pitch = 1.5; //0 to 2
          msg.text = message;
          msg.lang = 'en-US';

          msg.onend = function(e) {
              // console.log('Finished in ' + event.elapsedTime + ' seconds.');
              // callback();
          };

          speechSynthesis.speak(msg);
        };
  })


.factory('clicker', function() {
    return {
        click: function (el) {
            var ev = document.createEvent("MouseEvent");
            ev.initMouseEvent(
                "click",
                true /* bubble */, true /* cancelable */,
                window, null,
                0, 0, 0, 0, /* coordinates */
                false, false, false, false, /* modifier keys */
                0 /*left*/, null
            );
            el.dispatchEvent(ev);
        }
    };
});
