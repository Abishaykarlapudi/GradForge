import React from 'react';
import { Terminal, Users, Cpu, GraduationCap } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-left">
      <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight text-center">
        Empowering the Engineers of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Tomorrow</span>
      </h1>
      
      <p className="text-gray-400 text-sm leading-relaxed mb-12 text-center max-w-xl mx-auto">
        GradForge was built to bridge the gap between academic projects and professional engineering careers, providing students with advanced tools powered by AI.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
          <GraduationCap className="text-purple-400 mb-4" size={32} />
          <h3 className="text-lg font-bold text-white mb-2">Academic Success</h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            We aid students in generating clean final-year project code roadmaps, formatting assignments, and compiling SRS thesis summaries based on university guidelines.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
          <Cpu className="text-blue-400 mb-4" size={32} />
          <h3 className="text-lg font-bold text-white mb-2">Modern AI Mentorship</h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            Our modular AI layer guides students through code design decisions, database schemas, mock interviews, and technical explanations.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-2xl glass-panel border border-white/5 text-center">
        <h3 className="text-xl font-bold text-white mb-3">Our Core Goal</h3>
        <p className="text-gray-400 text-xs max-w-2xl mx-auto leading-relaxed">
          Our mission is to build software that accelerates the transition of engineering graduates into corporate and startup workspaces. By consolidating resumes, portfolios, roadmaps, and mock tests into one browser portal, we remove the friction of early career launches.
        </p>
      </div>
    </div>
  );
};

export default About;
