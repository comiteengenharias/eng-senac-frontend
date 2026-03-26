'use client'

import LoadingOverlay from "@/components/system/loading-overlay";
import Sidebar from "@/components/system/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { verifyLogin } from "@/services/api-login";
import { getLecturesInfo } from "@/services/api-student";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AreaRestrita_Aluno() {
    const router = useRouter();
	const [loading, setLoading] = useState(true)

    useEffect(() => {
        (async () => {
            const data = await verifyLogin();
            if (!data || data == null || data.role !== 'Student') {
                router.push('/login/aluno');
            }
        })();
    }, []);


    interface AttendanceRecord {
        attendancePercentage: number;
        intervals: Interval[];
        lecture: Lecture;
        lectureSpeaker: LectureSpeaker;
    }

    interface Interval {
        durationMinutes: number;
        in: string;  // exemplo: "2025-06-14T19:10:00"
        out: string; // exemplo: "2025-06-14T20:10:00"
    }

    interface Lecture {
        codeLecture: number;
        datetimeEnd: string;    // exemplo: "2025-06-14T20:10:00"
        datetimeStart: string;  // exemplo: "2025-06-14T19:10:00"
        description: string;
        linkLive: string;
        room: string;
        speaker: number;
        title: string;
        picture: string;
    }

    interface LectureSpeaker {
        codSpeaker: number;
        fullname: string;
        linkedin: string;
    }

    type AttendanceData = AttendanceRecord[];

    const [lecturesInfo, setLecturesInfo] = useState<AttendanceData | []>([]);

    useEffect(() => {
        (async () => {
            const response = await getLecturesInfo();
            setLecturesInfo(response);
            setLoading(false)
        })();
    }, []);

    const getProgressColor = (value: number) => {
        if (value >= 75) return "bg-green-500";
        if (value >= 60) return "bg-yellow-500";
        return "bg-red-500";
    };

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
    };

    const formatDateToDayMonth = (isoString: string) => {
        const date = new Date(isoString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        return `${day}/${month}`;
    };

    const formatDateToHourMinute = (isoString: string) => {
        const date = new Date(isoString);
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
    };

    const formatHourRange = (startIso: string, endIso: string) => {
        const start = new Date(startIso);
        const end = new Date(endIso);

        const format = (date: Date) =>
            `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

        return `${format(start)} - ${format(end)}`;
    };



    return (
        <div>
            <LoadingOverlay active={loading} />
            <Sidebar pageId="palestras" type="student" />
            <main className="sm:ml-[250px] mt-16 min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#f5f7fa] to-[#eef2f7]">
                <div className="bg-gradient-to-r from-[var(--blue)] to-[#0066cc] w-full px-6 py-8 text-[var(--white)] shadow-lg">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-1 h-8 bg-white rounded-full"></div>
                            <h1 className="text-3xl font-bold">Palestras</h1>
                        </div>
                        <p className="opacity-90 mt-2 text-sm">Acompanhe sua presença e participação nas palestras</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {lecturesInfo.length == 0 && (
                        <div className="col-span-full text-center py-12">
                            <p className="text-lg text-gray-500">📭 Nenhuma palestra registrada</p>
                        </div>
                    )}
                    {lecturesInfo.map((lecture, index) => (
                        <Card key={index} className="shadow-md border-0 overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="bg-gradient-to-r from-[var(--blue)] to-[#0066cc] text-white px-4 py-3 grid grid-cols-3 gap-2">
                                <div className="text-center text-sm font-semibold">
                                    📅 {formatDateToDayMonth(lecture.lecture.datetimeStart)}
                                </div>
                                <div className="text-center text-sm font-semibold">
                                    🕐 {formatHourRange(lecture.lecture.datetimeStart, lecture.lecture.datetimeEnd)}
                                </div>
                                <div className="text-center text-sm font-semibold">
                                    📍 {lecture.lecture.room}
                                </div>
                            </div>
                            <CardContent className="pt-4">
                                <div className="grid grid-cols-4 gap-2 mb-4">
                                </div>


                                <div className="flex gap-6 items-center flex-col sm:flex-row">
                                    <Avatar className="w-40">
                                        <AvatarImage
                                            src={process.env.NEXT_PUBLIC_API_URL + "/" + lecture.lecture.picture}
                                            className="rounded-full object-cover w-full border-4"
                                        />
                                        <AvatarFallback>{lecture.lectureSpeaker.fullname}</AvatarFallback>
                                    </Avatar>
                                    <div className="w-full">
                                        <div className="text-lg font-bold">{lecture.lecture.title}</div>
                                        <div className="border-b mb-3"><a href={lecture.lectureSpeaker.linkedin} target="_blank">{lecture.lectureSpeaker.fullname}</a></div>
                                        <div className="opacity-70 mb-4">{lecture.lecture.description}</div>
                                        <div>
                                            <div className="text-sm font-medium mb-1">Presença: {lecture.attendancePercentage}%</div>
                                            <Progress
                                                value={lecture.attendancePercentage}
                                                indicatorColor={getProgressColor(lecture.attendancePercentage)}
                                            />

                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <div>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="font-bold">Entrada</TableHead>
                                                    <TableHead className="font-bold">Saída</TableHead>
                                                    <TableHead className="font-bold">Tempo total</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {lecture.intervals.map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{formatTime(item.in)}</TableCell>
                                                        <TableCell>{formatTime(item.out)}</TableCell>
                                                        <TableCell className="font-medium">{item.durationMinutes} min</TableCell>
                                                    </TableRow>
                                                ))}
                                                <TableRow>
                                                    <TableCell colSpan={2} className="font-bold text-right">Total</TableCell>
                                                    <TableCell className="font-bold">
                                                        {lecture.intervals.reduce((acc, curr) => acc + curr.durationMinutes, 0)} min
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
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
