import React from 'react';
import type { Project } from '../../hooks/useDashboard';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  // Calculate completion percentage for a project
  const calculateCompletionPercentage = (project: Project): number => {
    if (project.task_summary.total === 0) return 0;
    return Math.round((project.task_summary.completed / project.task_summary.total) * 100);
  };

  // Get progress bar color based on completion percentage
  const getProgressColor = (percentage: number): string => {
    if (percentage >= 80) return 'progress-success';
    if (percentage >= 60) return 'progress-info';
    if (percentage >= 40) return 'progress-warning';
    return 'progress-error';
  };

  const completionPercentage = calculateCompletionPercentage(project);
  const progressColor = getProgressColor(completionPercentage);

  return (
    <div className="card bg-base-200 shadow-md">
      <div className="card-body">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="card-title text-lg">{project.name}</h3>
            {project.description && (
              <p className="text-sm text-base-content/70 mt-1">
                {project.description}
              </p>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {completionPercentage}%
            </div>
            <div className="text-xs text-base-content/50">
              {project.task_summary.completed}/{project.task_summary.total} tasks
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <progress 
            className={`progress ${progressColor} w-full h-3`} 
            value={completionPercentage} 
            max="100"
          ></progress>
        </div>

        {/* Task Summary */}
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="text-center">
            <div className="font-semibold text-success">{project.task_summary.completed}</div>
            <div className="text-base-content/50">Done</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-info">{project.task_summary.in_progress}</div>
            <div className="text-base-content/50">Active</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-warning">{project.task_summary.pending}</div>
            <div className="text-base-content/50">Pending</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-error">{project.task_summary.overdue}</div>
            <div className="text-base-content/50">Overdue</div>
          </div>
        </div>

        {/* Project Owner */}
        {project.owner && (
          <div className="mt-3 pt-3 border-t border-base-content/10">
            <div className="flex items-center text-sm text-base-content/70">
              <span>Owner: </span>
              <span className="font-medium ml-1">{project.owner.name}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard; 