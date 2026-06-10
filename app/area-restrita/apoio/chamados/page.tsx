'use client'

import LoadingOverlay from "@/components/system/loading-overlay";
import Sidebar from "@/components/system/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { verifyLogin } from "@/services/api-login";
import { closePlatformIssue, getPlatformIssues } from "@/services/api-support";
import { CalendarDays, CheckCircle2, Circle, GraduationCap, Image as ImageIcon, Mail, Phone, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

interface StudentInfo {
    codStudents: number;
    idSenac: number;
    institutionalEmail: string;
    personalEmail: string | null;
    cellphone: string;
    semester: number;
}

interface Issue {
    codIssue: number;
    title: string;
    description: string;
    sentAt: string;
    imageUrl1: string | null;
    imageUrl2: string | null;
    checked: boolean;
    resolutionComment: string | null;
}

interface PlatformIssueEntry {
    student: StudentInfo;
    issue: Issue;
}

type Filter = 'all' | 'open' | 'closed';

export default function ChamadosSuporte() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [issues, setIssues] = useState<PlatformIssueEntry[]>([]);
    const [filter, setFilter] = useState<Filter>('open');

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selected, setSelected] = useState<PlatformIssueEntry | null>(null);
    const [resolutionComment, setResolutionComment] = useState('');
    const [closing, setClosing] = useState(false);

    // Lightbox
    const [lightbox, setLightbox] = useState<string | null>(null);
    const lightboxRef = useRef<string | null>(null);

    const openLightbox = (url: string) => { lightboxRef.current = url; setLightbox(url); };
    const closeLightbox = () => { lightboxRef.current = null; setLightbox(null); };

    const handleDialogOpenChange = (open: boolean) => {
        if (!open && lightboxRef.current) {
            closeLightbox();
            return;
        }
        setDialogOpen(open);
    };

    useEffect(() => {
        (async () => {
            const auth = await verifyLogin();
            if (!auth || auth.role !== 'Support') {
                router.push('/area-restrita');
                return;
            }
            await fetchIssues(filter);
            setLoading(false);
        })();
    }, []);

    const fetchIssues = async (currentFilter: Filter) => {
        try {
            const onlyUnsolved = currentFilter === 'open' ? true : currentFilter === 'closed' ? false : undefined;
            const data = await getPlatformIssues(onlyUnsolved);
            // When filter is 'all' the API returns everything; for 'closed' it returns solved too, so filter client-side
            if (currentFilter === 'closed') {
                setIssues((data as PlatformIssueEntry[]).filter(e => e.issue.checked));
            } else {
                setIssues(data);
            }
        } catch {
            setIssues([]);
        }
    };

    const handleFilterChange = async (newFilter: Filter) => {
        setFilter(newFilter);
        setLoading(true);
        await fetchIssues(newFilter);
        setLoading(false);
    };

    const openDialog = (entry: PlatformIssueEntry) => {
        setSelected(entry);
        setResolutionComment('');
        setDialogOpen(true);
    };

    const handleClose = async () => {
        if (!selected) return;
        if (!resolutionComment.trim()) {
            Swal.fire({ icon: 'warning', title: 'Atenção', text: 'Adicione um comentário de resolução antes de fechar o chamado.' });
            return;
        }
        setClosing(true);
        try {
            await closePlatformIssue(selected.issue.codIssue, resolutionComment.trim());
            Swal.fire({ icon: 'success', title: 'Chamado fechado!', text: 'O chamado foi encerrado com sucesso.' });
            setDialogOpen(false);
            setLoading(true);
            await fetchIssues(filter);
            setLoading(false);
        } catch {
            Swal.fire({ icon: 'error', title: 'Erro', text: 'Não foi possível fechar o chamado. Tente novamente.' });
        } finally {
            setClosing(false);
        }
    };

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'short' });

    const filterLabels: Record<Filter, string> = { all: 'Todos', open: 'Abertos', closed: 'Fechados' };

    return (
        <div>
            <LoadingOverlay active={loading} />
            <Sidebar pageId="chamados" type="support" />

            <main className="sm:ml-[250px] mt-16 min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#f5f7fa] to-[#eef2f7]">
                {/* Header */}
                <div className="bg-gradient-to-r from-[var(--blue)] to-[#0066cc] w-full px-6 py-8 text-white shadow-lg">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-1 h-8 bg-white rounded-full" />
                            <h1 className="text-3xl font-bold">Chamados de Suporte</h1>
                        </div>
                        <p className="opacity-90 mt-2 text-sm">Problemas técnicos reportados pelos alunos</p>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto p-6 space-y-4">
                    {/* Filtros */}
                    <div className="flex gap-2">
                        {(['open', 'closed', 'all'] as Filter[]).map(f => (
                            <Button
                                key={f}
                                variant={filter === f ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleFilterChange(f)}
                                className={filter === f ? 'bg-[var(--blue)] hover:bg-[#0052a3]' : ''}
                            >
                                {filterLabels[f]}
                            </Button>
                        ))}
                        <span className="ml-auto text-sm text-gray-500 self-center">
                            {issues.length} chamado{issues.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {/* Lista */}
                    {issues.length === 0 && !loading && (
                        <Card className="border-0 shadow-sm">
                            <CardContent className="py-12 text-center text-gray-400">
                                Nenhum chamado encontrado.
                            </CardContent>
                        </Card>
                    )}

                    {issues.map(entry => (
                        <Card
                            key={entry.issue.codIssue}
                            className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => openDialog(entry)}
                        >
                            <CardContent className="pt-4 pb-4">
                                <div className="flex items-start gap-4">
                                    {/* Status icon */}
                                    <div className="shrink-0 mt-0.5">
                                        {entry.issue.checked
                                            ? <CheckCircle2 size={22} className="text-green-500" />
                                            : <Circle size={22} className="text-orange-400" />
                                        }
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-semibold text-gray-800 truncate">{entry.issue.title}</span>
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                                                entry.issue.checked
                                                    ? 'bg-green-100 text-green-700 border-green-200'
                                                    : 'bg-orange-100 text-orange-700 border-orange-200'
                                            }`}>
                                                {entry.issue.checked ? 'Fechado' : 'Aberto'}
                                            </span>
                                            <span className="text-xs text-gray-400 ml-auto">#{entry.issue.codIssue}</span>
                                        </div>

                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{entry.issue.description}</p>

                                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <GraduationCap size={12} />
                                                {entry.student.institutionalEmail} · {entry.student.semester}º sem.
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <CalendarDays size={12} />
                                                {formatDate(entry.issue.sentAt)}
                                            </span>
                                            {(entry.issue.imageUrl1 || entry.issue.imageUrl2) && (
                                                <span className="flex items-center gap-1">
                                                    <ImageIcon size={12} />
                                                    {[entry.issue.imageUrl1, entry.issue.imageUrl2].filter(Boolean).length} imagem(ns)
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>

            {/* Dialog de detalhes */}
            <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    {selected && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 pr-6">
                                    {selected.issue.checked
                                        ? <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                                        : <Circle size={18} className="text-orange-400 shrink-0" />
                                    }
                                    <span>{selected.issue.title}</span>
                                </DialogTitle>
                            </DialogHeader>

                            <div className="space-y-4 text-sm">
                                {/* Dados do aluno */}
                                <Card className="border border-gray-100 shadow-none bg-gray-50">
                                    <CardHeader className="px-4">
                                        <CardTitle className="text-xs uppercase tracking-wide text-gray-400">Aluno</CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-4 pb-3 space-y-1 text-gray-700">
                                        <p className="flex items-center gap-2">
                                            <Mail size={13} className="text-gray-400" />
                                            {selected.student.institutionalEmail}
                                        </p>
                                        {selected.student.personalEmail && (
                                            <p className="flex items-center gap-2">
                                                <Mail size={13} className="text-gray-400" />
                                                {selected.student.personalEmail}
                                            </p>
                                        )}
                                        <p className="flex items-center gap-2">
                                            <Phone size={13} className="text-gray-400" />
                                            {selected.student.cellphone}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <GraduationCap size={13} className="text-gray-400" />
                                            {selected.student.semester}º semestre · ID Senac: {selected.student.idSenac} · Cod: {selected.student.codStudents}
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Descrição */}
                                <div>
                                    <Label className="text-xs uppercase tracking-wide text-gray-400">Descrição</Label>
                                    <p className="mt-1 text-gray-700 whitespace-pre-wrap">{selected.issue.description}</p>
                                </div>

                                <p className="text-xs text-gray-400 flex items-center gap-1">
                                    <CalendarDays size={12} />
                                    Enviado em {formatDate(selected.issue.sentAt)}
                                </p>

                                {/* Imagens */}
                                {(selected.issue.imageUrl1 || selected.issue.imageUrl2) && (
                                    <div>
                                        <Label className="text-xs uppercase tracking-wide text-gray-400">Imagens anexadas</Label>
                                        <div className="flex gap-2 mt-2 flex-wrap">
                                            {[selected.issue.imageUrl1, selected.issue.imageUrl2].filter(Boolean).map((url, i) => (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    onClick={() => openLightbox(url!)}
                                                    className="rounded-lg overflow-hidden border border-gray-200 hover:opacity-80 transition-opacity"
                                                >
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={url!} alt={`Imagem ${i + 1}`} className="w-36 h-24 object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Comentário de resolução existente */}
                                {selected.issue.checked && selected.issue.resolutionComment && (
                                    <div>
                                        <Separator />
                                        <Label className="text-xs uppercase tracking-wide text-gray-400 mt-3 block">Comentário de resolução</Label>
                                        <p className="mt-1 text-gray-700 whitespace-pre-wrap">{selected.issue.resolutionComment}</p>
                                    </div>
                                )}

                                {/* Fechar chamado */}
                                {!selected.issue.checked && (
                                    <>
                                        <Separator />
                                        <div className="space-y-1.5">
                                            <Label htmlFor="resolution">
                                                Comentário de resolução <span className="text-red-500">*</span>
                                            </Label>
                                            <Textarea
                                                id="resolution"
                                                placeholder="Descreva como o problema foi resolvido..."
                                                value={resolutionComment}
                                                onChange={e => setResolutionComment(e.target.value)}
                                                rows={3}
                                                disabled={closing}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={closing}>
                                    Cancelar
                                </Button>
                                {!selected.issue.checked && (
                                    <Button
                                        onClick={handleClose}
                                        disabled={closing}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        {closing ? 'Fechando...' : 'Fechar chamado'}
                                    </Button>
                                )}
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Lightbox simples */}
            {lightbox && (
                <div
                    className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4"
                    onClick={() => closeLightbox()}
                    onKeyDown={e => { if (e.key === 'Escape') closeLightbox(); }}
                    tabIndex={-1}
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus
                >
                    <button
                        type="button"
                        className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-1 hover:bg-black/80"
                        onClick={e => { e.stopPropagation(); closeLightbox(); }}
                    >
                        <X size={20} />
                    </button>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={lightbox}
                        alt="Imagem ampliada"
                        className="max-w-full max-h-full rounded-lg shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
}
