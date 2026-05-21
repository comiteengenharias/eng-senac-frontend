"use client";

// Importações necessárias:
// - React hooks para gerenciar estado (useState, useEffect) e referências (useRef)
// - Image do Next.js para otimização de imagens
// - Swal para exibir alertas customizados
// - Ícones do Lucide React para a interface visual
// - Yup para validação de formulários
import React, { useState } from 'react';
import Image from 'next/image';
import Swal from 'sweetalert2';
import * as yup from 'yup';

import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  PlusCircle, 
  User, 
  Scale, 
  Wrench
} from 'lucide-react';

import GarrinhaIcon from '../../../components/GarrinhaIcon';

// Define os tipos de perfil de usuário no sistema (Admin, Juiz, Técnico)
type UserProfile = 'ADMIN' | 'JUIZ' | 'TECNICO';

// Define as diferentes telas que o componente pode exibir (Login, Registro, Recuperar Senha)
type CurrentScreen = 'LOGIN' | 'REGISTER' | 'RECUPERAR_SENHA';

// Schemas de validação com Yup
const loginSchema = yup.object().shape({
  email: yup.string().email('E-mail inválido').required('E-mail obrigatório'),
  password: yup.string().required('Senha obrigatória'),
});

// ...outros schemas não relacionados a recuperação de senha...

const registerSchema = yup.object().shape({
  fullName: yup.string().required('Nome obrigatório'),
  cpf: yup.string().min(11, 'CPF inválido').required('CPF obrigatório'),
  email: yup.string().email('E-mail inválido').required('E-mail obrigatório'),
  password: yup.string().min(8, 'Mínimo 8 caracteres').required('Senha obrigatória'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'As senhas não coincidem').required('Confirmação obrigatória'),
  authCode: yup.string().when('profile', {
    is: (profile: UserProfile) => profile === 'ADMIN' || profile === 'JUIZ',
    then: (schema) => schema.required('Código de autorização obrigatório'),
    otherwise: (schema) => schema.optional(),
  }),
  institution: yup.string().when('profile', {
    is: 'TECNICO',
    then: (schema) => schema.required('Instituição obrigatória'),
    otherwise: (schema) => schema.optional(),
  }),
});

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';

export default function PortalRobotica() {
  // ========== ESTADOS DE NAVEGAÇÃO ==========
  // Controla qual tela está sendo exibida (LOGIN, REGISTRO, RECUPERAÇÃO, etc)
  const [screen, setScreen] = useState<CurrentScreen>('LOGIN');
  
  // Armazena qual perfil o usuário selecionou (ADMIN, JUIZ ou TECNICO)
  const [selectedProfile, setSelectedProfile] = useState<UserProfile>('ADMIN');
  
  // Indica se está processando uma requisição (para desabilitar botões durante o carregamento)
  const [loading, setLoading] = useState(false);

  // ========== ESTADOS DE VISIBILIDADE DE SENHA ==========
  // Controla se a senha está visível ou mascarada na tela de login
  const [showPassword, setShowPassword] = useState(false);
  
  // Controla se a confirmação de senha está visível na tela de redefinição
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ========== ESTADOS DO LOGIN ==========
  // Armazena o email digitado no formulário de login
  const [loginEmail, setLoginEmail] = useState('');
  
  // Armazena a senha digitada no formulário de login
  const [loginPassword, setLoginPassword] = useState('');
  
  // Indica se o usuário quer manter a sessão ativa neste dispositivo
  const [keepSession, setKeepSession] = useState(false);
  
  // Armazena mensagens de erro do login para exibir ao usuário
  const [loginError, setLoginError] = useState('');

  // ...outros estados não relacionados a recuperação de senha...

  // ========== ESTADOS DO CADASTRO ==========
  // Nome completo digitado no formulário de cadastro
  const [regFullName, setRegFullName] = useState('');
  
  // CPF digitado no cadastro
  const [regCpf, setRegCpf] = useState('');
  
  // Email digitado no cadastro
  const [regEmail, setRegEmail] = useState('');
  
  // Código de autorização (apenas para ADMIN e JUIZ)
  const [regAuthCode, setRegAuthCode] = useState('');
  
  // Instituição de ensino (apenas para TECNICO)
  const [regInstitution, setRegInstitution] = useState('');
  
  // Senha digitada no cadastro
  const [regPassword, setRegPassword] = useState('');
  
  // Confirmação de senha no cadastro
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Estado para mostrar erro de campo obrigatório no nome do juiz
  const [regJuizNomeTocado, setRegJuizNomeTocado] = useState(false);



  // Valida se o email tem o formato correto usando expressão regular
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  // Função chamada ao enviar o formulário de login
  // Valida email e senha usando Yup e envia para a API de robótica
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      await loginSchema.validate({ email: loginEmail, password: loginPassword });
      setLoading(true);

      const response = await fetch(`${apiBaseUrl}/api/robotica/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
        credentials: 'include',
      });

      setLoading(false);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Falha ao autenticar.');
      }

      const data = await response.json();
      Swal.fire({
        title: 'Login bem-sucedido!',
        text: `Bem-vindo, ${selectedProfile}.`,
        icon: 'success',
        confirmButtonColor: '#004B93',
        timer: 2000,
        showConfirmButton: false,
      });

      // Aqui você pode redirecionar para a área restrita ou salvar o token
      // window.location.href = '/area-restrita';
      console.log('Login response:', data);
    } catch (error: any) {
      setLoading(false);
      setLoginError(error.message || 'Erro no login.');
    }
  };

  // Função duplicada removida. Utilize apenas a definição mais recente de handleRegister.



  // ========== HANDLER: CADASTRO ==========
  // Valida todos os campos do formulário de cadastro usando Yup e envia para a API de robótica
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      fullName: regFullName,
      cpf: regCpf,
      email: regEmail,
      password: regPassword,
      confirmPassword: regConfirmPassword,
      authCode: regAuthCode,
      institution: regInstitution,
      profile: selectedProfile,
    };

    try {
      registerSchema.validateSync(data);
      setLoading(true);

      const body: any = {
        email: regEmail,
        password: regPassword,
        name: regFullName,
        cpf: regCpf,
        typeUser: selectedProfile,
      };

      const response = await fetch(`${apiBaseUrl}/api/robotica/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        credentials: 'include',
      });

      setLoading(false);

      if (!response.ok) {
        const errorText = await response.text().catch(() => null);
        let message = 'Falha ao cadastrar.';

        try {
          const errorData = errorText ? JSON.parse(errorText) : null;
          message = errorData?.message || errorData?.detail || message;
        } catch {
          message = errorText || message;
        }

        throw new Error(message);
      }

      const responseData = await response.json();
      Swal.fire({
        title: 'Cadastro Realizado!',
        text: 'Seu usuário foi criado com sucesso.',
        icon: 'success',
        confirmButtonColor: '#004B93'
      }).then(() => {
        setScreen('LOGIN');
      });

      console.log('Register response:', responseData);
    } catch (error: any) {
      setLoading(false);
      Swal.fire({ icon: 'error', title: 'Erro', text: error.message || 'Erro ao cadastrar.', confirmButtonColor: '#004B93' });
    }
  };

  // ========== FUNÇÃO AUXILIAR: LIMPAR FORMULÁRIOS ==========
  // Reseta mensagens de erro e estados de visibilidade de senha
  const resetForms = () => {
    setLoginError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };


  // ========== RENDERIZAÇÃO (JSX) ==========
  return (
    // Container principal: flex com 2 colunas (sidebar esquerda + conteúdo direita)
    <div className="flex min-h-screen bg-white text-[#34495E] font-sans antialiased">
      
      {/* Importa fonts customizadas do Google Fonts (Space Grotesk e Inter) */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;600;700;700&display=swap');
        .font-headline { font-family: 'Space Grotesk', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* ========== SIDEBAR ESQUERDA (OCULTA EM MOBILE) ========== */}
      {/* Exibe apenas em telas grandes (lg). Tem background azul escuro com gradient */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#004B93] relative overflow-hidden flex-col justify-between p-12">
        
        {/* Imagem de background com overlay */}
        <div className="absolute inset-0 z-0 bg-cover bg-center opacity-60"
             style={{ backgroundImage: 'url(/img/pictures/robot.png)' }} />
             
        
        {/* Gradiente overlay sobre a imagem para melhorar legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#004B93]/75 via-[#004B93]/80 to-[#001f3f]/85 z-10" />

        {/* Conteúdo textual da sidebar (em cima dos overlays) */}
        <div className="relative z-20 max-w-lg">
          {/* Badge "ROBOTIC_SYNC" com símbolo de garra robótica */}
          <div className="mb-8 flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#F7941D] text-white shadow-lg">
              <GarrinhaIcon className="w-8 h-8" />
            </span>
            <span className="text-lg font-headline font-bold uppercase tracking-tight text-white ml-2">
              ROBOTIC_SYNC
            </span>
          </div>

          {/* Título principal "Torneio de Robótica" */}
          <h1 className="text-5xl lg:text-6xl font-headline font-bold text-white mb-4 leading-tight tracking-tight">
            Torneio de<br />Robótica
          </h1>

          {/* Subtítulo "Portal de Acesso" */}
          <h2 className="text-2xl lg:text-3xl font-body font-light text-white/90 mb-6">
            Portal de Acesso
          </h2>

          {/* Descrição do portal */}
          <p className="text-blue-100/80 font-body text-base leading-relaxed pr-6">
            Onde a precisão da engenharia encontra a inovação sustentável. Acesse o portal oficial para gerenciar equipes, matches e avaliações técnicas.
          </p>
        </div>

        {/* Logo do Senac no rodapé da sidebar */}
        <div className="relative z-20">
          <Image src="/img/icons/senac.png" alt="Logo Senac" width={140} height={45} className="object-contain" priority />
        </div>
      </div>

      {/* ========== ÁREA DINÂMICA DIREITA ========== */}
      {/* Ocupa 100% em mobile e 50% em telas grandes */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md font-body">
          {/* ========== ÁREA DE RECUPERAR SENHA (VISUAL) ========== */}
          {screen === 'RECUPERAR_SENHA' && (
            <div className="animate-fadeIn transition-all duration-300">
              <button 
                onClick={() => setScreen('LOGIN')} 
                className="flex items-center gap-1 text-xs font-bold text-[#004B93] hover:underline mb-4"
              >
                Voltar para o Login
              </button>
              <h3 className="text-2xl font-headline font-bold text-[#34495E] mb-1">Recuperar Senha</h3>
              <p className="text-sm text-[#34495E]/70 font-body mb-6">Insira seu e-mail cadastrado para receber as instruções de redefinição.</p>
              <form className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#34495E] mb-1">E-mail</label>
                  <input
                    type="email"
                    placeholder="exemplo@hotel.com.br"
                    className="w-full px-3 py-2.5 bg-[#F4F7FA] border border-transparent rounded-lg text-sm focus:outline-none transition-all focus:border-[#004B93]"
                  />
                </div>
                <button
                  type="button"
                  className="w-full bg-[#004B93] hover:bg-[#003970] text-white font-headline font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md mt-6"
                  disabled
                >
                  ENVIAR INSTRUÇÕES
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}


          {/* ========== TELA 1: LOGIN ========== */}
          {screen === 'LOGIN' && (
            <div className="animate-fadeIn transition-all duration-300">
              
              {/* Títulos e descrição */}
              <div className="mb-6">
                <h3 className="text-3xl font-headline font-bold text-[#34495E] mb-1">Bem-vindo ao Portal</h3>
                <p className="text-sm text-[#34495E]/70 font-body">Selecione seu perfil para continuar a jornada técnica.</p>
              </div>

              {/* Seletores de Perfil (ADMIN, JUIZ, TECNICO) */}
              {/* Grid com 3 colunas. Muda estilo do botão conforme selecionado */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {(['ADMIN', 'JUIZ', 'TECNICO'] as UserProfile[]).map((prof) => (
                  <button
                    key={prof}
                    type="button"
                    onClick={() => { setSelectedProfile(prof); setLoginError(''); }}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                      selectedProfile === prof 
                        ? 'bg-white border-[#004B93] shadow-md ring-1 ring-[#004B93]' 
                        : 'bg-[#F8FAFC] border-gray-200 hover:border-gray-300 opacity-70'
                    }`}
                  >
                    {/* Ícone do perfil, mais parecido com o visual da imagem */}
                    <span className="text-xl mb-1 text-[#004B93]">
                      {prof === 'ADMIN' && <User className="w-5 h-5" />}
                      {prof === 'JUIZ' && <Scale className="w-5 h-5" />}
                      {prof === 'TECNICO' && <Wrench className="w-5 h-5" />}
                    </span>
                    {/* Rótulo do perfil */}
                    <span className={`text-xs font-headline font-bold tracking-tight ${selectedProfile === prof ? 'text-[#004B93]' : 'text-[#34495E]'}`}>
                      {prof === 'TECNICO' ? 'TÉCNICO' : prof}
                    </span>
                  </button>
                ))}
              </div>

              {/* Formulário de Login */}
              <form onSubmit={handleLogin} className="space-y-4">
                
                {/* Campo de E-mail */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#34495E] mb-1.5">E-mail Institucional</label>
                  <div className="relative">
                    {/* Ícone de email */}
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => { setLoginEmail(e.target.value); setLoginError(''); }}
                      placeholder="nome.sobrenome@senacsp.edu.br"
                      className={`w-full pl-10 pr-4 py-3 bg-[#F4F7FA] border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                        loginError ? 'border-red-500 focus:ring-red-200 bg-red-50/30' : 'border-transparent focus:border-[#004B93] focus:ring-[#004B93]/10'
                      }`}
                    />
                    {/* Ícone de erro se houver */}
                    {loginError && <AlertCircle className="absolute right-3 top-3.5 w-5 h-5 text-red-500 animate-bounce" />}
                  </div>
                  {/* Mensagem de erro */}
                  {loginError && <p className="text-xs text-red-500 font-medium mt-1">• {loginError}</p>}
                </div>

                {/* Campo de Senha */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#34495E]">Senha</label>
                    <button
                      type="button"
                      className="text-xs font-semibold text-[#004B93] focus:outline-none ml-2"
                      style={{ textDecoration: 'none', fontWeight: 600, padding: 0, background: 'none' }}
                      onClick={() => setScreen('RECUPERAR_SENHA')}
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-3 bg-[#F4F7FA] border border-transparent rounded-lg text-sm focus:outline-none focus:border-[#004B93] focus:ring-2 focus:ring-[#004B93]/10 transition-all"
                    />
                    {/* Botão para mostrar/ocultar senha */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Checkbox "Manter sessão ativa" */}
                <div className="flex items-center pt-1">
                  <input
                    type="checkbox"
                    id="keep-session"
                    checked={keepSession}
                    onChange={(e) => setKeepSession(e.target.checked)}
                    className="w-4 h-4 text-[#004B93] border-gray-300 rounded focus:ring-[#004B93] cursor-pointer"
                  />
                  <label htmlFor="keep-session" className="ml-2 text-xs font-medium text-[#34495E]/80 cursor-pointer">
                    Manter sessão ativa neste dispositivo
                  </label>
                </div>

                {/* Botão de Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 bg-[#004B93] hover:bg-[#003970] text-white font-headline font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70 active:scale-[0.99]"
                >
                  {loading ? (
                    // Spinner de carregamento
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      ACESSAR PORTAL
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Divisor "Ou cadastre-se" */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold text-gray-400">
                  <span className="bg-white px-3">
                    {selectedProfile === 'TECNICO' ? 'Ou cadastre sua equipe' : 'Ou realize seu cadastro'}
                  </span>
                </div>
              </div>

              {/* Botão para ir para cadastro */}
              <button
                type="button"
                onClick={() => { setScreen('REGISTER'); resetForms(); }}
                className="w-full py-3.5 bg-white border border-[#004B93] text-[#004B93] font-headline font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-[#F4F7FA] transition-colors shadow-sm"
              >
                {selectedProfile === 'TECNICO' ? 'REGISTRAR NOVA EQUIPE' : 'REALIZAR CADASTRO'}
                <PlusCircle className="w-4 h-4 text-[#F7941D]" />
              </button>

              {/* Rodapé com link para regras */}
              <p className="text-center text-xs text-[#34495E]/60 mt-4">
                Primeira vez no torneio?{' '}
                <a href="#regras" className="text-[#F7941D] font-bold hover:underline">Veja as regras de participação.</a>
              </p>
            </div>
          )}




          {/* ========== TELA 5: CADASTRO ========== */}
          {screen === 'REGISTER' && (
            <div className="animate-fadeIn transition-all duration-300">
              {/* Botão de voltar */}
              <button 
                onClick={() => setScreen('LOGIN')} 
                className="flex items-center gap-1 text-xs font-bold text-[#004B93] hover:underline mb-4"
              >
                Voltar para o Login
              </button>

              {/* Títulos */}
              <div className="mb-4">
                <h3 className="text-2xl font-headline font-bold text-[#34495E] mb-1">Create Profile</h3>
                <p className="text-xs text-[#34495E]/70 font-body">Fill in technical credentials to continue.</p>
              </div>

              {/* Seletores de Perfil em layout horizontal com fundo cinza */}
              <div className="flex gap-2 mb-6 bg-[#F4F7FA] p-1 rounded-xl border border-gray-200">
                {(['ADMIN', 'JUIZ', 'TECNICO'] as UserProfile[]).map((prof) => (
                  <button
                    key={prof}
                    type="button"
                    onClick={() => { setSelectedProfile(prof); }}
                    className={`flex-1 py-2 rounded-lg font-headline font-bold text-xs tracking-tight transition-all flex items-center justify-center gap-1 ${
                      selectedProfile === prof 
                        ? 'bg-[#E0E7FF] text-[#004B93] shadow-sm ring-1 ring-black/5' 
                        : 'bg-white text-[#34495E]/60 hover:text-[#34495E]'
                    }`}
                  >
                    {prof === 'ADMIN' && 'ADMIN'}
                    {prof === 'JUIZ' && 'JUIZ'}
                    {prof === 'TECNICO' && 'TÉCNICO'}
                  </button>
                ))}
              </div>

              {/* Formulário de cadastro */}
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Nome completo/social */}
                {selectedProfile === 'JUIZ' ? (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#34495E] mb-1">NOME COMPLETO/ SOCIAL</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        onBlur={() => setRegJuizNomeTocado(true)}
                        placeholder="John Doe"
                        className={`w-full px-3 py-2.5 bg-[#F4F7FA] border ${(regJuizNomeTocado && !regFullName) ? 'border-red-500' : 'border-transparent'} rounded-lg text-sm focus:outline-none transition-all focus:border-[#004B93]`}
                      />
                      {(regJuizNomeTocado && !regFullName) && (
                        <span className="absolute right-3 top-3 text-red-500">
                          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg>
                        </span>
                      )}
                    </div>
                    {(regJuizNomeTocado && !regFullName) && <span className="text-xs text-red-500 font-medium mt-1">Campo obrigatório</span>}
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#34495E] mb-1">NOME COMPLETO</label>
                    <input
                      type="text"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="Ex: Roberto Carlos da Silva"
                      className="w-full px-3 py-2.5 bg-[#F4F7FA] border border-transparent rounded-lg text-sm focus:outline-none transition-all focus:border-[#004B93]"
                    />
                  </div>
                )}

                {/* Grid com 2 colunas (CPF e Email) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Campo de CPF */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#34495E] mb-1">CPF</label>
                    <input
                      type="text"
                      maxLength={14}
                      value={regCpf}
                      onChange={(e) => setRegCpf(e.target.value)}
                      placeholder="000.000.000-00"
                      className="w-full px-3 py-2.5 bg-[#F4F7FA] border border-transparent rounded-lg text-sm focus:outline-none transition-all focus:border-[#004B93]"
                    />
                  </div>
                  {/* Campo de Email */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#34495E] mb-1">E-MAIL INSTITUCIONAL</label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="admin@robotics.org"
                      className="w-full px-3 py-2.5 bg-[#F4F7FA] border border-transparent rounded-lg text-sm focus:outline-none transition-all focus:border-[#004B93]"
                    />
                  </div>
                </div>

                {/* Campo de Código de Autorização (APENAS ADMIN e JUIZ) */}
                {(selectedProfile === 'ADMIN' || selectedProfile === 'JUIZ') && (
                  <div>
                    <label className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#34495E] mb-1">
                      CÓDIGO DE AUTORIZAÇÃO ADMINISTRATIVA
                      <Lock className="w-3 h-3 text-[#F7941D]" />
                    </label>
                    <input
                      type="text"
                      value={regAuthCode}
                      onChange={(e) => setRegAuthCode(e.target.value)}
                      placeholder="RA-XXXX-XXXX"
                      className="w-full px-3 py-2.5 bg-[#F4F7FA] border border-transparent rounded-lg text-sm uppercase focus:outline-none transition-all focus:border-[#004B93]"
                    />
                  </div>
                )}

                {/* Campo de Instituição (APENAS TECNICO) */}
                {selectedProfile === 'TECNICO' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#34495E] mb-1">INSTITUIÇÃO DE ENSINO</label>
                    <input
                      type="text"
                      value={regInstitution}
                      onChange={(e) => setRegInstitution(e.target.value)}
                      placeholder="Ex: SENAC Robotics Lab"
                      className="w-full px-3 py-2.5 bg-[#F4F7FA] border border-transparent rounded-lg text-sm focus:outline-none transition-all focus:border-[#004B93]"
                    />
                  </div>
                )}

                {/* Grid com 2 colunas (Senha e Confirmação) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Campo de Senha */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#34495E] mb-1">SENHA</label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="********"
                      className="w-full px-3 py-2.5 bg-[#F4F7FA] border border-transparent rounded-lg text-sm focus:outline-none transition-all focus:border-[#004B93]"
                    />
                  </div>
                  {/* Campo de Confirmação de Senha */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#34495E] mb-1">CONFIRMAÇÃO DE SENHA</label>
                    <input
                      type="password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="********"
                      className="w-full px-3 py-2.5 bg-[#F4F7FA] border border-transparent rounded-lg text-sm focus:outline-none transition-all focus:border-[#004B93]"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#004B93] hover:bg-[#003970] text-white font-headline font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md mt-6"
                >
                  {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'FINALIZAR CADASTRO'}
                </button>
              </form>
              <div className="text-center mt-6">
                <p className="text-xs text-[#34495E]">
                  Já tenho conta?{' '}
                  <button onClick={() => setScreen('LOGIN')} className="text-[#004B93] font-bold hover:underline">Acessar Portal</button>
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                <span>Protocolo v24.1.0</span>
                <div className="space-x-4">
                  <a href="#suporte" className="hover:underline">Suporte</a>
                  <a href="#privacidade" className="hover:underline">Privacidade</a>
                </div>
              </div>
            </div>
          )}


          {/* ========== RODAPÉ GERAL ========== */}
          {/* Exibido apenas quando NÃO está na tela de cadastro */}
          {screen !== 'REGISTER' && (
            <div className="mt-12 flex justify-between text-[10px] text-gray-400 font-headline font-bold uppercase tracking-wider">
              <span>PROTOCOLO V24.1.0</span>
              <div className="space-x-4">
                <a href="#suporte" className="hover:text-[#34495E] transition-colors">SUPORTE</a>
                <a href="#privacidade" className="hover:text-[#34495E] transition-colors">PRIVACIDADE</a>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}