import { useEffect, useState } from 'react';
import API from '../api/axios';
import BoardCard from '../components/BoardCard';

interface Project {
  id: number;
  name: string;
  description: string;
  cover?: string;
}

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const res = await API.get('/projects');
        setProjects(res.data);
      } catch (err) {
        console.error('❌ Lỗi khi tải dự án:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleCreateNew = () => {
    // chuyển đến trang tạo project
    // hoặc mở modal nếu bạn dùng modal
    console.log('Tạo dự án mới');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📋 Danh sách dự án</h1>

      {loading ? (
        <p>Đang tải dự án...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <BoardCard
            isCreateNew
            title="Tạo Dự Án Mới"
            onClick={handleCreateNew}
          />

          {projects.map((project) => (
            <BoardCard
              key={project.id}
              id={project.id}
              title={project.name}
              description={project.description}
              backgroundUrl={project.cover}
            />
          ))}
        </div>
      )}
    </div>
  );
}
