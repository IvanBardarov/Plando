import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getTaskItemsWithoutPaginationByUserId,
    updateTaskItem
} from '../services/taskItemService';
import { TaskItem } from '../types';

export const EisenhowerMatrixPage = () => {

    const navigate = useNavigate();

    const [taskItems, setTaskItems] = useState<TaskItem[] | null>(null);
    const q1 = taskItems?.filter(t => t.isImportant && t.isUrgent) ?? [];
    const q2 = taskItems?.filter(t => t.isImportant && !t.isUrgent) ?? [];
    const q3 = taskItems?.filter(t => !t.isImportant && t.isUrgent) ?? [];
    const q4 = taskItems?.filter(t => !t.isImportant && !t.isUrgent) ?? [];

    useEffect(() => {
        const fetchData = async () => {
            const allTaskItems = await getTaskItemsWithoutPaginationByUserId(null, null);

            setTaskItems(allTaskItems);
        };
        fetchData();
    }, []);

    const handleDrop = async (e: React.DragEvent, isImportant: boolean, isUrgent: boolean) => {
        const id = e.dataTransfer.getData('taskId');

        const task = taskItems?.find(t => t.id === id);
        if (!task)
            return;

        const item = await updateTaskItem(
            id!, task.title, task.description, task.startDate,
            task.dueDate, task.taskListId, task.categoryId, isImportant, isUrgent);

        setTaskItems(prev => {
            if (!prev)
                return prev;
            return prev.map(t => t.id === item.id ? item : t);
        });
    };

    return (
        <section className="p-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">

                <div data-testid="q1" className="bg-red-400 min-h-64 overflow-y-auto max-h-96"
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => handleDrop(e, true, true)}>
                    <span className="text-red-900 p-2">Important + Urgent</span>
                    {q1?.map(t => (
                        <div key={t.id}
                            className="border bg-white rounded p-2 m-2 cursor-pointer"
                            onClick={e => navigate(`/tasks/${t.id}/details`)}
                            draggable={true}
                            onDragStart={e => {
                                e.stopPropagation();
                                e.dataTransfer.setData('taskId', t.id);
                            }}>
                            {t.title}
                        </div>
                    ))}
                </div>

                <div data-testid="q2" className="bg-orange-300 min-h-64 overflow-y-auto max-h-96"
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => handleDrop(e, true, false)}>
                    <span className="text-orange-800 p-2">Important + Not Urgent</span>
                    {q2?.map(t => (
                        <div key={t.id}
                            className="border bg-white rounded p-2 m-2 cursor-pointer"
                            onClick={e => navigate(`/tasks/${t.id}/details`)}
                            draggable={true}
                            onDragStart={e => {
                                e.stopPropagation();
                                e.dataTransfer.setData('taskId', t.id);
                            }}>
                            {t.title}
                        </div>
                    ))}
                </div>

                <div data-testid="q3" className="bg-blue-200 min-h-64 overflow-y-auto max-h-96"
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => handleDrop(e, false, true)}>
                    <span className="text-blue-600 p-2">Not Important + Urgent</span>
                    {q3?.map(t => (
                        <div key={t.id}
                            className="border bg-white rounded p-2 m-2 cursor-pointer"
                            onClick={e => navigate(`/tasks/${t.id}/details`)}
                            draggable={true}
                            onDragStart={e => {
                                e.stopPropagation();
                                e.dataTransfer.setData('taskId', t.id);
                            }}>
                            {t.title}
                        </div>
                    ))}
                </div>

                <div data-testid="q4" className="bg-gray-100 min-h-64 overflow-y-auto max-h-96"
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => handleDrop(e, false, false)}>
                    <span className="text-gray-600 p-2">Not Important + Not Urgent</span>
                    {q4?.map(t => (
                        <div key={t.id}
                            className="border bg-white rounded p-2 m-2 cursor-pointer"
                            onClick={e => navigate(`/tasks/${t.id}/details`)}
                            draggable={true}
                            onDragStart={e => {
                                e.stopPropagation();
                                e.dataTransfer.setData('taskId', t.id);
                            }}>
                            {t.title}
                        </div>
                    ))}
                </div>

            </div>

        </section>
    );
};