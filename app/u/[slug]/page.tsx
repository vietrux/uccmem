'use client';

import { useEffect, useState } from "react";
import { getOneUserInfo, UserInfo } from "@/lib/userinfo";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function UserProfile() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const params = useParams();
  const userId = params.slug as string;

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const userData = await getOneUserInfo(userId);
        
        if (!userData) {
          setNotFound(true);
        } else {
          setUser(userData);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gray-100 flex items-center justify-center">
        <div className="bg-white border-4 border-black p-6 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0,0.9)]">
          <p className="text-xl font-bold">Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen p-8 bg-gray-100 flex flex-col items-center justify-center">
        <div className="bg-white border-4 border-black p-6 rounded-md shadow-[8px_8px_0px_0px_rgba(0,0,0,0.9)] w-full max-w-md text-center">
          <h1 className="text-3xl font-bold mb-4">User Not Found</h1>
          <p className="mb-6">We couldn't find a user with ID: {userId}</p>
          <Link href="/" className="inline-block bg-black text-white px-6 py-3 rounded-md border-2 border-black font-bold hover:bg-white hover:text-black transition-colors">
            Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link 
          href="/"
          className="inline-flex items-center mb-8 bg-white border-2 border-black px-4 py-2 rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,0.9)] translate-x-1 translate-y-1 hover:translate-x-0 hover:translate-y-0 transition-all font-medium"
        >
          ← Back to Directory
        </Link>

        {/* Profile header */}
        <div className="bg-white border-4 border-black rounded-md p-6 mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.9)]">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="w-32 h-32 bg-gray-100 border-3 border-black rounded-md overflow-hidden flex items-center justify-center">
              {user?.thumbnailUrl ? (
                <Image 
                  src={user.thumbnailUrl} 
                  alt={user.displayName}
                  width={128}
                  height={128}
                  className="object-cover"
                />
              ) : (
                <span className="text-4xl font-bold">{user ? getInitials(user.displayName) : 'NA'}</span>
              )}
            </div>
            
            {/* User basic info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-black">{user?.displayName}</h1>
              <div className="bg-black text-white px-4 py-1 rounded-sm text-sm inline-block my-2 font-medium">
                {user?.job_title}
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v12H2V10l10-6 10 6Z"></path>
                  <path d="M6 12v.01"></path>
                  <path d="M10 12v.01"></path>
                  <path d="M14 12v.01"></path>
                  <path d="M18 12v.01"></path>
                </svg>
                <p className="font-medium">{user?.email || 'Email not available'}</p>
              </div>
              <div className="inline-block border-2 border-black rounded-full px-3 py-1 text-xs font-mono mt-2">
                ID: {user?.uid}
              </div>
            </div>
          </div>
        </div>
        
        {/* About me section */}
        <div className="bg-white border-4 border-black rounded-md shadow-[8px_8px_0px_0px_rgba(0,0,0,0.9)] overflow-hidden mb-6">
          <div className="border-b-4 border-black px-6 py-3 bg-gray-100">
            <h2 className="text-xl font-bold">About Me</h2>
          </div>
          <div className="p-6">
            {user?.aboutMe ? (
              <p className="whitespace-pre-line">{user.aboutMe}</p>
            ) : (
              <p className="text-gray-500 italic">No bio information available</p>
            )}
          </div>
        </div>
        
        {/* Additional info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact info */}
          <div className="bg-white border-4 border-black rounded-md shadow-[8px_8px_0px_0px_rgba(0,0,0,0.9)] overflow-hidden">
            <div className="border-b-4 border-black px-6 py-3 bg-gray-100">
              <h2 className="text-xl font-bold">Contact Information</h2>
            </div>
            <div className="p-6">
              <div className="mb-4 last:mb-0">
                <p className="font-bold">Email</p>
                <p className="font-mono">{user?.email || 'Not provided'}</p>
              </div>
            </div>
          </div>
          
          {/* Job info */}
          <div className="bg-white border-4 border-black rounded-md shadow-[8px_8px_0px_0px_rgba(0,0,0,0.9)] overflow-hidden">
            <div className="border-b-4 border-black px-6 py-3 bg-gray-100">
              <h2 className="text-xl font-bold">Department</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-black"></div>
                <p className="font-bold">{user?.job_title}</p>
              </div>
              <p className="mt-2 text-sm">Member of the {user?.job_title} team at UCCMEM</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
