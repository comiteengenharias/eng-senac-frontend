'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/system/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { getOtherProjectsData, StudentOtherProjectsFilters, postEvaluateOtherProjects } from "@/services/api-student";
import { verifyLogin } from "@/services/api-login";
import LoadingOverlay from "@/components/system/loading-overlay";
import { Search, RotateCcw } from "lucide-react";
import Swal from "sweetalert2";
import { useRef } from "react";

interface Project {
  codTeam: number;
  description: string;
  groupName: string;
  leader: number;
  semester: number;
  token: string;
}

interface StudentProjectData {
  alreadyEvaluated: boolean;
  canEvaluate: boolean;
  project: Project;
}

const SEMESTRES = [2, 4, 6, 8, 10];

export default function AreaRestrita_Aluno() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [projetos, setProjetos] = useState<StudentProjectData[]>([]);
  const [totalRegistros, setTotalRegistros] = useState<number>(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [capturedImage, setCapturedImage] = useState<Blob | null>(null);
  const [assessment, setAssessment] = useState("");
  const [comment, setComment] = useState("");

  // Filtros
  const [filtros, setFiltros] = useState({
    GroupName: "",
    Semester: "",
  });

  // Verificar login
  useEffect(() => {
    (async () => {
      const data = await verifyLogin();
      if (!data || data.role !== 'Student') {
        router.push('/login/aluno');
      }
    })();
  }, [router]);

  // Limpar diálogo ao fechar
  useEffect(() => {
    if (dialogOpen) {
      startVideoFromCamera();
    } else {
      closeVideoFromCamera();
      setAssessment("");
      setComment("");
      setCapturedImage(null);
      setSelectedProject(null);
    }
  }, [dialogOpen]);

  const startVideoFromCamera = () => {
    navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' }
    }).then(stream => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        document.getElementById('picture-display')!.style.display = "block";
        document.getElementById('picture-show')!.style.display = "none";
      }
    }).catch(() => {
      Swal.fire({
        title: 'Houve um erro',
        text: 'Se o erro persistir, entre em contato com o suporte',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#003'
      });
    });
  };

  const closeVideoFromCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const takePicture = () => {
    const canvas = document.querySelector('canvas#taked-picture') as HTMLCanvasElement | null;
    const video = document.querySelector('video') as HTMLVideoElement | null;

    if (canvas && video) {
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;

      const context = canvas.getContext('2d');
      if (context) {
        context.scale(-1, 1);
        context.drawImage(video, -canvas.width, 0);
        context.setTransform(1, 0, 0, 1, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            setCapturedImage(blob);
          }
        }, 'image/jpeg');

        document.getElementById('picture-display')!.style.display = "none";
        document.getElementById('picture-show')!.style.display = "block";
        closeVideoFromCamera();
      }
    }
  };

  const sendAssessment = async () => {

    const hoje = new Date();
    const dia = hoje.getDate();
    const mes = hoje.getMonth();
    const ano = hoje.getFullYear();

    if (dia !== 6 || mes !== 11 || ano !== 2025) {
      closeVideoFromCamera();
      setDialogOpen(false);
      Swal.fire({
        title: 'Avaliação indisponível',
        text: 'As avaliações só podem ser realizadas no dia 06/12/2025.',
        icon: 'info',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#003'
      });
      return;
    }

    setLoading(true);

    const ratingId = parseInt(assessment);

    if (!capturedImage) {
      setDialogOpen(false);
      setLoading(false);
      Swal.fire({
        title: 'Foto inválida',
        text: 'Por favor, tire uma foto antes de enviar',
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#003'
      });
      return;
    }

    if (isNaN(ratingId) || ratingId < 0 || ratingId > 10) {
      setDialogOpen(false);
      setLoading(false);
      Swal.fire({
        title: 'Nota inválida',
        text: 'Nota inválida. Insira um número entre 0 e 10',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#003'
      });
      return;
    }

    if (!comment.trim()) {
      setDialogOpen(false);
      setLoading(false);
      Swal.fire({
        title: 'Comentário inválido',
        text: 'Comentário não pode estar vazio',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#003'
      });
      return;
    }

    try {
      await postEvaluateOtherProjects({
        projectId: selectedProject!.codTeam,
        assessment: ratingId,
        comment: comment,
        image: new File([capturedImage], "avaliacao.jpg", { type: "image/jpeg" })
      });

      Swal.fire({
        title: 'Sucesso!',
        text: 'Sua avaliação foi enviada com sucesso',
        icon: 'success',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#003'
      });

      setDialogOpen(false);
      // Recarregar projetos
      const response = await getOtherProjectsData({});
      const projetosData = Array.isArray(response) ? response : response.data || [];
      setProjetos(projetosData);
      setTotalRegistros(projetosData.length);
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      Swal.fire({
        title: 'Erro',
        text: 'Erro ao enviar avaliação',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#003'
      });
    } finally {
      setLoading(false);
    }
  };

  async function aplicarFiltros() {
    setLoading(true);

    try {
      const payloadFiltros: StudentOtherProjectsFilters = {};

      if (filtros.GroupName.trim()) payloadFiltros.GroupName = filtros.GroupName;
      if (filtros.Semester) payloadFiltros.Semester = Number(filtros.Semester);

      console.log("Filtros enviados:", payloadFiltros);
      const response = await getOtherProjectsData(payloadFiltros);
      console.log("Resposta da API:", response);
      // A API retorna um array diretamente, não envelopado
      const projetos = Array.isArray(response) ? response : response.data || [];
      setProjetos(projetos);
      setTotalRegistros(projetos.length);
    } catch (error) {
      console.error("Erro ao buscar projetos:", error);
      setProjetos([]);
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
      const response = await getOtherProjectsData({});
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
        console.log("Carregando projetos...");
        const response = await getOtherProjectsData({});
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
      <Sidebar pageId="outros-projetos" type="student" />
      <main className="sm:ml-[250px] mt-16 min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#f5f7fa] to-[#eef2f7]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[var(--blue)] to-[#0066cc] w-full px-6 py-8 text-[var(--white)] shadow-lg">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 bg-white rounded-full"></div>
              <h1 className="text-3xl font-bold">Outros Projetos</h1>
            </div>
            <p className="opacity-90 mt-2 text-sm">
              Visualize e avalie outros projetos da instituição por nome do grupo e semestre
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
                          <TableHead className="text-gray-700 font-semibold text-center w-[150px]">Ação</TableHead>
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
                            <TableCell className="text-center w-[150px]">
                              {projeto.alreadyEvaluated ? (
                                <Button
                                  disabled
                                  className="opacity-50 cursor-not-allowed"
                                >
                                  Já avaliado
                                </Button>
                              ) : projeto.canEvaluate ? (
                                <Button
                                  onClick={() => {
                                    setSelectedProject(projeto.project);
                                    setDialogOpen(true);
                                  }}
                                  className="bg-[var(--blue)] hover:bg-[#0052a3] text-white cursor-pointer transition-all duration-200 active:brightness-90"
                                >
                                  Avaliar
                                </Button>
                              ) : (
                                <Button
                                  disabled
                                  className="opacity-50 cursor-not-allowed"
                                >
                                  Semestre superior
                                </Button>
                              )}
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
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Avaliação - {selectedProject?.groupName}</DialogTitle>
              <DialogDescription>
                Avalie o projeto baseado em sua experiência.
              </DialogDescription>
            </DialogHeader>

            <div className="my-4 space-y-4">
              <p>Para confirmar sua avaliação, é necessário se fotografar junto ao projeto.</p>
              <div id="picture-display">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full rounded-md"
                  style={{ transform: 'scaleX(-1)' }}
                />
                <div className="flex items-center justify-end mt-4">
                  <Button onClick={takePicture} className="bg-[var(--blue)] hover:bg-[#0052a3] text-white cursor-pointer transition-all duration-200 active:brightness-90">Tirar foto</Button>
                </div>
              </div>

              <div id="picture-show" style={{ display: 'none' }}>
                <canvas
                  id="taked-picture"
                  className="mt-4 w-full max-h-60 rounded-md object-contain"
                />
                <div className="flex items-center justify-between mt-4">
                  <p>Não ficou boa?</p>
                  <Button onClick={startVideoFromCamera} className="bg-[var(--blue)] hover:bg-[#0052a3] text-white cursor-pointer transition-all duration-200 active:brightness-90">Tire outra</Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-semibold">Nota (0 a 10) - Apenas números inteiros:</label>
                <Input
                  type="number"
                  min="0"
                  max="10"
                  step="1"
                  value={assessment}
                  onChange={(e) => {
                    const valor = e.target.value;
                    if (/^\d*$/.test(valor) && (valor === '' || (Number(valor) >= 0 && Number(valor) <= 10))) {
                      setAssessment(valor);
                    }
                  }}
                  placeholder="Digite a nota"
                />
              </div>

              <div className="space-y-2">
                <label className="font-semibold">Comentário:</label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Deixe seu comentário sobre o projeto..."
                  className="resize-none"
                />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={sendAssessment} className="bg-[var(--blue)] hover:bg-[#0052a3] text-white cursor-pointer transition-all duration-200 active:brightness-90">Enviar avaliação</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

