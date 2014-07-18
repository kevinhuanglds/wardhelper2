


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

app.controller('RollCallCtrl', function ($scope, $ionicModal, Members, $http, ServiceConstant, $ionicLoading, Util) {
	
	var isLoadingRollCall = false ;
	var atts = [];	
	var dicAtts = {};	//dictionary of attendance records, the key is the rec_no of a member.
	$scope.queryDateCond = new Date() ;
	var target_date = Util.formatDate($scope.queryDateCond);
	


	/*  load attendance records for specificed date */
	var loadAttendRecords = function(date) {
		isLoadingRollCall = true ;
		atts = [];	//reset 
		dicAtts = {}; //reset
		$scope.count = 0;
		$http.get(ServiceConstant.attendance + "?date=" + date)
		.success(function(data, status) {
			atts = data ;
			angular.forEach(data, function(att) {
				dicAtts[att.member.name] = att;
			});
			$scope.count = atts.length ;
			isLoadingRollCall = false;
	  		refreshRollCallUI();

	  		$ionicLoading.hide();
	  	})
	  	.error(function(errmsg, status) {
	  		isLoadingRollCall = false;
	  		$ionicLoading.hide();
	  		alert("載入出席紀錄時發生錯誤!" +  errmsg)
	  	});
	}


	var refreshRollCallUI = function() {

		//1. 如果還在載入 rollcall ，則跳過
		if (isLoadingRollCall) {
			return ;
		}
		$scope.attRecs = [];

		//2. 如果 Member 還未載入，則等待
		if (!Members.isLoaded()) {
			Members.setAfterRefreshDataHandler(function(members) {
				$scope.attRecs = calculateAttRecs(members);
			});
		}
		else {
			$scope.attRecs = calculateAttRecs(Members.getMembers());
		}
	};

	var calculateAttRecs = function(members) {
		var result = [] ;
		angular.forEach(members, function(member) {
			if (member.is_active) {
				var att = {};
				att.rec_no = member.rec_no;
				att.name = member.name;
				att.date = target_date;
				var attRec = dicAtts[member.rec_no];
				att.attStatus = (attRec !== undefined);
				result.push(att);
			};

		});

		return result ;
	}

	/*  新增或修改出席紀錄  */
	$scope.setAttendance = function(att) {
		var mode = (att.attStatus) ? "delete" : "add";	//如果存在，就刪除，否則就增加

		var request = $http({
                    method: "post",
                    url: ServiceConstant.attendance,
                    data: "mode=" + mode + "&rec_no=" + att.rec_no + "&date=" + target_date + "&meeting=0" ,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

        request.success(
            function( html ) {
            	if (att.attStatus) {	
            		$scope.count -= 1;	//原本有出息，但被取消，所以要減一。
            	}
            	else
            		$scope.count += 1;	//原本沒有出席，但被登記出席，所以要加一。

            	att.attStatus = !att.attStatus ;

            }
        );
	};

	$scope.count = 0;
	
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
	$scope.setDate = function() {
		var elm = document.getElementById("theDate");
		//alert(elm.value);
		target_date = elm.value
		$scope.queryDateCond = new Date(target_date);
		$scope.modal.hide();
		loadAttendRecords(target_date);
	};
	$scope.cancelDateSetting = function() {
		$scope.modal.hide();
	}

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

	//載入出席紀錄
	loadAttendRecords(target_date);

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