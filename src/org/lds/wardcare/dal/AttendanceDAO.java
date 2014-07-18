package org.lds.wardcare.dal;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;

/**
 * 一筆出席紀錄
 * @author kevinhuang
 *
 */
public class AttendanceDAO {

	public static final String EntityName = "Attendance";	//the userid list who can use this application.
	public static final String ATT_DATE = "att_date" ;
	public static final String CREATED = "created";
	public static final String MEETING = "meeting";
	public static final String MEMBER = "member";
	
	/**
	 * Get All the userid in the Account Storage.
	 * @return
	 */
	public static List<Entity> getAll() {
		List<String> result = new ArrayList<String>();
		DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
		Query q = new Query(AttendanceDAO.EntityName);
		List<Entity> ents = ds.prepare(q).asList(
				FetchOptions.Builder.withLimit(1000));
		
		return ents ;
	}
	
	/**
	 * Get All the userid in the Account Storage.
	 * @return
	 * @throws ParseException 
	 */
	public static List<Entity> getByDate(String date) throws ParseException {
		List<String> result = new ArrayList<String>();
		DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
		Query q = new Query(AttendanceDAO.EntityName);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date dt = sdf.parse(date);
		Filter attDateFilter =
				  new FilterPredicate("att_date",
				                      FilterOperator.EQUAL,
				                      dt);
		q.setFilter(attDateFilter);
		List<Entity> ents = ds.prepare(q).asList(
				FetchOptions.Builder.withLimit(500));
		
		return ents ;
	}
	
	
	public static void Put(String date, String meeting, String mode, String rec_no) throws ParseException {
		String keyValue = rec_no + "_" + date + "_" + meeting ;
		Key key = KeyFactory.createKey(AttendanceDAO.EntityName, keyValue);
		DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
		try {
			Entity entAttendance = ds.get(key);
			if (mode.equals("delete")) {
				ds.delete(key);
			}
		}
		catch (EntityNotFoundException ex) {
			if (mode.equals("add")) {
				Entity ent = new Entity(key);
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
				Date dt = sdf.parse(date);
				ent.setProperty("att_date", dt);
				
				ent.setProperty("created", new Date());
				
				Entity entMember = MemberDAO.getByRecNo(rec_no);
				ent.setProperty("member", entMember.getKey());
				ent.setProperty("meeting", meeting);
				ds.put(ent);
			}
		}	
	}
	
}
