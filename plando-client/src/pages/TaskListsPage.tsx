import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getTaskListByUserId,
    createTaskList,
    deleteTaskList
} from '../services/taskListService';
import { TaskList, TaskListColor } from '../types';

export const TaskListsPage = () => {

    const [showCreate, setShowCreate] = useState(false);

    const [taskLists, setTaskLists ] = useState<TaskList[] | null>(null);
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDate = async () => {
            const lists = await getTaskListByUserId();
            setTaskLists(lists);
        };
        fetchDate();
    }, []);

    // for Create form
    const [createName, setCreateName] = useState('');
    const [createColor, setCreateColor] = useState<TaskListColor>(0);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        await createTaskList(createName, userId!, createColor);
        const lists = await getTaskListByUserId();
        setTaskLists(lists);
    };

    const handleDelete = async (id: string) => {
        await deleteTaskList(id);
        setTaskLists(
            prev => prev ? prev.filter(item => item.id !== id) : null
        );
    };

    const getTaskListColor = (list: TaskList) : string => {
        if(list.color === 1)
            return "border p-4 rounded bg-red-400";
        if(list.color === 2)
            return "border p-4 rounded bg-orange-400";
        if(list.color === 3)
            return "border p-4 rounded bg-yellow-400";
        if(list.color === 4)
            return "border p-4 rounded bg-green-400";
        if(list.color === 5)
            return "border p-4 rounded bg-blue-400";
        if(list.color === 6)
            return "border p-4 rounded bg-purple-400";
        if(list.color === 7)
            return "border p-4 rounded bg-pink-400";
        if(list.color === 8)
            return "border p-4 rounded bg-gray-400";        

        return "border p-4 rounded bg-gray-200";
    };

    return (
        <section className="p-8">

            <div className="flex justify-end mb-4">
                <button className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => navigate('/tasks')}>
                    Tasks
                </button>
            </div>

            <div>
                <button onClick={() => setShowCreate(!showCreate)}>
                    ▼ Create List
                </button>
                {showCreate && 
                    <form onSubmit={handleSubmit}
                        className="flex flex-col md:flex-row items-center gap-2 mb-8 w-full">
                        
                        <label>Name</label>
                        <input 
                            className="border rounded p-2"
                            type="text" onChange={e => setCreateName(e.target.value)}
                            value={createName}/>

                        <label>Color</label>
                        <select className="border rounded p-2"
                            onChange={e => setCreateColor(Number(e.target.value))}>
                            <option value="0">None</option>
                            <option value="1">Red</option>
                            <option value="2">Orange</option>
                            <option value="3">Yellow</option>
                            <option value="4">Green</option>
                            <option value="5">Blue</option>
                            <option value="6">Purple</option>
                            <option value="7">Pink</option>
                            <option value="8">Gray</option>
                        </select>

                        <button className="bg-blue-500 text-white px-4 py-2 rounded">Create</button>

                    </form>
                }
            </div>

            <div className="flex flex-col gap-4">

                <div 
                    className="hidden md:flex gap-4 items-center border-b pb-2 font-bold text-center">

                    <div className="flex-1 justify-center text-center">Name</div>
                    <div className="flex-1 justify-center text-center">Date of Creation</div>

                </div>

                {taskLists?.map(item => (
                    <div key={item.id} 
                        className={`flex flex-col md:flex-row gap-4 
                            items-start md:items-center ${getTaskListColor(item)}`}
                        onClick={ () => navigate(`/tasklists/${item.id}`)}>

                        <div className="flex-1 justify-center text-center">
                            {item.name}
                        </div>

                        <div className="flex-1 justify-center text-center">
                            {new Date(item.createdAt).toLocaleDateString()}
                        </div>

                        <div className="flex gap-2">

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