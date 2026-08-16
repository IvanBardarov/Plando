import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getTaskItemById, updateTaskItem } from '../services/taskItemService';
import { Guid, TaskItem, TaskList, Note, TaskCategory } from '../types';
import { getTaskListByUserId } from '../services/taskListService';
import { getTaskCategoriesByUserId } from '../services/taskCategoryService';
import { createNote, getNotesByTaskItemId, deleteNote } from '../services/noteService';

export const TaskItemDetailPage = () => {

    const { id } = useParams();
    const [taskItem, setTaskItem] = useState<TaskItem | null>(null);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [dueDate, setDueDate] = useState<Date | null>(null);

    const [taskLists, setTaskLists] = useState<TaskList[] | null>(null);
    const [taskListId, setTaskListId] = useState<Guid | null>(null);

    const [notes, setNotes] = useState<Note[] | null>(null);

    const [categoryId, setCategoryId] = useState<Guid | null>(null);
    const [categoriesList, setCategoriesList] = useState<TaskCategory[] | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const taskItem = await getTaskItemById(id!);
                setTaskItem(taskItem);
                setTitle(taskItem?.title ?? '');
                setDescription(taskItem?.description ?? '');
                const lists = await getTaskListByUserId();
                setTaskLists(lists);
                setTaskListId(taskItem?.taskListId ?? null);
                setStartDate(taskItem?.startDate ? new Date(taskItem?.startDate) : null);
                setDueDate(taskItem?.dueDate ? new Date(taskItem?.dueDate) : null);
                const notes = await getNotesByTaskItemId(id!);
                setNotes(notes);
                const categories = await getTaskCategoriesByUserId();
                setCategoriesList(categories);
                setCategoryId(taskItem?.categoryId ?? null);
            }
            catch (e) {
                console.error('fetchData error:', e);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        const item = await updateTaskItem(
            id!, title, description, startDate, dueDate!, taskListId, categoryId);

        setTaskItem(item);
    };

    const [noteContent, setNoteContent] = useState('');

    const handleNoteSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        const note = await createNote(noteContent, id!);

        setNoteContent('');

        const newNotes = [...(notes ?? []), note];
        setNotes(newNotes);
    };

    const handleNoteDelete = async (id: Guid) => {
        await deleteNote(id);
        setNotes(prev => (prev ?? []).filter(note => note.id !== id));
    };

    return (
        <section className="p-2">

            <div className="border p-2">

                <div className="flex flex-col md:flex-row items-center gap-2 mt-2">
                    <label>Title</label>
                    <input
                        className="border rounded p-2 w-full md:flex-1"
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)} />
                </div>

                <div className="flex flex-col md:flex-row items-center gap-2 mt-2">
                    <label>Description</label>
                    <textarea
                        rows={1}
                        className="border rounded p-2 w-full md:flex-1"
                        value={description}
                        onChange={e => setDescription(e.target.value)}></textarea>
                </div>

                <div className="flex flex-row flex-wrap gap-0">
                    <div className="flex flex-col md:flex-row items-center gap-2 mt-2 w-full md:w-1/2 pr-2">
                        <label className="whitespace-nowrap">Start Date</label>
                        <input
                            className="border rounded p-2 w-full"
                            type="date"
                            value={startDate ? new Date(startDate).toISOString().split('T')[0] : ''}
                            onChange={e => setStartDate(e.target.value ? new Date(e.target.value) : null)} />
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-2 mt-2 w-full md:w-1/2 pr-2">
                        <label className="whitespace-nowrap">Due Date</label>
                        <input
                            className="border rounded p-2 w-full"
                            type="date"
                            value={dueDate ? dueDate.toISOString().split('T')[0] : ''}
                            onChange={e => setDueDate(e.target.value ? new Date(e.target.value) : null)} />
                    </div>
                </div>

                <div className="flex flex-row flex-wrap gap-0">
                    <div className="flex flex-col md:flex-row items-center gap-2 mt-2 w-full md:w-1/2 pr-2">
                        <label className="whitespace-nowrap">Task List</label>
                        <select className="border rounded p-2 w-full md:flex-1"
                            value={taskListId || ''}
                            onChange={e => setTaskListId(e.target.value)}>
                            <option value="">None</option>
                            {taskLists?.map(list => (
                                <option key={list.id} value={list.id}>{list.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-2 mt-2 w-full md:w-1/2 pr-2">
                        <label className="whitespace-nowrap">Task Category</label>
                        <select className="border rounded p-2 w-full md:flex-1"
                            value={categoryId || ''}
                            onChange={e => setCategoryId(e.target.value)}>
                            <option value="">None</option>
                            {categoriesList?.map(list => (
                                <option key={list.id} value={list.id}>{list.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded w-full md:flex-1 mt-4"
                    onClick={handleSubmit}>Save</button>

            </div>

            <div className="border p-2 mt-4">
                <form onSubmit={handleNoteSubmit} className="flex flex-col md:flex-row items-center gap-2">
                    <textarea
                        className="border rounded p-2 flex-1 w-full"
                        value={noteContent}
                        onChange={e => setNoteContent(e.target.value)}></textarea>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded md:self-end"
                        type="submit">Save Note</button>
                </form>

                {notes?.map(note => (
                    <div key={note.id}
                        className="border p-2 w-full mt-2 flex flex-col md:flex-row items-center justify-between gap-2">
                        <div>{note.content}</div>
                        <div className="flex gap-2">
                            <Link
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                to={`/notes/${note.id}`}>Details</Link>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded"
                                onClick={() => handleNoteDelete(note.id)}>Delete Note</button>
                        </div>
                    </div>
                ))}

            </div>

        </section>
    );
};