// src/store/task.ts
import { create } from "zustand";

export type Task = {
  id: number;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
};

type TaskStore = {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  updateTask: (id: number, updates: Partial<Task>) => void;
  addTask: (task: Task) => void;
  removeTask: (id: number) => void;
};

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
    })),
  addTask: (task) =>
    set((state) => ({ tasks: [...state.tasks, task] })),
  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),
}));
