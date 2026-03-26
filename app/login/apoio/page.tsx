'use client'

import Image from "next/image";
import Swal from 'sweetalert2'
import { loginSupport, verifyLogin } from "@/services/api-login";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingOverlay from '@/components/system/loading-overlay';
import { Lock, Eye, EyeOff, LogIn } from 'lucide-react';

export default function LoginApoio() {
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

		const password = formData.get('password') as string;

		if (password == null || password == "") {
			setLoading(false)
			Swal.fire({
				title: 'Campo obrigatório',
				text: `Por favor, preencha a senha`,
				icon: 'warning',
				confirmButtonText: 'Ok',
				confirmButtonColor: '#0066cc'
			});
			return;
		}

		try {
			const response = await loginSupport(password);

			if (response.status == 200)
				router.push('/area-restrita/apoio');
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

	return (
		<div>
			<LoadingOverlay active={loading} />
			<div className="h-screen bg-gradient-to-br from-[#f5f7fa] to-[#eef2f7] flex items-center justify-center px-4 py-6 overflow-hidden">
				<div className="w-full max-w-sm max-h-[calc(100vh-3rem)]">
					{/* Card */}
					<div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-fit max-h-[calc(100vh-3rem)]">
						{/* Header com Gradient */}
						<div className="bg-gradient-to-r from-slate-400 to-slate-600 px-6 sm:px-8 py-6 sm:py-8 text-center shrink-0">
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
							<h1 className="text-white text-2xl sm:text-3xl font-bold mb-2">Acesso de Apoio</h1>
							<p className="text-blue-100 text-sm">Gerenciamento do evento</p>
						</div>

						{/* Form Container */}
						<div className="px-6 sm:px-8 py-6 sm:py-8 overflow-y-auto flex-1">
							<form id="login-form" onSubmit={sendData} className="space-y-5">
								{/* Password Field */}
								<div>
									<label htmlFor="input-password" className="block text-sm font-semibold text-gray-700 mb-2">
										Senha de Acesso
									</label>
									<div className="relative">
										<Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
										<input
											type={showPassword ? "text" : "password"}
											name="password"
											id="input-password"
											placeholder="••••••••"
											className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
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

								{/* Submit Button */}
								<button
									type="submit"
									className="w-full bg-gradient-to-r from-slate-400 to-slate-600 hover:from-slate-500 hover:to-slate-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 mt-8 cursor-pointer active:brightness-90"
								>
									<LogIn className="w-5 h-5" />
									Entrar
								</button>
							</form>

							{/* Info Box */}
							<div className="mt-8 p-4 bg-slate-50 border-l-4 border-slate-500 rounded">
								<p className="text-sm text-gray-700">
									<span className="font-semibold">Acesso restrito:</span> Apenas para membros do Comitê das Engenharias Senac.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
