'use strict';

angular.module('food-app', ['firebase'])
.run(['$rootScope','$window', function($rootScope, $window){
  $rootScope.fbRoot = new $window.Firebase('https://food-web-app.firebaseio.com/');
}])
.controller('master',['$scope','$firebaseObject','$firebaseArray',function($scope, $firebaseObject, $firebaseArray){

  var fbUser = $scope.fbRoot.child('user');
  var afUser = $firebaseObject(fbUser);
  $scope.user = afUser;

  var fbFoods = $scope.fbRoot.child('foods');
  var afFoods = $firebaseArray(fbFoods);
  $scope.foods = afFoods;

  $scope.showUserForm = function(){
    $scope.isUserFormShown = true;
  };

  $scope.saveUser = function(){
    $scope.user.$save();
    $scope.isUserFormShown = false;
  };

  $scope.getBmi = function(height, weight){
    return ((weight / (height * height)) * 703).toFixed(2);
  };

  $scope.foods.$loaded().then(function(){
    newWeight();
  });

  function newWeight() {
    var totalCals = $scope.foods.reduce(function(acc, curr){
      return acc + (curr.calories * curr.servings);
    },0);
    $scope.weightGained = totalCals / 3500;
  }

  $scope.addFood = function(){
    var now = new Date();
    $scope.food.date = now.getTime();
    $scope.foods.$add($scope.food).then(function(){
      newWeight();
    });
  };

  $scope.undo = function(){
    newWeight();
    $scope.foods.$remove(this.$index).then(function(){
      newWeight();
    });
  };
}]);
