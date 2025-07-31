import axios from 'axios';
import { Lifter, Meet, TopLifter } from '../types/types';
import { config } from '../utils/config';

const api = axios.create({
    baseURL: config.API_BASE_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

export async function getLifter(name: string): Promise<Lifter | undefined> {
    try {
        const response = await api.get('/lifters', { params: { name } });
        return response.data as Lifter;
    } catch (error) {
        console.error('Error fetching lifter:', error);
        return undefined;
    }
}

export async function getMeet(name: string): Promise<Meet | undefined> {
    try {
        const response = await api.get('/meets', { params: { name } });
        return response.data as Meet;
    } catch (error) {
        console.error('Error fetching meet:', error);
        return undefined;
    }
}

export async function getTopLifters(
    page: number = 1,
): Promise<TopLifter[] | undefined> {
    try {
        const response = await api.get('/top-lifters', { params: { page } });
        return response.data as TopLifter[];
    } catch (error) {
        console.error('Error fetching top lifters:', error);
        return undefined;
    }
}
