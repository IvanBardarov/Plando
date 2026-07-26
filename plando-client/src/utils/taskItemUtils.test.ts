import { getItemClassName } from './taskItemUtils';
import { TaskItem } from '../types';

describe('getItemClassName', () => {
    it('should return green class when task is completed before due date', () => {
        const input: TaskItem = {
              id: "",
              title: "Task Title",
              description: "Task Description",
              dueDate: new Date("2026-08-10"),
              isCompleted: true,
              createdAt: new Date("2026-07-25"),
              userId: "",
              taskListId: "",
              completedAt: new Date("2026-08-01"),
              startDate: new Date("2026-07-27")
        };
        const result = getItemClassName(input);
        expect(result).toBe('border p-4 rounded bg-green-100');
    });
});