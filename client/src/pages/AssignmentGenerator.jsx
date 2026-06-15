import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BookOpen, Sparkles, Loader, Trash2, Printer, Copy, FileText
} from 'lucide-react';

const AssignmentGenerator = () => {
  const [topic, setTopic] = useState('');
  const [wordCount, setWordCount] = useState(500);
  const [formatting, setFormatting] = useState('academic');
  const [generating, setGenerating] = useState(false);

  const [activeAssignment, setActiveAssignment] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await axios.get('/api/assignments');
      if (res.data.success) {
        setHistory(res.data.assignments);
        if (res.data.assignments.length > 0 && !activeAssignment) {
          setActiveAssignment(res.data.assignments[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setGenerating(true);
    setActiveAssignment(null);

    try {
      const res = await axios.post('/api/assignments/generate', { topic, wordCount, formatting });
      if (res.data.success) {
        setActiveAssignment(res.data.assignment);
        fetchHistory();
        setTopic('');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Assignment generation failed.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this assignment?')) return;
    try {
      const res = await axios.delete(`/api/assignments/${id}`);
      if (res.data.success) {
        if (activeAssignment?._id === id) setActiveAssignment(null);
        fetchHistory();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyText = () => {
    if (!activeAssignment) return;
    navigator.clipboard.writeText(activeAssignment.content);
    alert('Assignment copied to clipboard!');
  };

  const handlePrint = () => {
    if (!activeAssignment) return;
    const printContent = document.getElementById('assignment-text-content').innerHTML;

    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head>
          <title>${activeAssignment.topic}</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            body { font-family: serif; padding: 3rem; color: #1f2937; line-height: 1.7; }
            h1, h2, h3 { color: #111827; margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: bold; }
            h1 { font-size: 1.875rem; text-align: center; }
            h2 { font-size: 1.5rem; }
            p { margin-bottom: 1rem; text-align: justify; }
          </style>
        </head>
        <body>
          <div class="max-w-3xl mx-auto">
            <h1>${activeAssignment.topic}</h1>
            <div class="mt-8 text-sm">${printContent}</div>
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div className="text-left space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
          <BookOpen className="text-purple-400" size={28} /> Assignment Generator
        </h1>
        <p className="text-gray-400 text-xs mt-1">Generate academic assignments, research papers, and essays formatted beautifully by AI.</p>
      </div>

      {/* Builder pane */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* INPUTS PANEL */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5"><Sparkles size={16} className="text-yellow-400 fill-yellow-400" /> Generate Assignment</h3>
            <form onSubmit={handleGenerate} className="space-y-4">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase font-semibold">Topic / Prompt</label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Impact of AI on Modern Agriculture"
                  className="glass-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-400 uppercase font-semibold">Word Count</label>
                  <select value={wordCount} onChange={(e) => setWordCount(parseInt(e.target.value))} className="glass-input text-xs bg-darkBg">
                    <option value={250}>250 Words</option>
                    <option value={500}>500 Words</option>
                    <option value={1000}>1000 Words</option>
                    <option value={1500}>1500 Words (Premium)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-400 uppercase font-semibold">Formatting</label>
                  <select value={formatting} onChange={(e) => setFormatting(e.target.value)} className="glass-input text-xs bg-darkBg">
                    <option value="academic">Academic APA Style</option>
                    <option value="standard">Standard Informal</option>
                    <option value="detailed">Detailed/Numbered Outline</option>
                  </select>
                </div>
              </div>

              <button type="submit" disabled={generating} className="w-full py-2.5 btn-cyber flex items-center justify-center gap-2 font-semibold text-xs">
                {generating ? <Loader size={12} className="animate-spin" /> : <Sparkles size={12} />}
                <span>Generate Assignment</span>
              </button>

            </form>
          </div>

          {/* History */}
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5"><FileText size={16} /> Saved Assignments</h3>
            {loadingHistory ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-10 bg-white/5 rounded-xl"></div>
                <div className="h-10 bg-white/5 rounded-xl"></div>
              </div>
            ) : history.length === 0 ? (
              <p className="text-xs text-gray-500">No generated assignments yet.</p>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {history.map(item => (
                  <div key={item._id} className={`flex justify-between items-center p-3 rounded-xl border text-xs ${activeAssignment?._id === item._id ? 'bg-purple-600/10 border-purple-500/30' : 'bg-white/5 border-white/5'}`}>
                    <button onClick={() => setActiveAssignment(item)} className="font-semibold text-left truncate flex-grow text-white hover:underline">{item.topic}</button>
                    <button onClick={() => handleDelete(item._id)} className="text-red-400 hover:text-red-300 ml-2"><Trash2 size={12} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* OUTPUT PREVIEW PANEL */}
        <div className="lg:col-span-2">
          {generating && (
            <div className="h-[500px] rounded-2xl glass-panel flex flex-col items-center justify-center gap-4 text-center">
              <Loader size={40} className="animate-spin text-purple-400" />
              <div>
                <h3 className="font-bold text-white">Generating Assignment Content...</h3>
                <p className="text-xs text-gray-400 mt-1">Applying formatting standards and computing academic vocabulary.</p>
              </div>
            </div>
          )}

          {!generating && !activeAssignment && (
            <div className="h-[500px] rounded-2xl glass-panel flex flex-col items-center justify-center gap-3 text-center p-6 border border-white/5">
              <BookOpen size={48} className="text-gray-600" />
              <h3 className="font-bold text-white">No Assignment Selected</h3>
              <p className="text-xs text-gray-400 max-w-sm">Use the editor panel to submit a topic or select one from the history index list.</p>
            </div>
          )}

          {!generating && activeAssignment && (
            <div className="p-8 rounded-2xl glass-panel border border-white/5 space-y-6 max-h-[700px] overflow-y-auto">
              
              {/* Document actions header bar */}
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-[9px] uppercase tracking-wider font-bold text-purple-400">{activeAssignment.formatting}</span>
                  <h3 className="font-bold text-white text-base mt-2 truncate max-w-xs sm:max-w-md">{activeAssignment.topic}</h3>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleCopyText} className="p-2 rounded bg-white/5 border border-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition" title="Copy text"><Copy size={14} /></button>
                  <button onClick={handlePrint} className="p-2 rounded bg-purple-600/10 border border-purple-500/20 hover:bg-purple-600/20 text-purple-400 transition" title="Print / PDF"><Printer size={14} /></button>
                </div>
              </div>

              {/* Assignment text body */}
              <div id="assignment-text-content" className="text-xs text-gray-300 leading-relaxed text-justify whitespace-pre-line space-y-4">
                {activeAssignment.content}
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AssignmentGenerator;
