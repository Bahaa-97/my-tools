(function() {
    const canvas = document.getElementById('smart-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    let isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 30 : 65; // Highly optimized count
    const connectionDistance = isMobile ? 100 : 130;
    const mouseDistance = 160;
    
    let mouse = { x: -1000, y: -1000 };
    
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        isMobile = width < 768;
    }
    
    window.addEventListener('resize', () => {
        resize();
    });
    
    resize();
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }, { passive: true });
    
    window.addEventListener('mouseout', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 1.2;
            this.vy = (Math.random() - 0.5) * 1.2;
            this.radius = Math.random() * 1.5 + 1;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Bounce off edges smoothly
            if (this.x < 0 || this.x > width) this.vx = -this.vx;
            if (this.y < 0 || this.y > height) this.vy = -this.vy;
            
            // Mouse interaction: push away gently to create a dynamic feel
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < mouseDistance) {
                const force = (mouseDistance - dist) / mouseDistance;
                this.x -= (dx / dist) * force * 1.5;
                this.y -= (dy / dist) * force * 1.5;
            }
        }
        
        draw(color) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${color}, 0.6)`;
            ctx.fill();
        }
    }
    
    // Init particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        requestAnimationFrame(animate);
        
        // Clear frame
        ctx.clearRect(0, 0, width, height);
        
        // Theme Colors
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const colorBase = isDark ? '96, 165, 250' : '59, 130, 246'; // Accent Color (Blue)
        
        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw(colorBase);
            
            // Connect particles
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < connectionDistance) {
                    const opacity = 1 - (dist / connectionDistance);
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${colorBase}, ${opacity * 0.25})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
            
            // Connect to mouse for interactivity
            const dxM = particles[i].x - mouse.x;
            const dyM = particles[i].y - mouse.y;
            const distM = Math.sqrt(dxM * dxM + dyM * dyM);
            
            if (distM < mouseDistance) {
                const opacity = 1 - (distM / mouseDistance);
                ctx.beginPath();
                ctx.strokeStyle = `rgba(${colorBase}, ${opacity * 0.4})`;
                ctx.lineWidth = 1.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }
    
    animate();
})();
