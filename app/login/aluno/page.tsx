'use client'

import Link from 'next/link'
import Image from "next/image";
import Swal from 'sweetalert2'
import { loginStudent, recoverStudentPassword, verifyLogin } from "@/services/api-login";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingOverlay from '@/components/system/loading-overlay';
import { Lock, Mail, Eye, EyeOff, LogIn } from 'lucide-react';

export default function LoginAluno() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [showPassword, setShowPassword] = useState(false);

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
				setLoading(false)
			}
		})();
	}, [router]);

	const sendData = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true)
		const formElement = document.getElementById('login-form') as HTMLFormElement;
		const formData = new FormData(formElement);

		const formDataObj = {
			email: formData.get('email') as string,
			password: formData.get('password') as string,
		};

		if (
			formDataObj.email == null
			|| formDataObj.email == ""
			|| formDataObj.password == null
			|| formDataObj.password == ""
		) {
			setLoading(false)
			Swal.fire({
				title: 'Campos obrigatórios',
				text: `Por favor, preencha e-mail e senha`,
				icon: 'warning',
				confirmButtonText: 'Ok',
				confirmButtonColor: '#0066cc'
			});
			return;
		}

		try {
			const response = await loginStudent(formDataObj);

			if (response.status == 200)
				router.push('/area-restrita/aluno');
			else {
				setLoading(false)
				Swal.fire({
					title: 'Erro ao fazer login',
					text: "Houve algum problema. Tente novamente mais tarde",
					icon: 'error',
					confirmButtonText: 'Ok',
					confirmButtonColor: '#0066cc'
				});
			}
		} catch (error: any) {
			setLoading(false);
			if (error.response?.status === 409) {
				Swal.fire({
					title: 'Erro de autenticação',
					text: error.response?.data?.detail || "Credenciais inválidas",
					icon: 'error',
					confirmButtonText: 'Ok',
					confirmButtonColor: '#0066cc'
				});
			} else {
				Swal.fire({
					title: 'Erro inesperado',
					text: "Não conseguimos conectar ao servidor",
					icon: 'error',
					confirmButtonText: 'Ok',
					confirmButtonColor: '#0066cc'
				});
			}
		}
	}

	const forgotPsw = async () => {
		const emailInput = document.getElementById('input-email') as HTMLInputElement;
		const email = emailInput?.value?.trim();

		if (!email) {
			Swal.fire({
				title: 'E-mail necessário',
				text: 'Preencha o e-mail para recuperar sua senha.',
				icon: 'warning',
				confirmButtonText: 'Ok',
				confirmButtonColor: '#0066cc'
			});
			return;
		}

		setLoading(true);

		try {
			await recoverStudentPassword(email);
			setLoading(false);
			Swal.fire({
				title: 'Sucesso!',
				html: 'Enviamos um e-mail com uma nova senha.',
				icon: 'success',
				confirmButtonText: 'Ok',
				confirmButtonColor: '#0066cc'
			});
		} catch (error: any) {
			setLoading(false);

			if (error.response?.status === 404) {
				Swal.fire({
					title: 'E-mail não encontrado',
					text: 'Verifique se o e-mail está correto.',
					icon: 'error',
					confirmButtonText: 'Ok',
					confirmButtonColor: '#0066cc'
				});
			} else {
				Swal.fire({
					title: 'Erro',
					text: 'Erro ao recuperar senha. Tente novamente mais tarde.',
					icon: 'error',
					confirmButtonText: 'Ok',
					confirmButtonColor: '#0066cc'
				});
			}
		}
	};

	return (
		<div>
			<LoadingOverlay active={loading} />
			<div className="h-screen bg-gradient-to-br from-[#f5f7fa] to-[#eef2f7] flex items-center justify-center px-4 py-6 overflow-hidden">
				<div className="w-full max-w-sm max-h-[calc(100vh-3rem)]">
					{/* Card */}
					<div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-fit max-h-[calc(100vh-3rem)]">
						{/* Header com Gradient */}
						<div className="bg-gradient-to-r from-[#0066cc] to-[#0052a3] px-6 sm:px-8 py-6 sm:py-8 text-center shrink-0">
							<div className='mb-6 flex justify-center'>
								<Image
									unoptimized
									src="/img/branding/logo-white.png"
									alt="Logo Senac"
									width={140}
									height={0}
									priority
								/>
							</div>
							<h1 className="text-white text-2xl sm:text-3xl font-bold mb-2">Bem-vindo de volta!</h1>
							<p className="text-blue-100 text-sm">Acesso para alunos</p>
						</div>

						{/* Form Container */}
						<div className="px-6 sm:px-8 py-6 sm:py-8 overflow-y-auto flex-1">
							<form id="login-form" onSubmit={sendData} className="space-y-5">
								{/* Email Field */}
								<div>
									<label htmlFor="input-email" className="block text-sm font-semibold text-gray-700 mb-2">
										E-mail
									</label>
									<div className="relative">
										<Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
										<input
											type="email"
											name="email"
											id="input-email"
											placeholder="seu@email.com"
											className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent transition-all"
										/>
									</div>
								</div>

								{/* Password Field */}
								<div>
									<label htmlFor="input-password" className="block text-sm font-semibold text-gray-700 mb-2">
										Senha
									</label>
									<div className="relative">
										<Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
										<input
											type={showPassword ? "text" : "password"}
											name="password"
											id="input-password"
											placeholder="••••••••"
											className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent transition-all"
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
										>
											{showPassword ? (
												<EyeOff className="w-5 h-5" />
											) : (
												<Eye className="w-5 h-5" />
											)}
										</button>
									</div>
								</div>

								{/* Remember & Forgot Password */}
								<div className="flex justify-between items-center pt-2">
									<label className="flex items-center text-sm text-gray-600 cursor-pointer hover:text-gray-700">
										<input type="checkbox" className="mr-2 w-4 h-4 rounded border-gray-300" />
										Lembrar-me
									</label>
									<button
										type="button"
										onClick={forgotPsw}
										className="text-sm text-[#0066cc] hover:text-[#0052a3] font-medium transition-colors cursor-pointer"
									>
										Esqueci a senha
									</button>
								</div>

								{/* Submit Button */}
								<button
									type="submit"
									className="w-full bg-gradient-to-r from-[#0066cc] to-[#0052a3] hover:from-[#0052a3] hover:to-[#003d7a] text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 mt-8 cursor-pointer active:brightness-90"
								>
									<LogIn className="w-5 h-5" />
									Entrar
								</button>
							</form>

							{/* Divider */}
							<div className="my-6 flex items-center gap-4">
								<div className="flex-1 h-px bg-gray-300"></div>
								<span className="text-sm text-gray-500">Novo por aqui?</span>
								<div className="flex-1 h-px bg-gray-300"></div>
							</div>

							{/* Register Links */}
							<div className="space-y-3">
								<Link
									href="/cadastro/lider"
									onClick={() => setLoading(true)}
									className="block w-full py-3 px-4 border-2 border-[#0066cc] text-[#0066cc] font-semibold rounded-lg hover:bg-blue-50 transition-colors text-center"
								>
									Cadastro - Líder do Projeto
								</Link>
								<Link
									href="/cadastro/membro"
									onClick={() => setLoading(true)}
									className="block w-full py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors text-center"
								>
									Cadastro - Membro
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
