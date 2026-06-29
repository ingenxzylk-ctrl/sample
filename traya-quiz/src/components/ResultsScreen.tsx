import type { AssessmentResult } from '../types/quiz'

interface ResultsScreenProps {
  result: AssessmentResult
  name: string
  onRetake: () => void
}

const RISK_COLORS = {
  low: { bg: '#e8f5e9', text: '#2e7d32', label: 'Low Risk' },
  moderate: { bg: '#fff3e0', text: '#e65100', label: 'Moderate Risk' },
  high: { bg: '#fce4ec', text: '#c62828', label: 'High Risk' },
}

const CAUSE_ICONS: Record<string, string> = {
  hormonal: '⚖️',
  stress: '😰',
  gut: '🫁',
  nutrition: '🥗',
  genetics: '🧬',
  scalp: '🧴',
}

export function ResultsScreen({ result, name, onRetake }: ResultsScreenProps) {
  const risk = RISK_COLORS[result.riskLevel]
  const maxScore = Math.max(...result.rootCauses.map((c) => c.score), 1)

  return (
    <div className="results">
      <div className="results-header">
        <div className="results-badge">Your Hair Diagnosis</div>
        <h1 className="results-title">
          {name ? `${name}, here are your results` : 'Your Assessment Results'}
        </h1>
        <p className="results-summary">{result.summary}</p>
      </div>

      <div className="results-cards">
        <div className="result-card stage-card">
          <span className="card-label">Hair Loss Stage</span>
          <span className="stage-value">{result.stageLabel}</span>
          <span
            className="risk-badge"
            style={{ background: risk.bg, color: risk.text }}
          >
            {risk.label}
          </span>
        </div>

        <div className="result-card causes-card">
          <span className="card-label">Root Causes Identified</span>
          <div className="causes-list">
            {result.rootCauses.map((cause) => (
              <div key={cause.cause} className="cause-item">
                <div className="cause-header">
                  <span className="cause-icon">{CAUSE_ICONS[cause.cause]}</span>
                  <span className="cause-name">{cause.label}</span>
                  <span className="cause-score">{cause.score} pts</span>
                </div>
                <div className="cause-bar-track">
                  <div
                    className="cause-bar-fill"
                    style={{ width: `${(cause.score / maxScore) * 100}%` }}
                  />
                </div>
                <p className="cause-desc">{cause.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="result-card recs-card">
          <span className="card-label">Recommended Next Steps</span>
          <ul className="recs-list">
            {result.recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="results-sciences">
        <p className="sciences-label">Traya&apos;s Three-Science Approach</p>
        <div className="sciences-row">
          <span className="science-pill">🌿 Ayurveda</span>
          <span className="science-pill">💊 Dermatology</span>
          <span className="science-pill">🍎 Nutrition</span>
        </div>
      </div>

      <div className="results-actions">
        <button type="button" className="btn-primary btn-large">
          Get My Treatment Plan
        </button>
        <button type="button" className="btn-secondary" onClick={onRetake}>
          Retake Assessment
        </button>
      </div>
    </div>
  )
}
