interface OptionCardProps {
  label: string
  description?: string
  icon?: string
  selected: boolean
  onClick: () => void
  multi?: boolean
}

export function OptionCard({
  label,
  description,
  icon,
  selected,
  onClick,
  multi,
}: OptionCardProps) {
  return (
    <button
      type="button"
      className={`option-card${selected ? ' selected' : ''}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      <div className="option-indicator">
        {multi ? (
          <span className={`checkbox${selected ? ' checked' : ''}`}>
            {selected && '✓'}
          </span>
        ) : (
          <span className={`radio${selected ? ' checked' : ''}`}>
            {selected && <span className="radio-dot" />}
          </span>
        )}
      </div>
      {icon && <span className="option-icon">{icon}</span>}
      <div className="option-text">
        <span className="option-label">{label}</span>
        {description && <span className="option-desc">{description}</span>}
      </div>
    </button>
  )
}
