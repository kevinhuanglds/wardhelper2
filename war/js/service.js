

app.factory('Util', function () {
	

	return {
		formatDate : function(date) {
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var theDate = date.getDate();

			return year + "-" + (month < 10 ? ("0" + month) : month) + "-" + ((theDate < 10) ? ("0" + theDate) : theDate);
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
		set_active : _host + "/set_active"
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

