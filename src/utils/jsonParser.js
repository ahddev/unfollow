/**
 * Utility functions for parsing and normalizing JSON input
 * Supports multiple formats including Instagram export format
 */

/**
 * Extracts username from Instagram URL
 * @param {string} href - Instagram URL
 * @returns {string|null} - Username or null
 */
function extractUsernameFromUrl(href) {
  if (!href || typeof href !== 'string') return null;
  
  // Match patterns like:
  // https://www.instagram.com/username
  // https://www.instagram.com/_u/username
  const match = href.match(/instagram\.com(?:\/_u)?\/([^\/\?]+)/);
  return match ? match[1] : null;
}

/**
 * Extracts username from an Instagram item object
 * @param {any} item - Instagram item object
 * @returns {string|null} - Username or null
 */
function extractUsernameFromItem(item) {
  if (!item || typeof item !== 'object') return null;

  // Priority 1: Check title field (used in following format)
  if (item.title && typeof item.title === 'string' && item.title.trim()) {
    return item.title.trim();
  }

  // Priority 2: Check string_list_data for value field
  if (item.string_list_data && Array.isArray(item.string_list_data)) {
    for (const entry of item.string_list_data) {
      // Check value field first
      if (entry?.value && typeof entry.value === 'string') {
        return entry.value.trim();
      }
      // Fallback: extract from href URL
      if (entry?.href && typeof entry.href === 'string') {
        const username = extractUsernameFromUrl(entry.href);
        if (username) return username;
      }
    }
  }

  return null;
}

/**
 * Detects and parses Instagram JSON structure
 * @param {any} data - The parsed JSON data
 * @returns {string[]|null} - Array of usernames or null if not Instagram format
 */
export function parseInstagramFormat(data) {
  // Check for Instagram followers format
  if (data?.relationships_followers && Array.isArray(data.relationships_followers)) {
    const usernames = [];
    for (const item of data.relationships_followers) {
      const username = extractUsernameFromItem(item);
      if (username) {
        usernames.push(username);
      }
    }
    return usernames.length > 0 ? usernames : null;
  }

  // Check for Instagram following format
  if (data?.relationships_following && Array.isArray(data.relationships_following)) {
    const usernames = [];
    for (const item of data.relationships_following) {
      const username = extractUsernameFromItem(item);
      if (username) {
        usernames.push(username);
      }
    }
    return usernames.length > 0 ? usernames : null;
  }

  return null;
}

/**
 * Normalizes various JSON formats into a simple array of usernames
 * @param {string} jsonString - The JSON string input
 * @returns {{success: boolean, data: string[]|null, error: string|null}}
 */
export function normalizeJsonInput(jsonString) {
  if (!jsonString || jsonString.trim() === '') {
    return { success: false, data: null, error: 'JSON input is empty ⚠️' };
  }

  try {
    const parsed = JSON.parse(jsonString);

    // Try Instagram format first
    const instagramResult = parseInstagramFormat(parsed);
    if (instagramResult) {
      return { success: true, data: instagramResult, error: null };
    }

    // Handle simple array format: ["user1", "user2"]
    if (Array.isArray(parsed)) {
      const usernames = [];
      
      for (const item of parsed) {
        // Handle string items: "user1"
        if (typeof item === 'string') {
          usernames.push(item);
          continue;
        }
        
        // Handle Instagram array format: 
        // [{ "title": "user1", "string_list_data": [...] }]
        // or [{ "string_list_data": [{ "value": "user1" }] }]
        if (typeof item === 'object' && item !== null) {
          // Try to extract username using Instagram format logic
          const username = extractUsernameFromItem(item);
          if (username) {
            usernames.push(username);
            continue;
          }
          
          // Handle simple object array: [{ "username": "user1" }]
          const simpleUsername = item.username || item.name || item.value;
          if (simpleUsername && typeof simpleUsername === 'string') {
            usernames.push(simpleUsername);
          }
        }
      }

      if (usernames.length === 0) {
        return { success: false, data: null, error: 'No valid usernames found in array 😅' };
      }

      return { success: true, data: usernames, error: null };
    }

    return { success: false, data: null, error: 'Unsupported JSON format. Expected array or Instagram export format 😅' };
  } catch (error) {
    return { success: false, data: null, error: `Invalid JSON: ${error.message} ⚠️` };
  }
}

/**
 * Compares two arrays and returns items in first array that are not in second array
 * @param {string[]} following - Array of users you follow
 * @param {string[]} followers - Array of users who follow you
 * @returns {string[]} - Users you follow who don't follow you back
 */
export function findNonFollowers(following, followers) {
  const followersSet = new Set(followers.map(u => u.toLowerCase().trim()));
  return following.filter(user => !followersSet.has(user.toLowerCase().trim()));
}

