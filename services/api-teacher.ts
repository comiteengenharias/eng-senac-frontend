import { AxiosResponse } from 'axios';
import apiClient from './api-client';


export async function getTeacherInfo() {
    try {
        const response = await apiClient.get('/api/teacher/info', {
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
        const response = await apiClient.post('/api/teacher/change-password', data, {
            withCredentials: true,
        })

        return response.data;

    } catch (error: any) {
        throw error;
    }
}

export interface TeacherProjectsFilters {
    Semester?: number;
    GroupName?: string;
}

export async function getProjectsData(filters: TeacherProjectsFilters) {
    try {
        const response = await apiClient.post('/api/teacher/projects', filters, {
            withCredentials: true,
        })

        return response.data;

    } catch (error: any) {
        throw error;
    }
}

interface ProjectNotesForm {
    projectId: number;
    assessment: string;
    comment: string;
    evaluateType: number;
}


export async function postEvaluateProjects(data: ProjectNotesForm) {

    try {
        const response: AxiosResponse = await apiClient.post(
            '/api/teacher/evaluate-projects',
            data,
            { withCredentials: true }
        );

        return response.data;
    } catch (error: any) {
        throw error;
    }
}

export interface ExtraPoint {
  codExtraPoint: number;
  point: number;
  reason: string;
  discipline: string;
}

export interface StudentPerformance {
  idSenac: string;
  studentName: string;
  semester: number;
  pointMaterial: string;
  reviewsNumber: number;
  average: number;
  extraNote: number;
  extraPoints: ExtraPoint[] | null;
  course: string;
}

export interface FinalNotesFilters {
    Fullname?: string;
    Semester?: number;
    Course?: string;
    PointMaterial?: string;
    Page: number;
    PerPage: number;
}

export async function getFinalNotes(
    filters: FinalNotesFilters
): Promise<{ data: StudentPerformance[]; total: number }> {
    const response = await apiClient.post(
        '/api/teacher/final-notes',
        filters,
        {
            withCredentials: true,
        }
    );

    return response.data;
}

export async function getPointMaterials(): Promise<{ total: number; data: string[] }> {
    const response = await apiClient.get(
        '/api/teacher/point-materials',
        {
            withCredentials: true,
        }
    );

    return response.data;
}

export interface RankingProject {
    projectName: string;
    finalAverage: number;
    assessments?: {
        banca: {
            count: string;
            average: number;
        };
        feira: {
            count: string;
            average: number;
        };
        student: {
            count: string;
            average: number;
        };
    };
}

export async function getProjectRankingBySemester(semester: number): Promise<RankingProject[]> {
    try {
        const response = await apiClient.post('/api/teacher/top-projects-ranking', {
            semester: semester,
            groupName: ""
        }, {
            withCredentials: true,
        });

        return response.data;

    } catch (error: any) {
        throw error;
    }
}