var  myModule = angular.module("myModule",['ngCookies']);

const env = 1;

let url;
if (env === 0) {
    url = 'http://127.0.0.1:8000'
 } 
else{
     url = 'https://imperial-hotel.herokuapp.com'
    }


myModule.controller('addLoginController',function($scope,$http,$cookies){
    $scope.login = function() { 
         $scope.user =  postData(`${url}/api/users/login`).then(data => {
             console.log(data);
         });
        
        
        
        
        //$http({
        //       method: 'POST',
        //       url: `${url}/api/users/login`,
        //      withcredentials: true,
        //       data: {
        //           email: $scope.email,
        //           password: $scope.password
        //       },
        //       headers:{    
        //         'Content-Type': 'application/json'
        //     },
        //   })
        //   .then(function(response){
        //       $scope.userData = response.data;
        //       $scope.status = response.status;
        //       $scope.headers = response.headers;
        //       $scope.config = response.config;

        //     //   $cookies.put("jwt", response.data.token,{
        //     //       secure: true,
        //     //       samesite: 'None'
        //     //   });
        //     //  window.location.href = '/welcome.html';

        //   }, function (response) {
        //       $scope.error = response.data;
        //       alert("unsuccessful call");
        //      console.log($scope.error);
        //   });
 }

 
});

myModule.controller('addSignUpController',function($scope,$http,$log){
    $scope.signUp = function() { 
        $scope.user =  $http({
              method: 'POST',
              url: 'https://imperial-hotel.herokuapp.com/api/users/signup',
              data: {
                  name: $scope.name,
                  email: $scope.email,
                  password: $scope.password,
                  passwordConfirm: $scope.passwordConfirm
              },
              headers:{    
                'Content-Type': 'application/json'
            },
          })
          .then(function(response){
              $scope.userData = response.data;
              $scope.status = response.status;
              $scope.headers = response.headers;
              $scope.config = response.config;
              window.location.href = '/welcome.html';
          }, function (response) {
              $scope.error = response.data;
              alert("unsuccessful call");
             console.log($scope.error);
          });
    }
});


myModule.controller('addForgotPasswordController',function($scope,$http,$log){
    $scope.forgotPassword = function() { 
        $scope.user =  $http({
              method: 'POST',
              url: 'https://imperial-hotel.herokuapp.com/api/users/forgotPassword',
              data: {
                  email: $scope.email || "test1@gmail.com",
              },
              headers:{    
                'Content-Type': 'application/json'
            },
          })
          .then(function(response){
              $scope.userData = response.data;
              $scope.status = response.status;
              $scope.headers = response.headers;
              $scope.config = response.config;
              alert(response.data.message);
          }, function (response) {
              $scope.error = response.data;
              alert("unsuccessful call");
             console.log($scope.error);
          });
    }
});



async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'include', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }
  