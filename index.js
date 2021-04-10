var app = angular.module('myApp', ["ngRoute","ngCookies"]);

const stripe = Stripe('pk_test_51IZXhAIHgciOTRlC8z9vpvgV1yZlblnWRZdnmIfwZZxJaTUXEevJOoRNQWEY8u58wG25kEIPu4Hop9k7x8j30PhM008P69QoOS');


const env = 1;

let url;
if (env === 0) {
    url = 'http://127.0.0.1:8000'
 } 
else{
     url = 'https://imperial-hotel.herokuapp.com'
    }

app.config(function ($routeProvider,$httpProvider) {
  $httpProvider.defaults.withCredentials = true;
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
      url: `${url}/enquiries`,
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
app.controller('myCtrl', function ($scope,$http,$compile) {
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
  $scope.change = async function () {
    document.getElementById("availableRooms").innerHTML= '';

    const response = await fetch(`${url}/api/rooms/availableRoomCategories?type=${getType($scope.rooms[0].guest)}`);
    console.log(response);

  
  //   $http({
  //     method: 'GET',
  //     url: `${url}/api/rooms/availableRoomCategories?type=${getType($scope.rooms[0].guest)}`,
  //   })
  //    .then(function(response){
  //     response.data.data.availableRoomsCategories.forEach(item => {
  //       const room = item._id;
  //       angular.element(document.querySelector('#availableRooms')).append($compile(myHtml(room))($scope))
  //     });
  //   }, function (response) {
  //     $scope.error = response.data;
  //     alert("unsuccessful call");
  //     console.log($scope.error);
  //  });
  }
  $scope.bookNow =  function (category) {
    $http({
      method: 'GET',
      url: `${url}/api/rooms/availableRooms?roomCategory=${category}`,
    })
    .then(function(response){
      const room = response.data.data.data[0];
      
      $http({
        method: 'GET',
        url: `${url}/api/bookings/checkout-session/${room._id}?checkIn=${$scope.chIn}&checkOut=${$scope.chOut}`,
        withCredentials: true
      }).then(async function(session){
             // 2) Create checkout form + chanre credit card
        try{
          await stripe.redirectToCheckout({
             sessionId: session.data.session.id
          });
        } catch (err) {
          console.log(err);
        showAlert('error', err);
       }
      },function (response) {
         console.log(response);
      });
     

  }, function (response) {
      $scope.error = response.data;
      alert("unsuccessful call");
      console.log($scope.error);
   });
  }
});









const getType = guest => {
  let type;
  if (guest == 1){
      return "Single";
  } else if (guest == 2){
      return "Double";
  }
  else if (guest == 3){
       return "Triple";
  }
}


function myHtml(room) {
   return  `
    <div class="card" >
       <img src="/assets/img/index.jpg" alt="" class="rounded" class="rooms-img"
           style="max-width:100%;">
        <h3 class="room-title">${room.name}</h3>
         <p class="room-text">${room.description}</p>
      <div>
       <div class="details-container">
         <img src="assets/img/bed.png" alt="tick" class="list-icon">
         <p class="list-text">${room.type}</p>
       </div>
     </div>

     <p class="amount-text">LKR ${room.price} Per Night</p>
       <div class="buttons-container">  
     <a href="" ng-click="bookNow('${room._id}')" class="btn btn-fill btn-lg">Book Now</a>
    </div>
   `;
}
