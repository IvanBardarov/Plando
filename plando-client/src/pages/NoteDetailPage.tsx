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
    };

    const handleNoteDelete = async (id: Guid) => {
        await deleteNote(id);
        navigate(`/Tasks/${taskItemId}/Details`);
    };

    return (
        <section
            className="flex items-center gap-2">
            <form onSubmit={handleSubmit}>
                <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}></textarea>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    type="submit">Update Note</button>
            </form>

            <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => handleNoteDelete(id!)}>Delete Note</button>

        </section>);
};