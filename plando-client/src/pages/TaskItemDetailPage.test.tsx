import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom';
import { TaskItemDetailPage } from './TaskItemDetailPage';
import { getTaskItemById, updateTaskItem } from '../services/taskItemService';
import { getNotesByTaskItemId, createNote, deleteNote, getNoteById } from '../services/noteService';

jest.mock('../services/taskItemService');
jest.mock('../services/noteService');

beforeEach(() => {

    (getTaskItemById as jest.Mock).mockResolvedValue(
        {
            id: "1", title: "Title", description: "Description",
            startDate: new Date("2026-01-01"), dueDate: new Date("2026-01-15"),
            taskListId: "1", categoryId: "1", isImportant: false, isUrgent: false,
            isCompleted: false, completedAt: null, createdAt: new Date(), userId: "1"
        }
    );

    (updateTaskItem as jest.Mock).mockResolvedValue(
        {
        id: "1", title: "Title", description: "Description",
        startDate: new Date("2026-01-01"), dueDate: new Date("2026-01-15"),
        taskListId: "1", categoryId: "1", isImportant: true, isUrgent: true,
        isCompleted: false, completedAt: null, createdAt: new Date(), userId: "1"
        }
    );

    (getNotesByTaskItemId as jest.Mock).mockResolvedValue([
        {
            id: '1',
            content: 'Test note',
            createdAt: new Date(),
            taskItemId: '1',
            userId: '1'
        }
    ]);
    (createNote as jest.Mock).mockResolvedValue({});
    (deleteNote as jest.Mock).mockResolvedValue({});
    (getNoteById as jest.Mock).mockResolvedValue({});
});

jest.mock('../services/taskListService', () => ({
    getTaskListByUserId: jest.fn().mockResolvedValue([])
}));

jest.mock('../services/taskCategoryService', () => ({
    getTaskCategoriesByUserId: jest.fn().mockResolvedValue([])
}));

jest.mock('react-router-dom', () => ({
    useParams: () => ({ id: 'test-list-id' }),
    Link: ({ children, to }: { children: React.ReactNode, to: string }) =>
        <a href={to}>{children}</a>
}));

describe('TaskItemDetailPage', () => {

    it('should render task item correctly', async () => {
        render(<TaskItemDetailPage />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
        });
    });

    it('should call updateTaskItem correctly', async () => {
        const userTaskItemMock = updateTaskItem;
        render(<TaskItemDetailPage />);
        fireEvent.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(userTaskItemMock).toHaveBeenCalled();
        });
    });

    it('should render notes correctly', async () => {
        render(<TaskItemDetailPage />);

        const noteText = await screen.findByText('Test note');

        await waitFor(() => {
            expect(noteText).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Delete Note' })).toBeInTheDocument();
        });
    });

    it('should call create note correctly', async () => {
        const createNoteMock = createNote;
        render(<TaskItemDetailPage />);
        fireEvent.click(screen.getByRole('button', { name: 'Save Note' }));

        await waitFor(() => {
            expect(createNoteMock).toHaveBeenCalled();
        });
    });

    it('should call delete note correctly', async () => {
        const deleteNoteMock = deleteNote;
        render(<TaskItemDetailPage />);

        const deleteButton = await screen.findByRole('button', { name: 'Delete Note' });
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(deleteNoteMock).toHaveBeenCalled();
        });
    });

});