import React from 'react';

interface SummaryCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactElement;
  color: 'primary' | 'success' | 'info' | 'warning' | 'error';
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  description,
  icon,
  color
}) => {
  const colorClasses = {
    primary: 'text-primary',
    success: 'text-success',
    info: 'text-info',
    warning: 'text-warning',
    error: 'text-error'
  };

  return (
    <div className="stats shadow bg-base-100">
      <div className="stat">
        <div className={`stat-figure ${colorClasses[color]}`}>
          {React.cloneElement(icon, { className: 'text-3xl' } as any)}
        </div>
        <div className="stat-title">{title}</div>
        <div className={`stat-value ${colorClasses[color]}`}>{value}</div>
        <div className="stat-desc">{description}</div>
      </div>
    </div>
  );
};

export default SummaryCard; 