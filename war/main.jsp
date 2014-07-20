<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.google.appengine.api.users.User" %>
<%@ page import="com.google.appengine.api.users.UserService" %>
<%@ page import="com.google.appengine.api.users.UserServiceFactory" %>
<%@ page import="java.util.List" %>
<%@ page import="org.lds.wardcare.dal.AccountDAO" %>
<%
  UserService userService = UserServiceFactory.getUserService();
    User user = userService.getCurrentUser();
    if (user == null) {
      response.sendRedirect("/index.jsp");
    }

    if (!AccountDAO.isValidUser()) {
      response.sendRedirect("/invalidUser.jsp");
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
    <script src="js/controller.js"></script>
    <script src="js/service.js"></script>
    <script src="js/directive.js"></script>

  </head>
  <body ng-controller="MainCtrl" >
    <ion-side-menus>
      <!-- content here  -->
      <ion-side-menu-content>
        <ion-nav-view></ion-nav-view>
      </ion-side-menu-content>

      <!-- menu on left side -->
      <ion-side-menu side="left">
        <ion-header-bar class="bar-royal">
          <h1 class="title" style="font-size:1.5em;font-weight:bold;">功      能</h1>
        </ion-header-bar>
        <ion-content>
          <div class="list">
            <a class="item item-icon-left" style="color:green;" ui-sref="rollcall"  ng-click="toggleLeft();">
              <i class="icon ion-android-social" ></i>
              點名
            </a>

            <a class="item item-icon-left"  ui-sref="statistics" ng-click="toggleLeft();">
              <i class="icon ion-stats-bars"></i>
              出席狀況
            </a>

            <a class="item item-icon-left" ui-sref="info"  ng-click="toggleLeft();">
              <i class="icon ion-android-contact"></i>
              查詢資訊
              <span class="item-note">
                Grammy
              </span>
            </a>
            <a class="item item-icon-left" ui-sref="import"  ng-click="toggleLeft();">
              <i class="icon ion-ios7-people"></i>
              匯入資料
              <span class="item-note">
                
              </span>
            </a>
            <a class="item item-icon-left" ui-sref="setActive"  ng-click="toggleLeft();">
              <i class="icon ion-ios7-sunny"></i>
              設定活躍狀況
              <span class="item-note">
                
              </span>
            </a>
          </div>
        </ion-content>
        <ion-footer-bar class="bar-dark">
          <button  class="button button-clear " style="color:white; margin-left:4px;">
            <i class="ion-flame"></i>
            <%= user.getEmail() %>
          </button>
          <a class="button button-icon ion-power" href="<%= userService.createLogoutURL("/index.jsp") %>" ></a>
        </ion-footer-bar>
      </ion-side-menu>
  </ion-side-menus>
  </body>
</html>
