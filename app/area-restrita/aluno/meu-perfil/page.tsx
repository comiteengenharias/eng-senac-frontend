'use client';

const SUBJECTS_BY_COURSE: Record<string, Record<number, string[]>> = {
  comp: {
    1: [
      "Contabilidade de Custos e Sustentabilidade",
      "Design de Software I",
      "Design para Manufatura",
      "Eletroeletrônica",
    ],
    3: [
      "Cálculo Numérico Aplicado",
      "Circuitos Digitais I",
      "Física Aplicada - práticas de extensão",
      "Logística e Gestão da Cadeia de Suprimentos",
      "Tecnologia de Processos Industriais e de Serviços",
    ],
    5: [
      "Banco de Dados",
      "Estruturação de Dados",
      "Fenômenos de Transporte",
      "Oscilações e Ondas",
    ],
    7: [
      "Design de Aplicativos",
      "Eletrônica e Laboratório de Eletrônica",
      "Engenharia de Software I",
      "Ondas e Eletromagnetismo",
      "Sistemas Operacionais",
      "Sistemas, Sinais e Engenharia de Controle",
    ],
    9: [
      "Energia",
      "Inteligência Artificial e Aprendizado de Máquinas",
      "Laboratório de Redes",
      "Linguagens Formais e Compiladores",
      "Programação Mobile Avançado",
    ],
  },
  prod: {
    1: [
      "Contabilidade de Custos e Sustentabilidade",
      "Design de Software I",
      "Design para Manufatura",
      "Eletroeletrônica",
    ],
    3: [
      "Cálculo Numérico Aplicado",
      "Física Aplicada - práticas de extensão",
      "Gerenciamento de Conflitos",
      "Logística e Gestão da Cadeia de Suprimentos",
      "Tecnologia de Processos Industriais e de Serviços",
    ],
    5: [
      "Banco de Dados",
      "Fenômenos de Transporte",
      "Oscilações e Ondas",
      "Pesquisa Operacional I: modelos determinísticos",
    ],
    7: [
      "Engenharia Econômica",
      "Gestão da Inovação",
      "Gestão da Qualidade, Produtividade e Sustentabilidade",
      "Gestão de Processos de Negócios",
      "Gestão de Riscos",
      "Projeto de Produtos e Serviços",
      "Simulação de Sistemas de Produção",
    ],
    9: [
      "Energia",
      "Engenharia de Serviço Aplicado à Saúde",
      "Inteligência Artificial e Aprendizado de Máquinas",
      "Internet das Coisas em Serviços",
      "Simulação de Robótica e Automação em Serviços",
    ],
  },
};

const POINT_MATERIAL_DEADLINE = new Date('2026-06-13T23:59:00-03:00');

import Sidebar from "@/components/system/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Swal from 'sweetalert2';
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { verifyLogin } from "@/services/api-login";
import { getStudentInfo, postChangePassword, patchPointMaterial } from "@/services/api-student";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LoadingOverlay from "@/components/system/loading-overlay";

export default function AreaRestrita_Aluno() {
    const router = useRouter();
	const [loading, setLoading] = useState(true)

    useEffect(() => {
        (async () => {
            const data = await verifyLogin();
            if (!data || data.role !== 'Student') {
                router.push('/login/aluno');
            }
        })();
    }, []);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validations, setValidations] = useState({
        characters: false,
        lettersLow: false,
        lettersCap: false,
        length: false,
        numbers: false,
        match: false,
    });

    useEffect(() => {
        const regexCharacters = /[!@#$%^&*(),.?":{}|<>]/g;
        const regexLettersLow = /[a-z]/g;
        const regexLettersCap = /[A-Z]/g;
        const regexNumbers = /[0-9]/g;

        setValidations({
            characters: regexCharacters.test(newPassword),
            lettersLow: regexLettersLow.test(newPassword),
            lettersCap: regexLettersCap.test(newPassword),
            length: newPassword.length >= 8,
            numbers: regexNumbers.test(newPassword),
            match: newPassword === confirmPassword && newPassword.length > 0,
        });
    }, [newPassword, confirmPassword]);

    const getIcon = (condition: boolean) => (
        <img
            src={condition ? "/img/icons/check-psw.png" : "/img/icons/x-psw.png"}
            alt={condition ? "Verificado" : "Não verificado"}
            className="w-4 h-4"
        />
    );

    const handleChangePassword = async () => {
        if (!Object.values(validations).every(Boolean)) {
            let msg = 'A nova senha não atende aos seguintes critérios:\n';
            if (!validations.characters) msg += 'Pelo menos um caractere especial; ';
            if (!validations.lettersLow) msg += 'Pelo menos uma letra minúscula; ';
            if (!validations.lettersCap) msg += 'Pelo menos uma letra maiúscula; ';
            if (!validations.length) msg += 'Pelo menos 8 caracteres; ';
            if (!validations.numbers) msg += 'Pelo menos um número; ';
            if (!validations.match) msg += 'Senhas devem coincidir; ';

            Swal.fire({
                title: 'Senha inválida',
                text: msg,
                icon: 'warning',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#003'
            });
            return;
        }

        try {
            const data = {
                currentPsw: currentPassword,
                newPsw: newPassword,
            };

            await postChangePassword(data);

            Swal.fire({
                title: 'Sucesso!',
                text: 'Senha alterada com sucesso.',
                icon: 'success',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#003'
            });

            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                'Ocorreu um erro desconhecido.';

            Swal.fire({
                title: 'Erro',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#003'
            });
        }

    };

    interface StudentInfo {
        Cellphone?: string;
        cellphone?: string;
        CodStudents?: number;
        codStudents?: number;
        Course?: "comp" | "prod";
        course?: "comp" | "prod";
        Fullname?: string;
        fullname?: string;
        IdSenac?: number;
        idSenac?: number;
        InstitutionalEmail?: string;
        institutionalEmail?: string;
        PersonalEmail?: string;
        personalEmail?: string;
        PointMaterial?: string;
        pointMaterial?: string;
        ProjectTeam?: number;
        projectTeam?: number;
        Semester?: number;
        semester?: number;
        password?: string;
        extraNote?: number;
        extraNoteReason?: string;
    }

    const [getInfo, setGetInfo] = useState<StudentInfo | null>(null);
    const [course, setCourse] = useState<string | null>(null);
    const [selectedMaterial, setSelectedMaterial] = useState<string>('');
    const canChangePointMaterial = new Date() <= POINT_MATERIAL_DEADLINE;

    useEffect(() => {
        (async () => {
            try {
                const response = await getStudentInfo();
                // A API retorna com a estrutura { student: {...}, extraNote, extraNoteReason }
                const studentData = response.student ?? response;
                const fullData = {
                    ...studentData,
                    extraNote: response.extraNote,
                    extraNoteReason: response.extraNoteReason
                };
                setGetInfo(fullData);
                setSelectedMaterial(studentData.PointMaterial ?? studentData.pointMaterial ?? '');

                const courseValue = studentData.Course ?? studentData.course;
                const courseName =
                    courseValue === "comp"
                        ? "Engenharia de Computação"
                        : "Engenharia de Produção";
                setCourse(courseName);
            } catch (error) {
                console.error('Erro ao carregar dados do aluno:', error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const courseKey = getInfo?.Course ?? getInfo?.course ?? '';
    const semesterKey = getInfo?.Semester ?? getInfo?.semester ?? 0;
    const subjectOptions = SUBJECTS_BY_COURSE[courseKey]?.[semesterKey] ?? [];

    const handleChangePointMaterial = async () => {
        if (!selectedMaterial) {
            Swal.fire({
                title: 'Selecione uma matéria',
                text: 'Por favor, selecione uma matéria para ponto extra.',
                icon: 'warning',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#003'
            });
            return;
        }

        try {
            await patchPointMaterial(selectedMaterial);
            setGetInfo((prev) => prev ? { ...prev, PointMaterial: selectedMaterial, pointMaterial: selectedMaterial } : prev);
            Swal.fire({
                title: 'Sucesso!',
                text: 'Matéria para ponto extra alterada com sucesso.',
                icon: 'success',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#003'
            });
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                'Ocorreu um erro desconhecido.';
            Swal.fire({
                title: 'Erro',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#003'
            });
        }
    };

    const info = [
        { name: "ID senac", id: "idSenac", value: getInfo?.IdSenac ?? getInfo?.idSenac ?? "Carregando..." },
        { name: "Nome completo", id: "fullname", value: getInfo?.Fullname ?? getInfo?.fullname ?? "Carregando..." },
        { name: "E-mail institucional", id: "institutionalEmail", value: getInfo?.InstitutionalEmail ?? getInfo?.institutionalEmail ?? "Carregando..." },
        { name: "E-mail pessoal", id: "personalEmail", value: getInfo?.PersonalEmail ?? getInfo?.personalEmail ?? "Carregando..." },
        { name: "Whatsapp", id: "whatsapp", value: getInfo?.Cellphone ?? getInfo?.cellphone ?? "Carregando..." },
        { name: "Semestre", id: "semester", value: getInfo?.Semester ?? getInfo?.semester ?? "Carregando..." },
        { name: "Curso", id: "course", value: course ?? "Carregando..." },
        { name: "Matéria para ponto extra", id: "pointMaterial", value: getInfo?.PointMaterial ?? getInfo?.pointMaterial ?? "Carregando..." }
    ];

    return (
        <div>
            <LoadingOverlay active={loading} />
            <Sidebar pageId="meu-perfil" type="student" />
            <main className="sm:ml-[250px] mt-16 min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#f5f7fa] to-[#eef2f7]">
                <div className="bg-gradient-to-r from-[var(--blue)] to-[#0066cc] w-full px-6 py-8 text-[var(--white)] shadow-lg">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-1 h-8 bg-white rounded-full"></div>
                            <h1 className="text-3xl font-bold">Meu Perfil</h1>
                        </div>
                        <p className="opacity-90 mt-2 text-sm">Gerencie seus dados pessoais e altere sua senha</p>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto p-6 space-y-4 flex flex-col">
                    {/* Section Ponto Extra */}
                    <div className={`p-6 rounded-lg shadow-md border-l-4 flex items-center justify-between ${
                      (getInfo?.extraNote ?? 0) > 0 
                        ? 'bg-green-50 border-l-green-500' 
                        : 'bg-red-50 border-l-red-500'
                    }`}>
                      <div>
                        <p className={`text-sm font-medium mb-1 ${
                          (getInfo?.extraNote ?? 0) > 0 
                            ? 'text-green-700' 
                            : 'text-red-700'
                        }`}>
                          {(getInfo?.extraNote ?? 0) > 0 
                            ? `✓ Você está apto a receber ${getInfo?.extraNote} ponto extra em ${getInfo?.PointMaterial ?? getInfo?.pointMaterial}`
                            : new Date() < new Date('2026-06-14') 
                              ? 'Você ainda não está apto a receber ponto extra'
                              : 'Você não está apto a receber ponto extra'
                          }
                        </p>
                        <p className={`text-xs font-medium ${
                          (getInfo?.extraNote ?? 0) > 0 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {'Motivo: ' + (getInfo?.extraNoteReason || 'Motivo não informado')}
                        </p>
                      </div>
                    </div>

                    <Card className="shadow-md border-0">
                        <CardHeader className="border-b-2 border-gray-200">
                            <CardTitle className="text-lg text-gray-800 select-none font-semibold">
                                📋 Dados Pessoais
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-8 mb-8">
                                {info.map((reg, index) => (
                                    <div key={index}>
                                        <Label htmlFor={reg.id} className="mb-2 opacity-70">{reg.name}</Label>
                                        <Input id={reg.id} type="text" value={`${reg.value}`} disabled />
                                    </div>
                                ))}
                            </form>
                        </CardContent>
                    </Card>

                    {canChangePointMaterial && (
                        <Card className="shadow-md border-0">
                            <CardHeader className="border-b-2 border-gray-200">
                                <CardTitle className="text-lg text-gray-800 select-none font-semibold">
                                    📚 Alterar Matéria para Ponto Extra
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-4 py-3 mb-6">
                                    ⚠️ A alteração da matéria para ponto extra pode ser feita até <strong>13/06/2026 às 23h59</strong>. Após essa data, não será mais possível alterar.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 mb-6">
                                    <div>
                                        <Label className="mb-2 opacity-70">Matéria para ponto extra</Label>
                                        {subjectOptions.length > 0 ? (
                                            <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione uma matéria" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {subjectOptions.map((subject) => (
                                                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <p className="text-sm text-gray-500 mt-1">Nenhuma opção disponível para seu curso/semestre.</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        className="bg-[var(--blue)] hover:bg-[var(--blue)] cursor-pointer transition-all duration-200 active:brightness-90"
                                        onClick={handleChangePointMaterial}
                                        disabled={subjectOptions.length === 0}
                                    >
                                        Salvar matéria
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="shadow-md border-0">
                        <CardHeader className="border-b-2 border-gray-200">
                            <CardTitle className="text-lg text-gray-800 select-none font-semibold">
                                🔒 Alterar Senha
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-8 mb-8">
                                <div>
                                    <Label htmlFor='currentPsw' className="mb-2 opacity-70">Senha atual</Label>
                                    <Input
                                        id='currentPsw'
                                        type="password"
                                        placeholder="Insira sua senha atual"
                                        value={currentPassword ?? ""}
                                        onInput={(e) => setCurrentPassword(e.currentTarget.value)}
                                    />
                                </div>
                                <div></div>
                                <div>
                                    <Label htmlFor='newPsw' className="mb-2 opacity-70">Nova senha</Label>
                                    <Input
                                        id='newPsw'
                                        type="password"
                                        placeholder="Crie uma nova senha"
                                        value={newPassword ?? ""}
                                        onInput={(e) => setNewPassword(e.currentTarget.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor='confirmPsw' className="mb-2 opacity-70">Confirmar nova senha</Label>
                                    <Input
                                        id='confirmPsw'
                                        type="password"
                                        placeholder="Confirme sua nova senha"
                                        value={confirmPassword ?? ""}
                                        onInput={(e) => setConfirmPassword(e.currentTarget.value)}
                                    />
                                </div>
                            </form>

                            <div className="text-xs text-black opacity-70 mt-6">
                                <div className="mb-4">A nova senha deve conter:</div>
                                <div className="grid sm:grid-cols-2 gap-3 max-w-md">
                                    <div className="flex items-center gap-2">{getIcon(validations.characters)} <span>Caracteres especiais</span></div>
                                    <div className="flex items-center gap-2">{getIcon(validations.lettersLow)} <span>Letras minúsculas</span></div>
                                    <div className="flex items-center gap-2">{getIcon(validations.lettersCap)} <span>Letras maiúsculas</span></div>
                                    <div className="flex items-center gap-2">{getIcon(validations.length)} <span>Mínimo 8 caracteres</span></div>
                                    <div className="flex items-center gap-2">{getIcon(validations.numbers)} <span>Números</span></div>
                                    <div className="flex items-center gap-2">{getIcon(validations.match)} <span>As senhas conferem</span></div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-6">
                                <Button
                                    type="button"
                                    className="bg-[var(--blue)] hover:bg-[var(--blue)] cursor-pointer transition-all duration-200 active:brightness-90"
                                    onClick={handleChangePassword}
                                >
                                    Alterar senha
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
