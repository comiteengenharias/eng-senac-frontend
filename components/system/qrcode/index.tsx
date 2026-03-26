'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode } from "lucide-react";
import { QRCodeCanvas } from 'qrcode.react';

interface QrCodeViewProps {
    name: string;
    value: string;
}

export function QrCodeView({ name, value }: QrCodeViewProps) {
    return (
        <Card className="w-full md:w-1/2">
            <CardHeader>
                <div className="flex items-center justify-center">
                    <CardTitle className="text-lg sm:text-xl text-gray-800">
                        {name}
                    </CardTitle>
                    <QrCode className="ml-auto w-4 h-4" />
                </div>
                <CardDescription>
                    <div>
                        Apresente este QR Code na entrada e na saída das palestras para validar presença.
                    </div>
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="flex justify-center">
                    <QRCodeCanvas value={value} size={200} />
                </div>
            </CardContent>
        </Card>
    );
}
