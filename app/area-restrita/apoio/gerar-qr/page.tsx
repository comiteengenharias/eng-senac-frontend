'use client'

import LoadingOverlay from "@/components/system/loading-overlay";
import Sidebar from "@/components/system/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logout, verifyLogin } from "@/services/api-login";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { QRCodeCanvas } from 'qrcode.react';

export default function AreaRestrita_Apoio_GerarQr() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState("");
  const [generatedQrValue, setGeneratedQrValue] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const data = await verifyLogin();
      if (!data || data == null || data.role !== 'Support') {
        logout();
        router.push('/');
      } else {
        setLoading(false);
      }
    })();
  }, []);

  const handleGenerate = () => {
    if (studentId.trim()) {
      setGeneratedQrValue(studentId);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  return (
    <div>
      <LoadingOverlay active={loading} />
      <Sidebar pageId="home" type="support" />
      <main className="sm:ml-[250px] mt-16 min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#f5f7fa] to-[#eef2f7]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[var(--blue)] to-[#0066cc] w-full px-6 py-8 text-[var(--white)] shadow-lg">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 bg-white rounded-full"></div>
              <h1 className="text-3xl font-bold">Gerar QR Code</h1>
            </div>
            <p className="opacity-90 mt-2 text-sm">Digite o ID do aluno para gerar o QR code de acesso</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 space-y-4">
          {/* Input Section */}
          <div className="flex flex-col sm:flex-row gap-2 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 block mb-2">ID do Aluno</label>
              <Input
                type="number"
                placeholder="Digite o ID do aluno"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                onKeyPress={handleKeyPress}
                className="border-gray-300 focus:border-[var(--blue)] focus:ring-[var(--blue)]"
              />
            </div>
            <Button
              onClick={handleGenerate}
              className="bg-[var(--blue)] hover:bg-blue-700 text-white cursor-pointer"
            >
              Gerar
            </Button>
          </div>

          {/* QR Code Display Section */}
          {generatedQrValue && (
            <div className="flex justify-center items-center p-8 bg-white rounded-lg shadow-md border-0">
              <div className="text-center">
                <p className="text-gray-700 font-semibold mb-4">ID do Aluno: {generatedQrValue}</p>
                <QRCodeCanvas value={generatedQrValue} size={250} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}



