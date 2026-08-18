import instance from './api';
import { User, Guid } from '../types';

export const register = async (email: string, password: string): Promise<User> => {
    const response = await instance.post('/users/register', { email, password });
    return response.data;
};

export const login = async (email: string, password: string): Promise<string> => {
    const response = await instance.post('/users/login', { email, password });
    localStorage.setItem('jwtToken', response.data);
    return response.data;
};

export const getUserById = async (id: Guid): Promise<User> => {
    const response = await instance.get(`/users/${id}`);
    return response.data;
};

export const changePassword = async (id: Guid, oldPassword: string, newPassword: string):
    Promise<User | null> => {
    const response = await instance.put(`/users/${id}`, { id, oldPassword, newPassword });
    return response.data;
};