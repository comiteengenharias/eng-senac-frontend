
import ExternalButton from "@/components/_Global/ExternalButton";
import Button from "../../_Global/InternalButton";
import Paragraph from "../../_Global/Paragraph";
import Subtitle from "../../_Global/Subtitle";
import Title from "../../_Global/Title";
import Image from "next/image";

export default function Coordinator() {

    return (
        <section className="relative flex flex-col justify-center items-center overflow-hidden px-4 bg-gradient-to-br from-[var(--blue)] to-[#004a99] py-16 sm:py-20">
            <div className="w-full max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
                    {/* Imagem do Coordenador */}
                    <div className="w-full lg:w-1/2 flex justify-center">
                        <div className="relative overflow-hidden rounded-2xl border-6 border-[var(--orange)] min-w-[250px] h-[250px] sm:min-w-[300px] sm:h-[300px] lg:min-w-[360px] lg:h-[400px] shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                            <Image unoptimized
                                src="/img/pictures/coordenador.jpg"
                                alt="Foto do Coordenador Ricardo Luiz Ciuccio"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    </div>

                    {/* Conteúdo */}
                    <div className="w-full lg:w-1/2">
                        <Title>
                            <span className="text-[var(--white)]">Conheça seu</span> <span className="text-[var(--orange)]">Coordenador</span>
                        </Title>
                        <div className="mt-3 mb-6">
                            <p className="text-2xl font-bold text-[var(--white)]">
                                Eng. MSc. <span className="text-[var(--orange)]">Ricardo Luiz Ciuccio</span>
                            </p>
                            <div className="w-12 h-1 bg-[var(--orange)] rounded-full mt-3"></div>
                        </div>

                        <div className="flex flex-col gap-6 mt-8">
                            <Paragraph className="text-gray-100 leading-relaxed">
                                <span className="text-[var(--white)]">Coordenador dos cursos de Engenharia do Centro Universitário Senac Santo Amaro, com vasta experiência em Gerenciamento Industrial e Engenharia de Processos. Engenheiro de Produção, pós-graduado em Engenharia Mecânica, atua com otimização de processos, certificações (ANVISA, BPF, ISO) e metodologias como Lean Manufacturing e Six Sigma.</span>
                            </Paragraph>
                            <Paragraph className="text-gray-100 leading-relaxed">
                                <span className="text-[var(--white)]">Atualmente, além da coordenação, é professor e pesquisador, com experiência no desenvolvimento de novos produtos e processos na indústria, especialmente na área de implantodontia odontológica. Seu foco é preparar os alunos para os desafios do mercado, combinando teoria e prática com inovação tecnológica.</span>
                            </Paragraph>
                        </div>
                        <div className="mt-8">
                            <ExternalButton link="https://www.linkedin.com/in/ciuccio-ricardo-luiz-msc-eng-949bb023/">
                                Encontre-o no LinkedIn
                            </ExternalButton>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    )
}