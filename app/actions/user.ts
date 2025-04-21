'use server';

import { getAllUserFromLocal, getGravatarInfo, UserInfo } from "@/lib/userinfo";

// Server action to get full user information including Gravatar data
export async function getFullUserInfo(userId: string): Promise<UserInfo | null> {
  if (!userId) return null;
  
  try {
    const users = await getAllUserFromLocal();
    const user = users.find((user) => user.uid === userId);
    
    if (!user) return null;
    
    // If user has a valid email, enrich with Gravatar data
    if (user.email) {
      try {
        const { aboutMe, thumbnailUrl } = await getGravatarInfo(user.email);
        return { 
          ...user, 
          aboutMe: aboutMe || user.aboutMe || "", 
          thumbnailUrl: thumbnailUrl || user.thumbnailUrl || "" 
        };
      } catch (error) {
        console.error("Error fetching Gravatar info:", error);
        // If Gravatar fetch fails, still return the user without that data
        return user;
      }
    }
    
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}
