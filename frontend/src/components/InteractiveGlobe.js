import React, { useEffect, useRef } from 'react';

const InteractiveGlobe = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      const size = Math.min(window.innerWidth, window.innerHeight) * 0.3;
      canvas.width = size;
      canvas.height = size;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawGlobe = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.4;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create gradient for globe
      const gradient = ctx.createRadialGradient(centerX - radius * 0.3, centerY - radius * 0.3, 0, centerX, centerY, radius);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)'); // Blue center
      gradient.addColorStop(0.7, 'rgba(147, 51, 234, 0.6)'); // Purple middle
      gradient.addColorStop(1, 'rgba(236, 72, 153, 0.4)'); // Pink edge

      // Draw globe
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;

      // Horizontal lines
      for (let i = 0; i < 8; i++) {
        const y = centerY + (i - 4) * radius * 0.25;
        const x1 = centerX - Math.sqrt(radius * radius - (y - centerY) * (y - centerY));
        const x2 = centerX + Math.sqrt(radius * radius - (y - centerY) * (y - centerY));
        
        if (x1 !== x2) {
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          ctx.stroke();
        }
      }

      // Vertical lines
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI * 2) / 12 + timeRef.current * 0.001;
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX - Math.cos(angle) * radius;
        const y2 = centerY - Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Draw data points
      const dataPoints = [
        { lat: 0.3, lon: 0.2, size: 4, color: 'rgba(34, 197, 94, 0.8)' },
        { lat: -0.4, lon: 0.6, size: 3, color: 'rgba(59, 130, 246, 0.8)' },
        { lat: 0.1, lon: -0.5, size: 5, color: 'rgba(236, 72, 153, 0.8)' },
        { lat: -0.2, lon: -0.3, size: 3, color: 'rgba(245, 158, 11, 0.8)' },
        { lat: 0.5, lon: 0.8, size: 4, color: 'rgba(139, 92, 246, 0.8)' },
      ];

      dataPoints.forEach(point => {
        const x = centerX + point.lon * radius * 0.8;
        const y = centerY + point.lat * radius * 0.8;
        
        // Check if point is on visible side of globe
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        if (distance <= radius) {
          ctx.beginPath();
          ctx.arc(x, y, point.size, 0, Math.PI * 2);
          ctx.fillStyle = point.color;
          ctx.fill();
          
          // Add glow effect
          ctx.shadowColor = point.color;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      timeRef.current += 16;
    };

    const animate = () => {
      drawGlobe();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ background: 'transparent' }}
    />
  );
};

export default InteractiveGlobe;
