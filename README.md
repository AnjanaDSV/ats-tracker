# TRACK — Job Application Tracker

A clean, AI-powered job application tracker built with Next.js. Track every application, monitor your response rate, and use Claude AI to match your resume against job descriptions.

## Features

- **Dashboard** — Total applied, response rate, ghost rate, interviews at a glance
- **Job Applications** — Add, edit, and delete applications with company, role, URL, salary, status, and notes
- **Status Tracking** — Applied · Phone Screen · Interview · Offer · Rejected · Ghosted
- **AI Keyword Matcher** — Paste a job description and Claude compares it against your resume, showing matching and missing keywords with a match score
- **Resume Storage** — Store your resume text locally for instant AI comparisons
- **Data Export** — Download all your applications as a JSON backup anytime

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/)
- [Claude API](https://www.anthropic.com/) via `@anthropic-ai/sdk`
- `localStorage` for data persistence (no database needed)

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/AnjanaDSV/ats-tracker.git
cd ats-tracker
git checkout job-tracker-version1
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your API key

Create a `.env` file in the root (it's gitignored — never committed):

```bash
cp .env.example .env
```

Then open `.env` and paste your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-api03-...
```

Get your key from [console.anthropic.com](https://console.anthropic.com/).

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:4243](http://localhost:4243) in your browser.

## Usage

1. **Add Resume** → Go to *Resume* and paste your plain-text resume. Save it.
2. **Add Jobs** → Click *Add Job*, fill in company, role, job URL, salary range, and paste the job description.
3. **Track Status** → Update status as you move through the pipeline.
4. **AI Match** → From any job detail page, click *Run AI Keyword Match* to see how well your resume fits.
5. **Export** → On the *All Jobs* page, click *Export* to download a JSON backup of all your data.

## Data & Privacy

All data is stored in your **browser's localStorage** — nothing is sent to any server except when you run the AI keyword matcher, which sends your job description and resume to Claude for analysis.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 4243 |
| `npm run build` | Build for production |
| `npm start` | Start production server on port 4243 |
