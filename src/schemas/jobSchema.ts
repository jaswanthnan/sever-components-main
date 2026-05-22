import { z } from 'zod';

export const jobSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  department: z.string().min(2, 'Department must be at least 2 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  type: z.enum(['Full-time', 'Part-time', 'Contract', 'Remote'], {
    message: 'Please select a valid job type'
  }),
  status: z.enum(['Open', 'Closed', 'Draft'], {
    message: 'Please select a valid job status'
  }).optional().default('Open'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  salaryRange: z.string().optional(),
  requirements: z.array(z.string()).optional().default([])
});

export type JobFormValues = z.infer<typeof jobSchema>;
