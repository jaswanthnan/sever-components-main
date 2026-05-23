import { z } from 'zod';

export const candidateStatusSchema = z.enum([
  'Applied',
  'Screening',
  'Interviewing',
  'Offered',
  'Rejected',
  'Hired',
]);

export const candidateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.string().min(2, 'Role must be at least 2 characters'),
  experience: z.string().min(1, 'Experience is required'),
  status: z.enum(['Pending', 'In Review', 'Hired', 'Rejected'], {
    message: 'Please select a valid status'
  }),
  skills: z.array(
    z.object({
      name: z.string().min(1, 'Skill cannot be empty')
    })
  ).optional()
});

export const serverCandidateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.string().min(2, 'Role must be at least 2 characters'),
  experience: z.union([z.number(), z.string().transform(val => Number(val))]),
  location: z.string().min(2, 'Location is required').optional().default('Remote'),
  status: candidateStatusSchema.optional().default('Applied'),
  skills: z.array(z.string()).optional().default([]),
  resumeUrl: z.string().optional()
});

export const nextCandidateFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  role: z.string().min(2, 'Role must be at least 2 characters'),
  experience: z.number().min(0, 'Experience must be 0 or more'),
  location: z.string().min(2, 'Location is required'),
  status: candidateStatusSchema,
  skills: z.array(z.string()).min(1, 'Select at least one skill'),
  resumeUrl: z.string().optional(),
});

export type CandidateFormValues = z.infer<typeof candidateSchema>;
export type NextCandidateFormValues = z.infer<typeof nextCandidateFormSchema>;
export type ServerCandidateInput = z.infer<typeof serverCandidateSchema>;
