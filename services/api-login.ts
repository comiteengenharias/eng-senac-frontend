import apiClient from './api-client';

interface LoginData {
    email: string
    password: string
}

export async function loginStudent(credentials: LoginData): Promise<any> {

    const data = {
        email: credentials.email,
        password: credentials.password
    };

    try {
        const response = await apiClient.post('/api/login/student', data, {
            withCredentials: true,
        });

        return response;

    } catch (error: any) {
        throw error;
    }
}

export async function loginTeacher(credentials: LoginData): Promise<any> {

    const data = {
        email: credentials.email,
        password: credentials.password
    };

    try {
        const response = await apiClient.post('/api/Login/Teacher', data, {
            withCredentials: true,
        });

        return response.data;

    } catch (error: any) {
        throw error
    }
}

export async function loginSupport(password: string): Promise<any> {

    const data = {
        password: password
    };

    try {
        const response = await apiClient.post('/api/login/support', data, {
            withCredentials: true,
        });

        return response;

    } catch (error: any) {
        throw error;
    }
}

export async function verifyLogin(): Promise<any> {
    try {
        const response = await apiClient.post('/api/verify-login', {}, {
            withCredentials: true,
        });

        return response.data;

    } catch (error) {
        return null;
    }
}

export async function logout(): Promise<any> {

    try {
        const response = await apiClient.post('/api/Logout', {}, {
            withCredentials: true,
        });

        return response.data;

    } catch (error: any) {
        throw error;
    }
}

export async function recoverStudentPassword(institutionalEmail: string): Promise<any> {
    try {
        const response = await apiClient.post('/api/recover-password/student', institutionalEmail, {
            withCredentials: true,
            headers: { 'Content-Type': 'text/plain' },
        });

        return response.data;

    } catch (error: any) {
        throw error;
    }
}

export async function recoverTeacherPassword(institutionalEmail: string): Promise<any> {
    try {
        const response = await apiClient.post('/api/recover-password/teacher', institutionalEmail, {
            withCredentials: true,
            headers: { 'Content-Type': 'text/plain' },
        });

        return response.data;

    } catch (error: any) {
        throw error;
    }
}
