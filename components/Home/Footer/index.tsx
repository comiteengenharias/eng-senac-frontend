import { navItems } from "../Header/navItems";
import Image from "next/image";
import Link from "next/link";

export default function Depoiments() {
    const footerNavItems = [...navItems.internal, ...navItems.external];

    const footerItems = [
        {
            title: "Acesso rápido",
            subitems: [
                ...footerNavItems,
                { route: '/', name: 'Área restrita' }
            ],
            isExternal: true
        },
        {
            title: "Comitê",
            subitems: [
                { route: '/', name: 'Sobre o comitê' },
                { route: '/', name: 'Membros' },
                { route: '/', name: 'Quero participar' },
                { route: '/', name: 'Preciso de ajuda' }
            ],
            isExternal: false
        },
        {
            title: "Senac",
            subitems: [
                { route: 'https://www.sp.senac.br', name: 'Site oficial' },
                { route: 'https://www.sp.senac.br/bolsas-de-estudo', name: 'Bolsas de estudo' },
                { route: 'https://www.sp.senac.br/descontos-e-parcelamentos/graduacao', name: 'Descontos e parcelamento' },
                { route: 'https://blog.sp.senac.br', name: 'Blog' },
                { route: 'https://www.contatoseguro.com.br/senacsp', name: 'Canal de denúncias' }
            ],
            isExternal: true
        }
    ];

    return (
        <footer className="w-full px-4 py-16 sm:py-20 flex flex-col items-center justify-center bg-gradient-to-b from-[#1a1a1a] to-[var(--black)] text-sm border-t border-gray-800">
            <div className="w-full max-w-7xl">
                {/* Divisor */}
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-12"></div>

                {/* Links Footer */}
                <div className="w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-16">
                    {footerItems.map((footerItem, index) => (
                        <div key={index} className="flex flex-col">
                            <h4 className="font-bold text-[var(--white)] mb-4 text-sm uppercase tracking-wider">{footerItem.title}</h4>
                            <ul className="flex flex-col gap-3">
                                {footerItem.subitems.map((item, subIndex) => (
                                    <li key={subIndex} className="text-gray-400 hover:text-[var(--orange)] transition-colors duration-300">
                                        {footerItem.isExternal ? (
                                            <a
                                                href={item.route}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-block w-full"
                                            >
                                                {item.name}
                                            </a>
                                        ) : (
                                            <Link href={item.route} className="inline-block w-full">
                                                {item.name}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Informações de Contato */}
                    <div className="flex flex-col">
                        <h4 className="font-bold text-[var(--white)] mb-4 text-sm uppercase tracking-wider">Unidade Santo Amaro</h4>
                        <ul className="flex flex-col gap-3">
                            <li className="text-gray-400 text-xs sm:text-sm">Av. Eng. Eusébio Stevaux, 823</li>
                            <li className="text-gray-400 text-xs sm:text-sm">Santo Amaro - São Paulo</li>
                            <li className="text-gray-400 text-xs sm:text-sm">15min da estação Jurubatuba</li>
                        </ul>
                    </div>
                </div>

                {/* Divisor */}
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-12"></div>

                {/* Bottom Footer */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
                    {/* Logo e Copyright */}
                    <div className="flex flex-col sm:flex-row lg:items-center gap-4 items-center">
                        <Image unoptimized
                            src="/img/branding/logo-white.png"
                            alt="Logo dos cursos de Engenharia do Senac"
                            width={100}
                            height={30}
                            className="hover:opacity-80 transition-opacity duration-300"
                        />
                        <p className="text-gray-500 text-xs">
                            © 2025 Engenharias Senac. Todos os direitos reservados.
                        </p>
                    </div>

                    {/* Redes Sociais */}
                    <div className="flex gap-6">
                        <a 
                            href="#" 
                            className="text-gray-400 hover:text-[var(--orange)] transition-colors duration-300"
                            aria-label="Instagram"
                        >
                            <Image unoptimized
                                src="/img/icons/insta.png"
                                alt="Logo do instagram"
                                width={18}
                                height={18}
                                className="invert opacity-70 hover:opacity-100 transition-opacity duration-300"
                            />
                        </a>
                        <a 
                            href="#" 
                            className="text-gray-400 hover:text-[var(--orange)] transition-colors duration-300"
                            aria-label="Facebook"
                        >
                            <Image unoptimized
                                src="/img/icons/facebook.png"
                                alt="Logo do facebook"
                                width={18}
                                height={18}
                                className="invert opacity-70 hover:opacity-100 transition-opacity duration-300"
                            />
                        </a>
                        <a 
                            href="#" 
                            className="text-gray-400 hover:text-[var(--orange)] transition-colors duration-300"
                            aria-label="YouTube"
                        >
                            <Image unoptimized
                                src="/img/icons/yt.png"
                                alt="Logo do youtube"
                                width={18}
                                height={18}
                                className="invert opacity-70 hover:opacity-100 transition-opacity duration-300"
                            />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
