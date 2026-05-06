'use client'

import { ChartOverview } from "@/components/system/chart";
import LoadingOverlay from "@/components/system/loading-overlay";
import { QrCodeView } from "@/components/system/qrcode";
import Sidebar from "@/components/system/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { logout, verifyLogin } from "@/services/api-login";
import { getLecturesInfo, getSummaryInfo } from "@/services/api-student";
import { Folder, Users, FolderOpenDot, BriefcaseBusiness, QrCode } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AreaRestrita_Aluno() {
  const router = useRouter();
	const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const data = await verifyLogin();
      if (!data || data == null || data.role !== 'Student') {
        logout();
        router.push('/');
      }
    })();
  }, []);

  interface Student {
    idSenac: number;
    name: string;
  }

  interface Project {
    membersCount: number;
    name: string;
    semester: number;
    token: string;
  }

  interface Reviews {
    evaluatedBusiness: string; // ex: "1/5"
    evaluatedProjects: string; // ex: "0/5"
  }

  interface FullData {
    student: Student;
    project: Project;
    reviews: Reviews;
  }

  interface ApiResponseItem {
    attendancePercentage: number;
    lecture: {
      codeLecture: number;
    };
  }

  const [summaryInfo, setSummaryInfo] = useState<FullData | null>(null);
  const [lecturesInfo, setLecturesInfo] = useState<ApiResponseItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getSummaryInfo();
        if (!data || data?.message?.toLowerCase().includes('not found') || data?.message?.toLowerCase().includes('não encontrado')) {
          logout();
          router.push('/');
          return;
        }
        setSummaryInfo(data);

        const lectures = await getLecturesInfo();
        setLecturesInfo(lectures);
      } catch (error: any) {
        const status = error?.response?.status;
        const message: string = error?.response?.data?.message ?? '';
        if (status === 404 || message.toLowerCase().includes('not found') || message.toLowerCase().includes('não encontrado')) {
          logout();
          router.push('/');
          return;
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function transformToChartData(data: ApiResponseItem[]) {
    return data.map((item, index) => ({
      lecture: String(index + 1),
      presence: item.attendancePercentage,
    }));
  }

  const firstCards = [
    {
      title: "Projeto",
      icon: Folder,
      description: summaryInfo?.project.name || "...",
      value: summaryInfo?.project.token ? "Token: " + summaryInfo.project.token : "Token: ...",
    },
    {
      title: "Grupo",
      icon: Users,
      description: summaryInfo?.project.semester
        ? `${summaryInfo.project.semester}º Semestre`
        : "...º Semestre",
      value: summaryInfo?.project.membersCount
        ? `${summaryInfo.project.membersCount} participante${summaryInfo.project.membersCount === 1 ? '' : 's'}`
        : "...",
    },
    {
      title: "Empresas",
      icon: BriefcaseBusiness,
      description: "Empresas que você avaliou",
      value: summaryInfo?.reviews.evaluatedBusiness || "...",
    },
    {
      title: "Outros Projetos",
      icon: FolderOpenDot,
      description: "Projetos que você avaliou",
      value: summaryInfo?.reviews.evaluatedProjects || "...",
    }
  ];


  return (
    <div>
      <LoadingOverlay active={loading} />
      <Sidebar pageId="home" type="student" />
      <main className="sm:ml-[250px] mt-16 min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#f5f7fa] to-[#eef2f7]">
        <div className="bg-gradient-to-r from-[var(--blue)] to-[#0066cc] w-full px-6 py-8 text-[var(--white)] shadow-lg">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 bg-white rounded-full"></div>
              <h1 className="text-3xl font-bold">Olá, {summaryInfo?.student.name}</h1>
            </div>
            <p className="opacity-90 mt-2 text-sm">Acompanhe o seu progresso e participação na Semana das Engenharias Senac</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto p-6 space-y-4 flex flex-col">
          <Card className="shadow-md border-0 bg-blue-50 border-l-4 border-[var(--blue)]">
            <CardContent className="pt-0">
              <p className="mb-4 font-semibold text-gray-800">📌 Requisitos para Ponto Bônus</p>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--blue)] font-bold">✓</span>
                  <span>Mais de 75% de presença em ao menos 4 palestras</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--blue)] font-bold">✓</span>
                  <span>Avaliar ao menos 5 empresas na feira</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--blue)] font-bold">✓</span>
                  <span>Avaliar ao menos 5 projetos na feira</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {firstCards.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index} className="shadow-md border-0 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm text-gray-800 select-none font-semibold">
                        {item.title}
                      </CardTitle>
                      <Icon className="w-5 h-5 text-[var(--blue)]" />
                    </div>
                    <CardDescription className="text-xs text-gray-600">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-bold text-[var(--blue)]">{item.value}</p>
                  </CardContent>
                </Card>
              );
            })}
          </section>
          <section className="w-full flex flex-col md:flex-row gap-4">
            <QrCodeView name="QR Code de Acesso" value={String(summaryInfo?.student.idSenac)} />
            <ChartOverview name="Presenças em Palestras" chartData={transformToChartData(lecturesInfo)} />
          </section>
        </div>
      </main >
    </div>
  );
}
