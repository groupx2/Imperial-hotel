var  myModule = angular.module("myModule",[]);

const env = 1;

let url;
if (env === 0) {
    url = 'http://127.0.0.1:8000'
 } 
else{
     url = 'https://imperial-hotel.herokuapp.com'
    }



    myModule.config(function ($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
      });


myModule.controller('addLoginController',function($scope,$http){
    $scope.login = function() { 
        $scope.user =  $http({
              method: 'POST',
              url: `${url}/api/users/login`,
             withcredentials: true,
              data: {
                  email: $scope.email,
                  password: $scope.password
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

             window.location.href = '/';

          }, function (response) {
              $scope.error = response.data;
              console.log(response.data);
              alert("Please try again later.");
          });
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
              window.location.href = '/';
          }, function (response) {
              $scope.error = response.data;
              alert("please try again later.");
          });
    }
});


myModule.controller('addForgotPasswordController',function($scope,$http,$log){
    $scope.forgotPassword = function() { 
        $scope.user =  $http({
              method: 'POST',
              url: 'https://imperial-hotel.herokuapp.com/api/users/forgotPassword',
              data: {
                  email: $scope.email,
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
              console.log(response.data);
              alert("please try again later.");
          });
    }
});

myModule.controller('addResetPasswordController',function($scope,$http,$log){
    $scope.resetPassword = function() { 
        $scope.user =  $http({
              method: 'PATCH',
              url: `https://imperial-hotel.herokuapp.com/api/users/resetPassword/${window.location.href.split('?')[1]}`,
              data: {
                  password: document.getElementById("newPassword").value,
                  passwordConfirm: document.getElementById("confirmPassword").value
              },
              headers:{    
                'Content-Type': 'application/json'
            },
          })
          .then(function(response){
              alert("Password changed successfully");
              window.location.href = '/';
          }, function (response) {
              $scope.error = response.data;
              console.log(response.data);
              alert("please try again later.");
          });
    }
});
