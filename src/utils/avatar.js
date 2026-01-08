/**
 * Utility functions for fetching Instagram avatars
 * Uses caching and multiple fallback methods for best performance
 */

const AVATAR_CACHE_KEY = 'unfollow_app_avatar_cache';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Get cached avatar URL
 */
function getCachedAvatar(username) {
  try {
    const cache = JSON.parse(localStorage.getItem(AVATAR_CACHE_KEY) || '{}');
    const cached = cache[username];
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.url;
    }
    
    // Remove expired entry
    if (cached) {
      delete cache[username];
      localStorage.setItem(AVATAR_CACHE_KEY, JSON.stringify(cache));
    }
    
    return null;
  } catch (error) {
    console.error('Failed to get cached avatar:', error);
    return null;
  }
}

/**
 * Cache avatar URL
 */
function cacheAvatar(username, url) {
  try {
    const cache = JSON.parse(localStorage.getItem(AVATAR_CACHE_KEY) || '{}');
    cache[username] = {
      url,
      timestamp: Date.now(),
    };
    localStorage.setItem(AVATAR_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Failed to cache avatar:', error);
  }
}

/**
 * Fetch Instagram avatar using multiple methods
 * Uses CORS proxy and direct CDN URLs for best performance
 */
export async function fetchInstagramAvatar(username) {
  // Check cache first
  const cached = getCachedAvatar(username);
  if (cached) {
    return cached;
  }

  // Method 1: Try using a CORS proxy with Instagram's profile page
  const proxies = [
    `https://api.allorigins.win/get?url=${encodeURIComponent(`https://www.instagram.com/${username}/`)}`,
    `https://corsproxy.io/?${encodeURIComponent(`https://www.instagram.com/${username}/`)}`,
  ];

  for (const proxyUrl of proxies) {
    try {
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const html = data.contents || data;
        
        if (typeof html === 'string') {
          // Try to extract profile picture from meta tags (most reliable)
          const metaMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
                             html.match(/<meta\s+name=["']og:image["']\s+content=["']([^"']+)["']/i) ||
                             html.match(/property=["']og:image["']\s+content=["']([^"']+)["']/i);
          
          if (metaMatch && metaMatch[1]) {
            let avatarUrl = metaMatch[1];
            // Optimize image size for faster loading - use smaller dimensions
            // Instagram CDN URLs often have size parameters like s150x150, s320x320, etc.
            avatarUrl = avatarUrl.replace(/s\d{3,4}x\d{3,4}/, 's150x150');
            // If no size parameter, try to add one or use the URL as-is
            if (!avatarUrl.includes('s150x150') && avatarUrl.includes('scontent')) {
              // Try to insert size parameter before query string
              avatarUrl = avatarUrl.replace(/(scontent[^/]+)\/([^?]+)/, '$1/s150x150/$2');
            }
            cacheAvatar(username, avatarUrl);
            return avatarUrl;
          }

          // Try to find profile picture in JSON-LD or script tags
          const jsonLdMatch = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/is);
          if (jsonLdMatch) {
            try {
              const jsonData = JSON.parse(jsonLdMatch[1]);
              if (jsonData.image || jsonData?.author?.image) {
                let imgUrl = jsonData.image || jsonData.author.image;
                // Optimize size
                imgUrl = imgUrl.replace(/s\d{3,4}x\d{3,4}/, 's150x150');
                cacheAvatar(username, imgUrl);
                return imgUrl;
              }
            } catch (e) {
              // Ignore JSON parse errors
            }
          }

          // Try to extract from Instagram's internal JSON data
          const jsonDataMatch = html.match(/window\._sharedData\s*=\s*({.+?});/);
          if (jsonDataMatch) {
            try {
              const sharedData = JSON.parse(jsonDataMatch[1]);
              const profilePic = sharedData?.entry_data?.ProfilePage?.[0]?.graphql?.user?.profile_pic_url_hd ||
                                 sharedData?.entry_data?.ProfilePage?.[0]?.graphql?.user?.profile_pic_url;
              if (profilePic) {
                let picUrl = profilePic;
                picUrl = picUrl.replace(/s\d{3,4}x\d{3,4}/, 's150x150');
                cacheAvatar(username, picUrl);
                return picUrl;
              }
            } catch (e) {
              // Ignore JSON parse errors
            }
          }
        }
      }
    } catch (error) {
      // Try next proxy
      continue;
    }
  }

  // Method 2: Return null - component will show default icon
  return null;
}

/**
 * Get avatar URL with caching
 * Returns cached URL immediately if available, otherwise fetches
 */
export async function getAvatarUrl(username) {
  // Check cache first
  const cached = getCachedAvatar(username);
  if (cached) {
    return cached;
  }

  // Fetch and cache
  const url = await fetchInstagramAvatar(username);
  if (url) {
    cacheAvatar(username, url);
  }
  
  return url;
}
