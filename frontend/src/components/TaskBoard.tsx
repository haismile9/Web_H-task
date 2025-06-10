// src/components/TaskBoard.tsx
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { AiOutlinePlus } from "react-icons/ai";
import API from "../api/axios";
import dayjs from "dayjs";
import "dayjs/locale/vi"; // Import Vietnamese locale if needed

interface User {
  id: number;
  name: string;
  email: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  deadline?: string;
  status?: "pending" | "in_progress" | "done";
  assignedUsers?: User[];
}

interface TaskBoardProps {
  projectId: number;
}

const getDaisyStatusClass = (status?: string) => {
  switch (status) {
    case "pending":
      return "status-warning";
    case "in_progress":
      return "status-info";
    case "done":
      return "status-success";
    default:
      return "status-neutral";
  }
};

const statusLabel = {
  pending: "🕐 Chờ làm",
  in_progress: "⚙️ Đang làm",
  done: "✅ Hoàn thành",
};

const TaskBoard: React.FC<TaskBoardProps> = ({ projectId }) => {
  const [columns, setColumns] = useState<Record<string, Task[]>>({
    pending: [],
    in_progress: [],
    done: [],
  });

  const [showModal, setShowModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDeadline, setNewTaskDeadline] = useState("");
  const [newTaskAssignedEmails, setNewTaskAssignedEmails] = useState("");
  const [assignedUsers, setAssignedUsers] = useState<User[]>([]);

  const [members, setMembers] = useState<User[]>([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(`/projects/${projectId}/tasks`);
        const grouped: Record<string, Task[]> = {
          pending: [],
          in_progress: [],
          done: [],
        };
        res.data.tasks.forEach((task: any) => {
          const t: Task = {
            id: task.id,
            title: task.title,
            description: task.description,
            deadline: task.deadline,
            status: task.status,
            assignedUsers: task.assigned_users,
          };
          grouped[task.status]?.push(t);
        });
        setColumns(grouped);
        const projectRes = await API.get(`/projects/${projectId}`);
        setMembers(projectRes.data.users);
      } catch (error) {
        console.error("❌ Load thất bại:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    try {
      const res = await API.post(`/projects/${projectId}/tasks`, {
        title: newTaskTitle,
        description: newTaskDescription,
        deadline: newTaskDeadline,
        assigned_user_ids: assignedUsers.map((u) => u.id),
      });

      const newTask = {
        ...res.data,
        assignedUsers: res.data.assigned_users,
      };

      setColumns((prev) => ({
        ...prev,
        [newTask.status || "pending"]: [
          ...prev[newTask.status || "pending"],
          newTask,
        ],
      }));

      // ✅ BƯỚC 4: Reset form
      setShowModal(false);
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskDeadline("");
      setAssignedUsers([]); // <-- Reset checkboxes
    } catch (err) {
      console.error("❌ Lỗi khi thêm task:", err);
    }
  };

  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) return;
    try {
      await API.post(`/projects/${projectId}/members`, {
        email: newMemberEmail,
      });
      const res = await API.get(`/projects/${projectId}`);
      setMembers(res.data.users);
      setNewMemberEmail("");
      setShowAddMember(false);
    } catch (err) {
      console.error("❌ Thêm thành viên lỗi:", err);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    setColumns((prev) => {
      const updated = { ...prev };
      const taskList = [...updated[source.droppableId]];
      const [movedTask] = taskList.splice(source.index, 1);
      movedTask.status = destination.droppableId as Task["status"];
      const updatedDest = [...updated[destination.droppableId]];
      updatedDest.splice(destination.index, 0, movedTask);
      return {
        ...updated,
        [source.droppableId]: taskList,
        [destination.droppableId]: updatedDest,
      };
    });

    try {
      await API.put(`/tasks/${draggableId}`, {
        status: destination.droppableId,
      });
    } catch (err) {
      console.error("❌ API update status fail:", err);
    }
  };

  const handleOpenEditModal = (task: Task) => {
    setSelectedTask(task);
    setShowEditModal(true);
  };

  const handleUpdateTask = async () => {
    if (!selectedTask) return;
    try {
      const res = await API.put(`/tasks/${selectedTask.id}`, {
        title: selectedTask.title,
        description: selectedTask.description,
        deadline: selectedTask.deadline,
        status: selectedTask.status,
        assigned_user_ids: selectedTask.assignedUsers?.map((u) => u.id),
      });

      const updatedTask = {
        ...res.data,
        assignedUsers: res.data.assigned_users || [],
      };

      setColumns((prev) => {
        const updated = { ...prev };
        for (const key in updated) {
          updated[key] = updated[key].filter((t) => t.id !== updatedTask.id);
        }
        updated[updatedTask.status || "pending"].push(updatedTask);
        return updated;
      });

      setShowEditModal(false);
      setSelectedTask(null);
    } catch (err) {
      console.error("❌ Update task lỗi:", err);
    }
  };
  const getDeadlineBadge = (task: Task) => {
    if (!task.deadline || task.status === "done") return null;

    const now = dayjs();
    const deadline = dayjs(task.deadline);
    const daysLeft = deadline.diff(now, "day");

    if (deadline.isBefore(now, "day")) {
      return (
        <div className="badge badge-error">
          <svg
            className="size-[1em]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g fill="currentColor">
              <rect
                x="1.972"
                y="11"
                width="20.056"
                height="2"
                transform="translate(-4.971 12) rotate(-45)"
                fill="currentColor"
                strokeWidth={0}
              ></rect>
              <path
                d="m12,23c-6.065,0-11-4.935-11-11S5.935,1,12,1s11,4.935,11,11-4.935,11-11,11Zm0-20C7.038,3,3,7.037,3,12s4.038,9,9,9,9-4.037,9-9S16.962,3,12,3Z"
                strokeWidth={0}
                fill="currentColor"
              ></path>
            </g>
          </svg>
          Quá hạn
        </div>
      );
    }

    if (daysLeft <= 2) {
      return (
        <div className="badge badge-warning">
          <svg
            className="size-[1em]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 18 18"
          >
            <g fill="currentColor">
              <path
                d="M7.638,3.495L2.213,12.891c-.605,1.048,.151,2.359,1.362,2.359H14.425c1.211,0,1.967-1.31,1.362-2.359L10.362,3.495c-.605-1.048-2.119-1.048-2.724,0Z"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              ></path>
              <line
                x1="9"
                y1="6.5"
                x2="9"
                y2="10"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              ></line>
              <path
                d="M9,13.569c-.552,0-1-.449-1-1s.448-1,1-1,1,.449,1,1-.448,1-1,1Z"
                fill="currentColor"
                data-stroke="none"
                stroke="none"
              ></path>
            </g>
          </svg>
          Sắp đến hạn
        </div>
      );
    }
  };
  const handleDeleteTask = async (id: string) => {
    try {
      await API.delete(`/tasks/${id}`);
      setColumns((prev) => {
        const updated = { ...prev };
        for (const key in updated) {
          updated[key] = updated[key].filter((t) => t.id !== id);
        }
        return updated;
      });
      setShowEditModal(false);
      setSelectedTask(null);
    } catch (err) {
      console.error("❌ Xóa task lỗi:", err);
    }
  };

  if (loading) return <div className="p-4 text-center">Đang tải tasks...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Task Board</h2>
        <div className="flex gap-2">
          <button
            className="btn btn-sm btn-accent"
            onClick={() => setShowAddMember(true)}
          >
            + Thành viên
          </button>
          <button
            className="btn btn-sm btn-success"
            onClick={() => setShowModal(true)}
          >
            <AiOutlinePlus className="mr-1" /> Thêm Task
          </button>
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">Thêm nhiệm vụ mới</h3>
            <input
              className="input input-bordered w-full mb-3"
              placeholder="Tên nhiệm vụ"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <textarea
              className="textarea textarea-bordered w-full mb-3"
              placeholder="Mô tả"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
            />
            <input
              type="date"
              className="input input-bordered w-full mb-3"
              value={newTaskDeadline}
              onChange={(e) => setNewTaskDeadline(e.target.value)}
            />
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">
                Gán thành viên:
              </label>
              <div className="max-h-40 overflow-y-auto space-y-1 px-1">
                {members.map((member) => {
                  const isChecked = assignedUsers.some(
                    (u) => u.id === member.id
                  );
                  return (
                    <label
                      key={member.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm border-indigo-600 bg-indigo-500 checked:border-green-500 checked:bg-green-400 checked:text-green-800"
                        checked={isChecked}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...assignedUsers, member]
                            : assignedUsers.filter((u) => u.id !== member.id);
                          setAssignedUsers(updated);
                        }}
                      />
                      <span className="text-sm">
                        {member.name} ({member.email})
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="btn btn-ghost"
                onClick={() => setShowModal(false)}
              >
                Hủy
              </button>
              <button className="btn btn-primary" onClick={handleAddTask}>
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">Thêm thành viên</h3>
            <input
              className="input input-bordered w-full mb-4"
              placeholder="Email thành viên"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="btn btn-ghost"
                onClick={() => setShowAddMember(false)}
              >
                Hủy
              </button>
              <button className="btn btn-primary" onClick={handleAddMember}>
                Thêm
              </button>
            </div>
          </div>
          x
        </div>
      )}

      {showEditModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded shadow-md w-[400px]">
            <h3 className="text-lg font-semibold mb-4">Chỉnh sửa Task</h3>

            <input
              className="input input-bordered w-full mb-3"
              value={selectedTask.title}
              onChange={(e) =>
                setSelectedTask({ ...selectedTask, title: e.target.value })
              }
            />

            <textarea
              className="textarea textarea-bordered w-full mb-3"
              value={selectedTask.description}
              onChange={(e) =>
                setSelectedTask({
                  ...selectedTask,
                  description: e.target.value,
                })
              }
            />

            <input
              type="date"
              className="input input-bordered w-full mb-3"
              value={selectedTask.deadline || ""}
              onChange={(e) =>
                setSelectedTask({ ...selectedTask, deadline: e.target.value })
              }
            />

            <select
              className="select select-bordered w-full mb-4"
              value={selectedTask.status}
              onChange={(e) =>
                setSelectedTask({
                  ...selectedTask,
                  status: e.target.value as Task["status"],
                })
              }
            >
              <option value="pending">🕐 Chờ làm</option>
              <option value="in_progress">⚙️ Đang làm</option>
              <option value="done">✅ Hoàn thành</option>
            </select>

            {/* ✅ Checkbox gán thành viên */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">
                Gán thành viên:
              </label>
              <div className="max-h-40 overflow-y-auto space-y-1 px-1">
                {members.map((member) => {
                  const isChecked = selectedTask.assignedUsers?.some(
                    (u) => u.id === member.id
                  );
                  return (
                    <label
                      key={member.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm border-indigo-600 bg-indigo-500 checked:border-green-500 checked:bg-green-400 checked:text-green-800"
                        checked={isChecked}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...(selectedTask.assignedUsers || []), member]
                            : (selectedTask.assignedUsers || []).filter(
                                (u) => u.id !== member.id
                              );
                          setSelectedTask({
                            ...selectedTask,
                            assignedUsers: updated,
                          });
                        }}
                      />
                      <span className="text-sm">
                        {member.name} ({member.email})
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="btn btn-ghost"
                onClick={() => setShowEditModal(false)}
              >
                Hủy
              </button>
              <button
                className="btn btn-error"
                onClick={() => handleDeleteTask(selectedTask.id)}
              >
                Xóa
              </button>
              <button className="btn btn-primary" onClick={handleUpdateTask}>
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {Object.entries(columns).map(([status, tasks]) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="w-80 min-h-[500px] bg-base-200 p-4 rounded shadow flex-shrink-0"
                >
                  <h3 className="font-semibold mb-3">
                    {statusLabel[status as keyof typeof statusLabel]}
                  </h3>
                  {tasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => handleOpenEditModal(task)}
                          className="bg-base-100 p-3 mb-3 rounded shadow hover:bg-base-300 transition cursor-pointer"
                        >
                          <div className="flex justify-between items-center mb-2">
                            {/* Block chứa title + badge deadline */}
                            <div className="flex flex-col gap-1">
                              <div className="font-semibold">{task.title}</div>
                              {getDeadlineBadge(task)}{" "}
                              {/* 👈 Gọi hàm badge deadline tại đây */}
                            </div>

                            {/* Block hiện chấm trạng thái (daisyUI style) */}
                            <div className="inline-grid *:[grid-area:1/1]">
                              <div
                                className={`status animate-ping ${getDaisyStatusClass(
                                  task.status
                                )}`}
                              />
                              <div
                                className={`status ${getDaisyStatusClass(
                                  task.status
                                )}`}
                              />
                            </div>
                          </div>

                          <div className="text-sm text-gray-600 mb-1">
                            {task.description || "Không có mô tả"}
                          </div>
                          {task.assignedUsers?.length ? (
                            <div className="text-xs text-gray-500">
                              👤{" "}
                              {task.assignedUsers.map((u) => u.name).join(", ")}
                            </div>
                          ) : (
                            <div className="text-xs italic text-gray-400">
                              Chưa được gán
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Danh sách thành viên */}
      <div className="mt-6">
        <h3 className="font-semibold text-sm mb-2">👥 Thành viên:</h3>
        {members.length > 0 ? (
          <ul className="list-disc list-inside text-sm">
            {members.map((m) => (
              <li key={m.id}>
                {m.name} ({m.email})
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm italic text-gray-400">
            Chưa có thành viên nào.
          </p>
        )}
      </div>
    </div>
  );
};

export default TaskBoard;
