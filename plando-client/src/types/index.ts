export type Guid = string;
export type TaskListColor = number;

export interface User{
  id: Guid;
  email: string;
  createdAt: Date;
  taskItems: TaskItem[];
  taskLists: TaskList[]
}

export interface TaskItem{
  id: Guid;
  title: string;
  description: string;
  dueDate: Date;
  isCompleted: boolean;
  createdAt: Date;
  userId: Guid;
  taskListId: Guid;
  completedAt: Date | null;
}

export interface TaskList{
  id: Guid;
  name: string;
  color: TaskListColor;
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