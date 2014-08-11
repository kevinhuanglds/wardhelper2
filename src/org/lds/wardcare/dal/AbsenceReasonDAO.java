/**
 * 紀錄安息日未出席原因
 */
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

public class AbsenceReasonDAO {

	public static final String EntityName = "Absence";	
	public static final String ABS_DATE = "abs_date" ;
	public static final String CREATED = "created";
	public static final String MEETING = "meeting";
	public static final String MEMBER = "member";
	public static final String REASON = "reason";
	
	/**
	 * Get All the userid in the Account Storage.
	 * @return
	 */
	public static List<Entity> getAll() {
		List<String> result = new ArrayList<String>();
		DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
		Query q = new Query(AbsenceReasonDAO.EntityName);
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
		Query q = new Query(AbsenceReasonDAO.EntityName);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date dt = sdf.parse(date);
		Filter attDateFilter =
				  new FilterPredicate(AbsenceReasonDAO.ABS_DATE ,
				                      FilterOperator.EQUAL,
				                      dt);
		q.setFilter(attDateFilter);
		List<Entity> ents = ds.prepare(q).asList(
				FetchOptions.Builder.withLimit(500));
		
		return ents ;
	}
	
	
	public static Entity Put(String date, String meeting, String mode, String rec_no, String reason) throws ParseException {
		String keyValue = rec_no + "_" + date + "_" + meeting ;
		Key key = KeyFactory.createKey(AbsenceReasonDAO.EntityName, keyValue);
		DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
		Entity entAttendance =null;
		try {
			entAttendance = ds.get(key);
		}
		catch (EntityNotFoundException ex) {
		}	
		
		if (mode.equals("delete")) {
			if (entAttendance != null)
				ds.delete(key);
		}
		else {
//			Entity ent = entAttendance ;
			if (entAttendance == null) {
				entAttendance = new Entity(key);
			}
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			Date dt = sdf.parse(date);
			entAttendance.setProperty(AbsenceReasonDAO.ABS_DATE, dt);
			
			entAttendance.setProperty(AbsenceReasonDAO.CREATED, new Date());
			
			Entity entMember = MemberDAO.getByRecNo(rec_no);
			entAttendance.setProperty(AbsenceReasonDAO.MEMBER, entMember.getKey());
			entAttendance.setProperty(AbsenceReasonDAO.MEETING , meeting);
			entAttendance.setProperty(AbsenceReasonDAO.REASON , reason);
			ds.put(entAttendance);
		}
		
		return entAttendance ;
	}
	
	
}
