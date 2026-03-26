
import Image from "next/image";
import ExternalButton from "@/components/_Global/ExternalButton";

export default function Break() {
    return (
        <section className="flex flex-col justify-center items-center overflow-hidden bg-gradient-to-b from-white to-[#f8f9fa]">
            {/* Imagem */}
            <div className="relative w-full h-[250px] sm:h-[350px] lg:h-[420px] overflow-hidden">
                <Image unoptimized
                    src="/img/pictures/picture_senac_engineer02.jpg"
                    alt="Estrutura e alunos do Senac"
                    fill
                    className="object-cover object-bottom hover:scale-105 transition-transform duration-500"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </div>

            {/* CTA Section */}
            <div className="w-full max-w-7xl px-4 py-12 sm:py-16 flex flex-col items-center justify-center text-center">
                <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--black)] mb-3 sm:mb-6'>
                    Venha fazer Engenharia no <span className="text-[var(--orange)]">Senac</span>
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl">
                    Iniciar sua jornada como engenheiro em uma instituição que combina excelência acadêmica com inovação tecnológica
                </p>
                <ExternalButton link="https://www.sp.senac.br/graduacao#bacharelado">
                    Quero fazer Engenharia no Senac
                </ExternalButton>
            </div>
        </section>
    )
}