import apiClient from './api-client';

interface RegisterLeaderData {
    newStudent: {
        idSenac: Number,
        fullname: string,
        institutionalEmail: string,
        personalEmail: string,
        cellphone: string,
        password: string,
        semester: Number,
        course: string,
        pointMaterial: string
    },
    newProject: {
        groupName: string,
        semester: Number,
        description: string,
    }

}

export async function postLeaderRegistration(data: RegisterLeaderData) {
    try {
        const response = await apiClient.post('/api/Register/Leader', data);

        return response.data;

    } catch (error: any) {
        throw error;
    }
}

interface RegisterMemberData {
    newStudent: {
        idSenac: Number,
        fullname: string,
        institutionalEmail: string,
        personalEmail: string,
        cellphone: string,
        password: string,
        semester: Number,
        course: string,
        pointMaterial: string
    },
    token: string

}

export async function postMemberRegistration(data: RegisterMemberData) {
    try {
        const response = await apiClient.post('/api/Register/Member', data);

        return response.data;

    } catch (error: any) {
        throw error;
    }
}

interface RegisterTeacherData {
  newTeacher: {
    codTeacher: number,
    fullname: string,
    institutionalEmail: string,
    password: string
  },
  token: string
}

export async function postTeacherRegistration(data: RegisterTeacherData) {
  try {
    const response = await apiClient.post('/api/Register/Teacher', data);

    return response.data;
  } catch (error: any) {
    throw error;
  }
}