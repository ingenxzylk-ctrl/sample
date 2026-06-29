interface WelcomeScreenProps {
  onStart: () => void
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="welcome">
      <div className="welcome-badge">Free Hair Assessment</div>
      <h1 className="welcome-title">Know the Root Cause of Your Hair Loss</h1>
      <p className="welcome-subtitle">
        Take our 2-minute diagnostic quiz inspired by Traya&apos;s Three-Science approach —
        Ayurveda, Dermatology &amp; Nutrition — to uncover what&apos;s really causing your hair fall.
      </p>

      <div className="welcome-features">
        <div className="feature">
          <span className="feature-icon">🔬</span>
          <div>
            <strong>20+ factors analyzed</strong>
            <p>Genetics, scalp, gut, stress &amp; hormones</p>
          </div>
        </div>
        <div className="feature">
          <span className="feature-icon">🎯</span>
          <div>
            <strong>Personalized diagnosis</strong>
            <p>Root-cause mapping tailored to you</p>
          </div>
        </div>
        <div className="feature">
          <span className="feature-icon">💚</span>
          <div>
            <strong>Holistic treatment plan</strong>
            <p>Actionable recommendations you can start today</p>
          </div>
        </div>
      </div>

      <button type="button" className="btn-primary btn-large" onClick={onStart}>
        Take the Hair Test
      </button>

      <p className="welcome-note">Takes about 2 minutes · No account required</p>
    </div>
  )
}
