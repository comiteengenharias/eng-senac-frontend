import Button from "../../_Global/InternalButton";
import Paragraph from "../../_Global/Paragraph";
import Subtitle from "../../_Global/Subtitle";
import Image from "next/image";
import Title from "../../_Global/Title";
import InternalButton from "../../_Global/InternalButton";

export default function Projects() {

    const projects = [
        {
            title: "Carrinho Autônomo",
            text: [
                "Alunos do 2º semestre desenvolveram um carrinho autônomo com sensores ultrassônicos para competir na RoboCar Race. O projeto garantiu o título nas três categorias (Mini, Júnior e Master), superando equipes da FEI e Unicamp.",
                "Equipado com sensores ultrassônicos, o carrinho navegava de forma autônoma, desviando de obstáculos e ajustando sua rota com precisão. O desempenho superior foi resultado de um sistema de controle otimizado e algoritmos eficientes."
            ],
            img: "/img/projects/robocar01.jpg"
        },

        {
            title: "Produção de Cerveja",
            text: [
                "Alunos do 4º semestre desenvolveram um sensor de temperatura focado em automatização no processo industrial de fabricação de cerveja.",
                "Para aplicação do projeto em um cenário real, com o auxílio de mestres cervejeiros, os alunos utilizaram o equipamento para fabricar sua própria cerveja."
            ],
            img: "/img/projects/cerveja.jpg"
        }
    ]

    return (
        <section className="flex flex-col justify-center items-center overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-[#F7941E] via-[#E67E22] to-[#D35400] w-full py-12 sm:py-16 px-4 sm:px-6 shadow-lg">
                <div className="max-w-7xl mx-auto text-[var(--white)]">
                    <h2 className='font-bold text-3xl sm:text-4xl lg:text-5xl mb-3'>Ensino Orientado a Projetos</h2>
                    <p className='text-lg sm:text-xl opacity-90'>Coloque a mão na massa desde o início</p>
                </div>
            </div>

            {/* Projetos */}
            <div className="w-full px-4 py-16 sm:py-20 bg-gradient-to-br from-[#ffffff] to-[#f8f9fa]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16">
                        <Title>Projetos dos alunos</Title>
                        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">Veja exemplos reais de projetos desenvolvidos por nossos alunos que conquistaram prêmios e reconhecimento no mercado</p>
                    </div>

                    <div className="flex flex-col gap-16 sm:gap-20">
                        {projects.map((project, index) => (
                            <div 
                                key={index}
                                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center justify-between gap-8 lg:gap-12`}
                            >
                                {/* Imagem */}
                                <div className="w-full lg:w-1/2">
                                    <div className="relative w-full h-[280px] sm:h-[380px] lg:h-[320px] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                                        <Image unoptimized
                                            src={project.img}
                                            alt={project.title}
                                            fill
                                            className="object-cover hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                </div>

                                {/* Conteúdo */}
                                <div className="w-full lg:w-1/2">
                                    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                                        <div className="inline-block bg-[#F7941E] text-white px-4 py-2 rounded-lg text-xs font-bold mb-4">
                                            PROJETO DESTAQUE
                                        </div>
                                        <Subtitle className="text-[var(--blue)] mb-4">{project.title}</Subtitle>
                                        <div className="flex flex-col gap-4">
                                            {project.text.map((text, idx) => (
                                                <Paragraph key={idx} className="text-gray-700 leading-relaxed">
                                                    {text}
                                                </Paragraph>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

    );
}
