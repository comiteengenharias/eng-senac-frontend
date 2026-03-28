'use client';

import Footer from "@/components/Home/Footer";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import "../cadastro.css";
import { useRouter } from "next/navigation";
import { loginTeacher, verifyLogin } from "@/services/api-login";
import Swal from "sweetalert2";
import LoadingOverlay from "@/components/system/loading-overlay";

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
      }
    })();
  }, []);

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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

    setLoading(false)
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

  const sendTeacherData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    const formElement = document.getElementById('register-form') as HTMLFormElement;
    const formData = new FormData(formElement);

    const formDataObj = {
      fullname: formData.get('teacher-name') as string,
      institutionalEmail: formData.get('institutional-email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirm-password') as string,
      token: formData.get('teacher-token') as string
    };

    const requiredFields = ['fullname', 'institutionalEmail', 'password', 'confirmPassword', 'token'] as const;
    const fieldLabels: Record<string, string> = {
      fullname: "Nome completo",
      institutionalEmail: "E-mail institucional",
      password: "Senha",
      confirmPassword: "Confirmação de senha",
      token: "Token de Professor"
    };

    for (const field of requiredFields) {
      const value = formDataObj[field];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
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

    if (!formDataObj.institutionalEmail.includes("senac")) {
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

    if (!Object.values(validations).every(Boolean)) {
      let msg = 'A senha não atende aos seguintes critérios:\n';
      if (!validations.characters) msg += 'Pelo menos um caractere especial; ';
      if (!validations.lettersLow) msg += 'Pelo menos uma letra minúscula; ';
      if (!validations.lettersCap) msg += 'Pelo menos uma letra maiúscula; ';
      if (!validations.length) msg += 'Pelo menos 8 caracteres; ';
      if (!validations.numbers) msg += 'Pelo menos um número;';
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
      newTeacher: {
        codTeacher: 0,
        fullname: formDataObj.fullname,
        institutionalEmail: formDataObj.institutionalEmail,
        password: formDataObj.password
      },
      token: formDataObj.token
    };

    try {
      const { postTeacherRegistration } = await import('@/services/api-register');
      await postTeacherRegistration(data);

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
      await loginTeacher(dataLogin);
      router.push('/area-restrita/professor');

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


  return (
    <div>
      <LoadingOverlay active={loading} />
      <div className="h-screen bg-gradient-to-br from-[#f5f7fa] to-[#eef2f7] flex items-center justify-center px-4 py-6 overflow-hidden">
        <section className="w-full mx-auto max-w-6xl max-h-[calc(100vh-3rem)] flex">
          <div className="grid lg:grid-cols-3 gap-0 rounded-2xl shadow-2xl w-full max-h-[calc(100vh-3rem)]">
            {/* Left Side - Image (Desktop Only) */}
            <div className="hidden lg:flex col-span-1 relative bg-gradient-to-br from-orange-400 to-orange-600 rounded-l-2xl items-center justify-center">
              <Image 
                unoptimized
                src="/img/pictures/picture_senac_engineer02.jpg"
                alt="Engenharias Senac"
                fill
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-orange-900/20 to-orange-900/50 flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">Bem-vindo, Professor!</h3>
                  <p className="text-white text-sm">Acesse o painel de gerenciamento da Semana das Engenharias</p>
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
              <h2 className="text-black text-2xl sm:text-3xl font-bold mb-1 shrink-0">Cadastro de <span className="text-orange-500">Professor</span></h2>
              <p className="text-gray-600 text-sm mb-6 shrink-0">Preencha os dados abaixo para acessar o sistema</p>
              <form className="space-y-4 lg:space-y-5 text-sm overflow-y-auto flex-1 p-1" id="register-form" onSubmit={sendTeacherData}>
                <div>
                  <label htmlFor="teacher-name" className="block text-sm font-semibold text-gray-700 mb-2">Nome completo</label>
                  <input
                    type="text"
                    id="teacher-name"
                    name="teacher-name"
                    placeholder="Ex: Maria Silva"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="institutional-email" className="block text-sm font-semibold text-gray-700 mb-2">E-mail institucional</label>
                  <input
                    type="email"
                    id="institutional-email"
                    name="institutional-email"
                    placeholder="Ex: professor@senacsp.edu.br"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="teacher-token" className="block text-sm font-semibold text-gray-700 mb-2">ID de Professor</label>
                  <input
                    type="text"
                    id="teacher-token"
                    name="teacher-token"
                    placeholder="Ex: 0123456789"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="pt-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Senha</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Ex: Senac@123"
                    onInput={(e) => setPassword(e.currentTarget.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-semibold text-gray-700 mb-2">Confirmar senha</label>
                  <input
                    type="password"
                    id="confirm-password"
                    name="confirm-password"
                    placeholder="Repita a senha"
                    onInput={(e) => setConfirmPassword(e.currentTarget.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
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

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 cursor-pointer active:brightness-90"
                >
                  Cadastre-se
                </button>
                <Link
                  href="/login/professor"
                  className="flex-1 border-2 border-orange-500 text-orange-500 font-semibold py-3 rounded-lg hover:bg-orange-50 transition-all duration-300 text-center cursor-pointer active:brightness-90"
                >
                  Voltar
                </Link>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div >
  );
}
