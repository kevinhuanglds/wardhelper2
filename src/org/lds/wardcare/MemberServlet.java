package org.lds.wardcare;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.lds.wardcare.dal.MemberDAO;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.appengine.labs.repackaged.org.json.JSONArray;
import com.google.appengine.labs.repackaged.org.json.JSONException;
import com.google.appengine.labs.repackaged.org.json.JSONObject;

public class MemberServlet extends HttpServlet {

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {

		List<Entity> ents = MemberDAO.getAll();
//		DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
//		Query q = new Query("Member").addSort("name", SortDirection.DESCENDING);
//		List<Entity> ents = ds.prepare(q).asList(
//				FetchOptions.Builder.withLimit(10));

		try {
			JSONArray aryJson = Util.MembersToJsonArray(ents);
			Util.sendUTF8JSON(aryJson.toString(), resp);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			Util.sendErrorJson(e.getLocalizedMessage(), resp);
		}
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		if (req.getParameter("reset") != null) {
			resetMembers();
		}
	}
	
	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
		Query q = new Query("Member").addSort("name", SortDirection.DESCENDING);
		List<Entity> ents = ds.prepare(q).asList(
				FetchOptions.Builder.withLimit(10));
		
		if (ents.size() < 1) {	//若無紀錄，則先
			
		}
	}
	
	
	private void resetMembers() {
		MemberDAO.put("777777", "黃翰洋", "男", "03-1234567", "新竹市北大路22-3號", 10, "1991-01-01", "2000-01-01", true, true, false, true, "大祭司");
		MemberDAO.put("888888", "周志鴻", "男", "03-1234567", "新竹市北大路22-3號", 10, "1991-01-01", "2000-01-01", true, true, false, true, "大祭司");
		MemberDAO.put("111111", "黃俊傑", "男", "03-1234567", "新竹市北大路22-3號", 10, "1991-01-01", "2000-01-01", true, true, false, true, "大祭司");
		MemberDAO.put("222222", "尤懷玉", "女", "03-1234567", "新竹市北大路22-3號", 10, "1991-01-01", "2000-01-01", true, true, false, true, "大祭司");
		MemberDAO.put("333333", "周沈慧鈴", "女", "03-1234567", "新竹市北大路22-3號", 10, "1991-01-01", "2000-01-01", true, true, false, true, "大祭司");
		MemberDAO.put("444444", "黃翰博", "男", "03-1234567", "新竹市北大路22-3號", 10, "1991-01-01", "2000-01-01", true, true, false, true, "大祭司");
		MemberDAO.put("555555", "周語柔", "女", "03-1234567", "新竹市北大路22-3號", 10, "1991-01-01", "2000-01-01", true, true, false, true, "大祭司");
		MemberDAO.put("666666", "周語歆", "女", "03-1234567", "新竹市北大路22-3號", 10, "1991-01-01", "2000-01-01", true, true, false, true, "大祭司");
	}
}
