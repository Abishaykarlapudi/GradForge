import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { 
  FileText, Globe, FolderKanban, BookOpen, Volume2, 
  Sparkles, ArrowRight, Activity, ShieldAlert, BadgeInfo
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ resumes: 0, portfolios: 0, projects: 0, assignments: 0, vivas: 0 });
  const [loading, setLoading] = useState(true);
  const [portfolioSlug, setPortfolioSlug] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [resumesRes, portfolioRes, projectsRes, assignmentsRes, vivasRes] = await Promise.allSettled([
          axios.get('/api/resumes'),
          axios.get('/api/portfolios/me'),
          axios.get('/api/projects'),
          axios.get('/api/assignments'),
          axios.get('/api/viva')
        ]);

        const statsObj = { resumes: 0, portfolios: 0, projects: 0, assignments: 0, vivas: 0 };

        if (resumesRes.status === 'fulfilled' && resumesRes.value.data.success) {
          statsObj.resumes = resumesRes.value.data.resumes.length;
        }
        if (portfolioRes.status === 'fulfilled' && portfolioRes.value.data.success) {
          statsObj.portfolios = portfolioRes.value.data.portfolio ? 1 : 0;
          setPortfolioSlug(portfolioRes.value.data.portfolio?.slug || '');
        }
        if (projectsRes.status === 'fulfilled' && projectsRes.value.data.success) {
          statsObj.projects = projectsRes.value.data.projects.length;
        }
        if (assignmentsRes.status === 'fulfilled' && assignmentsRes.value.data.success) {
          statsObj.assignments = assignmentsRes.value.data.assignments.length;
        }
        if (vivasRes.status === 'fulfilled' && vivasRes.value.data.success) {
          statsObj.vivas = vivasRes.value.data.sessions.length;
        }

        setStats(statsObj);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const metricCards = [
    { name: 'Resumes Built', val: stats.resumes, limit: user?.plan === 'free' ? '1 max' : 'Unlimited', icon: FileText, color: 'text-purple-400', link: '/dashboard/resume' },
    { name: 'Portfolios', val: stats.portfolios, limit: user?.plan === 'free' ? '1 max' : 'Unlimited', icon: Globe, color: 'text-blue-400', link: '/dashboard/portfolio' },
    { name: 'Project Roadmaps', val: stats.projects, limit: user?.plan === 'free' ? '1 max' : 'Unlimited', icon: FolderKanban, color: 'text-cyan-400', link: '/dashboard/projects' },
    { name: 'Assignments Gen', val: stats.assignments, limit: user?.plan === 'free' ? '2 max' : 'Unlimited', icon: BookOpen, color: 'text-pink-400', link: '/dashboard/assignments' },
  ];

  return (
    <div className="text-left space-y-8">
      {/* Personalized Header card */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-purple-900/10 via-[#121626] to-[#0a0b10] border border-white/5 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            Welcome back, {user?.name || 'Student'}! <Sparkles className="text-yellow-400 fill-yellow-400" size={20} />
          </h1>
          <p className="text-gray-400 text-xs mt-1 leading-relaxed max-w-lg">
            Manage your academic resources, project documentation chapters, and prepare for interviews using AI integrations.
          </p>
        </div>

        {user?.plan === 'free' && (
          <Link to="/dashboard/billing" className="px-5 py-2.5 btn-cyber flex items-center gap-2 text-xs font-semibold">
            <span>Upgrade to Premium</span>
            <ArrowRight size={14} />
          </Link>
        )}
      </div>

      {/* Metrics Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-white/5 border border-white/5 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricCards.map((card, idx) => (
            <Link key={idx} to={card.link} className="p-6 rounded-2xl glass-card border border-white/5 flex flex-col justify-between h-36">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs text-gray-400 font-semibold">{card.name}</span>
                  <div className="text-3xl font-extrabold text-white mt-2">{card.val}</div>
                </div>
                <div className={`p-2.5 rounded-xl bg-white/5 border border-white/5 ${card.color}`}>
                  <card.icon size={20} />
                </div>
              </div>
              <div className="text-[10px] text-gray-500 font-medium">Limit: {card.limit}</div>
            </Link>
          ))}
        </div>
      )}

      {/* Dashboard Sub-widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Quick Launch Panel */}
        <div className="p-6 rounded-2xl glass-panel border border-white/5 lg:col-span-2 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="text-purple-400" size={16} /> Quick Launch Tools
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/dashboard/projects" className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition text-left flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400"><FolderKanban size={16} /></div>
              <div>
                <h4 className="text-xs font-bold text-white">Generate Project Blueprint</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">Technology stacks & schemas.</p>
              </div>
            </Link>

            <Link to="/dashboard/viva" className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition text-left flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><Volume2 size={16} /></div>
              <div>
                <h4 className="text-xs font-bold text-white">Oral Viva Practice</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">Real AI interview questions.</p>
              </div>
            </Link>

            <Link to="/dashboard/resume" className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition text-left flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400"><FileText size={16} /></div>
              <div>
                <h4 className="text-xs font-bold text-white">ATS CV templates</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">Edit and print as PDF.</p>
              </div>
            </Link>

            <Link to="/dashboard/portfolio" className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition text-left flex items-start gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400"><Globe size={16} /></div>
              <div>
                <h4 className="text-xs font-bold text-white">Personal Portfolio</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">Publish custom student path.</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Portfolio Status card */}
        <div className="p-6 rounded-2xl glass-panel border border-white/5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="text-blue-400" size={16} /> Portfolio Status
            </h3>
            {portfolioSlug ? (
              <div className="p-4 rounded-xl bg-purple-600/5 border border-purple-500/10 text-xs">
                <p className="text-gray-400">Your site is live at:</p>
                <a 
                  href={`/portfolio/${portfolioSlug}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="block mt-2 font-bold text-purple-400 hover:text-purple-300 break-all underline"
                >
                  {window.location.origin}/portfolio/{portfolioSlug}
                </a>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-400">
                You haven't generated a public portfolio website yet.
              </div>
            )}
          </div>
          
          <Link to="/dashboard/portfolio" className="w-full mt-6 py-2.5 btn-cyber-outline text-xs font-semibold text-center block">
            {portfolioSlug ? 'Manage Portfolio' : 'Create Portfolio'}
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
