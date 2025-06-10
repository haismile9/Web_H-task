import React from "react";
import { Link } from "react-router-dom";

interface BoardCardProps {
  id?: number;
  title: string;
  description?: string;
  backgroundUrl?: string;
  isCreateNew?: boolean;
  onClick?: () => void;

  // NEW
  draggable?: boolean;
  onDragStart?: (id?: number) => void;
}

const BoardCard: React.FC<BoardCardProps> = ({
  id,
  title,
  description,
  backgroundUrl,
  isCreateNew = false,
  onClick,
  draggable = false,
  onDragStart,
}) => {
  if (isCreateNew) {
    return (
      <div
        onClick={onClick}
        className="card bg-base-200 hover:bg-base-300 min-h-[14rem] cursor-pointer items-center justify-center flex border-2 border-dashed border-primary transition-all duration-200 hover:scale-[1.02] hover:shadow-lg group"
      >
        <span className="text-lg font-semibold text-primary group-hover:scale-110 group-hover:underline transition-transform">
          + Tạo Dự Án Mới
        </span>
      </div>
    );
  }

  return (
    <Link to={`/projects/${id}`} className="no-underline">
    <div
      draggable={draggable}
      onDragStart={() => onDragStart?.(id)}
      className="card image-full w-full aspect-[4/3] shadow-md hover:shadow-xl hover:scale-[1.02] transition-transform duration-200 ease-in-out cursor-grab active:cursor-grabbing"
    >
      <figure className="w-full h-full">
        <img
          src={backgroundUrl || "/img/undraw_scrum-board_uqku.png"}
          alt={title}
          className="object-cover w-full h-full"
        />
      </figure>
      <div className="card-body bg-black bg-opacity-40 text-white">
        <h2 className="card-title">{title}</h2>
        {description && (
          <p className="text-sm overflow-hidden line-clamp-2">{description}</p>
        )}
      </div>
    </div>
    </Link>
  );
};

export default BoardCard;
