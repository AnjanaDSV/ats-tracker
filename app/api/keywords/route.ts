import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Create client inside the handler so process.env is read at request time,
  // not at module-init time (which can be before Next.js finishes loading .env.local)
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('[/api/keywords] ANTHROPIC_API_KEY is not set');
    return NextResponse.json(
      { error: 'Server misconfiguration: API key not found. Check .env.local.' },
      { status: 500 },
    );
  }
  const client = new Anthropic({ apiKey });

  const { jobDescription, resume } = await request.json();

  if (!jobDescription?.trim()) {
    return NextResponse.json(
      { error: 'Job description is required.' },
      { status: 400 },
    );
  }
  if (!resume?.trim()) {
    return NextResponse.json(
      { error: 'No resume found. Please add your resume on the Resume page.' },
      { status: 400 },
    );
  }

  const prompt = `You are an expert ATS (Applicant Tracking System) keyword analyzer.

Carefully analyze the job description and compare it against the candidate's resume.

Extract the important keywords, skills, tools, and requirements from the job description, then determine which ones appear in the resume and which are missing.

Focus on:
- Technical skills and tools (e.g., Python, React, SQL, AWS)
- Soft skills (e.g., leadership, communication)
- Domain knowledge (e.g., machine learning, product management)
- Certifications or qualifications
- Key action verbs and responsibilities

Job Description:
---
${jobDescription}
---

Candidate Resume:
---
${resume}
---

Return ONLY a valid JSON object (no markdown code fences, no explanation) with exactly this shape:
{
  "matchingKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword3", "keyword4"],
  "matchScore": 72,
  "summary": "2-3 sentence analysis of the match quality and key recommendations."
}`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      return NextResponse.json(
        { error: 'Unexpected response from AI.' },
        { status: 500 },
      );
    }

    // Strip any accidental markdown fences
    const raw = content.text
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const analysis = JSON.parse(raw);
    return NextResponse.json(analysis);
  } catch (err: unknown) {
    console.error('[/api/keywords] error:', err);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
