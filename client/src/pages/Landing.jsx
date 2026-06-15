import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Award, PenTool, Terminal, BookOpen, Volume2, Bot, ArrowRight, ShieldCheck, Star } from 'lucide-react';

const Landing = () => {
  const features = [
    { name: 'Final Year Project Builder', desc: 'Generate tech stacks, architectural outlines, database schemas, roadmaps, and starter packages.', icon: FolderIcon },
    { name: 'ATS Resume Builder', desc: 'Create multiple CVs optimized for applicant tracking systems with professional templates.', icon: ResumeIcon },
    { name: 'Portfolio Generator', desc: 'Generate personal portfolio websites, publish them under custom paths, and export static source code.', icon: PortfolioIcon },
    { name: 'Assignment Generator', desc: 'Generate high-quality academic papers and essays formatted beautifully, exportable to docx and PDF.', icon: AssignmentIcon },
    { name: 'Documentation Writer', desc: 'Generate structured project thesis sections: Abstract, SRS, UML maps, literature survey, and methodology.', icon: DocIcon },
    { name: 'Oral Viva Prep Arena', desc: 'Simulate mock viva-voce examinations with external examiners scoring and critiques.', icon: VivaIcon }
  ];

  function FolderIcon() { return <Terminal className="text-blue-400" size={24} /> }
  function ResumeIcon() { return <Rocket className="text-purple-400" size={24} /> }
  function PortfolioIcon() { return <Award className="text-cyan-400" size={24} /> }
  function AssignmentIcon() { return <BookOpen className="text-pink-400" size={24} /> }
  function DocIcon() { return <PenTool className="text-yellow-400" size={24} /> }
  function VivaIcon() { return <Volume2 className="text-emerald-400" size={24} /> }

  return (
    <div className="relative overflow-hidden pt-12 pb-20">
      
      {/* Background Decorative Blur Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-12 sm:py-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-purple-300 font-medium mb-6">
          <SparklesIcon />
          <span>Next-generation Student Career Toolkit</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight max-w-4xl mx-auto">
          Accelerate Your Academic Journey From{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">
            Project to Portfolio
          </span>
        </h1>
        
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          GradForge is an all-in-one AI platform for student success. Design project architectures, compose assignments, construct ATS resumes, deploy portfolios, and master oral vivas.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="w-full sm:w-auto px-8 py-3.5 btn-cyber flex items-center justify-center gap-2 font-semibold text-sm">
            <span>Get Started For Free</span>
            <ArrowRight size={16} />
          </Link>
          <Link to="/pricing" className="w-full sm:w-auto px-8 py-3.5 btn-cyber-outline flex items-center justify-center font-semibold text-sm">
            View Pricing
          </Link>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Complete Student Suite</h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">Everything you need to successfully conclude your final year and launch your engineering career.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feat, idx) => (
            <div key={idx} className="p-6 sm:p-8 rounded-2xl glass-card border border-white/5 flex flex-col text-left">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center mb-6">
                {feat.icon()}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feat.name}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-white/5 text-center">
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">How It Works</h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">Start building and practicing in three simple steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6">
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-extrabold flex items-center justify-center text-lg mx-auto mb-6">1</div>
            <h3 className="text-lg font-bold text-white mb-2">Create Account</h3>
            <p className="text-gray-400 text-xs leading-relaxed">Sign up and verify your student details. Access the unified dashboard cockpit immediately.</p>
          </div>
          <div className="p-6">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-extrabold flex items-center justify-center text-lg mx-auto mb-6">2</div>
            <h3 className="text-lg font-bold text-white mb-2">Configure & Build</h3>
            <p className="text-gray-400 text-xs leading-relaxed">Use our modular AI helpers to layout documentation outline, compile assignments, or edit ATS templates.</p>
          </div>
          <div className="p-6">
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-extrabold flex items-center justify-center text-lg mx-auto mb-6">3</div>
            <h3 className="text-lg font-bold text-white mb-2">Deploy & Excel</h3>
            <p className="text-gray-400 text-xs leading-relaxed">Export your files, publish your public subdomain resume portfolio, and study for mock presentations.</p>
          </div>
        </div>
      </section>

      {/* Social Proof/Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-white/5 text-center">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Loved by Students</h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">Hear what final year engineering students say about GradForge.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
            <p className="text-gray-300 text-xs italic leading-relaxed mb-6">
              "The project generator saved me weeks. It designed the whole Flask schema and UML description. I walked into the defense fully prepared!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center font-bold text-blue-400">AM</div>
              <div>
                <h4 className="text-sm font-semibold text-white">Ananya Mehta</h4>
                <span className="text-[10px] text-gray-500">Computer Science Student</span>
              </div>
            </div>
          </div>
          
          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
            <p className="text-gray-300 text-xs italic leading-relaxed mb-6">
              "My portfolio page got me three recruiter call-backs. Creating ATS resumes and having my portfolio code downloadable as HTML is incredible."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center font-bold text-purple-400">RK</div>
              <div>
                <h4 className="text-sm font-semibold text-white">Rohan Kapoor</h4>
                <span className="text-[10px] text-gray-500">Information Technology Student</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
            <p className="text-gray-300 text-xs italic leading-relaxed mb-6">
              "The viva mock interview tool grades you exactly like an examiner. It tested me on React hooks and database optimization. Lifesaver."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center font-bold text-cyan-400">SP</div>
              <div>
                <h4 className="text-sm font-semibold text-white">Sneha Patel</h4>
                <span className="text-[10px] text-gray-500">Electronics Engineering Student</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

function SparklesIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z" />
    </svg>
  );
}

export default Landing;
