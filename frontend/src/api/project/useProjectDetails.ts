import { useState, useEffect } from 'react';
import axios, { AxiosError } from '../axios';

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
  const [errorCode, setErrorCode] = useState<number | null>(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        setError("");
        setErrorCode(null);
        const response = await axios.get(`/projects/${id}`);
        setProject(response.data);
      } catch (err) {
        const axiosError = err as AxiosError;
        const statusCode = axiosError.response?.status;
        setErrorCode(statusCode || null);
        
        console.error("Error fetching project:", err);
        
        if (statusCode === 403 || statusCode === 404) {
          setError("Dự án không tồn tại.");
          setErrorCode(404); // Treat both 403 and 404 as 404
        } else if (statusCode === 401) {
          setError("Vui lòng đăng nhập để tiếp tục.");
        } else {
          setError("Không thể tải thông tin dự án.");
        }
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

  return { project, loading, error, errorCode };
};
