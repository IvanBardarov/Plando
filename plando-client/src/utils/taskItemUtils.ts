import { TaskItem } from '../types';

export const getItemClassName = (item: TaskItem) : string => {
    const now = new Date();
    const due = new Date(item.dueDate);

    if(item.isCompleted && item.completedAt && new Date(item.completedAt) <= due)
        return "border p-4 rounded bg-green-100";
    if(item.isCompleted && item.completedAt && new Date(item.completedAt) > due)
        return "border p-4 rounded bg-gray-100";
    if(!item.isCompleted && now > due)
        return "border p-4 rounded bg-red-100";
    return "border p-4 rounded bg-yellow-100";
};