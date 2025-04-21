import React from 'react';
import { Button } from '@/components/ui/button';
import { getDepartmentColor } from '@/lib/departmentColors';

interface DepartmentFilterProps {
  departments: string[];
  onSelectDepartment: (department: string | null) => void;
}

export function DepartmentFilter({ 
  departments, 
  onSelectDepartment 
}: DepartmentFilterProps) {
  return (
    <div className="lg:col-span-1 flex flex-row lg:flex-col gap-2 lg:gap-6 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0">
      <Button
        onClick={() => onSelectDepartment(null)}
        className="text-sm lg:text-lg mr-auto font-semibold whitespace-nowrap font-[family-name:var(--font-space-grotesk)]"
      >
        All
      </Button>
      
      {departments.map((department) => (
        <Button
          key={department}
          onClick={() => onSelectDepartment(department)}
          className="text-sm lg:text-lg mr-auto font-semibold whitespace-nowrap font-[family-name:var(--font-space-grotesk)]"
          style={{
            backgroundColor: getDepartmentColor(department),
          }}
        >
          {department}
        </Button>
      ))}
    </div>
  );
}
