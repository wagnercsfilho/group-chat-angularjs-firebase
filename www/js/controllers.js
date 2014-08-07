angular.module('starter.controllers', [])

.controller('MainCtrl', function($scope,$firebase,$state,AuthService,$firebaseSimpleLogin,$rootScope){
  var firebaseRef = new Firebase("https://crackling-fire-6014.firebaseio.com/");

  // Create a Firebase Simple Login object
  $scope.auth = $firebaseSimpleLogin(firebaseRef);	

   $scope.logout = function() {
    $scope.auth.$logout();
  };

    // Upon successful logout, reset the user object
  $rootScope.$on("$firebaseSimpleLogin:logout", function(event) {
    $rootScope.user = null;
    AuthService.destroy();
    window.cookies.clear(function() {
      console.log("Cookies cleared!");
    });
    $state.go('login');
  });

})

.controller('DashCtrl', function($scope,$firebase,$ionicModal) {

 var ref = new Firebase('https://crackling-fire-6014.firebaseio.com/opened_rooms');  
  $scope.rooms = $firebase(ref).$asArray();


  $ionicModal.fromTemplateUrl('my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  
  $scope.createRoom = function(roomName, roomDescription) {
    if (!roomName) return;
      
    var roomId = Math.floor(Math.random() * 5000001);
      
    $scope.rooms.$add({
      id: roomId,
      title: roomName,
      slug: roomName.split(/\s+/g).join('-'),
      description: roomDescription
    });

    $scope.modal.hide();

  };

})

.controller('RoomCtrl', function($scope, $stateParams, $timeout, $firebase, $location, $ionicScrollDelegate) {
  var roomRef = new Firebase('https://crackling-fire-6014.firebaseio.com/opened_rooms/');
  var messagesRef = new Firebase('https://crackling-fire-6014.firebaseio.com/rooms/' + $stateParams.roomId);

  $scope.newMessage = "";
  $scope.roomsObj = $firebase(roomRef).$asArray();
  $scope.messages = $firebase(messagesRef).$asArray();
  $scope.username = 'User' + Math.floor(Math.random() * 501);

  $scope.submitAddMessage = function() {
    $scope.messages.$add({
      created_by: this.username,
      content: this.newMessage,
      created_at: new Date()
    });
    this.newMessage = "";

    scrollBottom();
  };

  var scrollBottom = function() {
    // Resize and then scroll to the bottom
    $ionicScrollDelegate.resize();
    $timeout(function() {
      $ionicScrollDelegate.scrollBottom();
    });
  };

})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
	$scope.onSwipeRight = function(){
		alert('dd');
	};
})

.controller("LoginCtrl", function($scope, $rootScope, $firebase, $firebaseSimpleLogin, $state, AuthService) {
  // Get a reference to the Firebase
  // TODO: Replace "ionic-demo" below with the name of your own Firebase
  var firebaseRef = new Firebase("https://crackling-fire-6014.firebaseio.com/");

  // Create a Firebase Simple Login object
  $scope.auth = $firebaseSimpleLogin(firebaseRef);

  // Initially set no user to be logged in
  $scope.user = null;

  // Logs a user in with inputted provider
  $scope.login = function(provider) {
    $scope.auth.$login(provider);
  };


  // Upon successful login, set the user object
  $rootScope.$on("$firebaseSimpleLogin:login", function(event, user) {
    $rootScope.user = user;
    AuthService.save();
    $state.go('tab.dash');
  });


  // Log any login-related errors to the console
  $rootScope.$on("$firebaseSimpleLogin:error", function(event, error) {
    console.log("Error logging user in: ", error);
  });
});
