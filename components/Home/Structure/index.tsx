import ExternalButton from "@/components/_Global/ExternalButton";
import Paragraph from "../../_Global/Paragraph";
import Subtitle from "../../_Global/Subtitle";
import Title from "../../_Global/Title";
import Image from "next/image";

export default function Structure() {

    const checks = [
        {
            title: "Laboratórios Especializados",
            text: "Laboratórios equipados com o que há de melhor no mercado: Máquinas de corte a laser, Impressoras 3D, Máquinas de Solda, Área de Marcenaria e Usinagem e muito mais."
        },
        {
            title: "Espaço NASA",
            text: "Espaço aberto com computadores de última geração (windows e mac), acesso a internet e inúmeros softwares pagos para uso gratuito."
        },
        {
            title: "Biblioteca",
            text: "3 pisos equipados com salas de estudo, brinquedoteca, sala de música e área de videogame. Acervo extenso com milhares de livros e computadores disponíveis para pesquisa."
        }
    ]

    return (
        <section className="flex justify-center items-center overflow-hidden px-4 py-16 sm:py-20 bg-gradient-to-br from-[#f8f9fa] to-[#eef2f7]">
            <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Conteúdo */}
                <div>
                    <Title>Estrutura de ponta</Title>
                    <p className="text-gray-600 mt-3 mb-10 text-lg">
                        Infraestrutura moderna e equipamentos de última geração para sua formação
                    </p>

                    <div className="flex flex-col gap-8">
                        {checks.map((item, index) => (
                            <div 
                                key={index}
                                className="flex items-start gap-5 p-5 bg-white rounded-lg hover:shadow-lg transition-all duration-300 hover:translate-x-1"
                            >
                                <div className="flex-shrink-0 mt-1">
                                    <Image unoptimized
                                        src="/img/icons/check.svg"
                                        alt="Símbolo de check"
                                        width={28}
                                        height={28}
                                        className="text-[var(--blue)]"
                                    />
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-[var(--blue)] mb-2">
                                        {item.title}
                                    </h3>
                                    <Paragraph className="text-gray-700 leading-relaxed">
                                        {item.text}
                                    </Paragraph>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10">
                        <ExternalButton link="https://www.sp.senac.br/">Saiba mais sobre a infraestrutura</ExternalButton>
                    </div>
                </div>

                {/* Imagem */}
                <div className="relative w-full h-[350px] sm:h-[450px] lg:h-[550px] rounded-2xl overflow-hidden shadow-xl">
                    <Image unoptimized
                        src="/img/pictures/structure.jpg"
                        alt="Foto da estrutura do senac"
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                </div>
            </div>
        </section>
    )
}