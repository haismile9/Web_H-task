import React from 'react'
import { useNavigate } from 'react-router-dom'

interface Project {
  id: number
  name: string
  status: string
  deadline: string
  created_at: string
}

const ProjectTable: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const navigate = useNavigate()

  return (
    <div className="overflow-auto">
      <table className="min-w-full bg-base-100 shadow rounded">
        <thead className="bg-base-200 text-left">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Tên dự án</th>
            <th className="px-4 py-2">Deadline</th>
            <th className="px-4 py-2">Trạng thái</th>
            <th className="px-4 py-2">Ngày tạo</th>
            <th className="px-4 py-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <tr key={project.id} className="border-t hover:bg-base-300/20">
              <td className="px-4 py-2">{project.id}</td>
              <td className="px-4 py-2 font-medium">{project.name}</td>
              <td className="px-4 py-2">{project.deadline}</td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 text-sm rounded ${
                  project.status === 'done'
                    ? 'bg-green-200 text-green-800'
                    : 'bg-yellow-200 text-yellow-800'
                }`}>
                  {project.status === 'done' ? 'Hoàn thành' : 'Đang làm'}
                </span>
              </td>
              <td className="px-4 py-2">{project.created_at}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="text-blue-600 hover:underline"
                >
                  Chi tiết
                </button>
              </td>
            </tr>
          ))}
          {projects.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-500">
                Không có dự án nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ProjectTable
