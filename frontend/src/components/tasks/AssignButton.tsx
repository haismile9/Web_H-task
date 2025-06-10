import React from "react";

interface Props {
  onClick?: () => void;
}

const AssignButton: React.FC<Props> = ({ onClick }) => {
  return (
    <button className="btn btn-outline btn-accent btn-sm" onClick={onClick}>
      📌 Gán công việc
    </button>
  );
};

export default AssignButton;
