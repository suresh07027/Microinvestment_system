export const CHART_COLORS = ['#818CF8', '#34D399', '#FB7185', '#FBBF24', '#A78BFA', '#60A5FA']

export const chartGrid = { stroke: 'rgba(255,255,255,0.08)' }
export const chartAxisTick = { fill: '#767E9E', fontSize: 12 }

export function GlassTooltip({ active, payload, label, formatter }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className="glass-panel rounded-xl px-4 py-3 border border-white/10 shadow-glass">
      {label && <p className="text-ink-400 text-xs mb-1">{label}</p>}
      {payload.map((p, i) => {
        const [val, name] = formatter ? formatter(p.value, p.name) : [p.value, p.name]
        return (
          <p key={i} className="text-ink-50 text-sm font-semibold num">
            <span style={{ color: p.color || p.fill }}>{name}: </span>
            {val}
          </p>
        )
      })}
    </div>
  )
}
