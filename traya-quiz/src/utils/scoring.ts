import { questions } from '../data/questions'
import type {
  Answers,
  AssessmentResult,
  HairStage,
  Question,
  RootCause,
} from '../types/quiz'

const ROOT_CAUSE_META: Record<
  RootCause,
  { label: string; description: string }
> = {
  hormonal: {
    label: 'Hormonal Imbalance',
    description:
      'Thyroid, PCOS, or androgen-related changes may be affecting your hair cycle and follicle health.',
  },
  stress: {
    label: 'Stress & Sleep',
    description:
      'Chronic stress and poor sleep can push hair follicles into a resting phase, causing excess shedding.',
  },
  gut: {
    label: 'Gut Health',
    description:
      'Digestive issues like constipation, acidity, or bloating can reduce nutrient absorption critical for hair growth.',
  },
  nutrition: {
    label: 'Nutritional Deficiency',
    description:
      'Low iron, protein, or vitamin levels may be limiting your body\'s ability to produce healthy hair.',
  },
  genetics: {
    label: 'Genetic Predisposition',
    description:
      'Family history and pattern baldness suggest a genetic component to your hair loss.',
  },
  scalp: {
    label: 'Scalp Condition',
    description:
      'Dandruff, inflammation, or scalp imbalance may be weakening hair roots and blocking healthy growth.',
  },
}

const STAGE_LABELS: Record<HairStage, string> = {
  early: 'Early Stage',
  moderate: 'Moderate Stage',
  advanced: 'Advanced Stage',
  maintenance: 'Maintenance Stage',
}

export function getVisibleQuestions(answers: Answers): Question[] {
  return questions.filter((q) => {
    if (!q.showIf) return true
    const answer = answers[q.showIf.questionId]
    if (!answer) return false
    const selected = Array.isArray(answer) ? answer : [answer]
    return q.showIf.optionIds.some((id) => selected.includes(id))
  })
}

function accumulateScores(answers: Answers): Record<RootCause, number> {
  const totals: Record<RootCause, number> = {
    hormonal: 0,
    stress: 0,
    gut: 0,
    nutrition: 0,
    genetics: 0,
    scalp: 0,
  }

  const visible = getVisibleQuestions(answers)

  for (const question of visible) {
    const answer = answers[question.id]
    if (!answer || !question.options) continue

    const selectedIds = Array.isArray(answer) ? answer : [answer]

    for (const optionId of selectedIds) {
      const option = question.options.find((o) => o.id === optionId)
      if (!option?.scores) continue
      for (const [cause, points] of Object.entries(option.scores)) {
        totals[cause as RootCause] += points
      }
    }
  }

  return totals
}

function determineStage(answers: Answers): HairStage {
  const visible = getVisibleQuestions(answers)
  const stageQuestion = visible.find(
    (q) => q.id === 'hair_stage_male' || q.id === 'hair_stage_female',
  )
  if (!stageQuestion?.options) return 'early'

  const answer = answers[stageQuestion.id]
  if (!answer || Array.isArray(answer)) return 'early'

  const option = stageQuestion.options.find((o) => o.id === answer)
  return option?.stage ?? 'early'
}

function buildRecommendations(
  causes: RootCause[],
  stage: HairStage,
): string[] {
  const recs: string[] = []

  if (causes.includes('hormonal')) {
    recs.push('Get thyroid and hormone panels checked with a dermatologist')
    recs.push('Consider doctor-prescribed topical treatments for hormonal hair loss')
  }
  if (causes.includes('stress')) {
    recs.push('Practice daily stress management — meditation, yoga, or 30 min exercise')
    recs.push('Prioritize 7–8 hours of consistent sleep with a fixed schedule')
  }
  if (causes.includes('gut')) {
    recs.push('Improve gut health with fiber-rich foods and adequate hydration')
    recs.push('Consider Ayurvedic nasal drops (Nasya) to support digestion and sleep')
  }
  if (causes.includes('nutrition')) {
    recs.push('Add iron, biotin, and protein-rich foods to your daily diet')
    recs.push('Take a personalized supplement plan based on your deficiencies')
  }
  if (causes.includes('genetics')) {
    recs.push('Start early intervention — minoxidil and DHT blockers work best in early stages')
    recs.push('Maintain consistency for at least 5 months to see visible results')
  }
  if (causes.includes('scalp')) {
    recs.push('Use anti-dandruff or scalp-soothing treatments as recommended')
    recs.push('Avoid harsh shampoos and reduce heat styling on the scalp')
  }

  if (stage === 'advanced') {
    recs.push('Consult a specialist about advanced options like PRP or hair transplant')
  } else if (stage === 'early') {
    recs.push('Early intervention gives the best chance of regrowth — start treatment now')
  }

  recs.push('Track progress monthly with scalp photos and hair fall count')
  recs.push('Follow a holistic plan combining Ayurveda, Dermatology & Nutrition')

  return recs.slice(0, 6)
}

function buildSummary(
  name: string,
  stage: HairStage,
  topCauses: { label: string }[],
): string {
  const stageText = STAGE_LABELS[stage].toLowerCase()
  const causeText =
    topCauses.length > 1
      ? `${topCauses[0].label} and ${topCauses[1].label}`
      : topCauses[0]?.label ?? 'multiple factors'

  return `${name ? `${name}, your` : 'Your'} assessment indicates ${stageText} hair loss primarily driven by ${causeText}. Hair fall is often a symptom of internal imbalances — addressing these root causes with a personalized treatment plan offers the best path to healthier hair.`
}

export function calculateResult(answers: Answers): AssessmentResult {
  const scores = accumulateScores(answers)
  const stage = determineStage(answers)
  const name = (answers.name as string) || ''

  const sortedCauses = (Object.entries(scores) as [RootCause, number][])
    .filter(([, score]) => score > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([cause, score]) => ({
      cause,
      label: ROOT_CAUSE_META[cause].label,
      score,
      description: ROOT_CAUSE_META[cause].description,
    }))

  const topCauses =
    sortedCauses.length > 0
      ? sortedCauses.slice(0, 3)
      : [
          {
            cause: 'stress' as RootCause,
            label: ROOT_CAUSE_META.stress.label,
            score: 1,
            description: ROOT_CAUSE_META.stress.description,
          },
        ]

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0)
  const riskLevel: AssessmentResult['riskLevel'] =
    totalScore >= 20 || stage === 'advanced'
      ? 'high'
      : totalScore >= 10 || stage === 'moderate'
        ? 'moderate'
        : 'low'

  return {
    stage,
    stageLabel: STAGE_LABELS[stage],
    rootCauses: topCauses,
    primaryCause: topCauses[0].cause,
    summary: buildSummary(name, stage, topCauses),
    recommendations: buildRecommendations(
      topCauses.map((c) => c.cause),
      stage,
    ),
    riskLevel,
  }
}

export function isQuestionAnswered(
  question: Question,
  answers: Answers,
): boolean {
  const answer = answers[question.id]
  if (!question.required) return true
  if (question.type === 'text') return typeof answer === 'string' && answer.trim().length > 0
  if (question.type === 'photo') return true
  if (question.type === 'multi')
    return Array.isArray(answer) && answer.length > 0
  return typeof answer === 'string' && answer.length > 0
}
