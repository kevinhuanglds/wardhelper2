package org.lds.wardcare;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.lds.wardcare.dal.AccountDAO;
import org.lds.wardcare.dal.MemberDAO;

import com.google.gson.Gson;

public class AccountServlet extends HttpServlet {
	
	private static final String userID = "userID";

	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
	}
	
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) 
			throws ServletException ,IOException {
		String userID = req.getParameter(AccountServlet.userID);
		AccountDAO.put(userID);
	};
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		Gson gson = new Gson(); // Or use new GsonBuilder().create();
		List<String> accounts = AccountDAO.getAll();
		String json = gson.toJson(accounts); // serializes target to Json
		Util.sendUTF8JSON(json, resp, true);
	}
	
	/**
	 * 刪除可使用的帳號
	 */
	@Override
	protected void doDelete(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		String userID = req.getParameter(AccountServlet.userID);
		AccountDAO.remove(userID);
		Util.sendUTF8JSON("{'msg' : 'OK' }", resp, true);
	}

	
}
