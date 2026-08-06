import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getTaskItemById, updateTaskItem } from '../services/taskItemService';
import { Guid, TaskItem, TaskList, Note } from '../types';
import { getTaskListByUserId } from '../services/taskListService';
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
            id!, title, description, startDate, dueDate!, taskListId);

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
        <section>

            <label>Title</label>
            <input
                className="border rounded p-2 w-full md:flex-1"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)} />

            <label>Description</label>
            <textarea
                rows={1}
                className="border rounded p-2 w-full md:flex-1"
                value={description}
                onChange={e => setDescription(e.target.value)}></textarea>

            <label>Start Date</label>
            <input
                className="border rounded p-2 w-full md:flex-1"
                type="date"
                value={startDate ? new Date(startDate).toISOString().split('T')[0] : ''}
                onChange={e => setStartDate(e.target.value ? new Date(e.target.value) : null)} />

            <label>Due Date</label>
            <input
                className="border rounded p-2 w-full md:flex-1"
                type="date"
                value={dueDate ? dueDate.toISOString().split('T')[0] : ''}
                onChange={e => setDueDate(e.target.value ? new Date(e.target.value) : null)} />

            <label>Task List</label>
            <select className="border rounded p-2 w-56 shrink-0"
                value={taskListId || ''}
                onChange={e => setTaskListId(e.target.value)}>
                <option value="">None</option>
                {taskLists?.map(list => (
                    <option key={list.id} value={list.id}>{list.name}</option>
                ))}
            </select>

            <form onSubmit={handleNoteSubmit}>
                <textarea
                    value={noteContent}
                    onChange={e => setNoteContent(e.target.value)}></textarea>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    type="submit">Save Note</button>
            </form>

            {notes?.map(note => (
                <div key={note.id}
                    className="flex items-center gap-2">
                    <div>{note.content}</div>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded"
                        onClick={() => handleNoteDelete(note.id)}>Delete Note</button>
                </div>
            ))}

            <button
                type="submit"
                onClick={handleSubmit}>Save</button>

        </section>
    );
};