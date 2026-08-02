import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getTaskItemById } from '../services/taskItemService';
import { TaskItem } from '../types';

export const TaskItemDetailPage = () => {

    const { id } = useParams();
    const [taskItem, setTaskItem] = useState<TaskItem | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const taskItem = await getTaskItemById(id!);
            setTaskItem(taskItem);
        };
        fetchData();
    }, []);

    return (
        <section>

            <label>Title</label>
            <input
                className="border rounded p-2 w-full md:flex-1"
                type="text"
                value={taskItem?.title}
                readOnly />

            <label>Description</label>
            <textarea
                rows={1}
                className="border rounded p-2 w-full md:flex-1"
                value={taskItem?.description}
                readOnly></textarea>

            <label>Start Date</label>
            <input
                className="border rounded p-2 w-full md:flex-1"
                type="date"
                value=
                {`${taskItem?.startDate ?
                    new Date(taskItem?.startDate).toISOString().split('T')[0] : ''}`}
                    readOnly />

            <label>Due Date</label>
            <input
                className="border rounded p-2 w-full md:flex-1"
                type="date"
                value=
                {`${taskItem?.dueDate ?
                    new Date(taskItem?.dueDate).toISOString().split('T')[0] : ''}`}
                    readOnly />

            <label>Task List</label>
            <input
                className="border rounded p-2 w-full md:flex-1"
                type="text"
                value={taskItem?.taskListId}
                readOnly />

        </section>
    );
};