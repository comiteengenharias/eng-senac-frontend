import axios, { AxiosResponse } from 'axios';
import https from 'https';

// URL base da API
const projectUrl = process.env.NEXT_PUBLIC_API_URL;

const httpsAgent = new https.Agent({
    rejectUnauthorized: false //true em produção
});

export async function getProjectsData() {
    try {
        const response = await axios.get(`${projectUrl}/api/public/projects`, {
            httpsAgent,
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: false
        })

        return response.data;

    } catch (error: any) {
        throw error;
    }
}