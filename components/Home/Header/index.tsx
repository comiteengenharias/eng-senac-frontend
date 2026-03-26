'use client';

import Link from 'next/link';
import Image from 'next/image';
import { navItems } from './navItems';
import { useState, useEffect, useRef } from 'react';
import LoadingOverlay from '@/components/system/loading-overlay';

export default function Header() {
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isClickable, setIsClickable] = useState(true);
    const navRef = useRef<HTMLDivElement>(null);

    const handleClick = () => {
        if (!isClickable) return;

        setIsOpen(prev => !prev);
        setIsClickable(false);

        setTimeout(() => {
            setIsClickable(true);
        }, 500);
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };

        // Aplica o estado inicial de acordo com o scroll atual
        handleScroll();

        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                // lógica futura, se necessário
            }
        };

        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    useEffect(() => {
        const updateBodyScroll = () => {
            const isMobile = window.innerWidth < 1280; // xl breakpoint = 1280px

            if (isOpen && isMobile) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        };

        updateBodyScroll(); // aplica na primeira renderização com o estado atual

        window.addEventListener('resize', updateBodyScroll); // atualiza caso redimensione a tela

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('resize', updateBodyScroll);
        };
    }, [isOpen]);



    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                scrolled 
                    ? 'bg-[var(--white)] shadow-md' 
                    : 'bg-[var(--white)]'
            }`}
        >

            <LoadingOverlay active={isLoading} />
            <div className='w-full h-16 px-4 sm:px-6 flex justify-center items-center'>
                <div className='w-full max-w-7xl flex justify-between items-center'>

                    <Link href="/" className="hover:opacity-80 transition-opacity duration-300 flex-shrink-0">
                        <Image unoptimized
                            src="/img/branding/logo-blue.png"
                            alt="Logo dos cursos de engenharia"
                            width={120}
                            height={40}
                            priority
                        />
                    </Link>
                {/* Botão Hamburger */}
                <button
                    className="lg:hidden flex flex-col gap-1 w-8 h-8 justify-center items-center z-50 hover:opacity-70 transition-opacity duration-300 p-0 border-0 bg-transparent cursor-pointer"
                    onClick={handleClick}
                    aria-label="Menu"
                    aria-expanded={isOpen}
                >
                    <div className={`w-6 h-0.5 bg-[var(--blue)] transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-1' : ''}`} />
                    <div className={`w-6 h-0.5 bg-[var(--blue)] transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`} />
                    <div className={`w-6 h-0.5 bg-[var(--blue)] transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </button>
                    {/* Navegação */}
                    <nav
                        ref={navRef}
                        className={`
                            fixed top-16 left-0 h-screen w-full bg-[var(--white)] text-[var(--black)] py-4 px-4 text-sm overflow-y-auto transition-transform duration-300 shadow-lg lg:shadow-none
                            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                            lg:translate-x-0 lg:relative lg:top-0 lg:flex lg:h-auto lg:max-w-none lg:p-0 lg:w-auto lg:bg-transparent lg:overflow-visible lg:items-center lg:shadow-none
                        `}
                    >
                        <ul className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-8 lg:ml-auto w-full lg:w-auto">
                        {navItems.internal.length > 0 ? navItems.internal.map((item, index) => (
                            <li key={index} className="w-full lg:w-auto text-center lg:text-left">
                                <Link 
                                    href={item.route} 
                                    onClick={() => setIsOpen(false)}
                                    className="text-[var(--black)] hover:text-[var(--blue)] transition-colors duration-300 font-medium block py-2 lg:py-0"
                                >
                                    {item.name}
                                </Link>
                            </li>
                        )) : ""}

                        {navItems.external.length > 0 ? navItems.external.map((item, index) => (
                            <li key={index} className="w-full lg:w-auto text-center lg:text-left">
                                <a 
                                    href={item.route} 
                                    target='_blank'
                                    rel="noopener noreferrer"
                                    className="text-[var(--black)] hover:text-[var(--blue)] transition-colors duration-300 font-medium block py-2 lg:py-0"
                                >
                                    {item.name}
                                </a>
                            </li>
                        )) : ""}

                        <li onClick={() => setIsLoading(true)} className="w-full lg:w-auto flex justify-center lg:justify-start">
                            <Link 
                                href="/area-restrita" 
                                className={`bg-[var(--blue)] hover:bg-[#0052a3] transition-all duration-300 px-3 py-1.5 lg:px-6 lg:py-2 flex items-center gap-1.5 rounded-md text-[var(--white)] font-medium text-xs lg:text-sm shadow-md hover:shadow-lg whitespace-nowrap`}
                            >
                                <Image unoptimized
                                    src="/img/icons/lock.svg"
                                    alt="Ícone de cadeado"
                                    width={14}
                                    height={18}
                                    className={`invert transition-all duration-300`}
                                    priority
                                />
                                <span className={`text-[var(--white)] transition-all duration-300`}>Área restrita</span>
                            </Link>
                        </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
}
