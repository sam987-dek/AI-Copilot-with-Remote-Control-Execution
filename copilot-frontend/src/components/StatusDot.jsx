const COLORS = {
  live: 'bg-signal-live',
  pending: 'bg-signal-pending',
  blocked: 'bg-signal-blocked',
  idle: 'bg-signal-idle',
}

export default function StatusDot({ state = 'idle', pulse = false }) {
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${COLORS[state] ?? COLORS.idle} ${pulse ? 'pulse-live' : ''}`}
    />
  )
}
