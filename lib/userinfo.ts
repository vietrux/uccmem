import md5 from "md5";

export interface UserInfo {
  uid: string;
  displayName: string;
  email: string;
  job_title: string;
  aboutMe?: string;
  thumbnailUrl?: string;
}

// In-memory cache for users data
let usersCache: UserInfo[] | null = null;
let usersCacheTime: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

// In-memory cache for Gravatar info (server-side only)
const gravatarCache = new Map<string, { aboutMe: string; thumbnailUrl: string; timestamp: number }>();
const GRAVATAR_CACHE_TTL = 60 * 60 * 1000; // 1 hour cache

// Fetch all users from local JSON file
export async function getAllUserFromLocal(): Promise<UserInfo[]> {
  try {
    // Return from cache if it's still valid
    const now = Date.now();
    if (usersCache && (now - usersCacheTime < CACHE_TTL)) {
      return usersCache;
    }

    // Different approach based on environment
    if (typeof window === 'undefined') {
      // Server-side: dynamically import fs and path
      try {
        // Dynamic imports to avoid browser compatibility issues
        const fs = await import('fs/promises').then(module => module.default || module);
        const path = await import('path').then(module => module.default || module);
        
        const filePath = path.join(process.cwd(), 'public', 'users.json');
        const jsonData = await fs.readFile(filePath, 'utf8');
        const users = JSON.parse(jsonData);
        
        // Update cache
        usersCache = users;
        usersCacheTime = now;
        return users;
      } catch (serverError) {
        console.error("Server-side file reading error:", serverError);
        // Fall back to fetch API even on server if file reading fails
        const response = await fetch(new URL('/users.json', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const users = await response.json();
        usersCache = users;
        usersCacheTime = now;
        return users;
      }
    } else {
      // Client-side: fetch via HTTP
      const response = await fetch('/users.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const users = await response.json();
      
      // Update cache
      usersCache = users;
      usersCacheTime = now;
      return users;
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    // Return cached data if available, even if expired
    return usersCache || [];
  }
}

// Server-side function to get user info from Gravatar
// This should only be called from server components or server actions
export async function getGravatarInfo(email: string): Promise<{ aboutMe: string; thumbnailUrl: string }> {
  if (typeof window !== 'undefined') {
    console.warn('Attempted to call getGravatarInfo from client-side. This should only be used server-side.');
    return { aboutMe: "", thumbnailUrl: "" };
  }

  if (!email) {
    return { aboutMe: "", thumbnailUrl: "" };
  }
  
  try {
    const emailHash = md5(email.trim().toLowerCase());
    const now = Date.now();
    
    // Check cache first
    const cached = gravatarCache.get(emailHash);
    if (cached && (now - cached.timestamp < GRAVATAR_CACHE_TTL)) {
      return cached;
    }
    
    // If not in cache or expired, fetch from API with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
    const url = `https://www.gravatar.com/${emailHash}.json`;
    const response = await fetch(url, { 
      signal: controller.signal,
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const aboutMe = data.entry?.[0]?.aboutMe || "";
    const thumbnailUrl = data.entry?.[0]?.thumbnailUrl || "";
    
    // Update cache
    const result = { aboutMe, thumbnailUrl, timestamp: now };
    gravatarCache.set(emailHash, result);
    
    return result;
  } catch (error) {
    // If request was aborted due to timeout or other issues
    if (error.name === 'AbortError') {
      console.error("Gravatar request timed out for email:", email);
    } else {
      console.error("Error fetching user info from Gravatar:", error);
    }
    
    // Check for expired cached data as fallback
    const emailHash = md5(email.trim().toLowerCase());
    const cached = gravatarCache.get(emailHash);
    if (cached) {
      return cached;
    }
    
    return { aboutMe: "", thumbnailUrl: "" };
  }
}

// Client-side function is now a simple placeholder that warns users
// This will be replaced by server actions or API routes
export const getUserInfo = async (email: string) => {
  console.warn('getUserInfo should not be called directly from client components. Use server actions instead.');
  return { aboutMe: "", thumbnailUrl: "" };
};

// Get one user by ID with optimized lookup - for client-side use
export async function getOneUserInfo(userId: string): Promise<UserInfo | null> {
  if (!userId) return null;
  
  try {
    const users = await getAllUserFromLocal();
    const user = users.find((user) => user.uid === userId);
    return user || null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

