import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTaskItemByUserId } from '../services/taskItemService';
import { getItemClassName } from '../utils/taskItemUtils';
import { useTaskItems } from '../hooks/useTaskItems';
import { CreateTaskItemForm } from '../components/CreateTaskItemForm';
import { Guid } from '../types';

export const DashboardPage = () => {

    const [showFilter, setShowFilter] = useState(false);

    const { taskItems, setTaskItems, handleComplete, handleDelete } = useTaskItems();

    const navigate = useNavigate();
    const [page, setPage] = useState<number | null>(null);
    const [pageSize] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const items = await getTaskItemByUserId(
                null, null, null, null, null, null, null, null, null, null, null, pageSize
            );
            setTaskItems(items);
        };
        fetchData();
    }, []);

    // for Filter form
    const [filterTitle, setFilterTitle] = useState('');
    const [filterDescription, setFilterDescription] = useState('');
    const [filterTaskListId, setFilterTaskListId] = useState<Guid | null>(null);

    const [createdAtFrom, setCreatedAtFrom] = useState<Date | null>(null);
    const [createdAtTo, setCreatedAtTo] = useState<Date | null>(null);
    const [dueDateFrom, setDueDateFrom] = useState<Date | null>(null);
    const [dueDateTo, setDueDateTo] = useState<Date | null>(null);
    const [completedAtFrom, setCompletedAtFrom] = useState<Date | null>(null);
    const [completedAtTo, setCompletedAtTo] = useState<Date | null>(null);
    const [isCompleted, setIsCompleted] = useState<boolean | null>(null);

    const handleFilter = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        const items = await getTaskItemByUserId(
            filterTaskListId,
            filterTitle,
            filterDescription,
            createdAtFrom,
            createdAtTo,
            dueDateFrom,
            dueDateTo,
            completedAtFrom,
            completedAtTo,
            isCompleted,
            page,
            pageSize
        );
        setTaskItems(items);
    };

    const handlePageChange = async (newPage: number) => {
        setPage(newPage);
        const items = await getTaskItemByUserId(
            filterTaskListId, filterTitle, filterDescription, createdAtFrom, createdAtTo,
            dueDateFrom, dueDateTo, completedAtFrom, completedAtTo,
            isCompleted, newPage, pageSize
        );
        setTaskItems(items);
    };

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

            <div>
                <button onClick={() => setShowFilter(!showFilter)}>
                    ▼ Show Filter
                </button>
                {showFilter &&
                    <form onSubmit={handleFilter}
                        className="flex flex-col gap-4 mb-8 w-full border p-2">

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                            <div className="flex flex-col gap-1 md:col-span-2">

                                <label>Title</label>
                                <input
                                    className="border rounded p-2"
                                    type="text" onChange={e => setFilterTitle(e.target.value)} />

                            </div>

                            <div className="flex flex-col gap-1 md:col-span-2">

                                <label>Description</label>
                                <textarea
                                    rows={1}
                                    className="border rounded p-2"
                                    onChange={e => setFilterDescription(e.target.value)}></textarea>

                            </div>

                            <div className="flex flex-col gap-1">

                                <label>From Date of Creation</label>
                                <input
                                    className="border rounded p-2"
                                    type="date" onChange={e =>
                                        setCreatedAtFrom(e.target.value ? new Date(e.target.value) : null)} />

                            </div>

                            <div className="flex flex-col gap-1">

                                <label>To Date of Creation</label>
                                <input
                                    className="border rounded p-2"
                                    type="date" onChange={e =>
                                        setCreatedAtTo(e.target.value ? new Date(e.target.value) : null)} />

                            </div>

                            <div className="flex flex-col gap-1">

                                <label>From Due Date</label>
                                <input
                                    className="border rounded p-2"
                                    type="date" onChange={e =>
                                        setDueDateFrom(e.target.value ? new Date(e.target.value) : null)} />

                            </div>

                            <div className="flex flex-col gap-1">

                                <label>To Due Date</label>
                                <input
                                    className="border rounded p-2"
                                    type="date" onChange={e =>
                                        setDueDateTo(e.target.value ? new Date(e.target.value) : null)} />

                            </div>

                            <div className="flex flex-col gap-1">

                                <label>From Date of Completion</label>
                                <input
                                    className="border rounded p-2"
                                    type="date" onChange={e =>
                                        setCompletedAtFrom(e.target.value ? new Date(e.target.value)
                                            : null)} />

                            </div>

                            <div className="flex flex-col gap-1">

                                <label>To Date of Completion</label>
                                <input
                                    className="border rounded p-2"
                                    type="date" onChange={e =>
                                        setCompletedAtTo(e.target.value ? new Date(e.target.value) : null)} />

                            </div>

                            <div className="flex flex-col gap-1">

                                <label>Is Task Competed</label>
                                <select className="border rounded p-2"
                                    onChange={e =>
                                        setIsCompleted(e.target.value === ''
                                            ? null : e.target.value === 'true')}>
                                    <option value="">All</option>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>

                            </div>

                            <div className="flex flex-col gap-1">

                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded mt-7">
                                    Filter
                                </button>

                            </div>

                        </div>

                    </form>
                }
            </div>

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

                <div className="flex gap-2 items-center justify-center mt-4">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                        disabled={taskItems?.page === 1}
                        onClick={() => handlePageChange(taskItems!.page - 1)}>
                        Previous
                    </button>
                    <span>{taskItems?.page} / {taskItems?.totalPages}</span>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                        disabled={taskItems?.page === taskItems?.totalPages}
                        onClick={() => handlePageChange(taskItems!.page + 1)}>
                        Next
                    </button>
                </div>

            </div>

        </section>
    );
}