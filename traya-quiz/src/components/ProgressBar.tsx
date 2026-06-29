interface ProgressBarProps {
  current: number
  total: number
  sectionLabel: string
}

export function ProgressBar({ current, total, sectionLabel }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0

  return (
    <div className="progress-wrap">
      <div className="progress-meta">
        <span className="progress-section">{sectionLabel}</span>
        <span className="progress-count">
          {current} of {total}
        </span>
      </div>
      <div className="progress-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
