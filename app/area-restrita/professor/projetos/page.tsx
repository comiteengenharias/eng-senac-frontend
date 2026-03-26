'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/system/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { getProjectsData, TeacherProjectsFilters, postEvaluateProjects } from "@/services/api-teacher";
import { verifyLogin } from "@/services/api-login";
import LoadingOverlay from "@/components/system/loading-overlay";
import { Search, RotateCcw } from "lucide-react";
import Swal from "sweetalert2";

interface Project {
  codTeam: number;
  description: string;
  groupName: string;
  leader: number;
  semester: number;
  token: string;
}

interface TeacherProjectData {
  alreadyBankingEvaluated: boolean;
  alreadyFairEvaluated: boolean;
  project: Project;
}

const SEMESTRES = [2, 4, 6, 8, 10];

export default function AreaRestrita_Professor() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [projetos, setProjetos] = useState<TeacherProjectData[]>([]);
  const [totalRegistros, setTotalRegistros] = useState<number>(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isBankEvaluation, setIsBankEvaluation] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [capturedImage, setCapturedImage] = useState<Blob | null>(null);
  const [criteriaRatings, setCriteriaRatings] = useState<Record<string, string>>({});
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("");

  // Filtros
  const [filtros, setFiltros] = useState({
    GroupName: "",
    Semester: "",
  });

  // Verificar login
  useEffect(() => {
    (async () => {
      const data = await verifyLogin();
      if (!data || data.role !== 'Teacher') {
        router.push('/');
      }
    })();
  }, [router]);

  // Limpar diálogo ao fechar
  useEffect(() => {
    if (!dialogOpen) {
      setCriteriaRatings({});
      setComment("");
      setRating("");
      setCapturedImage(null);
      setSelectedProject(null);
    }
  }, [dialogOpen]);

  const evaluationCriteria = [
    "Introdução ao tema e objetivos",
    "Metodologia",
    "Resultados",
    "Qualidade e inovação da Maquete/Protótipo",
    "Respostas ao avaliador"
  ];

  const sendAssessment = async () => {
    setLoading(true);

    if (!selectedProject) return;

    try {
      for (let crit of evaluationCriteria) {
        const nota = criteriaRatings[crit];
        if (!nota || isNaN(Number(nota)) || Number(nota) < 0 || Number(nota) > 10) {
          setLoading(false);
          Swal.fire({
            title: 'Notas inválidas',
            text: `A nota do critério "${crit}" é obrigatória e deve estar entre 0 e 10`,
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#003'
          });
          return;
        }
      }

      const notas = Object.fromEntries(
        Object.entries(criteriaRatings).map(([key, value]) => [key, Number(value)])
      );

      const notasJson = JSON.stringify(notas, null, 2);

      await postEvaluateProjects({
        projectId: selectedProject.codTeam,
        assessment: notasJson,
        comment: comment.trim(),
        evaluateType: isBankEvaluation ? 1 : 0
      });

      setDialogOpen(false);
      setLoading(false);
      Swal.fire({
        title: 'Obrigado!',
        text: 'Avaliação validada com sucesso.',
        icon: 'success',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#003'
      }).then(() => location.reload());
    } catch (error: any) {
      setDialogOpen(false);
      setLoading(false);
      Swal.fire({
        title: 'Erro ao enviar avaliação',
        text: error?.response?.data?.message || 'Houve um erro inesperado ao enviar a avaliação.',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#003'
      });
    }
  };

  async function aplicarFiltros() {
    setLoading(true);
    
    try {
      const payloadFiltros: TeacherProjectsFilters = {};

      if (filtros.GroupName.trim()) payloadFiltros.GroupName = filtros.GroupName;
      if (filtros.Semester) payloadFiltros.Semester = Number(filtros.Semester);

      const response = await getProjectsData(payloadFiltros);
      console.log("Resposta da API:", response);
      // A API retorna um array diretamente, não envelopado
      const projetos = Array.isArray(response) ? response : response.data || [];
      setProjetos(projetos);
      setTotalRegistros(projetos.length);
    } catch (error) {
      console.error("Erro ao buscar projetos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function resetarFiltros() {
    setFiltros({
      GroupName: "",
      Semester: "",
    });
    setLoading(true);

    try {
      const response = await getProjectsData({});
      // A API retorna um array diretamente, não envelopado
      const projetos = Array.isArray(response) ? response : response.data || [];
      setProjetos(projetos);
      setTotalRegistros(projetos.length);
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
    } finally {
      setLoading(false);
    }
  }

  // Carregar todos os dados ao abrir a página
  useEffect(() => {
    const carregarDadosIniciais = async () => {
      setLoading(true);
      try {
        const response = await getProjectsData({});
        console.log("Resposta da API:", response);
        // A API retorna um array diretamente, não envelopado
        const projetos = Array.isArray(response) ? response : response.data || [];
        setProjetos(projetos);
        setTotalRegistros(projetos.length);
      } catch (error) {
        console.error("Erro ao carregar projetos:", error);
        setProjetos([]);
        setTotalRegistros(0);
      } finally {
        setLoading(false);
      }
    };

    carregarDadosIniciais();
  }, []);

  return (
    <div>
      <LoadingOverlay active={loading} />
      <Sidebar pageId="projetos" type="teacher" />
      <main className="sm:ml-[250px] mt-16 min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#f5f7fa] to-[#eef2f7]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[var(--blue)] to-[#0066cc] w-full px-6 py-8 text-[var(--white)] shadow-lg">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 bg-white rounded-full"></div>
              <h1 className="text-3xl font-bold">Projetos para Avaliação</h1>
            </div>
            <p className="opacity-90 mt-2 text-sm">
              Visualize e filtre os projetos para avaliar por nome do grupo e semestre
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 space-y-4">
          {/* Card de Filtros */}
          <Card className="shadow-md border-0">
            <CardContent className="p-3">
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-semibold text-gray-800">Filtrar Resultados</h3>
                
                <div className="flex flex-wrap items-end gap-2">
                  {/* Nome do Grupo */}
                  <div className="flex flex-col gap-1 flex-grow min-w-[200px] max-w-[400px]">
                    <label className="text-xs font-medium text-gray-700">Nome do Grupo</label>
                    <Input
                      placeholder="Ex: Sustentabilidade"
                      value={filtros.GroupName}
                      onChange={(e) => setFiltros({ ...filtros, GroupName: e.target.value })}
                      className="border-gray-300 focus:border-[var(--blue)] focus:ring-[var(--blue)] h-9 text-sm"
                    />
                  </div>

                  {/* Semestre */}
                  <div className="flex flex-col gap-1 w-[165px] sm:w-[140px] md:w-[165px]">
                    <label className="text-xs font-medium text-gray-700">Semestre</label>
                    <Select value={filtros.Semester || "all"} onValueChange={(value) => setFiltros({ ...filtros, Semester: value === "all" ? "" : value })}>
                      <SelectTrigger className="border-gray-300 focus:border-[var(--blue)] focus:ring-[var(--blue)] h-9 text-sm w-full">
                        <SelectValue placeholder="Selecionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os semestres</SelectItem>
                        {SEMESTRES.map((semestre) => (
                          <SelectItem key={semestre} value={semestre.toString()}>
                            {semestre}º semestre
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex gap-2">
                    <Button
                      onClick={aplicarFiltros}
                      disabled={loading}
                      className="bg-[var(--blue)] hover:bg-[#0052a3] text-white font-semibold flex items-center gap-2 h-9 text-sm px-3 whitespace-nowrap cursor-pointer transition-all duration-200 active:brightness-90"
                    >
                      <Search className="w-4 h-4" />
                      Filtrar
                    </Button>
                    <Button
                      onClick={resetarFiltros}
                      variant="outline"
                      disabled={loading}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2 h-9 text-sm px-3 whitespace-nowrap cursor-pointer transition-all duration-200"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Limpar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card de Resultados */}
          {projetos && projetos.length > 0 && (
            <>
              <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <span className="text-sm font-medium text-gray-700">
                  Total de projetos: <span className="font-bold text-[var(--blue)]">{totalRegistros}</span>
                </span>
              </div>

              <Card className="shadow-md border-0 overflow-hidden">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table className="w-full table-fixed min-w-max">
                      <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <TableRow className="border-b-2 border-gray-200">
                          <TableHead className="text-gray-700 font-semibold text-center w-[80px]">Sem.</TableHead>
                          <TableHead className="text-gray-700 font-semibold flex-1 min-w-[280px]">Nome do Grupo</TableHead>
                          <TableHead className="text-gray-700 font-semibold text-center w-[180px]">Ação</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projetos.map((projeto, index) => (
                          <TableRow 
                            key={index}
                            className="hover:bg-blue-50 border-b border-gray-200 transition-colors"
                          >
                            <TableCell className="text-gray-700 text-center w-[80px]">{projeto.project.semester}º</TableCell>
                            <TableCell className="font-medium text-gray-800 truncate flex-1 min-w-[280px]">
                              {projeto.project.groupName}
                            </TableCell>
                            <TableCell className="text-center w-[180px]">
                              <div className="flex gap-2 justify-center">
                                <Button
                                  onClick={() => {
                                    setSelectedProject(projeto.project);
                                    setIsBankEvaluation(true);
                                    setDialogOpen(true);
                                  }}
                                  disabled={projeto.alreadyBankingEvaluated}
                                  className={`text-xs cursor-pointer px-2 py-1 transition-all duration-200 ${
                                    projeto.alreadyBankingEvaluated
                                      ? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-600'
                                      : 'bg-[var(--blue)] hover:bg-[#0052a3] text-white active:brightness-90'
                                  }`}
                                  size="sm"
                                >
                                  {projeto.alreadyBankingEvaluated ? 'Banca ✓' : 'Banca'}
                                </Button>
                                <Button
                                  onClick={() => {
                                    setSelectedProject(projeto.project);
                                    setIsBankEvaluation(false);
                                    setDialogOpen(true);
                                  }}
                                  disabled={projeto.alreadyFairEvaluated}
                                  className={`text-xs cursor-pointer px-2 py-1 transition-all duration-200 ${
                                    projeto.alreadyFairEvaluated
                                      ? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-600'
                                      : 'bg-[var(--blue)] hover:bg-[#0052a3] text-white active:brightness-90'
                                  }`}
                                  size="sm"
                                >
                                  {projeto.alreadyFairEvaluated ? 'Feira ✓' : 'Feira'}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Estado vazio */}
          {projetos && projetos.length === 0 && totalRegistros === 0 && (
            <Card className="shadow-md border-0">
              <CardContent className="py-12 text-center">
                <div className="space-y-3">
                  <Search className="w-12 h-12 mx-auto text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-600">Nenhum projeto encontrado</h3>
                  <p className="text-gray-500">
                    Aplique filtros e clique em "Filtrar" para visualizar os resultados
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Dialog de Avaliação */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                Avaliar Projeto: {selectedProject?.groupName}
              </DialogTitle>
              <DialogDescription>
                {isBankEvaluation ? "Avaliação de Banca" : "Avaliação de Feira"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {evaluationCriteria.map((criteria) => (
                <div key={criteria}>
                  <label className="text-sm font-medium text-gray-700">{criteria}</label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    placeholder="0-10"
                    value={criteriaRatings[criteria] || ""}
                    onChange={(e) =>
                      setCriteriaRatings({
                        ...criteriaRatings,
                        [criteria]: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
              ))}

              <div>
                <label className="text-sm font-medium text-gray-700">Comentários</label>
                <Textarea
                  placeholder="Digite seus comentários sobre a avaliação..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mt-1"
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={sendAssessment}
                disabled={loading}
                className="bg-[var(--blue)] hover:bg-[#0052a3] text-white cursor-pointer"
              >
                Enviar Avaliação
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

