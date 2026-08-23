import { getTaskItemColor } from './taskItemUtils';
import { TaskItem } from '../types';

describe('getTaskItemColor', () => {
    const testDate = new Date();
    const DAY_IN_MS = 24 * 60 * 60 * 1000;

    it('should return green class when task is completed before due date', () => {
        const input: TaskItem = {
            id: "",
            title: "Task Title",
            description: "Task Description",
            dueDate: new Date(testDate.getTime() + 10 * DAY_IN_MS),
            isCompleted: true,
            createdAt: new Date(testDate.getTime() - 10 * DAY_IN_MS),
            userId: "",
            taskListId: "",
            completedAt: new Date(testDate),
            startDate: new Date(testDate.getTime() - 5 * DAY_IN_MS),
            categoryId: "ft5",
            isImportant: true,
            isUrgent: false
        };
        const result = getTaskItemColor(input);
        expect(result).toBe('bg-green-100');
    });

    it('should return gray class when task is completed after due date', () => {
        const input: TaskItem = {
            id: "",
            title: "Task Title",
            description: "Task Description",
            dueDate: new Date(testDate.getTime() - 5 * DAY_IN_MS),
            isCompleted: true,
            createdAt: new Date(testDate.getTime() - 20 * DAY_IN_MS),
            userId: "",
            taskListId: "",
            completedAt: new Date(testDate),
            startDate: new Date(testDate.getTime() - 15 * DAY_IN_MS),
            categoryId: "ft5",
            isImportant: true,
            isUrgent: false
        };
        const result = getTaskItemColor(input);
        expect(result).toBe('bg-gray-100');
    });

    it('should return red class when task was not completed after due date', () => {
        const input: TaskItem = {
            id: "",
            title: "Task Title",
            description: "Task Description",
            dueDate: new Date(testDate.getTime() - 5 * DAY_IN_MS),
            isCompleted: false,
            createdAt: new Date(testDate.getTime() - 2 * DAY_IN_MS),
            userId: "",
            taskListId: "",
            completedAt: null,
            startDate: new Date(testDate.getTime() - 15 * DAY_IN_MS),
            categoryId: "ft5",
            isImportant: true,
            isUrgent: false
        };
        const result = getTaskItemColor(input);
        expect(result).toBe('bg-red-100');
    });

    it('should return yellow class when task was not completed before due date', () => {
        const input: TaskItem = {
            id: "",
            title: "Task Title",
            description: "Task Description",
            dueDate: new Date(testDate.getTime() + 10 * DAY_IN_MS),
            isCompleted: false,
            createdAt: new Date(testDate.getTime() - 10 * DAY_IN_MS),
            userId: "",
            taskListId: "",
            completedAt: null,
            startDate: new Date(testDate.getTime() - 5 * DAY_IN_MS),
            categoryId: "ft5",
            isImportant: true,
            isUrgent: false
        };
        const result = getTaskItemColor(input);
        expect(result).toBe('bg-yellow-100');
    });
});