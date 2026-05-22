import { anthropic } from '@ai-sdk/anthropic';
import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import dbConnect from '@/lib/mongodb';
import Candidate from '@/lib/models/Candidate';
import type { Candidate as CandidateRecord } from '@/types';
import {
  buildCandidateSummaryPrompt,
  buildFallbackSummary,
} from '@/lib/ai/candidate-prompts';

export const maxDuration = 30;

function createTextStreamResponse(text: string) {
  const encoder = new TextEncoder();
  let offset = 0;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const push = () => {
        if (offset >= text.length) {
          controller.close();
          return;
        }

        const chunk = text.slice(offset, offset + 24);
        offset += 24;
        controller.enqueue(encoder.encode(chunk));
        setTimeout(push, 20);
      };

      push();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  const { id } = await params;
  const { prompt } = (await request.json()) as { prompt?: string };
  const candidate = await Candidate.findById(id).lean<CandidateRecord | null>();

  if (!candidate) {
    return new Response('Candidate not found', { status: 404 });
  }

  const normalizedPrompt =
    prompt?.trim() || 'Create a recruiter-ready CV summary for this candidate.';

  if (!process.env.GROQ_API_KEY && !process.env.ANTHROPIC_API_KEY) {
    return createTextStreamResponse(buildFallbackSummary(candidate));
  }

  const model = process.env.GROQ_API_KEY
    ? groq('llama-3.3-70b-versatile')
    : anthropic('claude-3-5-sonnet-latest');

  const result = streamText({
    model,
    prompt: buildCandidateSummaryPrompt(candidate, normalizedPrompt),
  });

  return result.toTextStreamResponse();
}
