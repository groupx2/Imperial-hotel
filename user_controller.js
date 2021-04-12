var app = angular.module('myUserModule', ["ngRoute"]);

app.config(function ($routeProvider,$httpProvider) {
    $httpProvider.defaults.withCredentials = true;
    $routeProvider
    .when("/", {
      templateUrl: "settings.html"
    })
      .when("/settings", {
        templateUrl: "settings.html"
      })
      .when("/bookings", {
        templateUrl: "bookingRoom.html"
      });
  });

  app.controller("myCtrl", function ($scope, $http, $log) {
  });