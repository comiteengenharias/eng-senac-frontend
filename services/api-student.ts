import { AxiosResponse } from 'axios';
import apiClient from './api-client';


export async function getStudentInfo() {
    try {
        const response = await apiClient.get('/api/student/info', {
            withCredentials: true,
        })

        return response.data;

    } catch (error: any) {
        throw error;
    }
}

interface RegisterLeaderData {
    currentPsw: string,
    newPsw: string
}

export async function postChangePassword(data: RegisterLeaderData) {
    try {
        const response = await apiClient.post('/api/student/change-password', data, {
            withCredentials: true,
        })

        return response.data;

    } catch (error: any) {
        throw error;
    }
}

export async function getSummaryInfo() {
    try {
        const response = await apiClient.get('/api/student/summary-info', {
            withCredentials: true,
        })

        return response.data;

    } catch (error: any) {
        throw error;
    }
}

export async function getProjectInfo() {
    try {
        const response = await apiClient.get('/api/student/project-info', {
            withCredentials: true,
        })

        return response.data;

    } catch (error: any) {
        throw error;
    }
}

export async function getLecturesInfo() {
    try {
        const response = await apiClient.get('/api/student/lectures', {
            withCredentials: true,
        })

        return response.data;

    } catch (error: any) {
        throw error;
    }
}

export async function getBusinessInfo() {
    try {
        const response = await apiClient.get('/api/student/business', {
            withCredentials: true,
        })

        return response.data;

    } catch (error: any) {
        throw error;
    }
}

interface BusinessAssessmentForm {
    companyId: number;
    assessment: number;
    comment: string;
    image: File;
}

export async function postBusinessAssessment(data: BusinessAssessmentForm) {
    const formData = new FormData();

    formData.append('companyId', data.companyId.toString());
    formData.append('assessment', data.assessment.toString());
    formData.append('comment', data.comment);
    formData.append('file', data.image); // o backend espera como 'file'

    try {
        const response: AxiosResponse = await apiClient.post(
            '/api/student/business-assessment',
            formData,
            { withCredentials: true }
        );

        return response.data;
    } catch (error: any) {
        throw error;
    }
}

export interface StudentOtherProjectsFilters {
    Semester?: number;
    GroupName?: string;
}

export async function getOtherProjectsData(filters: StudentOtherProjectsFilters) {
    try {
        const response = await apiClient.post('/api/student/other-projects', filters, {
            withCredentials: true,
        })

        return response.data;

    } catch (error: any) {
        throw error;
    }
}

interface ProjectAssessmentForm {
    projectId: number;
    assessment: number;
    comment: string;
    image: File;
}

export async function postEvaluateOtherProjects(data: ProjectAssessmentForm) {
    const formData = new FormData();

    formData.append('projectId', data.projectId.toString());
    formData.append('assessment', data.assessment.toString());
    formData.append('comment', data.comment);
    formData.append('file', data.image); // o backend espera como 'file'

    try {
        const response: AxiosResponse = await apiClient.post(
            '/api/student/evaluate-other-projects',
            formData,
            { withCredentials: true }
        );
        
        return response.data;
    } catch (error: any) {
        throw error;
    }
}

interface PlatformIssueData {
    studentId: number;
    title: string;
    description: string;
    sentAt: string;
    imageUrl1: string;
    imageUrl2: string;
}

export async function postPlatformIssue(data: PlatformIssueData) {
    try {
        const response = await apiClient.post('/api/student/platform-issue', data, {
            withCredentials: true,
        });

        return response.data;

    } catch (error: any) {
        throw error;
    }
}

export async function patchPointMaterial(pointMaterial: string) {
    try {
        const response = await apiClient.patch('/api/student/point-material', { pointMaterial }, {
            withCredentials: true,
        });

        return response.data;

    } catch (error: any) {
        throw error;
    }
}

export async function deliverProjectFiles(files: {
    report: File;
    presentation: File;
    images: File[];
}) {
    const formData = new FormData();

    formData.append("report", files.report);
    formData.append("presentation", files.presentation);
    files.images.forEach((img, index) => {
        formData.append(`img${index + 1}`, img);
    });

    try {
        const response = await apiClient.post('/api/student/deliver-project', formData, {
            withCredentials: true,
        });

        return response.data;
    } catch (error: any) {
        throw error;
    }
}

