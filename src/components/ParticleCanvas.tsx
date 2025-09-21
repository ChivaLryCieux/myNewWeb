import React, { useRef, useEffect } from 'react';

export const ParticleCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return;
        }

        // --- 从此行开始，我们不仅有逻辑保证，还用 `!` 告诉 TS，canvas 和 ctx 必然存在 ---

        let animationFrameId: number;

        const resize = () => {
            // 使用 `!` 强制告诉 TS，canvas 在这里不为 null
            canvas!.width = window.innerWidth;
            canvas!.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        const particles: Particle[] = [];
        const particleCount = Math.min(120, Math.floor(window.innerWidth / 12));
        const MAX_PLEXUS_DISTANCE = Math.min(window.innerWidth / 8, 120);
        const MOUSE_REPEL_RADIUS = 100;
        const MOUSE_REPEL_STRENGTH = 1.2;

        let mouseX = -1000, mouseY = -1000;
        const handleMouseMove = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
        const handleMouseOut = () => { mouseX = -1000; mouseY = -1000; };
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseOut);

        class Particle {
            x: number; y: number; size: number; speedX: number;
            speedY: number; opacity: number; color: string;

            constructor() {
                // 使用 `!`
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;
                this.size = Math.random() * 2.2 + 0.8;
                this.speedX = (Math.random() * 0.8 - 0.4) * 0.5;
                this.speedY = (Math.random() * 0.8 - 0.4) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.2;
                this.color = `rgba(0, 255, 255, ${this.opacity})`;
            }

            update() {
                let repelX = 0;
                let repelY = 0;
                const dxMouse = this.x - mouseX;
                const dyMouse = this.y - mouseY;
                const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

                if (distMouse < MOUSE_REPEL_RADIUS && mouseX > -1000) {
                    const forceDirectionX = dxMouse / distMouse;
                    const forceDirectionY = dyMouse / distMouse;
                    const force = (MOUSE_REPEL_RADIUS - distMouse) / MOUSE_REPEL_RADIUS;
                    repelX = forceDirectionX * force * MOUSE_REPEL_STRENGTH;
                    repelY = forceDirectionY * force * MOUSE_REPEL_STRENGTH;
                }

                this.x += this.speedX + repelX;
                this.y += this.speedY + repelY;

                // 使用 `!`
                if (this.x > canvas!.width + this.size) this.x = -this.size;
                else if (this.x < -this.size) this.x = canvas!.width + this.size;
                if (this.y > canvas!.height + this.size) this.y = -this.size;
                else if (this.y < -this.size) this.y = canvas!.height + this.size;
            }

            draw() {
                // 使用 `!`
                ctx!.fillStyle = this.color;
                ctx!.beginPath();
                ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx!.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) { particles.push(new Particle()); }

        const animate = () => {
            // 使用 `!`
            ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                    if (dist < MAX_PLEXUS_DISTANCE) {
                        ctx!.beginPath();
                        ctx!.moveTo(particles[i].x, particles[i].y);
                        ctx!.lineTo(particles[j].x, particles[j].y);
                        const opacity = 1 - (dist / MAX_PLEXUS_DISTANCE);
                        ctx!.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.35})`;
                        ctx!.lineWidth = 0.7;
                        ctx!.stroke();
                    }
                }
            }
            particles.forEach(p => { p.update(); p.draw(); });
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseout', handleMouseOut);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="particles" />;
};