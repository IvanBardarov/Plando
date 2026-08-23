import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { getTaskItemsWithoutPaginationByUserId, updateTaskItem } from '../services/taskItemService';
import { EisenhowerMatrixPage } from './EisenhowerMatrixPage';

jest.mock('../services/taskItemService');

beforeEach(() => {

    const testDate = new Date();
    const DAY_IN_MS = 24 * 60 * 60 * 1000;

    (getTaskItemsWithoutPaginationByUserId as jest.Mock)
        .mockResolvedValue([
            {
                id: '1',
                title: 'title 1',
                description: 'description 1',
                dueDate: new Date(testDate.getTime() + 10 * DAY_IN_MS),
                isCompleted: false,
                createdAt: new Date(testDate.getTime() - 10 * DAY_IN_MS),
                userId: '1а',
                taskListId: '1c',
                completedAt: null,
                startDate: new Date(testDate.getTime() - 5 * DAY_IN_MS),
                categoryId: '1d',
                isImportant: true,
                isUrgent: false
            },
            {
                id: '2',
                title: 'title 2',
                description: 'description 2',
                dueDate: new Date(testDate.getTime() + 10 * DAY_IN_MS),
                isCompleted: false,
                createdAt: new Date(testDate.getTime() - 10 * DAY_IN_MS),
                userId: '2а',
                taskListId: '2c',
                completedAt: null,
                startDate: new Date(testDate.getTime() - 5 * DAY_IN_MS),
                categoryId: '2d',
                isImportant: true,
                isUrgent: false
            }
        ]),
        (updateTaskItem as jest.Mock).mockResolvedValue(
            {
                id: '1',
                title: 'title 1',
                description: 'description 1',
                dueDate: new Date(testDate.getTime() + 10 * DAY_IN_MS),
                isCompleted: false,
                createdAt: new Date(testDate.getTime() - 10 * DAY_IN_MS),
                userId: '1а',
                taskListId: '1c',
                completedAt: null,
                startDate: new Date(testDate.getTime() - 5 * DAY_IN_MS),
                categoryId: '1d',
                isImportant: true,
                isUrgent: true
            });
});

jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn()
}));

describe('EisenhowerMatrixPage', () => {

    it('should render correctly the user account page', async () => {
        await act(async () => {
            render(<EisenhowerMatrixPage />);
        });
        expect(screen.getByTestId('q1')).toBeInTheDocument();
        expect(screen.getByTestId('q2')).toBeInTheDocument();
        expect(screen.getByTestId('q3')).toBeInTheDocument();
        expect(screen.getByTestId('q4')).toBeInTheDocument();
    });

    it('should call updateTaskItem correctly', async () => {
        const updateTaskItemMock = updateTaskItem;
        await act(async () => {
            render(<EisenhowerMatrixPage />);
        });
        await act(async () => {
            const task = screen.getByText('title 1');
            const targetQuadrant = screen.getByTestId('q1')
            fireEvent.dragStart(task, { dataTransfer: { setData: jest.fn(), getData: () => '1' } });
            fireEvent.dragOver(targetQuadrant);
            fireEvent.drop(targetQuadrant, { dataTransfer: { getData: () => '1' } });
        });
        expect(updateTaskItemMock).toHaveBeenCalled();
    })

});