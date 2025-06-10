// src/models/project.ts
export interface Project {
  id: number;
  name: string;
  description?: string;
  owner_id: number;
  created_at?: string;
  updated_at?: string;
  users?: {
    id: number;
    name: string;
    email: string;
    pivot?: {
      role: string;
    };
  }[];
}
