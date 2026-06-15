import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FileCheck, Sparkles, Loader, Trash2, Printer, Edit, Copy
} from 'lucide-react';

const DocGenerator = () => {
  const [projectTitle, setProjectTitle] = useState('');
  const [selectedSection, setSelectedSection] = useState('abstract');
  const [generating, setGenerating] = useState(false);

  const [activeDoc, setActiveDoc] = useState(null);
  const [myDocs, setMyDocs] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const docSections = [
    { key: 'abstract', name: 'Abstract' },
    { key: 'introduction', name: 'Introduction' },
    { key: 'literatureSurvey', name: 'Literature Survey' },
    { key: 'srs', name: 'SRS Document' },
    { key: 'erDiagramDesc', name: 'ER Diagram Desc' },
    { key: 'umlDiagramDesc', name: 'UML Diagram Desc' },
    { key: 'methodology', name: 'Methodology' },
    { key: 'conclusion', name: 'Conclusion' },
    { key: 'references', name: 'References' }
  ];

  useEffect(() => {
    fetchMyDocs();
  }, []);

  const fetchMyDocs = async () => {
    setLoadingHistory(true);
    try {
      const res = await axios.get('/api/docs');
      if (res.data.success) {
        setMyDocs(res.data.docs);
        if (res.data.docs.length > 0 && !activeDoc) {
          setActiveDoc(res.data.docs[0]);
          setProjectTitle(res.data.docs[0].projectTitle);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleGenerateSection = async (e) => {
    e.preventDefault();
    if (!projectTitle.trim() || !selectedSection) return;

    setGenerating(true);
    try {
      const res = await axios.post('/api/docs/generate', { projectTitle, sectionName: selectedSection });
      if (res.data.success) {
        setActiveDoc(res.data.doc);
        fetchMyDocs();
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to generate chapter.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteDoc = async (id) => {
    if (!window.confirm('Delete this documentation file?')) return;
    try {
      const res = await axios.delete(`/api/docs/${id}`);
      if (res.data.success) {
        if (activeDoc?._id === id) {
          setActiveDoc(null);
          setProjectTitle('');
        }
        fetchMyDocs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrintFullReport = () => {
    if (!activeDoc) return;

    const sections = activeDoc.sections;
    let fullHtml = '';

    docSections.forEach(sec => {
      if (sections[sec.key]) {
        fullHtml += `
          <div class="section-page py-8 border-b border-gray-200">
            <h2 class="text-xl font-bold uppercase tracking-wide border-b pb-2 mb-4">${sec.name}</h2>
            <div class="text-sm text-gray-700 whitespace-pre-line text-justify leading-relaxed">${sections[sec.key]}</div>
          </div>
        `;
      }
    });

    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head>
          <title>${activeDoc.projectTitle} - Project Report</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            body { font-family: serif; padding: 3rem; color: #1f2937; }
            h1 { font-size: 2.25rem; font-weight: bold; text-align: center; text-transform: uppercase; margin-bottom: 3rem; }
            .section-page { page-break-after: always; }
          </style>
        </head>
        <body>
          <div class="max-w-3xl mx-auto">
            <h1>${activeDoc.projectTitle}</h1>
            <p class="text-center font-bold text-gray-500 mb-12">Thesis Project Report Compilation</p>
            ${fullHtml}
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
          <FileCheck className="text-purple-400" size={28} /> Project Documentation Generator
        </h1>
        <p className="text-gray-400 text-xs mt-1">Compile academic thesis chapters including SRS outlines, methodology, abstract drafts, and references.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* INPUT PANEL */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5"><Sparkles size={16} className="text-yellow-400 fill-yellow-400" /> Compile Report Chapter</h3>
            <form onSubmit={handleGenerateSection} className="space-y-4">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase font-semibold">Project Title</label>
                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. Smart E-Voting Portal"
                  className="glass-input text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase font-semibold">Choose Chapter Section</label>
                <select 
                  value={selectedSection} 
                  onChange={(e) => setSelectedSection(e.target.value)} 
                  className="glass-input text-xs bg-darkBg"
                >
                  {docSections.map(sec => (
                    <option key={sec.key} value={sec.key}>{sec.name}</option>
                  ))}
                </select>
              </div>

              <button type="submit" disabled={generating} className="w-full py-2.5 btn-cyber flex items-center justify-center gap-2 font-semibold text-xs">
                {generating ? <Loader size={12} className="animate-spin" /> : <Sparkles size={12} />}
                <span>Generate Chapter</span>
              </button>

            </form>
          </div>

          {/* History */}
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5"><FileCheck size={16} /> Saved Thesis Files</h3>
            {loadingHistory ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-10 bg-white/5 rounded-xl"></div>
                <div className="h-10 bg-white/5 rounded-xl"></div>
              </div>
            ) : myDocs.length === 0 ? (
              <p className="text-xs text-gray-500">No generated report documentation yet.</p>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {myDocs.map(doc => (
                  <div key={doc._id} className={`flex justify-between items-center p-3 rounded-xl border text-xs ${activeDoc?._id === doc._id ? 'bg-purple-600/10 border-purple-500/30' : 'bg-white/5 border-white/5'}`}>
                    <button 
                      onClick={() => { setActiveDoc(doc); setProjectTitle(doc.projectTitle); }} 
                      className="font-semibold text-left truncate flex-grow text-white hover:underline"
                    >
                      {doc.projectTitle}
                    </button>
                    <button onClick={() => handleDeleteDoc(doc._id)} className="text-red-400 hover:text-red-300 ml-2"><Trash2 size={12} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* WORKSPACE PREVIEW PANEL */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section tab buttons */}
          {activeDoc && (
            <div className="flex overflow-x-auto gap-2 p-2 bg-white/5 border border-white/5 rounded-xl scrollbar-none">
              {docSections.map(sec => {
                const isGenerated = !!activeDoc.sections[sec.key];
                const isActive = selectedSection === sec.key;
                return (
                  <button
                    key={sec.key}
                    onClick={() => setSelectedSection(sec.key)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                      isActive 
                        ? 'bg-purple-600 border-purple-500 text-white' 
                        : isGenerated 
                          ? 'bg-purple-600/10 border-purple-500/20 text-purple-400' 
                          : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {sec.name}
                  </button>
                );
              })}
            </div>
          )}

          {generating && (
            <div className="h-[450px] rounded-2xl glass-panel flex flex-col items-center justify-center gap-4 text-center">
              <Loader size={40} className="animate-spin text-purple-400" />
              <div>
                <h3 className="font-bold text-white">Writing Chapter...</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">Generating thesis content formatted according to standard university criteria.</p>
              </div>
            </div>
          )}

          {!generating && !activeDoc && (
            <div className="h-[450px] rounded-2xl glass-panel flex flex-col items-center justify-center gap-3 text-center p-6 border border-white/5">
              <FileCheck size={48} className="text-gray-600" />
              <h3 className="font-bold text-white">No Report Active</h3>
              <p className="text-xs text-gray-400 max-w-sm">Enter a project title and select a chapter section to begin compiling your thesis book.</p>
            </div>
          )}

          {!generating && activeDoc && (
            <div className="p-8 rounded-2xl glass-panel border border-white/5 space-y-6 min-h-[450px] max-h-[600px] overflow-y-auto relative">
              
              {/* Active report section display */}
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Chapter Segment</span>
                  <h3 className="font-bold text-white text-base mt-1 capitalize">{selectedSection.replace(/([A-Z])/g, ' $1')}</h3>
                </div>
                
                <button
                  onClick={handlePrintFullReport}
                  className="px-4 py-2 bg-purple-600/15 border border-purple-500/20 hover:bg-purple-600/30 rounded-lg text-xs font-semibold text-purple-400 flex items-center gap-1.5 transition"
                >
                  <Printer size={12} /> Compile Full Report PDF
                </button>
              </div>

              {/* Text content preview */}
              {activeDoc.sections[selectedSection] ? (
                <div className="text-xs text-gray-300 leading-relaxed text-justify whitespace-pre-line space-y-4 pt-2">
                  {activeDoc.sections[selectedSection]}
                </div>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center gap-3 text-center">
                  <p className="text-xs text-gray-500">This section has not been compiled yet.</p>
                  <button
                    onClick={() => handleGenerateSection({ preventDefault: () => {} })}
                    className="px-4 py-2 btn-cyber text-xs font-semibold"
                  >
                    Compile Section Now
                  </button>
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DocGenerator;
