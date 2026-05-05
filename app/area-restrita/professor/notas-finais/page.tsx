'use client';

import { useState, useEffect } from "react";
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
import { getFinalNotes, FinalNotesFilters, getPointMaterials, StudentPerformance } from "@/services/api-teacher";
import LoadingOverlay from "@/components/system/loading-overlay";
import { Search, RotateCcw } from "lucide-react";

function formatarNomeCompleto(nome: string): string {
  return nome
    .toLowerCase()
    .split(" ")
    .map(palavra => {
      if (palavra.length === 0) return "";
      return palavra[0].toUpperCase() + palavra.slice(1);
    })
    .join(" ");
}

function getCourseStyles(curso: string): { bg: string; text: string } {
  const upperCurso = curso.toUpperCase();
  // Aceita tanto BEC/BEP quanto comp/prod
  if (upperCurso === "BEC" || curso === "comp") {
    return { bg: "bg-blue-100", text: "text-blue-700" };
  } else if (upperCurso === "BEP" || curso === "prod") {
    return { bg: "bg-orange-100", text: "text-orange-700" };
  }
  return { bg: "bg-blue-100", text: "text-blue-700" };
}

const CURSOS = ["BEC", "BEP"];
const SEMESTRES = [1, 3, 5, 7, 9];

// Mapeamento de cursos para exibição e envio à API
const CURSO_MAPPING: Record<string, string> = {
  "BEC": "comp",
  "BEP": "prod",
  "comp": "BEC",
  "prod": "BEP"
};

function getApiCourseValue(displayValue: string): string {
  return CURSO_MAPPING[displayValue] || displayValue;
}

export default function AreaRestrita_Professor() {
  const [loading, setLoading] = useState(false);
  const [alunos, setAlunos] = useState<StudentPerformance[]>([]);
  const [totalRegistros, setTotalRegistros] = useState<number>(0);
  const [paginaAtual, setPaginaAtual] = useState<number>(1);
  const [totalPaginas, setTotalPaginas] = useState<number>(1);
  const [disciplinas, setDisciplinas] = useState<string[]>([]);

  // Filtros
  const [filtros, setFiltros] = useState({
    Fullname: "",
    Semester: "",
    Course: "",
    PointMaterial: "",
  });

  const porPagina = 50;

  async function aplicarFiltros() {
    setLoading(true);
    setPaginaAtual(1);
    
    try {
      const payloadFiltros: FinalNotesFilters = {
        Page: 1,
        PerPage: porPagina,
      };

      if (filtros.Fullname.trim()) payloadFiltros.Fullname = filtros.Fullname;
      if (filtros.Semester) payloadFiltros.Semester = Number(filtros.Semester);
      if (filtros.Course) payloadFiltros.Course = filtros.Course;
      if (filtros.PointMaterial) payloadFiltros.PointMaterial = filtros.PointMaterial;

      const response = await getFinalNotes(payloadFiltros);
      setAlunos(response.data);
      setTotalRegistros(response.total);
      setTotalPaginas(Math.ceil(response.total / porPagina));
    } catch (error) {
      console.error("Erro ao buscar notas finais:", error);
    } finally {
      setLoading(false);
    }
  }

  async function mudarPagina(novaPagina: number) {
    if (novaPagina < 1 || novaPagina > totalPaginas) return;

    setLoading(true);
    try {
      const payloadFiltros: FinalNotesFilters = {
        Page: novaPagina,
        PerPage: porPagina,
      };

      if (filtros.Fullname.trim()) payloadFiltros.Fullname = filtros.Fullname;
      if (filtros.Semester) payloadFiltros.Semester = Number(filtros.Semester);
      if (filtros.Course) payloadFiltros.Course = filtros.Course;
      if (filtros.PointMaterial) payloadFiltros.PointMaterial = filtros.PointMaterial;

      const response = await getFinalNotes(payloadFiltros);
      setAlunos(response.data);
      setPaginaAtual(novaPagina);
    } catch (error) {
      console.error("Erro ao buscar notas finais:", error);
    } finally {
      setLoading(false);
    }
  }

  async function resetarFiltros() {
    setFiltros({
      Fullname: "",
      Semester: "",
      Course: "",
      PointMaterial: "",
    });
    setPaginaAtual(1);
    setLoading(true);

    try {
      const payloadFiltros: FinalNotesFilters = {
        Page: 1,
        PerPage: porPagina,
      };

      const response = await getFinalNotes(payloadFiltros);
      setAlunos(response.data);
      setTotalRegistros(response.total);
      setTotalPaginas(Math.ceil(response.total / porPagina));
    } catch (error) {
      console.error("Erro ao carregar notas finais:", error);
    } finally {
      setLoading(false);
    }
  }

  // Carregar disciplinas ao abrir a página
  useEffect(() => {
    const carregarDisciplinas = async () => {
      try {
        const response = await getPointMaterials();
        setDisciplinas(response.data);
      } catch (error) {
        console.error("Erro ao carregar disciplinas:", error);
      }
    };

    carregarDisciplinas();
  }, []);

  // Carregar todos os dados ao abrir a página
  useEffect(() => {
    const carregarDadosIniciais = async () => {
      setLoading(true);
      try {
        const payloadFiltros: FinalNotesFilters = {
          Page: 1,
          PerPage: porPagina,
        };

        const response = await getFinalNotes(payloadFiltros);
        setAlunos(response.data);
        setTotalRegistros(response.total);
        setTotalPaginas(Math.ceil(response.total / porPagina));
      } catch (error) {
        console.error("Erro ao carregar notas finais:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDadosIniciais();
  }, [porPagina]);

  return (
    <div>
      <LoadingOverlay active={loading} />
      <Sidebar pageId="notas-finais" type="teacher" />
      <main className="sm:ml-[250px] mt-16 min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#f5f7fa] to-[#eef2f7]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[var(--blue)] to-[#0066cc] w-full px-6 py-8 text-[var(--white)] shadow-lg">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 bg-white rounded-full"></div>
              <h1 className="text-3xl font-bold">Notas Finais</h1>
            </div>
            <p className="opacity-90 mt-2 text-sm">
              Visualize e filtre as notas finais dos alunos por semestre, curso e disciplina
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
                  {/* Nome do Aluno */}
                  <div className="flex flex-col gap-1 flex-grow min-w-[200px] max-w-[400px]">
                    <label className="text-xs font-medium text-gray-700">Nome do Aluno</label>
                    <Input
                      placeholder="Ex: João Silva"
                      value={filtros.Fullname}
                      onChange={(e) => setFiltros({ ...filtros, Fullname: e.target.value })}
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

                  {/* Curso */}
                  <div className="flex flex-col gap-1 w-[140px]">
                    <label className="text-xs font-medium text-gray-700">Curso</label>
                    <Select value={filtros.Course ? getApiCourseValue(filtros.Course) : "all"} onValueChange={(value) => setFiltros({ ...filtros, Course: value === "all" ? "" : getApiCourseValue(value) })}>
                      <SelectTrigger className="border-gray-300 focus:border-[var(--blue)] focus:ring-[var(--blue)] h-9 text-sm w-full">
                        <SelectValue placeholder="Selecionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os cursos</SelectItem>
                        {CURSOS.map((curso) => (
                          <SelectItem key={curso} value={curso}>
                            {curso}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Disciplina */}
                  <div className="flex flex-col gap-1 w-[280px] sm:w-[220px] md:w-[280px]">
                    <label className="text-xs font-medium text-gray-700">Disciplina</label>
                    <Select value={filtros.PointMaterial || "all"} onValueChange={(value) => setFiltros({ ...filtros, PointMaterial: value === "all" ? "" : value })}>
                      <SelectTrigger className="border-gray-300 focus:border-[var(--blue)] focus:ring-[var(--blue)] h-9 text-sm w-full">
                        <SelectValue placeholder="Selecionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as disciplinas</SelectItem>
                        {disciplinas.map((disciplina) => (
                          <SelectItem key={disciplina} value={disciplina}>
                            {disciplina}
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
          {alunos.length > 0 && (
            <>
              <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <span className="text-sm font-medium text-gray-700">
                  Total de alunos: <span className="font-bold text-[var(--blue)]">{totalRegistros}</span>
                </span>
                <span className="text-sm font-medium text-gray-700">
                  Página {paginaAtual} de {totalPaginas}
                </span>
              </div>

              <Card className="shadow-md border-0 overflow-hidden">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table className="w-full">
                      <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                        <TableRow className="border-b-2 border-gray-300">
                          <TableHead className="px-4 py-3 text-left text-gray-700 font-semibold text-xs uppercase tracking-wider">
                            ID Senac
                          </TableHead>
                          <TableHead className="px-4 py-3 text-left text-gray-700 font-semibold text-xs uppercase tracking-wider">
                            Aluno
                          </TableHead>
                          <TableHead className="px-4 py-3 text-center text-gray-700 font-semibold text-xs uppercase tracking-wider">
                            Sem.
                          </TableHead>
                          <TableHead className="px-4 py-3 text-center text-gray-700 font-semibold text-xs uppercase tracking-wider">
                            Curso
                          </TableHead>
                          <TableHead className="px-4 py-3 text-center text-gray-700 font-semibold text-xs uppercase tracking-wider">
                            Média PI
                          </TableHead>
                          <TableHead className="px-4 py-3 text-center text-gray-700 font-semibold text-xs uppercase tracking-wider">
                            Ponto 12ºSdE
                          </TableHead>
                          <TableHead className="px-4 py-3 text-left text-gray-700 font-semibold text-xs uppercase tracking-wider">
                            Disciplina
                          </TableHead>
                          <TableHead className="px-4 py-3 text-center text-gray-700 font-semibold text-xs uppercase tracking-wider">
                            Ponto Adic.
                          </TableHead>
                          <TableHead className="px-4 py-3 text-left text-gray-700 font-semibold text-xs uppercase tracking-wider">
                            Disc. Ponto Adic.
                          </TableHead>
                          <TableHead className="px-4 py-3 text-left text-gray-700 font-semibold text-xs uppercase tracking-wider">
                            Motivo
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {alunos.map((aluno, index) => {
                          const extraPointsList = aluno.extraPoints && aluno.extraPoints.length > 0 
                            ? aluno.extraPoints 
                            : [{ codExtraPoint: 0, point: 0, reason: '', discipline: '' }];
                          
                          return extraPointsList.map((extraPoint, epIndex) => (
                            <TableRow 
                              key={`${index}-${epIndex}`}
                              className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-150"
                            >
                              {epIndex === 0 && (
                                <>
                                  <TableCell className="px-4 py-3 font-mono text-xs text-gray-600" rowSpan={extraPointsList.length}>
                                    {aluno.idSenac}
                                  </TableCell>
                                  <TableCell className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap" rowSpan={extraPointsList.length}>
                                    <span className="text-sm max-w-[180px] line-clamp-2">
                                      {formatarNomeCompleto(aluno.studentName)}
                                    </span>
                                  </TableCell>
                                  <TableCell className="px-4 py-3 text-center text-gray-700 text-sm font-medium" rowSpan={extraPointsList.length}>
                                    {aluno.semester}º
                                  </TableCell>
                                  <TableCell className="px-4 py-3 text-center" rowSpan={extraPointsList.length}>
                                    {(() => {
                                      const styles = getCourseStyles(aluno.course);
                                      return (
                                        <span className={`${styles.bg} ${styles.text} px-2.5 py-1 rounded-md text-xs font-bold whitespace-nowrap`}>
                                          {aluno.course}
                                        </span>
                                      );
                                    })()}
                                  </TableCell>
                                  <TableCell className="px-4 py-3 text-center text-gray-800 font-semibold text-sm" rowSpan={extraPointsList.length}>
                                    {aluno.average.toFixed(2)}
                                  </TableCell>
                                  <TableCell className="px-4 py-3 text-center font-semibold text-sm" rowSpan={extraPointsList.length}>
                                    <span className={aluno.extraNote > 0 ? 'text-green-600' : 'text-gray-500'}>
                                      {aluno.extraNote.toFixed(2)}
                                    </span>
                                  </TableCell>
                                  <TableCell className="px-4 py-3 text-gray-700 text-sm max-w-xs" rowSpan={extraPointsList.length}>
                                    <span className="line-clamp-2">{aluno.pointMaterial}</span>
                                  </TableCell>
                                </>
                              )}
                              <TableCell className="px-4 py-3 text-center font-semibold text-sm">
                                {extraPoint.point > 0 ? (
                                  <span className="text-green-600">
                                    {extraPoint.point.toFixed(2)}
                                  </span>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </TableCell>
                              <TableCell className="px-4 py-3 text-gray-700 text-sm max-w-xs">
                                <span className="line-clamp-2">{extraPoint.discipline || '-'}</span>
                              </TableCell>
                              <TableCell className="px-4 py-3 text-gray-700 text-sm max-w-sm">
                                <span className="line-clamp-3">{extraPoint.reason || '-'}</span>
                              </TableCell>
                            </TableRow>
                          ));
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Paginação */}
              <div className="flex justify-center items-center gap-3">
                <Button
                  variant="outline"
                  disabled={paginaAtual === 1 || loading}
                  onClick={() => mudarPagina(paginaAtual - 1)}
                  className="cursor-pointer border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                >
                  ← Anterior
                </Button>
                
                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                    let pagina = i + 1;
                    if (totalPaginas > 5) {
                      if (paginaAtual > 3) {
                        pagina = paginaAtual - 2 + i;
                      }
                      if (paginaAtual > totalPaginas - 3) {
                        pagina = totalPaginas - 4 + i;
                      }
                    }
                    
                    return (
                      pagina <= totalPaginas && (
                        <Button
                          key={pagina}
                          variant={paginaAtual === pagina ? "default" : "outline"}
                          onClick={() => mudarPagina(pagina)}
                          disabled={loading}
                          className={`w-10 h-10 cursor-pointer transition-all duration-200 ${
                            paginaAtual === pagina
                              ? "bg-[var(--blue)] text-white active:brightness-90"
                              : "border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {pagina}
                        </Button>
                      )
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  disabled={paginaAtual === totalPaginas || loading}
                  onClick={() => mudarPagina(paginaAtual + 1)}
                  className="cursor-pointer border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                >
                  Próxima →
                </Button>
              </div>
            </>
          )}

          {/* Estado vazio */}
          {alunos.length === 0 && totalRegistros === 0 && (
            <Card className="shadow-md border-0">
              <CardContent className="py-12 text-center">
                <div className="space-y-3">
                  <Search className="w-12 h-12 mx-auto text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-600">Nenhum registro encontrado</h3>
                  <p className="text-gray-500">
                    Aplique filtros e clique em "Filtrar" para visualizar os resultados
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
