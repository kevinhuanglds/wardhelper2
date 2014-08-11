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
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

/**
 * 
 * @author kevinhuang
 * 
 */
public class AccountDAO {
	private static final String keyField = "userid";
	public static final String EntityName = "Account"; // the userid list who
														// can use this
														// application.

	/**
	 * Get All the userid in the Account Storage.
	 * 
	 * @return
	 */
	public static List<String> getAll() {
		List<String> result = new ArrayList<String>();
		DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
		Query q = new Query(AccountDAO.EntityName);
		List<Entity> ents = ds.prepare(q).asList(
				FetchOptions.Builder.withDefaults());
		for (Entity ent : ents) {
			// Object obj = ent.getProperty(keyField);
			result.add(ent.getProperty(keyField).toString());
		}
		return result;
	}

	public static boolean isValidUser() {
		boolean result = false;

		UserService userService = UserServiceFactory.getUserService();
		User user = userService.getCurrentUser();
		if (user != null) {
			String email = user.getEmail();
			if (email.equals("kevinhuang.lds@gmail.com")
					|| email.equals("test@example.com")
					|| email.equals("larryyang36@gmail.com")
					|| email.equals("nancyyu.lds@gmail.com")
					|| email.equals("shenbell@gmail.com")
					|| email.equals("anne.wu@ischool.com.tw")
					|| email.equals("lihping.li@gmail.com")
					|| email.equals("pennyjason123@gmail.com")
					|| email.equals("jackpeng16@gmail.com")
					|| email.equals("mailsailfish@gmail.com")
					|| email.equals("wu035233411@gmail.com")
			) {
				result = true;
			} else {
				result = AccountDAO.isExised(user.getEmail());
			}
		}
		return result;
	}

	public static boolean isAdmin() {
		boolean result = false;

		UserService userService = UserServiceFactory.getUserService();
		User user = userService.getCurrentUser();
		if (user != null) {
			String email = user.getEmail();
			if (email.equals("kevinhuang.lds@gmail.com")
					|| email.equals("test@example.com")
					|| email.equals("larryyang36@gmail.com")) {
				result = true;
			}
		}
		return result;
	}

	/**
	 * Check if the userid existed in the Account Storage
	 * 
	 * @param userID
	 * @return
	 */
	public static boolean isExised(String userID) {
		boolean result = false;

		Key k = KeyFactory.createKey(AccountDAO.EntityName, userID);
		DatastoreService ds = DatastoreServiceFactory.getDatastoreService();

		try {
			Entity ent = ds.get(k);
			result = true;
		} catch (EntityNotFoundException ex) {
		}
		return result;
	}

	/**
	 * Remove an userid from the Account Storages.
	 * 
	 * @param userID
	 */
	public static void remove(String userID) {
		Key k = KeyFactory.createKey(AccountDAO.EntityName, userID);
		DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
		if (isExised(userID))
			ds.delete(k);
	}

	/**
	 * Add an userid into the Account storages.
	 * 
	 * @param userID
	 */
	public static void put(String userID) {
		if (!isExised(userID)) {
			Entity greeting = new Entity(AccountDAO.EntityName, userID);
			greeting.setProperty(keyField, userID);

			UserService userService = UserServiceFactory.getUserService();
			User user = userService.getCurrentUser();
			greeting.setProperty("author", user);

			Date date = new Date();
			greeting.setProperty("date", date);

			DatastoreService datastore = DatastoreServiceFactory
					.getDatastoreService();
			datastore.put(greeting);
		}
	}
}
