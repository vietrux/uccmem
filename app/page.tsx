'use client';

import { useState, useEffect } from 'react';
import { UserCard } from '@/components/UserCard';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { User } from '@/types/user';

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const departmentColorMap: Record<string, string> = {
    'Research and Development': '#FF6D00', // Bright Orange
    'Finance': '#4CAF50',                  // Bright Green
    'Human Resources': '#FF4081',          // Hot Pink
    'Marketing': '#2196F3',                // Bright Blue
  };

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('/users.json');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data: User[] = await response.json();
        setUsers(data);
        setFilteredUsers(data);

        // Extract unique departments from job_title
        const uniqueDepartments = Array.from(
          new Set(
            data
              .map(user => user.job_title)
              .filter(Boolean) // Remove null/undefined values
          )
        ).sort();
        
        setDepartments(uniqueDepartments);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      setFilteredUsers(users.filter(user => user.job_title === selectedDepartment));
    } else {
      setFilteredUsers(users);
    }
  }, [selectedDepartment, users]);

  const handleSelectDepartment = (department: string | null) => {
    setSelectedDepartment(department);
  };

  return (
    <div className="flex flex-col font-[family-name:var(--font-manrope)]">
      {/* Hero Section */}
      <div className="flex flex-col h-[300px] md:h-[400px] lg:h-[500px] w-full items-center justify-center gap-4 px-4">
        <Image
          src="/ucc_logo_black.png"
          alt="UCC Logo"
          width={120}
          height={120}
          className="md:w-[150px] md:h-[150px] lg:w-[170px] lg:h-[170px]"
        />
        <div className="flex flex-col items-center text-center">
          <span className="text-xl md:text-2xl font-heading font-[family-name:var(--font-space-grotesk)]">
            USTH Coders Club
          </span>
          <span className="text-4xl md:text-5xl lg:text-6xl font-heading font-[family-name:var(--font-space-grotesk)]">
            Member Directory
          </span>
        </div>
      </div>

      {/* Members Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-[1000px] w-full mx-auto px-4 pb-8">
        <div className="lg:col-span-1 flex flex-row lg:flex-col gap-2 lg:gap-6 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0">
          <Button
            onClick={() => handleSelectDepartment(null)}
            className="text-sm lg:text-lg mr-auto font-semibold whitespace-nowrap font-[family-name:var(--font-space-grotesk)]"
          >
            All
          </Button>

          {departments.map((department) => (
            <Button
              key={department}
              onClick={() => handleSelectDepartment(department)}
              className="text-sm lg:text-lg mr-auto font-semibold whitespace-nowrap font-[family-name:var(--font-space-grotesk)]"
              style={{
                backgroundColor: departmentColorMap[department] || '#6C757D',
              }}
            >
              {department}
            </Button>
          ))}
        </div>
        
        <div className="lg:col-span-2 flex flex-col gap-8">
          {isLoading ? (
            <div className="flex flex-col gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 md:h-64 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <span className="text-2xl font-bold">No members found</span>
                  <span className="text-lg">Please try another department</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredUsers.map((user) => (
                    <UserCard key={user.uid} user={user} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}