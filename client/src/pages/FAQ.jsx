import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQ = () => {
  const faqs = [
    {
      q: "What is GradForge and who is it for?",
      a: "GradForge is an all-in-one academic and career accelerator for university students, particularly those in their final year. It helps with project roadmaps, resume crafting, portfolio design, thesis writing, and viva defense mock practices."
    },
    {
      q: "Does the AI assistant support coding and database suggestions?",
      a: "Yes! The assistant is powered by Gemini and OpenAI. It can write schemas, outline React components, suggest Git instructions, and critique algorithms."
    },
    {
      q: "Can I download my resumes and assignments as PDF files?",
      a: "Absolutely. GradForge supports printing/downloading resumes and assignments directly to PDF. You can also copy portfolio codes as static HTML/CSS."
    },
    {
      q: "How does the Mock Viva module work?",
      a: "Based on your project title and description, the AI generates custom oral examination questions. Once you type in your answers, it grades them out of 10, provides correct answers, and suggests improvements."
    },
    {
      q: "Is there a limit on free accounts?",
      a: "Free accounts can create 1 resume, 1 portfolio website, generate 1 final year project, write 2 assignments, and access basic AI chat. Upgrading to Premium removes all limits."
    }
  ];

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24 text-left">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-white mb-2">Frequently Asked Questions</h1>
        <p className="text-gray-400 text-xs">Everything you need to know about the GradForge platform.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="rounded-xl bg-white/5 border border-white/5 overflow-hidden">
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-white hover:bg-white/5 transition"
              >
                <span className="text-sm">{faq.q}</span>
                {isOpen ? <ChevronUp size={18} className="text-purple-400" /> : <ChevronDown size={18} className="text-gray-400" />}
              </button>
              
              {isOpen && (
                <div className="px-6 pb-5 pt-1 text-gray-400 text-xs leading-relaxed border-t border-white/5 bg-[#06070a]/40">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQ;
