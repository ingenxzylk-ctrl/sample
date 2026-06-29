# Traya Hair Assessment Quiz

A multi-step hair loss diagnostic quiz inspired by [Traya Health](https://traya.health/)'s Three-Science approach — combining **Ayurveda**, **Dermatology**, and **Nutrition** to identify root causes of hair fall.

## Features

- **4 assessment sections**: Personal details, Hair health, Internal health, Scalp photo
- **20+ factors analyzed**: genetics, scalp condition, stress, sleep, gut health, hormones, nutrition
- **Conditional branching**: gender-specific hair loss stage questions
- **Scoring engine**: maps answers to root causes with personalized recommendations
- **Results dashboard**: stage classification, risk level, cause breakdown, and next steps

## Getting Started

```bash
cd traya-quiz
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
npm run preview
```

## Quiz Flow

1. **Welcome** — overview of the assessment
2. **About You** — gender, age, name, email
3. **Hair Health** — concerns, duration, shedding, stage, family history, scalp
4. **Internal Health** — stress, sleep, digestion, energy, medical conditions, diet
5. **Scalp Assessment** — optional photo upload
6. **Results** — personalized diagnosis with root cause analysis

## Tech Stack

- React 19 + TypeScript
- Vite
- Custom scoring algorithm (no backend required)
