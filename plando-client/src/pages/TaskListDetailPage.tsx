import { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import { 
    getTaskItemByUserId,
    completeTaskItem, 
    deleteTaskItem } from '../services/taskItemService';

import { TaskItem, PagedResultDto } from '../types';

export const TaskListDetailPage = () => {

    const params = useParams ();
    const { id } = params;
    
    const [taskItems, setTaskItems] = useState<PagedResultDto<TaskItem> | null>(null);

    useEffect(() => {
        const fetchDate = async () => {
            const items = await getTaskItemByUserId(
                id || null, null, null, null, null, null, null, null, null, null, null, null);
            setTaskItems(items);
        };
        fetchDate();
    }, []);

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

            <h5>Task List Detail Page</h5>

            <div className="flex flex-col gap-4">

                <div className="hidden md:flex gap-4 items-center border-b pb-2
                     font-bold text-center">

                    <div className="flex-1 justify-center text-center">Title</div>
                    <div className="flex-1 justify-center text-center">Description</div>
                    <div className="flex-1 justify-center text-center">Start Date</div>
                    <div className="flex-1 justify-center text-center">Due Date</div>
                    <div className="flex-1 justify-center text-center">Completed</div>
                    <div className="flex-1 justify-center text-center">Date of Completion</div>
                    <div className="flex-1 justify-center text-center">Actions</div>
                    
                </div>

                {taskItems?.items.map(item => (
                    <div key={item.id} 
                        className={`flex flex-col md:flex-row gap-4 
                            items-start md:items-center ${getItemClassName(item)}`}>

                        <div className="flex-1 justify-center text-center">
                            {item.title}
                        </div>

                        <div className="flex-1 justify-center text-center">
                            {item.description}
                        </div>

                        <div className="flex-1 justify-center text-center">
                            {item.startDate ?
                             new Date(item.startDate).toLocaleDateString() : 
                             '-'}
                        </div>

                        <div className="flex-1 justify-center text-center">
                            {new Date(item.dueDate).toLocaleDateString()}
                        </div>

                        <div className="flex-1 justify-center text-center">
                            {item.isCompleted ? 'Yes' : 'No'}
                        </div>
                        
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
};