<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.google.appengine.api.users.User" %>
<%@ page import="com.google.appengine.api.users.UserService" %>
<%@ page import="com.google.appengine.api.users.UserServiceFactory" %>
<%@ page import="java.util.List" %>
<%
	UserService userService = UserServiceFactory.getUserService();
    User user = userService.getCurrentUser();
    if (user != null) {
    	response.sendRedirect("/main.jsp");
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
  	  <div class="item item-divider">
	    新竹第一支會，領袖小幫手系統
	  </div>
	  <div class="item item-text-wrap" >

	    <a class="button button-balanced" href="<%= userService.createLoginURL(request.getRequestURI()) %>" style="margin-left:auto; margin-right:auto;">按這裡登入系統</a>
	  </div>
	</div>
  </body>
</html>