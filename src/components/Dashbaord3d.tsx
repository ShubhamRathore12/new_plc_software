"use client";
import { useEffect, useRef, useState } from "react";

const Dashboard3D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);

  // Simulate loading the 3D visualization
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Placeholder for 3D visualization
  // In a real project, you would use Three.js or a similar library
  useEffect(() => {
    if (!loading && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // Set canvas dimensions
        const setDimensions = () => {
          canvas.width = canvas.clientWidth;
          canvas.height = canvas.clientHeight;
        };

        setDimensions();
        window.addEventListener("resize", setDimensions);

        // Create a simple animated visualization
        let frame = 0;

        const animate = () => {
          frame++;

          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Set background
          ctx.fillStyle = document.documentElement.classList.contains("dark")
            ? "#1e293b"
            : "#e0f2fe";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw 3D-like elements
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const size = Math.min(canvas.width, canvas.height) * 0.3;

          // Draw cube
          const angle = frame * 0.01;

          // Cube vertices (simplified 3D projection)
          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate(angle);

          // Front face
          ctx.beginPath();
          ctx.moveTo(-size / 2, -size / 2);
          ctx.lineTo(size / 2, -size / 2);
          ctx.lineTo(size / 2, size / 2);
          ctx.lineTo(-size / 2, size / 2);
          ctx.closePath();
          ctx.fillStyle = document.documentElement.classList.contains("dark")
            ? "rgba(59, 130, 246, 0.5)"
            : "rgba(59, 130, 246, 0.2)";
          ctx.fill();
          ctx.strokeStyle = "#3b82f6";
          ctx.lineWidth = 2;
          ctx.stroke();

          // Draw connecting lines to indicate data points
          for (let i = 0; i < 4; i++) {
            const x = Math.cos(angle + (i * Math.PI) / 2) * size;
            const y = Math.sin(angle + (i * Math.PI) / 2) * size;

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(x, y);
            ctx.strokeStyle = document.documentElement.classList.contains(
              "dark"
            )
              ? "rgba(255, 255, 255, 0.3)"
              : "rgba(0, 0, 0, 0.2)";
            ctx.lineWidth = 1;
            ctx.stroke();

            // Data points
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fillStyle = i % 2 === 0 ? "#3b82f6" : "#10b981";
            ctx.fill();
          }

          ctx.restore();

          // Pulsing outer ring
          const pulseSize = size * (1.2 + Math.sin(frame * 0.05) * 0.1);
          ctx.beginPath();
          ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
          ctx.strokeStyle = document.documentElement.classList.contains("dark")
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(59, 130, 246, 0.1)";
          ctx.lineWidth = 2;
          ctx.stroke();

          requestAnimationFrame(animate);
        };

        const animationFrame = requestAnimationFrame(animate);

        return () => {
          window.removeEventListener("resize", setDimensions);
          cancelAnimationFrame(animationFrame);
        };
      }
    }
  }, [loading]);

  return (
    <div className="relative w-full h-full">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-50/50 dark:bg-gray-800/50 rounded-lg">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
            <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Loading 3D view...
            </span>
          </div>
        </div>
      ) : (
        <canvas ref={canvasRef} className="w-full h-full rounded-lg"></canvas>
      )}
    </div>
  );
};

export default Dashboard3D;
