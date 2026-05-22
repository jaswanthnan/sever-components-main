'use client';

import React, { useEffect, useRef, useState } from 'react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { useChat, useCompletion } from '@ai-sdk/react';
import {
  Cpu,
  MessageSquare,
  RefreshCw,
  Send,
  Sparkles,
  StopCircle,
  TriangleAlert,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface CvSummaryPanelProps {
  candidateId: string;
  candidateName: string;
}

type PanelTab = 'summary' | 'chat';

const summaryPrompt = 'Create a recruiter-ready CV summary for this candidate.';

const suggestionChips = [
  {
    label: 'Technical strengths',
    prompt: "What are this candidate's most relevant technical strengths for the role?",
  },
  {
    label: 'Potential risks',
    prompt: 'What follow-up risks or missing details should a recruiter validate?',
  },
  {
    label: 'Interview questions',
    prompt: 'Give me three targeted interview questions for this candidate.',
  },
];

function renderMarkdown(text: string) {
  return text.split('\n').map((line, index) => {
    if (line.startsWith('### ')) {
      return (
        <h3
          key={index}
          className="text-base font-black text-slate-900 dark:text-white mt-5 mb-2"
        >
          {line.slice(4)}
        </h3>
      );
    }

    if (line.startsWith('- ')) {
      return (
        <div
          key={index}
          className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300 my-2"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
          <span>{line.slice(2)}</span>
        </div>
      );
    }

    if (line.trim() === '') {
      return <div key={index} className="h-2" />;
    }

    return (
      <p
        key={index}
        className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed my-1.5"
      >
        {line}
      </p>
    );
  });
}

function getMessageText(message: UIMessage) {
  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('');
}

export default function CvSummaryPanel({
  candidateId,
  candidateName,
}: CvSummaryPanelProps) {
  const [activeTab, setActiveTab] = useState<PanelTab>('summary');
  const [chatInput, setChatInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const {
    completion,
    complete,
    error: summaryError,
    isLoading: isSummaryLoading,
    setCompletion,
    stop: stopSummary,
  } = useCompletion({
    api: `/api/candidates/${candidateId}/summary`,
    streamProtocol: 'text',
    experimental_throttle: 50,
  });

  const {
    messages,
    error: chatError,
    sendMessage,
    status,
    stop: stopChat,
  } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: { candidateId },
    }),
  });

  const isChatLoading = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    setCompletion('');
    void complete(summaryPrompt);
  }, [candidateId, complete, setCompletion]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isChatLoading]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[680px]">
      <div className="p-6 bg-gradient-to-br from-indigo-50/50 via-white to-sky-50/40 dark:from-indigo-950/10 dark:to-slate-950 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 dark:text-white tracking-tight text-base">
              Claude CV Copilot
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Summary and recruiter Q&A for {candidateName}
            </p>
          </div>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'summary'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Summary
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Chat
          </button>
        </div>
      </div>

      <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800 flex gap-2 overflow-x-auto">
        {suggestionChips.map((chip) => (
          <button
            key={chip.label}
            onClick={() => {
              setActiveTab('chat');
              sendMessage({ text: chip.prompt });
            }}
            className="flex-shrink-0 px-3 py-1 bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
          >
            {chip.label}
          </button>
        ))}
      </div>

      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 bg-slate-50/20">
        <AnimatePresence mode="wait">
          {activeTab === 'summary' ? (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="space-y-4"
            >
              {summaryError ? (
                <div className="rounded-3xl border border-rose-200 bg-rose-50 text-rose-700 p-4 text-sm">
                  {summaryError.message}
                </div>
              ) : null}

              {!completion && isSummaryLoading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-5 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 w-4/5 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              ) : (
                <div className="rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950/30 p-5">
                  {renderMarkdown(completion)}
                </div>
              )}

              {isSummaryLoading && completion ? (
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-500">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Claude is still streaming the summary...
                </div>
              ) : null}
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="space-y-4"
            >
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center h-[360px] p-6 space-y-4">
                  <div className="h-16 w-16 bg-gradient-to-tr from-indigo-100 to-sky-100 dark:from-indigo-950/30 dark:to-slate-900 rounded-3xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                  <div className="max-w-xs">
                    <h4 className="font-black text-slate-800 dark:text-slate-100 text-base">
                      Ask targeted recruiter questions
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      Use the chips above or ask your own question about fit,
                      risks, strengths, or interview follow-ups.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isUser = message.role === 'user';

                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isUser ? (
                          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-600 flex items-center justify-center text-white flex-shrink-0 text-xs font-bold shadow-md shadow-indigo-150">
                            C
                          </div>
                        ) : null}

                        <div
                          className={`max-w-[85%] rounded-3xl p-4 text-sm leading-relaxed ${
                            isUser
                              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-br-sm'
                              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-sm shadow-sm'
                          }`}
                        >
                          {renderMarkdown(getMessageText(message))}
                        </div>
                      </div>
                    );
                  })}

                  {isChatLoading ? (
                    <div className="flex gap-3 justify-start">
                      <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-600 flex items-center justify-center text-white flex-shrink-0 text-xs font-bold shadow-md shadow-indigo-150">
                        C
                      </div>
                      <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl rounded-bl-sm flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" />
                        <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:150ms]" />
                        <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              {chatError ? (
                <div className="rounded-3xl border border-rose-200 bg-rose-50 text-rose-700 p-4 text-sm flex items-start gap-2">
                  <TriangleAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{chatError.message}</span>
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        {activeTab === 'summary' ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => void complete(summaryPrompt)}
              disabled={isSummaryLoading}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 py-3 rounded-2xl text-sm font-bold transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSummaryLoading ? 'animate-spin' : ''}`} />
              {isSummaryLoading ? 'Generating summary...' : 'Regenerate Summary'}
            </button>
            <button
              onClick={stopSummary}
              disabled={!isSummaryLoading}
              className="h-11 w-11 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-40 flex items-center justify-center"
              aria-label="Stop summary stream"
            >
              <StopCircle className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();

              if (!chatInput.trim()) {
                return;
              }

              sendMessage({ text: chatInput });
              setChatInput('');
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              placeholder="Ask Claude about fit, risks, or interview strategy..."
              disabled={isChatLoading}
              className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {isChatLoading ? (
              <button
                type="button"
                onClick={stopChat}
                className="h-11 w-11 flex items-center justify-center border border-slate-200 dark:border-slate-700 text-slate-500 rounded-2xl"
                aria-label="Stop chat stream"
              >
                <StopCircle className="w-4 h-4" />
              </button>
            ) : null}
            <button
              type="submit"
              disabled={isChatLoading || !chatInput.trim()}
              className="h-11 w-11 flex items-center justify-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
