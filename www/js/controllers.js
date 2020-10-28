angular.module('starter.controllers', [])
.controller('HomeCtrl', function ($scope, $timeout, $ionicModal, $ionicPopup, FirebaseServices) {

	$scope.location = {};
	$scope.list = [];
	$scope.data = {
		distance: 10
	};

	$scope.locationChangedCallback = function (location) {
		$scope.list = [];
		$scope.lat  = location.geometry.location.lat();
		$scope.lng  = location.geometry.location.lng();
		$scope.geoQuery();
	};

	$scope.geoQuery = function(){

		var geoQuery = FirebaseServices.getByGeo($scope.lat, $scope.lng, $scope.data.distance);

		geoQuery.on("key_entered", function (key, location, distance) {
			$timeout(function () {
				FirebaseServices.get(key).then(function (restaurant) {
					restaurant.distance = distance.toFixed(2);
					$scope.list.push(restaurant);
					$scope.list = uniqueArray($scope.list, '$id');
				});
			}, 300);
		});

		geoQuery.on("key_exited", function (key, location, distance) {
			console.log(key, location, distance);
		});

		geoQuery.on("ready", function () {
			$scope.ready = true;
		});

		function uniqueArray(collection, keyname) {
			var output = [], keys = [];
			angular.forEach(collection, function (item) {
				var key = item[keyname];
				if (keys.indexOf(key) == -1) {
					keys.push(key);
					output.push(item);
				}
			});
			return output;
		};
	};

	$scope.filter = function() {

		// Custom popup
		var myPopup = $ionicPopup.show({
			templateUrl: 'templates/popup-filter.html',
			title: 'Distance in Km',
			scope: $scope,
			buttons: [
				{ text: 'Cancel' }, {
					text: '<b>Save</b>',
					type: 'button-positive',
					onTap: function(e) {
						if (!$scope.data.distance) {
							e.preventDefault();
						} else {
							return $scope.data.distance;
						}
					}
				}
			]
		});

		myPopup.then(function(res) {
			$scope.list = [];
			$scope.geoQuery();
		});
	};


	$ionicModal.fromTemplateUrl('templates/modal-map.html', function ($ionicModal) {
		$scope.modal = $ionicModal;
	}, {
		scope: $scope,
		animation: 'slide-in-up'
	});

	$scope.showMap = function (item) {

		$scope.item = item;
		$scope.modal.show();

		var myLatlng = new google.maps.LatLng(item.l[0], item.l[1]);

		var mapOptions = {
			center: myLatlng,
			zoom: 16,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		var map = new google.maps.Map(document.getElementById("map"), mapOptions);

		var marker = new google.maps.Marker({
			position: myLatlng,
			map: map,
			title: item.name
		});

		$scope.map = map;
	};
})

.controller('FormCtrl', function ($scope, $state, FirebaseServices) {

	$scope.images = ['aubergine.png',
		'birthday-cake.png',
		'bread.png',
		'brochettes.png',
		'carrot.png',
		'chicken-1.png',
		'chocolate-1.png',
		'chocolate.png',
		'coffee.png',
		'covering.png',
		'beer.png',
		'biscuit.png',
		'breakfast.png',
		'burger.png',
		'cheese.png',
		'chicken.png',
		'chocolate-2.png',
		'cocktail.png',
		'coke.png'];

	$scope.form = {};

	$scope.save = function(){
		var lat = $scope.form.location.geometry.location.lat();
		var lng = $scope.form.location.geometry.location.lng();

		var newObj = {};
		newObj.name = $scope.form.name;
		newObj.img = $scope.form.img
		newObj.l   = [lat, lng];

		FirebaseServices.create(newObj).then(function(){
			$scope.form = {};
			$state.go('app.home');
		})
	};

	$scope.locationChangedCallback = function (location) {
		//none
	}
});

