import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { getNoteById, updateNote, deleteNote } from '../services/noteService';
import { Guid, Note } from '../types';

export const NoteDetailPage = () => {
    const { id } = useParams();

    const [note, setNote] = useState<Note | null>(null);
    const [content, setContent] = useState('');
    const [taskItemId, setTaskItemId] = useState<Guid | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const note = await getNoteById(id!);
                setNote(note);
                setContent(note.content);
                setTaskItemId(note.taskItemId);
            }
            catch (e) {
                console.error('NoteDetailPage fetch error:', e);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        const note = await updateNote(id!, content);
        setNote(note);
        navigate(`/tasks/${taskItemId}/details`);
    };

    const handleNoteDelete = async (id: Guid) => {
        await deleteNote(id);
        navigate(`/tasks/${taskItemId}/details`);
    };

    return (
        <section
            className="p-2">

            <div className="border p-2 mt-4 flex flex-col md:flex-row items-center gap-2">
                <textarea
                    className="border rounded p-2 flex-1 w-full"
                    value={content}
                    onChange={e => setContent(e.target.value)}></textarea>
                <div className="flex gap-2 md:self-end ml-auto">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={handleSubmit}>Update Note</button>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded"
                        onClick={() => handleNoteDelete(id!)}>Delete Note</button>
                </div>
            </div>

        </section>);
};