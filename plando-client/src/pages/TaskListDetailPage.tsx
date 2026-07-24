import { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import { getTaskItemByUserId } from '../services/taskItemService';

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
                            items-start md:items-center`}>

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

                    </div>                
                ))}

            </div>  

        </section>
    );
};