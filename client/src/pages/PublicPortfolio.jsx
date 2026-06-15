import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  Globe, Github, Linkedin, Mail, Send, CheckCircle, Loader, Terminal
} from 'lucide-react';

const PublicPortfolio = () => {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Visitor message details
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitorMessage, setVisitorMessage] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState(false);

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/portfolios/public/${slug}`);
        if (res.data.success) {
          setPortfolio(res.data.portfolio);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Portfolio not found or private.');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [slug]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!visitorName.trim() || !visitorEmail.trim() || !visitorMessage.trim()) return;

    setSendingMsg(true);
    setMsgSuccess(false);
    try {
      const res = await axios.post(`/api/portfolios/contact/${slug}`, {
        name: visitorName,
        email: visitorEmail,
        message: visitorMessage
      });

      if (res.data.success) {
        setMsgSuccess(true);
        setVisitorName('');
        setVisitorEmail('');
        setVisitorMessage('');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to transmit message.');
    } finally {
      setSendingMsg(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06070a] flex flex-col items-center justify-center gap-3">
        <Loader size={36} className="animate-spin text-purple-400" />
        <p className="text-xs text-gray-500">Loading portfolio details...</p>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-[#06070a] flex flex-col items-center justify-center gap-3 text-center p-4">
        <Globe size={48} className="text-gray-600" />
        <h2 className="text-lg font-bold text-white">Portfolio Private or Not Found</h2>
        <p className="text-xs text-gray-400 max-w-xs">{error || 'Verify slug path in parameters.'}</p>
      </div>
    );
  }

  const { personalInfo, projects, skills, template } = portfolio;

  // Template styles configuration
  const isLight = template === 'light-minimal';
  const isCyber = template === 'neon-cyber';

  const bodyBg = isLight 
    ? 'bg-gray-50 text-gray-800' 
    : isCyber 
      ? 'bg-[#0b0c10] text-[#c5c6c7] font-mono' 
      : 'bg-[#06070a] text-gray-200';

  const containerClass = isLight 
    ? 'bg-white border border-gray-200 shadow-md' 
    : isCyber 
      ? 'bg-[#1f2833]/40 border border-[#66fcf1]/30 shadow-lg shadow-[#66fcf1]/5' 
      : 'bg-white/5 border border-white/5 backdrop-blur-md shadow-xl';

  const textHeading = isLight 
    ? 'text-gray-900' 
    : isCyber 
      ? 'text-[#66fcf1]' 
      : 'text-white';

  const textAccent = isLight 
    ? 'text-indigo-650' 
    : isCyber 
      ? 'text-[#45f3ff]' 
      : 'text-purple-400';

  return (
    <div className={`min-h-screen py-16 px-4 sm:px-6 lg:px-8 transition-colors ${bodyBg}`}>
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Header Block */}
        <header className="text-center space-y-6">
          {personalInfo.avatar && (
            <img 
              src={personalInfo.avatar} 
              alt={personalInfo.name} 
              className={`w-28 h-28 rounded-full mx-auto object-cover border-2 shadow-lg ${isCyber ? 'border-[#66fcf1]' : 'border-purple-500'}`} 
            />
          )}
          
          <div className="space-y-2">
            <h1 className={`text-4xl sm:text-5xl font-extrabold ${textHeading}`}>{personalInfo.name || 'Student Name'}</h1>
            <p className={`text-lg font-semibold ${textAccent}`}>{personalInfo.title || 'Technical Role'}</p>
          </div>

          <p className="text-xs max-w-xl mx-auto leading-relaxed text-gray-400 italic">
            "{personalInfo.bio || 'Summary of experience...'}"
          </p>

          <div className="flex justify-center gap-4 text-xs font-semibold">
            {personalInfo.github && (
              <a href={personalInfo.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:underline text-gray-400 hover:text-white transition">
                <Github size={14} /> GitHub
              </a>
            )}
            {personalInfo.linkedin && (
              <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:underline text-gray-400 hover:text-white transition">
                <Linkedin size={14} /> LinkedIn
              </a>
            )}
            {personalInfo.email && (
              <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-1.5 hover:underline text-gray-400 hover:text-white transition">
                <Mail size={14} /> Email
              </a>
            )}
          </div>
        </header>

        {/* Technical Skills Grid */}
        {skills.length > 0 && (
          <section className="space-y-6 text-left">
            <h2 className={`text-xl font-bold border-b pb-2 ${isLight ? 'border-gray-200' : 'border-white/5'} ${textHeading}`}>Technical Skills</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {skills.map((group, idx) => (
                <div key={idx} className={`p-5 rounded-2xl ${containerClass}`}>
                  <h3 className={`font-bold text-sm mb-2 ${textHeading}`}>{group.category}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{group.list?.join(', ')}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Showcase */}
        {projects.length > 0 && (
          <section className="space-y-6 text-left">
            <h2 className={`text-xl font-bold border-b pb-2 ${isLight ? 'border-gray-200' : 'border-white/5'} ${textHeading}`}>Featured Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {projects.map((proj, idx) => (
                <div key={idx} className={`p-6 rounded-2xl flex flex-col justify-between ${containerClass} space-y-4`}>
                  <div className="space-y-2">
                    <h3 className={`font-bold text-sm ${textHeading}`}>{proj.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{proj.description}</p>
                    {proj.techStack?.length > 0 && (
                      <p className={`text-[10px] font-bold ${textAccent}`}>
                        Tech: {proj.techStack.join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-4 text-xs font-semibold pt-2">
                    {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="underline hover:text-white transition">GitHub</a>}
                    {proj.demoUrl && <a href={proj.demoUrl} target="_blank" rel="noreferrer" className="underline hover:text-white transition">Live Demo</a>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact Form inbox hook */}
        <section className="space-y-6 text-left">
          <h2 className={`text-xl font-bold border-b pb-2 ${isLight ? 'border-gray-200' : 'border-white/5'} ${textHeading}`}>Get In Touch</h2>
          
          {msgSuccess ? (
            <div className={`p-6 rounded-2xl text-center flex flex-col items-center gap-3 ${containerClass}`}>
              <CheckCircle className="text-emerald-400" size={32} />
              <h4 className="font-bold text-white text-sm">Message Sent!</h4>
              <p className="text-xs text-gray-400">Your message has been logged inside the portfolio visitor inbox.</p>
              <button onClick={() => setMsgSuccess(false)} className="mt-2 text-xs font-semibold underline hover:text-white transition">Send another message</button>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className={`p-6 rounded-2xl space-y-4 ${containerClass}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-400 uppercase font-semibold">Your Name</label>
                  <input
                    type="text"
                    required
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    placeholder="Jane Doe"
                    className={`px-3 py-2 text-xs rounded-lg border focus:outline-none focus:ring-1 transition ${
                      isLight 
                        ? 'bg-gray-50 border-gray-200 text-gray-800 focus:border-indigo-500 focus:ring-indigo-500' 
                        : 'bg-black/30 border-white/5 text-white focus:border-purple-500 focus:ring-purple-500'
                    }`}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-400 uppercase font-semibold">Email Address</label>
                  <input
                    type="email"
                    required
                    value={visitorEmail}
                    onChange={(e) => setVisitorEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className={`px-3 py-2 text-xs rounded-lg border focus:outline-none focus:ring-1 transition ${
                      isLight 
                        ? 'bg-gray-50 border-gray-200 text-gray-800 focus:border-indigo-500 focus:ring-indigo-500' 
                        : 'bg-black/30 border-white/5 text-white focus:border-purple-500 focus:ring-purple-500'
                    }`}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase font-semibold">Message</label>
                <textarea
                  required
                  rows={4}
                  value={visitorMessage}
                  onChange={(e) => setVisitorMessage(e.target.value)}
                  placeholder="Hello! I saw your projects..."
                  className={`px-3 py-2 text-xs rounded-lg border focus:outline-none focus:ring-1 transition resize-none ${
                    isLight 
                      ? 'bg-gray-50 border-gray-200 text-gray-800 focus:border-indigo-500 focus:ring-indigo-500' 
                      : 'bg-black/30 border-white/5 text-white focus:border-purple-500 focus:ring-purple-500'
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={sendingMsg}
                className={`w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition ${
                  isLight 
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow' 
                    : isCyber 
                      ? 'bg-transparent border border-[#66fcf1] text-[#66fcf1] hover:bg-[#66fcf1]/10' 
                      : 'bg-purple-600 hover:bg-purple-500 text-white shadow shadow-purple-500/20'
                }`}
              >
                {sendingMsg ? <Loader size={12} className="animate-spin" /> : <Send size={12} />}
                <span>Send Message</span>
              </button>
            </form>
          )}
        </section>

        {/* Footer */}
        <footer className="text-center text-[10px] text-gray-500 pt-8 border-t border-white/5">
          <p>Created via GradForge student webpage accelerators.</p>
        </footer>

      </div>
    </div>
  );
};

export default PublicPortfolio;
