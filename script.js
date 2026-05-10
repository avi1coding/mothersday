/* =====================================================
   Happy Mother's Day  -  interactions
   ===================================================== */

(() => {
    'use strict';

    /* ---------------- SVG icon strings (used for confetti & cursor sparks) ---------------- */
    const SVG = {
        heart: '<svg viewBox="0 0 24 24"><path d="M12 21.3L10.5 20c-5-4.5-8.5-7.6-8.5-11.5C2 5.4 4.4 3 7.5 3c1.7 0 3.4.8 4.5 2.1C13.1 3.8 14.8 3 16.5 3 19.6 3 22 5.4 22 8.5c0 3.9-3.5 7-8.5 11.5L12 21.3z"/></svg>',
        tulip: '<svg viewBox="0 0 64 64"><path d="M32 10c-7 6-12 14-12 22 0 5 5 9 12 9s12-4 12-9c0-8-5-16-12-22z"/><line x1="32" y1="40" x2="32" y2="58" stroke="#6b8c4a" stroke-width="3.5" stroke-linecap="round"/><path d="M32 50c5-1 9 1 12 5-5 1-10-1-12-5z" fill="#8db864"/></svg>',
        star: '<svg viewBox="0 0 64 64"><path d="M32 6l8.2 16.6L58.5 25.3 45.3 38.2l3.1 18.2L32 47.6l-16.4 8.8 3.1-18.2L5.5 25.3l18.3-2.7z"/></svg>',
        sparkle: '<svg viewBox="0 0 24 24"><path d="M12 2l1.8 5.6L19.5 9.5l-5.7 1.9L12 17l-1.8-5.6L4.5 9.5l5.7-1.9z"/></svg>',
        flower: '<svg viewBox="0 0 64 64"><circle cx="32" cy="14" r="9"/><circle cx="32" cy="50" r="9"/><circle cx="14" cy="32" r="9"/><circle cx="50" cy="32" r="9"/><circle cx="32" cy="32" r="6" fill="#fff" fill-opacity="0.9"/></svg>',
    };

    const CONFETTI_COLORS = ['#ec5f8c', '#ff7ea3', '#c83f6f', '#e8b974', '#f5d29a', '#b69bff'];
    const CONFETTI_SHAPES = ['heart', 'tulip', 'star', 'sparkle', 'flower', 'heart', 'heart'];

    /* ---------------- Falling petals ---------------- */
    const canvas = document.getElementById('petal-canvas');
    const ctx = canvas.getContext('2d');
    const petals = [];
    const PETAL_COUNT = 28;

    function resize() {
        canvas.width  = window.innerWidth  * devicePixelRatio;
        canvas.height = window.innerHeight * devicePixelRatio;
        canvas.style.width  = window.innerWidth  + 'px';
        canvas.style.height = window.innerHeight + 'px';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(devicePixelRatio, devicePixelRatio);
    }
    window.addEventListener('resize', resize);
    resize();

    const petalColors = [
        ['#ffd1de', '#ff7ea3'],
        ['#fff0c2', '#e8b974'],
        ['#ffe4ec', '#ec5f8c'],
        ['#fde2ea', '#ffa8c0'],
    ];

    class Petal {
        constructor(initial = false) { this.reset(initial); }
        reset(initial = false) {
            this.x = Math.random() * window.innerWidth;
            this.y = initial ? Math.random() * window.innerHeight : -30;
            this.size = 8 + Math.random() * 14;
            this.speedY = 0.4 + Math.random() * 1.2;
            this.speedX = (Math.random() - 0.5) * 0.8;
            this.angle = Math.random() * Math.PI * 2;
            this.spin = (Math.random() - 0.5) * 0.04;
            this.colors = petalColors[Math.floor(Math.random() * petalColors.length)];
            this.opacity = 0.55 + Math.random() * 0.4;
            this.swayFreq = 0.005 + Math.random() * 0.01;
            this.swayPhase = Math.random() * Math.PI * 2;
        }
        update(t) {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(t * this.swayFreq + this.swayPhase) * 0.3;
            this.angle += this.spin;
            if (this.y - this.size > window.innerHeight) this.reset();
            if (this.x < -40) this.x = window.innerWidth + 20;
            if (this.x > window.innerWidth + 40) this.x = -20;
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.globalAlpha = this.opacity;
            const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
            grad.addColorStop(0, this.colors[0]);
            grad.addColorStop(1, this.colors[1]);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(0, -this.size);
            ctx.bezierCurveTo(this.size, -this.size, this.size, this.size, 0, this.size);
            ctx.bezierCurveTo(-this.size, this.size, -this.size, -this.size, 0, -this.size);
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < PETAL_COUNT; i++) petals.push(new Petal(true));

    let t = 0;
    function animate() {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        t++;
        for (const p of petals) { p.update(t); p.draw(); }
        requestAnimationFrame(animate);
    }
    animate();

    /* ---------------- Cursor heart trail ---------------- */
    let lastSpark = 0;
    document.addEventListener('mousemove', (e) => {
        const now = performance.now();
        if (now - lastSpark < 90) return;
        lastSpark = now;
        const spark = document.createElement('div');
        spark.className = 'heart-spark';
        spark.innerHTML = SVG.heart;
        spark.style.left = e.clientX + 'px';
        spark.style.top  = e.clientY + 'px';
        const size = 10 + Math.random() * 10;
        spark.style.width  = size + 'px';
        spark.style.height = size + 'px';
        spark.style.color = `hsl(${340 + Math.random() * 30}, 80%, ${60 + Math.random() * 15}%)`;
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 900);
    });

    /* ---------------- Photo loading: mark each image's placeholder
        with .has-photo so the placeholder UI fades and the photo
        takes its natural size (no cropping). ---------------- */
    function markLoaded(img) {
        const ph = img.closest('.photo-placeholder');
        if (ph) ph.classList.add('has-photo');
    }
    document.querySelectorAll('img.photo-real').forEach((img) => {
        if (img.complete && img.naturalWidth > 0) markLoaded(img);
        img.addEventListener('load', () => markLoaded(img));
    });

    /* ---------------- Upload slot: take, remove, or retake a photo ---------------- */
    const STORAGE_KEY = 'mothersday-uploaded-photo-v1';
    const uploadSlot = document.getElementById('upload-slot');
    if (uploadSlot) {
        const input = uploadSlot.querySelector('.photo-upload-input');
        const previewImg = uploadSlot.querySelector('.photo-real');
        const placeholder = uploadSlot.querySelector('.photo-placeholder');
        const removeBtn = uploadSlot.querySelector('.photo-remove-btn');

        // Restore prior upload (if any)
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                previewImg.src = stored;
                previewImg.addEventListener('load', () => {
                    placeholder.classList.add('has-photo');
                }, { once: true });
            }
        } catch (e) { /* ignore quota / storage errors */ }

        const triggerPicker = () => input.click();

        uploadSlot.addEventListener('click', (e) => {
            // Don't reopen the picker if the user clicked the remove button
            // or the file input itself.
            if (e.target.closest('.photo-remove-btn')) return;
            if (e.target === input) return;
            triggerPicker();
        });
        uploadSlot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                triggerPicker();
            }
        });

        input.addEventListener('change', () => {
            const file = input.files && input.files[0];
            if (!file) return;
            resizeImage(file, 1400, 0.85, (dataUrl) => {
                previewImg.src = dataUrl;
                previewImg.addEventListener('load', () => {
                    placeholder.classList.add('has-photo');
                }, { once: true });
                try { localStorage.setItem(STORAGE_KEY, dataUrl); } catch (e) {}
                burstConfetti();
            });
            // Reset the input so picking the same file again still fires change
            input.value = '';
        });

        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                placeholder.classList.remove('has-photo');
                previewImg.removeAttribute('src');
                input.value = '';
                try { localStorage.removeItem(STORAGE_KEY); } catch (err) {}
            });
        }
    }

    function resizeImage(file, maxDim, quality, callback) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            const tmp = new Image();
            tmp.onload = () => {
                let { width, height } = tmp;
                if (width > maxDim || height > maxDim) {
                    if (width >= height) {
                        height = Math.round(height * (maxDim / width));
                        width = maxDim;
                    } else {
                        width = Math.round(width * (maxDim / height));
                        height = maxDim;
                    }
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(tmp, 0, 0, width, height);
                callback(canvas.toDataURL('image/jpeg', quality));
            };
            tmp.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    }

    /* ---------------- Envelope opening ---------------- */
    const envelope = document.getElementById('envelope');
    if (envelope) {
        const openEnvelope = () => {
            if (envelope.classList.contains('opening') || envelope.classList.contains('opened')) return;
            envelope.classList.add('opening');
            // After flap rotation + cover fade-out finish (~1s), swap to fully opened state
            setTimeout(() => {
                envelope.classList.add('opened');
                envelope.classList.remove('opening');
            }, 1000);
        };
        envelope.addEventListener('click', openEnvelope);
        envelope.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openEnvelope();
            }
        });
    }

    /* ---------------- Reveal on scroll ---------------- */
    const revealEls = document.querySelectorAll(
        '.section-title, .eyebrow, .section-sub, .about-grid, .reasons-grid, .gallery-grid, .timeline, .messages-grid, .final-title, .final-sub, .confetti-btn, .signed-by, .envelope'
    );
    revealEls.forEach((el) => el.classList.add('reveal'));

    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach((el) => io.observe(el));

    /* ---------------- Confetti burst ---------------- */
    function burstConfetti() {
        const layer = document.createElement('div');
        layer.className = 'confetti-layer';
        document.body.appendChild(layer);

        const count = 70;
        for (let i = 0; i < count; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';

            const shape = CONFETTI_SHAPES[Math.floor(Math.random() * CONFETTI_SHAPES.length)];
            const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
            piece.innerHTML = SVG[shape];
            piece.style.color = color;
            piece.querySelector('svg').setAttribute('fill', color);

            const startX = window.innerWidth / 2 + (Math.random() - 0.5) * 80;
            const startY = window.innerHeight - 120;
            const angle = (-Math.PI / 2) + (Math.random() - 0.5) * 1.4;
            const velocity = 6 + Math.random() * 9;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            const size = 18 + Math.random() * 22;
            const rot = (Math.random() - 0.5) * 720;

            piece.style.cssText += `
                left:${startX}px;
                top:${startY}px;
                width:${size}px;
                height:${size}px;
                transform: translate(0,0) rotate(0deg);
                opacity:1;
                color:${color};
            `;
            layer.appendChild(piece);

            requestAnimationFrame(() => {
                const dx = vx * 80 + (Math.random() - 0.5) * 100;
                const dy = vy * 80 + 600;
                piece.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
                piece.style.opacity = '0';
            });
        }

        setTimeout(() => layer.remove(), 1900);
    }

    const confettiBtn = document.getElementById('confetti-btn');
    if (confettiBtn) confettiBtn.addEventListener('click', burstConfetti);

    /* ---------------- Auto-fire confetti when reaching final section ---------------- */
    const finalSection = document.querySelector('.final-section');
    if (finalSection) {
        const finalIo = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setTimeout(burstConfetti, 600);
                    finalIo.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        finalIo.observe(finalSection);
    }

    /* ---------------- Console love ---------------- */
    const msg = `\n\n   Happy Mother's Day, Mom!\n   We love you so so so much.\n\n   - Avi, Amay & Dad\n\n`;
    console.log('%c' + msg, 'color:#ec5f8c; font-size:14px; font-family: serif;');
})();
