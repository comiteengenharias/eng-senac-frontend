'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/system/sidebar";
import { verifyLogin } from "@/services/api-login";
import { getProjectRankingBySemester, RankingProject } from "@/services/api-teacher";
import LoadingOverlay from "@/components/system/loading-overlay";
import { Table, FileText, Users, Clock } from "lucide-react";
import Image from "next/image";

interface RankingData {
    [semester: number]: RankingProject[];
}

const SEMESTERS = [2, 4, 6, 8, 10];

export default function RankingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [rankingData, setRankingData] = useState<RankingData>({});
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    useEffect(() => {
        (async () => {
            const data = await verifyLogin();
            if (!data || data.role !== 'Teacher') {
                router.push('/login/professor');
            }
        })();
    }, [router]);

    const loadRankingData = async () => {
        try {
            const data: RankingData = {};

            for (const semester of SEMESTERS) {
                const rankingProjects = await getProjectRankingBySemester(semester);
                data[semester] = rankingProjects;
            }

            setRankingData(data);
            setLastUpdate(new Date());
            setLoading(false);
        } catch (error) {
            console.error('Erro ao carregar ranking:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRankingData();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            loadRankingData();
        }, 60000); // 60 segundos

        return () => clearInterval(interval);
    }, []);

    const getRankingBadgeColor = (position: number) => {
        switch (position) {
            case 1:
                return 'bg-yellow-400 text-gray-900';
            case 2:
                return 'bg-gray-300 text-gray-900';
            case 3:
                return 'bg-orange-400 text-white';
            default:
                return 'bg-gray-200 text-gray-700';
        }
    };

    const getMedalIcon = (position: number) => {
        switch (position) {
            case 1:
                return '🥇';
            case 2:
                return '🥈';
            case 3:
                return '🥉';
            default:
                return position;
        }
    };

    const formatTime = (date: Date | null) => {
        if (!date) return 'Carregando...';
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    return (
        <div>
            <LoadingOverlay active={loading} />
            <main className="w-screen h-screen min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#eef2f7] flex flex-col overflow-hidden">
                {/* Header com Logo, Título e Última Atualização na mesma linha */}
                <div className="bg-gradient-to-r from-[var(--blue)] to-[#0066cc] w-screen text-[var(--white)] shadow-lg flex-shrink-0 px-6 py-3">
                    <div className="flex items-center justify-between gap-4">
                        {/* Logo esquerda */}
                        <div className="flex-shrink-0 w-24">
                            <Image
                                src="/img/branding/logo-blue.png"
                                alt="Logo das Engenharias"
                                width={100}
                                height={40}
                                priority
                                className="brightness-0 invert"
                            />
                        </div>
                        
                        {/* Título no meio */}
                        <div className="flex-1 text-center">
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-1 h-6 bg-white rounded-full"></div>
                                <h1 className="text-2xl font-bold">Ranking de Projetos</h1>
                            </div>
                        </div>
                        
                        {/* Última atualização direita */}
                        <div className="flex-shrink-0 text-right text-sm">
                            <p className="text-xs font-medium opacity-90">Última atualização:</p>
                            <p className="font-bold font-mono">{formatTime(lastUpdate)}</p>
                        </div>
                    </div>
                </div>

                {/* Linha de Premiação - Compacta e em destaque */}
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 w-screen flex-shrink-0 px-6 py-2">
                    <div className="flex items-center justify-center gap-3">
                        <Clock className="w-5 h-5 text-yellow-700 animate-pulse flex-shrink-0" />
                        <span className="text-yellow-900 font-bold text-sm">PREMIAÇÃO:</span>
                        <span className="text-yellow-900 font-black text-lg">11h30</span>
                    </div>
                </div>

                {/* Legenda centralizada */}
                <div className="bg-gradient-to-r from-[var(--blue)] to-[#0066cc] w-screen flex-shrink-0 px-6 py-2 flex items-center justify-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 rounded-lg text-purple-700 font-semibold text-xs">
                        <Table className="w-3 h-3" />
                        <span>Banca</span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 rounded-lg text-green-700 font-semibold text-xs">
                        <FileText className="w-3 h-3" />
                        <span>Feira Prof.</span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-orange-100 rounded-lg text-orange-700 font-semibold text-xs">
                        <Users className="w-3 h-3" />
                        <span>Feira Alunos</span>
                    </div>
                </div>

                <div className="flex-1 overflow-auto w-screen px-6 py-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-4 pb-4 max-w-full">
                        {SEMESTERS.map((semester) => (
                            <Card key={semester} className="overflow-hidden h-fit shadow-md border-0">
                                <CardHeader className="bg-gradient-to-r from-[var(--blue)] to-[#0066cc] text-white py-3">
                                    <CardTitle className="text-base font-semibold">{semester}º Semestre</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {rankingData[semester] && rankingData[semester].length > 0 ? (
                                        <div className="space-y-0">
                                            {rankingData[semester].map((project, index) => (
                                                <div
                                                    key={index}
                                                    className={`p-4 border-b last:border-b-0 ${
                                                        index < 3 ? 'bg-blue-50' : 'bg-white'
                                                    } hover:bg-blue-100 transition`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div
                                                            className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${getRankingBadgeColor(
                                                                index + 1
                                                            )}`}
                                                        >
                                                            {getMedalIcon(index + 1)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold text-sm text-gray-800 truncate">
                                                                {project.projectName}
                                                            </p>
                                                            <p className="text-xs text-[var(--blue)] font-bold mt-1">
                                                                {project.finalAverage.toFixed(2)}
                                                            </p>
                                                            <div className="flex items-center gap-3 mt-2">
                                                                <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 rounded text-purple-700">
                                                                    <Table className="w-2.5 h-2.5" />
                                                                    <span className="text-xs font-medium">{project.assessments?.banca?.count || '0/0'}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 rounded text-green-700">
                                                                    <FileText className="w-2.5 h-2.5" />
                                                                    <span className="text-xs font-medium">{project.assessments?.feira?.count || '0/0'}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1 px-2 py-0.5 bg-orange-100 rounded text-orange-700">
                                                                    <Users className="w-2.5 h-2.5" />
                                                                    <span className="text-xs font-medium">{project.assessments?.student?.count || '0/0'}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-6 text-center text-gray-500">
                                            <p>Nenhum projeto disponível</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
