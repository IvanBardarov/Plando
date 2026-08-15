import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getTaskCategoriesByUserId,
    createTaskCategory,
    deleteTaskCategory
} from '../services/taskCategoryService';
import { TaskCategory } from '../types';

export const TaskCategoriesPage = () => {

    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [taskCategoryList, setTaskCategoryList] = useState<TaskCategory[]>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const taskCategories = await getTaskCategoriesByUserId();
                setTaskCategoryList(taskCategories);
            }
            catch (e) { console.error('fetchData error:', e) };
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        const newTaskCategory = await createTaskCategory(name, description);
        setTaskCategoryList(prev => [...(prev ?? []), newTaskCategory]);
        setName('');
        setDescription('');
    };

    const handleDelete = async (id: string) => {
        await deleteTaskCategory(id);
        setTaskCategoryList(prev => (prev ?? []).filter(tc => tc.id !== id));
    };

    return (
        <section className="p-8">

            <form onSubmit={handleSubmit}
                className="flex flex-col md:flex-row items-center gap-2 mb-8 w-full">
                <label>Name</label>
                <input
                    className="border rounded p-2 w-full md:flex-1"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)} />

                <label>Description</label>
                <input
                    className="border rounded p-2 w-full md:flex-1"
                    type="text"
                    value={description}
                    onChange={e => setDescription(e.target.value)} />

                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    type="submit">
                    Save
                </button>

            </form>

            <div className="flex flex-col gap-4">

                <div
                    className="hidden md:flex gap-4 items-center border-b pb-2 font-bold text-center">
                    <div className="flex-1 justify-center text-center">Name</div>
                    <div className="flex-1 justify-center text-center">Description</div>
                </div>

                {taskCategoryList?.map(taskCategory => (
                    <div key={taskCategory.id}
                        className='flex flex-col md:flex-row gap-4 
                            items-start md:items-center'
                        onClick={() => navigate(`/TaskCategories/${taskCategory.id}`)}>

                        <div className="flex-1 justify-center text-center">
                            {taskCategory.name}
                        </div>

                        <div className="flex-1 justify-center text-center">
                            {taskCategory.description}
                        </div>

                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded"
                            onClick={(e) => { e.stopPropagation(); handleDelete(taskCategory.id); }}>
                            Delete
                        </button>

                    </div>


                ))}

            </div>

        </section>
    );
};