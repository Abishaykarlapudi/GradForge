import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AIAssistantDrawer from '../components/AIAssistantDrawer';
import { 
  LayoutDashboard, FileText, Globe, FolderKanban, BookOpen, 
  FileCheck, Volume2, Bot, Shield, CreditCard, LogOut, Menu, X, Terminal, ChevronRight, Sparkles
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Resume Builder', path: '/dashboard/resume', icon: FileText },
    { name: 'Portfolio Builder', path: '/dashboard/portfolio', icon: Globe },
    { name: 'Project Roadmap', path: '/dashboard/projects', icon: FolderKanban },
    { name: 'Assignment Gen', path: '/dashboard/assignments', icon: BookOpen },
    { name: 'Documentation', path: '/dashboard/documentation', icon: FileCheck },
    { name: 'Viva Prep', path: '/dashboard/viva', icon: Volume2 },
    { name: 'AI Chat Mentor', path: '/dashboard/assistant', icon: Bot },
  ];

  const adminItem = { name: 'Admin Control', path: '/dashboard/admin', icon: Shield };
  const billingItem = { name: 'Subscription', path: '/dashboard/billing', icon: CreditCard };

  const activeStyle = "flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-500/20 transition-all duration-300";
  const inactiveStyle = "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200";

  return (
    <div className="min-h-screen bg-[#050608] text-gray-100 flex overflow-hidden">
      
      {/* Mobile Top Navigation */}
      <div className="lg:hidden flex items-center justify-between w-full h-16 bg-[#06070a] px-4 border-b border-white/5 fixed top-0 z-40">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-lg text-white">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center">
            <Terminal size={16} />
          </div>
          <span>Grad<span className="text-purple-400">Forge</span></span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-400 hover:text-white focus:outline-none"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`w-64 bg-[#06070a]/90 backdrop-blur-xl border-r border-white/5 flex flex-col fixed inset-y-0 left-0 z-40 transform lg:translate-x-0 lg:static transition duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Brand Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-white">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center">
              <Terminal size={18} />
            </div>
            <span>Grad<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Forge</span></span>
          </Link>
        </div>

        {/* User profile card */}
        <div className="p-4 mx-4 my-6 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center font-bold text-purple-400 border border-purple-500/20">
            {user?.name ? user.name[0].toUpperCase() : 'S'}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold truncate text-white">{user?.name || 'Student'}</h4>
            <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400 flex items-center gap-1">
              <Sparkles size={10} />
              {user?.plan || 'Free'} Plan
            </span>
          </div>
        </div>

        {/* Nav list */}
        <nav className="flex-grow px-4 space-y-1 overflow-y-auto">
          {navItems.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => isActive ? activeStyle : inactiveStyle}
              end
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          ))}

          {/* Admin panel menu link */}
          {user?.role === 'admin' && (
            <NavLink
              to={adminItem.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => isActive ? activeStyle : inactiveStyle}
            >
              <adminItem.icon size={18} />
              <span>{adminItem.name}</span>
            </NavLink>
          )}

          {/* Billing / Upgrade menu link */}
          <NavLink
            to={billingItem.path}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => isActive ? activeStyle : inactiveStyle}
          >
            <billingItem.icon size={18} />
            <span>{billingItem.name}</span>
          </NavLink>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/5 transition duration-200"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div className="flex-grow flex flex-col min-w-0 overflow-y-auto pt-16 lg:pt-0">
        <main className="flex-grow p-6 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Floating global assistant widget */}
      {location.pathname !== '/dashboard/assistant' && <AIAssistantDrawer />}
    </div>
  );
};

export default DashboardLayout;
