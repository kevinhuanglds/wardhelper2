package org.lds.wardcare;

import java.io.IOException;
import java.text.ParseException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.lds.wardcare.dal.AbsenceReasonDAO;

import com.google.appengine.api.datastore.Entity;
import com.google.appengine.labs.repackaged.org.json.JSONArray;
import com.google.appengine.labs.repackaged.org.json.JSONObject;

public class AbsenceServlet extends HttpServlet {

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		String date = req.getParameter("date");
		try {
			List<Entity> abs = AbsenceReasonDAO.getByDate(date);
			JSONArray ary = Util.AbsenceToJsonArray(abs);
			Util.sendUTF8JSON(ary.toString(), resp);
			//Gson gson = new Gson();
			//String json = gson.toJson(atts);
			//Util.sendUTF8JSON(json, resp);
		} catch (Exception e) {
			e.printStackTrace();
			Util.sendErrorJson(e.getLocalizedMessage(), resp);
		}
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		String mode= req.getParameter("mode");
		String date = req.getParameter("date");
		String rec_no = req.getParameter("rec_no");
		String meeting = req.getParameter("meeting");
		String reason = req.getParameter("reason");
		
		
		try {
			Entity ent = AbsenceReasonDAO.Put(date, meeting, mode, rec_no, reason);
			JSONObject objJson = Util.AbsenceToJsonObject(ent);
			Util.sendUTF8JSON(objJson.toString(), resp);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
