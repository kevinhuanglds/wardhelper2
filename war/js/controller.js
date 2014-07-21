

/*
* 	主畫面的 Controller
*/
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

/*
*	處理點名的 Controller 
*/
app.controller('RollCallCtrl', function ($scope, $ionicModal, Members, $http, ServiceConstant, $ionicLoading, Util) {
	
	var isLoadingRollCall = false ;
	var atts = [];	
	var dicAtts = {};	//dictionary of attendance records, the key is the rec_no of a member.
	$scope.queryDateCond = new Date() ;
	var target_date = Util.formatDate($scope.queryDateCond);
	
	$scope.canEdit = false ;


	/*  load attendance records for specificed date */
	var loadAttendRecords = function(date) {
		
		$scope.canEdit = false ;

		$ionicLoading.show({
	      template: '載入 ' + target_date + '出席紀錄...'
	    });
		isLoadingRollCall = true ;
		atts = [];	//reset 
		dicAtts = {}; //reset
		$scope.count = 0;
		$http.get(ServiceConstant.attendance + "?date=" + date)
		.success(function(data, status) {
			atts = data ;
			angular.forEach(data, function(att) {
				dicAtts[att.member.id] = att;
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
				var attRec = dicAtts[member.id];
				att.attStatus = (attRec !== undefined);
				att.isUpdating = false ;	//是否正在更新中，目的是當使用者按下按鈕時，避免 Server 處理太久，畫面看起來鈍鈍的，所以先變個暫時的顏色。
				result.push(att);
			};

		});

		return result ;
	}

	/*  新增或修改出席紀錄  */
	$scope.setAttendance = function(att) {
		
		if (!$scope.canEdit) {
			var msg = "開啟編輯設定後才可以開始點名，是否現在要開啟呢？"
			var result = confirm(msg);
			if (result) {
				$scope.canEdit = true ;
			}
			return;
		}

		att.isUpdating = true;

		var mode = (att.attStatus) ? "delete" : "add";	//如果存在，就刪除，否則就增加

		var request = $http({
                    method: "post",
                    url: ServiceConstant.attendance,
                    data: "mode=" + mode + "&rec_no=" + att.rec_no + "&date=" + target_date + "&meeting=0" ,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });


        request.success(
            function( html ) {

            	att.isUpdating = false;

            	if (att.attStatus) {	
            		$scope.count -= 1;	//原本有出息，但被取消，所以要減一。
            	}
            	else
            		$scope.count += 1;	//原本沒有出席，但被登記出席，所以要加一。

            	att.attStatus = !att.attStatus ;

            }
        ).error(function() {
        	att.isUpdating = false ;
        });
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


/*
*	處理出席統計的 Controller ....
*/
app.controller('AttendStatisticsCtrl', function ($scope) {
	
    
});


/**
*  處理資料匯入的 Controller 
*/
app.controller('ImportCtrl', function ($scope, $ionicLoading , $http, ServiceConstant) {

	$scope.parseFail = true ;

	console.log("ImportCtrl ...");

	//"紀錄號碼","姓名","性別","年齡","出生日期","家用電話號碼","地址--地址 1","遷入日期","證實日期","聖職職位","是否為返鄉傳教士","是否已接受恩道門","是否已印證給配偶"
	var filedNames = ["rec_no", "name", "gender", "age", "birthday", "tel_h", "address", "in_date", "confirm_date", "pristhood", "is_rm", "is_endow", "is_sealed"];

	$scope.showContent = function($fileContent){
		$scope.parseFail = true ;	//initialize ...
	    $scope.content = $fileContent;
	    console.log($scope.content);
	    parseContent($scope.content);
	};

	var parseContent = function(content) {
		records = [];
		var rows = content.split(/[\r\n|\n]+/);
		for (var i = 0; i < rows.length; i++){
			var person = {};
            var arr = rows[i].split(',');

            for (var j = 0; j < arr.length; j++){
            	person[filedNames[j]] = arr[j].replace(/"/g, '');
            }
            records.push(person);
        }
        $scope.MemRecs = records;
        $scope.parseFail = false ;	
	};


	var counter = 0;
	/*  */
	$scope.startUpload = function() {
		counter = 1;	//title row 省略掉
		uploadData();
	}


	var uploadData = function() {

		var mem = $scope.MemRecs[counter];
		if (!mem) {
			return ;
		}


		mem.upload_status = "uploading ...";
/*
		rec_no,  name,  gender,  tel_h,  address ,  age ,
		birthday , confirm_date, is_active, is_endowment, is_rm , 
		is_sealed, pristhood
*/
		var post_data = "rec_no=" + mem.rec_no + "&name=" + mem.name + "&gender=" + mem.gender +
						"&tel_h=" + mem.tel_h + "&address=" + mem.address + "&age=" + mem.age +
						"&birthday=" + mem.birthday + "&confirm_date=" + mem.confirm_date + 
						"&is_endowment=" + (mem.is_endow=="是") + "&is_rm=" + (mem.is_rm == "是") +
						"&is_sealed=" + (mem.is_sealed == "是") + "&pristhood=" + (mem.pristhood) ;

		var request = $http({
                    method: "post",
                    url: ServiceConstant.update_member,
                    data: post_data ,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });


        request.success(
            function( html ) {
            	mem.upload_status = "OK";
            	counter +=1;
            	uploadData();	//recursive ...
            }
        ).error(function() {
        	mem.upload_status = "fail";
        	counter +=1 ;
            uploadData();	//recursive ...
        });
	};

});

/*

*/
app.controller('SetActiveCtrl', function ($scope, $http, Members, ServiceConstant) {
	
	$scope.members = Members.getMembers();
	var active_count=0;
	var inactive_count=0;
	angular.forEach($scope.members, function(mem) {
		if (mem.is_active)
			active_count += 1;
		else
			inactive_count += 1;
	});
	$scope.active_count = active_count;
	$scope.inactive_count = inactive_count;

	$scope.setActive = function(member) {

		member.isUpdating = true ;

		var request = $http({
                    method: "post",
                    url: ServiceConstant.set_active,
                    data: "rec_no=" + member.rec_no + "&is_active=" + (!member.is_active) ,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });


        request.success( function( html ) {
            	member.is_active = !member.is_active;
            	member.isUpdating = false ;
            	var increment_count = (member.is_active) ? 1 : -1 ;
            	$scope.active_count += increment_count ;
            	$scope.inactive_count -= increment_count ;
            }
        ).error(function() {
            	member.isUpdating = false ;
        });
	}

});

/*

*/
app.controller('InfoCtrl', function ($scope, $http, Members, OrgConstant) {
	
	$scope.members = Members.getMembers();
	$scope.orgs = OrgConstant;
	var memElder = [];
	var memRelief = [];
	var memYM = [];
	var memYW = [];
	var memPrimary =[];

	var active_key = "all";
	$scope.setActive = function(key) {
		active_key = key;
		showMems(key);
	}

	$scope.isActive = function(key) {
		return (key === active_key);
	}

	/*  確保只有一個 Member 被選取 */
	var showMems = function(key) {
		if (key === "elder") {
			$scope.members = memElder;
		}
		else if (key === "relief") {
			$scope.members = memRelief;
		}
		else if (key === "ym") {
			$scope.members = memYM;
		}
		else if (key === "yw") {
			$scope.members = memYW;
		}
		else if (key === "primary") {
			$scope.members = memPrimary;
		}
		else {
			$scope.members = Members.getMembers();
		}
	}

	/*  確保只有一個 Member 被選取 */
	var active_member_rec_no = "";
	$scope.setMemActive = function(mem) {
		active_member_rec_no = mem.rec_no ; 
	}

	$scope.isMemActive = function(mem) {
		return (mem.rec_no === active_member_rec_no);
	}


	/* 把成員分類到各個組織 */
	var filterMem = function() {
		var mems = Members.getMembers();
		angular.forEach(mems, function(mem) {
			if (mem.age < 12) {
				memPrimary.push(mem);
			}
			else if (mem.age > 17) {
				if (mem.gender == "男") {
					memElder.push(mem);
				}
				else {
					memRelief.push(mem);
				}
			}
			else {
				if (mem.gender == "男") {
					memYM.push(mem);
				}
				else {
					memYW.push(mem);
				}
			}
		});
	}

	filterMem();

});

