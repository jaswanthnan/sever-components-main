import React from 'react';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import CandidateDetailClient from '@/components/candidates/CandidateDetailClient';
import { candidateQueryKeys } from '@/lib/candidate-queries';
import dbConnect from '@/lib/mongodb';
import Candidate from '@/lib/models/Candidate';
import { getQueryClient } from '@/lib/react-query';
import type { Candidate as CandidateRecord } from '@/types';

function serializeCandidate(candidate: CandidateRecord) {
  return JSON.parse(JSON.stringify(candidate)) as CandidateRecord;
}

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await dbConnect();

  const candidate = await Candidate.findById(id).lean<CandidateRecord | null>();

  if (!candidate) {
    notFound();
  }

  const queryClient = getQueryClient();
  queryClient.setQueryData(candidateQueryKeys.detail(id), serializeCandidate(candidate));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CandidateDetailClient candidateId={id} />
    </HydrationBoundary>
  );
}
