import { useState, useEffect } from 'react';
import { 
    getTaskItemByUserId, 
    createTaskItem, 
    completeTaskItem, 
    deleteTaskItem
 } from '../services/taskItemService';
import { TaskItem } from '../types';

export const DashboardPage = () => {
    const [taskItems, setTaskItems] = useState<TaskItem[]>([]);
    const userId = localStorage.getItem('userId');

    useEffect(() => {        
        const fetchData = async () => {
            const items = await getTaskItemByUserId(userId!);
            setTaskItems(items);
        };
        fetchData();
    }, []);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        const newItem = await createTaskItem(title,description, userId!, new Date(dueDate), null);
        setTaskItems([...taskItems, newItem]);
    };

    const handleComplete = async (id: string) => {
        await completeTaskItem(id);
        setTaskItems(taskItems
            .map(item => item.id === id ? 
                { ...item, isCompleted: true, completedAt: new Date() } : item));
    };

    const handleDelete = async (id: string) => {
        await deleteTaskItem(id);
        setTaskItems(taskItems.filter(item => item.id !== id));
    };

    const getItemClassName = (item: TaskItem) : string => {
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

    return (
        <section className="p-8">
            <form onSubmit={handleSubmit}
                className="flex flex-col md:flex-row items-center gap-2 mb-8 w-full">
                <label>Title</label>
                <input 
                    className="border rounded p-2 w-full md:flex-1"
                    type="text" onChange={e => setTitle(e.target.value)}/>
                <label>Description</label>
                <textarea 
                    rows={1}
                    className="border rounded p-2 w-full md:flex-1"
                    onChange={e => setDescription(e.target.value)}></textarea>
                <label>Due Date</label>
                <input 
                    className="border rounded p-2 w-56 shrink-0"
                    type="date" onChange={e => setDueDate(e.target.value)}/>
                <button className="bg-blue-500 text-white px-4 py-2 rounded">Create</button>
            </form>  
            <div className="flex flex-col gap-4">
                <div 
                    className="hidden md:flex gap-4 items-center border-b pb-2 font-bold text-center">
                    <div className="flex-1 justify-center text-center">Title</div>
                    <div className="flex-1 justify-center text-center">Description</div>
                    <div className="flex-1 justify-center text-center">Due Date</div>
                    <div className="flex-1 justify-center text-center">Completed</div>
                    <div className="flex-1 justify-center text-center">Date of Completion</div>
                    <div className="flex-1 justify-center text-center">Actions</div>
                </div>
                {taskItems.map(item => (
                    <div key={item.id} 
                        className={`flex flex-col md:flex-row gap-4 
                            items-start md:items-center ${getItemClassName(item)}`}>
                        <div className="flex-1 justify-center text-center">{item.title}</div>
                        <div className="flex-1 justify-center text-center">{item.description}</div>
                        <div className="flex-1 justify-center text-center">
                            {new Date(item.dueDate).toLocaleDateString()}</div>
                        <div className="flex-1 justify-center text-center">{item.isCompleted ? 'Yes' : 'No'}</div>
                        <div className="flex-1 justify-center text-center">
                            {item.completedAt ? new Date(item.completedAt).toLocaleDateString() : '-'}
                            </div>
                        <div className="flex gap-2">
                            <button 
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={() => handleComplete(item.id)}>Complete</button>
                            <button 
                                className="bg-red-500 text-white px-4 py-2 rounded"
                                onClick={() => handleDelete(item.id)}>Delete</button>
                        </div>
                    </div>                
                ))}
            </div>          

        </section>
    );
}