// Product Domains / Categories
export const PROBLEM_CATEGORIES = [
  { value: 'LAPTOP', label: 'Laptop', icon: '💻' },
  { value: 'MOBILE', label: 'Mobile Phone', icon: '📱' },
  { value: 'HOME_APPLIANCE', label: 'Home Appliance', icon: '🧊' },
  { value: 'ELECTRONICS', label: 'Electronics', icon: '📺' },
  { value: 'PLUMBING', label: 'Plumbing', icon: '🔧' },
  { value: 'ELECTRICAL', label: 'Electrical', icon: '⚡' },
  { value: 'FURNITURE', label: 'Furniture', icon: '🪑' },
  { value: 'VEHICLE', label: 'Vehicle', icon: '🚗' },
  { value: 'OTHER', label: 'Other', icon: '📦' },
];

export const PROBLEM_SEVERITIES = [
  { value: 'LOW', label: 'Low', description: 'Minor issue, device is still functional', color: '#16a34a' },
  { value: 'MEDIUM', label: 'Medium', description: 'Moderate impairment, workaround exists', color: '#d97706' },
  { value: 'HIGH', label: 'High', description: 'Major failure, critical functions blocked', color: '#ea580c' },
  { value: 'CRITICAL', label: 'Critical', description: 'Hazardous or completely unusable', color: '#dc2626' },
];

export const PROBLEM_STATUSES = [
  { value: 'REPORTED', label: 'Reported', color: '#2563eb', desc: 'Problem submitted and logged' },
  { value: 'UNDER_REVIEW', label: 'Under Review', color: '#7c3aed', desc: 'Initial triage in progress' },
  { value: 'DIAGNOSED', label: 'Diagnosed', color: '#0284c7', desc: 'Root cause identified' },
  { value: 'RESOLUTION_SELECTED', label: 'Resolution Selected', color: '#0d9488', desc: 'Path chosen (DIY/Expert/Tech)' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: '#d97706', desc: 'Repair active' },
  { value: 'RESOLVED', label: 'Resolved', color: '#16a34a', desc: 'Fix successfully confirmed' },
  { value: 'CLOSED', label: 'Closed', color: '#64748b', desc: 'Archived to item history' },
];

// User Roles
export const USER_ROLES = {
  CUSTOMER: 'CUSTOMER',
  TECHNICIAN: 'TECHNICIAN',
  EXPERT: 'EXPERT',
  ADMIN: 'ADMIN',
};

// 3-Pillar Resolution Pathways
export const RESOLUTION_PATHS = {
  DIY: {
    id: 'DIY',
    title: 'Fix it myself using a DIY guide',
    description: 'Step-by-step verified instructions, required tools, and safety warnings.',
  },
  EXPERT: {
    id: 'EXPERT',
    title: 'Learn how to fix it with an expert',
    description: '1-on-1 virtual guided session with a certified specialist.',
  },
  TECHNICIAN: {
    id: 'TECHNICIAN',
    title: 'Hire a verified technician',
    description: 'On-site service by a vetted and rated professional.',
  },
};

// Core Product Philosophy Steps
export const USER_JOURNEY_STEPS = [
  { step: 1, title: 'Diagnose', desc: 'Describe or upload the problem to identify the issue.' },
  { step: 2, title: 'Decide', desc: 'Choose between DIY, Expert Guidance, or Technician Booking.' },
  { step: 3, title: 'Resolve', desc: 'Complete the fix with verified quality standards.' },
  { step: 4, title: 'Learn', desc: 'Understand root causes to build maintenance knowledge.' },
  { step: 5, title: 'Remember', desc: 'Log item repair records into your personal history.' },
  { step: 6, title: 'Prevent', desc: 'Receive automated scheduled maintenance alerts.' },
];
