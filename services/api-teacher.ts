import axios, { AxiosResponse } from 'axios';
import https from 'https';

// URL base da API
const projectUrl = process.env.NEXT_PUBLIC_API_URL;

const httpsAgent = new https.Agent({
    rejectUnauthorized: false //true em produção
});


export async function getTeacherInfo() {
    try {
        const response = await axios.get(`${projectUrl}/api/teacher/info`, {
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
        const response = await axios.post(`${projectUrl}/api/teacher/change-password`, data, {
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

export interface TeacherProjectsFilters {
    Semester?: number;
    GroupName?: string;
}

export async function getProjectsData(filters: TeacherProjectsFilters) {
    try {
        const response = await axios.post(`${projectUrl}/api/teacher/projects`, filters, {
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

interface ProjectNotesForm {
    projectId: number;
    assessment: string;
    comment: string;
    evaluateType: number;
}


export async function postEvaluateProjects(data: ProjectNotesForm) {

    try {
        const response: AxiosResponse = await axios.post(
            `${projectUrl}/api/teacher/evaluate-projects`,
            data,
            {
                httpsAgent,
                withCredentials: true,
                headers: {
                    // multipart/form-data com boundary será gerenciado automaticamente
                }
            }
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
    const response = await axios.post(
        `${projectUrl}/api/teacher/final-notes`,
        filters,
        {
            httpsAgent,
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }
    );

    return response.data;
}

export async function getPointMaterials(): Promise<{ total: number; data: string[] }> {
    const response = await axios.get(
        `${projectUrl}/api/teacher/point-materials`,
        {
            httpsAgent,
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
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
        const response = await axios.post(`${projectUrl}/api/teacher/top-projects-ranking`, {
            semester: semester,
            groupName: ""
        }, {
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