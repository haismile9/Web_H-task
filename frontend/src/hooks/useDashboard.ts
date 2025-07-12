import { useState, useEffect } from 'react';
import API from '../api/axios';

// TypeScript interfaces for the API response
export interface TaskSummary {
  total: number;
  completed: number;
  in_progress: number;
  pending: number;
  overdue: number;
}

export interface ProjectSummary {
  total: number;
  done: number;
  doing: number;
  planned: number;
}

export interface Task {
  id: number;
  title: string;
  status: string;
  deadline?: string;
  assigned_to?: number;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  owner?: {
    id: number;
    name: string;
  };
  members?: Array<{
    id: number;
    name: string;
  }>;
  tasks: {
    completed: Task[];
    pending: Task[];
    in_progress: Task[];
    overdue: Task[];
  };
  task_summary: {
    total: number;
    completed: number;
    pending: number;
    in_progress: number;
    overdue: number;
  };
}

export interface DashboardData {
  task_summary: TaskSummary;
  project_summary: ProjectSummary;
  projects: Project[];
  activities?: Array<{
    type: string;
    content: string;
    created_at: string;
  }>;
}

export interface UseDashboardReturn {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDashboard = (): UseDashboardReturn => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get<DashboardData>('/dashboard');
      setData(response.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchDashboardData,
  };
}; 