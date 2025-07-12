import React from 'react';
import { 
  FaProjectDiagram, 
  FaCheckCircle, 
  FaSpinner, 
  FaExclamationTriangle,
  FaChartBar
} from 'react-icons/fa';
import { useDashboard } from '../hooks/useDashboard';
import SummaryCard from '../components/dashboard/SummaryCard';
import ProjectCard from '../components/dashboard/ProjectCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Dashboard: React.FC = () => {
  const { data, loading, error, refetch } = useDashboard();

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." fullScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <FaExclamationTriangle />
          <span>{error}</span>
          <button 
            className="btn btn-sm btn-outline ml-2" 
            onClick={refetch}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-base-content mb-2">
            <FaChartBar className="inline mr-3 text-primary" />
            Dashboard
          </h1>
          <p className="text-base-content/70">Overview of your projects and tasks</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            title="Total Projects"
            value={data.project_summary.total}
            description={`${data.project_summary.done} completed, ${data.project_summary.doing} active`}
            icon={<FaProjectDiagram />}
            color="primary"
          />
          
          <SummaryCard
            title="Tasks Completed"
            value={data.task_summary.completed}
            description={
              data.task_summary.total > 0 
                ? `${Math.round((data.task_summary.completed / data.task_summary.total) * 100)}% of total`
                : 'No tasks yet'
            }
            icon={<FaCheckCircle />}
            color="success"
          />
          
          <SummaryCard
            title="In Progress"
            value={data.task_summary.in_progress}
            description={`${data.task_summary.pending} pending tasks`}
            icon={<FaSpinner />}
            color="info"
          />
          
          <SummaryCard
            title="Overdue Tasks"
            value={data.task_summary.overdue}
            description={data.task_summary.overdue > 0 ? 'Requires attention' : 'All on track'}
            icon={<FaExclamationTriangle />}
            color="error"
          />
        </div>

        {/* Projects Progress */}
        <div className="bg-base-100 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-base-content mb-6">
            Project Progress
          </h2>
          
          {data.projects.length === 0 ? (
            <div className="text-center py-8">
              <FaProjectDiagram className="text-6xl text-base-content/30 mx-auto mb-4" />
              <p className="text-base-content/70 text-lg">No projects found</p>
              <p className="text-base-content/50">Create your first project to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {data.projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>

        {/* Recent Activities (if available) */}
        {data.activities && data.activities.length > 0 && (
          <div className="bg-base-100 rounded-lg shadow-lg p-6 mt-8">
            <h2 className="text-2xl font-bold text-base-content mb-6">
              Recent Activities
            </h2>
            <div className="space-y-3">
              {data.activities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-base-200 rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-base-content">{activity.content}</p>
                    <p className="text-xs text-base-content/50">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
