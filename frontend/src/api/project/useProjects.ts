import React, { useState, useEffect } from 'react';
import axios from "../axios";

export interface Project {
  id: number;
  name: string;
  description: string;
  created_at: string;
  background_url?: string;
  owner_id: number;

}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("/projects");
        setProjects(res.data);
      } catch (err) {
        setError("Không thể tải dự án");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading, error };
};
