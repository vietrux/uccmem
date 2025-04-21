import { User } from '@/types/user';
import fs from 'fs';
import path from 'path';

export async function getUsers(): Promise<User[]> {
  try {
    // Handle both server-side and client-side fetching
    let url: string;
    
    if (typeof window === 'undefined') {
      // Server-side - use Node.js path resolution
      // In Next.js, process.cwd() points to the project root
      const filePath = path.join(process.cwd(), 'public', 'users.json');
      
      // Read the file directly on the server
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } else {
      // Client-side - use fetch with relative URL
      url = '/users.json';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return await response.json();
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function getUserById(uid: string): Promise<User | null> {
  try {
    const users = await getUsers();
    return users.find(user => user.uid === uid) || null;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
}