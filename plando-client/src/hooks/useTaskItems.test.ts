import { renderHook, act } from '@testing-library/react';
import { useTaskItems } from './useTaskItems';
import { TaskItem, PagedResultDto } from '../types';
import { deleteTaskItem } from '../services/taskItemService';

jest.mock('../services/taskItemService', () => ({
    completeTaskItem: jest.fn(),
    deleteTaskItem: jest.fn()
}));

const mockTaskItems: PagedResultDto<TaskItem> = {
    items: [
        {
            id: "1",
            title: "Task 1",
            description: "Description 1",
            dueDate: new Date("2026-08-10"),
            isCompleted: false,
            createdAt: new Date("2026-07-25"),
            userId: "user-1",
            taskListId: "",
            completedAt: null,
            startDate: null
        },
        {
            id: "2",
            title: "Task 2",
            description: "Description 2",
            dueDate: new Date("2026-08-15"),
            isCompleted: false,
            createdAt: new Date("2026-07-25"),
            userId: "user-1",
            taskListId: "",
            completedAt: null,
            startDate: null
        }
    ],
    totalCount: 2,
    page: 1,
    pageSize: 10,
    totalPages: 1
};

describe('useTaskItems', () => {

    it('should initialize with null taskItems', () => {
        const { result } = renderHook(() => useTaskItems());
        expect(result.current.taskItems).toBeNull();
    });

    it('should complete a specific task', async () => {
        const { completeTaskItem } = require('../services/taskItemService');
        completeTaskItem.mockResolvedValue(undefined);

        const { result } = renderHook(() => useTaskItems());
        await act(async () => {
            await result.current.setTaskItems(mockTaskItems);
        });
        await act(async () => {
            await result.current.handleComplete("2");
        });

        expect(result.current.taskItems?.items.find(o => o.id === "2")?.isCompleted).toBe(true);
    });

    it('should delete a specific task', async () => {
        const { deleteTaskItem } = require('../services/taskItemService');
        deleteTaskItem.mockResolvedValue(undefined);

        const { result } = renderHook(() => useTaskItems());
        await act(async () => {
            await result.current.setTaskItems(mockTaskItems);
        });
        await act(async () => {
            await result.current.handleDelete("2");
        });

        expect(result.current.taskItems?.items.find(o => o.id == "2")).toBeUndefined();
    });

});