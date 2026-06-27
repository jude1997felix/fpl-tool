interface Props {
  icon: string
  title: string
  body: string
  type: 'good' | 'bad' | 'neutral' | 'tip'
}

const styles = {
  good:    'border-emerald-500/25 bg-emerald-500/8',
  bad:     'border-rose-500/25 bg-rose-500/8',
  neutral: 'border-white/8 bg-white/3',
  tip:     'border-primary/25 bg-primary/8',
}

const titleColors = {
  good:    'text-emerald-400',
  bad:     'text-rose-400',
  neutral: 'text-foreground',
  tip:     'text-primary',
}

export default function InsightCard({ icon, title, body, type }: Props) {
  return (
    <div className={`border rounded-xl p-4 transition-all duration-150 ${styles[type]}`}>
      <div className="flex items-start gap-3">
        <span className="text-lg mt-0.5 shrink-0">{icon}</span>
        <div>
          <div className={`font-semibold text-sm ${titleColors[type]}`}>{title}</div>
          <div className="text-muted-foreground text-sm mt-1 leading-relaxed">{body}</div>
        </div>
      </div>
    </div>
  )
}
