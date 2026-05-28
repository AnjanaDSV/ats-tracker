import { NextRequest, NextResponse } from 'next/server';

const MAX_SIZE_MB = 10;
const MAX_BYTES = MAX_SIZE_MB * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_SIZE_MB} MB.` },
        { status: 400 },
      );
    }

    const name = file.name.toLowerCase();
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ── Plain text ────────────────────────────────────────────────────────────
    if (name.endsWith('.txt')) {
      const text = buffer.toString('utf-8');
      return NextResponse.json({ text: text.trim() });
    }

    // ── DOCX ──────────────────────────────────────────────────────────────────
    if (name.endsWith('.docx')) {
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      return NextResponse.json({ text: result.value.trim() });
    }

    // ── PDF ───────────────────────────────────────────────────────────────────
    if (name.endsWith('.pdf')) {
      // Use the lib path directly to avoid pdf-parse loading test fixtures in dev
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require('pdf-parse/lib/pdf-parse.js');
      const data = await pdfParse(buffer);
      return NextResponse.json({ text: (data.text as string).trim() });
    }

    return NextResponse.json(
      { error: 'Unsupported file type. Please upload a .pdf, .docx, or .txt file.' },
      { status: 400 },
    );
  } catch (err: unknown) {
    console.error('[/api/parse-resume]', err);
    const msg = err instanceof Error ? err.message : 'Failed to parse file.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
