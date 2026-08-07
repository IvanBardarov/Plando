import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import '@testing-library/jest-dom';
import { getNoteById, updateNote, deleteNote } from '../services/noteService';
import { NoteDetailPage } from "./NoteDetailPage";

jest.mock('../services/noteService');

beforeEach(() => {
    (getNoteById as jest.Mock)
        .mockResolvedValue({ id: '1', content: 'Text content', taskItemId: '2' });
    (updateNote as jest.Mock).mockResolvedValue({});
    (deleteNote as jest.Mock).mockResolvedValue({});
});

jest.mock('react-router-dom', () => ({
    useParams: () => ({ id: '1' }),
    useNavigate: () => jest.fn()
}));

describe('NoteDetailPage', () => {

    it('should render note correctly', async () => {
        render(<NoteDetailPage />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'Update Note' }));
        });
    });

    it('should call updateNote correctly', async () => {
        const updateNoteMock = updateNote;
        render(<NoteDetailPage />);

        fireEvent.click(screen.getByRole('button', { name: 'Update Note' }));

        await waitFor(() => {
            expect(updateNoteMock).toHaveBeenCalled();
        });
    });

    it('should call deleteNote correctly', async () => {
        const deleteNoteMock = deleteNote;
        render(<NoteDetailPage />);

        fireEvent.click(screen.getByRole('button', { name: 'Delete Note' }));

        await waitFor(() => {
            expect(deleteNoteMock).toHaveBeenCalled();
        });
    });

});