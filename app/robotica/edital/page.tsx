import Link from 'next/link';

export default function EditalPage() {
  return (
    <main className="min-h-screen bg-white text-[#0b2f62]">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <Link href="/robotica" className="mb-6 inline-block text-sm font-bold text-[#0d2f60]">← Voltar para a landing</Link>
        <h1 className="mt-4 text-3xl font-black uppercase">EDITAL Nº xxx/2026</h1>
        <h2 className="mt-2 text-xl font-bold">DESAFIO PRÁTICO DE ENGENHARIA E TECNOLOGIA DA INFORMAÇÃO: TRANSFORMAÇÃO DIGITAL EM SERVIÇOS</h2>
        <p className="mt-6 text-sm leading-relaxed">O Centro Universitário Senac, por meio de sua Diretoria Acadêmica, torna pública a abertura das inscrições para o Desafio Prático de Engenharia e Tecnologia da Informação - 9ª edição do Torneio de Robótica, com o tema Transformação Digital em Serviços, de acordo com normas e critérios estabelecidos neste Edital.</p>

        <section className="mt-8">
          <h3 className="text-lg font-bold">DA ATIVIDADE</h3>
          <p className="mt-2 text-sm leading-relaxed">Art. 1º. O Desafio Prático de Engenharia e Tecnologia da Informação: Transformação Digital em Serviços é uma atividade de cunho pedagógico, científico e cultural desenvolvida no âmbito do Projeto de Extensão Torneio de Robótica e também nos componentes curriculares de extensão “Projeto de Fundamentos Tecnológicos I e II – Práticas Extensionistas” dos cursos de Bacharelado em Engenharia da Computação e Bacharelado em Engenharia de Produção do Centro Universitário Senac – Campus Santo Amaro, em parceria com a Coordenação de Pesquisa & Extensão, com o objetivo estimular o uso de tecnologias no processo de ensino-aprendizagem, promovendo a construção de conhecimento, a resolução de problemas e o desenvolvimento da autonomia, competências e habilidades dos estudantes.</p>

          <p className="mt-4 text-sm leading-relaxed">Art. 2º. As atividades do Desafio ocorrerão em fases que compreendem: 1 - Lançamento, Divulgação do Edital, Convite às Escolas e Inscrições; 2 - Definição da ordem de apresentação nas etapas de Seletivas e Eliminatórias; 3 – Capacitação dos Mediadores; 4 – Plantão para Esclarecimento de Dúvidas; 5 - Etapa de Seletivas e Eliminatórias por Arena; 6 – Grande Final por Arena; conforme cronograma presente neste edital.</p>

          <h4 className="mt-4 font-bold">Art. 3º. Modalidades (Arenas)</h4>
          <ul className="mt-2 list-disc pl-6 text-sm leading-relaxed">
            <li><strong>Arena 1 - Guerra Sumô:</strong> Robôs competem para tirar o adversário da arena (DOHYO). Categorias: autônomo e controlado. Podem ser usados sistemas Lego ou componentes comerciais.</li>
            <li className="mt-2"><strong>Arena 2 - Segue Linha:</strong> Desafio de precisão e velocidade seguindo um percurso. Robôs autônomos com sensores.</li>
            <li className="mt-2"><strong>Arena 3 - Superação de Obstáculos:</strong> Percursos com obstáculos, busca por menor tempo e menor número de penalidades.</li>
            <li className="mt-2"><strong>Arena 4 - Robô Dançarino:</strong> Robôs executam movimentos pré-definidos e livres com destaque para criatividade e apresentação.</li>
          </ul>

          <p className="mt-4 text-sm leading-relaxed">Art. 4º. Todas as atividades serão realizadas seguindo as normas do Regulamento do Desafio: 9ª edição do Torneio de Robótica, disponibilizado no site do evento.</p>
        </section>

        <section className="mt-8">
          <h3 className="text-lg font-bold">DA PARTICIPAÇÃO</h3>
          <p className="mt-2 text-sm leading-relaxed">Art. 5º e 6º. Destinado a alunos regularmente matriculados nos cursos de Bacharelado em Engenharia da Computação e Engenharia de Produção (graduação) e a estudantes do Ensino Médio/Técnico das redes pública, privada e Senac SP conforme regras do edital. Inscrições: 11/05 a 11/09/2026.</p>

          <p className="mt-2 text-sm leading-relaxed">Art. 7º a 9º. Seleção será feita pela comissão organizadora; estudantes selecionados receberão capacitação prévia e atuarão em funções de apoio e mentoria conforme cronograma.</p>
        </section>

        <section className="mt-8">
          <h3 className="text-lg font-bold">INSCRIÇÕES E DOCUMENTAÇÃO</h3>
          <p className="mt-2 text-sm leading-relaxed">Art. 16º a 18º. Inscrições realizadas via formulário no período informado; envio obrigatório do Termo de Ciência (Anexo I) assinado pela instituição de origem. Limite de equipes por arena conforme edital.</p>
        </section>

        <section className="mt-8">
          <h3 className="text-lg font-bold">CRONOGRAMA</h3>
          <p className="mt-2 text-sm leading-relaxed">Fase 1: 11/05 a 11/09/2026 (inscrições). Resultado: 18/09/2026. Fase 2: 25/09/2026 (ordem de apresentação). Fase 3: capacitações. Fase 4: plantão de dúvidas 18/09 a 30/10/2026. Fase 5: seletivas 17/10 e 24/10/2026. Fase 6 (Grande final): 05/12/2026.</p>
        </section>

        <section className="mt-8">
          <h3 className="text-lg font-bold">DISPOSIÇÕES FINAIS</h3>
          <p className="mt-2 text-sm leading-relaxed">Responsabilidades, benefícios, tratamento de dados pessoais (LGPD) e outras disposições estão descritas no edital completo. Dúvidas: torneiorobotica@sp.senac.br</p>

          <p className="mt-6 text-sm">São Paulo, 08 de abril de 2026.</p>
        </section>
      </div>
    </main>
  );
}
