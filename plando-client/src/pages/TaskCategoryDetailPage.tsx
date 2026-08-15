import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { updateTaskCategory, deleteTaskCategory, getTaskCategoryById } from '../services/taskCategoryService';
import { TaskCategory } from '../types';

export const TaskCategoryDetailPage = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [taskCategory, setTaskCategory] = useState<TaskCategory>(null!);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const taskCategory = await getTaskCategoryById(id!);
                setTaskCategory(taskCategory);
                setName(taskCategory.name);
                setDescription(taskCategory.description);
            }
            catch (e) {
                console.error('fetchData error:', e);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        const updatedTaskCategory = await updateTaskCategory(id!, name, description);
        setTaskCategory(updatedTaskCategory);
    };

    const handleDelete = async (id: string) => {
        await deleteTaskCategory(id);
        navigate('/taskcategories');
    };

    return (
        <section
            className="p-8">

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

                <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={(e) => { e.stopPropagation(); handleDelete(taskCategory.id); }}>
                    Delete
                </button>

            </form>

        </section>
    );

}