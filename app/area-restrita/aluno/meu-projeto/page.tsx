'use client'

import Sidebar from "@/components/system/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyLogin } from "@/services/api-login";
import { getProjectInfo } from "@/services/api-student";
import Swal from "sweetalert2";
import LoadingOverlay from "@/components/system/loading-overlay";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AreaRestrita_Aluno() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await verifyLogin();
      if (!data || data == null || data.role !== "Student") {
        router.push("/login/aluno");
      }
    })();
  }, [router]);

  interface ProjectInfo {
    isLeader: boolean;
    hasSendAttachment: boolean;
    members: string[];
    presentationRoom?: string | null;
    presentationDay?: string | null;
    project: {
      codTeam: number;
      description: string;
      groupName: string;
      leader: number;
      semester: number;
      token: string;
      presentationsRoom?: string;
      presentationDay?: string;
    };
    reviews: {
      bankReviews: string;
      fairTeacherReviews: string;
      fairStudentReviews: string;
    };
    ratings: {
      bancaRating: {
        assessmentCount: string;
        average: number;
      };
      feeraRating: {
        assessmentCount: string;
        average: number;
      };
      studentRating: {
        assessmentCount: string;
        average: number;
      };
      finalAverage: number;
      rankingPosition: number;
      rankingAverage: number;
    };
  }

  const [getInfo, setGetInfo] = useState<ProjectInfo | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await getProjectInfo();
        // Se a resposta vem com a estrutura { project, members, ... }
        if (response?.project) {
          setGetInfo({
            isLeader: response.isLeader,
            hasSendAttachment: response.hasSendAttachment,
            members: response.members || [],
            presentationRoom: response.presentationRoom || null,
            presentationDay: response.presentationDay || null,
            project: response.project,
            reviews: response.reviews || { bankReviews: "", fairTeacherReviews: "", fairStudentReviews: "" },
            ratings: response.ratings,
          });
        } else {
          // Se a resposta já vem com os dados diretos
          setGetInfo(response);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do projeto:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);


  return (
    <div>
      <LoadingOverlay active={loading} />
      <Sidebar pageId="meu-projeto" type="student" />
      <main className="sm:ml-[250px] mt-16 min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#f5f7fa] to-[#eef2f7]">
        <div className="bg-gradient-to-r from-[var(--blue)] to-[#0066cc] w-full px-6 py-8 text-[var(--white)] shadow-lg">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 bg-white rounded-full"></div>
              <h1 className="text-3xl font-bold">Meu Projeto</h1>
            </div>
            <p className="opacity-90 mt-2 text-sm">
              Acompanhe o desempenho do seu projeto e as avaliações recebidas
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 space-y-4 flex flex-col">
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">🏆 Ranking do Seu Projeto</CardTitle>
            </CardHeader>

            <CardContent className="pt-6 space-y-4">
              <div className="bg-blue-50 border-l-4 border-[var(--blue)] p-4 rounded">
                <p className="text-sm text-gray-700">
                  Seu grupo atualmente está em <span className="font-bold text-[var(--blue)]">??? lugar (Premiação 11h30 no Demoiselle)</span>, com média <span className="font-bold text-[var(--blue)]">{getInfo?.ratings?.rankingAverage.toFixed(2)}</span>
                </p>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <TableRow className="border-b-2 border-gray-200">
                      <TableHead className="text-gray-700 font-semibold">Tipo de Nota</TableHead>
                      <TableHead className="text-gray-700 font-semibold text-center">Peso</TableHead>
                      <TableHead className="text-gray-700 font-semibold text-center">Avaliadores</TableHead>
                      <TableHead className="text-gray-700 font-semibold text-right">Média</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="hover:bg-blue-50 border-b border-gray-200">
                      <TableCell className="font-medium">Média Banca</TableCell>
                      <TableCell className="text-center">
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-sm font-semibold">70%</span>
                      </TableCell>
                      <TableCell className="text-center">{getInfo?.ratings?.bancaRating?.assessmentCount}</TableCell>
                      <TableCell className="text-right font-bold" style={{ color: (getInfo?.ratings?.bancaRating?.average ?? 0) < 6 ? '#dc2626' : 'var(--blue)' }}>
                        {getInfo?.ratings?.bancaRating?.average.toFixed(2)}
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-blue-50 border-b border-gray-200">
                      <TableCell className="font-medium">Média Feira</TableCell>
                      <TableCell className="text-center">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-semibold">25%</span>
                      </TableCell>
                      <TableCell className="text-center">{getInfo?.ratings?.feeraRating?.assessmentCount}</TableCell>
                      <TableCell className="text-right font-bold" style={{ color: (getInfo?.ratings?.feeraRating?.average ?? 0) < 6 ? '#dc2626' : 'var(--blue)' }}>
                        {getInfo?.ratings?.feeraRating?.average.toFixed(2)}
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-blue-50">
                      <TableCell className="font-medium">Média Outros Alunos</TableCell>
                      <TableCell className="text-center">
                        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-sm font-semibold">5%</span>
                      </TableCell>
                      <TableCell className="text-center">{getInfo?.ratings?.studentRating?.assessmentCount}</TableCell>
                      <TableCell className="text-right font-bold" style={{ color: (getInfo?.ratings?.studentRating?.average ?? 0) < 6 ? '#dc2626' : 'var(--blue)' }}>
                        {getInfo?.ratings?.studentRating?.average.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <div className="flex justify-center">
                    <button className="mt-4 text-sm text-[var(--blue)] underline text-center cursor-pointer transition-all duration-200 hover:opacity-80">
                      Ver regras de avaliação
                    </button>
                  </div>

                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Regras de avaliação dos projetos</DialogTitle>
                    <DialogDescription>
                      A nota que será considerada para premiação, é composta por quatro avaliações. Cada uma possui um peso diferente na média final.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 text-sm text-gray-700">
                    <div>
                      <p className="font-semibold">1. Banca – Peso de 70%</p>
                      <p>Quem avalia: professores em sala de aula.</p>
                      <p>Mínimo de avaliadores: 2.</p>
                    </div>

                    <div>
                      <p className="font-semibold">2. Professores em feira – Peso de 25%</p>
                      <p>Quem avalia: professores que visitam o estande durante a feira.</p>
                      <p>Mínimo de avaliadores: 3.</p>
                    </div>

                    <div>
                      <p className="font-semibold">3. Outros alunos – Peso de 5%</p>
                      <p>Quem avalia: alunos visitantes da feira.</p>
                      <p>Mínimo de avaliadores: 3.</p>
                    </div>

                    <div>
                      <p className="font-semibold">Regras importantes</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>
                          O cálculo da média por categoria de avaliação considera pelo menos a quantidade mínima de avaliadores. Por exemplo, a categoria Feira deve ter pelo menos 3 avaliadores. Se tiver apenas duas avaliações, de qualquer forma a divisão será feita por 3. A partir da terceira avaliação, a divisão será feita pela quantidade de avaliadores.
                        </li>
                        <li>O critério de desempate é a quantidade de avaliadores da categoria Feira e Alunos.</li>
                      </ul>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card className="shadow-md border-0">
            <CardHeader className="border-b-2 border-gray-200">
              <CardTitle className="text-lg font-semibold text-gray-800">📋 Dados do Projeto</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Nome do Projeto/Equipe */}
                <div className="pb-4 border-b border-gray-200">
                  <p className="text-xs font-medium text-gray-600 uppercase mb-2">Nome do Projeto/Equipe</p>
                  <p className="text-lg font-bold text-gray-800">{getInfo?.project.groupName || "Carregando..."}</p>
                </div>

                {/* Token */}
                <div className="pb-4 border-b border-gray-200">
                  <p className="text-xs font-medium text-gray-600 uppercase mb-2">Token</p>
                  <p className="text-base text-gray-800">{getInfo?.project.token || "Carregando..."}</p>
                </div>

                {/* Descrição */}
                <div className="pb-4 border-b border-gray-200">
                  <p className="text-xs font-medium text-gray-600 uppercase mb-2">Descrição</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{getInfo?.project.description || "Carregando..."}</p>
                </div>

                {/* Membros Cadastrados */}
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase mb-3">Membros Cadastrados</p>
                  <ul className="space-y-2">
                    {getInfo?.members && getInfo.members.length > 0 ? (
                      getInfo.members.map((member, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--blue)] text-white text-xs font-semibold">
                            {index + 1}
                          </span>
                          <span className="text-gray-800 font-medium">{member}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500 italic">Carregando membros...</li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
