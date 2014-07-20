<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.google.appengine.api.users.User" %>
<%@ page import="com.google.appengine.api.users.UserService" %>
<%@ page import="com.google.appengine.api.users.UserServiceFactory" %>
<%
  UserService userService = UserServiceFactory.getUserService();
    User user = userService.getCurrentUser();
    if (user == null) {
      response.sendRedirect("/index.jsp");
    }

%>
<!DOCTYPE html>
<html ng-app="wardhelper">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">
    <title>領袖小幫手</title>

    <link href="lib/ionic/css/ionic.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">

    <!-- IF using Sass (run gulp sass first), then uncomment below and remove the CSS includes above
    <link href="css/ionic.app.css" rel="stylesheet">
    -->

    <!-- ionic/angularjs js -->
    <script src="lib/ionic/js/ionic.bundle.js"></script>

    <!-- cordova script (this will be a 404 during development) -->
   <!--  <script src="cordova.js"></script> -->

    <!-- your app's js -->
    <script src="js/app.js"></script>


  </head>
  <body>
  	<div class="card">
	  <div class="item item-text-wrap">
	    您不是合法的使用者，系統將於 <span id="theTime" style="margin: 4px 10px;"></span>秒後自動登出系統 !
	  </div>
	</div>
	<script>
		var count=5;

		document.getElementById("theTime").innerHTML = count ;

		var counter=setInterval(timer, 1000); //1000 will  run it every 1 second

		function timer()
		{
		  count=count-1;
		  document.getElementById("theTime").innerHTML = count ;
		  if (count <= 0)
		  {
		  	window.location='<%= userService.createLogoutURL("/index.jsp") %>';
		     // clearInterval(counter);
		     //counter ended, do something here
		     return;
		  }

		  //Do code for showing the number of seconds here
		}
	</script>
  </body>
</html>