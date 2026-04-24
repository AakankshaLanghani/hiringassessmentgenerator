# ICS AI Hiring Assessment Generator

A production-ready SaaS frontend for generating AI-powered MCQ hiring assessments from job descriptions.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Custom UI Components** (no heavy dependency on UI libraries)
- **jsPDF** — PDF export
- **docx + file-saver** — DOCX export

---

## Project Structure

```
ics-assessment/
├── app/
│   ├── layout.tsx          # Root layout with Navbar
│   ├── page.tsx            # Landing page (/)
│   └── dashboard/
│       └── page.tsx        # Main dashboard (/dashboard)
├── components/
│   ├── Navbar.tsx
│   ├── HeroSection.tsx
│   ├── FeatureCards.tsx
│   ├── Footer.tsx
│   ├── TextareaInput.tsx
│   ├── SectionAccordion.tsx
│   ├── QuestionCard.tsx
│   ├── EmptyState.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── DropdownSelect.tsx
│       ├── AlertBox.tsx
│       └── Loader.tsx
├── lib/
│   ├── api.ts              # API calls + mock fallback
│   ├── export.ts           # PDF & DOCX export logic
│   └── utils.ts            # cn() utility
├── styles/
│   └── globals.css
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

---

## Setup & Run

### 1. Prerequisites

- **Node.js 18+** — [Download](https://nodejs.org)
- **npm** (comes with Node)

### 2. Install dependencies

```bash
cd ics-assessment
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables (Optional)

Create a `.env.local` file if your backend runs on a different URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Default is already `http://localhost:8000`.

---

## Backend API Contract

The frontend calls:

```
POST http://localhost:8000/generate
Content-Type: application/json

{
  "jd": "string",
  "num_questions": 15,
  "difficulty": "Mixed"
}
```

Expected response:

```json
{
  "sections": [
    {
      "section": "Logical Reasoning",
      "questions": [
        {
          "id": 1,
          "text": "Question text here",
          "options": [
            { "label": "A", "text": "Option A" },
            { "label": "B", "text": "Option B" },
            { "label": "C", "text": "Option C" },
            { "label": "D", "text": "Option D" }
          ],
          "correct_answer": "C",
          "explanation": "Optional explanation"
        }
      ]
    }
  ],
  "total_questions": 15,
  "generated_at": "2024-01-01T12:00:00Z"
}
```

> **Note:** If the backend is unreachable (network error), the app automatically falls back to realistic mock data so you can work on the frontend without a running backend.

---

## Features

- ✅ Landing page with hero, features, how-it-works, CTA
- ✅ Dashboard with JD textarea, dropdowns, generate button
- ✅ Loading skeletons during generation
- ✅ Accordion sections (Logical, Analytical, Role-Based, Situational)
- ✅ Per-question cards with A/B/C/D options
- ✅ Toggle to show/hide correct answers + explanations
- ✅ Regenerate without re-entering JD
- ✅ PDF export (jsPDF)
- ✅ DOCX export (docx + file-saver)
- ✅ Error handling with dismissible alerts
- ✅ Empty state with hints
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Mock fallback when backend is offline

---

## Build for Production

```bash
npm run build
npm start
```

