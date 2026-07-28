import { useState, useEffect, useRef } from 'react';
import { createTaskItem } from '../services/taskItemService';
import { getTaskListByUserId } from '../services/taskListService';
import { Guid, TaskItem, TaskList } from '../types';

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

    useEffect(() => {
        const fetchData = async () => {
            const lists = await getTaskListByUserId();
            setTaskLists(lists);
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
            createStartDate ? new Date(createStartDate) : null);

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
        <div>
            <button onClick={() => setShowCreate(!showCreate)}>
                ▼ Create Task
            </button>
            {showCreate &&
                <form aria-label="create-task-form" onSubmit={handleSubmit}
                    className="flex flex-col md:flex-row items-center gap-2 mb-8 w-full">

                    <label>Title</label>
                    <input
                        className="border rounded p-2 w-full md:flex-1"
                        type="text" onChange={e => setCreateTitle(e.target.value)}
                        value={createTitle} />
                    <button
                        type="button"
                        className={`${getVoiceButtonClass('title')}`}
                        onClick={() => handleVoiceInput(setCreateTitle, 'title')}>🎤</button>

                    <label>Description</label>
                    <textarea
                        rows={1}
                        className="border rounded p-2 w-full md:flex-1"
                        onChange={e => setCreateDescription(e.target.value)}
                        value={createDescription}></textarea>
                    <button
                        type="button"
                        className={`${getVoiceButtonClass('description')}`}
                        onClick={() => handleVoiceInput(setCreateDescription, 'description')}>
                        🎤</button>

                    <label>Start Date</label>
                    <input
                        className="border rounded p-2 w-full md:flex-1"
                        type="date" onChange={e => setCreateStartDate(e.target.value)} />

                    <label>Due Date</label>
                    <input
                        className="border rounded p-2 w-full md:flex-1"
                        type="date" onChange={e => setCreateDueDate(e.target.value)} />

                    <label>Task List</label>
                    <select className="border rounded p-2 w-56 shrink-0"
                        disabled={!!defaultTaskListId}
                        value={createTaskListId || ''}
                        onChange={e => setCreateTaskListId(e.target.value)}>
                        <option value="">None</option>
                        {taskLists?.map(list => (
                            <option key={list.id} value={list.id}>{list.name}</option>
                        ))}
                    </select>

                    <button className="bg-blue-500 text-white px-4 py-2 rounded">Create</button>

                </form>
            }
        </div>
    );
};