'use client'

import Image from "next/image";
import { useState } from 'react';
import Swal from 'sweetalert2';
import { Lock, Mail, Eye, EyeOff, ChevronRight } from 'lucide-react';


type UserProfile = 'ADMIN' | 'JUIZ' | 'TECNICO';


export default function LoginRobotica() {

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile>('ADMIN');
  const [keepSessionActive, setKeepSessionActive] = useState(false);


  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);


    const formElement = document.getElementById('login-form') as HTMLFormElement;
    const formData = new FormData(formElement);

  
    const credentials = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      profile: selectedProfile,
      keepSessionActive: keepSessionActive
    };

    
    if (!credentials.email || !credentials.password) {
      setLoading(false);
      Swal.fire({
        title: 'Campos obrigatórios',
        text: 'Por favor, preencha e-mail e senha',
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#1e40af'
      });
      return;
    }

   
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      setLoading(false);

      Swal.fire({
        title: 'Sucesso!',
        text: `Bem-vindo ${credentials.profile}! Redirecionando...`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });



    } catch (error) {
      setLoading(false);

      Swal.fire({
        title: 'Erro ao fazer login',
        text: 'Houve um problema. Tente novamente mais tarde.',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#004b93'
      });
    }
  };


  return (
    <div className="flex h-screen bg-white overflow-hidden">
      
    
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 relative overflow-hidden">
      
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-cover bg-center" 
            style={{backgroundImage: 'url(/img/pictures/projects/robot.png)'}}
          />
        </div>

      
        <div className="relative z-10 p-12 flex flex-col justify-between">
          
         
          <div>
           
            <div className="mb-8">
              <div className="inline-block bg-orange-500 text-white px-4 py-2 rounded-lg font-bold text-sm tracking-wider">
                ROBOTIC_SYNC
              </div>
            </div>

        
            <h1 className="text-6xl font-black text-white mb-4 leading-tight">
              Torneio de<br />Robótica
            </h1>

            <h2 className="text-3xl font-light text-white mb-6 opacity-95">
              Portal de Acesso
            </h2>

            <p className="text-blue-100 text-lg leading-relaxed max-w-md">
              Onde a precisão da engenharia encontra a inovação sustentável. 
              Acesse o portal oficial para gerenciar equipes, matches e avaliações técnicas.
            </p>
          </div>

         
          <div>
            <Image
              src="/img/branding/logo-white.png"
              alt="Logo Senac"
              width={150}
              height={0}
              priority
            />
          </div>
        </div>
      </div>


      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              Bem-vindo ao Portal
            </h3>
            <p className="text-gray-600">
              Selecione seu perfil para continuar a jornada técnica.
            </p>
          </div>

       
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Selecione seu perfil
            </label>

            <div className="grid grid-cols-3 gap-3">
            
              <button
                type="button"
                onClick={() => setSelectedProfile('ADMIN')}
                className={`p-4 rounded-lg text-center transition-all duration-200 transform hover:scale-105 ${
                  selectedProfile === 'ADMIN'
                    ? 'bg-blue-600 text-white border-2 border-blue-600 shadow-lg'
                    : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="text-3xl mb-2">👤</div>
                <div className="text-sm font-semibold">ADMIN</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedProfile('JUIZ')}
                className={`p-4 rounded-lg text-center transition-all duration-200 transform hover:scale-105 ${
                  selectedProfile === 'JUIZ'
                    ? 'bg-blue-600 text-white border-2 border-blue-600 shadow-lg'
                    : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="text-3xl mb-2">⚖️</div>
                <div className="text-sm font-semibold">JUIZ</div>
              </button>

              
              <button
                type="button"
                onClick={() => setSelectedProfile('TECNICO')}
                className={`p-4 rounded-lg text-center transition-all duration-200 transform hover:scale-105 ${
                  selectedProfile === 'TECNICO'
                    ? 'bg-blue-600 text-white border-2 border-blue-600 shadow-lg'
                    : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="text-3xl mb-2">🔧</div>
                <div className="text-sm font-semibold">TÉCNICO</div>
              </button>
            </div>
          </div>

         
          <form id="login-form" onSubmit={handleLogin} className="space-y-5">

           
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                E-mail Institucional
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="nome.sobrenome@senac.edu.br"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                  required
                />
              </div>
            </div>

         
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Senha
                </label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-800 font-semibold">
                  Esqueceu a senha?
                </a>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

        
            <div className="flex items-center">
              <input
                type="checkbox"
                id="keep-session"
                checked={keepSessionActive}
                onChange={(e) => setKeepSessionActive(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="keep-session" className="ml-2 text-sm text-gray-700 cursor-pointer">
                Manter sessão ativa neste dispositivo
              </label>
            </div>

         
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 mt-8 ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-700 hover:bg-blue-800 active:brightness-90'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <span>ACESSAR PORTAL</span>
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>


          <div className="mt-8 space-y-4">
            {/* Divisor */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-600 font-semibold">
                  Ou cadastre sua equipe
                </span>
              </div>
            </div>

        
            <a
              href="/cadastro/robotica"
              className="w-full inline-block text-center px-4 py-2 text-blue-600 hover:text-blue-800 font-bold hover:underline transition-colors"
            >
              REGISTRAR NOVA EQUIPE 🔗
            </a>

          
            <p className="text-xs text-gray-500 text-center">
              Primeira vez no torneio?{' '}
              <a href="#" className="text-orange-500 hover:text-orange-600 font-semibold">
                Veja as regras de participação
              </a>
            </p>
          </div>

    
          <div className="mt-8 flex justify-center gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-700">PROTOCOLO v2.4.1.0</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-700">SUPORTE</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-700">PRIVACIDADE</a>
          </div>
        </div>
      </div>
    </div>
  );
}