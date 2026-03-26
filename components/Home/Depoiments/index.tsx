import Paragraph from "../../_Global/Paragraph";
import Subtitle from "../../_Global/Subtitle";
import Title from "../../_Global/Title";
import Image from "next/image";

export default function Depoiments() {

    const stars = [
        0, 1, 2, 3, 4
    ]

    return (
        <section className="w-full px-4 py-20 flex flex-col items-center justify-center">
            <div className="w-full max-w-[1280px] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                    <Title><span className="text-[var(--orange)]">Engenharia</span> é no <span className="text-[var(--orange)]">Senac</span>. Quem faz, aprova!</Title>
                    <Subtitle><span className="text-[var(--text)]">Veja o que nossos engenheiros formados dizem sobre o Senac</span></Subtitle>
                </div>
                <div>
                    <div>
                        <div className="border-2 border-[var(--orange)] rounded-lg pt-4 pb-8 px-8 relative">
                            <div className="absolute top-[-14px] left-6 bg-[var(--white)] px-2 text-xl">Fulano da Silva</div>
                            <p className="text-xs mt-2 mb-2 opacity-50">Eng. de Computação - Formado em 2023</p>
                            <div className="flex gap-2 mt-4 mb-6">
                                {stars.map((star, index) => (
                                    <Image unoptimized
                                        key={index}
                                        src="/img/icons/star.png"
                                        alt="Ícone de estrela"
                                        width={25}
                                        height={25}
                                    />
                                ))}
                            </div>
                            <Paragraph>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Consequuntur magnam doloribus odio minus! Animi dolorum eligendi cumque architecto nulla dolore cum corrupti, aperiam alias quae ipsa ad minima maiores dignissimos?</Paragraph>
                        </div>

                        
                    </div>
                    <div className="w-full flex justify-center gap-2 mt-4">
                        <div className="w-2 h-2 border-2 border-[var(--orange)] rounded-full cursor-pointer"></div>
                        <div className="w-2 h-2 border-2 border-[var(--text)] rounded-full cursor-pointer"></div>
                        <div className="w-2 h-2 border-2 border-[var(--text)] rounded-full cursor-pointer"></div>
                    </div>
                </div>
            </div>
        </section>
    )
}