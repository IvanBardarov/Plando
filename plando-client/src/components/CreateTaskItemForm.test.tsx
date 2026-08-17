import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CreateTaskItemForm } from './CreateTaskItemForm';

jest.mock('../services/taskItemService', () => ({
    createTaskItem: jest.fn().mockResolvedValue({})
}));

jest.mock('../services/taskListService', () => ({
    getTaskListByUserId: jest.fn().mockResolvedValue([])
}));

jest.mock('../services/taskCategoryService', () => ({
    getTaskCategoriesByUserId: jest.fn().mockResolvedValue([])
}));

describe('CreateTaskItemForm', () => {

    it('should render the toggle button', async () => {
        await act(async () => {
            render(<CreateTaskItemForm onCreate={jest.fn()} />);
        });
        expect(screen.getByText('▼ Create Task')).toBeInTheDocument();
    });

    it('should show form when button clicked', async () => {
        await act(async () => {
            render(<CreateTaskItemForm onCreate={jest.fn()} />);
        });
        fireEvent.click(screen.getByText('▼ Create Task'));
        expect(screen.getByText('Create')).toBeInTheDocument();
    });

    it('should calls onCreate when submitted', async () => {
        const onCreateMock = jest.fn();
        await act(async () => {
            render(<CreateTaskItemForm onCreate={onCreateMock} />);
        });
        fireEvent.click(screen.getByText('▼ Create Task'));
        await act(async () => {
            fireEvent.submit(screen.getByRole('form', { name: 'create-task-form' }));
        });

        expect(onCreateMock).toHaveBeenCalled();
    });
});