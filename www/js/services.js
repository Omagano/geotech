angular.module('starter.services', [])

.factory("Firebase", function () {
	var config = {
		apiKey: "AIzaSyA4jo1GWYzeoQeZ10uOcHfBWau3BIK0B84",
		authDomain: "routing-21d3f.firebaseapp.com",
		databaseURL: "https://routing-21d3f.firebaseio.com",
		projectId: "routing-21d3f",
		storageBucket: "routing-21d3f.appspot.com",
		messagingSenderId: "920681747547",
		appId: "1:920681747547:web:d3bc214504f65354265b7e",
		measurementId: "G-S34SYGJ944"
	};
	return firebase.initializeApp(config);
})

.service('FirebaseServices', function (Firebase, $firebaseArray, $q) {

    var service  = this,
		database = Firebase.database().ref("points"),
		objects	 = $firebaseArray(database);

	service.getByGeo = function (lat, lng, radius) {
		if(typeof geoQuery !== 'undefined'){
			geoQuery.updateCriteria({
				center: [lat, lng],
				radius: Number(radius)
			});
		}else{
			var geoFire = new GeoFire(database);
			geoQuery = geoFire.query({
				center: [lat, lng],
				radius: Number(radius)
			});
		}
		return geoQuery;
	};

    service.create = function (object) {
		var defer = $q.defer();
		objects.$loaded().then(function() {
			object.g = service.encodeGeohash(object.l);
			defer.resolve(objects.$add(object));
		});
		return defer.promise;
    };

	service.get = function (id) {
		var defer = $q.defer();
		objects.$loaded().then(function() {
			defer.resolve(objects.$getRecord(id));
		});
		return defer.promise;
	};

    service.encodeGeohash = function(location, precision) {

		// Default geohash length
		var g_GEOHASH_PRECISION = 10;

		// Characters used in location geohashes
		var g_BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";

		if (typeof precision !== "undefined") {
			if (typeof precision !== "number" || isNaN(precision)) {
				throw new Error("precision must be a number");
			}
			else if (precision <= 0) {
				throw new Error("precision must be greater than 0");
			}
			else if (precision > 22) {
				throw new Error("precision cannot be greater than 22");
			}
			else if (Math.round(precision) !== precision) {
				throw new Error("precision must be an integer");
			}
		}
		// Use the global precision default if no precision is specified
		precision = precision || g_GEOHASH_PRECISION;

		var latitudeRange = {
			min: -90,
			max: 90
		};
		var longitudeRange = {
			min: -180,
			max: 180
		};
		var hash = "";
		var hashVal = 0;
		var bits = 0;
		var even = 1;

		while (hash.length < precision) {
			var val = even ? location[1] : location[0];
			var range = even ? longitudeRange : latitudeRange;
			var mid = (range.min + range.max) / 2;

			/* jshint -W016 */
			if (val > mid) {
				hashVal = (hashVal << 1) + 1;
				range.min = mid;
			}
			else {
				hashVal = (hashVal << 1) + 0;
				range.max = mid;
			}
			/* jshint +W016 */

			even = !even;
			if (bits < 4) {
				bits++;
			}
			else {
				bits = 0;
				hash += g_BASE32[hashVal];
				hashVal = 0;
			}
		}
		return hash;
	};
});