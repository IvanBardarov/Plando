import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import { getTaskItemByUserId } from '../services/taskItemService';
import { getItemClassName } from '../utils/taskItemUtils';
import { useTaskItems } from '../hooks/useTaskItems';
import { FilterValues, TaskListColor } from '../types';
import { CreateTaskItemForm } from '../components/CreateTaskItemForm';
import { FilterTaskItemsForm } from '../components/FilterTaskItemsForm';
import { Pagination } from '../components/Pagination';
import { getTaskListById, updateTaskList, deleteTaskList } from '../services/taskListService';

export const TaskListDetailPage = () => {

    const params = useParams();
    const { id } = params;

    const navigate = useNavigate();

    const { taskItems, setTaskItems, handleComplete, handleDelete } = useTaskItems();

    const [currentFilters, setCurrentFilters] = useState<FilterValues | null>({
        taskListId: id || null,
        title: null,
        description: null,
        createdAtFrom: null,
        createdAtTo: null,
        dueDateFrom: null,
        dueDateTo: null,
        completedAtFrom: null,
        completedAtTo: null,
        isCompleted: null,
        page: null,
        pageSize: null
    });

    const [name, setName] = useState('');
    const [color, setColor] = useState<TaskListColor>();

    useEffect(() => {
        const fetchDate = async () => {
            const items = await getTaskItemByUserId(
                id || null, null, null, null, null, null, null, null, null, null, null, null);
            setTaskItems(items);
            const taskList = await getTaskListById(id!);
            setName(taskList.name);
            setColor(taskList.color);
        };
        fetchDate();
    }, []);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        const taskList = await updateTaskList(id!, name, color!);
        setName(taskList.name);
        setColor(taskList.color);
    };

    const handleTaskListDelete = async (id: string) => {
        await deleteTaskList(id);
        navigate('/tasklists');
    };

    return (
        <section className="p-8">

            <h5>Task List Detail Page</h5>

            <form onSubmit={handleSubmit}
                className="flex flex-col md:flex-row items-center gap-2 mb-8 w-full">

                <label>Task List Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)} />

                <label>Task List Color</label>
                <select
                    value={color}
                    onChange={e => setColor(Number(e.target.value))}>
                    {Object.entries(TaskListColor).map(([key, value]) => (
                        <option key={value} value={value}>{key}</option>
                    ))}
                </select>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded">
                    Update Task List
                </button>
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => handleTaskListDelete(id!)}>
                    Delete
                </button>

            </form>

            <CreateTaskItemForm
                defaultTaskListId={id}
                onCreate={async () => {
                    const items = await getTaskItemByUserId(
                        id || null, null, null, null, null, null, null, null, null, null, null, null
                    );
                    setTaskItems(items);
                }} />

            <FilterTaskItemsForm
                defaultTaskListId={id}
                onFilter={async (items) => setTaskItems(items)}
                onFiltersChange={setCurrentFilters} />

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
                            items-start md:items-center ${getItemClassName(item)}`}
                        onClick={() => navigate(`/tasks/${item.id}/details`)}>

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

                {taskItems && (
                    <Pagination
                        taskItems={taskItems}
                        filters={currentFilters}
                        onPageChange={setTaskItems} />
                )}

            </div>

        </section>
    );
};