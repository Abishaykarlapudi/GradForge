import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
  Plus, Trash2, FileText, Sparkles, Loader, Save, Printer, Edit3, Grid
} from 'lucide-react';

const ResumeBuilder = () => {
  const { user } = useContext(AuthContext);
  const [resumes, setResumes] = useState([]);
  const [activeResumeId, setActiveResumeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Resume form fields state
  const [title, setTitle] = useState('My Resume');
  const [template, setTemplate] = useState('modern');
  const [personalInfo, setPersonalInfo] = useState({ name: '', email: '', phone: '', github: '', linkedin: '', website: '', summary: '' });
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/resumes');
      if (res.data.success) {
        setResumes(res.data.resumes);
        if (res.data.resumes.length > 0) {
          loadResumeIntoForm(res.data.resumes[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadResumeIntoForm = (res) => {
    setActiveResumeId(res._id);
    setTitle(res.title || 'My Resume');
    setTemplate(res.template || 'modern');
    setPersonalInfo(res.personalInfo || { name: '', email: '', phone: '', github: '', linkedin: '', website: '', summary: '' });
    setEducation(res.education || []);
    setExperience(res.experience || []);
    setSkills(res.skills || []);
    setProjects(res.projects || []);
    setCertifications(res.certifications || []);
  };

  const handleCreateNew = () => {
    setActiveResumeId(null);
    setTitle('New Resume');
    setTemplate('modern');
    setPersonalInfo({ name: '', email: '', phone: '', github: '', linkedin: '', website: '', summary: '' });
    setEducation([]);
    setExperience([]);
    setSkills([]);
    setProjects([]);
    setCertifications([]);
  };

  const handleSave = async () => {
    setSaving(true);
    const resumeData = { title, template, personalInfo, education, experience, skills, projects, certifications };

    try {
      if (activeResumeId) {
        const res = await axios.put(`/api/resumes/${activeResumeId}`, resumeData);
        if (res.data.success) {
          alert('Resume updated successfully!');
          fetchResumes();
        }
      } else {
        const res = await axios.post('/api/resumes', resumeData);
        if (res.data.success) {
          alert('Resume created successfully!');
          setActiveResumeId(res.data.resume._id);
          fetchResumes();
        }
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save resume.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resume?')) return;
    try {
      const res = await axios.delete(`/api/resumes/${id}`);
      if (res.data.success) {
        if (activeResumeId === id) handleCreateNew();
        fetchResumes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // List helpers
  const addEdu = () => setEducation([...education, { school: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '', gpa: '' }]);
  const updateEdu = (idx, field, val) => {
    const updated = [...education];
    updated[idx][field] = val;
    setEducation(updated);
  };
  const removeEdu = (idx) => setEducation(education.filter((_, i) => i !== idx));

  const addExp = () => setExperience([...experience, { company: '', role: '', location: '', startDate: '', endDate: '', description: '' }]);
  const updateExp = (idx, field, val) => {
    const updated = [...experience];
    updated[idx][field] = val;
    setExperience(updated);
  };
  const removeExp = (idx) => setExperience(experience.filter((_, i) => i !== idx));

  const addProj = () => setProjects([...projects, { title: '', description: '', techStack: [], githubUrl: '', demoUrl: '' }]);
  const updateProj = (idx, field, val) => {
    const updated = [...projects];
    if (field === 'techStack') {
      updated[idx][field] = val.split(',').map(s => s.trim());
    } else {
      updated[idx][field] = val;
    }
    setProjects(updated);
  };
  const removeProj = (idx) => setProjects(projects.filter((_, i) => i !== idx));

  const addCert = () => setCertifications([...certifications, { name: '', issuer: '', year: '' }]);
  const updateCert = (idx, field, val) => {
    const updated = [...certifications];
    updated[idx][field] = val;
    setCertifications(updated);
  };
  const removeCert = (idx) => setCertifications(certifications.filter((_, i) => i !== idx));

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => setSkills(skills.filter(s => s !== skill));

  // High quality HTML print renderer
  const handlePrint = () => {
    const printContent = document.getElementById('resume-preview-sheet').innerHTML;
    const originalContent = document.body.innerHTML;

    // Create a temporary window or print frame
    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            @media print {
              body { background-color: white; color: black; }
            }
            body { font-family: sans-serif; padding: 2rem; background-color: white; color: #1f2937; }
          </style>
        </head>
        <body>
          <div class="max-w-4xl mx-auto">${printContent}</div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div className="text-left space-y-6">
      
      {/* Resume dashboard header options */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Resume Builder</h1>
          <p className="text-gray-400 text-xs mt-1">Design ATS-optimized documents with real-time feedback templates.</p>
        </div>
        <div className="flex gap-2.5">
          <button onClick={handleCreateNew} className="px-4 py-2 bg-white/5 border border-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition">
            <Plus size={14} /> New Resume
          </button>
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 btn-cyber rounded-lg text-xs font-semibold flex items-center gap-1.5 transition">
            {saving ? <Loader size={14} className="animate-spin" /> : <Save size={14} />} Save Draft
          </button>
          <button onClick={handlePrint} className="px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 text-purple-400 hover:bg-purple-600/30 transition">
            <Printer size={14} /> Download PDF
          </button>
        </div>
      </div>

      {/* Resumes Selectors */}
      {resumes.length > 0 && (
        <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-wrap gap-2">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mr-2">
            <Grid size={12} /> Saved Resumes:
          </span>
          {resumes.map(r => (
            <div key={r._id} className={`flex items-center gap-2 px-3 py-1 rounded-lg border text-xs font-medium ${activeResumeId === r._id ? 'bg-purple-600/20 border-purple-500 text-purple-400' : 'bg-white/5 border-white/5 text-gray-300'}`}>
              <button onClick={() => loadResumeIntoForm(r)} className="hover:underline">{r.title}</button>
              <button onClick={() => handleDelete(r._id)} className="text-red-400 hover:text-red-300"><Trash2 size={12} /></button>
            </div>
          ))}
        </div>
      )}

      {/* Builder dual pane workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* EDIT PANE */}
        <div className="space-y-6 max-h-[700px] overflow-y-auto pr-2">
          
          {/* Resume title & template choice */}
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2"><Edit3 size={16} /> Basic Options</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase font-semibold">Resume Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="glass-input text-xs" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase font-semibold">Template Layout</label>
                <select value={template} onChange={(e) => setTemplate(e.target.value)} className="glass-input text-xs bg-darkBg">
                  <option value="modern">Modern (Indigo)</option>
                  <option value="minimal">Minimal (Clean)</option>
                  <option value="cyber">Cyberpunk (Void/Neon)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <h3 className="text-sm font-bold text-white">Personal Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" value={personalInfo.name} onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })} className="glass-input text-xs" />
              <input type="email" placeholder="Email" value={personalInfo.email} onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })} className="glass-input text-xs" />
              <input type="text" placeholder="Phone" value={personalInfo.phone} onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })} className="glass-input text-xs" />
              <input type="text" placeholder="GitHub link" value={personalInfo.github} onChange={(e) => setPersonalInfo({ ...personalInfo, github: e.target.value })} className="glass-input text-xs" />
              <input type="text" placeholder="LinkedIn link" value={personalInfo.linkedin} onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })} className="glass-input text-xs" />
              <input type="text" placeholder="Portfolio URL" value={personalInfo.website} onChange={(e) => setPersonalInfo({ ...personalInfo, website: e.target.value })} className="glass-input text-xs" />
            </div>
            <textarea placeholder="Professional summary..." rows={3} value={personalInfo.summary} onChange={(e) => setPersonalInfo({ ...personalInfo, summary: e.target.value })} className="glass-input text-xs w-full resize-none" />
          </div>

          {/* Education Pane */}
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">Education History</h3>
              <button onClick={addEdu} className="px-2 py-1 rounded bg-white/5 border border-white/5 hover:bg-white/10 text-[10px] font-bold text-gray-300 flex items-center gap-1"><Plus size={10} /> Add</button>
            </div>
            {education.map((edu, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3 relative">
                <button onClick={() => removeEdu(idx)} className="absolute top-4 right-4 text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="School/University" value={edu.school} onChange={(e) => updateEdu(idx, 'school', e.target.value)} className="glass-input text-xs" />
                  <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => updateEdu(idx, 'degree', e.target.value)} className="glass-input text-xs" />
                  <input type="text" placeholder="Field of Study" value={edu.fieldOfStudy} onChange={(e) => updateEdu(idx, 'fieldOfStudy', e.target.value)} className="glass-input text-xs" />
                  <input type="text" placeholder="GPA / Grade" value={edu.gpa} onChange={(e) => updateEdu(idx, 'gpa', e.target.value)} className="glass-input text-xs" />
                  <input type="text" placeholder="Start Year" value={edu.startYear} onChange={(e) => updateEdu(idx, 'startYear', e.target.value)} className="glass-input text-xs" />
                  <input type="text" placeholder="End Year" value={edu.endYear} onChange={(e) => updateEdu(idx, 'endYear', e.target.value)} className="glass-input text-xs" />
                </div>
              </div>
            ))}
          </div>

          {/* Experience Pane */}
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">Work Experience</h3>
              <button onClick={addExp} className="px-2 py-1 rounded bg-white/5 border border-white/5 hover:bg-white/10 text-[10px] font-bold text-gray-300 flex items-center gap-1"><Plus size={10} /> Add</button>
            </div>
            {experience.map((exp, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3 relative">
                <button onClick={() => removeExp(idx)} className="absolute top-4 right-4 text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Company Name" value={exp.company} onChange={(e) => updateExp(idx, 'company', e.target.value)} className="glass-input text-xs" />
                  <input type="text" placeholder="Role / Position" value={exp.role} onChange={(e) => updateExp(idx, 'role', e.target.value)} className="glass-input text-xs" />
                  <input type="text" placeholder="Location" value={exp.location} onChange={(e) => updateExp(idx, 'location', e.target.value)} className="glass-input text-xs" />
                  <input type="text" placeholder="Start Date" value={exp.startDate} onChange={(e) => updateExp(idx, 'startDate', e.target.value)} className="glass-input text-xs" />
                  <input type="text" placeholder="End Date" value={exp.endDate} onChange={(e) => updateExp(idx, 'endDate', e.target.value)} className="glass-input text-xs" />
                </div>
                <textarea placeholder="Job description..." rows={3} value={exp.description} onChange={(e) => updateExp(idx, 'description', e.target.value)} className="glass-input text-xs w-full resize-none" />
              </div>
            ))}
          </div>

          {/* Skills Section */}
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <h3 className="text-sm font-bold text-white">Skills List</h3>
            <form onSubmit={handleAddSkill} className="flex gap-2">
              <input type="text" placeholder="React.js, Node.js..." value={newSkill} onChange={(e) => setNewSkill(e.target.value)} className="glass-input text-xs flex-grow" />
              <button type="submit" className="px-4 py-2 btn-cyber text-xs font-semibold rounded-lg">Add</button>
            </form>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span key={idx} className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 border border-white/5 text-xs text-gray-300">
                  <span>{skill}</span>
                  <button type="button" onClick={() => removeSkill(skill)} className="text-red-400 hover:text-red-300">&times;</button>
                </span>
              ))}
            </div>
          </div>

          {/* Projects Pane */}
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">Project Showcase</h3>
              <button onClick={addProj} className="px-2 py-1 rounded bg-white/5 border border-white/5 hover:bg-white/10 text-[10px] font-bold text-gray-300 flex items-center gap-1"><Plus size={10} /> Add</button>
            </div>
            {projects.map((proj, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3 relative">
                <button onClick={() => removeProj(idx)} className="absolute top-4 right-4 text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Project Title" value={proj.title} onChange={(e) => updateProj(idx, 'title', e.target.value)} className="glass-input text-xs" />
                  <input type="text" placeholder="Tech Stack (comma separated)" value={proj.techStack ? proj.techStack.join(', ') : ''} onChange={(e) => updateProj(idx, 'techStack', e.target.value)} className="glass-input text-xs" />
                  <input type="text" placeholder="GitHub URL" value={proj.githubUrl} onChange={(e) => updateProj(idx, 'githubUrl', e.target.value)} className="glass-input text-xs" />
                  <input type="text" placeholder="Live Demo URL" value={proj.demoUrl} onChange={(e) => updateProj(idx, 'demoUrl', e.target.value)} className="glass-input text-xs" />
                </div>
                <textarea placeholder="Project description..." rows={3} value={proj.description} onChange={(e) => updateProj(idx, 'description', e.target.value)} className="glass-input text-xs w-full resize-none" />
              </div>
            ))}
          </div>

          {/* Certifications Pane */}
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">Certifications</h3>
              <button onClick={addCert} className="px-2 py-1 rounded bg-white/5 border border-white/5 hover:bg-white/10 text-[10px] font-bold text-gray-300 flex items-center gap-1"><Plus size={10} /> Add</button>
            </div>
            {certifications.map((cert, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3 relative">
                <button onClick={() => removeCert(idx)} className="absolute top-4 right-4 text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                <div className="grid grid-cols-3 gap-3">
                  <input type="text" placeholder="Certification Name" value={cert.name} onChange={(e) => updateCert(idx, 'name', e.target.value)} className="glass-input text-xs col-span-2" />
                  <input type="text" placeholder="Issuer" value={cert.issuer} onChange={(e) => updateCert(idx, 'issuer', e.target.value)} className="glass-input text-xs" />
                  <input type="text" placeholder="Year" value={cert.year} onChange={(e) => updateCert(idx, 'year', e.target.value)} className="glass-input text-xs" />
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* PREVIEW SHEET PANE */}
        <div className="hidden lg:block bg-white text-gray-800 p-8 rounded-2xl shadow-xl overflow-y-auto max-h-[700px] border border-white/10 select-none">
          <div id="resume-preview-sheet" className="p-4 bg-white text-gray-800 space-y-6">
            
            {/* Dynamic CSS styles depending on template choice */}
            <div className="text-center space-y-2 pb-6 border-b border-gray-200">
              <h2 className={`text-2xl font-bold tracking-tight uppercase ${template === 'modern' ? 'text-indigo-600' : template === 'cyber' ? 'text-purple-600 font-mono tracking-widest' : 'text-gray-900'}`}>
                {personalInfo.name || 'Your Name'}
              </h2>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-500 font-medium">
                {personalInfo.email && <span>{personalInfo.email}</span>}
                {personalInfo.phone && <span>{personalInfo.phone}</span>}
                {personalInfo.website && <span className="underline">{personalInfo.website}</span>}
                {personalInfo.github && <span>GitHub: {personalInfo.github}</span>}
                {personalInfo.linkedin && <span>LinkedIn: {personalInfo.linkedin}</span>}
              </div>
            </div>

            {/* Summary */}
            {personalInfo.summary && (
              <div className="space-y-1.5 text-left">
                <h4 className={`text-[10px] font-extrabold uppercase tracking-wider ${template === 'modern' ? 'text-indigo-600' : template === 'cyber' ? 'text-purple-600 font-mono' : 'text-gray-800'}`}>Summary</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{personalInfo.summary}</p>
              </div>
            )}

            {/* Education list */}
            {education.length > 0 && (
              <div className="space-y-3 text-left">
                <h4 className={`text-[10px] font-extrabold uppercase tracking-wider ${template === 'modern' ? 'text-indigo-600' : template === 'cyber' ? 'text-purple-600 font-mono' : 'text-gray-800'}`}>Education</h4>
                {education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between items-start text-xs">
                    <div>
                      <span className="font-bold text-gray-800">{edu.school || 'School Name'}</span>
                      <p className="text-gray-500 text-[11px] mt-0.5">{edu.degree} in {edu.fieldOfStudy}</p>
                    </div>
                    <div className="text-right text-gray-500 text-[11px]">
                      <span>{edu.startYear} - {edu.endYear}</span>
                      {edu.gpa && <p className="font-medium mt-0.5">GPA: {edu.gpa}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Experience list */}
            {experience.length > 0 && (
              <div className="space-y-4 text-left">
                <h4 className={`text-[10px] font-extrabold uppercase tracking-wider ${template === 'modern' ? 'text-indigo-600' : template === 'cyber' ? 'text-purple-600 font-mono' : 'text-gray-800'}`}>Experience</h4>
                {experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-gray-800">{exp.company || 'Company'}</span>
                        <span className="text-gray-500 text-[11px] ml-2">({exp.location})</span>
                      </div>
                      <span className="text-gray-500 text-[11px]">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <p className="font-medium text-gray-700 text-[11px]">{exp.role}</p>
                    <p className="text-gray-600 text-[11px] leading-relaxed pt-0.5 whitespace-pre-line">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Skills list */}
            {skills.length > 0 && (
              <div className="space-y-2 text-left">
                <h4 className={`text-[10px] font-extrabold uppercase tracking-wider ${template === 'modern' ? 'text-indigo-600' : template === 'cyber' ? 'text-purple-600 font-mono' : 'text-gray-800'}`}>Skills</h4>
                <p className="text-xs text-gray-700 leading-relaxed font-medium">{skills.join(', ')}</p>
              </div>
            )}

            {/* Projects list */}
            {projects.length > 0 && (
              <div className="space-y-4 text-left">
                <h4 className={`text-[10px] font-extrabold uppercase tracking-wider ${template === 'modern' ? 'text-indigo-600' : template === 'cyber' ? 'text-purple-600 font-mono' : 'text-gray-800'}`}>Projects</h4>
                {projects.map((proj, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-800">{proj.title || 'Project Title'}</span>
                      <div className="flex gap-2 text-[10px] text-gray-500">
                        {proj.githubUrl && <span className="underline">Code</span>}
                        {proj.demoUrl && <span className="underline">Demo</span>}
                      </div>
                    </div>
                    {proj.techStack?.length > 0 && <p className="text-indigo-600 text-[10px] font-bold">Tech: {proj.techStack.join(', ')}</p>}
                    <p className="text-gray-600 text-[11px] leading-relaxed whitespace-pre-line">{proj.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Certifications list */}
            {certifications.length > 0 && (
              <div className="space-y-2 text-left">
                <h4 className={`text-[10px] font-extrabold uppercase tracking-wider ${template === 'modern' ? 'text-indigo-600' : template === 'cyber' ? 'text-purple-600 font-mono' : 'text-gray-800'}`}>Certifications</h4>
                {certifications.map((cert, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs text-gray-700">
                    <span><strong className="text-gray-800">{cert.name}</strong> ({cert.issuer})</span>
                    <span className="text-[11px] text-gray-500">{cert.year}</span>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default ResumeBuilder;
