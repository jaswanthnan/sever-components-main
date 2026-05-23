import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import QueryProvider from '@/components/providers/QueryProvider';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'HireSync Recruitment CRM',
    template: '%s | HireSync CRM',
  },
  description:
    'HireSync is a modern recruitment CRM for candidates, jobs, interviews, search, and hiring workflows.',
  keywords: ['recruitment', 'CRM', 'candidates', 'jobs', 'hiring', 'Next.js'],
  authors: [{ name: 'HireSync Team' }],
  openGraph: {
    type: 'website',
    siteName: 'HireSync Recruitment CRM',
    title: 'HireSync Recruitment CRM',
    description: 'Manage candidates, jobs, and recruitment workflows seamlessly.',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HireSync Recruitment CRM',
    description: 'Manage candidates, jobs, and recruitment workflows seamlessly.',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <SessionProvider>
          <QueryProvider>{children}</QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
