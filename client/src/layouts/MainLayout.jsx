import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Menu, X, Rocket, Terminal, ShieldAlert } from 'lucide-react';

const MainLayout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#050608] text-gray-100 font-sans selection:bg-purple-600 selection:text-white">
      {/* Premium Navbar */}
      <nav className="sticky top-0 z-50 bg-[#06070a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <Terminal size={18} className="text-white" />
                </div>
                <span>Grad<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Forge</span></span>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <Link to="/" className="text-gray-400 hover:text-white transition">Home</Link>
              <Link to="/pricing" className="text-gray-400 hover:text-white transition">Pricing</Link>
              <Link to="/about" className="text-gray-400 hover:text-white transition">About</Link>
              <Link to="/contact" className="text-gray-400 hover:text-white transition">Contact</Link>
              <Link to="/faq" className="text-gray-400 hover:text-white transition">FAQ</Link>
            </div>

            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <Link to="/dashboard" className="px-4 h-9 flex items-center justify-center text-xs font-semibold btn-cyber gap-2">
                    <Rocket size={14} />
                    <span>Go to Dashboard</span>
                  </Link>
                  <button onClick={() => { logout(); navigate('/'); }} className="px-4 h-9 text-xs font-semibold rounded-md border border-white/10 hover:bg-white/5 transition">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-4 h-9 flex items-center justify-center text-xs font-semibold border border-white/10 rounded-md hover:bg-white/5 transition">
                    Sign In
                  </Link>
                  <Link to="/register" className="px-4 h-9 flex items-center justify-center text-xs font-semibold btn-cyber">
                    Get Started
                  </Link>
                </>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white focus:outline-none">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-[#06070a] border-b border-white/5 px-2 pt-2 pb-4 space-y-1 sm:px-3 text-sm">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5">Home</Link>
            <Link to="/pricing" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5">Pricing</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5">About</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5">Contact</Link>
            <Link to="/faq" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5">FAQ</Link>
            <div className="pt-4 border-t border-white/5 flex flex-col gap-2 px-3">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} className="py-2 text-center btn-cyber text-xs font-semibold flex items-center justify-center gap-2">
                    <Rocket size={14} /> Go to Dashboard
                  </Link>
                  <button onClick={() => { logout(); navigate('/'); setIsOpen(false); }} className="py-2 border border-white/10 rounded-md text-xs font-semibold hover:bg-white/5 transition">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="py-2 text-center border border-white/10 rounded-md text-xs font-semibold">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="py-2 text-center btn-cyber text-xs font-semibold">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Premium Footer */}
      <footer className="border-t border-white/5 bg-[#06070a]/40 py-12 text-sm text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 font-bold text-white text-lg mb-4">
                <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Terminal size={12} className="text-white" />
                </div>
                <span>GradForge</span>
              </div>
              <p className="text-gray-400 max-w-sm mb-4 leading-relaxed">
                Build production-ready final year projects, ATS-optimized resumes, beautiful portfolios, and prep for viva-voce interviews with AI mentorship.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><Link to="/pricing" className="hover:text-white transition">Pricing Plans</Link></li>
                <li><Link to="/faq" className="hover:text-white transition">FAQ Guide</Link></li>
                <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><span className="hover:text-white cursor-pointer transition">Terms of Service</span></li>
                <li><span className="hover:text-white cursor-pointer transition">Privacy Policy</span></li>
                <li><Link to="/contact" className="hover:text-white transition">Support Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <p>&copy; {new Date().getFullYear()} GradForge. All rights reserved.</p>
            <p className="text-gray-600">Built for academic excellence and student careers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
