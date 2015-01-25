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
