import { anthropic } from '@ai-sdk/anthropic';
import { groq } from '@ai-sdk/groq';
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  type UIMessage,
} from 'ai';
import dbConnect from '@/lib/mongodb';
import Candidate from '@/lib/models/Candidate';
import type { Candidate as CandidateRecord } from '@/types';
import {
  buildCandidateChatSystemPrompt,
  buildFallbackChatReply,
} from '@/lib/ai/candidate-prompts';

export const maxDuration = 30;

function createFallbackChatResponse(
  messages: UIMessage[],
  candidate: CandidateRecord,
  userPrompt: string
) {
  const content = buildFallbackChatReply(candidate, userPrompt);
  const textId = crypto.randomUUID();

  return createUIMessageStreamResponse({
    stream: createUIMessageStream({
      originalMessages: messages,
      execute: async ({ writer }) => {
        writer.write({ type: 'text-start', id: textId });

        for (let index = 0; index < content.length; index += 24) {
          writer.write({
            type: 'text-delta',
            id: textId,
            delta: content.slice(index, index + 24),
          });

          await new Promise((resolve) => setTimeout(resolve, 20));
        }

        writer.write({ type: 'text-end', id: textId });
      },
    }),
  });
}

export async function POST(request: Request) {
  await dbConnect();

  const {
    candidateId,
    messages,
  } = (await request.json()) as {
    candidateId?: string;
    messages: UIMessage[];
  };

  if (!candidateId) {
    return new Response(JSON.stringify({ error: 'Candidate id is required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const candidate = await Candidate.findById(candidateId).lean<CandidateRecord | null>();

  if (!candidate) {
    return new Response(JSON.stringify({ error: 'Candidate not found.' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const lastUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === 'user');
  const userPrompt =
    lastUserMessage?.parts
      .filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join(' ') ?? '';

  if (!process.env.GROQ_API_KEY && !process.env.ANTHROPIC_API_KEY) {
    return createFallbackChatResponse(messages, candidate, userPrompt);
  }

  const modelMessages = await convertToModelMessages(messages);

  const model = process.env.GROQ_API_KEY
    ? groq('llama-3.3-70b-versatile')
    : anthropic('claude-3-5-sonnet-latest');

  const result = streamText({
    model,
    system: buildCandidateChatSystemPrompt(candidate),
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
