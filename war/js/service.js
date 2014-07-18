

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


app.factory('ServiceConstant', function () {
	_host = "http://localhost:8880";

	return {
		member : _host + "/member",
		attendance : _host + "/attendance",
		account : _host + "/account"
	};
});


app.factory('Members', function ($http, ServiceConstant) {
	var _members=[];	

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
			this.setIsLoaded(true) ;
			if (_afterRefreshDataHandler) {
				_afterRefreshDataHandler(members);
			}
		},

		getMembers : function() {
			return _members ;
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

