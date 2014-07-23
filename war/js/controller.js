

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
app.controller('InfoCtrl', function ($scope, $http, Members, OrgConstant, $ionicModal, $compile) {
	
	var fillUI = function() {
		$scope.members = Members.getMembers();
		$scope.orgs = OrgConstant;
		// filterMem();
	};

	var memElder = [];
	var memRelief = [];
	var memYM = [];
	var memYW = [];
	var memPrimary =[];

	var active_key = "all";
	//指定要顯示的組織別
	$scope.setActive = function(key) {
		active_key = key;
		$scope.members = Members.getOrgMembers(key);
		// showMems(key);
	}
	//判斷該組織別的按鈕是否是 active
	$scope.isActive = function(key) {
		return (key === active_key);
	}

	/*  確保只有一個 Member 被選取 */
	var active_member_rec_no = "";
	$scope.setMemActive = function(mem) {
		active_member_rec_no = mem.rec_no ; 
		showMemberInfo(mem.rec_no);
	}

	$scope.isMemActive = function(mem) {
		return (mem.rec_no === active_member_rec_no);
	}

	var showMemberInfo = function(rec_no) {

		$scope.currentMember = Members.getMemberByRecNo(rec_no);
		$scope.openModal();
	}

	$ionicModal.fromTemplateUrl('templates/info-detail.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	}).then(function(modal) {
	    $scope.modal = modal;
	    // initMap();
	});

	$scope.openModal = function() {
	    $scope.modal.show();
		initMap();
	};
	$scope.closeModal = function() {
	    $scope.modal.hide();
	};
	  //Cleanup the modal when we're done with it!
	$scope.$on('$destroy', function() {
	    $scope.modal.remove();
	});

	//Google Maps
	var map ;
	var geocoder ;

	function initMap() {
        var myLatlng = new google.maps.LatLng(24.815102099999997,120.979858);
        
        var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map"),
            mapOptions);

        geocoder = new google.maps.Geocoder();

        codeAddress($scope.currentMember.address);
       
        $scope.map = map;
    }
      
    $scope.centerOnMe = function() {
        if(!$scope.map) {
          return;
        }

        $scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function(pos) {
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          $scope.loading.hide();
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
    };
      
    $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
    };

    var codeAddress = function(address) {
	  // var address = document.getElementById('address').value;
	  geocoder.geocode( { 'address': address}, function(results, status) {
	    if (status == google.maps.GeocoderStatus.OK) {
	      map.setCenter(results[0].geometry.location);
	      	var marker = new google.maps.Marker({
		        map: map,
		        position: results[0].geometry.location,
		        title : $scope.currentMember.name
	      	});
	      	var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
	        var compiled = $compile(contentString)($scope);

	        var infowindow = new google.maps.InfoWindow({
	          content: compiled[0]
	        });

	        google.maps.event.addListener(marker, 'click', function() {
	          infowindow.open(map,marker);
	        });
	    } else {
	      alert('此地址查不到經緯度: ' + status);
	    }
	  });
	}
      
    //2. 如果 Member 還未載入，則等待
	if (!Members.isLoaded()) {
		Members.setAfterRefreshDataHandler(function(members) {
			fillUI();
		});
	}
	else {
		fillUI();
	}
});


app.controller('AttendStatisticsCtrl', function ($scope, OrgConstant, Util, Members , $http, ServiceConstant) {

	$scope.orgs = OrgConstant;
	var dicAttendanceByDate = {};	//按照日期分類的出席紀錄
	var dicAttendanceByMemberID = {};	//按照教籍號碼的出席紀錄
	var dicAttendanceByDateMemberID = {};	//以 date_memberid 當key 的出席紀錄，僅是用來加快查詢的速度
	var alldays = [];	//12 週的星期日
	var dicDays = {} ; //用來紀錄非同步呼叫是否都傳回來了？

	var active_key = "all";
	//指定要顯示的組織別
	$scope.setActive = function(key) {
		active_key = key;
		refreshAttendanceUI();
	}
	//判斷該組織別的按鈕是否是 active
	$scope.isActive = function(key) {
		return (key === active_key);
	}

	var loadAttRecords = function() {
		dicAttendanceByDate = {};
		dicAttendanceByMemberID = {};
		dicAttendanceByDateMemberID = {} ;

		//1. 找出 3 個月內的每個星期日
		alldays = [];
		var today = new Date();
		var lastSunday = dateDiff(today, 0-today.getDay());
		// today.setDate(today.getDate() - today.getDay());
		alldays.push(Util.formatDate(lastSunday));
		dicDays = {};	
		for(var i=1; i<12; i++) {
			var theDate = Util.formatDate(dateDiff(lastSunday, (0-i * 7)));
			alldays.push( theDate);
			dicDays[theDate] = "none" ;	//預設這天資料尚未載入
		}
		alldays.sort();	//從小到大排序

		//2. 找出每一個星期日的出席名單
		angular.forEach(alldays, function(date) {

			$http.get(ServiceConstant.attendance + "?date=" + date)
			.success(function(data, status) {

				angular.forEach(data, function(att) {

					if (!dicAttendanceByDate[date]) {
						dicAttendanceByDate[date] = [];
					}
					dicAttendanceByDate[date].push(att);

					if (!dicAttendanceByMemberID[att.member.id]) {
						dicAttendanceByMemberID[att.member.id] = [];
					}
					dicAttendanceByMemberID[att.member.id].push(att);

					dicAttendanceByDateMemberID[date + "_" + att.member.id ]= att;

				});

				dicDays[date] = "success";	//這天資料已經載入成功
				console.log(" == get att record successfully for date : " + date );
				
		  		refreshAttendanceUI();
		  	})
		  	.error(function(errmsg, status) {
		  		dicDays[theDate] = "fail";  //這天資料載入失敗
		  		alert("載入出席紀錄時發生錯誤!" +  errmsg)
		  		refreshAttendanceUI();
		  	});
		});

		
	}

	//3. 計算統計每一個星期日的出席人數，以及每一個人的出席紀錄
	var refreshAttendanceUI = function() {
		//a. 判斷是否載入成功
		var loadComplete = isLoadComplete();
		console.log(" isLoadComplete : " + loadComplete );
		if (!loadComplete) {
			
			return ;
		}
		//b. 畫統計圖
		drawChart();

		//c. 印出人名
	};

	var drawChart = function() {
		var orgMembers = Members.getOrgMembers(active_key);

		var values = [];
		values.push(['日期', '人數']);
		angular.forEach(alldays, function(date) {
			//找出這天在指定組織的出席人數
			var count = 0;
			angular.forEach(orgMembers, function(mem) {
				var key = date + "_" + mem.id ;
				if (dicAttendanceByDateMemberID[key])
					count += 1
			});
			values.push([ date, count ]);
		});

		var data = google.visualization.arrayToDataTable( values );

        var options = {
          title: '12週內' + active_key + '的出席統計'
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        chart.draw(data, options);

	};

	var isLoadComplete = function() {
		var result = true ;

		console.log(" === isComplete  ======")
		
		angular.forEach(alldays, function(date) {
			var is_success = (dicDays[date]);
			console.log(date + " : " + is_success);
			result = result && (dicDays[date] === "success");
		})
		return result ;
	};

	var dateDiff = function(orgDate, days) {
		var d = new Date();

		var timer = orgDate.getTime();

		var newTimer = timer + days * 24 * 60 * 60 * 1000;

		d.setTime(newTimer);

		return d;
	};

	loadAttRecords();



});

