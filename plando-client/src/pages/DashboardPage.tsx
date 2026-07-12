import { useState, useEffect } from 'react';
import { getTaskItemByUserId } from '../services/taskItemService';
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

    return (
        <section>
            {taskItems.map(item => (
                <div key={item.id}>{item.title}</div>
            ))}
        </section>
    );
};