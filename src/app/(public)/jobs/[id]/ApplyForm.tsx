'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, Award, FileText, CheckCircle2, User, Mail, Sparkles } from 'lucide-react';

interface ApplyFormProps {
  jobTitle: string;
  jobLocation: string;
}

export default function ApplyForm({ jobTitle, jobLocation }: ApplyFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [experience, setExperience] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [skillsStr, setSkillsStr] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    // Pre-validation
    if (!name || name.trim().length < 2) {
      setErrorMsg('Name must be at least 2 characters.');
      setIsSubmitting(false);
      return;
    }
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      setIsSubmitting(false);
      return;
    }
    const expNum = Number(experience);
    if (isNaN(expNum) || expNum < 0) {
      setErrorMsg('Please enter a valid number of years of experience.');
      setIsSubmitting(false);
      return;
    }

    const skills = skillsStr
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    try {
      const response = await fetch('/api/candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          role: jobTitle,
          experience: expNum,
          location: jobLocation || 'Remote',
          skills,
          resumeUrl: resumeUrl.trim() || undefined,
          status: 'Applied',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application.');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95 cursor-pointer"
      >
        <Sparkles className="w-5 h-5" />
        Apply Now
      </button>

      {isOpen && mounted && typeof window !== 'undefined'
        ? createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
              <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-slate-200/50 dark:border-slate-800 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                      Careers Platform
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                      Apply for this Position
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setIsSuccess(false);
                      setErrorMsg('');
                    }}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-rose-500 transition-all cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Scrollable Form Body */}
                <div className="px-8 py-6 overflow-y-auto flex-1 min-h-0">
                  {isSuccess ? (
                    <div className="text-center py-10 space-y-6 animate-in zoom-in-95 duration-500">
                      <div className="inline-flex p-4 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-full">
                        <CheckCircle2 className="w-16 h-16" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                          Application Submitted!
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-sm">
                          Thank you for applying, <span className="font-bold text-slate-900 dark:text-white">{name}</span>!
                          We have received your application for the <span className="font-bold text-indigo-600 dark:text-indigo-400">{jobTitle}</span> role.
                          We will review it and get in touch with you shortly.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          setIsSuccess(false);
                          setName('');
                          setEmail('');
                          setExperience('');
                          setResumeUrl('');
                          setSkillsStr('');
                        }}
                        className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold transition-all cursor-pointer"
                      >
                        Done
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {errorMsg && (
                        <div className="p-4 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-bold border border-rose-100 dark:border-rose-950/50">
                          {errorMsg}
                        </div>
                      )}

                      {/* Name field */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                          <input
                            type="text"
                            required
                            placeholder="John Doe"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-sm text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>

                      {/* Email field */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                          <input
                            type="email"
                            required
                            placeholder="john@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-sm text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>

                      {/* Experience field */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                          Years of Relevant Experience *
                        </label>
                        <div className="relative">
                          <Award className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                          <input
                            type="number"
                            required
                            min="0"
                            placeholder="e.g. 3"
                            value={experience}
                            onChange={e => setExperience(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-sm text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>

                      {/* Skills field */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                          Skills (comma separated)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. React, Node.js, TypeScript, Next.js"
                          value={skillsStr}
                          onChange={e => setSkillsStr(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-sm text-slate-900 dark:text-white"
                        />
                      </div>

                      {/* Resume URL field */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                          Resume Link / Portfolio Link
                        </label>
                        <div className="relative">
                          <FileText className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                          <input
                            type="url"
                            placeholder="e.g. https://my-portfolio.com/resume.pdf"
                            value={resumeUrl}
                            onChange={e => setResumeUrl(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-sm text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>

                      {/* Submit button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95 cursor-pointer mt-4"
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Submit Application
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
