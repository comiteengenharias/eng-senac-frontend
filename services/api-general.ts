import apiClient from './api-client';

export async function getProjectsData() {
    try {
        const response = await apiClient.get('/api/public/projects', {
            withCredentials: false,
        });

        return response.data;

    } catch (error: any) {
        throw error;
    }
}