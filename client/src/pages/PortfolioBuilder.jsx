import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
  Globe, Plus, Trash2, Loader, Save, Code, Copy, Upload, Mail, ShieldAlert, Sparkles, MessageSquare
} from 'lucide-react';

const PortfolioBuilder = () => {
  const { user } = useContext(AuthContext);
  
  const [slug, setSlug] = useState('');
  const [template, setTemplate] = useState('dark-glass');
  const [personalInfo, setPersonalInfo] = useState({ name: '', title: '', bio: '', avatar: '', email: '', github: '', linkedin: '' });
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [newSkillCategory, setNewSkillCategory] = useState('');
  const [newSkillList, setNewSkillList] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [contactMessages, setContactMessages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [exportModal, setExportModal] = useState(false);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/portfolios/me');
      if (res.data.success && res.data.portfolio) {
        const port = res.data.portfolio;
        setSlug(port.slug || '');
        setTemplate(port.template || 'dark-glass');
        setPersonalInfo(port.personalInfo || { name: '', title: '', bio: '', avatar: '', email: '', github: '', linkedin: '' });
        setProjects(port.projects || []);
        setSkills(port.skills || []);
        setIsPublished(port.isPublished || false);
        setContactMessages(port.contactMessages || []);
      }
    } catch (err) {
      console.log('Portfolio not created yet.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!slug.trim()) {
      alert('Custom URL slug is required.');
      return;
    }

    setSaving(true);
    const portData = { slug, template, personalInfo, projects, skills, isPublished };

    try {
      const res = await axios.post('/api/portfolios', portData);
      if (res.data.success) {
        alert('Portfolio configuration saved successfully!');
        fetchPortfolio();
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save portfolio.');
    } finally {
      setSaving(false);
    }
  };

  // Avatar Upload Handler
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    setUploading(true);
    try {
      const res = await axios.post('/api/portfolios/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setPersonalInfo(prev => ({ ...prev, avatar: res.data.url }));
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed. Try images less than 5MB.');
    } finally {
      setUploading(false);
    }
  };

  // Add/Remove project showcase
  const addProject = () => setProjects([...projects, { title: '', description: '', image: '', techStack: [], demoUrl: '', githubUrl: '' }]);
  const updateProject = (idx, field, val) => {
    const updated = [...projects];
    if (field === 'techStack') {
      updated[idx][field] = val.split(',').map(s => s.trim());
    } else {
      updated[idx][field] = val;
    }
    setProjects(updated);
  };
  const removeProject = (idx) => setProjects(projects.filter((_, i) => i !== idx));

  // Add/Remove skill group
  const addSkillGroup = (e) => {
    e.preventDefault();
    if (!newSkillCategory.trim() || !newSkillList.trim()) return;
    const newList = newSkillList.split(',').map(s => s.trim()).filter(Boolean);
    setSkills([...skills, { category: newSkillCategory.trim(), list: newList }]);
    setNewSkillCategory('');
    setNewSkillList('');
  };
  const removeSkillGroup = (idx) => setSkills(skills.filter((_, i) => i !== idx));

  // Expose static HTML code
  const getStaticCode = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${personalInfo.name || 'Student'} | Portfolio</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <style>
    body { background-color: #0d0e12; color: #f3f4f6; font-family: sans-serif; }
    .glass { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); backdrop-filter: blur(8px); }
  </style>
</head>
<body class="min-h-screen py-16 px-4">
  <div class="max-w-4xl mx-auto space-y-12">
    <!-- Header -->
    <header class="text-center space-y-4">
      ${personalInfo.avatar ? `<img src="${personalInfo.avatar}" class="w-24 h-24 rounded-full mx-auto border-2 border-purple-500 shadow-lg" />` : ''}
      <h1 class="text-3xl sm:text-5xl font-extrabold text-white">${personalInfo.name || 'Your Name'}</h1>
      <p className="text-purple-400 text-lg font-medium">${personalInfo.title || 'Professional Title'}</p>
      <p class="text-gray-400 max-w-lg mx-auto text-sm leading-relaxed">${personalInfo.bio || 'Bio summary...'}</p>
    </header>

    <!-- Skills -->
    <section class="space-y-4">
      <h2 class="text-xl font-bold text-white border-b border-gray-800 pb-2">Technical Skills</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        ${skills.map(group => `
          <div class="p-4 rounded-xl glass">
            <h3 class="font-bold text-white text-sm mb-2">${group.category}</h3>
            <p class="text-xs text-gray-400">${group.list.join(', ')}</p>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- Projects -->
    <section class="space-y-6">
      <h2 class="text-xl font-bold text-white border-b border-gray-800 pb-2">Projects</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        ${projects.map(proj => `
          <div class="p-6 rounded-xl glass space-y-3">
            <h3 class="font-bold text-white">${proj.title}</h3>
            <p class="text-xs text-gray-400">${proj.description}</p>
            <p class="text-[10px] text-purple-400 font-bold">Tech: ${proj.techStack.join(', ')}</p>
            <div class="flex gap-4 text-xs">
              ${proj.githubUrl ? `<a href="${proj.githubUrl}" class="underline text-gray-300">GitHub</a>` : ''}
              ${proj.demoUrl ? `<a href="${proj.demoUrl}" class="underline text-gray-300">Demo</a>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  </div>
</body>
</html>`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getStaticCode());
    alert('Code copied to clipboard!');
  };

  return (
    <div className="text-left space-y-8">
      
      {/* Portfolio header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Portfolio Builder</h1>
          <p className="text-gray-400 text-xs mt-1">Configure layout, publish slug webpages, and export static host source code.</p>
        </div>
        <div className="flex gap-2.5">
          <button onClick={() => setExportModal(true)} className="px-4 py-2 bg-white/5 border border-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition">
            <Code size={14} /> Export HTML Code
          </button>
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 btn-cyber rounded-lg text-xs font-semibold flex items-center gap-1.5 transition">
            {saving ? <Loader size={14} className="animate-spin" /> : <Save size={14} />} Save Settings
          </button>
        </div>
      </div>

      {/* Main layout options */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* EDIT OPTIONS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* URL slug details */}
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2"><Globe size={16} /> Web Hosting Configuration</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase font-semibold">Custom Slug URL path</label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-white/5 border border-r-0 border-white/5 rounded-l-lg text-[11px] text-gray-500 select-none">/portfolio/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="john-doe"
                    className="flex-grow px-3 py-2 bg-white/5 border border-white/5 rounded-r-lg text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase font-semibold">Theme template</label>
                <select value={template} onChange={(e) => setTemplate(e.target.value)} className="glass-input text-xs bg-darkBg">
                  <option value="dark-glass">Dark Glass (Cyan/Blue blur)</option>
                  <option value="neon-cyber">Neon Cyberpunk (Indigo/Purple glow)</option>
                  <option value="light-minimal">Light Minimal (Paper/Clean)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="publish-check"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 text-purple-600 border-white/10 rounded focus:ring-purple-500 bg-white/5"
              />
              <label htmlFor="publish-check" className="text-xs font-semibold text-gray-300 cursor-pointer">
                Publish Portfolio live to student path URL
              </label>
            </div>
          </div>

          {/* Personal Biography */}
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <h3 className="text-sm font-bold text-white">Biography & Contact</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase font-semibold font-mono">Full Name</label>
                <input type="text" value={personalInfo.name} onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })} placeholder="Ananya Mehta" className="glass-input text-xs" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase font-semibold font-mono">Professional Title</label>
                <input type="text" value={personalInfo.title} onChange={(e) => setPersonalInfo({ ...personalInfo, title: e.target.value })} placeholder="Software Engineering Student" className="glass-input text-xs" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase font-semibold font-mono">Email Address</label>
                <input type="email" value={personalInfo.email} onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })} placeholder="ananya@gmail.com" className="glass-input text-xs" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase font-semibold font-mono">Avatar / Profile Picture</label>
                <div className="flex items-center gap-3">
                  <input type="text" value={personalInfo.avatar} readOnly placeholder="Uploaded URL..." className="glass-input text-xs flex-grow cursor-not-allowed bg-white/5" />
                  <label className="px-3 py-2 bg-white/5 border border-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5">
                    {uploading ? <Loader size={12} className="animate-spin" /> : <Upload size={12} />}
                    <span>Upload</span>
                    <input type="file" onChange={handleAvatarUpload} accept="image/*" className="hidden" />
                  </label>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="GitHub username link" value={personalInfo.github} onChange={(e) => setPersonalInfo({ ...personalInfo, github: e.target.value })} className="glass-input text-xs" />
              <input type="text" placeholder="LinkedIn profile link" value={personalInfo.linkedin} onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })} className="glass-input text-xs" />
            </div>
            <textarea placeholder="Write a short summary about yourself..." rows={3} value={personalInfo.bio} onChange={(e) => setPersonalInfo({ ...personalInfo, bio: e.target.value })} className="glass-input text-xs w-full resize-none" />
          </div>

          {/* Technical Skills Category Groups */}
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <h3 className="text-sm font-bold text-white">Skill Groups</h3>
            <form onSubmit={addSkillGroup} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input type="text" placeholder="Category (e.g. Backend)" required value={newSkillCategory} onChange={(e) => setNewSkillCategory(e.target.value)} className="glass-input text-xs" />
              <input type="text" placeholder="Skills (comma separated)" required value={newSkillList} onChange={(e) => setNewSkillList(e.target.value)} className="glass-input text-xs sm:col-span-2" />
              <button type="submit" className="px-4 py-2 btn-cyber text-xs font-semibold rounded-lg sm:col-span-3">Add Skill Category</button>
            </form>

            <div className="space-y-3">
              {skills.map((skillGroup, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="text-xs">
                    <strong className="text-white font-bold">{skillGroup.category}:</strong>
                    <span className="text-gray-400 ml-2">{skillGroup.list.join(', ')}</span>
                  </div>
                  <button onClick={() => removeSkillGroup(idx)} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Showcase project list */}
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">Project Showcase</h3>
              <button onClick={addProject} className="px-2.5 py-1 rounded bg-white/5 border border-white/5 hover:bg-white/10 text-[10px] font-bold text-gray-300 flex items-center gap-1"><Plus size={10} /> Add</button>
            </div>
            {projects.map((proj, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3 relative">
                <button onClick={() => removeProject(idx)} className="absolute top-4 right-4 text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Project Title" value={proj.title} onChange={(e) => updateProject(idx, 'title', e.target.value)} className="glass-input text-xs" />
                  <input type="text" placeholder="Tech Stack (comma separated)" value={proj.techStack ? proj.techStack.join(', ') : ''} onChange={(e) => updateProject(idx, 'techStack', e.target.value)} className="glass-input text-xs" />
                  <input type="text" placeholder="GitHub Repository link" value={proj.githubUrl} onChange={(e) => updateProject(idx, 'githubUrl', e.target.value)} className="glass-input text-xs" />
                  <input type="text" placeholder="Live Demo link" value={proj.demoUrl} onChange={(e) => updateProject(idx, 'demoUrl', e.target.value)} className="glass-input text-xs" />
                </div>
                <textarea placeholder="Description of the project..." rows={3} value={proj.description} onChange={(e) => updateProject(idx, 'description', e.target.value)} className="glass-input text-xs w-full resize-none" />
              </div>
            ))}
          </div>

        </div>

        {/* INBOX MESSAGES & STATUS */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2"><MessageSquare size={16} className="text-purple-400" /> Visitor Messages</h3>
            {contactMessages.length === 0 ? (
              <p className="text-xs text-gray-500">No contact messages received yet from your public webpage.</p>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {contactMessages.map((msg, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-gray-500">
                      <strong>{msg.name} ({msg.email})</strong>
                      <span>{new Date(msg.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed italic">"{msg.message}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* EXPORT CODE MODAL */}
      {exportModal && (
        <div className="fixed inset-0 z-50 bg-[#06070a]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl glass-panel border border-white/10 flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Export Static HTML/CSS Code</h3>
              <button onClick={() => setExportModal(false)} className="text-gray-400 hover:text-white">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto">
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                Copy this single-file HTML code. It contains all your biography, projects, and skills configured with Tailwind CSS framework styles, ready to deploy on Netlify or GitHub pages!
              </p>
              <pre className="p-4 rounded-xl bg-black/50 border border-white/5 text-[10px] font-mono text-purple-300 overflow-x-auto text-left max-h-[300px]">
                {getStaticCode()}
              </pre>
            </div>
            <div className="p-4 border-t border-white/5 flex justify-end gap-2.5">
              <button onClick={() => setExportModal(false)} className="px-4 py-2 border border-white/10 rounded-lg text-xs font-semibold">Close</button>
              <button onClick={handleCopyCode} className="px-4 py-2 btn-cyber text-xs font-semibold rounded-lg flex items-center gap-1"><Copy size={12} /> Copy Code</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PortfolioBuilder;
