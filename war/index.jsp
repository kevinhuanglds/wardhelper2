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
    else {
%>

	<p>Hello!
    	<a href="<%= userService.createLoginURL(request.getRequestURI()) %>">Sign in</a>to include your name with greetings you post.</p>
<%
    }
%>