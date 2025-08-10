import React, { useState, useEffect } from 'react';
import { 
  FaProjectDiagram, 
  FaCheckCircle, 
  FaSpinner, 
  FaExclamationTriangle,
  FaChartBar
} from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import API from '../api/axios';

interface DashboardData {
  project_summary: {
    total: number;
    done: number;
    doing: number;
  };
  task_summary: {
    total: number;
    completed: number;
    in_progress: number;
    pending: number;
    overdue: number;
  };
  projects: Array<{
    id: number;
    name: string;
    progress?: number;
    task_summary?: {
      completed: number;
      total: number;
    };
  }>;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get('/dashboard');
      setData(response.data);
    } catch (err: any) {
      console.error('Dashboard fetch error:', err);
      setError(err.response?.data?.message || 'Không thể tải dữ liệu dashboard');
      // Mock data for demo
      setData({
        project_summary: { total: 5, done: 2, doing: 2 },
        task_summary: { total: 20, completed: 8, in_progress: 7, pending: 3, overdue: 2 },
        projects: [
          { id: 1, name: 'Dự án Web', progress: 75, task_summary: { completed: 3, total: 4 } },
          { id: 2, name: 'Mobile App', progress: 45, task_summary: { completed: 2, total: 5 } },
          { id: 3, name: 'API Backend', progress: 90, task_summary: { completed: 4, total: 4 } }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4">Đang tải dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <FaExclamationTriangle />
          <span>{error}</span>
          <button 
            className="btn btn-sm btn-outline ml-2" 
            onClick={fetchDashboardData}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Không có dữ liệu</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const pieData = [
    { name: 'Hoàn thành', value: data.project_summary.done, color: '#10B981' },
    { name: 'Đang thực hiện', value: data.project_summary.doing, color: '#F59E0B' },
    { name: 'Chưa bắt đầu', value: data.project_summary.total - data.project_summary.done - data.project_summary.doing, color: '#EF4444' }
  ];

  const taskStatusData = [
    { name: 'Hoàn thành', value: data.task_summary.completed, color: '#10B981' },
    { name: 'Đang tiến hành', value: data.task_summary.in_progress, color: '#F59E0B' },
    { name: 'Chờ xử lý', value: data.task_summary.pending, color: '#6B7280' },
    { name: 'Quá hạn', value: data.task_summary.overdue, color: '#EF4444' }
  ];

  const projectProgressData = data.projects.map(project => ({
    name: project.name.length > 15 ? project.name.substring(0, 15) + '...' : project.name,
    progress: project.progress || 0,
    completed: project.task_summary?.completed || 0,
    total: project.task_summary?.total || 0
  }));

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-base-content mb-2">
            <FaChartBar className="inline mr-3 text-primary" />
            Dashboard
          </h1>
          <p className="text-base-content/70">Tổng quan về dự án và công việc</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stat bg-base-100 shadow rounded-lg">
            <div className="stat-figure text-primary">
              <FaProjectDiagram className="text-3xl" />
            </div>
            <div className="stat-title">Tổng Dự Án</div>
            <div className="stat-value text-primary">{data.project_summary.total}</div>
            <div className="stat-desc">{data.project_summary.done} hoàn thành, {data.project_summary.doing} đang thực hiện</div>
          </div>

          <div className="stat bg-base-100 shadow rounded-lg">
            <div className="stat-figure text-success">
              <FaCheckCircle className="text-3xl" />
            </div>
            <div className="stat-title">Công Việc Hoàn Thành</div>
            <div className="stat-value text-success">{data.task_summary.completed}</div>
            <div className="stat-desc">
              {data.task_summary.total > 0 
                ? `${Math.round((data.task_summary.completed / data.task_summary.total) * 100)}% tổng số`
                : 'Chưa có công việc'
              }
            </div>
          </div>

          <div className="stat bg-base-100 shadow rounded-lg">
            <div className="stat-figure text-info">
              <FaSpinner className="text-3xl" />
            </div>
            <div className="stat-title">Đang Thực Hiện</div>
            <div className="stat-value text-info">{data.task_summary.in_progress}</div>
            <div className="stat-desc">{data.task_summary.pending} công việc chờ xử lý</div>
          </div>

          <div className="stat bg-base-100 shadow rounded-lg">
            <div className="stat-figure text-error">
              <FaExclamationTriangle className="text-3xl" />
            </div>
            <div className="stat-title">Quá Hạn</div>
            <div className="stat-value text-error">{data.task_summary.overdue}</div>
            <div className="stat-desc">
              {data.task_summary.overdue > 0 ? 'Cần chú ý' : 'Tất cả đúng tiến độ'}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Project Status Pie Chart */}
          <div className="bg-base-100 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-base-content mb-4">Phân Bố Trạng Thái Dự Án</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Task Status Chart */}
          <div className="bg-base-100 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-base-content mb-4">Phân Bố Trạng Thái Công Việc</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Progress Chart */}
        <div className="bg-base-100 rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-base-content mb-4">Tiến Độ Từng Dự Án</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={projectProgressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'progress' ? `${value}%` : value,
                  name === 'progress' ? 'Tiến độ' : name
                ]}
              />
              <Bar dataKey="progress" fill="#8884d8" name="Tiến độ">
                {projectProgressData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.progress >= 80 ? '#10B981' : entry.progress >= 50 ? '#F59E0B' : '#EF4444'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Projects */}
        <div className="bg-base-100 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-base-content mb-6">
            Dự Án Gần Đây
          </h2>
          
          {data.projects.length === 0 ? (
            <div className="text-center py-8">
              <FaProjectDiagram className="text-6xl text-base-content/30 mx-auto mb-4" />
              <p className="text-base-content/70 text-lg">Không có dự án nào</p>
              <p className="text-base-content/50">Tạo dự án đầu tiên của bạn</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {data.projects.map((project) => (
                <div key={project.id} className="bg-base-200 rounded-lg p-4">
                  <h4 className="font-bold text-lg mb-2">{project.name}</h4>
                  <div className="flex justify-between items-center mb-2">
                    <span>Tiến độ: {project.progress || 0}%</span>
                    <span className="badge badge-outline">
                      {project.task_summary?.completed || 0}/{project.task_summary?.total || 0} tasks
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        (project.progress || 0) >= 80 ? 'bg-green-500' :
                        (project.progress || 0) >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${project.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
