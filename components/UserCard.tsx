import React from 'react';
import Link from 'next/link';
import { User } from '@/types/user';
import { getGravatarUrl } from '@/lib/gravatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getDepartmentColor } from '@/lib/departmentColors';

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  const { uid, displayName, job_title, email } = user;
  const avatarUrl = getGravatarUrl(email);
  const initials = displayName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();
  
  // Get the department color based on job title
  const departmentColor = getDepartmentColor(job_title);

  return (
    <Link href={`/u/${uid}`} className="block transition-transform hover:-translate-y-1">
      <Card className="h-full bg-white border-2 border-black hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
        <CardHeader className="flex flex-col items-center pb-2 pt-5">
          <Avatar className="w-32 h-32 border-2 border-black mb-3">
            <AvatarImage src={avatarUrl} alt={`${displayName}'s profile`} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-xl font-bold text-center">{displayName}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center pt-0">
          <Badge 
            variant="default" 
            className="text-black font-medium border-2 border-black"
            style={{ backgroundColor: departmentColor }}
          >
            {job_title}
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
}