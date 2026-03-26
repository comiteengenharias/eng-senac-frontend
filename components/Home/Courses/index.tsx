import Subtitle from "../../_Global/Subtitle";
import Paragraph from "../../_Global/Paragraph";
import Title from "../../_Global/Title";
import Image from "next/image";
import ExternalButton from "@/components/_Global/ExternalButton";

export default function Courses() {

    const coursesInfo = [
        {
            banner: "/img/pictures/computacao_banner.webp",
            altBanner: "Banner do curso de Engenharia de Computação",
            title: "Engenharia de Computação",
            text: [
                "Este curso é para você que se interessa pelo universo dos hardwares, softwares, big data, internet das coisas (IoT), inteligência artificial, computação em nuvem e indústria 4.0.",
                "Você aprenderá de forma prática e dinâmica com uma formação conectada às inovações do mercado e com projetos multidisciplinares para conhecer e aprofundar conhecimentos e habilidades nesta profissão."
            ],
            link: "https://www.sp.senac.br/graduacao/bacharelado-em-engenharia-de-computacao"
        },
        {
            banner: "/img/pictures/producao_banner.webp",
            altBanner: "Banner do curso de Engenharia de Produção",
            title: "Engenharia de Produção",
            text: [
                "Apresenta as inovações do mercado com foco em setores como indústria 4.0, internet das coisas (IoT), cloud, simulação computacional, robótica e automação.",
                "Você irá se preparar para construir uma carreira dinâmica, empreendedora, atuando com responsabilidade socioambiental na melhoria de processos produtivos de bens e serviços, em diferentes segmentos."
            ],
            link: "https://www.sp.senac.br/graduacao/bacharelado-em-engenharia-de-producao"
        }
    ]

    return (
        <section className="flex justify-center items-center px-4 py-16 sm:py-20 bg-gradient-to-br from-[#f8f9fa] to-[#eef2f7]">
            <div className="w-full max-w-7xl">
                <div className="mb-12 sm:mb-16">
                    <Title>Cursos de Graduação</Title>
                    <p className="text-gray-600 mt-3 text-lg">Conheça nossos programas de engenharia desenvolvidos com excelência</p>
                </div>

                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {coursesInfo.map((course, index) => (
                        <div 
                            key={index}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            {/* Imagem do curso */}
                            <div className="relative w-full h-[220px] sm:h-[280px] overflow-hidden">
                                <Image unoptimized
                                    src={course.banner}
                                    alt={course.altBanner}
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-0 right-0 bg-[var(--blue)] text-white px-4 py-2 text-xs font-semibold rounded-bl-lg">
                                    GRADUAÇÃO
                                </div>
                            </div>

                            {/* Conteúdo */}
                            <div className="p-6 sm:p-8">
                                <p className="text-xs font-semibold text-[var(--blue)] uppercase tracking-wider mb-3">
                                    Bacharelado • 5 anos
                                </p>

                                <Subtitle className="text-[var(--blue)] mb-4">{course.title}</Subtitle>
                                
                                <div className="flex flex-col gap-4 mb-6">
                                    {course.text.map((text, idx) => (
                                        <Paragraph key={idx} className="text-gray-700 leading-relaxed">
                                            {text}
                                        </Paragraph>
                                    ))}
                                </div>

                                <ExternalButton link={course.link}>
                                    Conheça o curso completo
                                </ExternalButton>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}