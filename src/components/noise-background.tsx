'use client';
import { useEffect, useRef } from "react";

const NoiseBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            generateNoise();
        };

        const generateNoise = () => {
            const imageData = ctx.createImageData(canvas.width, canvas.height);
            const buffer = new Uint32Array(imageData.data.buffer);

            for (let i = 0; i < buffer.length; i++) {
                buffer[i] = Math.random() < 0.5 ? 0xff000000 : 0x00000000; // Noise hitam transparan
            }

            ctx.putImageData(imageData, 0, 0);
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        return () => {
            window.removeEventListener("resize", resizeCanvas);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 z-[-1] h-screen w-screen pointer-events-none opacity-[3%] dark:opacity-100"
        />
    );
};

export default NoiseBackground;