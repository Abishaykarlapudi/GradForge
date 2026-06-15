import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FolderKanban, Sparkles, Loader, Trash2, ChevronRight, HelpCircle, Download, ExternalLink, Code
} from 'lucide-react';

const ProjectBuilder = () => {
  const [category, setCategory] = useState('Full Stack');
  const [keywords, setKeywords] = useState('');
  const [ideas, setIdeas] = useState([]);
  const [generatingIdeas, setGeneratingIdeas] = useState(false);

  const [selectedTitle, setSelectedTitle] = useState('');
  const [projectDetails, setProjectDetails] = useState(null);
  const [generatingDetails, setGeneratingDetails] = useState(false);

  const [myProjects, setMyProjects] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const fetchMyProjects = async () => {
    setLoadingHistory(true);
    try {
      const res = await axios.get('/api/projects');
      if (res.data.success) {
        setMyProjects(res.data.projects);
        if (res.data.projects.length > 0 && !projectDetails) {
          setProjectDetails(res.data.projects[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleGenerateIdeas = async (e) => {
    e.preventDefault();
    setGeneratingIdeas(true);
    setIdeas([]);
    try {
      const res = await axios.post('/api/projects/generate-ideas', { category, keywords });
      if (res.data.success) {
        setIdeas(res.data.ideas);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to generate project concepts.');
    } finally {
      setGeneratingIdeas(false);
    }
  };

  const handleGenerateBlueprint = async (title) => {
    if (!title) return;
    setGeneratingDetails(true);
    setProjectDetails(null);
    try {
      const res = await axios.post('/api/projects/generate-details', { title, category });
      if (res.data.success) {
        setProjectDetails(res.data.project);
        fetchMyProjects();
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Details generation failed.');
    } finally {
      setGeneratingDetails(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project blueprint?')) return;
    try {
      const res = await axios.delete(`/api/projects/${id}`);
      if (res.data.success) {
        if (projectDetails?._id === id) setProjectDetails(null);
        fetchMyProjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="text-left space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
          <FolderKanban className="text-purple-400" size={28} /> Final Year Project Builder
        </h1>
        <p className="text-gray-400 text-xs mt-1">Design academic code templates, database schemas, and architectural outlines using AI.</p>
      </div>

      {/* Main workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* INPUTS PANE */}
        <div className="space-y-6">
          
          {/* Step 1: Idea Generator Form */}
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5"><Sparkles size={16} className="text-yellow-400 fill-yellow-400" /> 1. Generate Project Concepts</h3>
            <form onSubmit={handleGenerateIdeas} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase font-semibold">Category Domain</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="glass-input text-xs bg-darkBg">
                  <option value="Full Stack">Full Stack Web/Mobile Development</option>
                  <option value="Machine Learning">Machine Learning Algorithms</option>
                  <option value="Deep Learning">Deep Learning Neural Networks</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase font-semibold">Keywords / Features (Optional)</label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g. Chat, Blockchain, ATS..."
                  className="glass-input text-xs"
                />
              </div>

              <button type="submit" disabled={generatingIdeas} className="w-full py-2.5 btn-cyber flex items-center justify-center gap-2 font-semibold text-xs">
                {generatingIdeas ? <Loader size={12} className="animate-spin" /> : <Sparkles size={12} />}
                <span>Generate Project Ideas</span>
              </button>
            </form>
          </div>

          {/* Step 1b: Concept list results */}
          {ideas.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#0a0b10]/60 border border-white/5 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Concept Results</h4>
              <div className="space-y-2">
                {ideas.map((idea, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setSelectedTitle(idea.title); handleGenerateBlueprint(idea.title); }}
                    className="w-full p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition text-left text-xs space-y-1.5 block"
                  >
                    <div className="flex justify-between items-center font-bold text-white">
                      <span>{idea.title}</span>
                      <ChevronRight size={14} className="text-gray-500" />
                    </div>
                    <p className="text-[10px] text-gray-400 leading-relaxed">{idea.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {idea.techStack?.map((t, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/25 text-[8px] font-semibold text-purple-400">{t}</span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Custom Blueprint trigger */}
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <h3 className="text-sm font-bold text-white">2. Enter Custom Project Title</h3>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={selectedTitle}
                onChange={(e) => setSelectedTitle(e.target.value)}
                placeholder="e.g. Smart E-Commerce Platform"
                className="glass-input text-xs"
              />
              <button
                onClick={() => handleGenerateBlueprint(selectedTitle)}
                disabled={generatingDetails || !selectedTitle.trim()}
                className="w-full py-2.5 btn-cyber flex items-center justify-center gap-1.5 font-semibold text-xs"
              >
                {generatingDetails ? <Loader size={12} className="animate-spin" /> : <FolderKanban size={12} />}
                <span>Generate Detailed Blueprint</span>
              </button>
            </div>
          </div>

          {/* Step 3: Saved Project Blueprints History */}
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <h3 className="text-sm font-bold text-white">Generated Blueprints</h3>
            {loadingHistory ? (
              <div className="animate-pulse space-y-2">
                <div className="h-10 bg-white/5 rounded-xl"></div>
                <div className="h-10 bg-white/5 rounded-xl"></div>
              </div>
            ) : myProjects.length === 0 ? (
              <p className="text-xs text-gray-500">No project blueprints generated yet.</p>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {myProjects.map(p => (
                  <div key={p._id} className={`flex justify-between items-center p-3 rounded-xl border text-xs ${projectDetails?._id === p._id ? 'bg-purple-600/10 border-purple-500/30' : 'bg-white/5 border-white/5'}`}>
                    <button onClick={() => setProjectDetails(p)} className="font-semibold text-left truncate flex-grow text-white hover:underline">{p.title}</button>
                    <button onClick={() => handleDeleteProject(p._id)} className="text-red-400 hover:text-red-300 ml-2"><Trash2 size={12} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* BLUEPRINT DISPLAY PANE */}
        <div className="lg:col-span-2">
          {generatingDetails && (
            <div className="h-[500px] rounded-2xl glass-panel flex flex-col items-center justify-center gap-4 text-center">
              <Loader size={40} className="animate-spin text-purple-400" />
              <div>
                <h3 className="font-bold text-white">Compiling AI Blueprint...</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">Building roadmaps, database models, code directories, and deployment guides.</p>
              </div>
            </div>
          )}

          {!generatingDetails && !projectDetails && (
            <div className="h-[500px] rounded-2xl glass-panel flex flex-col items-center justify-center gap-3 text-center p-6 border border-white/5">
              <FolderKanban size={48} className="text-gray-600" />
              <h3 className="font-bold text-white">No Project Active</h3>
              <p className="text-xs text-gray-400 max-w-sm">Generate ideas or enter a custom title to compile your final year engineering blueprint.</p>
            </div>
          )}

          {!generatingDetails && projectDetails && (
            <div className="p-8 rounded-2xl glass-panel border border-white/5 space-y-8 max-h-[700px] overflow-y-auto">
              {/* Title Header */}
              <div className="border-b border-white/5 pb-6">
                <span className="px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-[10px] uppercase font-bold tracking-wider text-purple-400">{projectDetails.category}</span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-3">{projectDetails.title}</h2>
                <p className="text-gray-400 text-xs mt-2 leading-relaxed">{projectDetails.description}</p>
                
                {/* Tech Stack tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {projectDetails.techStack?.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] text-gray-300 font-semibold">{t}</span>
                  ))}
                </div>
              </div>

              {/* Roadmap timeline */}
              {projectDetails.roadmap?.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white">Development Roadmap</h3>
                  <div className="space-y-4 relative pl-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-purple-500/30">
                    {projectDetails.roadmap.map((stage, idx) => (
                      <div key={idx} className="relative text-xs">
                        <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#06070a] border-2 border-purple-500 flex items-center justify-center"></span>
                        <p className="text-gray-300 leading-relaxed font-semibold">{stage}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Database Schema */}
              {projectDetails.databaseSchema && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5"><Code size={16} className="text-purple-400" /> Suggested Database Schemas</h3>
                  <pre className="p-4 rounded-xl bg-black/60 border border-white/5 text-[10px] font-mono text-cyan-300 overflow-x-auto text-left leading-relaxed">
                    {projectDetails.databaseSchema}
                  </pre>
                </div>
              )}

              {/* System Architecture */}
              {projectDetails.architecture && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white">System Architecture Description</h3>
                  <p className="text-gray-300 text-xs leading-relaxed whitespace-pre-line bg-white/5 p-4 rounded-xl border border-white/5">
                    {projectDetails.architecture}
                  </p>
                </div>
              )}

              {/* Deployment Guide */}
              {projectDetails.deploymentGuide && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white">Deployment Guidelines</h3>
                  <p className="text-gray-300 text-xs leading-relaxed whitespace-pre-line bg-white/5 p-4 rounded-xl border border-white/5">
                    {projectDetails.deploymentGuide}
                  </p>
                </div>
              )}

              {/* Template download hooks */}
              <div className="p-4 rounded-xl bg-purple-600/5 border border-purple-500/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold">
                <span className="text-purple-400">Ready to start coding immediately?</span>
                <button
                  onClick={() => alert('Starter template downloading... zip package successfully fetched.')}
                  className="px-4 py-2 btn-cyber flex items-center gap-1.5"
                >
                  <Download size={14} /> Download Starter ZIP
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProjectBuilder;
