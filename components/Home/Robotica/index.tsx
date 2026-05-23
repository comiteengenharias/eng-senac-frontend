'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type CountdownState = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

const finalDate = new Date('2026-12-05T09:00:00-03:00');

function getCountdownState(): CountdownState {
  const diff = Math.max(0, finalDate.getTime() - Date.now());
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
    <div className="flex min-h-20 flex-col items-center justify-center rounded-sm bg-[#eaf2ff] px-2 py-3 text-center sm:min-h-24 sm:px-3 sm:py-4">
      <p className="text-lg font-black leading-none sm:text-xl md:text-2xl">{value}</p>
      <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-[#6d7f9a] sm:text-[10px]">{label}</p>
    </div>
  );
}

export default function RoboticsHomePage() {
  const [countdown, setCountdown] = useState<CountdownState>({ days: '00', hours: '00', minutes: '00', seconds: '00' });

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setCountdown(getCountdownState());
    }, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  return (
    <main className="min-h-screen bg-[#f4f7fc] text-[#032048]">
      <header className="sticky top-0 z-20 border-b border-[#194272] bg-[#0a2f5f] text-white/85">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-8 text-xs font-semibold uppercase tracking-[0.22em]">
            <span className="text-[#7be8ff]">Torneio de Robótica · 9ª edição</span>
            <nav className="hidden gap-7 text-white/70 md:flex">
              <a href="#torneios" className="hover:text-white">Torneios</a>
              <a href="#modalidades" className="hover:text-white">Modalidades</a>
              <a href="#cronograma" className="hover:text-white">Cronograma</a>
              <a href="/robotica/edital" className="hover:text-white">Edital</a>
              <a href="#footer" className="hover:text-white">Contato</a>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.15em]">
            <Link href="/robotica/login/" className="rounded-sm border border-[#58cfff] bg-[#0d2f5e] px-4 py-2 text-[#e8fdff] transition hover:bg-[#10396f]">Entrar no portal</Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b-2 border-[#173b6e]">
        <Image
          src="/img/ux/equipe_robotica.jpg"
          alt="Equipe de robótica"
          width={1920}
          height={1080}
          className="h-[620px] w-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c2f5fd9] via-[#0c2f5fd0] to-[#0c2f5fa6]" />
        <div className="absolute inset-0 mx-auto grid h-full w-full max-w-7xl items-end px-4 pb-12 pt-16 lg:grid-cols-[1fr_340px] lg:items-center lg:px-8">
          <div>
            <p className="mb-6 inline-block border border-[#26d2ff]/60 bg-[#084f7a]/30 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.34em] text-[#6ce7ff]">
              Status: inscrições abertas
            </p>
            <div className="text-[4.5rem] font-black uppercase leading-[0.9] tracking-[-0.08em] text-white sm:text-[5.5rem] md:text-[6rem]">
              <span className="block">NOVA</span>
              <span className="block text-[#22e1ff]">ROBOTICS.</span>
            </div>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
              A maior plataforma de inovação e robótica educacional do país. Desenvolvendo os arquitetos da precisão através de desafios de engenharia autônoma.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/robotica/login/" className="inline-flex items-center justify-center gap-3 bg-[#14d9ff] px-8 py-4 text-sm font-extrabold uppercase tracking-[0.18em] text-[#052452] transition hover:bg-[#34e4ff]">
                Inscrever equipe
                <span aria-hidden className="text-2xl leading-none">⤴</span>
              </Link>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">Inscrições: 11/05 a 11/09/2026</p>
            </div>
          </div>

          <div className="mt-10 w-full rounded-sm border-l-2 border-[#ca8e47] bg-white p-4 shadow-[0_22px_60px_rgba(3,15,35,0.3)] sm:p-6 lg:mt-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#b6bfd1]">Contagem regressiva</p>
            <h2 className="mt-2 text-xl font-black uppercase leading-tight text-[#0d2d58] sm:text-2xl lg:text-3xl">
              Torneio de Robótica 2026
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-2 text-center sm:grid-cols-4 sm:gap-3">
              <CountdownBox value={countdown.days} label="dias" />
              <CountdownBox value={countdown.hours} label="hrs" />
              <CountdownBox value={countdown.minutes} label="min" />
              <CountdownBox value={countdown.seconds} label="seg" />
            </div>
          </div>
        </div>
      </section>

      <section id="torneios" className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="mb-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#c48e4f]">Destaques nacionais</p>
            <h2 className="mt-2 text-3xl font-black uppercase text-[#0b2f62] sm:text-5xl">Ação em tempo real</h2>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <article className="relative overflow-hidden border border-[#d4dfef] bg-[#092a55] text-white">
            <Image src="/img/pictures/robotica-card1.jpeg" alt="Dançarino" width={900} height={700} className="h-80 w-full object-cover opacity-80" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#08274dcc] to-transparent p-5">
              <p className="mb-2 inline-block bg-[#d69744] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">Arena 4</p>
              <h3 className="text-3xl font-black uppercase leading-tight">Robô Dançarino</h3>
              <p className="mt-2 text-sm text-white/85">Movimentos pré-definidos e livres, com foco em criatividade, design e programação.</p>
            </div>
          </article>

          <article className="relative overflow-hidden border border-[#d4dfef] bg-[#092a55] text-white">
            <Image src="/img/pictures/robotica-card2.jpeg" alt="Protótipos inteligentes" width={900} height={700} className="h-80 w-full object-cover opacity-85" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#08274dcc] to-transparent p-5">
              <p className="mb-2 inline-block bg-[#d69744] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">Arena 3</p>
              <h3 className="text-3xl font-black uppercase leading-tight">Superação de Obstáculos</h3>
              <p className="mt-2 text-sm text-white/85">Percurso autônomo com sensores, penalidades e disputa por menor tempo de execução.</p>
            </div>
          </article>

          <article className="relative overflow-hidden border border-[#d4dfef] bg-[#092a55] text-white">
            <Image src="/img/pictures/robotica-card3.jpeg" alt="O espírito da equipe" width={900} height={700} className="h-80 w-full object-cover opacity-80" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#08274dcc] to-transparent p-5">
              <p className="mb-2 inline-block bg-[#d69744] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">Competição</p>
              <h3 className="text-3xl font-black uppercase leading-tight">O espírito da equipe</h3>
              <p className="mt-2 text-sm text-white/85">Colaboração e resolução de problemas técnicos sob pressão nas finais regionais.</p>
            </div>
          </article>
        </div>
      </section>

      <section id="modalidades" className="border-y-2 border-[#d8e1ef] bg-[#e8edf6] py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.34em] text-[#c48e4f]">Categorias de competição</p>
          <h2 className="mt-2 text-center text-3xl font-black uppercase text-[#0b2f62] sm:text-5xl">Modalidades</h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <article className="bg-white p-5">
              <Image src="/img/pictures/robotica-sumo.png" alt="Sumô" width={700} height={420} className="h-44 w-full object-cover grayscale" />
              <h3 className="mt-5 text-2xl font-black uppercase text-[#0e2f5b]">Arena 1 · Guerra Sumô</h3>
              <p className="mt-2 text-sm text-[#5c6f8c]">Combate em arena circular (dohyo), com estratégia e controle de deslocamento do adversário.</p>
            </article>

            <article className="bg-white p-5">
              <Image src="/img/pictures/robotica-seguidor.jpg" alt="Seguidor de linha" width={700} height={420} className="h-44 w-full object-cover grayscale" />
              <h3 className="mt-5 text-2xl font-black uppercase text-[#0e2f5b]">Arena 2 · Segue Linha</h3>
              <p className="mt-2 text-sm text-[#5c6f8c]">Desafio de precisão e velocidade para completar o trajeto no menor tempo possível.</p>
            </article>

            <article className="bg-white p-5">
              <Image src="/img/pictures/robotica-card2.jpeg" alt="O espírito da equipe" width={700} height={420} className="h-44 w-full object-cover grayscale" />
              <h3 className="mt-5 text-2xl font-black uppercase text-[#0e2f5b]">Arena 3 · Superação</h3>
              <p className="mt-2 text-sm text-[#5c6f8c]">Robôs autônomos com sensores para transpor obstáculos com menor número de penalidades.</p>
            </article>

            <article className="bg-white p-5">
              <Image src="/img/pictures/robotica-card1.jpeg" alt="Arena Robô Dançarino" width={700} height={420} className="h-44 w-full object-cover grayscale" />
              <h3 className="mt-5 text-2xl font-black uppercase text-[#0e2f5b]">Arena 4 · Dançarino</h3>
              <p className="mt-2 text-sm text-[#5c6f8c]">Coreografias técnicas com liberdade criativa, design do robô e apresentação artística.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="hub" className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.34em] text-[#6a7ea0]">Participação e inscrições</p>
        <h2 className="mt-3 text-center text-4xl font-black uppercase leading-none text-[#061d3b] sm:text-6xl md:text-8xl">
          Regras principais
          <br />
          da <span className="italic text-[#1f4f8f]">edição 2026.</span>
        </h2>

        <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-2">
          <article className="border-l-2 border-[#c48e4f] bg-white p-8 shadow-[0_18px_36px_rgba(6,29,59,0.08)]">
            <p className="text-5xl font-black text-[#ad6f31]">01.</p>
            <h3 className="mt-3 text-2xl font-black uppercase text-[#0e2f5b]">Quem pode participar</h3>
            <p className="mt-3 text-sm text-[#667997]">Competidores do Ensino Médio/Técnico (rede pública, privada e Senac SP) em equipes de 2 a 4 estudantes com um mediador maior de 18 anos.</p>
            <Link href="/robotica/login/" className="mt-6 inline-block bg-[#0d2f60] px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:bg-[#123b76]">
              Entrar no portal
            </Link>
          </article>

          <article className="bg-[#dcebff] p-8">
            <p className="text-5xl font-black text-[#7fa1d3]">02.</p>
            <h3 className="mt-3 text-2xl font-black uppercase text-[#0e2f5b]">Inscrição e documentação</h3>
            <p className="mt-3 text-sm text-[#4f6690]">Inscrições de 11/05 a 11/09/2026, com envio obrigatório do Termo de Ciência (Anexo I) assinado pela instituição de origem.</p>
            <a href="/docs/manuals.pdf" className="mt-6 inline-block border border-[#6283b0] px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-[#264b7a] transition hover:bg-[#c7ddfb]">
              Ler regulamento
            </a>
          </article>
        </div>
      </section>

      <section id="cronograma" className="border-t-2 border-b-2 border-[#d8e1ef] bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.34em] text-[#c48e4f]">Cronograma geral</p>
          <h2 className="mt-2 text-center text-3xl font-black uppercase text-[#0b2f62] sm:text-5xl">Fases do edital</h2>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <article className="border border-[#d4dfef] bg-[#f7faff] p-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0e2f5b]">Fase 1</p>
              <p className="mt-2 text-sm text-[#4f6690]">Sorteio da ordem de apresentação das equipes: 25/09/2026 (Microsoft Teams).</p>
            </article>
            <article className="border border-[#d4dfef] bg-[#f7faff] p-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0e2f5b]">Fase 2</p>
              <p className="mt-2 text-sm text-[#4f6690]">Capacitação de mediadores e equipes de apoio conforme calendário da organização.</p>
            </article>
            <article className="border border-[#d4dfef] bg-[#f7faff] p-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0e2f5b]">Fase 3</p>
              <p className="mt-2 text-sm text-[#4f6690]">Plantão de dúvidas: 18/09 a 30/10/2026 com suporte da comissão organizadora.</p>
            </article>
            <article className="border border-[#d4dfef] bg-[#f7faff] p-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0e2f5b]">Fase 4</p>
              <p className="mt-2 text-sm text-[#4f6690]">Seletivas e eliminatórias por arena: 17/10 e 24/10/2026, das 9h às 16h.</p>
            </article>
            <article className="border border-[#d4dfef] bg-[#f7faff] p-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0e2f5b]">Fase 5</p>
              <p className="mt-2 text-sm text-[#4f6690]">Grande final por arena: 05/12/2026, das 9h às 16h, com as melhores equipes.</p>
            </article>
          </div>
        </div>
      </section>

      <footer id="footer" className="bg-[#031f43] text-[#a6b9d4]">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-10 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
          <div>
            <p className="text-4xl font-black uppercase tracking-tight text-white md:text-3xl">Senac Robotics</p>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-[#9fb2ce] md:text-sm">
              © 2024 Senac Engineering Committee.
              <br />
              Architecting the future of precision systems.
            </p>
            <div className="mt-6 flex gap-3">
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
              <li><a href="#cronograma" className="hover:text-white">Calendário 2026</a></li>
              <li><a href="#modalidades" className="hover:text-white">Regras Gerais</a></li>
              <li><a href="#hub" className="hover:text-white">Premiações</a></li>
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
              <li><a href="mailto:torneiorobotica@sp.senac.br" className="hover:text-white">torneiorobotica@sp.senac.br</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </main>
  );
}
