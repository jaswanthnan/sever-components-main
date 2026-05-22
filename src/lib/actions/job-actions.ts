'use server';

import dbConnect from '@/lib/mongodb';
import Job from '@/lib/models/Job';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getErrorMessage } from '@/lib/errors';
import type { FormState } from '@/types';
import * as Sentry from '@sentry/nextjs';

export async function createJob(prevState: FormState, formData: FormData): Promise<FormState> {
  console.log("Creating job started");
  await dbConnect();

  // Parse raw requirements from newline-separated string
  const requirementsRaw = formData.get('requirements') as string;
  const requirements = requirementsRaw
    ? requirementsRaw.split('\n').map(req => req.trim()).filter(Boolean)
    : [];

  const rawFormData = {
    title: formData.get('title') as string,
    department: formData.get('department') as string,
    location: formData.get('location') as string,
    type: (formData.get('type') as string) || 'Full-time',
    status: (formData.get('status') as string) || 'Open',
    description: formData.get('description') as string,
    salaryRange: formData.get('salaryRange') as string,
    requirements,
  };

  try {
    const job = new Job(rawFormData);
    await job.save();
    console.log("Job created successfully:", rawFormData.title);
  } catch (error) {
    console.error("Create job failed", error);
    Sentry.captureException(error);
    return { ...prevState, error: getErrorMessage(error) };
  }

  revalidatePath('/jobs');
  revalidatePath('/jobs-admin');
  redirect('/jobs-admin');
}

export async function updateJob(id: string, prevState: FormState, formData: FormData): Promise<FormState> {
  console.log(`Updating job ${id} started`);
  await dbConnect();

  const requirementsRaw = formData.get('requirements') as string;
  const requirements = requirementsRaw
    ? requirementsRaw.split('\n').map(req => req.trim()).filter(Boolean)
    : [];

  const rawFormData = {
    title: formData.get('title') as string,
    department: formData.get('department') as string,
    location: formData.get('location') as string,
    type: formData.get('type') as string,
    status: formData.get('status') as string,
    description: formData.get('description') as string,
    salaryRange: formData.get('salaryRange') as string,
    requirements,
  };

  try {
    await Job.findByIdAndUpdate(id, rawFormData);
    console.log(`Job ${id} updated successfully:`, rawFormData.title);
  } catch (error) {
    console.error(`Update job ${id} failed`, error);
    Sentry.captureException(error);
    return { ...prevState, error: getErrorMessage(error) };
  }

  revalidatePath('/jobs');
  revalidatePath(`/jobs/${id}`);
  revalidatePath('/jobs-admin');
  redirect('/jobs-admin');
}

export async function deleteJob(id: string) {
  console.log(`Deleting job ${id} started`);
  await dbConnect();

  try {
    await Job.findByIdAndDelete(id);
    console.log(`Job ${id} deleted successfully`);
    revalidatePath('/jobs');
    revalidatePath('/jobs-admin');
    return { success: true };
  } catch (error) {
    console.error(`Delete job ${id} failed`, error);
    Sentry.captureException(error);
    return { error: getErrorMessage(error) };
  }
}
