import axios, { AxiosResponse } from 'axios';
import https from 'https';

// URL base da API
const projectUrl = process.env.NEXT_PUBLIC_API_URL;

const httpsAgent = new https.Agent({
    rejectUnauthorized: false //true em produção
});


export async function getRooms() {
    try {
        const response = await axios.get(`${projectUrl}/api/support/all-rooms`, {
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

export async function GetVerifyId(idSenac: number) {
    try {
        const response = await axios.get(`${projectUrl}/api/support/verify-id/${idSenac}`, {
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

interface RegisterLogDto {
    room: string;
    type: string;
    idSenac: number;
}

export async function postRegisterLog(data: RegisterLogDto) {
    try {
        const response = await axios.post(`${projectUrl}/api/support/register-log`, data, {
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