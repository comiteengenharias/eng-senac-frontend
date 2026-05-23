'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const COUNTDOWN_TARGET_STORAGE_KEY = 'roboticaCountdownTarget';
const DEFAULT_COUNTDOWN_MS = 24 * 24 * 60 * 60 * 1000;

type CountdownState = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

function getCountdownState(targetDate: Date): CountdownState {
  const diff = Math.max(0, targetDate.getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  };
}

function CountdownBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex min-h-[88px] flex-col items-center justify-center bg-slate-50 px-4 py-4 text-center shadow-sm shadow-slate-200/60">
      <p className="text-3xl font-black tracking-tight text-slate-900">{value}</p>
      <span className="mt-2 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">{label}</span>
    </div>
  );
}

export default function RoboticaLanding() {
  const [countdown, setCountdown] = useState<CountdownState>({
    days: '24',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    const storedTarget = window.localStorage.getItem(COUNTDOWN_TARGET_STORAGE_KEY);
    let targetTimestamp = storedTarget ? Number(storedTarget) : NaN;

    if (!storedTarget || Number.isNaN(targetTimestamp)) {
      targetTimestamp = Date.now() + DEFAULT_COUNTDOWN_MS;
      window.localStorage.setItem(COUNTDOWN_TARGET_STORAGE_KEY, String(targetTimestamp));
    }

    const targetDate = new Date(targetTimestamp);

    const updateCountdown = () => {
      setCountdown(getCountdownState(targetDate));
    };

    updateCountdown();
    const timerId = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f8ff] text-[#0f2348]">
      <header className="bg-white">
        <div className="bg-[#0d3168]">
          <div className="mx-auto max-w-7xl px-4 py-3 text-right text-[10px] uppercase tracking-[0.3em] text-white sm:px-6 lg:px-8">
            INSCRIÇÕES ABERTAS
          </div>
        </div>
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <Link href="/robotica" className="text-lg font-black uppercase tracking-[0.28em] text-[#0f2348]">
                SENAC ROBOTICS
              </Link>

              <nav className="hidden flex-1 items-center justify-center gap-10 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500 md:flex">
                <a href="#torneios" className="transition hover:text-slate-900">Torneios</a>
                <a href="#modalidades" className="transition hover:text-slate-900">Modalidades</a>
                <a href="#knowledge" className="transition hover:text-slate-900">Knowledge Hub</a>
                <a href="#sobre" className="transition hover:text-slate-900">Sobre</a>
              </nav>

              <div className="flex items-center gap-4">
                <Link href="/robotica/login/" className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 transition hover:text-slate-900">
                  LOGIN
                </Link>
                <Link
                  href="/robotica/login/"
                  className="rounded-none bg-[#0d3168] px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_18px_45px_rgba(13,49,104,0.15)] transition hover:bg-[#0f3f7e]"
                >
                  ENTRAR NO PORTAL
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-b from-[#041a5f] via-[#041c66] to-[#041a42] text-white">
        <div className="absolute inset-0">
          <Image
            src="/img/ux/equipe_robotica.jpg"
            alt="Equipe de robótica"
            fill
            className="object-cover opacity-25"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#063e8b89] via-[#041a42cc] to-[#03113f]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-28 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_420px] lg:items-end">
            <div className="max-w-3xl space-y-10">
              <div className="inline-flex items-center gap-3 border border-cyan-300/40 bg-[#0d3168] px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-cyan-100 shadow-sm shadow-cyan-900/20">
                <span className="h-2 w-2 bg-cyan-300" />
                STATUS: INSCRIÇÕES NACIONAIS ABERTAS
              </div>

              <div className="space-y-6">
                <div className="text-[4.5rem] font-black uppercase leading-[0.9] tracking-[-0.08em] text-white sm:text-[5.5rem] lg:text-[6rem]">
                  <span className="block">NOVA</span>
                  <span className="block text-cyan-300">ROBOTICS.</span>
                </div>
                <p className="max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
                  A maior plataforma de inovação e robótica educacional do país. Desenvolvendo os arquitetos da precisão através de desafios de engenharia autônoma.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href="/robotica/login/"
                  className="inline-flex items-center justify-center rounded-none bg-cyan-300 px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#041a42] shadow-[0_24px_60px_rgba(45,212,255,0.18)] transition hover:bg-cyan-200"
                >
                  INSCREVER EQUIPE
                </Link>

                <div className="px-5 py-4 text-sm text-slate-100">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-300">PRÓXIMO MARCO</p>
                  <p className="mt-3 font-black text-white">FINAL NACIONAL: 15.12.2024</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end lg:justify-end">
              <div className="w-full max-w-md rounded-none border border-white/10 bg-white p-6 shadow-[0_28px_80px_rgba(7,18,47,0.18)] backdrop-blur-sm lg:sticky lg:top-[calc(100vh-440px)]">
                <span className="absolute left-0 top-6 h-14 w-1 bg-amber-500" />
                <div className="relative ml-4 space-y-4">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Contagem regressiva</p>
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-2xl font-black uppercase tracking-[-0.04em] text-[#0b2c58]">Torneio de robótica 2026</h2>
                    <div className="text-2xl text-amber-500">⏱</div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-4">
                    <CountdownBox value={countdown.days} label="dias" />
                    <CountdownBox value={countdown.hours} label="hrs" />
                    <CountdownBox value={countdown.minutes} label="min" />
                    <CountdownBox value={countdown.seconds} label="seg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="torneios" className="relative bg-white py-24">
        <span id="knowledge" className="absolute -top-24" />
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.34em] text-[#b97714]">Destaques & Novidades</p>
              <h2 className="mt-3 text-4xl font-black uppercase text-[#0b2f62] sm:text-5xl">AÇÃO EM TEMPO REAL</h2>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-none border border-slate-200 bg-white text-[#0b2f62] shadow-sm transition hover:border-slate-300"
                aria-label="Anterior"
              >
                ←
              </button>
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-none border border-slate-200 bg-white text-[#0b2f62] shadow-sm transition hover:border-slate-300"
                aria-label="Próximo"
              >
                →
              </button>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <article className="group overflow-hidden rounded-none border border-slate-200 bg-slate-950 text-white shadow-[0_24px_80px_rgba(7,18,47,0.18)]">
              <div className="relative h-[520px] overflow-hidden">
                <Image
                  src="/img/robotica/mini_robot.png"
                  alt="Liderança jovem na engenharia"
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-[#041a42]/95" />
                <div className="absolute inset-x-0 bottom-0 px-6 pb-6 pt-8">
                  <span className="inline-flex bg-amber-600 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-white">Educação</span>
                  <h3 className="mt-5 text-2xl font-black uppercase leading-tight text-white">Liderança jovem na engenharia</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-200">
                    Competidores de todo o país aplicam conceitos avançados de eletrônica e programação.
                  </p>
                  <Link href="#" className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-cyan-300 transition hover:text-cyan-100">
                    LEIA MAIS <span aria-hidden>↗</span>
                  </Link>
                </div>
              </div>
            </article>

            <article className="group overflow-hidden rounded-none border border-slate-200 bg-slate-950 text-white shadow-[0_24px_80px_rgba(7,18,47,0.18)]">
              <div className="relative h-[520px] overflow-hidden">
                <Image
                  src="/img/robotica/equipe_robotica2.jpg"
                  alt="O espírito da equipe"
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-[#041a42]/95" />
                <div className="absolute inset-x-0 bottom-0 px-6 pb-6 pt-8">
                  <span className="inline-flex bg-amber-600 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-white">Competição</span>
                  <h3 className="mt-5 text-2xl font-black uppercase leading-tight text-white">O espírito da equipe</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-200">
                    Colaboração e resolução de problemas técnicos sob pressão nas finais regionais.
                  </p>
                  <Link href="#" className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-cyan-300 transition hover:text-cyan-100">
                    LEIA MAIS <span aria-hidden>↗</span>
                  </Link>
                </div>
              </div>
            </article>

            <article className="group overflow-hidden rounded-none border border-slate-200 bg-slate-950 text-white shadow-[0_24px_80px_rgba(7,18,47,0.18)]">
              <div className="relative h-[520px] overflow-hidden">
                <Image
                  src="/img/robotica/sumo-robos.jpg"
                  alt="Protótipos inteligentes"
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-[#041a42]/95" />
                <div className="absolute inset-x-0 bottom-0 px-6 pb-6 pt-8">
                  <span className="inline-flex bg-amber-600 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-white">Inovação</span>
                  <h3 className="mt-5 text-2xl font-black uppercase leading-tight text-white">Protótipos inteligentes</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-200">
                    Nova categoria de veículos autônomos com limites de percepção computacional.
                  </p>
                  <Link href="#" className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-cyan-300 transition hover:text-cyan-100">
                    LEIA MAIS <span aria-hidden>↗</span>
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="modalidades" className="bg-[#eef4ff] py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.34em] text-[#b97714]">Categorias de competição</p>
            <h2 className="mt-3 text-4xl font-black uppercase text-[#0b2f62] sm:text-5xl">Modalidades</h2>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <article className="rounded-none bg-white p-6 shadow-[0_24px_80px_rgba(15,39,98,0.08)]">
              <div className="overflow-hidden border border-slate-200 bg-slate-950">
                <Image src="/img/pictures/robotica-seguidor.jpg" alt="Seguidor de linha" width={1200} height={760} className="h-52 w-full object-cover brightness-[0.95]" />
              </div>
              <h3 className="mt-6 text-xl font-black uppercase text-[#0b2f62]">Seguidor de linha</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">Velocidade e precisão extrema em trajetos complexos com obstáculos dinâmicos.</p>
              <Link href="/robotica/edital" className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#0d3168] transition hover:text-[#0a224f]">
                VER REGRAS <span aria-hidden>📄</span>
              </Link>
            </article>

            <article className="rounded-none bg-white p-6 shadow-[0_24px_80px_rgba(15,39,98,0.08)]">
              <div className="overflow-hidden border border-slate-200 bg-slate-950">
                <Image src="/img/pictures/robotica-sumo.png" alt="Sumô de robôs" width={1200} height={760} className="h-52 w-full object-cover brightness-[0.95]" />
              </div>
              <h3 className="mt-6 text-xl font-black uppercase text-[#0b2f62]">Sumô de robôs</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">Estratégia e força bruta em batalhas épicas para dominar o centro do dojô.</p>
              <Link href="/robotica/edital" className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#0d3168] transition hover:text-[#0a224f]">
                VER REGRAS <span aria-hidden>📄</span>
              </Link>
            </article>

            <article className="rounded-none bg-white p-6 shadow-[0_24px_80px_rgba(15,39,98,0.08)]">
              <div className="overflow-hidden border border-slate-200 bg-slate-950">
                <Image src="/img/pictures/robotica-card1.jpeg" alt="Dançarino" width={1200} height={760} className="h-52 w-full object-cover brightness-[0.95]" />
              </div>
              <h3 className="mt-6 text-xl font-black uppercase text-[#0b2f62]">Dançarino</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">Sincronia, criatividade e performance artística integrando robótica e som.</p>
              <Link href="/robotica/edital" className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#0d3168] transition hover:text-[#0a224f]">
                VER REGRAS <span aria-hidden>📄</span>
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section id="sobre" className="bg-[#eef4ff] py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.45em] text-[#0f3765]">Pronto para o desafio?</p>
            <h2 className="mt-6 text-6xl font-black uppercase leading-[0.9] text-[#0d2142] sm:text-[5.5rem]">
              Sua jornada técnica começa <span className="text-[#0d3168]">aqui.</span>
            </h2>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <article className="relative overflow-hidden rounded-none border border-amber-500 bg-white p-10 shadow-[0_28px_80px_rgba(15,39,98,0.08)]">
              <div className="absolute inset-y-0 left-0 w-2 bg-amber-500" />
              <div className="relative ml-4 space-y-6">
                <p className="text-7xl font-black text-amber-500">01.</p>
                <div>
                  <h3 className="text-2xl font-black uppercase text-[#0b2f62]">Portal do competidor</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Gerencie sua equipe, envie documentação técnica e acompanhe rankings nacionais em tempo real através do dashboard oficial.
                  </p>
                </div>
                <Link
                  href="/robotica/login/"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-none border border-[#0d3168] bg-[#0d3168] px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#0b2c5a]"
                >
                  Entrar no portal
                </Link>
              </div>
            </article>

            <article className="rounded-none bg-[#dbeeff] p-10 shadow-[0_28px_80px_rgba(15,39,98,0.08)]">
              <div className="space-y-6">
                <p className="text-7xl font-black text-[#6b92cb]">02.</p>
                <div>
                  <h3 className="text-2xl font-black uppercase text-[#0b2f62]">Manuais técnicos</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    Baixe as regras oficiais de 2024 e os padrões de certificação exigidos para participação em cada uma das modalidades.
                  </p>
                </div>
                <Link
                  href="/docs/manuals.pdf"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-none border border-[#0d3168] bg-transparent px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-[#0d3168] transition hover:bg-[#0d3168] hover:text-white"
                >
                  Download docs
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <footer className="bg-[#031f43] text-[#b7c6df]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
          <div>
            <p className="text-3xl font-black uppercase tracking-tight text-white">Senac Robotics</p>
            <p className="mt-4 max-w-md text-sm leading-7 text-[#9fb2ce]">
              © 2024 Senac Engineering Committee.
              <br />
              Architecting the future of precision systems.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1f3d65] bg-[#062141] text-2xl font-bold text-[#d6e5fb] transition hover:border-[#2f5689] hover:text-white"
                aria-label="Compartilhar"
              >
                ⤴
              </a>
              <a
                href="mailto:contato@senacrobotics.com"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1f3d65] bg-[#062141] text-2xl font-bold text-[#d6e5fb] transition hover:border-[#2f5689] hover:text-white"
                aria-label="Email"
              >
                ✉
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-white">Campeonato</p>
            <ul className="mt-4 space-y-2 text-sm text-[#b3c4dc]">
              <li><a href="#torneios" className="hover:text-white">Calendário 2024</a></li>
              <li><a href="#modalidades" className="hover:text-white">Regras Gerais</a></li>
              <li><a href="#" className="hover:text-white">Premiações</a></li>
              <li><a href="#" className="hover:text-white">Hall da Fama</a></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-white">Institucional</p>
            <ul className="mt-4 space-y-2 text-sm text-[#b3c4dc]">
              <li><a href="https://www.sp.senac.br" className="hover:text-white">Sobre o SENAC</a></li>
              <li><a href="#" className="hover:text-white">Comitê de Engenharia</a></li>
              <li><a href="#" className="hover:text-white">Transparência</a></li>
              <li><Link href="/robotica/login/" className="hover:text-white">Contato</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-white">Legal</p>
            <ul className="mt-4 space-y-2 text-sm text-[#b3c4dc]">
              <li><a href="#" className="hover:text-white">Privacidade</a></li>
              <li><a href="#" className="hover:text-white">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-white">LGPD</a></li>
              <li><a href="mailto:torneiorobotica@sp.senac.br" className="hover:text-white">torneiorobotica@sp.senac.br</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 px-4 py-5 text-center text-[11px] uppercase tracking-[0.35em] text-[#6a8ab8] sm:px-6 lg:px-8">
          design inspired by precision architect framework v2.4
        </div>
      </footer>
    </main>
  );
}
