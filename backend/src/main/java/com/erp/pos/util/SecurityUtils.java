package com.erp.pos.util;

import com.erp.pos.model.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

/**
 * Utility class for Spring Security.
 */
public class SecurityUtils {

    /**
     * Get the current authenticated user's username
     * 
     * @return the username of the current authenticated user, or null if not authenticated
     */
    public static String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        
        Object principal = authentication.getPrincipal();
        
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        }
        
        return principal.toString();
    }
    
    /**
     * Create a simplified User object for the current authenticated user
     * 
     * @return a User object with username and a default ID
     */
    public static User getCurrentUser() {
        String username = getCurrentUsername();
        
        if (username == null) {
            return null;
        }
        
        User user = new User();
        user.setUsername(username);
        user.setId(1L); // This is a simplification - in a real app, you'd look up the user ID
        
        return user;
    }
}
