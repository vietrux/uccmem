"use client";

import { UserInfo } from "@/lib/userinfo";
import { useState } from "react";
import Image from "next/image";

interface UserCardProps {
  user: UserInfo;
}

export default function UserCard({ user }: UserCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div 
      className={`relative bg-white rounded-md p-4 border-3 border-black 
                 ${isHovered ? 'translate-x-1 translate-y-1' : 'translate-x-2 translate-y-2'} 
                 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.9)] 
                 transition-all duration-200 w-full max-w-xs`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        {/* Avatar Section */}
        <div className="w-16 h-16 bg-gray-100 border-2 border-black rounded-md overflow-hidden flex items-center justify-center">
          {user.thumbnailUrl ? (
            <Image 
              src={user.thumbnailUrl} 
              alt={user.displayName}
              width={64}
              height={64}
              className="object-cover"
            />
          ) : (
            <span className="text-2xl font-bold">{getInitials(user.displayName)}</span>
          )}
        </div>
        
        {/* Content Section */}
        <div className="flex flex-col flex-1">
          <h3 className="font-bold text-lg text-black truncate">{user.displayName}</h3>
          <div className="bg-gray-200 text-black px-2 py-0.5 rounded-sm text-xs inline-block w-fit mb-1">
            {user.job_title}
          </div>
          <p className="text-black/70 text-xs truncate">{user.email}</p>
        </div>
      </div>
      
      {/* About Me Section - Shown if available */}
      {user.aboutMe && (
        <div className="mt-3 p-2 bg-gray-100 border-2 border-black rounded">
          <p className="text-xs text-black line-clamp-2">{user.aboutMe}</p>
        </div>
      )}
      
      {/* ID Badge */}
      <div className="absolute -top-2 -right-2 bg-gray-200 border-2 border-black rounded-full px-2 py-1 text-[10px] font-mono">
        ID: {user.uid}
      </div>
    </div>
  );
}
