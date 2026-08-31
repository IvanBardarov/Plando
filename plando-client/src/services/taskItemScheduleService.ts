import instance from './api';
import { Guid, TimeSpan, TaskItemSchedule } from '../types';

export const getTaskItemSchedulesByDate = async (date: Date): Promise<TaskItemSchedule[]> => {
    const response = await instance.get('/taskitemschedules', { params: { date } });
    return response.data;
}

export const createTaskItemSchedule = async (userId: Guid, taskItemId: Guid,
    date: Date, startTime: TimeSpan, endTime: TimeSpan):
    Promise<TaskItemSchedule> => {
    const response = await instance.post('/taskitemschedules',
        { userId, taskItemId, date, startTime, endTime });
    return response.data;
}

export const updateTaskItemSchedule = async (id: Guid, userId: Guid, taskItemId: Guid,
    date: Date, startTime: TimeSpan, endTime: TimeSpan):
    Promise<TaskItemSchedule> => {
    const response = await instance.put(`/taskitemschedules/${id}`,
        { id, userId, taskItemId, date, startTime, endTime });
    return response.data;
}

export const deleteTaskItemSchedule = async (id: Guid):
    Promise<null> => {
    const response = await instance.delete(`/taskitemschedules/${id}`);
    return response.data;
}