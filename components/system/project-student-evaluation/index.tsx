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
import { postEvaluateOtherProjects } from "@/services/api-student";
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
    alreadyEvaluated: boolean;
    canEvaluate: boolean;
    project: Project;
}

interface EvaluationPageProps {
    semester: number;
    projects: OtherProjectData[];
}

export function ProjectStudentEvaluation({ semester, projects }: EvaluationPageProps) {
    const [loading, setLoading] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [capturedImage, setCapturedImage] = useState<Blob | null>(null);
    const [rating, setRating] = useState("");
    const [comment, setComment] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (dialogOpen) {
            startVideoFromCamera();
        } else {
            closeVideoFromCamera();
            setRating("");
            setComment("");
            setCapturedImage(null);
        }
    }, [dialogOpen]);

    const startVideoFromCamera = () => {
        navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user' } // Especifica câmera frontal
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
                // Espelha horizontalmente para corrigir o espelhamento da câmera frontal
                context.scale(-1, 1);
                context.drawImage(video, -canvas.width, 0);
                // Restaura a transformação
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
        setLoading(true)
        const hoje = new Date();
        const dia = hoje.getDate();
        const mes = hoje.getMonth();
        const ano = hoje.getFullYear();

        if (dia !== 7 || mes !== 5 || ano !== 2025) {
            closeVideoFromCamera();
            setDialogOpen(false);
            setLoading(false)
            Swal.fire({
                title: 'Avaliação indisponível',
                text: 'As avaliações só podem ser realizadas no dia 07/06/2025.',
                icon: 'info',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#003'
            });
            return;
        }

        const ratingId = parseInt(rating);

        if (!capturedImage) {
            setDialogOpen(false);
            setLoading(false)
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
            setLoading(false)
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
            setLoading(false)
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
            let response = await postEvaluateOtherProjects({
                projectId: selectedProject!.codTeam,
                assessment: ratingId,
                comment: comment,
                image: new File([capturedImage], "avaliacao.jpg", { type: "image/jpeg" })
            });

            setDialogOpen(false);
            setLoading(false)
            Swal.fire({
                title: 'Obrigado!',
                text: 'Avaliação enviada com sucesso',
                icon: 'success',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#003'
            }).then(() => location.reload());

        } catch (error) {
            setDialogOpen(false);
            setLoading(false)
            Swal.fire({
                title: 'Erro ao enviar',
                text: 'Ocorreu um erro ao enviar sua avaliação. Tente novamente.',
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#003'
            });
        }
    };

    const filteredProjects = projects.filter((proj) =>
        proj.project.groupName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <LoadingOverlay active={loading} />
            <Sidebar pageId="outros-projetos" type="student" />
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
                                        <div className="w-full flex my-4">
                                            {proj.alreadyEvaluated ? (
                                                <Button className="opacity-50" disabled>Projeto já avaliado</Button>
                                            ) : proj.canEvaluate ? (
                                                <Button
                                                    onClick={() => {
                                                        setSelectedProject(proj.project);
                                                        setDialogOpen(true);
                                                    }}
                                                    className="bg-[var(--blue)] hover:bg-[var(--blue)] cursor-pointer"
                                                >
                                                    Avaliar Projeto
                                                </Button>
                                            ) : (
                                                <Button className="opacity-50" disabled>Semestre superior ao seu</Button>
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
                                    style={{ transform: 'scaleX(-1)' }} // Espelha o vídeo para o usuário ver corretamente
                                />
                                <div className="flex items-center justify-end mt-4">
                                    <Button onClick={takePicture} className="transition-all duration-200">Tirar foto</Button>
                                </div>
                            </div>

                            <div id="picture-show" style={{ display: 'none' }}>
                                <canvas
                                    id="taked-picture"
                                    className="mt-4 w-full max-h-60 rounded-md object-contain"
                                />
                                <div className="flex items-center justify-between mt-4">
                                    <p>Não ficou boa?</p>
                                    <Button onClick={startVideoFromCamera} className="transition-all duration-200">Tire outra</Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="font-semibold">Nota (0 a 10) - Apenas números inteiros:</label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="1" // Garante que o incremento seja em inteiros
                                    value={rating}
                                    onChange={(e) => {
                                        const valor = e.target.value;
                                        // Permite apenas inteiros entre 0 e 10
                                        if (/^\d*$/.test(valor) && (valor === '' || (Number(valor) >= 0 && Number(valor) <= 10))) {
                                            setRating(valor);
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
                            <Button onClick={sendAssessment} className="transition-all duration-200">Enviar avaliação</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}
