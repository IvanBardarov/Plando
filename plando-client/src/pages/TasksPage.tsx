import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTaskItemByUserId } from '../services/taskItemService';
import { getItemClassName } from '../utils/taskItemUtils';
import { useTaskItems } from '../hooks/useTaskItems';
import { CreateTaskItemForm } from '../components/CreateTaskItemForm';
import { FilterValues } from '../types';
import { FilterTaskItemsForm } from '../components/FilterTaskItemsForm';
import { Pagination } from '../components/Pagination';

export const TasksPage = () => {

    const { taskItems, setTaskItems, handleComplete, handleDelete } = useTaskItems();

    const navigate = useNavigate();

    const [pageSize] = useState<number | null>(null);

    const [currentFilters, setCurrentFilters] = useState<FilterValues | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const items = await getTaskItemByUserId(
                null, null, null, null, null, null, null, null, null, null, null, pageSize
            );
            setTaskItems(items);
        };
        fetchData();
    }, []);

    return (
        <section className="p-8">
            <div className="flex justify-end mb-4">
                <button className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => navigate('/tasklists')}>
                    Task Lists
                </button>
            </div>

            <CreateTaskItemForm onCreate={async () => {
                const items = await getTaskItemByUserId(
                    null, null, null, null, null, null, null, null, null, null, null, pageSize
                );
                setTaskItems(items);
            }} />

            <FilterTaskItemsForm
                onFilter={async (items) => setTaskItems(items)}
                onFiltersChange={setCurrentFilters} />

            <div className="flex flex-col gap-4">

                <div
                    className="hidden md:flex gap-4 items-center border-b pb-2 font-bold text-center">

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
                            items-start md:items-center ${getItemClassName(item)}`}
                        onClick={async () => navigate(`/tasks/${item.id}/details`)}>

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
                                onClick={(e) => { e.stopPropagation(); handleComplete(item.id); }}>
                                Complete
                            </button>

                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded"
                                onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}>
                                Delete
                            </button>

                        </div>
                    </div>
                ))}

                {taskItems && (
                    <Pagination
                        taskItems={taskItems}
                        filters={currentFilters}
                        onPageChange={setTaskItems} />
                )}

            </div>

        </section>
    );
}