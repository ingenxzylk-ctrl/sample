import { useMemo, useState } from 'react'
import { ProgressBar } from './components/ProgressBar'
import { QuizStep } from './components/QuizStep'
import { ResultsScreen } from './components/ResultsScreen'
import { WelcomeScreen } from './components/WelcomeScreen'
import { quizSections } from './data/questions'
import type { Answers, AssessmentResult } from './types/quiz'
import {
  calculateResult,
  getVisibleQuestions,
  isQuestionAnswered,
} from './utils/scoring'
import './App.css'

type AppPhase = 'welcome' | 'quiz' | 'results'

function App() {
  const [phase, setPhase] = useState<AppPhase>('welcome')
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [result, setResult] = useState<AssessmentResult | null>(null)

  const visibleQuestions = useMemo(
    () => getVisibleQuestions(answers),
    [answers],
  )

  const currentQuestion = visibleQuestions[stepIndex]
  const currentSection = quizSections.find(
    (s) => s.id === currentQuestion?.section,
  )

  const handleAnswer = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const canProceed = currentQuestion
    ? isQuestionAnswered(currentQuestion, answers)
    : false

  const handleNext = () => {
    if (stepIndex < visibleQuestions.length - 1) {
      setStepIndex((i) => i + 1)
    } else {
      const assessment = calculateResult(answers)
      setResult(assessment)
      setPhase('results')
    }
  }

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1)
  }

  const handleStart = () => {
    setPhase('quiz')
    setStepIndex(0)
    setAnswers({})
    setResult(null)
  }

  const handleRetake = () => {
    setPhase('welcome')
    setStepIndex(0)
    setAnswers({})
    setResult(null)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🌿</span>
          <span className="logo-text">Traya</span>
        </div>
        {phase === 'quiz' && (
          <span className="header-tag">Hair Test™</span>
        )}
      </header>

      <main className="main">
        {phase === 'welcome' && <WelcomeScreen onStart={handleStart} />}

        {phase === 'quiz' && currentQuestion && (
          <div className="quiz-container">
            <ProgressBar
              current={stepIndex + 1}
              total={visibleQuestions.length}
              sectionLabel={currentSection?.title ?? 'Assessment'}
            />
            <QuizStep
              question={currentQuestion}
              answers={answers}
              onAnswer={handleAnswer}
            />
            <div className="quiz-nav">
              {stepIndex > 0 ? (
                <button type="button" className="btn-secondary" onClick={handleBack}>
                  Back
                </button>
              ) : (
                <span />
              )}
              <button
                type="button"
                className="btn-primary"
                onClick={handleNext}
                disabled={!canProceed}
              >
                {stepIndex === visibleQuestions.length - 1
                  ? 'See My Results'
                  : 'Continue'}
              </button>
            </div>
          </div>
        )}

        {phase === 'results' && result && (
          <ResultsScreen
            result={result}
            name={(answers.name as string) || ''}
            onRetake={handleRetake}
          />
        )}
      </main>

      <footer className="footer">
        <p>Traya Hair Assessment · Ayurveda + Dermatology + Nutrition</p>
      </footer>
    </div>
  )
}

export default App
