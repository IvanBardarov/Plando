import { TaskItem } from '../types';

export const getTaskItemColor = (item: TaskItem) : string => {
    const now = new Date();
    const due = new Date(item.dueDate);

    if(item.isCompleted && item.completedAt && new Date(item.completedAt) <= due)
        return "bg-green-100";
    if(item.isCompleted && item.completedAt && new Date(item.completedAt) > due)
        return "bg-gray-100";
    if(!item.isCompleted && now > due)
        return "bg-red-100";
    return "bg-yellow-100";
};