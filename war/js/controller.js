


app.controller('MainCtrl', function ($scope, $ionicSideMenuDelegate, $ionicLoading, Members) {
  
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.loadMembers = function() {
  		$ionicLoading.show({
	      template: 'Loading...'
	    });
	  	Members.getAll().success(function(data, status) {
	  		Members.setMembers(data);
	  		$ionicLoading.hide();
	  	})
	  	.error(function(errmsg, status) {
	  		$ionicLoading.hide();
	  	});

  };

  if (!Members.isLoaded()) {
  	$scope.loadMembers();
  }

});

app.controller('RollCallCtrl', function ($scope, $ionicModal, Members) {
	
	if (Members.isLoaded()) {
		$scope.members = Members.getMembers();
	}
	else {
		Members.setAfterRefreshDataHandler(function(members) {
			$scope.members = members;
		});
	}

	// $scope.members = [
	// 	{ "id" :1111, "name" : "kevin", "gender" : "M", "age": 40 },
	// 	{ "id" :2222, "name" : "Zoe", "gender" : "W", "age": 30 },
	// 	{ "id" :3333, "name" : "Jason", "gender" : "M", "age": 20 },
	// 	{ "id" :4444, "name" : "sophia", "gender" : "W", "age": 10 },
	// 	{ "id" :1111, "name" : "kevin", "gender" : "M", "age": 40 },
	// 	{ "id" :2222, "name" : "Zoe", "gender" : "W", "age": 30 },
	// 	{ "id" :3333, "name" : "Jason", "gender" : "M", "age": 20 },
	// 	{ "id" :4444, "name" : "sophia", "gender" : "W", "age": 10 },
	// 	{ "id" :1111, "name" : "kevin", "gender" : "M", "age": 40 },
	// 	{ "id" :2222, "name" : "Zoe", "gender" : "W", "age": 30 },
	// 	{ "id" :3333, "name" : "Jason", "gender" : "M", "age": 20 },
	// 	{ "id" :4444, "name" : "sophia", "gender" : "W", "age": 10 },
	// 	{ "id" :1111, "name" : "kevin", "gender" : "M", "age": 40 },
	// 	{ "id" :2222, "name" : "Zoe", "gender" : "W", "age": 30 },
	// 	{ "id" :3333, "name" : "Jason", "gender" : "M", "age": 20 },
	// 	{ "id" :4444, "name" : "sophia", "gender" : "W", "age": 10 },
	// 	{ "id" :1111, "name" : "kevin", "gender" : "M", "age": 40 },
	// 	{ "id" :2222, "name" : "Zoe", "gender" : "W", "age": 30 },
	// 	{ "id" :3333, "name" : "Jason", "gender" : "M", "age": 20 },
	// 	{ "id" :4444, "name" : "sophia", "gender" : "W", "age": 10 },
	// 	{ "id" :1111, "name" : "kevin", "gender" : "M", "age": 40 },
	// 	{ "id" :2222, "name" : "Zoe", "gender" : "W", "age": 30 },
	// 	{ "id" :3333, "name" : "Jason", "gender" : "M", "age": 20 },
	// 	{ "id" :4444, "name" : "sophia", "gender" : "W", "age": 10 },
	// 	{ "id" :1111, "name" : "kevin", "gender" : "M", "age": 40 },
	// 	{ "id" :2222, "name" : "Zoe", "gender" : "W", "age": 30 },
	// 	{ "id" :3333, "name" : "Jason", "gender" : "M", "age": 20 },
	// 	{ "id" :4444, "name" : "sophia", "gender" : "W", "age": 10 },
	// 	{ "id" :1111, "name" : "kevin", "gender" : "M", "age": 40 },
	// 	{ "id" :2222, "name" : "Zoe", "gender" : "W", "age": 30 },
	// 	{ "id" :3333, "name" : "Jason", "gender" : "M", "age": 20 },
	// 	{ "id" :4444, "name" : "sophia", "gender" : "W", "age": 10 },
	// 	{ "id" :1111, "name" : "kevin", "gender" : "M", "age": 40 },
	// 	{ "id" :2222, "name" : "Zoe", "gender" : "W", "age": 30 },
	// 	{ "id" :3333, "name" : "Jason", "gender" : "M", "age": 20 },
	// 	{ "id" :4444, "name" : "sophia", "gender" : "W", "age": 10 },
	// 	{ "id" :1111, "name" : "kevin", "gender" : "M", "age": 40 },
	// 	{ "id" :2222, "name" : "Zoe", "gender" : "W", "age": 30 },
	// 	{ "id" :3333, "name" : "Jason", "gender" : "M", "age": 20 },
	// 	{ "id" :4444, "name" : "sophia", "gender" : "W", "age": 10 },
	// 	{ "id" :1111, "name" : "kevin", "gender" : "M", "age": 40 },
	// 	{ "id" :2222, "name" : "Zoe", "gender" : "W", "age": 30 },
	// 	{ "id" :3333, "name" : "Jason", "gender" : "M", "age": 20 },
	// 	{ "id" :4444, "name" : "sophia", "gender" : "W", "age": 10 },
	// 	{ "id" :1111, "name" : "kevin", "gender" : "M", "age": 40 },
	// 	{ "id" :2222, "name" : "Zoe", "gender" : "W", "age": 30 },
	// 	{ "id" :3333, "name" : "Jason", "gender" : "M", "age": 20 },
	// 	{ "id" :4444, "name" : "sophia", "gender" : "W", "age": 10 },
	// ];

	$scope.setAttendance = function(member) {
		if (member.attStatus ) {
			member.attStatus = undefined ;	//設成未出席
			$scope.count -= 1;
		}
		else {
			member.attStatus = 1 ;	//設成有出席
			$scope.count += 1;
		}
	};

	$scope.count = 0;
	$scope.queryDateCond = "2014-07-13";

	$ionicModal.fromTemplateUrl('rollcall-condition.html', {
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
	// Execute action on hide modal
	$scope.$on('modal.hidden', function() {
	    // Execute action
	});
	// Execute action on remove modal
	$scope.$on('modal.removed', function() {
	    // Execute action
	});

});


app.controller('AttendStatisticsCtrl', function ($scope) {
	
    
});

/*
app.controller('MemberCtrl', function ($scope, $ionicLoading , Members) {
	$scope.show = function() {
	    $ionicLoading.show({
	      template: 'Loading...'
	    });
	};
	$scope.hide = function(){
	    $ionicLoading.hide();
	};

  
  	$scope.loadMembers = function() {
  		$scope.show();
	  	Members.getAll().success(function(data, status) {
	  		Members.setMembers(data);
	  		$scope.members = Members.getMembers() ;
	  		$scope.hide();
	  	})
	  	.error(function(errmsg, status) {
	  		$scope.hide();
	  	});

	};

  	$scope.loadMembers();
});

*/