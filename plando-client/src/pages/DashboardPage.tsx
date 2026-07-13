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
            .map(item => item.id === id ? { ...item, isCompleted: true } : item));
    };

    const handleDelete = async (id: string) => {
        await deleteTaskItem(id);
        setTaskItems(taskItems.filter(item => item.id !== id));
    };

    return (
        <section className="p-8">
            <form onSubmit={handleSubmit}
                className="flex flex-col items-center gap-2 mb-8">
                <label>Title</label>
                <input 
                    className="border rounded p-2 w-full"
                    type="text" onChange={e => setTitle(e.target.value)}/>
                <label>Description</label>
                <input 
                    className="border rounded p-2 w-full"
                    type="text" onChange={e => setDescription(e.target.value)}/>
                <label>Due Date</label>
                <input 
                    className="border rounded p-2 w-full"
                    type="date" onChange={e => setDueDate(e.target.value)}/>
                <button className="bg-blue-500 text-white px-4 py-2 rounded">Create</button>
            </form>  
            <div className="flex flex-col gap-4">
                {taskItems.map(item => (
                    <div key={item.id} className="flex gap-4 items-center border p-4 rounded">
                        <div>{item.title}</div>
                        <div>{item.description}</div>
                        <div>{new Date(item.dueDate).toLocaleDateString()}</div>
                        <div>{item.isCompleted ? 'Yes' : 'No'}</div>
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