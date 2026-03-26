import axios, { AxiosResponse } from 'axios';
import https from 'https';

// URL base da API
const projectUrl = process.env.NEXT_PUBLIC_API_URL;

const httpsAgent = new https.Agent({
    rejectUnauthorized: false //true em produção
});

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
        const response = await axios.post(`${projectUrl}/api/Register/Leader`, data, {
            httpsAgent,
            headers: {
                'Content-Type': 'application/json'
            },
        })

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
        const response = await axios.post(`${projectUrl}/api/Register/Member`, data, {
            httpsAgent,
            headers: {
                'Content-Type': 'application/json'
            },
        })

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
    const response = await axios.post(`${projectUrl}/api/Register/Teacher`, data, {
      httpsAgent,
      headers: {
        'Content-Type': 'application/json'
      },
    });

    return response.data;
  } catch (error: any) {
    throw error;
  }
}