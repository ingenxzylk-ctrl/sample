import { useRef } from 'react'
import type { Answers, Question } from '../types/quiz'
import { OptionCard } from './OptionCard'

interface QuizStepProps {
  question: Question
  answers: Answers
  onAnswer: (questionId: string, value: string | string[]) => void
}

export function QuizStep({ question, answers, onAnswer }: QuizStepProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const currentAnswer = answers[question.id]

  const handleSingleSelect = (optionId: string) => {
    onAnswer(question.id, optionId)
  }

  const handleMultiSelect = (optionId: string) => {
    const existing = Array.isArray(currentAnswer) ? currentAnswer : []
    const isNone = optionId === 'none' || optionId === 'healthy'

    if (isNone) {
      onAnswer(question.id, [optionId])
      return
    }

    const withoutNone = existing.filter((id) => id !== 'none' && id !== 'healthy')
    const next = withoutNone.includes(optionId)
      ? withoutNone.filter((id) => id !== optionId)
      : [...withoutNone, optionId]

    onAnswer(question.id, next)
  }

  const handleTextChange = (value: string) => {
    onAnswer(question.id, value)
  }

  const handlePhotoUpload = (file: File | null) => {
    if (!file) {
      onAnswer(question.id, '')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      onAnswer(question.id, reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="quiz-step">
      {question.sectionSubtitle && (
        <p className="section-subtitle">{question.sectionSubtitle}</p>
      )}
      <h2 className="question-prompt">{question.prompt}</h2>
      {question.helperText && (
        <p className="question-helper">{question.helperText}</p>
      )}

      {question.type === 'single' && question.options && (
        <div className="options-grid">
          {question.options.map((opt) => (
            <OptionCard
              key={opt.id}
              label={opt.label}
              description={opt.description}
              icon={opt.icon}
              selected={currentAnswer === opt.id}
              onClick={() => handleSingleSelect(opt.id)}
            />
          ))}
        </div>
      )}

      {question.type === 'multi' && question.options && (
        <div className="options-grid">
          {question.options.map((opt) => (
            <OptionCard
              key={opt.id}
              label={opt.label}
              description={opt.description}
              icon={opt.icon}
              selected={Array.isArray(currentAnswer) && currentAnswer.includes(opt.id)}
              onClick={() => handleMultiSelect(opt.id)}
              multi
            />
          ))}
        </div>
      )}

      {question.type === 'text' && (
        <input
          type={question.id === 'email' ? 'email' : 'text'}
          className="text-input"
          placeholder={question.placeholder}
          value={(currentAnswer as string) || ''}
          onChange={(e) => handleTextChange(e.target.value)}
          autoFocus
        />
      )}

      {question.type === 'photo' && (
        <div className="photo-upload">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="photo-input"
            onChange={(e) => handlePhotoUpload(e.target.files?.[0] ?? null)}
          />
          {currentAnswer && typeof currentAnswer === 'string' && currentAnswer.startsWith('data:') ? (
            <div className="photo-preview">
              <img src={currentAnswer} alt="Scalp preview" />
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  handlePhotoUpload(null)
                  if (fileRef.current) fileRef.current.value = ''
                }}
              >
                Remove photo
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="photo-dropzone"
              onClick={() => fileRef.current?.click()}
            >
              <span className="photo-icon">📷</span>
              <span className="photo-label">Tap to upload scalp photo</span>
              <span className="photo-hint">JPG or PNG · Optional</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
