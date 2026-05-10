// Marca o componente como "Client Component" para usar hooks (useState, useEffect, etc)
'use client'

// Importações necessárias:
// - React hooks para gerenciar estado (useState, useEffect) e referências (useRef)
// - Image do Next.js para otimização de imagens
// - Swal para exibir alertas customizados
// - Ícones do Lucide React para a interface visual
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  PlusCircle, 
  User, 
  FileText, 
  Building 
} from 'lucide-react';

// Define os tipos de perfil de usuário no sistema (Admin, Juiz, Técnico)
type UserProfile = 'ADMIN' | 'JUIZ' | 'TECNICO';

// Define as diferentes telas que o componente pode exibir (Login, Registro, Recuperação de senha, etc)
type CurrentScreen = 'LOGIN' | 'REGISTER' | 'FORGOT_EMAIL' | 'FORGOT_CODE' | 'FORGOT_RESET';

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

  // ========== ESTADOS DA RECUPERAÇÃO DE SENHA ==========
  // Email digitado no fluxo de recuperação de senha
  const [recoveryEmail, setRecoveryEmail] = useState('');
  
  // Array com os 6 dígitos do código de verificação
  const [recoveryCode, setRecoveryCode] = useState(['', '', '', '', '', '']);
  
  // Nova senha digitada no formulário de redefinição
  const [newPassword, setNewPassword] = useState('');
  
  // Confirmação da nova senha
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  // Contador regressivo (em segundos) para expiração do código de verificação
  const [timer, setTimer] = useState(165);
  
  // Referências aos inputs dos 6 dígitos do código para controlar o foco entre eles
  const codeInputsRef = useRef<(HTMLInputElement | null)[]>([]);

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
  
  // Objeto que armazena mensagens de erro para cada campo do cadastro
  const [regErrors, setRegErrors] = useState<{[key: string]: string}>({});


  // ========== EFEITO: Contador Regressivo ==========
  // Esse efeito executa sempre que a tela ou timer mudam
  // Se estamos na tela do código e o timer > 0, decrementa 1 segundo a cada intervalo
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (screen === 'FORGOT_CODE' && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [screen, timer]);

  // ========== FUNÇÕES AUXILIARES ==========

  // Converte segundos em formato MM:SS (ex: 165 segundos = "02:45")
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Valida se o email tem o formato correto usando expressão regular
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!validateEmail(loginEmail)) {
      setLoginError('E-mail inválido');
      return;
    }
    if (!loginPassword) {
      setLoginError('Senha obrigatória');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Swal.fire({
        title: 'Acesso Liberado!',
        text: `Bem-vindo ao portal, ${selectedProfile}.`,
        icon: 'success',
        confirmButtonColor: '#004B93',
        timer: 2000,
        showConfirmButton: false
      });
    }, 1500);
  };

  const handleSendRecoveryEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(recoveryEmail)) {
      Swal.fire({ icon: 'error', title: 'Erro', text: 'Insira um e-mail válido.', confirmButtonColor: '#004B93' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setTimer(165);
      setScreen('FORGOT_CODE');
    }, 1000);
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newCode = [...recoveryCode];
    newCode[index] = value;
    setRecoveryCode(newCode);

    if (value && index < 5) {
      codeInputsRef.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !recoveryCode[index] && index > 0) {
      codeInputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = recoveryCode.join('');
    if (fullCode.length < 6) {
      Swal.fire({ icon: 'warning', title: 'Código Incompleto', text: 'Preencha os 6 dígitos.', confirmButtonColor: '#004B93' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setScreen('FORGOT_RESET');
    }, 1000);
  };

  const isLengthOk = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLengthOk || !hasNumber || !hasSpecial) {
      Swal.fire({ icon: 'error', title: 'Senha fraca', text: 'Atenda a todos os requisitos de segurança.', confirmButtonColor: '#004B93' });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Swal.fire({ icon: 'error', title: 'Senhas divergentes', text: 'A confirmação de senha não confere.', confirmButtonColor: '#004B93' });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Swal.fire({
        title: 'Senha redefinida!',
        text: 'Sua senha foi alterada com sucesso.',
        icon: 'success',
        confirmButtonColor: '#004B93'
      }).then(() => {
        setScreen('LOGIN');
        setNewPassword('');
        setConfirmNewPassword('');
      });
    }, 1500);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: {[key: string]: string} = {};

    if (!regFullName.trim()) errors.fullName = 'Campo obrigatório';
    if (!regCpf.trim() || regCpf.length < 11) errors.cpf = 'CPF inválido';
    if (!validateEmail(regEmail)) errors.email = 'E-mail inválido';
    
    if ((selectedProfile === 'ADMIN' || selectedProfile === 'JUIZ') && !regAuthCode.trim()) {
      errors.authCode = 'Código de autorização obrigatório';
    }
    if (selectedProfile === 'TECNICO' && !regInstitution.trim()) {
      errors.institution = 'Instituição obrigatória';
    }
    
    if (regPassword.length < 8) errors.password = 'Mínimo de 8 caracteres';
    if (regPassword !== regConfirmPassword) errors.confirmPassword = 'As senhas não coincidem';

    setRegErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Swal.fire({
        title: 'Cadastro Realizado!',
        text: `Perfil de ${selectedProfile} criado com sucesso.`,
        icon: 'success',
        confirmButtonColor: '#004B93'
      }).then(() => {
        setScreen('LOGIN');
      });
    }, 1500);
  };

  const resetForms = () => {
    setLoginError('');
    setRegErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="flex min-h-screen bg-white text-[#34495E] font-sans antialiased">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;600;700;700&display=swap');
        .font-headline { font-family: 'Space Grotesk', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* BARRA LATERAL ESQUERDA */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#004B93] relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 z-0 bg-cover bg-center mix-blend-overlay opacity-30"
             style={{ backgroundImage: 'url(/img/pictures/projects/robot.png)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#004B93]/90 via-[#004B93]/95 to-[#001f3f]/95 z-10" />

        <div className="relative z-20 max-w-lg">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 bg-[#F7941D] text-white px-3 py-1.5 rounded font-headline font-bold text-xs tracking-widest uppercase shadow-sm">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              ROBOTIC_SYNC
            </span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-headline font-bold text-white mb-4 leading-tight tracking-tight">
            Torneio de<br />Robótica
          </h1>

          <h2 className="text-2xl lg:text-3xl font-body font-light text-white/90 mb-6">
            Portal de Acesso
          </h2>

          <p className="text-blue-100/80 font-body text-base leading-relaxed pr-6">
            Onde a precisão da engenharia encontra a inovação sustentável. Acesse o portal oficial para gerenciar equipes, matches e avaliações técnicas.
          </p>
        </div>

        <div className="relative z-20">
          <Image src="/img/branding/logo-white.png" alt="Logo Senac" width={140} height={45} className="object-contain" priority />
        </div>
      </div>

      {/* ÁREA DINÂMICA DIREITA */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md font-body">

          {/* TELA 1: LOGIN */}
          {screen === 'LOGIN' && (
            <div className="animate-fadeIn transition-all duration-300">
              <div className="mb-6">
                <h3 className="text-3xl font-headline font-bold text-[#34495E] mb-1">Bem-vindo ao Portal</h3>
                <p className="text-sm text-[#34495E]/70 font-body">Selecione seu perfil para continuar a jornada técnica.</p>
              </div>

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
                    <span className="text-xl mb-1">
                      {prof === 'ADMIN' && '👤'}
                      {prof === 'JUIZ' && '⚖️'}
                      {prof === 'TECNICO' && '🔧'}
                    </span>
                    <span className={`text-xs font-headline font-bold tracking-tight ${selectedProfile === prof ? 'text-[#004B93]' : 'text-[#34495E]'}`}>
                      {prof === 'TECNICO' ? 'TÉCNICO' : prof}
                    </span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#34495E] mb-1.5">E-mail Institucional</label>
                  <div className="relative">
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
                    {loginError && <AlertCircle className="absolute right-3 top-3.5 w-5 h-5 text-red-500 animate-bounce" />}
                  </div>
                  {loginError && <p className="text-xs text-red-500 font-medium mt-1">• {loginError}</p>}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#34495E]">Senha</label>
                    <button 
                      type="button" 
                      onClick={() => { setScreen('FORGOT_EMAIL'); resetForms(); }}
                      className="text-xs font-bold text-[#004B93] hover:underline"
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
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 bg-[#004B93] hover:bg-[#003970] text-white font-headline font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70 active:scale-[0.99]"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      ACESSAR PORTAL
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Divisor Condicional */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold text-gray-400">
                  <span className="bg-white px-3">
                    {selectedProfile === 'TECNICO' ? 'Ou cadastre sua equipe' : 'Ou realize seu cadastro'}
                  </span>
                </div>
              </div>

              {/* Ação para Cadastro Condicional */}
              <button
                type="button"
                onClick={() => { setScreen('REGISTER'); resetForms(); }}
                className="w-full py-3.5 bg-white border border-[#004B93] text-[#004B93] font-headline font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-[#F4F7FA] transition-colors shadow-sm"
              >
                {selectedProfile === 'TECNICO' ? 'REGISTRAR NOVA EQUIPE' : 'REALIZAR CADASTRO'}
                <PlusCircle className="w-4 h-4 text-[#F7941D]" />
              </button>

              <p className="text-center text-xs text-[#34495E]/60 mt-4">
                Primeira vez no torneio?{' '}
                <a href="#regras" className="text-[#F7941D] font-bold hover:underline">Veja as regras de participação.</a>
              </p>
            </div>
          )}

          {/* TELA 2: RECUPERAÇÃO - E-MAIL */}
          {screen === 'FORGOT_EMAIL' && (
            <div className="animate-fadeIn transition-all duration-300">
              <button 
                onClick={() => setScreen('LOGIN')} 
                className="flex items-center gap-1 text-xs font-bold text-[#004B93] hover:underline mb-6"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Voltar para o Login
              </button>

              <h3 className="text-3xl font-headline font-bold text-[#34495E] mb-2">Recuperar Senha</h3>
              <p className="text-sm text-[#34495E]/70 font-body mb-6 leading-relaxed">
                Insira seu e-mail cadastrado para receber as instruções de redefinição.
              </p>

              <form onSubmit={handleSendRecoveryEmail} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#34495E] mb-1.5">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      placeholder="nome.sobrenome@senacsp.edu.br"
                      className="w-full pl-10 pr-4 py-3 bg-[#F4F7FA] border border-transparent rounded-lg text-sm focus:outline-none focus:border-[#004B93] focus:ring-2 focus:ring-[#004B93]/10 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#004B93] hover:bg-[#003970] text-white font-headline font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'ENVIAR INSTRUÇÕES ⊳'}
                </button>
              </form>
            </div>
          )}

          {/* TELA 3: RECUPERAÇÃO - CÓDIGO */}
          {screen === 'FORGOT_CODE' && (
            <div className="animate-fadeIn transition-all duration-300">
              <button 
                onClick={() => setScreen('FORGOT_EMAIL')} 
                className="flex items-center gap-1 text-xs font-bold text-[#004B93] hover:underline mb-6"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Voltar para etapa anterior
              </button>

              <h3 className="text-3xl font-headline font-bold text-[#34495E] mb-2">Verificar Código</h3>
              <p className="text-sm text-[#34495E]/70 font-body mb-6">
                Enviamos um código de 6 dígitos para seu e-mail.<br />Por favor, insira-o abaixo para continuar.
              </p>

              <form onSubmit={handleVerifyCode} className="space-y-6">
                <div className="flex justify-between gap-2">
                  {recoveryCode.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { codeInputsRef.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(idx, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(idx, e)}
                      className="w-12 h-12 bg-[#F4F7FA] border border-gray-200 rounded-lg text-center text-lg font-headline font-bold text-[#004B93] focus:outline-none focus:border-[#004B93] focus:ring-2 focus:ring-[#004B93]/20 transition-all"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#004B93] hover:bg-[#003970] text-white font-headline font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Verificar ➔'}
                </button>

                <div className="text-center space-y-2">
                  <p className="text-xs text-[#34495E]/80">
                    Não recebeu o código?{' '}
                    <button 
                      type="button" 
                      onClick={() => { setTimer(165); Swal.fire({ icon:'success', title:'Reenviado', text:'Verifique sua caixa de entrada.', showConfirmButton:false, timer:1500 }); }} 
                      className="text-[#004B93] font-bold hover:underline"
                    >
                      Reenviar código
                    </button>
                  </p>
                  <p className="text-xs font-headline tracking-widest font-bold text-gray-400 uppercase flex items-center justify-center gap-1">
                    ⏱ Expira em {formatTime(timer)}
                  </p>
                </div>
              </form>
            </div>
          )}

          {/* TELA 4: RECUPERAÇÃO - NOVA SENHA */}
          {screen === 'FORGOT_RESET' && (
            <div className="animate-fadeIn transition-all duration-300">
              <button 
                onClick={() => setScreen('FORGOT_CODE')} 
                className="flex items-center gap-1 text-xs font-bold text-[#004B93] hover:underline mb-6"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Voltar para etapa anterior
              </button>

              <h3 className="text-3xl font-headline font-bold text-[#34495E] mb-2">Nova senha</h3>
              <p className="text-sm text-[#34495E]/70 font-body mb-6">Crie uma senha forte para proteger sua conta.</p>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#34495E] mb-1.5">Nova Senha</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-4 pr-10 py-3 bg-[#F4F7FA] border border-transparent rounded-lg text-sm focus:outline-none focus:border-[#004B93] focus:ring-2 focus:ring-[#004B93]/10 transition-all"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#34495E] mb-1.5">Confirmar Nova Senha</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-4 pr-10 py-3 bg-[#F4F7FA] border border-transparent rounded-lg text-sm focus:outline-none focus:border-[#004B93] focus:ring-2 focus:ring-[#004B93]/10 transition-all"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="bg-[#F0F5FA] p-4 rounded-lg space-y-2 border border-blue-100/50">
                  <p className="text-xs font-headline font-bold uppercase tracking-wider text-[#34495E]/80 mb-2">Requisitos de segurança</p>
                  <div className="flex items-center gap-2 text-xs text-[#34495E]">
                    <CheckCircle2 className={`w-4 h-4 ${isLengthOk ? 'text-green-600' : 'text-gray-300'}`} />
                    <span>Pelo menos 8 caracteres</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#34495E]">
                    <CheckCircle2 className={`w-4 h-4 ${hasNumber ? 'text-green-600' : 'text-gray-300'}`} />
                    <span>Pelo menos 1 número</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#34495E]">
                    <CheckCircle2 className={`w-4 h-4 ${hasSpecial ? 'text-green-600' : 'text-gray-300'}`} />
                    <span>Pelo menos 1 caractere especial</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#004B93] hover:bg-[#003970] text-white font-headline font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md mt-4"
                >
                  {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'REDEFINIR SENHA'}
                </button>
              </form>
            </div>
          )}

          {/* TELA 5: CADASTRO */}
          {screen === 'REGISTER' && (
            <div className="animate-fadeIn transition-all duration-300">
              <button 
                onClick={() => setScreen('LOGIN')} 
                className="flex items-center gap-1 text-xs font-bold text-[#004B93] hover:underline mb-4"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Voltar para o Login
              </button>

              <div className="mb-4">
                <h3 className="text-3xl font-headline font-bold text-[#34495E] mb-1">Create Profile</h3>
                <p className="text-xs text-[#34495E]/70 font-body">Fill in technical credentials to continue.</p>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-6 bg-[#F4F7FA] p-1 rounded-xl border border-gray-200">
                {(['ADMIN', 'JUIZ', 'TECNICO'] as UserProfile[]).map((prof) => (
                  <button
                    key={prof}
                    type="button"
                    onClick={() => { setSelectedProfile(prof); setRegErrors({}); }}
                    className={`py-2 rounded-lg font-headline font-bold text-xs tracking-tight transition-all flex items-center justify-center gap-1 ${
                      selectedProfile === prof 
                        ? 'bg-white text-[#004B93] shadow-sm ring-1 ring-black/5' 
                        : 'text-[#34495E]/60 hover:text-[#34495E]'
                    }`}
                  >
                    {prof === 'ADMIN' && <User className="w-3.5 h-3.5" />}
                    {prof === 'JUIZ' && <FileText className="w-3.5 h-3.5" />}
                    {prof === 'TECNICO' && <Building className="w-3.5 h-3.5" />}
                    {prof === 'TECNICO' ? 'TÉCNICO' : prof}
                  </button>
                ))}
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#34495E] mb-1">
                    {selectedProfile === 'JUIZ' ? 'Nome Completo/ Social' : 'Nome Completo'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder={selectedProfile === 'TECNICO' ? "Ex: Roberto Carlos da Silva" : "John Doe"}
                      className={`w-full pl-3 pr-8 py-2.5 bg-[#F4F7FA] border rounded-lg text-sm focus:outline-none transition-all ${
                        regErrors.fullName ? 'border-red-500 focus:ring-1 focus:ring-red-200 bg-red-50/20' : 'border-transparent focus:border-[#004B93]'
                      }`}
                    />
                    {regErrors.fullName && <AlertCircle className="absolute right-3 top-3 w-4 h-4 text-red-500" />}
                  </div>
                  {regErrors.fullName && <p className="text-xs text-red-500 font-medium mt-1">ⓘ {regErrors.fullName}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#34495E] mb-1">CPF</label>
                    <input
                      type="text"
                      maxLength={14}
                      value={regCpf}
                      onChange={(e) => setRegCpf(e.target.value)}
                      placeholder="000.000.000-00"
                      className={`w-full px-3 py-2.5 bg-[#F4F7FA] border rounded-lg text-sm focus:outline-none transition-all ${
                        regErrors.cpf ? 'border-red-500 bg-red-50/20' : 'border-transparent focus:border-[#004B93]'
                      }`}
                    />
                    {regErrors.cpf && <p className="text-xs text-red-500 font-medium mt-1">{regErrors.cpf}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#34495E] mb-1">
                      {selectedProfile === 'TECNICO' ? 'E-mail' : 'E-mail Institucional'}
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="nome.sobrenome@senacsp.edu.br"
                      className={`w-full px-3 py-2.5 bg-[#F4F7FA] border rounded-lg text-sm focus:outline-none transition-all ${
                        regErrors.email ? 'border-red-500 bg-red-50/20' : 'border-transparent focus:border-[#004B93]'
                      }`}
                    />
                    {regErrors.email && <p className="text-xs text-red-500 font-medium mt-1">{regErrors.email}</p>}
                  </div>
                </div>

                {(selectedProfile === 'ADMIN' || selectedProfile === 'JUIZ') && (
                  <div>
                    <label className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#34495E] mb-1">
                      Código de Autorização Administrativa
                      <Lock className="w-3 h-3 text-[#F7941D]" />
                    </label>
                    <input
                      type="text"
                      value={regAuthCode}
                      onChange={(e) => setRegAuthCode(e.target.value)}
                      placeholder="RA-XXXX-XXXX"
                      className={`w-full px-3 py-2.5 bg-[#F4F7FA] border rounded-lg text-sm uppercase focus:outline-none transition-all ${
                        regErrors.authCode ? 'border-red-500 bg-red-50/20' : 'border-transparent focus:border-[#004B93]'
                      }`}
                    />
                    {regErrors.authCode && <p className="text-xs text-red-500 font-medium mt-1">{regErrors.authCode}</p>}
                  </div>
                )}

                {selectedProfile === 'TECNICO' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#34495E] mb-1">Instituição de Ensino</label>
                    <input
                      type="text"
                      value={regInstitution}
                      onChange={(e) => setRegInstitution(e.target.value)}
                      placeholder="Ex: SENAC Robotics Lab"
                      className={`w-full px-3 py-2.5 bg-[#F4F7FA] border rounded-lg text-sm focus:outline-none transition-all ${
                        regErrors.institution ? 'border-red-500 bg-red-50/20' : 'border-transparent focus:border-[#004B93]'
                      }`}
                    />
                    {regErrors.institution && <p className="text-xs text-red-500 font-medium mt-1">{regErrors.institution}</p>}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#34495E] mb-1">Senha</label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full px-3 py-2.5 bg-[#F4F7FA] border rounded-lg text-sm focus:outline-none transition-all ${
                        regErrors.password ? 'border-red-500 bg-red-50/20' : 'border-transparent focus:border-[#004B93]'
                      }`}
                    />
                    {regErrors.password && <p className="text-xs text-red-500 font-medium mt-1">{regErrors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#34495E] mb-1">Confirmação de Senha</label>
                    <input
                      type="password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full px-3 py-2.5 bg-[#F4F7FA] border rounded-lg text-sm focus:outline-none transition-all ${
                        regErrors.confirmPassword ? 'border-red-500 bg-red-50/20' : 'border-transparent focus:border-[#004B93]'
                      }`}
                    />
                    {regErrors.confirmPassword && <p className="text-xs text-red-500 font-medium mt-1">{regErrors.confirmPassword}</p>}
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

          {/* RODAPÉ GERAL */}
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