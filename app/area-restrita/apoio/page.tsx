'use client'

import LoadingOverlay from "@/components/system/loading-overlay";
import Sidebar from "@/components/system/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { verifyLogin } from "@/services/api-login";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast, Toaster } from 'sonner';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import QrScanner from "@/components/system/qr-scanner";
import { getRooms, GetVerifyId, postRegisterLog } from "@/services/api-support";
import Swal from "sweetalert2";

export default function AreaRestrita_Apoio() {
    const router = useRouter();
    const [loading, setLoading] = useState(true)

    const [selectedRoom, setSelectedRoom] = useState<string>("");
    const [eventType, setEventType] = useState<string>("");
    const [qrResult, setQrResult] = useState<string>("");
    const [scannerEnabled, setScannerEnabled] = useState(true);

    useEffect(() => {
        (async () => {
            const data = await verifyLogin();
            if (!data || data == null || data.role !== 'Support') {
                router.push('/area-restrita');
            } else {
                setLoading(false);
            }
        })();

        // Carrega do localStorage os valores salvos
        const savedRoom = localStorage.getItem("selectedRoom");
        const savedType = localStorage.getItem("eventType");
        if (savedRoom) setSelectedRoom(savedRoom);
        if (savedType) setEventType(savedType);
    }, []);

    const eventTypeRef = useRef<string>("");
    const roomRef = useRef<string>("");

    useEffect(() => {
        eventTypeRef.current = eventType;
        roomRef.current = selectedRoom;
    }, [eventType]);


    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            const roomsData = await getRooms();
            setRooms(roomsData);
        };

        fetchRooms();
    }, []);

    const handleRoomChange = (value: string) => {
        setSelectedRoom(value);
        localStorage.setItem("selectedRoom", value);
    };

    const handleEventTypeChange = (value: string) => {
        setEventType(value);
        localStorage.setItem("eventType", value);
    };

    const scanBlockRef = useRef(false); // impede múltiplas leituras

    const handleScan = (data: string) => {
        if (scanBlockRef.current) return;

        const parsed = data.replace(/\D/g, '');
        if (parsed.length > 12 || parsed === qrResult) return;

        scanBlockRef.current = true;
        setQrResult(parsed);
        handleSubmit(parsed, eventTypeRef.current, roomRef.current); // usa o valor sempre atualizado

        setTimeout(() => {
            scanBlockRef.current = false;
        }, 3000);
    };

    const handleError = (err: any) => { };

    const handleSubmit = async (qr: string, currentEventType: string, currentRoom: string) => {
        const payload = {
            room: currentRoom,
            type: currentEventType,
            idSenac: Number(qr),
        };

        const eventTypeTxt = currentEventType == 'in' ? 'Entrada' : currentEventType == 'out' ? 'Saída' : '(Undefined)';

        try {
            const student = await GetVerifyId(payload.idSenac);

            if (student)
                Swal.fire({
                    title: 'Confirmar',
                    html: `Inserir registro de <strong>${eventTypeTxt}</strong> para <strong>${student}</strong>?`,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Inserir',
                    cancelButtonText: 'Cancelar',
                    confirmButtonColor: '#003'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        await postRegisterLog(payload);

                        await Swal.fire({
                            title: 'Obrigado!',
                            text: 'Registro enviado com sucesso',
                            icon: 'success',
                            confirmButtonText: 'Ok',
                            confirmButtonColor: '#003'
                        });

                        location.reload();
                    } else {
                        location.reload();
                    }
                });

        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                Swal.fire({
                    title: 'Erro',
                    text: error.response.data,
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#003'
                }).then(() => location.reload());
            } else {
                Swal.fire({
                    title: 'Erro',
                    text: 'Ocorreu um erro inesperado.',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#003'
                }).then(() => location.reload());
            }
        }
    };


    return (
        <div>
            <LoadingOverlay active={loading} />
            <Sidebar pageId="home" type="support" />
            <Toaster richColors position="top-center" />
            <main className="sm:ml-[250px] mt-16 min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#f5f7fa] to-[#eef2f7]">
                {/* Header */}
                <div className="bg-gradient-to-r from-[var(--blue)] to-[#0066cc] w-full px-6 py-8 text-[var(--white)] shadow-lg">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-1 h-8 bg-white rounded-full"></div>
                            <h1 className="text-3xl font-bold">Registrar Presença</h1>
                        </div>
                        <p className="opacity-90 mt-2 text-sm">Escaneie o QR code dos participantes para registrar entrada e saída</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto p-6 space-y-4">
                    {/* Card de Configuração */}
                    <Card className="shadow-md border-0">
                        <CardHeader className="border-b-2 border-gray-200">
                            <CardTitle className="text-lg text-gray-800 select-none font-semibold">
                                ⚙️ Configuração
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            {/* Select de Sala */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Sala</label>
                                <Select value={selectedRoom} onValueChange={handleRoomChange}>
                                    <SelectTrigger className="border-gray-300 focus:border-[var(--blue)] focus:ring-[var(--blue)]">
                                        <SelectValue placeholder="Selecione uma sala" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {rooms.map((room, i) => (
                                            <SelectItem key={i} value={room}>{room}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Entrada / Saída */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Tipo de Evento</label>
                                <ToggleGroup
                                    type="single"
                                    value={eventType}
                                    onValueChange={handleEventTypeChange}
                                    className="grid grid-cols-2 gap-2"
                                >
                                    <ToggleGroupItem
                                        value="in"
                                        className="data-[state=on]:bg-[var(--blue)] data-[state=on]:text-white border-2 border-gray-300 data-[state=on]:border-[var(--blue)] cursor-pointer font-semibold rounded-md py-2"
                                    >
                                        ➡️ Entrada
                                    </ToggleGroupItem>

                                    <ToggleGroupItem
                                        value="out"
                                        className="data-[state=on]:bg-[var(--blue)] data-[state=on]:text-white border-2 border-gray-300 data-[state=on]:border-[var(--blue)] cursor-pointer font-semibold rounded-md py-2"
                                    >
                                        ⬅️ Saída
                                    </ToggleGroupItem>
                                </ToggleGroup>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card de Scanner */}
                    <Card className="shadow-md border-0">
                        <CardHeader className="border-b-2 border-gray-200">
                            <CardTitle className="text-lg text-gray-800 select-none font-semibold">
                                📱 Leitor de QR Code
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="w-full border-2 border-gray-300 rounded-lg overflow-hidden">
                                <QrScanner
                                    onScanSuccess={handleScan}
                                    onError={handleError}
                                    enabled={scannerEnabled}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
