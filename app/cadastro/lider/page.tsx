'use client';

import Swal from 'sweetalert2'
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import "../cadastro.css";
import { postLeaderRegistration } from "@/services/api-register";
import { loginStudent, verifyLogin } from '@/services/api-login';
import { useRouter } from 'next/navigation';
import LoadingOverlay from '@/components/system/loading-overlay';

// Mapeamento de matérias por curso e semestre (sem disciplinas de "Projeto")
const SUBJECTS_BY_COURSE: Record<string, Record<number, string[]>> = {
  comp: {
    // Semestres ímpares
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
    /* Semestres pares
    2: [
      "Administração e Economia",
      "Ciência dos Dados",
      "Design de Software II",
      "Física das Variações",
    ],
    4: [
      "Circuitos Digitais II",
      "Eletricidade Aplicada",
      "Física Elétrica",
      "Métodos Numéricos para Ciência de Dados",
      "Programação Orientada a Objetos",
      "Química e Engenharia de Materiais",
    ],
    6: [
      "Circuitos Elétricos e Laboratórios de Eletricidade",
      "Física Moderna",
      "Laboratório Digital",
      "Organização de Sistema Digitais",
      "Redes e Computação em Nuvem",
      "Termodinâmica Aplicada",
    ],
    8: [
      "Arquitetura de Computadores",
      "Data Science e Big Data em Serviços",
      "Engenharia de Software II",
      "Introdução ao Direito para a Engenharia",
      "Laboratório de Microprocessadores",
      "Sistemas Distribuídos",
      "Sistemas Mecatrônicos Aplicados",
    ],
    10: [
      "Segurança Cibernética e Tecnologia Blockchain",
      "Telecomunicações Aplicadas a Software Defined Radio e Internet of Things",
    ],
    */
  },
  prod: {
    // Semestres ímpares
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
    /* Semestres pares
    2: [
      "Administração e Economia",
      "Ciência dos Dados",
      "Design de Software II",
      "Física das Variações",
    ],
    4: [
      "Eletricidade Aplicada",
      "Física Elétrica",
      "Marketing",
      "Métodos Numéricos para Ciência de Dados",
      "Planejamento e Controle de Produção",
      "Química e Engenharia de Materiais",
    ],
    6: [
      "Arranjos Físicos, Ergonomia e Qualidade de Vida no Trabalho",
      "Física Moderna",
      "Pesquisa Operacional II: modelos estocásticos",
      "Redes de Computação em Nuvem",
      "Sistemas de Informação Gerencial",
      "Termodinâmica Aplicada",
    ],
    8: [
      "Data Science e Big Data em Serviços",
      "Engenharia da Sustentabilidade",
      "Engenharia de Manutenção e Confiabilidade",
      "Gestão de Pessoas",
      "Introdução ao Direito para a Engenharia",
      "Sistemas Mecatrônicos Aplicados",
    ],
    10: [
      "Segurança Cibernética e Tecnologia Blockchain",
      "Simulação de Processos e Serviços",
    ],
    */
  },
};

export default function AreaRestrita() {
  const router = useRouter();
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const data = await verifyLogin();
      if (data?.loggedIn === true) {
        if (data.role === 'Teacher') {
          router.push('/area-restrita/professor');
        } else if (data.role === 'Student') {
          router.push('/area-restrita/aluno');
        } else if (data.role === 'Support') {
          router.push('/area-restrita/apoio');
        } else {
          router.push('/');
        }
      } else {
        setLoading(false);
      }
    })();
  }, [router]);

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState('');
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  const [validations, setValidations] = useState({
    characters: false,
    lettersLow: false,
    lettersCap: false,
    length: false,
    numbers: false,
    match: false,
  })

  useEffect(() => {
    const regexCharacters = /[!@#$%^&*(),.?":{}|<>]/g
    const regexLettersLow = /[a-z]/g
    const regexLettersCap = /[A-Z]/g
    const regexNumbers = /[0-9]/g

    setValidations({
      characters: regexCharacters.test(password),
      lettersLow: regexLettersLow.test(password),
      lettersCap: regexLettersCap.test(password),
      length: password.length >= 8,
      numbers: regexNumbers.test(password),
      match: password === confirmPassword && password.length > 0,
    })
  }, [password, confirmPassword])

  const getIcon = (condition: boolean) => {
    return (
      <img
        src={condition ? "/img/icons/check-psw.png" : "/img/icons/x-psw.png"}
        alt={condition ? "Verificado" : "Não verificado"}
        className="w-4 h-4"
      />
    )
  }

  const sendData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    const formElement = document.getElementById('register-form') as HTMLFormElement;
    const formData = new FormData(formElement);

    const formDataObj = {
      groupName: formData.get('project-name') as string,
      description: formData.get('project-desc') as string,
      idSenac: Number(formData.get('id-senac')),
      fullname: formData.get('username') as string,
      institutionalEmail: formData.get('email-inst') as string,
      personalEmail: formData.get('personal-email') as string,
      cellphone: formData.get('phone') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirm-password') as string,
      semester: Number(formData.get('semester')),
      course: formData.get('course') as string,
      pointMaterial: formData.get('subject') as string
    };

    const requiredFields: (keyof typeof formDataObj)[] = [
      'groupName',
      'description',
      'idSenac',
      'fullname',
      'institutionalEmail',
      'cellphone',
      'password',
      'confirmPassword',
      'semester',
      'course',
      'pointMaterial'
    ];

    const fieldLabels: Record<string, string> = {
      groupName: "Nome do grupo",
      description: "Descrição do projeto",
      idSenac: "ID Senac",
      fullname: "Nome completo",
      institutionalEmail: "E-mail institucional",
      cellphone: "Celular",
      password: "Senha",
      confirmPassword: "Confirmação de senha",
      semester: "Semestre",
      course: "Curso",
      pointMaterial: "Matéria"
    };

    for (const field of requiredFields) {
      const value = formDataObj[field];
      if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '') || (typeof value === 'number' && isNaN(value))) {
        setLoading(false)
        Swal.fire({
          title: 'Preencha todos os campos obrigatórios',
          text: `Por favor, preencha o campo: ${fieldLabels[field] || field}`,
          icon: 'warning',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#003'
        });
        return;
      }
    }

    if (formDataObj.idSenac < 1000000000 || formDataObj.idSenac > 1300000000) {
      setLoading(false);
      Swal.fire({
        title: 'ID do Senac inválido',
        text: 'Insira o seu ID de aluno válido',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#003'
      });
      return;
    }

    if (!formDataObj.institutionalEmail.includes("@senacsp.edu.br")) {
      setLoading(false)
      Swal.fire({
        title: 'Oops!',
        text: 'Verifique o e-mail institucional',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#003'
      });
      return;
    }

    if (
      formDataObj.personalEmail !== "" &&
      (!formDataObj.personalEmail.includes("@") || formDataObj.personalEmail.length < 8)
    ) {
      setLoading(false)
      Swal.fire({
        title: 'Oops!',
        text: 'Verifique o e-mail pessoal',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#003'
      });
      return;
    }

    if (!Object.values(validations).every(Boolean)) {
      let msg = 'A senha não atende aos seguintes critérios:\n';
      if (!validations.characters) msg += 'Pelo menos um caractere especial; ';
      if (!validations.lettersLow) msg += 'Pelo menos uma letra minúscula; ';
      if (!validations.lettersCap) msg += 'Pelo menos uma letra maiúscula; ';
      if (!validations.length) msg += 'Pelo menos 8 caracteres; ';
      if (!validations.numbers) msg += 'Pelo menos um número; ';
      if (!validations.match) msg += 'Senhas devem coincidir; ';

      setLoading(false)
      Swal.fire({
        title: 'Senha inválida',
        text: msg,
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#003'
      });
      return;
    }

    const data = {
      newStudent: {
        idSenac: formDataObj.idSenac,
        fullname: formDataObj.fullname,
        institutionalEmail: formDataObj.institutionalEmail,
        personalEmail: formDataObj.personalEmail,
        cellphone: formDataObj.cellphone,
        password: formDataObj.password,
        semester: formDataObj.semester,
        course: formDataObj.course,
        pointMaterial: formDataObj.pointMaterial
      },
      newProject: {
        groupName: formDataObj.groupName,
        semester: formDataObj.semester,
        description: formDataObj.description
      }
    };

    try {
      const response = await postLeaderRegistration(data);
      setLoading(false)
      
      await Swal.fire({
        title: 'Cadastro realizado com sucesso',
        text: 'Mais informações foram enviadas para o seu e-mail',
        icon: 'success',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#003'
      });

      const dataLogin = {
        email: formDataObj.institutionalEmail,
        password: formDataObj.password
      }

      setLoading(true);
      await loginStudent(dataLogin);
      router.push('/area-restrita/aluno');

    } catch (error: any) {
      setLoading(false)
      Swal.fire({
        title: 'Oops!',
        text: "Erro ao se conectar com o servidor. Por favor, tente novamente mais tarde.",
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#003'
      });
    }
  };

  const semesterNumber = Number(semester);
  const availableSubjects =
    course && semesterNumber
      ? SUBJECTS_BY_COURSE[course]?.[semesterNumber] ?? []
      : [];

  return (
    <div>
      <LoadingOverlay active={loading} />
      <div className="h-screen bg-gradient-to-br from-[#f5f7fa] to-[#eef2f7] flex items-center justify-center px-4 py-6 overflow-hidden">
        <section className="w-full mx-auto max-w-6xl max-h-[calc(100vh-3rem)] flex">
          <div className="grid lg:grid-cols-3 gap-0 rounded-2xl shadow-2xl w-full max-h-[calc(100vh-3rem)]">
            {/* Left Side - Image (Desktop Only) */}
            <div className="hidden lg:flex col-span-1 relative bg-gradient-to-br from-[#0066cc] to-[#0052a3] rounded-l-2xl items-center justify-center">
              <Image 
                unoptimized
                src="/img/pictures/structure.jpg"
                alt="Engenharias Senac"
                fill
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/50 flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">Crie seu Projeto</h3>
                  <p className="text-blue-100 text-sm">Seja o líder de um projeto inovador na Semana das Engenharias</p>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="bg-white lg:col-span-2 lg:rounded-r-2xl rounded-2xl p-6 sm:p-8 flex flex-col min-h-0 max-h-full overflow-hidden">
              <div className="mb-4 flex justify-center lg:hidden shrink-0">
                <Image 
                  unoptimized
                  src="/img/branding/logo-blue.png"
                  alt="Logo Senac"
                  width={160}
                  height={0}
                />
              </div>
              <div className="hidden lg:flex mb-6 shrink-0">
                <Image 
                  unoptimized
                  src="/img/branding/logo-blue.png"
                  alt="Logo Senac"
                  width={140}
                  height={0}
                />
              </div>
              <h2 className="text-black text-2xl sm:text-3xl font-bold mb-1 shrink-0">Cadastro de <span className="text-[#0066cc]">Líder</span></h2>
              <p className="text-gray-600 text-sm mb-6 shrink-0">Preencha os dados abaixo para criar seu projeto</p>

              <form className="space-y-4 lg:space-y-5 text-sm overflow-y-auto flex-1 p-1" id="register-form" onSubmit={sendData}>
                {/* Info Box para Informações do Projeto */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-[#0066cc] rounded-lg p-4 mb-6">
                  <h3 className="text-sm font-semibold text-[#0066cc] mb-2">📸 Imagem do Seu Projeto</h3>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    O <strong>nome do grupo</strong> e a <strong>descrição do projeto</strong> que você informar aqui serão utilizados como a apresentação visual do seu projeto. Escolha nomes descritivos e descrições claras e profissionais que melhor representem sua equipe e sua proposta inovadora.
                  </p>
                </div>
              <div>
                <label htmlFor="input-project-name" className="block text-sm font-semibold text-gray-700 mb-2">Nome do grupo/projeto</label>
                <input
                  required
                  type="text"
                  id="input-project-name"
                  name="project-name"
                  placeholder="Ex: InnovateTech Solutions"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="input-project-desc" className="block text-sm font-semibold text-gray-700 mb-2">Descrição do projeto</label>
                <textarea
                  id="input-project-desc"
                  name="project-desc"
                  placeholder="Descreva brevemente o objetivo e escopo do seu projeto..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent transition-all resize-none"
                />
              </div>

              <div className="pt-2 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 mt-4">Dados do Líder</h3>
                
                <div>
                  <label htmlFor="input-username" className="block text-sm font-semibold text-gray-700 mb-2">Nome completo</label>
                  <input
                    required
                    type="text"
                    id="input-username"
                    name="username"
                    placeholder="Ex: Maria Silva"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent transition-all"
                  />
                </div>

                <div className="mt-4">
                  <label htmlFor="input-id-senac" className="block text-sm font-semibold text-gray-700 mb-2">ID do Senac <span className="text-xs cursor-help" title="Acesse sua área exclusiva Senac > Na aba 'Serviços ao Aluno' selecione 'Nota/menção, frequência e financeiro' > 'Notas/Menções e Atividades' > O ID do Senac aparecerá no topo na página">ℹ️</span></label>
                  <input
                    required
                    type="number"
                    id="input-id-senac"
                    name="id-senac"
                    placeholder="Ex: 0123456789"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>

                <div className="mt-4">
                  <label htmlFor="input-email-inst" className="block text-sm font-semibold text-gray-700 mb-2">E-mail institucional</label>
                  <input
                    required
                    type="email"
                    id="input-email-inst"
                    name="email-inst"
                    placeholder="Ex: maria@senacsp.edu.br"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent transition-all"
                  />
                </div>

                <div className="mt-4">
                  <label htmlFor="input-personal-email" className="block text-sm font-semibold text-gray-700 mb-2">E-mail pessoal (opcional)</label>
                  <input
                    type="email"
                    id="input-personal-email"
                    name="personal-email"
                    placeholder="Ex: maria@gmail.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent transition-all"
                  />
                </div>

                <div className="mt-4">
                  <label htmlFor="input-phone" className="block text-sm font-semibold text-gray-700 mb-2">Celular</label>
                  <input
                    required
                    type="tel"
                    id="input-phone"
                    name="phone"
                    placeholder="Ex: (11) 91234-5678"
                    value={phone}
                    onInput={(e) => {
                      let value = e.currentTarget.value.replace(/\D/g, '');
                      if (value.length > 11) value = value.slice(0, 11);
                      if (value.length > 6) {
                        value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
                      } else if (value.length > 2) {
                        value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
                      } else {
                        value = value.replace(/^(\d{0,2})/, '($1');
                      }
                      setPhone(value);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent transition-all"
                  />
                </div>

                <div className="mt-4">
                  <label htmlFor="input-course" className="block text-sm font-semibold text-gray-700 mb-2">Curso</label>
                  <select
                    id="input-course"
                    name="course"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent transition-all"
                    value={course}
                    onChange={(e) => {
                      setCourse(e.target.value);
                      setSubject('');
                    }}
                  >
                    <option value="">Selecione seu curso</option>
                    <option value="comp">Engenharia da Computação</option>
                    <option value="prod">Engenharia de Produção</option>
                  </select>
                </div>

                <div className="mt-4">
                  <label htmlFor="input-semester" className="block text-sm font-semibold text-gray-700 mb-2">Semestre</label>
                  <select
                    id="input-semester"
                    name="semester"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent transition-all"
                    value={semester}
                    onChange={(e) => {
                      setSemester(e.target.value);
                      setSubject('');
                    }}
                  >
                    <option value="">Selecione seu semestre</option>
                    {Array.from({ length: 5 }, (_, i) => {
                      const value = i * 2 + 1
                      return (
                        <option key={value} value={value}>
                          {`${value}º semestre`}
                        </option>
                      )
                    })}
                  </select>
                </div>

                <div className="mt-4">
                  <label htmlFor="input-subject" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    Matéria para designar ponto
                    <span className="text-xs cursor-help" title="Os pontos extras obtidos durante a Semana das Engenharias (palestras, gamificações, etc) serão alocados nesta matéria.">ℹ️</span>
                  </label>
                  <select
                    required
                    id="input-subject"
                    name="subject"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent transition-all disabled:bg-gray-100 disabled:text-gray-500"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={!course || !semester || availableSubjects.length === 0}
                  >
                    <option value="">
                      {(!course || !semester)
                        ? "Selecione primeiro o curso e o semestre"
                        : availableSubjects.length === 0
                          ? "Nenhuma matéria disponível para esta combinação"
                          : "Selecione a matéria"}
                    </option>
                    {availableSubjects.map((subj) => (
                      <option key={subj} value={subj}>
                        {subj}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Segurança da Conta</h3>

                  <div>
                    <label htmlFor="input-password" className="block text-sm font-semibold text-gray-700 mb-2">Senha</label>
                    <input
                      required
                      type="password"
                      id="input-password"
                      name="password"
                      placeholder="Ex: Senac@123"
                      onInput={(e) => setPassword(e.currentTarget.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="mt-4">
                    <label htmlFor="input-confirm-password" className="block text-sm font-semibold text-gray-700 mb-2">Confirmar senha</label>
                    <input
                      required
                      type="password"
                      id="input-confirm-password"
                      name="confirm-password"
                      placeholder="Repita a senha"
                      onInput={(e) => setConfirmPassword(e.currentTarget.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <div className="text-xs font-semibold text-gray-700 mb-3">Crie sua senha utilizando:</div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-xs text-gray-700">{getIcon(validations.characters)} <span>Caracteres especiais</span></div>
                      <div className="flex items-center gap-2 text-xs text-gray-700">{getIcon(validations.lettersLow)} <span>Letras minúsculas</span></div>
                      <div className="flex items-center gap-2 text-xs text-gray-700">{getIcon(validations.lettersCap)} <span>Letras maiúsculas</span></div>
                      <div className="flex items-center gap-2 text-xs text-gray-700">{getIcon(validations.length)} <span>Mínimo 8 caracteres</span></div>
                      <div className="flex items-center gap-2 text-xs text-gray-700">{getIcon(validations.numbers)} <span>Números</span></div>
                      <div className="flex items-center gap-2 text-xs text-gray-700">{getIcon(validations.match)} <span>As senhas conferem</span></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#0066cc] to-[#0052a3] hover:from-[#0052a3] hover:to-[#003d7a] text-white font-semibold py-3 rounded-lg transition-all duration-300 cursor-pointer active:brightness-90"
                >
                  Criar Projeto
                </button>
                <Link
                  href="/login/aluno"
                  className="flex-1 border-2 border-[#0066cc] text-[#0066cc] font-semibold py-3 rounded-lg hover:bg-blue-50 transition-all duration-300 text-center cursor-pointer active:brightness-90"
                >
                  Voltar
                </Link>
              </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
