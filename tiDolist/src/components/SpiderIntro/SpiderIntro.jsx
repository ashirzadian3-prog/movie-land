import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import "./SpiderIntro.css"

/*
  عنکبوتی که از تار گوشه صفحه شروع می‌کند و روی کارت فرم می‌نشیند.
  منطق و ظاهر عنکبوت (پاها، بدن، حرکت) عیناً همان نسخه HTML است.
  cardRef: ref کارت لاگین (همان جایی که عنکبوت باید رویش بنشیند)
*/
function SpiderIntro({ cardRef, showReplay = false, navSelector = 'nav, header, .navbar' }) {
    const layerRef = useRef(null)
    const webRef = useRef(null)
    const slotRef = useRef(null)
    const canvasRef = useRef(null)
    const bootRef = useRef(null)

    useEffect(() => {
        const cv = canvasRef.current, ctx = cv.getContext('2d')
        const page = layerRef.current, slot = slotRef.current
        const left = webRef.current
        const card = cardRef.current
        if (!card) return

        const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
        const TAU = Math.PI * 2
        const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
        const wrap = a => { while (a > Math.PI) a -= TAU; while (a < -Math.PI) a += TAU; return a }

        /* ---------- تار عنکبوت گوشه صفحه ---------- */
        left.innerHTML = ''
            ; (function web() {
                const R = 530, n = 8, NS = 'http://www.w3.org/2000/svg'
                const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'web')
                svg.setAttribute('width', R); svg.setAttribute('height', R)
                let d = ''; const pt = (a, r) => [Math.cos(a) * r, Math.sin(a) * r]
                for (let k = 0; k < n; k++) { const a = k * (Math.PI / 2) / (n - 1); const [x, y] = pt(a, R); d += `M0 0L${x} ${y}` }
                for (let r = 0.16; r <= 1.0; r += 0.14) {
                    for (let k = 0; k < n - 1; k++) {
                        const a1 = k * (Math.PI / 2) / (n - 1), a2 = (k + 1) * (Math.PI / 2) / (n - 1)
                        const [x1, y1] = pt(a1, r * R), [x2, y2] = pt(a2, r * R), [cx, cy] = pt((a1 + a2) / 2, r * R * 0.9)
                        d += `M${x1} ${y1}Q${cx} ${cy} ${x2} ${y2}`
                    }
                }
                const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); p.setAttribute('fill', 'none')
                p.setAttribute('stroke', 'rgba(0, 0, 0, 0.29)'); p.setAttribute('stroke-width', '2'); svg.appendChild(p); left.appendChild(svg)
            })()

        let W, H, DPR, u

        const LEG_PARAMS = [
            { a: 3.2, b: 4.2, ang: 0.35, reach: 7.8, hip: [0.55, 0.25] },
            { a: 2.4, b: 3.2, ang: 0.85, reach: 5.2, hip: [0.25, 0.4] },
            { a: 2.4, b: 3.2, ang: 1.95, reach: 5.2, hip: [-0.25, 0.4] },
            { a: 3.4, b: 4.4, ang: 2.70, reach: 8.2, hip: [-0.55, 0.25] }
        ]

        const S = {
            x: 0, y: 0, h: 0, hd: 0, sp: 0, ab: 0, t: 0, wph: 0,
            phase: 'intro', wps: [], wi: 0, fh: 0,
            burst: { mv: true, until: 0 }, legs: [], nextTap: 2.5, idleH: 0, nextIdle: 0
        }

        function size() {
            // ارتفاع نوبار را بخوان تا تار دقیقاً به لبه‌ی پایین آن بچسبد
            const nav = document.querySelector(navSelector)
            let navH = 0
            if (nav) {
                const nr = nav.getBoundingClientRect()
                const fixed = getComputedStyle(nav).position === 'fixed'
                // لبه‌ی پایین نوبار، نسبت به بالای سند
                navH = Math.ceil(nr.bottom + (fixed ? 0 : window.scrollY))
            }
            page.style.setProperty('--nav-h', navH + 'px')

            DPR = Math.min(window.devicePixelRatio || 1, 2)
            page.style.height = '0px'
            W = document.documentElement.clientWidth
            H = Math.max(document.documentElement.scrollHeight, window.innerHeight)
            page.style.height = H + 'px'
            cv.width = W * DPR; cv.height = H * DPR
            cv.style.width = W + 'px'; cv.style.height = H + 'px'
            u = window.innerWidth <= 820 ? 12 : clamp(window.innerWidth / 60, 16, 24)
        }

        const toW = (lx, ly) => ({
            x: S.x + Math.cos(S.hd) * lx - Math.sin(S.hd) * ly,
            y: S.y + Math.sin(S.hd) * lx + Math.cos(S.hd) * ly
        })

        function init() {
            size()
            const lr = page.getBoundingClientRect()
            const sr = slot.getBoundingClientRect(), cr = card.getBoundingClientRect()
            const ox = -lr.left, oy = -lr.top
            S.x = sr.left + ox + sr.width / 2; S.y = sr.top + oy + sr.height / 2
            const T = { x: cr.left + ox + Math.min(115, cr.width * .26), y: cr.top + oy + Math.min(78, cr.height * .17) }
            const dx = T.x - S.x, dy = T.y - S.y, d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d

            S.h = Math.atan2(dy, dx) - 0.4; S.hd = S.h; S.sp = 0; S.ab = 0; S.t = 0; S.wph = 0
            S.phase = 'intro'; S.wi = 0; S.burst = { mv: true, until: 0 }; S.nextTap = 2.0
            S.fh = clamp(Math.atan2(dy, dx), 0.35, 1.2) * 0.6 + 0.25

            S.wps = [
                { x: S.x + dx * .28 + nx * d * .15, y: S.y + dy * .28 + ny * d * .15 },
                { x: S.x + dx * .58 - nx * d * .10, y: S.y + dy * .58 - ny * d * .10 },
                { x: S.x + dx * .82 + nx * d * .04, y: S.y + dy * .82 + ny * d * .04 },
                T
            ]

            S.legs = []
            for (const side of [-1, 1]) {
                for (let i = 0; i < 4; i++) {
                    const p = LEG_PARAMS[i]
                    const hx = p.hip[0], hy = p.hip[1] * side
                    const rx = hx + Math.cos(p.ang) * p.reach, ry = hy + side * Math.sin(p.ang) * p.reach
                    const w = toW(rx * u, ry * u)
                    S.legs.push({
                        side, i, p,
                        g: (i + (side > 0 ? 1 : 0)) % 2,
                        hx, hy, rx, ry, off: 0, offUntil: 0,
                        st: false, t: 0, dur: 0.15,
                        sx: w.x, sy: w.y, fx: w.x, fy: w.y, tx: w.x, ty: w.y, lift: 0, H: { x: S.x, y: S.y }
                    })
                }
            }

            if (reduce) {
                S.x = T.x; S.y = T.y; S.h = S.hd = S.fh; S.phase = 'idle'
                for (const L of S.legs) { const w = toW(L.rx * u, L.ry * u); L.fx = L.tx = w.x; L.fy = L.ty = w.y }
            }
        }

        /* ---------- منطق حرکت و راه رفتن ---------- */
        function update(dt) {
            S.t += dt
            const vmax = 10.0 * u
            let desired = S.h, tgt = 0

            if (S.phase === 'intro') {
                if (S.t > 1.4) { S.phase = 'walk'; S.burst = { mv: true, until: S.t + 1.0 } }
            }

            if (S.phase === 'walk') {
                const wp = S.wps[S.wi], last = S.wi === S.wps.length - 1
                const dx = wp.x - S.x, dy = wp.y - S.y, dist = Math.hypot(dx, dy)
                if (dist < (last ? 0.8 : 2.2) * u) {
                    if (last) S.phase = 'settle'; else S.wi++
                }
                desired = Math.atan2(dy, dx)

                if (S.t > S.burst.until) {
                    S.burst.mv = !S.burst.mv
                    S.burst.until = S.t + (S.burst.mv ? 0.5 + Math.random() * 0.7 : 0.2 + Math.random() * 0.4)
                }

                let slow = last ? clamp(dist / (4.5 * u), 0.3, 1) : 1
                tgt = S.burst.mv ? vmax * (0.85 + 0.2 * Math.sin(S.t * 6)) * slow : 0
            }

            if (S.phase === 'settle') {
                desired = S.fh
                if (Math.abs(wrap(S.fh - S.h)) < 0.05 && S.sp < 2) {
                    S.phase = 'idle'; S.idleH = S.fh; S.nextIdle = S.t + 3 + Math.random() * 3
                }
            }

            if (S.phase === 'idle') {
                desired = S.idleH
                if (S.t > S.nextIdle) {
                    S.idleH = S.fh + (Math.random() - .5) * 0.6
                    S.nextIdle = S.t + 3 + Math.random() * 4
                }
            }

            const diff = wrap(desired - S.h)
            const turn = clamp(diff * 6, -4.5, 4.5)
            S.h += turn * dt

            const facing = Math.pow(Math.max(0, Math.cos(diff)), 2)
            S.sp += ((tgt * facing) - S.sp) * Math.min(1, dt * 14)
            S.x += Math.cos(S.h) * S.sp * dt
            S.y += Math.sin(S.h) * S.sp * dt

            const sf = clamp(S.sp / vmax, 0, 1)
            S.wph += dt * (3.5 + sf * 16)
            S.hd = S.h + Math.sin(S.wph) * 0.03 * sf
            S.ab += ((-turn * 0.08 + Math.sin(S.wph * .5) * .04 * sf) - S.ab) * Math.min(1, dt * 8)

            if ((S.phase === 'idle' || S.phase === 'intro') && S.t > S.nextTap) {
                const L = S.legs[Math.random() < .5 ? 0 : 4]
                L.off = 1.4; L.offUntil = S.t + 0.45
                S.nextTap = S.t + 2.0 + Math.random() * 3.0
            }

            updateLegs(dt, sf)
        }

        function updateLegs(dt, sf) {
            const fx = Math.cos(S.hd), fy = Math.sin(S.hd), lead = 1.0 * u * sf
            const flag = [false, false]
            for (const L of S.legs) if (L.st) flag[L.g] = true

            for (const L of S.legs) {
                if (L.off && S.t > L.offUntil) L.off = 0
                const H = toW(L.hx * u, L.hy * u); L.H = H
                const R = toW((L.rx + L.off) * u, L.ry * u)

                let tx = R.x + fx * lead, ty = R.y + fy * lead
                const maxR = (L.p.a + L.p.b) * u * 0.94
                const hardR = (L.p.a + L.p.b) * u * 0.98

                const vx = tx - H.x, vy = ty - H.y, vd = Math.hypot(vx, vy)
                if (vd > maxR) { tx = H.x + vx / vd * maxR; ty = H.y + vy / vd * maxR }
                L.tx = tx; L.ty = ty

                if (L.st) {
                    L.t += dt / L.dur
                    if (L.t >= 1) {
                        L.st = false; L.fx = L.tx; L.fy = L.ty; L.lift = 0
                    } else {
                        const e = L.t * L.t * (3 - 2 * L.t)
                        L.fx = L.sx + (L.tx - L.sx) * e
                        L.fy = L.sy + (L.ty - L.sy) * e
                        L.lift = Math.sin(Math.PI * L.t)
                    }
                } else {
                    const d = Math.hypot(L.fx - L.tx, L.fy - L.ty)
                    const stretch = Math.hypot(L.fx - H.x, L.fy - H.y)
                    const emergency = stretch > hardR
                    if (d > 1.0 * u || emergency) {
                        if (!flag[1 - L.g] || emergency) {
                            L.st = true; L.t = 0; L.sx = L.fx; L.sy = L.fy
                            L.dur = 0.13 + 0.1 * (1 - sf)
                            flag[L.g] = true
                        }
                    }
                }
            }
        }

        /* ---------- حل هندسی مفاصل ---------- */
        function solveLeg(L) {
            const H = L.H, a = L.p.a * u, b = L.p.b * u
            const dx = L.fx - H.x, dy = L.fy - H.y, d = Math.hypot(dx, dy) || 1e-3
            const dd = clamp(d, Math.abs(a - b) + 1, a + b - 0.5)
            const nx = dx / d, ny = dy / d

            const x = (dd * dd + a * a - b * b) / (2 * dd)
            const y = Math.sqrt(Math.max(a * a - x * x, 0))

            const k1 = { x: H.x + nx * x - ny * y, y: H.y + ny * x + nx * y }
            const k2 = { x: H.x + nx * x + ny * y, y: H.y + ny * x - nx * y }

            const rx = -Math.sin(S.hd), ry = Math.cos(S.hd)
            const l1 = ((k1.x - S.x) * rx + (k1.y - S.y) * ry) * L.side
            const l2 = ((k2.x - S.x) * rx + (k2.y - S.y) * ry) * L.side

            const K = l1 > l2 ? k1 : k2
            K.x += rx * L.side * (L.lift * 0.3 + 0.15) * u
            K.y += ry * L.side * (L.lift * 0.3 + 0.15) * u

            const ex = L.fx - K.x, ey = L.fy - K.y, el = Math.hypot(ex, ey) || 1
            let px = -ey / el, py = ex / el
            if (px * rx * L.side + py * ry * L.side < 0) { px = -px; py = -py }

            const An = { x: K.x + ex * 0.55 + px * 0.18 * u, y: K.y + ey * 0.55 + py * 0.18 * u }
            return { H, K, An, F: { x: L.fx, y: L.fy } }
        }

        function draw3DLeg(L) {
            const { H, K, An, F } = solveLeg(L)
            const k = u / 20

            ctx.save()
            ctx.shadowColor = 'rgba(0,0,0,0.35)'
            ctx.shadowBlur = (5 + L.lift * 6) * k
            ctx.shadowOffsetY = (4 + L.lift * 10) * k

            ctx.fillStyle = '#12100e'
            boneSegment(H.x, H.y, K.x, K.y, 0.30 * u, 0.22 * u)
            boneSegment(K.x, K.y, An.x, An.y, 0.22 * u, 0.13 * u)
            boneSegment(An.x, An.y, F.x, F.y, 0.12 * u, 0.03 * u)
            ctx.restore()

            ctx.save()
            ctx.strokeStyle = 'rgba(215, 165, 115, 0.32)'
            ctx.lineWidth = 0.05 * u
            ctx.lineCap = 'round'
            ctx.beginPath()
            ctx.moveTo(H.x, H.y)
            ctx.lineTo(K.x, K.y)
            ctx.lineTo(An.x, An.y)
            ctx.stroke()
            ctx.restore()
        }

        function boneSegment(ax, ay, bx, by, w0, w1) {
            const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L
            ctx.beginPath()
            ctx.moveTo(ax + nx * w0, ay + ny * w0)
            ctx.lineTo(bx + nx * w1, by + ny * w1)
            ctx.lineTo(bx - nx * w1, by - ny * w1)
            ctx.lineTo(ax - nx * w0, ay - ny * w0)
            ctx.closePath()
            ctx.fill()
            ctx.beginPath(); ctx.arc(ax, ay, w0, 0, TAU); ctx.fill()
            ctx.beginPath(); ctx.arc(bx, by, w1, 0, TAU); ctx.fill()
        }

        function drawBody() {
            const U = u, k = u / 20
            ctx.save()
            ctx.translate(S.x, S.y)
            ctx.rotate(S.hd)

            ctx.shadowColor = 'rgba(0,0,0,0.45)'
            ctx.shadowBlur = 12 * k
            ctx.shadowOffsetY = 8 * k

            for (const s of [-1, 1]) {
                ctx.fillStyle = '#18120e'
                ctx.beginPath()
                ctx.moveTo(1.1 * U, s * 0.25 * U)
                ctx.bezierCurveTo(1.6 * U, s * 0.5 * U, 2.1 * U, s * 0.4 * U, 2.4 * U, s * 0.15 * U)
                ctx.bezierCurveTo(2.0 * U, s * 0.1 * U, 1.4 * U, s * 0.12 * U, 1.1 * U, s * 0.25 * U)
                ctx.fill()
            }

            ctx.save()
            ctx.translate(-1.1 * U, 0)
            ctx.rotate(S.ab)

            const gradAb = ctx.createRadialGradient(-1.2 * U, -0.5 * U, 0.2 * U, -1.8 * U, 0, 2.8 * U)
            gradAb.addColorStop(0, '#3a2d24')
            gradAb.addColorStop(0.5, '#16100c')
            gradAb.addColorStop(1, '#050302')
            ctx.fillStyle = gradAb

            ctx.beginPath()
            ctx.moveTo(0.4 * U, 0)
            ctx.bezierCurveTo(0.4 * U, -1.0 * U, -0.8 * U, -1.7 * U, -2.0 * U, -1.55 * U)
            ctx.bezierCurveTo(-3.0 * U, -1.4 * U, -3.9 * U, -0.6 * U, -4.2 * U, 0)
            ctx.bezierCurveTo(-3.9 * U, 0.6 * U, -3.0 * U, 1.4 * U, -2.0 * U, 1.55 * U)
            ctx.bezierCurveTo(-0.8 * U, 1.7 * U, 0.4 * U, 1.0 * U, 0.4 * U, 0)
            ctx.closePath()
            ctx.fill()

            ctx.strokeStyle = 'rgba(195, 145, 95, 0.28)'
            ctx.lineWidth = 0.12 * U
            for (let i = 0; i < 5; i++) {
                const cx = -0.5 - i * 0.7, w = 1.0 - i * 0.15
                ctx.beginPath()
                ctx.moveTo((cx + 0.3) * U, -w * U)
                ctx.lineTo((cx - 0.1) * U, 0)
                ctx.lineTo((cx + 0.3) * U, w * U)
                ctx.stroke()
            }
            ctx.restore()

            const gradTh = ctx.createRadialGradient(0.5 * U, -0.3 * U, 0.1 * U, 0.1 * U, 0, 1.8 * U)
            gradTh.addColorStop(0, '#4a382b')
            gradTh.addColorStop(0.5, '#1c130e')
            gradTh.addColorStop(1, '#070403')
            ctx.fillStyle = gradTh

            ctx.beginPath()
            ctx.moveTo(1.6 * U, 0)
            ctx.bezierCurveTo(1.6 * U, -0.8 * U, 1.0 * U, -1.2 * U, 0, -1.2 * U)
            ctx.bezierCurveTo(-0.9 * U, -1.2 * U, -1.5 * U, -0.7 * U, -1.5 * U, 0)
            ctx.bezierCurveTo(-1.5 * U, 0.7 * U, -0.9 * U, 1.2 * U, 0, 1.2 * U)
            ctx.bezierCurveTo(1.0 * U, 1.2 * U, 1.6 * U, 0.8 * U, 1.6 * U, 0)
            ctx.closePath()
            ctx.fill()

            const eyes = [[1.25, 0.22, 0.16], [1.25, -0.22, 0.16], [1.05, 0.55, 0.11], [1.05, -0.55, 0.11]]
            for (const e of eyes) {
                const r = e[2] * U, ex = e[0] * U, ey = e[1] * U
                ctx.fillStyle = '#050505'
                ctx.beginPath(); ctx.arc(ex, ey, r * 1.3, 0, TAU); ctx.fill()
                ctx.fillStyle = 'rgba(255,255,255,0.9)'
                ctx.beginPath(); ctx.arc(ex - r * 0.3, ey - r * 0.3, r * 0.35, 0, TAU); ctx.fill()
            }

            ctx.restore()
        }

        function render() {
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
            ctx.clearRect(0, 0, W, H)

            const order = S.legs.map((L, i) => [L, i]).sort((a, b) => a[0].lift - b[0].lift)
            for (const [L] of order) draw3DLeg(L)

            drawBody()
        }

        let last = performance.now(), raf = 0
        function loop(now) {
            const dt = Math.min(0.04, (now - last) / 1000); last = now
            if (!reduce) update(dt)
            render()
            raf = requestAnimationFrame(loop)
        }

        function boot() {
            cancelAnimationFrame(raf)
            init()
            last = performance.now()
            raf = requestAnimationFrame(loop)
        }
        bootRef.current = boot

        let rt
        const onResize = () => { clearTimeout(rt); rt = setTimeout(boot, 250) }
        window.addEventListener('resize', onResize)

        boot()
        let cancelled = false
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => { if (!cancelled && S.phase === 'intro') boot() })
        }

        return () => {
            cancelled = true
            cancelAnimationFrame(raf)
            clearTimeout(rt)
            window.removeEventListener('resize', onResize)
        }
    }, [cardRef])

    return createPortal(
        <>
            <div className="spider-layer" ref={layerRef} aria-hidden="true">
                <div className="spider-web" ref={webRef}></div>
                <div className="spider-slot" ref={slotRef}></div>
                <canvas className="spider-canvas" ref={canvasRef}></canvas>
            </div>
            {showReplay && (
                <button
                    type="button"
                    className="spider-replay"
                    onClick={() => bootRef.current && bootRef.current()}
                >
                    ▶ پخش دوباره
                </button>
            )}
        </>,
        document.body
    )
}

export default SpiderIntro