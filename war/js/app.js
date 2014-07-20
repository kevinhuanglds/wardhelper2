// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('wardhelper', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});


app.config(function ( $stateProvider, $urlRouterProvider) {
  
  $urlRouterProvider.otherwise('/rollcall');

  $stateProvider
  .state( 'rollcall' , {
    url : '/rollcall',
    templateUrl : 'templates/rollcall.html',
    controller : 'RollCallCtrl'
  })
  .state ('statistics' , {
    url : '/statistics',
    templateUrl : 'templates/statistics.html',
    controller : 'AttendStatisticsCtrl'
  })
  .state ('info', {
    url : '/info',
    templateUrl : 'templates/info.html'
  })
  .state ('import', {
    url : '/import',
    templateUrl : 'templates/import.html',
    controller : 'ImportCtrl'
  })
  .state ('setActive', {
    url : '/setActive',
    templateUrl : 'templates/setActive.html',
    controller : 'SetActiveCtrl'
  });
  ;
});



