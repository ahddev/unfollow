/**
 * Utility functions for localStorage persistence
 */

const STORAGE_KEYS = {
  FOLLOWERS: 'unfollow_app_followers',
  FOLLOWING: 'unfollow_app_following',
  RESULTS: 'unfollow_app_results',
};

/**
 * Save followers JSON to localStorage
 */
export function saveFollowers(followersJson) {
  try {
    localStorage.setItem(STORAGE_KEYS.FOLLOWERS, followersJson);
  } catch (error) {
    console.error('Failed to save followers:', error);
  }
}

/**
 * Save following JSON to localStorage
 */
export function saveFollowing(followingJson) {
  try {
    localStorage.setItem(STORAGE_KEYS.FOLLOWING, followingJson);
  } catch (error) {
    console.error('Failed to save following:', error);
  }
}

/**
 * Save results to localStorage
 */
export function saveResults(results) {
  try {
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));
  } catch (error) {
    console.error('Failed to save results:', error);
  }
}

/**
 * Load followers JSON from localStorage
 */
export function loadFollowers() {
  try {
    return localStorage.getItem(STORAGE_KEYS.FOLLOWERS) || '';
  } catch (error) {
    console.error('Failed to load followers:', error);
    return '';
  }
}

/**
 * Load following JSON from localStorage
 */
export function loadFollowing() {
  try {
    return localStorage.getItem(STORAGE_KEYS.FOLLOWING) || '';
  } catch (error) {
    console.error('Failed to load following:', error);
    return '';
  }
}

/**
 * Load results from localStorage
 */
export function loadResults() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RESULTS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load results:', error);
    return [];
  }
}

