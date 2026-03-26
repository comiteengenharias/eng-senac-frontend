'use client'

import Sidebar from "@/components/system/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { verifyLogin } from "@/services/api-login";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AreaRestrita_Aluno() {
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const data = await verifyLogin();
            if (!data || data == null || data.role !== 'Student') {
                router.push('/login/aluno');
            }
        })();
    }, []);

    const assessments = [
        {
            appraiser: "Professor Ricardo Dalke",
            image: "/img/pictures/user.jpg",
            coment: "'Muito bom'",
        },
    ];

    const getProgressColor = (value: number) => {
        if (value >= 75) return "bg-green-500";
        if (value >= 60) return "bg-yellow-500";
        return "bg-red-500";
    };

    const log = [
        { horario: "19:00", tipo: "Entrada" },
        { horario: "19:30", tipo: "Saída" },
        { horario: "19:35", tipo: "Entrada" },
        { horario: "21:30", tipo: "Saída" },
    ]

    return (
        <div>
            <Sidebar pageId="ver-avaliacoes" type="student" />
            <main className="sm:ml-[250px] mt-16 min-h-[calc(100vh-64px)] bg-[var(--gray)]">
                <div className="bg-[var(--blue)] w-full h-60 text-[var(--white)] relative justify-center p-6">
                    <div className="absolute bottom-2 max-w-[calc(100%-100px)]">
                        <h1>Ver avaliações - Banca</h1>
                        <p className="mb-6 opacity-50 mt-2">Para comunicar eventuais inconsistências, acesse a aba de suporte no seu perfil e entre em contato com a equipe organizadora.</p>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {assessments.map((assessment, index) => (
                        <Card key={index}>
                            <CardContent>
                                <div className="flex gap-6 items-center">
                                    <Avatar className="w-40">
                                        <AvatarImage
                                            src="/img/pictures/user.jpg"
                                            className="rounded-full object-cover w-full"
                                        />
                                        <AvatarFallback>{assessment.image}</AvatarFallback>
                                    </Avatar>
                                    <div className="w-full">
                                        <div className="border-b mb-3">{assessment.appraiser}</div>
                                        <div className="opacity-70 mb-4">{assessment.coment}</div>
                                        <div>Média: 10.0</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
