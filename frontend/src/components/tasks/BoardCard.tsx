import React from "react";
import dayjs from "dayjs";
import classNames from "classnames";

interface TaskProps {
  task: {
    id: number;
    title: string;
    deadline: string | null;
    status: string;
  };
}

const BoardCard: React.FC<TaskProps> = ({ task }) => {
  const deadlineStatus = () => {
    if (!task.deadline || task.status === "done") return null;

    const now = dayjs();
    const deadline = dayjs(task.deadline);
    const daysLeft = deadline.diff(now, "day");

    if (deadline.isBefore(now, "day")) {
      return <div className="badge badge-error">Quá hạn</div>; // 🔴
    }

    if (daysLeft <= 2) {
      return <div className="badge badge-warning">Sắp hết hạn</div>; // 🟡
    }

    return <div className="badge badge-success">Đúng hạn</div>; // ✅ (tuỳ muốn hiện)
  };

  return (
    <div className="card bg-base-100 shadow-md p-4 border">
      <h2 className="card-title">{task.title}</h2>

      <div className="mt-2 flex items-center gap-2">
        {task.deadline && (
          <span className="text-sm text-gray-500">
            📅 {dayjs(task.deadline).format("DD/MM/YYYY")}
          </span>
        )}
        {deadlineStatus()}
      </div>

      {/* Các nút xử lý khác nếu có */}
    </div>
  );
};

export default BoardCard;
