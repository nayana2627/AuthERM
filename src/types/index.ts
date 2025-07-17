export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'manager' | 'engineer';
  avatar_url?: string;
  created_at: string;
}

export interface Engineer {
  id: string;
  user_id: string;
  skills: string[];
  experience_level: 'junior' | 'mid' | 'senior' | 'lead';
  hourly_capacity: number;
  current_utilization: number;
  department: string;
  status: 'available' | 'busy' | 'on_leave';
  bio?: string;
  user?: User;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  start_date: string;
  end_date: string;
  estimated_hours: number;
  actual_hours: number;
  budget: number;
  client: string;
  manager_id: string;
  created_at: string;
  manager?: User;
}

export interface Assignment {
  id: string;
  engineer_id: string;
  project_id: string;
  role: string;
  allocated_hours: number;
  start_date: string;
  end_date: string;
  status: 'assigned' | 'active' | 'completed' | 'cancelled';
  notes?: string;
  engineer?: Engineer;
  project?: Project;
}

export interface DashboardStats {
  total_engineers: number;
  active_projects: number;
  total_assignments: number;
  average_utilization: number;
  projects_by_status: Record<string, number>;
  engineers_by_department: Record<string, number>;
  capacity_trends: Array<{
    date: string;
    utilization: number;
  }>;
}

export interface AIRecommendation {
  type: 'resource_allocation' | 'project_timeline' | 'skill_gap' | 'capacity_optimization';
  title: string;
  description: string;
  confidence: number;
  actionable_items: string[];
  priority: 'low' | 'medium' | 'high';
}