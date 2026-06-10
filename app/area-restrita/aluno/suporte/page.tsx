'use client'

import LoadingOverlay from "@/components/system/loading-overlay";
import Sidebar from "@/components/system/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { verifyLogin } from "@/services/api-login";
import { getStudentInfo, postPlatformIssue } from "@/services/api-student";
import { AlertCircle, ImagePlus, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

export default function Suporte() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [studentId, setStudentId] = useState<number>(0);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image1, setImage1] = useState<File | null>(null);
    const [image2, setImage2] = useState<File | null>(null);
    const [preview1, setPreview1] = useState<string | null>(null);
    const [preview2, setPreview2] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const fileRef1 = useRef<HTMLInputElement>(null);
    const fileRef2 = useRef<HTMLInputElement>(null);

    useEffect(() => {
        (async () => {
            const auth = await verifyLogin();
            if (!auth || auth.role !== 'Student') {
                router.push('/login/aluno');
                return;
            }
            try {
                const info = await getStudentInfo();
                const studentData = info?.student ?? info;
                setStudentId(studentData?.codStudents ?? studentData?.CodStudents ?? 0);
            } catch {
                // continua mesmo sem o studentId
            }
            setLoading(false);
        })();
    }, []);

    const handleImageChange = (file: File | null, slot: 1 | 2) => {
        if (!file) return;
        const previewUrl = URL.createObjectURL(file);
        if (slot === 1) {
            setImage1(file);
            setPreview1(previewUrl);
        } else {
            setImage2(file);
            setPreview2(previewUrl);
        }
    };

    const removeImage = (slot: 1 | 2) => {
        if (slot === 1) {
            setImage1(null);
            setPreview1(null);
            if (fileRef1.current) fileRef1.current.value = '';
        } else {
            setImage2(null);
            setPreview2(null);
            if (fileRef2.current) fileRef2.current.value = '';
        }
    };

    const uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('image', file);
        const res = await fetch('/api/upload-issue-image', { method: 'POST', body: formData });
        if (!res.ok) throw new Error('Falha ao enviar imagem');
        const data = await res.json();
        return data.path as string;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !description.trim()) {
            Swal.fire({ icon: 'warning', title: 'Atenção', text: 'Preencha o título e a descrição antes de enviar.' });
            return;
        }

        setSubmitting(true);
        try {
            let imageUrl1 = '';
            let imageUrl2 = '';

            if (image1) imageUrl1 = await uploadImage(image1);
            if (image2) imageUrl2 = await uploadImage(image2);

            const sentAt = new Date()
                .toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' })
                .replace(' ', 'T') + '.000-03:00';

            const result = await postPlatformIssue({ studentId, title, description, sentAt, imageUrl1, imageUrl2 });

            Swal.fire({
                icon: 'success',
                title: 'Problema registrado!',
                text: result?.message ?? 'Problema enviado com sucesso.',
            });

            setTitle('');
            setDescription('');
            removeImage(1);
            removeImage(2);
        } catch (err: any) {
            const apiMessage = err?.response?.data?.message ?? err?.response?.data ?? null;
            Swal.fire({
                icon: 'warning',
                title: 'Erro ao enviar',
                text: typeof apiMessage === 'string' ? apiMessage : 'Não foi possível registrar o problema. Tente novamente mais tarde.',
            });
        } finally {
            setSubmitting(false);
        }
    };

    const imageSlots = [
        { slot: 1 as const, preview: preview1, ref: fileRef1 },
        { slot: 2 as const, preview: preview2, ref: fileRef2 },
    ];

    return (
        <div>
            <LoadingOverlay active={loading} />
            <Sidebar pageId="suporte" type="student" />
            <main className="sm:ml-[250px] mt-16 min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#f5f7fa] to-[#eef2f7]">
                <div className="bg-gradient-to-r from-[var(--blue)] to-[#0066cc] w-full px-6 py-8 text-[var(--white)] shadow-lg">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-1 h-8 bg-white rounded-full"></div>
                            <h1 className="text-3xl font-bold">Suporte Técnico</h1>
                        </div>
                        <p className="opacity-90 mt-2 text-sm">Relate problemas técnicos com a plataforma</p>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto p-6 space-y-6">

                    {/* Aviso informativo */}
                    <Card className="border-0 shadow-md bg-amber-50 border-l-4 border-amber-400">
                        <CardContent className="pt-4 pb-4">
                            <div className="flex gap-3">
                                <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={20} />
                                <div className="space-y-2 text-sm text-gray-700">
                                    <p className="font-semibold">Leia antes de enviar:</p>
                                    <ul className="list-disc ml-4 space-y-1.5">
                                        <li>
                                            Este formulário é <strong>exclusivo para problemas técnicos com a plataforma</strong>{" "}
                                            (Erros de log em palestra, bugs, dados incorretos, etc.).
                                        </li>
                                        <li>
                                            <strong>Não utilize este canal</strong> para solicitar alteração de frequência em palestras, alteração de notas ou qualquer outra questão acadêmica.
                                        </li>
                                        <li>
                                            Após o envio, nossa equipe verificará o problema em <strong>até 1 dia útil</strong>.
                                        </li>
                                        <li>
                                            Para facilitar a resolução, você pode anexar <strong>até 2 imagens ou prints</strong>{" "}
                                            que comprovem o que está relatando.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Formulário */}
                    <Card className="border-0 shadow-md">
                        <CardHeader>
                            <CardTitle className="text-gray-800">Descreva o problema</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-5">

                                <div className="space-y-1.5">
                                    <Label htmlFor="title">
                                        Título <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="title"
                                        placeholder="Ex: Não consigo acessar a página de empresas"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        maxLength={100}
                                        disabled={submitting}
                                    />
                                    <p className="text-xs text-gray-400 text-right">{title.length}/100</p>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="description">
                                        Descrição <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Descreva o problema com o máximo de detalhes possível..."
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        rows={5}
                                        maxLength={500}
                                        disabled={submitting}
                                    />
                                    <p className="text-xs text-gray-400 text-right">{description.length}/500</p>
                                </div>

                                {/* Upload de imagens */}
                                <div className="space-y-2">
                                    <Label>Imagens <span className="text-gray-400 font-normal">(opcional)</span></Label>
                                    <p className="text-xs text-gray-500">
                                        Anexe até 2 imagens ou prints que comprovem o problema relatado.
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        {imageSlots.map(({ slot, preview, ref }) => (
                                            <div key={slot}>
                                                <input
                                                    ref={ref}
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={e => handleImageChange(e.target.files?.[0] ?? null, slot)}
                                                    disabled={submitting}
                                                />
                                                {preview ? (
                                                    <div className="relative rounded-lg overflow-hidden border border-gray-200 aspect-video">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={preview}
                                                            alt={`Imagem ${slot}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(slot)}
                                                            disabled={submitting}
                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => ref.current?.click()}
                                                        disabled={submitting}
                                                        className="w-full aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-[var(--blue)] hover:text-[var(--blue)] transition-colors disabled:opacity-50"
                                                    >
                                                        <ImagePlus size={28} />
                                                        <span className="text-xs">Imagem {slot}</span>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-[var(--blue)] hover:bg-[#0052a3] text-white"
                                >
                                    {submitting ? (
                                        <span className="flex items-center gap-2">
                                            <Upload size={16} className="animate-bounce" />
                                            Enviando...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Upload size={16} />
                                            Enviar problema
                                        </span>
                                    )}
                                </Button>

                            </form>
                        </CardContent>
                    </Card>

                </div>
            </main>
        </div>
    );
}
