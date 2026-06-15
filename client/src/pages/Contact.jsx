import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('[SUPPORT EMAIL SENT]', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 text-left">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-white mb-2">Get In Touch</h1>
        <p className="text-gray-400 text-xs">Have questions or feedback? Drop us a line.</p>
      </div>

      {submitted ? (
        <div className="p-8 rounded-2xl glass-panel text-center flex flex-col items-center gap-4">
          <CheckCircle className="text-emerald-400" size={40} />
          <h3 className="text-lg font-bold text-white">Message Received!</h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            Thank you for contacting support. Our academic assistants will get back to you shortly.
          </p>
          <button onClick={() => setSubmitted(false)} className="mt-4 px-6 py-2 btn-cyber text-xs font-semibold">
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-8 rounded-2xl glass-panel space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-300">Your Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Alex Mercer"
              className="glass-input text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-300">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="alex@university.edu"
              className="glass-input text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-300">Message</label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="How can we help you..."
              className="glass-input text-sm resize-none"
            />
          </div>

          <button type="submit" className="w-full py-3 btn-cyber flex items-center justify-center gap-2 font-semibold text-sm">
            <Send size={16} />
            <span>Send Message</span>
          </button>
        </form>
      )}
    </div>
  );
};

export default Contact;
