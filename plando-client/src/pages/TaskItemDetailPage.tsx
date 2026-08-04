import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getTaskItemById, updateTaskItem } from '../services/taskItemService';
import { Guid, TaskItem, TaskList } from '../types';
import { getTaskListByUserId } from '../services/taskListService';

export const TaskItemDetailPage = () => {

    const { id } = useParams();
    const [taskItem, setTaskItem] = useState<TaskItem | null>(null);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [dueDate, setDueDate] = useState<Date | null>(null);

    const [taskLists, setTaskLists] = useState<TaskList[] | null>(null);
    const [taskListId, setTaskListId] = useState<Guid | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const taskItem = await getTaskItemById(id!);
            setTaskItem(taskItem);
            setTitle(taskItem?.title);
            setDescription(taskItem?.description);
            const lists = await getTaskListByUserId();
            setTaskLists(lists);
            setTaskListId(taskItem?.taskListId ?? null);
            setStartDate(taskItem?.startDate ? new Date(taskItem?.startDate) : null);
            setDueDate(taskItem?.dueDate ? new Date(taskItem?.dueDate) : null);
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        const item = await updateTaskItem(
            id!, title, description, startDate, dueDate!, taskListId);

        setTaskItem(item);
    };

    return (
        <section>

            <label>Title</label>
            <input
                className="border rounded p-2 w-full md:flex-1"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)} />

            <label>Description</label>
            <textarea
                rows={1}
                className="border rounded p-2 w-full md:flex-1"
                value={description}
                onChange={e => setDescription(e.target.value)}></textarea>

            <label>Start Date</label>
            <input
                className="border rounded p-2 w-full md:flex-1"
                type="date"
                value={startDate ? new Date(startDate).toISOString().split('T')[0] : ''}
                onChange={e => setStartDate(e.target.value ? new Date(e.target.value) : null)} />

            <label>Due Date</label>
            <input
                className="border rounded p-2 w-full md:flex-1"
                type="date"
                value={dueDate ? dueDate.toISOString().split('T')[0] : ''}
                onChange={e => setDueDate(e.target.value ? new Date(e.target.value) : null)} />

            <label>Task List</label>
            <select className="border rounded p-2 w-56 shrink-0"
                value={taskListId || ''}
                onChange={e => setTaskListId(e.target.value)}>
                <option value="">None</option>
                {taskLists?.map(list => (
                    <option key={list.id} value={list.id}>{list.name}</option>
                ))}
            </select>

            <button
                type="submit"
                onClick={handleSubmit}>Save</button>

        </section>
    );
};