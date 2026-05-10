"use client";

import { useState } from 'react';
import { AppFrame } from '@/components/shared/app-frame';
import { PageTitle } from '@/components/shared/page-title';
import { Icon } from '@/components/shared/icon';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface FeedbackEntry {
  id: string;
  message: string;
  createdAt: string;
}

const INITIAL_FEEDBACK: FeedbackEntry[] = [
  {
    id: 'f-1',
    message: 'The dashboard loading speed could be improved for large projects.',
    createdAt: '2026-05-08T10:00:00Z',
  },
  {
    id: 'f-2',
    message: 'Love the new budget tracking feature! It has saved us a lot of time.',
    createdAt: '2026-05-05T14:30:00Z',
  },
  {
    id: 'f-3',
    message: 'Can we add a feature to export reports as Excel files?',
    createdAt: '2026-05-01T09:15:00Z',
  },
  {
    id: 'f-4',
    message: 'The mobile view for scenes list is a bit cramped.',
    createdAt: '2026-04-25T16:45:00Z',
  },
  {
    id: 'f-5',
    message: 'Integration with Slack would be great for team notifications.',
    createdAt: '2026-04-20T11:20:00Z',
  },
];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<FeedbackEntry[]>(INITIAL_FEEDBACK);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newEntry: FeedbackEntry = {
        id: `f-${Date.now()}`,
        message: message.trim(),
        createdAt: new Date().toISOString(),
      };

      setFeedback(prev => [newEntry, ...prev]);
      setMessage('');
      setIsSubmitting(false);
      toast.success('Feedback submitted! Thank you.');
    }, 600);
  }

  return (
    <AppFrame>
      <div className="flex flex-col h-full">
        <PageTitle title="Feedback" sub="Help us improve Studio OS" />

        <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] gap-6 flex-1 min-h-0 mt-6">
          {/* Feedback Form */}
          <div className="flex flex-col gap-4">
            <div className="card p-6">
              <h2 className="text-[16px] font-bold text-[#f9fafb] mb-4">Share your thoughts</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="relative">
                  <textarea
                    className="w-full min-h-[200px] bg-[rgba(255,255,255,.03)] border border-[rgba(255,255,255,.1)] rounded-xl p-4 text-[14px] text-[#f0f2f5] outline-none focus:border-[#6366f1] transition-all resize-none placeholder:text-gray-600"
                    placeholder="Tell us what's on your mind, report a bug, or suggest a new feature..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary px-8"
                    disabled={!message.trim() || isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </div>
              </form>
            </div>
            
          </div>

          {/* Feedback History */}
          <div className="flex flex-col min-h-0">
            {/* <h2 className="text-[14px] font-bold text-[#f9fafb] mb-3 px-1 flex items-center gap-2">
              <Icon name="clock" size={14} className="text-gray-500" />
              Recent Feedback
            </h2> */}
            <div className="card flex-1 min-h-0 overflow-hidden relative">
              <ScrollArea className="h-full">
                <div className="p-4 flex flex-col gap-4">
                  {feedback.length === 0 ? (
                    <div className="py-8 text-center text-gray-500 text-[13px]">
                      No feedback submitted yet.
                    </div>
                  ) : (
                    feedback.map((entry) => (
                      <div key={entry.id} className="border-b border-[rgba(255,255,255,.05)] last:border-0 pb-4 last:pb-0">
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">
                          {fmtDate(entry.createdAt)}
                        </div>
                        <div className="text-[13px] text-[#d1d5db] leading-relaxed">
                          {entry.message}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}
