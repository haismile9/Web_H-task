import { useState, useEffect } from 'react';
import axios from '../axios';

// Define the shape of a single project
export interface Project {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at?: string;
  owner_id?: number;
}

// Define the hook itself
export const useProjectDetails = (id: number) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/projects/${id}`);
        setProject(response.data);
      } catch (err) {
        setError("Không thể tải thông tin dự án.");
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProjectDetails();
    } else {
      setError("ID dự án không hợp lệ.");
      setLoading(false);
    }
  }, [id]);

  return { project, loading, error };
};
