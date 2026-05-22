import type { Candidate } from '@/types';

function formatSkills(skills: string[]) {
  return skills.length > 0 ? skills.join(', ') : 'No skills listed';
}

export function buildCandidateContext(candidate: Candidate) {
  return [
    `Candidate Name: ${candidate.name}`,
    `Role Applied: ${candidate.role}`,
    `Experience: ${candidate.experience} years`,
    `Location: ${candidate.location}`,
    `Email: ${candidate.email}`,
    `Skills: ${formatSkills(candidate.skills)}`,
    `Current Recruitment Status: ${candidate.status}`,
  ].join('\n');
}

export function buildCandidateSummaryPrompt(candidate: Candidate, requestPrompt: string) {
  return `
You are a senior recruiting analyst preparing a concise recruiter-ready CV summary.

Use only the candidate information provided below. Do not invent employers, education, certifications, projects, or achievements that were not provided.

Candidate profile:
${buildCandidateContext(candidate)}

User request:
${requestPrompt}

Return markdown with these sections:
### Executive Summary
### Strengths
### Risks And Follow-Ups
### Interview Questions

Keep the tone professional, specific, and practical for a hiring team.
`.trim();
}

export function buildCandidateChatSystemPrompt(candidate: Candidate) {
  return `
You are Claude, acting as a recruiting copilot for a hiring team.

You must answer only from the candidate profile below. If something is missing, say that it is not available in the profile instead of guessing.

Candidate profile:
${buildCandidateContext(candidate)}

Keep answers concise, structured, and useful for recruiters and interviewers.
Prefer bullet points when comparing strengths, risks, or follow-up questions.
`.trim();
}

export function buildFallbackSummary(candidate: Candidate) {
  const strengths =
    candidate.skills.length > 0
      ? candidate.skills
          .slice(0, 4)
          .map((skill) => `- **${skill}** appears prominently in the candidate profile.`)
          .join('\n')
      : '- No technical skills were explicitly listed in the profile.';

  return `
### Executive Summary
**${candidate.name}** is being considered for **${candidate.role}** and is currently in the **${candidate.status}** stage. The profile shows **${candidate.experience} years** of experience and a working location of **${candidate.location}**.

### Strengths
${strengths}
- The profile is complete enough to support an initial recruiter screen and targeted interview planning.

### Risks And Follow-Ups
- The current dataset does not include project history, education, or measurable business outcomes.
- A recruiter should confirm depth of ownership, team size, and domain fit during screening.

### Interview Questions
- Which of the listed skills has been used most recently in production work?
- What kinds of projects best represent success in the **${candidate.role}** role?
- What scope of ownership has the candidate had across delivery, collaboration, and technical decision-making?
`.trim();
}

export function buildFallbackChatReply(candidate: Candidate, userPrompt: string) {
  const prompt = userPrompt.toLowerCase();

  if (prompt.includes('strength') || prompt.includes('skill') || prompt.includes('technical')) {
    return `
- **Top listed skills:** ${formatSkills(candidate.skills)}
- **Role alignment:** The profile is positioned around a **${candidate.role}** track.
- **Experience signal:** ${candidate.experience} years suggests enough depth for targeted technical interviews, but project examples are still needed.
`.trim();
  }

  if (prompt.includes('risk') || prompt.includes('concern') || prompt.includes('gap')) {
    return `
- The profile does not include detailed project history or quantified outcomes.
- Domain specialization is not explicit, so team-specific fit still needs validation.
- A follow-up screen should confirm architecture ownership, team collaboration, and recent hands-on work.
`.trim();
  }

  if (prompt.includes('question') || prompt.includes('interview')) {
    return `
- Ask the candidate to walk through a recent project that best reflects the **${candidate.role}** role.
- Probe the depth of their experience with **${formatSkills(candidate.skills)}**.
- Ask for examples of decision-making, tradeoffs, and cross-functional collaboration.
`.trim();
  }

  return `
- **Candidate:** ${candidate.name}
- **Role:** ${candidate.role}
- **Experience:** ${candidate.experience} years
- **Status:** ${candidate.status}
- **Skills listed:** ${formatSkills(candidate.skills)}

Ask about strengths, risks, or interview questions and I can narrow the evaluation further.
`.trim();
}
