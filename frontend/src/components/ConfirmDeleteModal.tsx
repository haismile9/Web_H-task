import React from "react";

interface ConfirmDeleteModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  title = "Bạn có chắc muốn xoá dự án này?",
}) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="modal-box bg-base-100">
        <h3 className="font-bold text-lg mb-4">{title}</h3>
        <div className="flex justify-end gap-3">
          <button className="btn" onClick={onCancel}>Huỷ</button>
          <button className="btn btn-error" onClick={onConfirm}>Xoá</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
