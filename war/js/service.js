
app.factory('Members', function ($http) {
	var _members=[];	

	var _isLoaded = false ;

	var _afterRefreshDataHandler ;

	return {
		getAll : function() {
			//var targetUrl = "http://7-dot-ward-helper.appspot.com/member";
			var targetUrl = "http://localhost:8880/member";
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
})