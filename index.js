var app = angular.module('myApp', ["ngRoute"]);

const stripe = Stripe('pk_test_51IZXhAIHgciOTRlC8z9vpvgV1yZlblnWRZdnmIfwZZxJaTUXEevJOoRNQWEY8u58wG25kEIPu4Hop9k7x8j30PhM008P69QoOS');


const env = 1;

let url;
if (env === 0) {
    url = 'http://127.0.0.1:8000'
 } 
else{
     url = 'https://imperial-hotel.herokuapp.com'
    }

if (window.location.href.split('?')[1] === "showAlert") {
   alert("ROOM BOOKED SUCCESSFULLY");
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
    })
    .when("/user/settings", {
      templateUrl: "settings.html"
    })
    .when("/user/bookings", {
      templateUrl: "bookingRoom.html"
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
  document.querySelector('.body').hidden = true;
  document.querySelector('.signin').hidden = true;
  document.querySelector('.signout').hidden = true;
  document.querySelector('.bookings-tab').hidden = true;
  document.querySelector('.settings-tab').hidden = true;
  $scope.checkUser = function () {
    $http({
      method: 'GET',
      url: `${url}/api/users/me`,
    })
     .then(function(response){
      document.querySelector('.body').hidden = false;
      document.querySelector('.signout').hidden = false;
       document.querySelector('.bookings-tab').hidden = false;
       document.querySelector('.settings-tab').hidden = false;
      }
     , function (response) {
      document.querySelector('.body').hidden = false;
      document.querySelector('.signin').hidden = false;
   });
   
  }
  $scope.chIn = new Date();
  var today = new Date();
  today.setDate(today.getDate() + 1);
  $scope.chOut = today;
  $scope.rooms = [{ guest: 1 }];
  // $scope.total = function () {
  //   var sum = 0, x;
  //   for (x = 0; x < $scope.rooms.length; x++) {
  //     sum += $scope.rooms[x].guest;
  //   }
  //   return sum;
  // }
  // $scope.addRoom = function () {
  //   if ($scope.rooms.length < 3) {
  //     $scope.rooms.push({ guest: 1 });
  //   }
  // }
  // $scope.removeRoom = function (x) {
  //   if ($scope.rooms.length > 1) {
  //     $scope.rooms.splice(x, 1);
  //   }
  // }
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
  
    $http({
      method: 'GET',
      url: `${url}/api/rooms/availableRoomCategories?type=${getType($scope.rooms[0].guest)}`,
    })
     .then(function(response){
      response.data.data.availableRoomsCategories.forEach(item => {
        const room = item._id;
        angular.element(document.querySelector('#availableRooms')).append($compile(myHtml(room))($scope));
        
      });
    }, function (response) {
      $scope.error = response.data;
      alert("unsuccessful call");
      console.log($scope.error);
   });
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
        url: `${url}/api/bookings/checkout-session/${room._id}?checkIn=${$scope.chIn}&checkOut=${$scope.chOut}`
      }).then(async function(session){
             // 2) Create checkout form + chanre credit card
        try{
          await stripe.redirectToCheckout({
             sessionId: session.data.session.id
          });
        } catch (err) {
          alert('error');
       }
      },function (response) {
         alert(response.data.message);
      });
     

  }, function (response) {
      $scope.error = response.data;
      alert("unsuccessful call");
      console.log($scope.error);
   });
  }
  $scope.prepareUserPage = function() {
    document.getElementById("user-view").hidden = true;
    $http({
      method: 'GET',
      url: `${url}/api/users/me`,
    }).then(function(response){
      document.getElementById("user_name").value = response.data.data.data.name;
      document.getElementById("email").value = response.data.data.data.email;
      document.querySelector(".form__user-photo").src = `${url}/img/users/${response.data.data.data.photo}`;
      document.getElementById("user-view").hidden = false;
    }, function (err) {
       console.log(err);
     });
 }
  $scope.saveSetting = function() {
    const name =  document.getElementById("user_name").value;
    const email =  document.getElementById("email").value;
    const photo =  document.getElementById("user-photo").files[0];
    const form = new FormData();
    form.append('name', document.getElementById("user_name").value);
    form.append('email',  document.getElementById("email").value);
    form.append('photo', document.getElementById('user-photo').files[0]);
    $http({
      method: 'PATCH',
      url: `${url}/api/users/updateMe`,
      data: form,
      transformRequest: angular.identity, 
      headers : {'Content-Type':undefined}
    }) .then(function(response){
       console.log(response);
          alert("Updated Successfully");
    }, function (err) {
       console.log(err);
     });
  }
  $scope.savePassword = function() {
    const passwordCurrent =  document.getElementById("password-current").value;
    const password =  document.getElementById("password").value;
    const passwordConfirm =  document.getElementById("password-confirm").value;
    $http({
      method: 'PATCH',
      url: `${url}/api/users/updateMyPassword`,
      data: {
        passwordCurrent,
        password,
        passwordConfirm
      },
      headers:{    
        'Content-Type': 'application/json'
    },
    }) .then(function(response){
          alert("Updated Successfully");
    }, function (err) {
       console.log(err);
     });
  }

  $scope.showBooking = function() {
    document.querySelector('#show-bookings').innerHTML = '';
    $http({
      method: 'GET',
      url: `${url}/api/bookings/getMyBookings`,
    }) .then(function(response){
      if (response.data.data.data.length === 0) document.querySelector('#show-bookings').innerHTML = `<h5 style="margin: auto auto;">No Bookings</h5>`;
      response.data.data.data.forEach(item => {
        angular.element(document.querySelector('#show-bookings')).append($compile(`
        <div class="card ml-2" style="width: 18rem;margin-top: 10px;">
        <img class="card-img-top" src="./assets/img1.jpg" alt="Card image cap">
        <div class="card-body">
            <h5 class="card-title">${item.room.roomCategory.name}</h5>
            <h6 class="card-title">${item.room.roomCategory.type}</h6>
        </div>
      </div>
        `)($scope));
        
      });
   }, function (err) {
     console.log(err);
 });
  }

  $scope.signOut = function() {
    $http({
      method: 'GET',
      url: `${url}/api/users/logout`,
    }) .then(function(response){
      window.location.href = '/';
    }, function (err) {
      console.log(err);
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
      <div class="box">
      <div class="imgBx">
       <img src="${url}/img/roomCategories/${room.photo}">
      </div>
     <div class="content">
       <div>
         <h2>${room.name}</h2>
        <br>
       <p>${room.description}</p>
       <br>
       <br>
       <br>
       <br>
    <h3><P>LKR${room.price} / per night</P> </h3>
   <br>
   <button class="butn" ng-click="bookNow('${room._id}')">
   <h4>Book Now</h3>
  </button>
 
  </div>
</div>
</div>
   `;
}
