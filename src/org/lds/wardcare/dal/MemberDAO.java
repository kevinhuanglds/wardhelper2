package org.lds.wardcare.dal;

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
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

public class MemberDAO {

	private static final String keyField = "rec_no";
	public static final String EntityName = "Member";	//the userid list who can use this application.
	public static final String REC_NO = "rec_no" ;
	public static final String NAME = "name";
	public static final String GENDER = "gender";
	public static final String TEL_H = "tel_h";
	public static final String ADDRESS = "address";
	public static final String AGE = "age"; 
	public static final String BIRTHDAY = "birthday";
	public static final String CONFIRM_DATE = "confirm_date" ;
	public static final String ISACTIVE = "is_active";
	public static final String IS_ENDOWMENT = "is_endowment";
	public static final String IS_RM = "is_rm";
	public static final String IS_SEALED = "is_sealed";
	public static final String PRISTHOOD = "pristhood";
	
	/**
	 * Get All the userid in the Account Storage.
	 * @return
	 */
	public static List<Entity> getAll() {
		List<String> result = new ArrayList<String>();
		DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
		Query q = new Query(MemberDAO.EntityName);
		List<Entity> ents = ds.prepare(q).asList(
				FetchOptions.Builder.withLimit(500));
		
		return ents ;
	}
	
	public static Entity getByRecNo(String rec_no) {
		Entity result = null ;
		Key k = KeyFactory.createKey(MemberDAO.EntityName, rec_no);
		DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
		
		try {
			result = ds.get(k);
		}
		catch (EntityNotFoundException ex) {
		}
		return result ;
	}
	
	/**
	 * Check if the userid existed in the Account Storage
	 * @param userID
	 * @return
	 */
	public static boolean isExised(String rec_no) {
		boolean result =  (getByRecNo(rec_no) != null) ;
		return result ;
	}
	
	/**
	 * Remove an userid from the Account Storages.
	 * @param userID
	 */
	public static void remove(String rec_no) {
		Key k = KeyFactory.createKey(MemberDAO.EntityName, rec_no);
		DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
		if (isExised(rec_no)) {
			ds.delete(k);
		}
	}
	
	/**
	 * Add an userid into the Account storages.
	 * @param userID 
	 */
	public static void put(String rec_no, String name, String gender, 
							String tel_h, String address , int age ,
							String birthday , String confirm_date,
							boolean is_active, boolean is_endowment, boolean is_rm , boolean is_sealed,
							String pristhood) {
		
		Entity ent = null ;
		if (! isExised(rec_no)) {
			ent = new Entity(MemberDAO.EntityName, rec_no);
		}
		else {
			ent = getByRecNo(rec_no);
		}
	    
	    UserService userService = UserServiceFactory.getUserService();
	    User user = userService.getCurrentUser();
	    ent.setProperty("author", user);
	    
	    Date date = new Date();
	    ent.setProperty("update_date", date);
	    
	    /*  rec_no,  name,  gender,  tel_h,  address ,  age ,
			birthday , confirm_date, is_active, is_endowment, is_rm , 
			 is_sealed, pristhood */
	    
	    ent.setProperty(keyField, rec_no);
	    ent.setProperty(NAME, name);
	    ent.setProperty(GENDER, gender);
	    ent.setProperty(TEL_H, tel_h);
	    ent.setProperty(ADDRESS, address);
	    ent.setProperty(AGE, age);
	    ent.setProperty(BIRTHDAY, birthday);
	    ent.setProperty(CONFIRM_DATE, confirm_date);
	    ent.setProperty(ISACTIVE, is_active);
	    ent.setProperty(IS_ENDOWMENT, is_endowment);
	    ent.setProperty(IS_RM, is_rm);
	    ent.setProperty(IS_SEALED, is_sealed);
	    ent.setProperty(PRISTHOOD, pristhood);
	    
	    
	    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
	    datastore.put(ent);
		
	}
}
