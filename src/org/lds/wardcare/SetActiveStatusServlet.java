package org.lds.wardcare;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.lds.wardcare.dal.AccountDAO;
import org.lds.wardcare.dal.MemberDAO;

public class SetActiveStatusServlet extends HttpServlet {

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		if (!AccountDAO.isAdmin()) {
			Util.sendErrorJson("只有管理者才能使用此服務", resp);
		}
		else {
			String rec_no = req.getParameter("rec_no");
			boolean is_active = Boolean.parseBoolean(req.getParameter("is_active"));;
			
			MemberDAO.setActive(rec_no, is_active);
		}
	}
}
