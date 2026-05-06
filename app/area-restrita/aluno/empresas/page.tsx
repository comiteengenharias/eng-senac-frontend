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
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@radix-ui/react-avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyLogin } from "@/services/api-login";
import { getBusinessInfo, postBusinessAssessment } from "@/services/api-student";
import Swal from "sweetalert2";
import LoadingOverlay from "@/components/system/loading-overlay";

export default function AreaRestrita_Aluno() {
  const router = useRouter();
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const data = await verifyLogin();
      if (!data || data == null || data.role !== 'Student') {
        router.push('/login/aluno');
      }
    })();
  }, []);

  interface CompanyEvaluation {
    company: {
      codCompany: number;
      name: string;
      description: string;
      picture: string;
    };
    canEvaluate: boolean;
  }

  const [dialogOpen, setDialogOpen] = useState(false);
  const [empresaSelecionada, setEmpresaSelecionada] = useState<CompanyEvaluation | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [imagemCapturada, setImagemCapturada] = useState<Blob | null>(null);
  const [nota, setNota] = useState("");
  const [comentario, setComentario] = useState("");

  const [businessInfo, setbusinessInfo] = useState<CompanyEvaluation[] | []>([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await getBusinessInfo();
        setbusinessInfo(response);
      } catch (error) {
        console.error('Erro ao carregar empresas:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (dialogOpen) {
      startVideoFromCamera();
    } else {
      closeVideoFromCamera();
      setNota("");
      setComentario("");
      setImagemCapturada(null);
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
    }).catch(error => {
      Swal.fire({
        title: 'Erro ao iniciar a câmera',
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
            setImagemCapturada(blob);
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

    const notaInt = parseInt(nota);

    if (!imagemCapturada) {
      setDialogOpen(false);
      Swal.fire({
        title: 'Foto inválida',
        text: 'Por favor, tire uma foto antes de enviar',
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#003'
      });
      return;
    }

    if (isNaN(notaInt) || notaInt < 0 || notaInt > 10) {
      setDialogOpen(false);
      Swal.fire({
        title: 'Nota inválida',
        text: 'Nota inválida. Insira um número entre 0 e 10',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#003'
      });
      return;
    }

    if (!comentario.trim()) {
      setDialogOpen(false);
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
      await postBusinessAssessment({
        companyId: empresaSelecionada!.company.codCompany,
        assessment: notaInt,
        comment: comentario,
        image: new File([imagemCapturada], "avaliacao.jpg", { type: "image/jpeg" })
      });

      setDialogOpen(false);
      Swal.fire({
        title: 'Obrigado!',
        text: 'Avaliação enviada com sucesso',
        icon: 'success',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#003'
      }).then(() => location.reload());

    } catch (error) {
      setDialogOpen(false);
      Swal.fire({
        title: 'Erro ao enviar',
        text: 'Ocorreu um erro ao enviar sua avaliação. Tente novamente.',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#003'
      });
    }
  };

  return (
    <div>
      <LoadingOverlay active={loading} />
      <Sidebar pageId="empresas" type="student" />
      <main className="sm:ml-[250px] mt-16 min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#f5f7fa] to-[#eef2f7]">
        <div className="bg-gradient-to-r from-[var(--blue)] to-[#0066cc] w-full px-6 py-8 text-[var(--white)] shadow-lg">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 bg-white rounded-full"></div>
              <h1 className="text-3xl font-bold">Empresas</h1>
            </div>
            <p className="opacity-90 mt-2 text-sm">Avalie as empresas da Semana das Engenharias</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {businessInfo.length == 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-gray-500">🏢 Nenhuma empresa registrada</p>
            </div>
          )}
          {businessInfo.map((business, index) => (
            <Card key={index} className="shadow-md border-0 overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
              <CardContent className="p-4 flex flex-col h-full">
                <div className="flex flex-col items-center gap-4 flex-1">
                  <Avatar className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0">
                    <AvatarImage
                      src={business.company.picture}
                      className="rounded-full object-cover w-full h-full"
                    />
                    <AvatarFallback className="w-full h-full bg-gray-200 border-4 border-gray-300 flex items-center justify-center">
                      <span className="text-gray-500 text-sm text-center px-2">{business.company.name}</span>
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <div className="text-base font-bold text-gray-800">{business.company.name}</div>
                  </div>
                </div>
                <div className="w-full pt-4">
                  {!business.canEvaluate ? (
                    <Button className="w-full opacity-50 cursor-not-allowed" disabled>
                      ✓ Já avaliada
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setEmpresaSelecionada(business);
                        setDialogOpen(true);
                      }}
                      className="w-full bg-[var(--blue)] hover:bg-[#0052a3] text-white font-semibold cursor-pointer transition-all duration-200 active:brightness-90"
                    >
                      ⭐ Avaliar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Avaliação - {empresaSelecionada?.company.name}</DialogTitle>
              <DialogDescription>
                Avalie a empresa com base em sua experiência.
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
                  <Button onClick={takePicture} className="cursor-pointer transition-all duration-200 active:brightness-90">Tirar foto</Button>
                </div>
              </div>

              <div id="picture-show" style={{ display: 'none' }}>
                <canvas
                  id="taked-picture"
                  className="mt-4 w-full max-h-60 rounded-md object-contain"
                />
                <div className="flex items-center justify-between mt-4">
                  <p>Não ficou boa?</p>
                  <Button onClick={startVideoFromCamera} className="cursor-pointer transition-all duration-200 active:brightness-90">Tire outra</Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-semibold">Nota (0 a 10) - Apenas números inteiros:</label>
                <Input
                  type="number"
                  min="0"
                  max="10"
                  step="1" // Garante que o incremento seja em inteiros
                  value={nota}
                  onChange={(e) => {
                    const valor = e.target.value;
                    // Permite apenas inteiros entre 0 e 10
                    if (/^\d*$/.test(valor) && (valor === '' || (Number(valor) >= 0 && Number(valor) <= 10))) {
                      setNota(valor);
                    }
                  }}
                  placeholder="Digite a nota"
                />
              </div>


              <div className="space-y-2">
                <label className="font-semibold">Comentário:</label>
                <Textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Escreva seu comentário..."
                  className="resize-none"
                />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={sendAssessment} className="cursor-pointer transition-all duration-200 active:brightness-90">Enviar Avaliação</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
