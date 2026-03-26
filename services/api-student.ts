import axios, { AxiosResponse } from 'axios';
import https from 'https';

// URL base da API
const projectUrl = process.env.NEXT_PUBLIC_API_URL;

const httpsAgent = new https.Agent({
    rejectUnauthorized: false //true em produção
});


export async function getStudentInfo() {
    try {
        const response = await axios.get(`${projectUrl}/api/student/info`, {
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

interface RegisterLeaderData {
    currentPsw: string,
    newPsw: string
}

export async function postChangePassword(data: RegisterLeaderData) {
    try {
        const response = await axios.post(`${projectUrl}/api/student/change-password`, data, {
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

export async function getSummaryInfo() {
    try {
        const response = await axios.get(`${projectUrl}/api/student/summary-info`, {
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

export async function getProjectInfo() {
    try {
        const response = await axios.get(`${projectUrl}/api/student/project-info`, {
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

export async function getLecturesInfo() {
    try {
        const response = await axios.get(`${projectUrl}/api/student/lectures`, {
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

export async function getBusinessInfo() {
    try {
        const response = await axios.get(`${projectUrl}/api/student/business`, {
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
        const response: AxiosResponse = await axios.post(
            `${projectUrl}/api/student/business-assessment`,
            formData,
            {
                httpsAgent,
                withCredentials: true,
                headers: {
                    // o axios define automaticamente multipart/form-data com boundary
                }
            }
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
        const response = await axios.post(`${projectUrl}/api/student/other-projects`, filters, {
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
        const response: AxiosResponse = await axios.post(
            `${projectUrl}/api/student/evaluate-other-projects`,
            formData,
            {
                httpsAgent,
                withCredentials: true,
                headers: {
                    // o axios define automaticamente multipart/form-data com boundary
                }
            }
        );
        
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
        const response = await axios.post(`${projectUrl}/api/student/deliver-project`, formData, {
            httpsAgent,
            withCredentials: true,
            headers: {}
        });

        return response.data;
    } catch (error: any) {
        throw error;
    }
}

