'use client'

import Footer from "@/components/Home/Footer";
import Header from "@/components/Home/Header";
import LoadingOverlay from "@/components/system/loading-overlay";
import { verifyLogin } from "@/services/api-login";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LogIn, Users, BookOpen, Shield } from "lucide-react";

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
        setLoading(false)
      }
    })();
  }, [router]);

  const accessOptions = [
    {
      icon: Users,
      title: 'Aluno',
      description: 'Acesse seu perfil, projeto e avaliações',
      link: '/login/aluno',
      color: 'from-[#0066cc] to-[#0052a3]'
    },
    {
      icon: BookOpen,
      title: 'Professor',
      description: 'Avalie os projetos, acesse as notas e ranking',
      link: '/login/professor',
      color: 'from-orange-400 to-orange-600'
    },
    {
      icon: Shield,
      title: 'Apoio',
      description: 'Painel de gerenciamento do evento',
      link: '/login/apoio',
      color: 'from-slate-400 to-slate-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <LoadingOverlay active={loading} />
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16 mt-20">
        <div className="w-full max-w-5xl">
          {/* Header Section */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
              Bem-vindo ao Sistema de Engenharias
            </h1>
            <p className="text-lg sm:text-xl text-gray-600">
              Selecione sua área de acesso para continuar
            </p>
          </div>

          {/* Access Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {accessOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <Link
                  key={index}
                  href={option.link}
                  onClick={() => setLoading(true)}
                  className="group"
                >
                  <div className="h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-transparent">
                    {/* Icon Background */}
                    <div className={`bg-gradient-to-br ${option.color} p-8 text-white flex items-center justify-center h-40`}>
                      <Icon className="w-16 h-16 opacity-90" />
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-8">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#0066cc] transition-colors">
                        {option.title}
                      </h2>
                      <p className="text-gray-600 text-sm sm:text-base mb-6">
                        {option.description}
                      </p>

                      {/* Button */}
                      <div className="flex items-center gap-2 text-[#0066cc] font-semibold group-hover:gap-3 transition-all">
                        <span>Acessar</span>
                        <LogIn className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
