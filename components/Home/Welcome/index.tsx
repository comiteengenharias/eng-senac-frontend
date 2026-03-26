import ExternalButton from "@/components/_Global/ExternalButton";

export default function Welcome() {
    return (
        <section className="relative h-screen max-h-[750px] min-h-[400px] w-full bg-[url('/img/pictures/picture_senac_engineer01.jpg')] bg-cover bg-center flex justify-center items-center pt-12 px-4">
            
            {/* sombra azul */}
            <div className="absolute inset-0 bg-[linear-gradient(40deg,_rgba(12,20,69,.9)_60%,_transparent_120%)] lg:bg-[linear-gradient(110deg,_rgba(12,20,69,1)_30%,_transparent_100%)]"></div>

            {/* conteúdo */}
            <div className="relative z-10 py-20 text-white w-full max-w-[1280px]">
                <p className="uppercase text-xl text-[var(--white)] tracking-wide text-[#00b3e3] mb-3">Senac Santo Amaro</p>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                    CURSOS DE <span className="text-[var(--orange)] drop-shadow">ENGENHARIA</span><br />
                    COM NOTA MÁXIMA DO MEC
                </h1>
                <p className="mt-4 text-xl">Seu futuro como engenheiro começa agora!</p>
                <ExternalButton link="https://www.sp.senac.br/">Saiba mais</ExternalButton>
            </div>
        </section>
    );
}
