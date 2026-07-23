/**
 * Perspective product renders.
 *
 * A catalogue-style 3/4 view of every Radium chassis — the realistic look AIC
 * and Supermicro use for their line shots (brushed-aluminium cover, black front
 * bezel, hot-swap drive carriers with blue latches, on a white studio
 * backdrop), built the Radium way: procedural, not photographed. Same
 * {variant, bays, filled} spec as the flat ChassisArt schematic, so a new SKU
 * renders its own chassis with no new asset, and wears the Radium bezel mark.
 *
 * Projection is cabinet-oblique: the front face stays an undistorted rectangle
 * (drive bays and the logo read cleanly) while the top and right side extrude
 * up-and-back to give the shot depth.
 */

const C = {
  bezelTop: '#3b4048', // front bezel (charcoal), lit top
  bezelBot: '#22262c', // front bezel, shaded bottom
  ear: '#15171b', // rack ears / darkest trim
  topA: '#eef2f7', // aluminium cover — bright
  topB: '#c6cdd8', // aluminium cover — edge
  sideA: '#cdd4de', // right side metal — light
  sideB: '#9ca4b1', // right side metal — dark
  bay: '#0e1013', // drive-bay recess
  edge: '#3d434d', // panel borders
  carrier: '#292d34', // drive carrier face
  carrierHi: '#3c424b', // carrier top bevel
  steel: '#cbd2dc', // handles / trim highlights
  blue: '#2f8fd6', // AIC-style drive latch / activity LED
  blueHi: '#6cb8f2',
  green: '#57d38a', // power / status LED
  ink: '#eef2f7', // logo + labels on the black bezel
  vent: '#0b0d10',
}

const CW = 360
const CH = 196 // vertical centring box; shadow lives below it

/** Cabinet-oblique depth vector for a given depth in px. */
const depthVec = (d, deg = 31) => {
  const r = (deg * Math.PI) / 180
  return { dx: Math.cos(r) * d, dy: -Math.sin(r) * d }
}

const pts = (...p) => p.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')

/**
 * The real Radium logo (mark + wordmark) stamped on the front bezel.
 * `href` points at the logo SVG in /public for the live app; the PNG exporter
 * passes a data-URI so the mark bakes into the rasterised image.
 */
function Logo({ x, y, h, href }) {
  const w = h * (220 / 70) // logo aspect ratio
  return <image href={href} x={x} y={y} width={w} height={h} preserveAspectRatio="xMinYMid meet" />
}

/** The three visible faces of an extruded chassis body. */
function Body({ x, y, w, h, dx, dy, rBezel = false }) {
  const ftl = [x, y]
  const ftr = [x + w, y]
  const fbr = [x + w, y + h]
  const btl = [x + dx, y + dy]
  const btr = [x + w + dx, y + dy]
  const bbr = [x + w + dx, y + h + dy]

  // panel seams raked across the aluminium top face, parallel to the depth vector
  const topVents = []
  for (let i = 1; i < 6; i += 1) {
    const fx = x + (w * i) / 6
    topVents.push([[fx, y], [fx + dx * 0.9, y + dy * 0.9]])
  }
  // seams down the right side face
  const sideSeams = [0.4, 0.72].map((t) => [
    [x + w + dx * t, y + dy * t],
    [x + w + dx * t, y + h + dy * t],
  ])

  return (
    <g>
      {/* aluminium top cover */}
      <polygon points={pts(ftl, ftr, btr, btl)} fill="url(#pr-top)" stroke={C.sideB} strokeWidth="0.6" />
      {/* specular highlight band on the cover */}
      <polygon
        points={pts([x + w * 0.1, y], [x + w * 0.34, y], [x + w * 0.34 + dx, y + dy], [x + w * 0.1 + dx, y + dy])}
        fill="#ffffff"
        opacity="0.28"
      />
      {topVents.map((v, i) => (
        <line key={i} x1={v[0][0]} y1={v[0][1]} x2={v[1][0]} y2={v[1][1]} stroke={C.sideB} strokeWidth="0.5" opacity="0.35" />
      ))}
      {/* right side metal */}
      <polygon points={pts(ftr, btr, bbr, fbr)} fill="url(#pr-side)" stroke={C.sideB} strokeWidth="0.6" />
      {sideSeams.map((s, i) => (
        <line key={i} x1={s[0][0]} y1={s[0][1]} x2={s[1][0]} y2={s[1][1]} stroke={C.sideB} strokeWidth="0.6" opacity="0.5" />
      ))}
      {/* front bezel face */}
      <rect x={x} y={y} width={w} height={h} rx={rBezel ? 5 : 3} fill="url(#pr-front)" stroke={C.edge} strokeWidth="1" />
      {/* thin bright seam where the cover meets the bezel */}
      <line x1={x + 1.5} y1={y + 0.6} x2={x + w - 1.5} y2={y + 0.6} stroke="#ffffff" strokeOpacity="0.22" strokeWidth="0.8" />
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* Front-face detail per variant                                       */
/* ------------------------------------------------------------------ */

function RackFront({ x, y, w, h, bays, filled, logoHref }) {
  const earW = 14
  const bezelH = Math.min(14, h * 0.2)
  const gx = x + earW + 4
  const gw = w - earW * 2 - 8
  const gy = y + 5
  const gh = h - bezelH - 9
  const bezelY = y + h - bezelH
  const cols = bays <= 16 ? 4 : 6
  const rows = Math.ceil(bays / cols)
  const gap = 2.5
  const cellW = (gw - gap * (cols - 1)) / cols
  const cellH = (gh - gap * (rows - 1)) / rows

  const cells = []
  for (let i = 0; i < bays; i += 1) {
    const r = Math.floor(i / cols)
    const c = i % cols
    cells.push({ i, x: gx + c * (cellW + gap), y: gy + r * (cellH + gap), on: i < filled })
  }

  return (
    <g>
      {/* rack ears (black) with control column */}
      {[x, x + w - earW].map((ex, k) => (
        <g key={k}>
          <rect x={ex} y={y + 1.5} width={earW} height={h - 3} rx="2" fill={C.ear} />
          <rect x={ex + 3} y={y + h * 0.28} width={earW - 6} height={h * 0.44} rx="2" fill="none" stroke={C.steel} strokeWidth="1" strokeOpacity="0.3" />
          {[y + 5, y + h - 5].map((sy) => (
            <circle key={sy} cx={ex + earW / 2} cy={sy} r="1.4" fill={C.steel} opacity="0.5" />
          ))}
        </g>
      ))}

      {/* power + status LEDs on the left ear */}
      <circle cx={x + earW / 2} cy={y + h * 0.5 - 5} r="1.9" fill={C.green}>
        <animate attributeName="opacity" values="1;.4;1" dur="2.6s" repeatCount="indefinite" />
      </circle>
      <circle cx={x + earW / 2} cy={y + h * 0.5 + 2} r="1.9" fill={C.blue} opacity="0.85" />

      {/* drive-bay bank */}
      <rect x={gx - 3} y={gy - 3} width={gw + 6} height={gh + 6} rx="3" fill={C.bay} stroke={C.edge} strokeWidth="0.8" />
      {cells.map((cell) => (
        <g key={cell.i}>
          {cell.on ? (
            <>
              {/* carrier body */}
              <rect x={cell.x} y={cell.y} width={cellW} height={cellH} rx="1.4" fill={C.carrier} stroke={C.edge} strokeWidth="0.7" />
              <rect x={cell.x} y={cell.y} width={cellW} height={cellH * 0.4} rx="1.4" fill={C.carrierHi} opacity="0.55" />
              {/* mesh vents */}
              {[0.34, 0.54, 0.74].map((t) => (
                <line key={t} x1={cell.x + cellW * 0.3} y1={cell.y + cellH * t} x2={cell.x + cellW * 0.86} y2={cell.y + cellH * t} stroke={C.vent} strokeWidth="0.6" opacity="0.55" />
              ))}
              {/* blue release latch */}
              <rect x={cell.x + 1.6} y={cell.y + 1.6} width="2.4" height={cellH - 3.2} rx="1" fill={C.blue} />
              <rect x={cell.x + 1.6} y={cell.y + 1.6} width="2.4" height={(cellH - 3.2) * 0.42} rx="1" fill={C.blueHi} opacity="0.8" />
              {/* activity LED */}
              <circle cx={cell.x + cellW - 3} cy={cell.y + cellH - 2.6} r="1" fill={cell.i % 4 === 0 ? C.green : C.blue} opacity="0.9" />
            </>
          ) : (
            <rect x={cell.x} y={cell.y} width={cellW} height={cellH} rx="1.4" fill="#05070a" stroke="rgba(150,160,175,.35)" strokeWidth="0.7" strokeDasharray="2 2" />
          )}
        </g>
      ))}

      {/* branded front bezel */}
      <rect x={x + earW} y={bezelY} width={w - earW * 2} height={bezelH} fill={C.ear} />
      <line x1={x + earW} y1={bezelY} x2={x + w - earW} y2={bezelY} stroke={C.steel} strokeWidth="0.5" strokeOpacity="0.16" />
      <Logo href={logoHref} x={x + earW + 3} y={bezelY + bezelH * 0.22} h={bezelH * 0.56} />
      <circle cx={x + w - earW - 6} cy={bezelY + bezelH / 2} r="1.5" fill={C.blue} opacity="0.9" />
    </g>
  )
}

function TowerFront({ x, y, w, h, logoHref }) {
  const cx = x + w / 2
  return (
    <g>
      {/* mesh intake grille */}
      <rect x={x + 8} y={y + 8} width={w - 16} height={h * 0.34} rx="3" fill={C.bay} stroke={C.edge} strokeWidth="0.7" />
      {Array.from({ length: 7 }).map((_, i) => (
        <line key={i} x1={x + 12} y1={y + 14 + i * ((h * 0.34 - 8) / 6)} x2={x + w - 12} y2={y + 14 + i * ((h * 0.34 - 8) / 6)} stroke={C.steel} strokeWidth="0.8" opacity="0.28" />
      ))}
      {/* power ring */}
      <circle cx={cx} cy={y + h * 0.58} r={w * 0.2} fill="none" stroke={C.edge} strokeWidth="1.6" />
      <circle cx={cx} cy={y + h * 0.58} r={w * 0.2} fill="none" stroke={C.blue} strokeWidth="1.6" strokeLinecap="round" strokeDasharray={`${w * 0.18} ${w * 1.1}`} opacity="0.95">
        <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${y + h * 0.58}`} to={`360 ${cx} ${y + h * 0.58}`} dur="6s" repeatCount="indefinite" />
      </circle>
      <circle cx={cx} cy={y + h * 0.58} r="3" fill={C.blue} />
      {/* branded bezel */}
      <Logo href={logoHref} x={x + 12} y={y + h - 16} h={11} />
    </g>
  )
}

function MiniFront({ x, y, w, h, logoHref }) {
  return (
    <g>
      {/* port row */}
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={x + 14 + i * 12} cy={y + h * 0.4} r="2.6" fill="none" stroke={C.steel} strokeWidth="1" opacity="0.55" />
      ))}
      <rect x={x + w * 0.42} y={y + h * 0.34} width={w * 0.3} height="5" rx="2.5" fill={C.bay} stroke={C.edge} strokeWidth="0.6" />
      <circle cx={x + w - 12} cy={y + h * 0.4} r="2.2" fill={C.green}>
        <animate attributeName="opacity" values="1;.4;1" dur="2.6s" repeatCount="indefinite" />
      </circle>
      {/* branded bezel */}
      <Logo href={logoHref} x={x + 11} y={y + h - 15} h={9.5} />
    </g>
  )
}

function EdgeFront({ x, y, w, h, logoHref }) {
  return (
    <g>
      {/* I/O cutouts */}
      {[0, 1].map((i) => (
        <rect key={i} x={x + 12 + i * 24} y={y + h * 0.3} width="17" height="9" rx="2" fill={C.bay} stroke={C.edge} strokeWidth="0.6" />
      ))}
      <circle cx={x + w - 13} cy={y + h * 0.36} r="2.1" fill={C.blue}>
        <animate attributeName="opacity" values="1;.4;1" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* radio waves */}
      {[6, 11, 16].map((r, i) => (
        <path
          key={r}
          d={`M ${x + w - 10 + r} ${y + h * 0.36} a ${r} ${r} 0 0 0 -${r} -${r}`}
          fill="none"
          stroke={C.blue}
          strokeWidth="1"
          strokeLinecap="round"
          opacity={0.55 - i * 0.15}
        />
      ))}
      {/* branded bezel */}
      <Logo href={logoHref} x={x + 11} y={y + h - 14} h={9} />
    </g>
  )
}

/* ------------------------------------------------------------------ */

/** Front-face size (user units) + depth, per variant. */
function geometry(variant, bays) {
  switch (variant) {
    case 'tower':
      return { w: 118, h: 150, depth: 52 }
    case 'mini':
      return { w: 156, h: 62, depth: 66 }
    case 'edge':
      return { w: 132, h: 72, depth: 56 }
    case 'rack':
    default: {
      const cols = bays <= 16 ? 4 : 6
      const rows = Math.ceil(bays / cols)
      return { w: 202, h: 44 + rows * 15, depth: 64 }
    }
  }
}

/**
 * @param {'rack'|'tower'|'mini'|'edge'} variant
 * @param {number} bays   total drive bays (rack)
 * @param {number} filled drives installed (rack)
 * @param {boolean} baked  paint the white studio backdrop into the SVG (for PNG export)
 */
export default function ProductRender({
  variant = 'rack',
  bays = 16,
  filled = 16,
  className,
  glow = false,
  shadow = true,
  baked = false,
  logoHref = '/radium-logo-dark.svg',
}) {
  const { w, h, depth } = geometry(variant, bays)
  const { dx, dy } = depthVec(depth)
  const projW = w + dx
  const projH = h + Math.abs(dy)
  const x = (CW - projW) / 2
  const y = (CH - projH) / 2 + Math.abs(dy)

  return (
    <svg
      viewBox="0 0 360 236"
      role="img"
      aria-hidden="true"
      className={className}
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <defs>
        <linearGradient id="pr-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.bezelTop} />
          <stop offset="100%" stopColor={C.bezelBot} />
        </linearGradient>
        <linearGradient id="pr-top" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={C.topB} />
          <stop offset="45%" stopColor={C.topA} />
          <stop offset="100%" stopColor={C.topB} />
        </linearGradient>
        <linearGradient id="pr-side" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={C.sideA} />
          <stop offset="100%" stopColor={C.sideB} />
        </linearGradient>
        <radialGradient id="pr-glow" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="pr-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1b2735" stopOpacity="0.34" />
          <stop offset="70%" stopColor="#1b2735" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#1b2735" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="pr-bake" cx="50%" cy="38%" r="80%">
          <stop offset="0%" stopColor="#f5f7fa" />
          <stop offset="60%" stopColor="#e7ebf1" />
          <stop offset="100%" stopColor="#d3d9e2" />
        </radialGradient>
      </defs>

      {/* Studio backdrop baked in when the SVG is rasterised to a PNG tile. */}
      {baked && <rect x="0" y="0" width="360" height="236" fill="url(#pr-bake)" />}

      {glow && <rect x="0" y="0" width="360" height="236" fill="url(#pr-glow)" />}

      {shadow && (
        <ellipse cx={x + w / 2 + dx * 0.42} cy={y + h + 12} rx={w * 0.62} ry="12" fill="url(#pr-shadow)" />
      )}

      <Body x={x} y={y} w={w} h={h} dx={dx} dy={dy} rBezel={variant !== 'rack'} />

      {/* passive heatsink fins riding the top of the edge box */}
      {variant === 'edge' &&
        Array.from({ length: 10 }).map((_, i) => {
          const fx = x + 10 + i * ((w - 20) / 10)
          return <polygon key={i} points={pts([fx, y], [fx + 3, y], [fx + 3 + dx, y + dy], [fx + dx, y + dy])} fill={C.topB} stroke={C.sideB} strokeWidth="0.4" />
        })}

      {variant === 'rack' && <RackFront x={x} y={y} w={w} h={h} bays={bays} filled={filled} logoHref={logoHref} />}
      {variant === 'tower' && <TowerFront x={x} y={y} w={w} h={h} logoHref={logoHref} />}
      {variant === 'mini' && <MiniFront x={x} y={y} w={w} h={h} logoHref={logoHref} />}
      {variant === 'edge' && <EdgeFront x={x} y={y} w={w} h={h} logoHref={logoHref} />}
    </svg>
  )
}
