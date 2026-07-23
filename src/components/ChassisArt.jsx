/**
 * Procedural product artwork.
 *
 * Every Radium product is drawn as SVG from its own spec — a 24-bay chassis with
 * 16 drives installed renders exactly that. No product photography, no asset
 * weight, and a new SKU needs no new image.
 */

const C = {
  face: '#2a0d10',
  faceHi: '#3d1418',
  edge: '#5a1f26',
  steel: '#dca8ad',
  accent: '#ff4d5e',
  hot: '#ff97a1',
}

function Screws({ x, w, y, h }) {
  return (
    <>
      {[
        [x + 5, y + 5],
        [x + 5, y + h - 5],
        [x + w - 5, y + 5],
        [x + w - 5, y + h - 5],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.6" fill={C.steel} opacity=".45" />
      ))}
    </>
  )
}

/** Rackmount front view: drive bay grid + control ear. */
function RackFace({ bays = 16, filled = 16, rows }) {
  const cols = bays <= 16 ? 4 : 6
  const rowCount = rows ?? Math.ceil(bays / cols)
  const bodyX = 46
  const bodyW = 300 - bodyX - 10
  const bodyY = 18
  const bodyH = 104
  const padX = 8
  const padY = 8
  const gap = 3
  const cellW = (bodyW - padX * 2 - gap * (cols - 1)) / cols
  const cellH = (bodyH - padY * 2 - gap * (rowCount - 1)) / rowCount

  const cells = []
  for (let i = 0; i < bays; i += 1) {
    const r = Math.floor(i / cols)
    const c = i % cols
    cells.push({
      i,
      x: bodyX + padX + c * (cellW + gap),
      y: bodyY + padY + r * (cellH + gap),
      on: i < filled,
    })
  }

  return (
    <>
      {/* rack ears */}
      <rect x="10" y={bodyY} width="30" height={bodyH} rx="3" fill={C.face} stroke={C.edge} strokeWidth="1" />
      <Screws x={10} w={30} y={bodyY} h={bodyH} />
      {/* status LEDs on the ear */}
      <circle cx="25" cy={bodyY + 22} r="2.4" fill={C.accent}>
        <animate attributeName="opacity" values="1;.35;1" dur="2.6s" repeatCount="indefinite" />
      </circle>
      <circle cx="25" cy={bodyY + 32} r="2.4" fill={C.hot} opacity=".55" />

      {/* body */}
      <rect x={bodyX} y={bodyY} width={bodyW} height={bodyH} rx="4" fill={C.faceHi} stroke={C.edge} strokeWidth="1" />

      {/* drive carriers */}
      {cells.map((cell) => (
        <g key={cell.i}>
          <rect
            x={cell.x}
            y={cell.y}
            width={cellW}
            height={cellH}
            rx="1.5"
            fill={cell.on ? C.face : 'transparent'}
            stroke={cell.on ? C.edge : 'rgba(200,150,155,.22)'}
            strokeWidth="0.9"
            strokeDasharray={cell.on ? '0' : '2 2'}
          />
          {cell.on && (
            <>
              <rect x={cell.x + 2} y={cell.y + cellH / 2 - 0.6} width={cellW * 0.42} height="1.2" rx=".6" fill={C.steel} opacity=".35" />
              <circle cx={cell.x + cellW - 4} cy={cell.y + cellH / 2} r="1.3" fill={C.accent} opacity=".9">
                <animate attributeName="opacity" values=".9;.25;.9" dur={`${1.4 + (cell.i % 7) * 0.35}s`} repeatCount="indefinite" />
              </circle>
            </>
          )}
        </g>
      ))}
    </>
  )
}

function TowerFace() {
  return (
    <>
      <rect x="95" y="10" width="110" height="120" rx="6" fill={C.faceHi} stroke={C.edge} />
      <rect x="105" y="20" width="90" height="42" rx="3" fill={C.face} stroke={C.edge} strokeWidth=".8" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={110} y={26 + i * 6} width="80" height="2" rx="1" fill={C.steel} opacity=".22" />
      ))}
      <rect x="105" y="72" width="90" height="48" rx="3" fill={C.face} stroke={C.edge} strokeWidth=".8" />
      <circle cx="150" cy="96" r="17" fill="none" stroke={C.accent} strokeWidth="1.2" opacity=".55" />
      <circle cx="150" cy="96" r="17" fill="none" stroke={C.hot} strokeWidth="1.2" opacity=".9" strokeDasharray="8 96" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate" from="0 150 96" to="360 150 96" dur="5s" repeatCount="indefinite" />
      </circle>
      <circle cx="150" cy="96" r="4" fill={C.edge} />
      <circle cx="199" cy="17" r="2" fill={C.accent}>
        <animate attributeName="opacity" values="1;.3;1" dur="3s" repeatCount="indefinite" />
      </circle>
    </>
  )
}

function MiniFace() {
  return (
    <>
      <rect x="80" y="46" width="140" height="52" rx="7" fill={C.faceHi} stroke={C.edge} />
      <rect x="88" y="54" width="124" height="36" rx="4" fill={C.face} stroke={C.edge} strokeWidth=".7" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={100 + i * 13} cy="72" r="3.4" fill="none" stroke={C.steel} strokeWidth=".9" opacity=".5" />
      ))}
      <rect x="150" y="69" width="34" height="6" rx="3" fill={C.edge} />
      <circle cx="204" cy="72" r="2.4" fill={C.accent}>
        <animate attributeName="opacity" values="1;.3;1" dur="2.4s" repeatCount="indefinite" />
      </circle>
      <rect x="120" y="98" width="60" height="5" rx="2" fill={C.face} opacity=".7" />
    </>
  )
}

function EdgeFace() {
  return (
    <>
      <rect x="105" y="40" width="90" height="64" rx="6" fill={C.faceHi} stroke={C.edge} />
      {/* passive heatsink fins */}
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={112 + i * 9} y="30" width="4" height="14" rx="2" fill={C.edge} opacity=".85" />
      ))}
      <rect x="113" y="52" width="74" height="26" rx="3" fill={C.face} stroke={C.edge} strokeWidth=".7" />
      {[0, 1].map((i) => (
        <rect key={i} x={120 + i * 26} y="60" width="18" height="10" rx="2" fill="none" stroke={C.steel} strokeWidth=".9" opacity=".45" />
      ))}
      <circle cx="181" cy="65" r="2.2" fill={C.accent}>
        <animate attributeName="opacity" values="1;.25;1" dur="1.8s" repeatCount="indefinite" />
      </circle>
      {/* radio waves */}
      {[10, 17, 24].map((r, i) => (
        <path key={r} d={`M ${196 + r} 72 a ${r} ${r} 0 0 0 -${r} -${r}`} fill="none" stroke={C.accent} strokeWidth="1.1" strokeLinecap="round" opacity={0.5 - i * 0.13} />
      ))}
      <rect x="125" y="104" width="50" height="6" rx="2" fill={C.face} />
    </>
  )
}

/**
 * @param {'rack'|'tower'|'mini'|'edge'} variant
 * @param {number} bays  total drive bays (rack variant)
 * @param {number} filled drives installed (rack variant)
 */
export default function ChassisArt({ variant = 'rack', bays = 16, filled = 16, className, glow = true }) {
  return (
    <svg
      viewBox="0 0 300 140"
      role="img"
      aria-hidden="true"
      className={className}
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <defs>
        <linearGradient id="ca-sheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity=".10" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="ca-glow" cx="50%" cy="55%" r="60%">
          <stop offset="0%" stopColor={C.accent} stopOpacity=".26" />
          <stop offset="100%" stopColor={C.accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      {glow && <rect x="0" y="0" width="300" height="140" fill="url(#ca-glow)" />}

      {variant === 'rack' && <RackFace bays={bays} filled={filled} />}
      {variant === 'tower' && <TowerFace />}
      {variant === 'mini' && <MiniFace />}
      {variant === 'edge' && <EdgeFace />}

      <rect x="0" y="0" width="300" height="140" fill="url(#ca-sheen)" pointerEvents="none" />
    </svg>
  )
}

/** Map a product family to its artwork variant + bay config. */
export const artFor = (product, model) => {
  if (model) return { variant: 'rack', bays: model.bays, filled: model.drivesInstalled }
  switch (product?.slug) {
    case 'mercury':
      return { variant: 'rack', bays: 8, filled: 8 }
    case 'jupiter':
      return { variant: 'rack', bays: 16, filled: 12 }
    case 'io':
      return { variant: 'rack', bays: 24, filled: 24 }
    case 'saturn':
      return { variant: 'rack', bays: 16, filled: 16 }
    case 'neptune':
      return { variant: 'tower' }
    case 'mars':
      return { variant: 'mini' }
    case 'pluto':
      return { variant: 'edge' }
    default:
      return { variant: 'rack', bays: 12, filled: 6 }
  }
}
