import instance from "./api";
import { TaskItem, Guid } from "../types";

export const getTaskItemByUserId = async (userId: Guid) : Promise<TaskItem[]> => {
    const response = await instance.get(`/TaskItems/${userId}`);
    return response.data;
};

export const createTaskItem = async (title: string, description: string, userId: Guid,
     dueDate: Date, taskListId: Guid | null) : Promise<TaskItem> => {
    const response = await instance.post('/TaskItems',
         { title, description, userId, dueDate, taskListId });
    return response.data;
};

export const completeTaskItem = async (id: Guid) : Promise<TaskItem> => {
    const response = await instance.put(`/TaskItems/${id}/complete`);
    return response.data;
};

export const deleteTaskItem = async (id: Guid) : Promise<null> => {
    const response = await instance.delete(`/TaskItems/${id}`);
    return response.data;
};