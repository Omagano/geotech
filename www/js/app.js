// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['firebase', 'ionic', 'starter.controllers', 'starter.services', 'starter.directives'])

.run(function ($ionicPlatform) {
	$ionicPlatform.ready(function () {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}
	});
})

.config(function ($ionicConfigProvider, $stateProvider, $urlRouterProvider) {

	$ionicConfigProvider.backButton.text('').icon('ion-ios-arrow-back').previousTitleText('');

	$stateProvider

		.state('app', {
			url: '/app',
			abstract: true,
			templateUrl: 'templates/menu.html'
		})
		.state('app.home', {
			url: '/home',
			views: {
				'menuContent': {
					templateUrl: 'templates/home.html',
					controller: 'HomeCtrl'
				}
			}
		})
		.state('app.form', {
			url: '/form',
			views: {
				'menuContent': {
					templateUrl: 'templates/form.html',
					controller: 'FormCtrl'
				}
			}
		});
	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/app/home');
});
