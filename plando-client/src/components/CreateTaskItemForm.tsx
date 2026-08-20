import { useState, useEffect, useRef } from 'react';
import { createTaskItem } from '../services/taskItemService';
import { getTaskListByUserId } from '../services/taskListService';
import { Guid, TaskItem, TaskList, TaskCategory } from '../types';
import { getTaskCategoriesByUserId } from '../services/taskCategoryService';

interface CreateTaskItemFormProps {
    onCreate: (item: TaskItem) => void;
    defaultTaskListId?: Guid;
}

export const CreateTaskItemForm = ({ onCreate, defaultTaskListId }: CreateTaskItemFormProps) => {

    const [showCreate, setShowCreate] = useState(false);

    const [taskLists, setTaskLists] = useState<TaskList[] | null>(null);
    const userId = localStorage.getItem('userId');

    const [createTitle, setCreateTitle] = useState('');
    const [createDescription, setCreateDescription] = useState('');
    const [createStartDate, setCreateStartDate] = useState('');
    const [createDueDate, setCreateDueDate] = useState('');
    const [createTaskListId, setCreateTaskListId] =
        useState<Guid | null>(defaultTaskListId ?? null);
    const [pageSize] = useState<number | null>(null);
    const [categoryId, setCategoryId] = useState<Guid | null>(null);
    const [categoriesList, setCategoriesList] = useState<TaskCategory[] | null>(null);
    const [isImportant, setIsImportant] = useState<boolean>(false);
    const [isUrgent, setIsUrgent] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            const lists = await getTaskListByUserId();
            setTaskLists(lists);
            const categories = await getTaskCategoriesByUserId();
            setCategoriesList(categories);
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        const item = await createTaskItem(
            createTitle,
            createDescription,
            userId!,
            new Date(createDueDate),
            createTaskListId || null,
            createStartDate ? new Date(createStartDate) : null,
            categoryId || null,
            isImportant,
            isUrgent
        );

        onCreate(item);
    };

    const recognitionRef = useRef<any>(null);

    const handleVoiceInput = (setter: (text: string) => void,
        field: 'title' | 'description') => {
        if (listeningField === field) {
            recognitionRef.current?.stop();
            setListeningField(null);
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.onresult = (event: any) => {
            const text = event.results[0][0].transcript;
            setter(text);
            setListeningField(null);
        };
        recognitionRef.current.onerror = (event: any) => {
            if (event.error !== 'aborted') {
                setListeningField(null);
            }
        };
        recognitionRef.current.start();
        setListeningField(field);
    };

    const [listeningField, setListeningField] = useState<'title' | 'description' | null>(null);

    const getVoiceButtonClass = (field: 'title' | 'description') => {
        return listeningField === field
            ? "bg-red-400 text-white px-2 py-1 rounded"
            : "bg-gray-200 px-2 py-1 rounded";
    };

    return (
        <section className="p-2">
            <button onClick={() => setShowCreate(!showCreate)}>
                ▼ Create Task
            </button>
            {showCreate &&
                <form aria-label="create-task-form" onSubmit={handleSubmit}
                    className="flex flex-col gap-4 mb-8 w-full border p-2">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>

                            <label>Title</label>
                            <div className="flex gap-2 items-center">
                                <input
                                    className="border rounded p-2 flex-1"
                                    type="text" onChange={e => setCreateTitle(e.target.value)}
                                    value={createTitle} />
                                <button
                                    type="button"
                                    className={`${getVoiceButtonClass('title')} shrink-0 self-stretch`}
                                    onClick={() => handleVoiceInput(setCreateTitle, 'title')}>🎤</button>
                            </div>

                        </div>

                        <div>

                            <label>Description</label>
                            <div className="flex gap-2 items-center">
                                <textarea
                                    rows={1}
                                    className="border rounded p-2 flex-1"
                                    onChange={e => setCreateDescription(e.target.value)}
                                    value={createDescription}></textarea>
                                <button
                                    type="button"
                                    className={`${getVoiceButtonClass('description')} shrink-0 self-stretch`}
                                    onClick={() => handleVoiceInput(setCreateDescription, 'description')}>
                                    🎤</button>
                            </div>

                        </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>

                            <label>Start Date</label>
                            <input
                                className="flex flex-1 border rounded gap-2 p-2 w-full"
                                type="date" onChange={e => setCreateStartDate(e.target.value)} />

                        </div>

                        <div>

                            <label>Due Date</label>
                            <input
                                className="flex flex-1 border rounded gap-2 p-2 w-full"
                                type="date" onChange={e => setCreateDueDate(e.target.value)} />

                        </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>

                            <label>Task List</label>
                            <select className="flex flex-1 border rounded gap-2 p-2 w-full"
                                disabled={!!defaultTaskListId}
                                value={createTaskListId || ''}
                                onChange={e => setCreateTaskListId(e.target.value)}>
                                <option value="">None</option>
                                {taskLists?.map(list => (
                                    <option key={list.id} value={list.id}>{list.name}</option>
                                ))}
                            </select>

                        </div>

                        <div>

                            <label>Task Category</label>
                            <select className="flex flex-1 border rounded gap-2 p-2 w-full"
                                value={categoryId || ''}
                                onChange={e => setCategoryId(e.target.value)}>
                                <option value="">None</option>
                                {categoriesList?.map(list => (
                                    <option key={list.id} value={list.id}>{list.name}</option>
                                ))}
                            </select>

                        </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div className="flex items-center justify-center h-full border bg-gray-50 p-2">

                            <label>Is Important</label>
                            <input
                                className="ml-2 mt-1 align-middle"
                                type="checkbox"
                                checked={isImportant}
                                onChange={e => setIsImportant(e.target.checked)} />

                        </div>

                        <div className="flex items-center justify-center h-full border bg-gray-50 p-2">

                            <label>Is Urgent</label>
                            <input
                                className="ml-2 mt-1 align-middle"
                                type="checkbox"
                                checked={isUrgent}
                                onChange={e => setIsUrgent(e.target.checked)} />
                                
                        </div>

                    </div>

                    <button className="bg-blue-500 text-white px-4 py-2 rounded">Create</button>

                </form>
            }
        </section>
    );
};