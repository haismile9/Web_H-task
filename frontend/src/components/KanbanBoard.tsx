import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import API from '../api/axios';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  deadline?: string;
  status: 'pending' | 'in_progress' | 'done';
  assigned_users?: User[];
}

interface TaskBoardProps {
  projectId: number;
}

const statusLabels = {
  pending: '🕐 Pending',
  in_progress: '⚙️ In Progress',
  done: '✅ Done'
};

const KanbanBoard: React.FC<TaskBoardProps> = ({ projectId }) => {
  const [columns, setColumns] = useState<Record<string, Task[]>>({
    pending: [],
    in_progress: [],
    done: []
  });

  const fetchTasks = async () => {
    try {
      const res = await API.get(`/projects/${projectId}/tasks`);
      const grouped: Record<string, Task[]> = {
        pending: [],
        in_progress: [],
        done: []
      };
      res.data.tasks.forEach((task: Task) => {
        grouped[task.status].push(task);
      });
      setColumns(grouped);
    } catch (err) {
      console.error('❌ Load tasks error:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    if (sourceCol === destCol) {
      const reordered = Array.from(columns[sourceCol]);
      const [moved] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, moved);
      setColumns({ ...columns, [sourceCol]: reordered });
    } else {
      const sourceTasks = Array.from(columns[sourceCol]);
      const destTasks = Array.from(columns[destCol]);
      const [movedTask] = sourceTasks.splice(source.index, 1);
      movedTask.status = destCol as Task['status'];
      destTasks.splice(destination.index, 0, movedTask);

      setColumns({
        ...columns,
        [sourceCol]: sourceTasks,
        [destCol]: destTasks
      });

      try {
        await API.put(`/tasks/${movedTask.id}`, { status: movedTask.status });
      } catch (err) {
        console.error('❌ Failed to update task status:', err);
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 w-max min-w-full">
          {Object.entries(columns).map(([status, tasks]) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="w-80 min-h-[400px] bg-base-200 p-4 rounded shadow"
                >
                  <h2 className="text-lg font-bold mb-3">{statusLabels[status as keyof typeof statusLabels]}</h2>
                  {tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-base-100 p-3 mb-3 rounded shadow hover:bg-base-300 transition"
                        >
                          <div className="font-semibold">{task.title}</div>
                          {Array.isArray(task.assigned_users) && task.assigned_users.length > 0 && (
                            <ul className="text-sm mt-1 text-gray-600">
                              {task.assigned_users.map(user => (
                                <li key={user.id}>👤 {user.name}</li>
                              ))}
                            </ul>
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
    </div>
  );
};

export default KanbanBoard;
