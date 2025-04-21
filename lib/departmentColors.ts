/**
 * This file provides color mapping for different departments
 */

// Neobrutalism colors for each department - bright, bold colors with high contrast
const departmentColorMap: Record<string, string> = {
  'Research and Development': '#FF6D00', // Bright Orange
  'Finance': '#4CAF50',                  // Bright Green
  'Human Resources': '#FF4081',          // Hot Pink
  'Marketing': '#2196F3',                // Bright Blue
};

// Get color for a department
export function getDepartmentColor(department: string | undefined): string {
  if (!department) return '#e5e7eb'; // default gray for empty/undefined
  
  // Try exact match first
  if (departmentColorMap[department]) {
    return departmentColorMap[department];
  }
  
  // Try case-insensitive match
  const lowerCaseDept = department.toLowerCase();
  const matchingKey = Object.keys(departmentColorMap).find(
    key => key.toLowerCase() === lowerCaseDept
  );
  
  if (matchingKey) {
    return departmentColorMap[matchingKey];
  }
  
  // Fallback - generate a color deterministically based on the department name
  const hash = department.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0) | 0;
  }, 0);
  
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 80%, 65%)`; // Generate bright, saturated color in neobrutalism style
}