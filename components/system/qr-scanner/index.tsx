"use client";

import { useEffect, useRef } from "react";
import jsQR from "jsqr";

interface QrScannerProps {
    onScanSuccess: (decodedText: string) => void;
    onError?: (err: any) => void;
    enabled?: boolean;
}

export default function QrScanner({ onScanSuccess, onError, enabled = true }: QrScannerProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const scanningInterval = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: { ideal: "environment" } },
                });
                streamRef.current = stream;

                const video = document.createElement("video");
                video.setAttribute("autoplay", "true");
                video.setAttribute("playsinline", "true");
                video.className = "camera-video";
                video.srcObject = stream;

                const canvas = document.createElement("canvas");
                canvas.style.display = "none"; // não precisa exibir
                canvasRef.current = canvas;

                videoRef.current = video;
                containerRef.current?.appendChild(video);
                containerRef.current?.appendChild(canvas);

                video.addEventListener("loadedmetadata", () => {
                    video.play();
                    startScanningLoop(video, canvas);
                });
            } catch (err) {
                onError?.(err);
            }
        };

        const startScanningLoop = (video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
            scanningInterval.current = setInterval(() => {
                if (!enabled || video.paused || video.ended) return;

                const width = video.videoWidth;
                const height = video.videoHeight;
                if (width === 0 || height === 0) return;

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");
                if (!ctx) return;

                ctx.drawImage(video, 0, 0, width, height);
                const imageData = ctx.getImageData(0, 0, width, height);
                let code = jsQR(imageData.data, width, height, {
                    inversionAttempts: "dontInvert",
                });

                // Se não conseguiu ler o QR code, tenta com a imagem espelhada 
                // (útil se a câmera frontal for usada por engano)
                if (!code) {
                    ctx.save();
                    ctx.scale(-1, 1);
                    ctx.drawImage(video, -width, 0, width, height);
                    ctx.restore();
                    const mirroredImageData = ctx.getImageData(0, 0, width, height);
                    code = jsQR(mirroredImageData.data, width, height, {
                        inversionAttempts: "dontInvert",
                    });
                }

                if (code) {
                    onScanSuccess(code.data);
                    stopCamera(); // interrompe após leitura
                }
            }, 500); // reduzido para evitar travamento
        };

        const stopCamera = () => {
            if (scanningInterval.current) clearInterval(scanningInterval.current);
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
            }
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.srcObject = null;
            }
            if (containerRef.current) {
                containerRef.current.innerHTML = "";
            }
        };

        if (enabled) {
            startCamera();
        }

        return () => {
            stopCamera();
        };
    }, []);

    return <div ref={containerRef} className="w-full" />;
}
