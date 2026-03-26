'use client'

import Sidebar from "@/components/system/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { postEvaluateProjects } from "@/services/api-teacher";
import LoadingOverlay from "../loading-overlay";

interface Project {
    codTeam: number;
    description: string;
    groupName: string;
    leader: number;
    semester: number;
    token: string;
}

interface OtherProjectData {
    alreadyBankingEvaluated: boolean;
    alreadyFairEvaluated: boolean;
    project: Project;
}

interface EvaluationPageProps {
    semester: number;
    projects: OtherProjectData[];
}

const evaluationCriteria = [
    "Introdução ao tema e objetivos",
    "Metodologia",
    "Resultados",
    "Qualidade e inovação da Maquete/Protótipo",
    "Conclusões Finais",
    "Respostas ao avaliador"
];

export function ProjectTeacherEvaluation({ semester, projects }: EvaluationPageProps) {
    const [loading, setLoading] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isBankEvaluation, setIsBankEvaluation] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [capturedImage, setCapturedImage] = useState<Blob | null>(null);
    const [criteriaRatings, setCriteriaRatings] = useState<Record<string, string>>({});
    const [comment, setComment] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [rating, setRating] = useState("");

    useEffect(() => {
        if (!dialogOpen) {
            setCriteriaRatings({});
            setComment("");
            setRating("");
            setCapturedImage(null);
            setSelectedProject(null);
        }
    }, [dialogOpen]);


    const sendAssessment = async () => {
        setLoading(true)
        const hoje = new Date();
        const dia = hoje.getDate();
        const mes = hoje.getMonth();
        const ano = hoje.getFullYear();

        if (!(ano === 2025 && mes === 5 && (dia === 5 || dia === 6 || dia === 7))) {
            setDialogOpen(false);
            setLoading(false)
            Swal.fire({
                title: 'Avaliação indisponível',
                text: 'As avaliações só podem ser realizadas nos dias 05, 06 e 07/06/2025.',
                icon: 'info',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#003'
            });
            return;
        }

        if (!selectedProject) return;

        try {
            let finalAssessment = 0;

            for (let crit of evaluationCriteria) {
                const nota = criteriaRatings[crit];
                if (!nota || isNaN(Number(nota)) || Number(nota) < 0 || Number(nota) > 10) {
                    setLoading(false)
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
            setLoading(false)
            Swal.fire({
                title: 'Obrigado!',
                text: 'Avaliação validada com sucesso.',
                icon: 'success',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#003'
            }).then(() => location.reload());

        } catch (error: any) {
            setDialogOpen(false);
            setLoading(false)
            Swal.fire({
                title: 'Erro ao enviar avaliação',
                text: error?.response?.data?.message || 'Houve um erro inesperado ao enviar a avaliação.',
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#003'
            });
        }
    };


    const filteredProjects = projects.filter((proj) => {
        const groupName = proj.project?.groupName;
        return typeof groupName === 'string' && groupName.toLowerCase().includes(searchTerm.toLowerCase());
    });


    return (
        <div>
            <LoadingOverlay active={loading} />
            <Sidebar pageId="projetos" type="teacher" />
            <main className="sm:ml-[250px] mt-16 min-h-[calc(100vh-64px)] bg-[var(--gray)]">
                <div className="bg-[var(--blue)] w-full h-60 text-[var(--white)] relative justify-center p-6">
                    <div className="absolute bottom-2 max-w-[calc(100%-100px)]">
                        <h1>Outros Projetos - {semester}º Sem</h1>
                        <p className="mb-6 opacity-50 mt-2">Para comunicar eventuais inconsistências, acesse a aba de suporte no seu perfil e entre em contato com a equipe organizadora.</p>
                    </div>
                </div>

                <div className="p-6 bg-[var(--gray)] grid grid-cols-1 lg:grid-cols-1 gap-6">
                    <Card>
                        <CardContent>
                            <h3 className="mb-4">Buscar projeto do {semester}º Sem</h3>
                            <div className="mb-4">
                                <Input
                                    type="text"
                                    placeholder="Buscar grupo pelo nome"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {filteredProjects.length == 0 && <p className="text-lg opacity-50">Nenhum projeto encontrado</p>}
                    {filteredProjects.map((proj, index) => (
                        <Card key={index} className="flex flex-col justify-center">
                            <CardContent>
                                <div className="flex gap-6 items-center">
                                    <div className="w-full">
                                        <div className="text-lg font-bold">{proj.project.groupName}</div>
                                        <div className="opacity-70">{proj.project.description}</div>
                                        <div className="w-full flex my-4 gap-4">
                                            {proj.alreadyBankingEvaluated ? (
                                                <Button
                                                    className="bg-[var(--blue)] hover:bg-[var(--blue)] opacity-50  cursor-not-allowed"
                                                >
                                                    Banca já avaliada
                                                </Button>
                                            ) : proj.alreadyFairEvaluated ? (
                                                <Button
                                                    className="bg-[var(--blue)] hover:bg-[var(--blue)] opacity-50 cursor-not-allowed"
                                                >
                                                    Feira já avaliada
                                                </Button>

                                            ) : (
                                                <div className="flex gap-4">
                                                    <Button
                                                        onClick={() => {
                                                            setSelectedProject(proj.project);
                                                            setIsBankEvaluation(true);
                                                            setDialogOpen(true);
                                                        }}
                                                        className="bg-[var(--blue)] hover:bg-[var(--blue)] cursor-pointer transition-all duration-200 active:brightness-90"
                                                    >
                                                        Avaliar Banca
                                                    </Button>
                                                    <Button
                                                        onClick={() => {
                                                            setSelectedProject(proj.project);
                                                            setIsBankEvaluation(false);
                                                            setDialogOpen(true);
                                                        }}
                                                        className="bg-[var(--blue)] hover:bg-[var(--blue)] cursor-pointer transition-all duration-200 active:brightness-90"
                                                    >
                                                        Avaliar Feira
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Avaliação <strong>{isBankEvaluation ? "Banca" : "Feira"}</strong> - {selectedProject?.groupName}</DialogTitle>
                            <DialogDescription>Avalie o projeto baseado em sua experiência.</DialogDescription>
                        </DialogHeader>

                        <div className="my-4 space-y-4">
                            <div className="space-y-4">
                                {evaluationCriteria.map((crit, idx) => (
                                    <div className="space-y-2" key={idx}>
                                        <label className="font-semibold">{crit} (0 a 10):</label>

                                        <Input
                                            type="text"
                                            inputMode="decimal"
                                            value={criteriaRatings[crit] || ""}
                                            onChange={(e) => {
                                                // Substitui vírgula por ponto e remove espaços
                                                let value = e.target.value.replace(",", ".").trim();

                                                // Verifica se o valor é um número válido e dentro do intervalo
                                                const regex = /^\d{0,2}(\.\d{0,2})?$/;
                                                if (value === "" || regex.test(value)) {
                                                    const num = parseFloat(value);
                                                    if (isNaN(num) || num <= 10) {
                                                        setCriteriaRatings({ ...criteriaRatings, [crit]: value });
                                                    }
                                                }
                                            }}
                                            placeholder="0.00"
                                        />

                                    </div>
                                ))}
                                <div className="space-y-2">
                                    <label className="font-semibold">Comentário geral:</label>
                                    <Textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Deixe seu comentário sobre o projeto..."
                                        className="resize-none"
                                    />
                                </div>
                                <div>
                                    <input type="hidden" value={isBankEvaluation ? "Banca" : "Feira"}></input>
                                </div>
                            </div>

                        </div>

                        <DialogFooter>
                            <Button onClick={sendAssessment} className="bg-[var(--blue)] hover:bg-[var(--blue)] cursor-pointer transition-all duration-200 active:brightness-90">Enviar avaliação</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main >
        </div >
    );
}
