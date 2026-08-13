import React from 'react';

export type Guid = string;

export interface User {
  id: Guid;
  email: string;
  createdAt: Date;
  taskItems: TaskItem[];
  taskLists: TaskList[]
}

export interface TaskItem {
  id: Guid;
  title: string;
  description: string;
  dueDate: Date;
  isCompleted: boolean;
  createdAt: Date;
  userId: Guid;
  taskListId: Guid;
  completedAt: Date | null;
  startDate: Date | null;
}

export interface TaskList {
  id: Guid;
  name: string;
  createdAt: Date;
  userId: Guid;
  taskItems: TaskItem[];
}

export interface PagedResultDto<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UseTaskItemsReturn {
  taskItems: PagedResultDto<TaskItem> | null;
  setTaskItems: React.Dispatch<React.SetStateAction<PagedResultDto<TaskItem> | null>>;
  handleComplete: (id: string) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
}

export interface FilterValues {
  taskListId: Guid | null;
  title: string | null;
  description: string | null;
  createdAtFrom: Date | null;
  createdAtTo: Date | null;
  dueDateFrom: Date | null;
  dueDateTo: Date | null;
  completedAtFrom: Date | null;
  completedAtTo: Date | null;
  isCompleted: boolean | null;
  page: number | null;
  pageSize: number | null;
}

export interface TaskCategory {
  id: Guid;
  name: string;
  description: string;
  userId: Guid;
  createdAt: Date;
}

export interface Note {
  id: Guid;
  content: string;
  createdAt: Date;
  taskItemId: Guid;
  userId: Guid;
}