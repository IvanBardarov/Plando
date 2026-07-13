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
        <section>
            <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input type="text" onChange={e => setTitle(e.target.value)}/>
                <label>Description</label>
                <input type="text" onChange={e => setDescription(e.target.value)}/>
                <label>Due Date</label>
                <input type="date" onChange={e => setDueDate(e.target.value)}/>
                <button>Create</button>
            </form>            
            {taskItems.map(item => (
                <div key={item.id}>
                    <div>{item.title}</div>
                    <div>{item.description}</div>
                    <div>{new Date(item.dueDate).toLocaleDateString()}</div>
                    <div>{item.isCompleted ? 'Yes' : 'No'}</div>
                    <button onClick={() => handleComplete(item.id)}>Complete</button>
                    <button onClick={() => handleDelete(item.id)}>Delete</button>
                </div>                
            ))}
        </section>
    );
}