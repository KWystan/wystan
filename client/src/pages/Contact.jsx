import { useState } from 'react';
import { contact } from '../data/portfolioData';
import useScrollReveal from '../hooks/useScrollReveal';

export default function Contact() {
  const [ref, visible] = useScrollReveal();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [feedback, setFeedback] = useState('');

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setStatus('loading');
    setFeedback('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject || 'No subject',
          message: form.message,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setFeedback(data.message || 'Message received! I\'ll get back to you soon.');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
        setFeedback(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setFeedback('Network error. Please check your connection and try again.');
    }
  };

  return (
    <section className="py-8 md:py-10 border-t border-black/6 border-line-animate">
      <div className="max-w-5xl mx-auto px-6 border-l border-black/7 border-line-animate">
        <div style={{ animation: 'fade-up 0.3s var(--ease-out-expo) both' }}>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-black leading-tight">
            Contact
          </h1>
          <p className="text-xs text-black/40 mt-1">{contact.availability}</p>
        </div>

        <div ref={ref} className={`scroll-reveal ${visible ? 'revealed' : ''} mt-5 max-w-xl`}>
          {/* ï¿½ Quick subject chips ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {contact.subjects.map((s) => (
              <button key={s} onClick={() => setForm((prev) => ({ ...prev, subject: s }))}
                className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all duration-150 active:scale-[0.97] cursor-pointer ${
                  form.subject === s
                    ? 'bg-black/5 border-black/20 text-black/70'
                    : 'border-black/8 text-black/40 hover:border-black/20'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* ï¿½ Form ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½ */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input type="text" value={form.name} onChange={handleChange('name')} placeholder="Your name" required
                className="w-full bg-white text-black text-xs rounded-lg px-3 py-2 outline-none placeholder:text-black/35 border border-black/10 focus:border-black/25 transition-all duration-150" />
              <input type="email" value={form.email} onChange={handleChange('email')} placeholder="Your email" required
                className="w-full bg-white text-black text-xs rounded-lg px-3 py-2 outline-none placeholder:text-black/35 border border-black/10 focus:border-black/25 transition-all duration-150" />
            </div>
            <input type="text" value={form.subject} onChange={handleChange('subject')} placeholder="Subject (optional)"
              className="w-full bg-white text-black text-xs rounded-lg px-3 py-2 outline-none placeholder:text-black/35 border border-black/10 focus:border-black/25 transition-all duration-150" />
            <textarea value={form.message} onChange={handleChange('message')} placeholder="Your message..." rows={4} required
              className="w-full bg-white text-black text-xs rounded-lg px-3 py-2 resize-none outline-none placeholder:text-black/35 border border-black/10 focus:border-black/25 transition-all duration-150" />

            {status === 'success' && (
              <div className="px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-[10px] text-green-700">
                {feedback}
              </div>
            )}
            {status === 'error' && (
              <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-[10px] text-red-600">
                {feedback}
              </div>
            )}

            <div className="flex justify-end">
              <button type="submit" disabled={status === 'loading'}
                className="text-xs font-medium px-4 py-2 rounded-lg border border-black/15 text-black/65 hover:border-black/35 hover:text-black active:scale-[0.97] transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-black/6">
            <p className="text-[10px] text-black/35 mb-2">Or reach out directly:</p>
            <a href={`mailto:${contact.email}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-black/15 text-sm text-black/65 hover:border-black/35 hover:text-black active:scale-[0.97] transition-all duration-150"
            >
              <span className="material-symbols-outlined text-[14px]">mail</span>
              {contact.email}
            </a>
            <p className="text-[10px] text-black/35 mt-1">{contact.responseTime}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
