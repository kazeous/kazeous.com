import {useEffect, useRef} from "react";
import type {Particle} from "pixi.js";

async function mountField(field: HTMLDivElement, signal: AbortSignal) {
    const {Application, ParticleContainer, Particle, Texture} = await import("pixi.js");
    if (signal.aborted) return;

    const app = new Application();
    await app.init({
        width: 1, height: 1, preference: "webgl", resolution: Math.min(devicePixelRatio, 2),
        autoDensity: true, backgroundAlpha: 0, autoStart: false,
    });
    if (signal.aborted) {
        app.destroy(true);
        return;
    }

    const stamp = document.createElement("canvas");
    stamp.width = stamp.height = 32;
    const ink = stamp.getContext("2d")!;
    const edge = ink.createRadialGradient(16, 16, 0, 16, 16, 13);
    edge.addColorStop(0, "#234d79");
    edge.addColorStop(.67, "#234d79");
    edge.addColorStop(1, "rgba(35,77,121,0)");
    ink.fillStyle = edge;
    ink.fillRect(0, 0, 32, 32);
    const texture = Texture.from(stamp);
    const cloud = new ParticleContainer({texture, dynamicProperties: {position: true, vertex: true, color: true}});
    app.stage.addChild(cloud);
    const points: {dot: Particle; x: number; y: number; vx: number; vy: number; ox: number; oy: number; glow: number; phase: number}[] = [];
    const scale = .125;
    function resize() {
        const width = field.clientWidth, height = field.clientHeight;
        app.renderer.resize(width, height);
        cloud.removeParticles();
        points.length = 0;
        const gap = 28;
        for (let y = (height % gap) / 2; y < height; y += gap) {
            for (let x = (width % gap) / 2; x < width; x += gap) {
                const dot = new Particle({texture, x, y, anchorX: .5, anchorY: .5, scaleX: scale, scaleY: scale, alpha: .29});
                points.push({dot, x, y, vx: 0, vy: 0, ox: 0, oy: 0, glow: 0, phase: x * .012 + y * .015});
                cloud.addParticle(dot);
            }
        }
        app.render();
    }

    let pointerX = -10000, pointerY = -10000, elapsed = 0, activeAt = 0;
    function track(event: PointerEvent) {
        const rect = field.getBoundingClientRect();
        pointerX = event.clientX - rect.left;
        pointerY = event.clientY - rect.top;
        activeAt = performance.now();
    }
    function leave() { pointerX = pointerY = -10000; }
    app.ticker.add(ticker => {
        const dt = Math.min(2, ticker.deltaTime);
        elapsed += dt / 60;
        const damping = .82 ** dt;
        const blend = 1 - .85 ** dt;
        for (const p of points) {
            const dx = p.x - pointerX, dy = p.y - pointerY;
            const distance = Math.hypot(dx, dy);
            const influence = Math.max(0, 1 - distance / 150) ** 2;
            const push = 28 * influence / Math.max(1, distance);
            p.vx = (p.vx + (dx * push - p.ox) * .067 * dt) * damping;
            p.vy = (p.vy + (dy * push - p.oy) * .067 * dt) * damping;
            p.ox += p.vx * dt;
            p.oy += p.vy * dt;
            p.glow += (influence - p.glow) * blend;
            p.dot.x = p.x + p.ox + 1.25 * Math.sin(elapsed * .8 + p.phase);
            p.dot.y = p.y + p.oy + 1.25 * Math.cos(elapsed * .67 + p.phase * 1.6);
            p.dot.alpha = .29 + .57 * p.glow;
            p.dot.scaleX = p.dot.scaleY = scale * (1 + .85 * p.glow);
        }
        app.ticker.maxFPS = performance.now() - activeAt < 2200 ? 60 : 30;
    });
    const hero = field.parentElement!;
    hero.addEventListener("pointermove", track, {signal});
    hero.addEventListener("pointerdown", track, {signal});
    hero.addEventListener("pointerleave", leave, {signal});
    hero.addEventListener("pointercancel", leave, {signal});
    hero.addEventListener("pointerup", e => { if (e.pointerType !== "mouse") leave(); }, {signal});
    window.addEventListener("blur", leave, {signal});
    function sync() { if (document.hidden) app.stop(); else app.start(); }
    document.addEventListener("visibilitychange", sync, {signal});
    const observer = new ResizeObserver(resize);
    signal.addEventListener("abort", () => {
        observer.disconnect();
        app.destroy(true, {children: true});
        texture.destroy(true);
    }, {once: true});
    resize();
    field.append(app.canvas);
    observer.observe(field);
    sync();
}

export function DotField() {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const field = ref.current!;
        const motion = matchMedia("(prefers-reduced-motion: reduce)");
        let controller: AbortController;
        function sync() {
            controller?.abort();
            controller = new AbortController();
            if (!motion.matches) {
                void mountField(field, controller.signal).catch(() => {
                    // The CSS grid remains visible when WebGL is unavailable.
                });
            }
        }
        sync();
        motion.addEventListener("change", sync);
        return () => {
            controller.abort();
            motion.removeEventListener("change", sync);
        };
    }, []);
    return <div ref={ref} className="home-field" aria-hidden="true"/>;
}
