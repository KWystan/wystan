import { useState, useEffect } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

const MAX_MESSAGE_LENGTH = 500;

export default function Guestbook() {
  const [entries, setEntries] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [ref, visible] = useScrollReveal();

  useEffect(() => {
    fetch('/api/guestbook')
      .then((res) => res.json())
      .then((data) => setEntries(data.entries || []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = message.trim();
    if (!text) return;

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || 'Anonymous',
          message: text,
        }),
      });

      if (!res.ok) throw new Error('Failed to post message. Please try again.');

      const data = await res.json();
      setEntries((prev) => [data.entry, ...prev]);
      setName('');
      setMessage('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <section className="py-8 md:py-10 border-t border-black/6 border-line-animate">
      <div className="max-w-5xl mx-auto px-6 border-l border-black/7 border-line-animate">
        <div style={{ animation: `fade-up 0.3s var(--ease-out-expo) both` }}>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-black leading-tight">
            Guestbook
          </h1>
          <p className="text-xs text-black/40 mt-1">Leave a note, say hello, or just share your thoughts</p>
        </div>

        <div ref={ref} className={`scroll-reveal ${visible ? 'revealed' : ''} mt-5`}>
          <form onSubmit={handleSubmit} className="border border-black/10 rounded-lg p-4 mb-5">
            <div className="mb-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (optional)"
                maxLength={60}
                disabled={isLoading}
                className="w-full bg-white text-black text-xs rounded-lg px-3 py-2 outline-none placeholder:text-black/35 border border-black/10 focus:border-black/25 transition-all duration-150 disabled:opacity-50"
              />
            </div>
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write something..."
                maxLength={MAX_MESSAGE_LENGTH}
                rows={3}
                disabled={isLoading}
                required
                className="w-full bg-white text-black text-xs rounded-lg px-3 py-2 resize-none outline-none placeholder:text-black/35 border border-black/10 focus:border-black/25 transition-all duration-150 disabled:opacity-50"
              />
              <span className="absolute -bottom-4 right-1 text-[9px] text-black/25">
                {message.length}/{MAX_MESSAGE_LENGTH}
              </span>
            </div>

            {error && (
              <div className="mt-3 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-[10px] text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-3 px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-[10px] text-green-700">
                Message posted! Thank you ??
              </div>
            )}

            <div className="flex justify-end mt-4">
              <button type="submit" disabled={!message.trim() || isLoading}
                className="text-xs font-medium px-4 py-2 rounded-lg border border-black/15 text-black/65 hover:border-black/35 hover:text-black active:scale-[0.97] transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? 'Posting...' : 'Sign Guestbook'}
              </button>
            </div>
          </form>

          <div className="space-y-2">
            {entries.length === 0 ? (
              <div className="text-center py-8">
                <span className="material-symbols-outlined text-3xl text-black/15">forum</span>
                <p className="text-xs text-black/35 mt-2">No messages yet. Be the first!</p>
              </div>
            ) : (
              entries.map((entry) => (
                <div key={entry.id} className="border border-black/8 rounded-lg px-4 py-3 transition-all duration-150 hover:border-black/15">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-black/70">{entry.name}</span>
                    <span className="text-[9px] text-black/30">{formatDate(entry.createdAt)}</span>
                  </div>
                  <p className="text-xs text-black/55 leading-relaxed">{entry.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
