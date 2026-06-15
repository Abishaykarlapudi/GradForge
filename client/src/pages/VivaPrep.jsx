import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Volume2, Sparkles, Loader, CheckCircle, XCircle, ChevronRight, Play, Award, AwardIcon
} from 'lucide-react';

const VivaPrep = () => {
  const [projectTitle, setProjectTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [studentAnswers, setStudentAnswers] = useState({}); // { questionId: answerText }

  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [submittingAnswers, setSubmittingAnswers] = useState(false);
  const [gradedSession, setGradedSession] = useState(null);

  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await axios.get('/api/viva');
      if (res.data.success) {
        setHistory(res.data.sessions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleStartViva = async (e) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;

    setLoadingQuestions(true);
    setSessionId(null);
    setGradedSession(null);
    setQuestions([]);
    setCurrentIndex(0);
    setStudentAnswers({});
    setCurrentAnswer('');

    try {
      const res = await axios.post('/api/viva/start', { projectTitle, description });
      if (res.data.success) {
        setSessionId(res.data.sessionId);
        setQuestions(res.data.questions);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to initialize mock viva exam.');
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleNext = () => {
    const activeQ = questions[currentIndex];
    setStudentAnswers({ ...studentAnswers, [activeQ._id]: currentAnswer });
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentAnswer(studentAnswers[questions[currentIndex + 1]._id] || '');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentAnswer(studentAnswers[questions[prevIndex]._id] || '');
    }
  };

  const handleSubmitViva = async () => {
    // Save last answer
    const activeQ = questions[currentIndex];
    const finalAnswersMap = { ...studentAnswers, [activeQ._id]: currentAnswer };
    setStudentAnswers(finalAnswersMap);

    const answersArray = Object.keys(finalAnswersMap).map(qId => ({
      questionId: qId,
      answer: finalAnswersMap[qId]
    }));

    setSubmittingAnswers(true);
    try {
      const res = await axios.post('/api/viva/submit', {
        sessionId,
        answers: answersArray
      });

      if (res.data.success) {
        setGradedSession(res.data.session);
        setSessionId(null);
        setQuestions([]);
        fetchHistory();
      }
    } catch (err) {
      console.error(err);
      alert('Answer evaluation failed.');
    } finally {
      setSubmittingAnswers(false);
    }
  };

  return (
    <div className="text-left space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
          <Volume2 className="text-purple-400" size={28} /> Viva Voice Preparation
        </h1>
        <p className="text-gray-400 text-xs mt-1">Practice project defenses with AI externals scoring your oral arguments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* INPUT FORM PANEL */}
        <div className="space-y-6">
          
          {/* Start Viva */}
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2"><Play size={14} className="text-purple-400 fill-purple-400" /> Start Mock Viva</h3>
            <form onSubmit={handleStartViva} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase font-semibold">Project Title</label>
                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. Smart Resume Screener"
                  className="glass-input text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase font-semibold">Short Project Abstract</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Paste details of database/algorithms to get tested on them..."
                  className="glass-input text-xs resize-none"
                />
              </div>

              <button type="submit" disabled={loadingQuestions} className="w-full py-2.5 btn-cyber flex items-center justify-center gap-2 font-semibold text-xs">
                {loadingQuestions ? <Loader size={12} className="animate-spin" /> : <Volume2 size={12} />}
                <span>Initialize Oral Exam</span>
              </button>
            </form>
          </div>

          {/* Previous sessions history list */}
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5"><Award size={16} /> Previous scorecards</h3>
            {loadingHistory ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-10 bg-white/5 rounded-xl"></div>
                <div className="h-10 bg-white/5 rounded-xl"></div>
              </div>
            ) : history.length === 0 ? (
              <p className="text-xs text-gray-500">No mock scorecards compiled yet.</p>
            ) : (
              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                {history.map(session => (
                  <button
                    key={session._id}
                    onClick={() => { setGradedSession(session); setSessionId(null); setQuestions([]); }}
                    className={`w-full flex justify-between items-center p-3 rounded-xl border text-xs text-left ${gradedSession?._id === session._id ? 'bg-purple-600/10 border-purple-500/30' : 'bg-white/5 border-white/5'}`}
                  >
                    <div className="truncate flex-grow mr-2">
                      <h4 className="font-semibold text-white truncate">{session.projectTitle}</h4>
                      <span className="text-[10px] text-gray-500">{new Date(session.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${session.score >= 70 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      {session.score}%
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* STUDY ROOM ARENA CHAT */}
        <div className="lg:col-span-2">
          
          {/* loading indicator */}
          {loadingQuestions && (
            <div className="h-[450px] rounded-2xl glass-panel flex flex-col items-center justify-center gap-4 text-center">
              <Loader size={40} className="animate-spin text-purple-400" />
              <div>
                <h3 className="font-bold text-white">Initializing Viva Panel...</h3>
                <p className="text-xs text-gray-400 mt-1">AI examiner compiles thesis questions targeting your abstract details.</p>
              </div>
            </div>
          )}

          {/* active viva chat in progress */}
          {questions.length > 0 && (
            <div className="p-8 rounded-2xl glass-panel border border-white/5 flex flex-col justify-between min-h-[450px] max-h-[600px]">
              
              {/* chat header info */}
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-[9px] uppercase font-extrabold text-purple-400">Viva Session Active</span>
                  <h3 className="font-bold text-white text-base mt-2 truncate max-w-sm">{projectTitle}</h3>
                </div>
                <span className="text-xs font-mono font-bold text-gray-400">
                  Question {currentIndex + 1} of {questions.length}
                </span>
              </div>

              {/* Active question bubble */}
              <div className="flex-grow py-8 space-y-6">
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
                    Q
                  </div>
                  <p className="text-sm font-bold text-white leading-relaxed pt-1 select-none">
                    {questions[currentIndex].question}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-gray-400 uppercase font-semibold">Your Answer</label>
                  <textarea
                    rows={4}
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Type your explanation here..."
                    className="glass-input text-xs resize-none"
                  />
                </div>
              </div>

              {/* Navigation button panel */}
              <div className="border-t border-white/5 pt-4 flex justify-between items-center">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 border border-white/10 rounded-lg text-xs font-semibold hover:bg-white/5 disabled:opacity-30 transition"
                >
                  Previous
                </button>

                {currentIndex === questions.length - 1 ? (
                  <button
                    onClick={handleSubmitViva}
                    disabled={submittingAnswers || !currentAnswer.trim()}
                    className="px-5 py-2 btn-cyber flex items-center gap-1.5 text-xs font-semibold"
                  >
                    {submittingAnswers ? <Loader size={12} className="animate-spin" /> : <Play size={12} />}
                    <span>Submit Oral Exam</span>
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={!currentAnswer.trim()}
                    className="px-5 py-2 bg-white/5 border border-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold transition"
                  >
                    Next Question
                  </button>
                )}
              </div>

            </div>
          )}

          {/* graded results display */}
          {gradedSession && (
            <div className="p-8 rounded-2xl glass-panel border border-white/5 space-y-6 max-h-[600px] overflow-y-auto">
              
              {/* score panel header */}
              <div className="p-6 rounded-xl bg-purple-600/5 border border-purple-500/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400">Oral Exam Result</span>
                  <h3 className="font-bold text-white text-lg mt-1 truncate max-w-xs sm:max-w-md">{gradedSession.projectTitle}</h3>
                </div>
                
                <div className="text-center">
                  <span className="text-[9px] uppercase font-bold text-gray-500">Graded Score</span>
                  <div className={`text-3xl font-extrabold font-mono mt-0.5 ${gradedSession.score >= 70 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {gradedSession.score}%
                  </div>
                </div>
              </div>

              {/* Questions details breakdown list */}
              <div className="space-y-6 text-xs text-left">
                {gradedSession.questions.map((q, idx) => (
                  <div key={idx} className="p-5 rounded-xl bg-white/5 border border-white/5 space-y-4">
                    
                    {/* question & correctness indicator */}
                    <div className="flex justify-between items-start gap-2 border-b border-white/5 pb-3">
                      <p className="font-bold text-white leading-relaxed">
                        Q{idx + 1}: {q.question}
                      </p>
                      {q.isCorrect ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full"><CheckCircle size={10} /> Correct</span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full"><XCircle size={10} /> Incorrect</span>
                      )}
                    </div>

                    {/* answers comparison and feedback */}
                    <div className="space-y-3 leading-relaxed">
                      <div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase">Expected Answer</span>
                        <p className="text-gray-300 italic bg-[#06070a]/40 p-2.5 rounded-lg border border-white/5 mt-1">{q.correctAnswer}</p>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase">Your Typed Answer</span>
                        <p className="text-gray-300 italic bg-[#06070a]/40 p-2.5 rounded-lg border border-white/5 mt-1">{q.studentAnswer || '(No answer provided)'}</p>
                      </div>

                      <div className="pt-2">
                        <span className="text-[10px] text-purple-400 font-bold uppercase">AI Examiner Critique</span>
                        <p className="text-gray-400 mt-1">{q.feedback}</p>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* standby state */}
          {!loadingQuestions && questions.length === 0 && !gradedSession && (
            <div className="h-[450px] rounded-2xl glass-panel flex flex-col items-center justify-center gap-3 text-center p-6 border border-white/5">
              <Volume2 size={48} className="text-gray-600" />
              <h3 className="font-bold text-white">Oral Practice Standby</h3>
              <p className="text-xs text-gray-400 max-w-sm">Enter your project title to configure custom AI questions, or click a previous scorecard from the history index panel.</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default VivaPrep;
