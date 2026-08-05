import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom';
import { TaskItemDetailPage } from './TaskItemDetailPage';
import { updateTaskItem } from '../services/taskItemService';

jest.mock('../services/taskItemService', () => ({
    getTaskItemById: jest.fn().mockResolvedValue({}),
    updateTaskItem: jest.fn().mockResolvedValue({
        id: "1", title: "Titel", description: "Description", startDate: new Date("2026-01-01"),
        dueDate: new Date("2026-01-15"), taskListId: "1"
    })
}));

jest.mock('../services/taskListService', () => ({
    getTaskListByUserId: jest.fn().mockResolvedValue([])
}));

jest.mock('react-router-dom', () => ({
    useParams: () => ({ id: 'test-list-id' })
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

});