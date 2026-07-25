import { useState } from 'react';
import { completeTaskItem, deleteTaskItem } from '../services/taskItemService';
import { TaskItem, PagedResultDto, UseTaskItemsReturn } from '../types';

export const useTaskItems = (): UseTaskItemsReturn => {
    const [taskItems, setTaskItems] = useState<PagedResultDto<TaskItem> | null>(null);

    const handleComplete = async (id: string) => {
        await completeTaskItem(id);
        setTaskItems(
            prev => prev ? {
                ...prev,
                items: prev.items.map(item => item.id === id ?
                    { ...item, isCompleted: true, completedAt: new Date() } : item)
            } : null);
    };

    const handleDelete = async (id: string) => {
        await deleteTaskItem(id);
        setTaskItems(
            prev => prev ? {
                ...prev,
                items: prev.items.filter(item => item.id !== id),
                totalCount: prev.totalCount - 1
            } : null);
    };

    return { taskItems, setTaskItems, handleComplete, handleDelete };
};