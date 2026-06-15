import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Shield, Users, FileText, Globe, BookOpen, Sparkles, Loader, AlertTriangle
} from 'lucide-react';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/users')
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (usersRes.data.success) setUsers(usersRes.data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePlan = async (userId) => {
    setActionLoadingId(userId);
    try {
      const res = await axios.put(`/api/admin/users/toggle-subscription/${userId}`);
      if (res.data.success) {
        alert(res.data.message);
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
      alert('Plan toggle modification failed.');
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
        <Loader size={36} className="animate-spin text-purple-400" />
        <p className="text-xs text-gray-500">Compiling administrator dashboard statistics...</p>
      </div>
    );
  }

  const statCards = [
    { name: 'Total Users', val: stats?.totalUsers || 0, icon: Users, color: 'text-blue-400' },
    { name: 'Premium Tier Users', val: stats?.premiumUsers || 0, icon: Sparkles, color: 'text-yellow-400' },
    { name: 'Resumes Drafted', val: stats?.totalResumes || 0, icon: FileText, color: 'text-purple-400' },
    { name: 'Portfolios Live', val: stats?.totalPortfolios || 0, icon: Globe, color: 'text-cyan-400' }
  ];

  return (
    <div className="text-left space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
          <Shield className="text-purple-400" size={28} /> Admin Dashboard Control
        </h1>
        <p className="text-gray-400 text-xs mt-1">Audit student registrations, statistics indices, and subscription credentials.</p>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="p-6 rounded-2xl glass-card border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-semibold">{card.name}</span>
              <div className="text-2xl font-extrabold text-white mt-1">{card.val}</div>
            </div>
            <div className={`p-2.5 rounded-xl bg-white/5 border border-white/5 ${card.color}`}>
              <card.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* User permissions control board */}
      <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4 overflow-x-auto">
        <h3 className="text-sm font-bold text-white mb-2">Registered Accounts</h3>
        <table className="w-full text-xs text-left text-gray-400 border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-white/5 text-gray-300">
              <th className="py-3 px-4">Student Name</th>
              <th className="py-3 px-4">Email Address</th>
              <th className="py-3 px-4">Access Role</th>
              <th className="py-3 px-4">Plan Tier</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-b border-white/5 hover:bg-white/5 transition">
                <td className="py-3.5 px-4 font-bold text-white">{u.name}</td>
                <td className="py-3.5 px-4">{u.email}</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] capitalize font-semibold ${u.role === 'admin' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${u.plan === 'premium' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-gray-500/10 text-gray-400'}`}>
                    {u.plan}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => handleTogglePlan(u._id)}
                    disabled={actionLoadingId === u._id}
                    className="px-3 py-1.5 rounded-lg border border-purple-500/35 hover:bg-purple-600/10 text-[10px] text-purple-400 font-bold disabled:opacity-30 transition"
                  >
                    {actionLoadingId === u._id ? 'Toggling...' : `Toggle Plan`}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
