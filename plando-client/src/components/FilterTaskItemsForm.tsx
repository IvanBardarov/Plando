import { useState, useEffect } from 'react';
import { getTaskItemByUserId } from '../services/taskItemService';
import { getTaskListByUserId } from '../services/taskListService';
import {
    Guid,
    TaskItem,
    PagedResultDto,
    TaskList,
    FilterValues
} from '../types';

interface FilterTaskItemsFormProps {
    onFilter: (items: PagedResultDto<TaskItem>) => void;
    onFiltersChange: (filters: FilterValues) => void;
    defaultTaskListId?: Guid;
}

export const FilterTaskItemsForm =
 ({ onFilter, onFiltersChange, defaultTaskListId }: FilterTaskItemsFormProps) => {

    const [showFilter, setShowFilter] = useState(false);

    const [taskLists, setTaskLists] = useState<TaskList[] | null>(null);

    const [filterTitle, setFilterTitle] = useState('');
    const [filterDescription, setFilterDescription] = useState('');
    const [filterTaskListId, setFilterTaskListId] =
        useState<Guid | null>(defaultTaskListId ?? null);

    const [createdAtFrom, setCreatedAtFrom] = useState<Date | null>(null);
    const [createdAtTo, setCreatedAtTo] = useState<Date | null>(null);
    const [dueDateFrom, setDueDateFrom] = useState<Date | null>(null);
    const [dueDateTo, setDueDateTo] = useState<Date | null>(null);
    const [completedAtFrom, setCompletedAtFrom] = useState<Date | null>(null);
    const [completedAtTo, setCompletedAtTo] = useState<Date | null>(null);
    const [isCompleted, setIsCompleted] = useState<boolean | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const lists = await getTaskListByUserId();
            setTaskLists(lists);
        };
        fetchData();
    }, []);

    const handleFilter = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        const filters: FilterValues = {
            taskListId: filterTaskListId,
            title: filterTitle,
            description: filterDescription,
            createdAtFrom,
            createdAtTo,
            dueDateFrom,
            dueDateTo,
            completedAtFrom,
            completedAtTo,
            isCompleted,
            page: null,
            pageSize: null
        };

        onFiltersChange(filters);

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
            null,
            null
        );
        onFilter(items);
    };

    return (
        <div>
            <button onClick={() => setShowFilter(!showFilter)}>
                ▼ Show Filter
            </button>
            {showFilter &&
                <form aria-label="filter-tasks-form" onSubmit={handleFilter}
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

                            <label>Task List</label>
                            <select className="border rounded p-2 w-56 shrink-0"
                                disabled={!!defaultTaskListId}
                                value={filterTaskListId || ''}
                                onChange={e => setFilterTaskListId(e.target.value)}>
                                <option value="">None</option>
                                {taskLists?.map(list => (
                                    <option key={list.id} value={list.id}>{list.name}</option>
                                ))}
                            </select>

                        </div>

                    </div>

                    <div className="flex flex-col gap-1">

                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-7">
                            Filter
                        </button>

                    </div>

                </form>
            }
        </div>
    );
};