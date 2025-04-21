'use client';

import { useState, useEffect } from "react";
import { getAllUserFromLocal, UserInfo } from "@/lib/userinfo";
import UserCard from "@/components/ucc/userCard";

export default function Home() {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");
  const [departments, setDepartments] = useState<string[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersData = await getAllUserFromLocal();
      setUsers(usersData);
      
      // Extract unique departments
      const uniqueDepartments = Array.from(
        new Set(usersData.map(user => user.job_title))
      ).sort();
      
      setDepartments(["All", ...uniqueDepartments]);
      setFilteredUsers(usersData);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  // Filter users when department selection changes
  useEffect(() => {
    if (selectedDepartment === "All") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(user => user.job_title === selectedDepartment));
    }
  }, [selectedDepartment, users]);

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Neobrutalism Header */}
        <div className="bg-white border-4 border-black rounded-md p-6 mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.9)]">
          <h1 className="text-4xl font-black text-center">UCCMEM User Directory</h1>
          <p className="text-center mt-2 font-medium">Exploring our team members with neobrutalism style</p>
        </div>

        {/* Department Filter */}
        <div className="mb-8 bg-white border-3 border-black p-4 rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,0.9)]">
          <h2 className="font-bold mb-3">Filter by Department:</h2>
          <div className="flex flex-wrap gap-2">
            {departments.map(department => (
              <button
                key={department}
                onClick={() => setSelectedDepartment(department)}
                className={`px-4 py-2 border-2 border-black rounded-md transition-all ${
                  selectedDepartment === department 
                    ? 'bg-black text-white translate-y-0 translate-x-0' 
                    : 'bg-white hover:bg-gray-100 translate-y-1 translate-x-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.9)]'
                }`}
              >
                {department}
              </button>
            ))}
          </div>
        </div>

        {/* User count display */}
        <div className="mb-4 font-medium">
          Showing {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
          {selectedDepartment !== "All" ? ` in ${selectedDepartment}` : ''}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="bg-white border-4 border-black p-6 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0,0.9)]">
              <p className="text-xl font-bold">Loading users...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredUsers.map((user) => (
              <div key={user.uid} className="w-full">
                <UserCard user={user} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
