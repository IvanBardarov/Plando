import instance from "./api";
import { TaskItem, Guid, PagedResultDto } from "../types";

export const getTaskItemByUserId = async (
    taskListId: Guid | null,
    title: string | null, description: string | null,
    createdAtFrom: Date | null, createdAtTo: Date | null, 
    dueDateFrom: Date | null, dueDateTo: Date | null,
    completedAtFrom: Date | null, completedAtTo: Date | null,
    isCompleted: boolean | null, page: number | null, pageSize: number | null)
 : Promise<PagedResultDto<TaskItem>> => {
    const response = await instance.get(`/TaskItems`, {
        params: {
            taskListId,
            title, 
            description, 
            createdAtFrom, 
            createdAtTo, 
            dueDateFrom, 
            dueDateTo,
            completedAtFrom, 
            completedAtTo, 
            isCompleted,
            page,
            pageSize
        }
    });
    return response.data;
};

export const createTaskItem = async (title: string, description: string, userId: Guid,
     dueDate: Date, taskListId: Guid | null, startDate: Date | null) : Promise<TaskItem> => {
    const response = await instance.post('/TaskItems',
         { title, description, userId, dueDate, taskListId, startDate });
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