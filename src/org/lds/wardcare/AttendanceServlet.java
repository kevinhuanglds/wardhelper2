package org.lds.wardcare;

import java.io.IOException;
import java.text.ParseException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.lds.wardcare.dal.AttendanceDAO;

import com.google.appengine.api.datastore.Entity;
import com.google.appengine.labs.repackaged.org.json.JSONArray;
import com.google.appengine.labs.repackaged.org.json.JSONException;
import com.google.gson.Gson;

public class AttendanceServlet extends HttpServlet {

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		String date = req.getParameter("date");
		try {
			List<Entity> atts = AttendanceDAO.getByDate(date);
//			List<Entity> atts = AttendanceDAO.getAll();
			JSONArray ary = Util.AttendanceToJsonArray(atts);
			Util.sendUTF8JSON(ary.toString(), resp);
			//Gson gson = new Gson();
			//String json = gson.toJson(atts);
			//Util.sendUTF8JSON(json, resp);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			Util.sendErrorJson(e.getLocalizedMessage(), resp);
		}
	}
	
	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		String mode= req.getParameter("mode");
		String date = req.getParameter("date");
		String rec_no = req.getParameter("rec_no");
		String meeting = req.getParameter("meeting");
		
		try {
			AttendanceDAO.Put(date, meeting, mode, rec_no);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
