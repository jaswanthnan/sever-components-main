'use server';

import dbConnect from '@/lib/mongodb';
import Candidate from '@/lib/models/Candidate';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getErrorMessage } from '@/lib/errors';
import type { FormState } from '@/types';
import * as Sentry from '@sentry/nextjs';

export async function createCandidate(prevState: FormState, formData: FormData): Promise<FormState> {
  console.log("Creating candidate started");
  await dbConnect();
  
  const rawFormData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    role: formData.get('role') as string,
    experience: Number(formData.get('experience')),
    location: formData.get('location') as string,
    status: (formData.get('status') as string) || 'Applied',
    skills: formData.getAll('skills') as string[],
  };

  try {
    const candidate = new Candidate(rawFormData);
    await candidate.save();
    console.log("Candidate created successfully:", rawFormData.name);
  } catch (error) {
    console.error("Create candidate failed", error);
    Sentry.captureException(error);
    return { ...prevState, error: getErrorMessage(error) };
  }

  revalidatePath('/candidates');
  redirect('/candidates');
}

export async function updateCandidate(id: string, prevState: FormState, formData: FormData): Promise<FormState> {
  console.log(`Updating candidate ${id} started`);
  await dbConnect();
  
  const rawFormData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    role: formData.get('role') as string,
    experience: Number(formData.get('experience')),
    location: formData.get('location') as string,
    status: formData.get('status') as string,
    skills: formData.getAll('skills') as string[],
  };

  try {
    await Candidate.findByIdAndUpdate(id, rawFormData);
    console.log(`Candidate ${id} updated successfully:`, rawFormData.name);
  } catch (error) {
    console.error(`Update candidate ${id} failed`, error);
    Sentry.captureException(error);
    return { ...prevState, error: getErrorMessage(error) };
  }

  revalidatePath('/candidates');
  revalidatePath(`/candidates/${id}`);
  redirect('/candidates');
}

export async function deleteCandidate(id: string) {
  console.log(`Deleting candidate ${id} started`);
  await dbConnect();
  
  try {
    await Candidate.findByIdAndDelete(id);
    console.log(`Candidate ${id} deleted successfully`);
    revalidatePath('/candidates');
    return { success: true };
  } catch (error) {
    console.error(`Delete candidate ${id} failed`, error);
    Sentry.captureException(error);
    return { error: getErrorMessage(error) };
  }
}
