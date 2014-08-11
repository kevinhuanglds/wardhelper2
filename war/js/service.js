

app.factory('Util', function () {

	return {
		formatDate : function(date) {
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var theDate = date.getDate();

			return year + "-" + (month < 10 ? ("0" + month) : month) + "-" + ((theDate < 10) ? ("0" + theDate) : theDate);
		},

		formatSimpleDate : function(date) {
			var month = date.getMonth() + 1;
			var theDate = date.getDate();

			return month + "/" + theDate;
		},

		toSimpleDate : function(dateString) {
			var dt = new Date(dateString);
			return (dt.getMonth() + 1) + "/" + dt.getDate();
		},

		/* 找到最接近的星期日 */
		getLastSunday : function() {
			var today = new Date();
			var lastSunday = this.dateDiff(today, 0-today.getDay());
			return lastSunday ;
		},

		/* 找出過去幾個安息日的日期 */
		getPastWeeks : function(weekCount) {
			alldays = [];
			var lastSunday = this.getLastSunday();
			alldays.push(this.formatDate(lastSunday));
			dicDays = {};	
			for(var i=1; i<weekCount; i++) {
				var theDate = this.formatDate(this.dateDiff(lastSunday, (0-i * 7)));
				alldays.push( theDate);
				dicDays[theDate] = "none" ;	//預設這天資料尚未載入
			}
			alldays.sort();	//從小到大排序

			return alldays ;
		},

		/* 取得指定差異時間的日期 */
		dateDiff : function(orgDate, days) {
			var d = new Date();
			var timer = orgDate.getTime();
			var newTimer = timer + days * 24 * 60 * 60 * 1000;
			d.setTime(newTimer);

			return d;
		}
	};
})


app.factory('ServiceConstant', function ($location) {
	//var _host = "http://localhost:8880";
	var _host = "//" + $location.host() + ":" + $location.port();

	return {
		member : _host + "/member",
		attendance : _host + "/attendance",
		account : _host + "/account",
		update_member : _host + "/upload_member",
		set_active : _host + "/set_active",
		absence_record : _host + "/absence_reason"
	};
});

app.factory('OrgConstant', function () {
	
	return [
		{ name: '長定組', abbr :'長定', key: 'elder' },
		{ name: '慈助會', abbr :'慈助', key: 'relief' },
		{ name: '男青年', abbr :'男青', key: 'ym' },
		{ name: '女青年', abbr :'女青', key: 'yw' },
		{ name: '初級會', abbr :'初級', key: 'primary' }
	];
});


app.factory('Members', function ($http, ServiceConstant) {
	var _members=[];	
	var _dicMembers = {};	//a dictionary of members , the key is rec_no
	var _dicMembersById = {};	//a dictionary of members , the key is id.
	
	//各組織的成員
	var memElder = [];
	var memRelief = [];
	var memYM = [];
	var memYW = [];
	var memPrimary =[];

	var _isLoaded = false ;

	var _afterRefreshDataHandler ;

	return {
		getAll : function() {
			//var targetUrl = "http://7-dot-ward-helper.appspot.com/member";
			//var targetUrl = "http://localhost:8880/member";
			var targetUrl = ServiceConstant.member ;
			_isLoaded = false ;
			return $http.get(targetUrl);
		},

		setMembers : function(members) {
			_members = members ;
			_dicMembers = {};
			_dicMembersById = {};
			memElder = [];
			memRelief = [];
			memYM = [];
			memYW = [];
			memPrimary =[];

			angular.forEach(members, function(mem) {
				_dicMembers[mem.rec_no] = mem ;
				_dicMembers[mem.id] = mem;

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

			this.setIsLoaded(true) ;
			if (_afterRefreshDataHandler) {
				_afterRefreshDataHandler(members);
			}
		},

		getMembers : function() {
			return _members ;
		},

		getMemberByRecNo : function(rec_no) {
			return _dicMembers[rec_no];
		},

		getMemberById : function(id) {
			return _dicMembersById(id);
		},

		getElderMembers : function() {
			return memElder ;
		},
		getReliefMembers : function() {
			return memRelief ;
		},
		getYMMembers : function() {
			return memYM ;
		},
		getYWMembers : function() {
			return memYW;
		},
		getPrimaryMembers : function() {
			return memPrimary ;
		},

		getOrgMembers : function(org_key) {
			var result = [];
			switch(org_key) {
				case 'elder' :
					result = memElder;
					break;
				case 'relief' :
					result = memRelief;
					break;
				case 'ym' :
					result = memYM;
					break;
				case 'yw' :
					result = memYW;
					break;
				case 'primary' :
					result = memPrimary;
					break;
				default :
					result = _members;
			}

			return result ;
		},
		
		isLoaded : function() {
			return _isLoaded ;
		},

		setIsLoaded : function(isloaded) {
			_isLoaded = isloaded ;
		},

		setAfterRefreshDataHandler: function(handler) {
			_afterRefreshDataHandler = handler ;
		}



	};
});

