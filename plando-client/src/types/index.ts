export type Guid = string;
export type TaskListColor = number;

interface User{
  id: Guid;
  email: string;
  createdAt: Date;
  taskItems: TaskItem[];
  taskLists: TaskList[]
}

interface TaskItem{
  id: Guid;
  title: string;
  description: string;
  dueDate: Date;
  isCompleted: boolean;
  createdAt: Date;
  userId: Guid;
  taskListId: Guid;
}

interface TaskList{
  id: Guid;
  name: string;
  color: TaskListColor;
  createdAt: Date;
  userId: Guid;
  taskItems: TaskItem[];
}