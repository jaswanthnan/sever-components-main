import { ImageResponse } from 'next/og';
import dbConnect from '@/lib/mongodb';
import Job from '@/lib/models/Job';
import type { Job as JobRecord } from '@/types';

export const alt = 'Careers at HireSync';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Force node runtime for reliable Mongoose DB connectivity in Next.js API/OG generation
export const runtime = 'nodejs';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let title = 'Build the Future of HR';
  let dept = 'Engineering';
  let loc = 'Remote';
  let type = 'Full-time';

  try {
    await dbConnect();
    const job = await Job.findById(id).lean<JobRecord>();
    if (job) {
      title = job.title;
      dept = job.department;
      loc = job.location;
      type = job.type;
    }
  } catch (error) {
    console.error('Error fetching job details for dynamic OG image:', error);
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #090d16 0%, #1e1b4b 60%, #311042 100%)',
          padding: '80px',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top: Branding and Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                background: '#4f46e5',
                padding: '8px 16px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Briefcase SVG icon */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <span
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                letterSpacing: '-0.05em',
              }}
            >
              Hire<span style={{ color: '#818cf8' }}>Sync</span> Careers
            </span>
          </div>
          <span
            style={{
              fontSize: '16px',
              fontWeight: '900',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: '#a5b4fc',
              background: 'rgba(79, 70, 229, 0.15)',
              padding: '6px 16px',
              borderRadius: '20px',
              border: '1px solid rgba(79, 70, 229, 0.3)',
            }}
          >
            Hiring Now
          </span>
        </div>

        {/* Middle: Job Title and Department */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginTop: '40px',
            marginBottom: '40px',
            maxWidth: '1000px',
          }}
        >
          <span
            style={{
              fontSize: '18px',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: '#818cf8',
            }}
          >
            {dept}
          </span>
          <h1
            style={{
              fontSize: '64px',
              fontWeight: '900',
              letterSpacing: '-0.03em',
              lineHeight: '1.1',
              color: 'white',
              margin: '0',
            }}
          >
            {title}
          </h1>
        </div>

        {/* Bottom: Metadatas */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '32px',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '16px',
            }}
          >
            {/* Location Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '10px 20px',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <span style={{ fontSize: '18px', color: '#cbd5e1', fontWeight: '500' }}>
                📍 {loc}
              </span>
            </div>
            {/* Type Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '10px 20px',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <span style={{ fontSize: '18px', color: '#cbd5e1', fontWeight: '500' }}>
                💼 {type}
              </span>
            </div>
          </div>

          <span
            style={{
              fontSize: '18px',
              color: '#94a3b8',
              fontWeight: '600',
            }}
          >
            hiresync.com/careers
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
