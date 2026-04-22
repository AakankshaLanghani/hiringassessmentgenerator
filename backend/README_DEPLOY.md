# ICS AI Assessment Generator — Backend

FastAPI backend for the ICS AI Hiring Assessment Generator.  
Designed for deployment on **Hugging Face Spaces** (SDK: Docker).

---

## 🚀 Hugging Face Spaces Deployment

### 1. Create a new Space

Go to [huggingface.co/new-space](https://huggingface.co/new-space) and:
- **Space name**: `ics-assessment-api` (or your preferred name)
- **SDK**: Docker
- **Visibility**: Public or Private

### 2. Push the backend folder

```bash
# Clone the HF Space repo
git clone https://huggingface.co/spaces/<your-username>/ics-assessment-api
cd ics-assessment-api

# Copy everything inside /backend into this folder
cp -r /path/to/backend/* .

# Commit and push
git add .
git commit -m "Initial deploy"
git push
```

### 3. Add a Dockerfile

Create `Dockerfile` in the root of your Space:

```dockerfile
FROM python:3.10-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 7860
CMD ["python", "main.py"]
```

### 4. Set Environment Variables

In your Space → **Settings → Repository secrets**, add:

| Key | Value |
|-----|-------|
| `OPENAI_API_KEY` | Your OpenAI API key |

---

## 🌐 Frontend Integration (Vercel)

Set your Next.js environment variable on Vercel:

```
NEXT_PUBLIC_API_URL=https://<your-username>-ics-assessment-api.hf.space
```

Then call it from your frontend:

```ts
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ jd, num_questions: 10, difficulty: "mixed" }),
});
const data = await res.json();
```

---

## 📡 API Reference

### `GET /health`
Returns server status.

```json
{ "status": "ok", "service": "ICS AI Assessment Generator" }
```

---

### `POST /generate`

Generate MCQ questions from a job description.

**Request:**
```json
{
  "jd": "We are looking for a Senior React Developer with 5+ years experience...",
  "num_questions": 10,
  "difficulty": "mixed"
}
```

**Response:**
```json
{
  "sections": [
    {
      "domain": "Logical Reasoning",
      "questions": [
        {
          "question": "Which pattern best handles complex state transitions in React?",
          "options": {
            "A": "useState with nested objects",
            "B": "useReducer with action types",
            "C": "useContext alone",
            "D": "Local component variables"
          },
          "correct_answer": "B",
          "explanation": "useReducer is ideal for complex state logic as it centralises transitions via action types, making them predictable and testable."
        }
      ]
    },
    { "domain": "Analytical Thinking", "questions": [...] },
    { "domain": "Role-Based Knowledge", "questions": [...] },
    { "domain": "Situational Judgment", "questions": [...] }
  ]
}
```

---

### `POST /export/pdf`

Export assessment as a styled PDF.

**Request:** Same shape as `/generate` response but wrapped:
```json
{
  "jd": "Senior React Developer...",
  "sections": [ ... ]
}
```

**Response:** Binary PDF file (`ICS_Assessment.pdf`)

---

### `POST /export/docx`

Export assessment as a styled DOCX Word document.

**Request:** Same as `/export/pdf`

**Response:** Binary DOCX file (`ICS_Assessment.docx`)

---

## ⚡ Local Development

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # add your OPENAI_API_KEY
python main.py
# → http://localhost:7860
# → Swagger UI: http://localhost:7860/docs
```

---

## 📁 Project Structure

```
backend/
├── main.py                  # FastAPI app + all routes
├── config.py                # Env var config
├── requirements.txt
├── Dockerfile               # For HF Spaces
├── schemas/
│   ├── __init__.py
│   └── models.py            # Pydantic request/response models
└── services/
    ├── __init__.py
    ├── ai_service.py        # OpenAI MCQ generation
    ├── pdf_service.py       # reportlab PDF export
    └── docx_service.py      # python-docx DOCX export
```
