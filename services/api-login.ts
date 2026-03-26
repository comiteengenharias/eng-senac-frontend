import axios, { AxiosResponse } from 'axios';
import https from 'https';

// URL base da API
const projectUrl = process.env.NEXT_PUBLIC_API_URL;

const httpsAgent = new https.Agent({
    rejectUnauthorized: false //true em produção
});

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
        const response = await axios.post(`${projectUrl}/api/login/student`, data, {
            httpsAgent,
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        })

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
        const response = await axios.post(`${projectUrl}/api/Login/Teacher`, data, {
            httpsAgent,
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        })

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
        const response = await axios.post(`${projectUrl}/api/login/support`, data, {
            httpsAgent,
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        })

        return response;

    } catch (error: any) {
        throw error;
    }
}

export async function verifyLogin(): Promise<any> {
    try {
        const response = await axios.post(`${projectUrl}/api/verify-login`, {}, {
            httpsAgent,
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });

        return response.data;

    } catch (error) {
        return null;
    }
}

export async function logout(): Promise<any> {

    try {
        const response = await axios.post(`${projectUrl}/api/Logout`, {}, {
            httpsAgent,
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        })

        return response.data;

    } catch (error: any) {
        throw error;
    }
}

export async function recoverStudentPassword(institutionalEmail: string): Promise<any> {
    try {
        const response = await axios.post(`${projectUrl}/api/recover-password/student`, institutionalEmail, {
            httpsAgent,
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });

        return response.data;

    } catch (error: any) {
        throw error;
    }
}

export async function recoverTeacherPassword(institutionalEmail: string): Promise<any> {
    try {
        const response = await axios.post(`${projectUrl}/api/recover-password/teacher`, institutionalEmail, {
            httpsAgent,
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });

        return response.data;

    } catch (error: any) {
        throw error;
    }
}
