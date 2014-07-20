package org.lds.wardcare;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.lds.wardcare.dal.AccountDAO;
import org.lds.wardcare.dal.MemberDAO;

public class UploadMemberServlet extends HttpServlet {

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		if (!AccountDAO.isAdmin()) {
			Util.sendErrorJson("只有管理者才能使用此服務", resp);
		}
		else {
			String rec_no = req.getParameter("rec_no");
			String name = req.getParameter("name");
			String gender = req.getParameter("gender");
			String tel_h = req.getParameter("tel_h");
			String address = req.getParameter("address");
			int age = Integer.parseInt(req.getParameter("age"));
			String birthday = req.getParameter("birthday");
			String confirm_date = req.getParameter("confirm_date");
			boolean is_endowment = Boolean.parseBoolean(req.getParameter("is_endowment"));
			boolean is_rm = Boolean.parseBoolean(req.getParameter("is_rm"));
			boolean is_sealed = Boolean.parseBoolean(req.getParameter("is_sealed"));
			String pristhood = req.getParameter("pristhood");
			boolean is_active = true;
			
			MemberDAO.put(rec_no, name, gender, tel_h, address, age, birthday, confirm_date, 
							is_active, is_endowment, is_rm, is_sealed, pristhood);
		}
		
	}
}
