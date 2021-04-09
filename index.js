var app = angular.module('myApp', ["ngRoute"]);

app.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "home.html"
    })
    .when("/rooms", {
      templateUrl: "rooms.html"
    })
    .when("/gallery", {
      templateUrl: "gallery.html"
    })
    .when("/aboutUs", {
      templateUrl: "about.html"
    })
    .when("/contactUs", {
      templateUrl: "contact.html",
      controller: "contactCtrl"
    });
});

app.controller("contactCtrl", function ($scope, $http, $log) {
  $scope.enquiry = null;
  $scope.sendCmt = function () {
    console.log($scope.enquiry);
    $http({
      method: "POST",
      url: "http://localhost:3000/enquiries",
      data: $scope.enquiry,
      headers: { 'content-Type': 'application/json' }
    })
      .then(function (response) {
          alert("Your comment has been sent Successfully!");
          location.reload();
      }, function (response) {
        alert("Unable to send your comment!");
        $scope.statusval = response.status;
        $scope.statustext = response.statusText;
        $scope.headers = response.headers();
      });
  }
});
app.controller('myCtrl', function ($scope) {
  $scope.chIn = new Date();
  var today = new Date();
  today.setDate(today.getDate() + 1);
  $scope.chOut = today;
  $scope.rooms = [{ guest: 1 }];
  $scope.total = function () {
    var sum = 0, x;
    for (x = 0; x < $scope.rooms.length; x++) {
      sum += $scope.rooms[x].guest;
    }
    return sum;
  }
  $scope.addRoom = function () {
    if ($scope.rooms.length < 3) {
      $scope.rooms.push({ guest: 1 });
    }
  }
  $scope.removeRoom = function (x) {
    if ($scope.rooms.length > 1) {
      $scope.rooms.splice(x, 1);
    }
  }
  $scope.increaseGuest = function (x) {
    if ($scope.rooms[x].guest < 3) {
      $scope.rooms[x].guest++;
    }
  }
  $scope.decreaseGuest = function (x) {
    if ($scope.rooms[x].guest > 1) {
      $scope.rooms[x].guest--;
    }
  }
});