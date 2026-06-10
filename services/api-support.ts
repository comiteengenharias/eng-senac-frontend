import apiClient from './api-client';


export async function getRooms() {
    try {
        const response = await apiClient.get('/api/support/all-rooms', {
            withCredentials: true,
        })
        return response.data;

    } catch (error: any) {
        throw error;
    }
}

export async function GetVerifyId(idSenac: number) {
    try {
        const response = await apiClient.get(`/api/support/verify-id/${idSenac}`, {
            withCredentials: true,
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
        const response = await apiClient.post('/api/support/register-log', data, {
            withCredentials: true,
        })

        return response.data;

    } catch (error: any) {
        throw error;
    }
}

export async function getPlatformIssues(onlyUnsolved?: boolean) {
    try {
        const params = onlyUnsolved !== undefined ? { onlyUnsolved } : {};
        const response = await apiClient.get('/api/support/platform-issues', {
            params,
            withCredentials: true,
        });
        return response.data;
    } catch (error: any) {
        throw error;
    }
}

export async function closePlatformIssue(codIssue: number, resolutionComment: string) {
    try {
        const response = await apiClient.patch(
            `/api/support/platform-issues/${codIssue}/close`,
            { resolutionComment },
            { withCredentials: true }
        );
        return response.data;
    } catch (error: any) {
        throw error;
    }
}