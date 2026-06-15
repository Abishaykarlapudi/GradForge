import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layout Imports
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Component Guards
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Page Imports
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Pricing from './pages/Pricing';
import PublicPortfolio from './pages/PublicPortfolio';

// Dashboard Page Imports
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import PortfolioBuilder from './pages/PortfolioBuilder';
import ProjectBuilder from './pages/ProjectBuilder';
import AssignmentGenerator from './pages/AssignmentGenerator';
import DocGenerator from './pages/DocGenerator';
import VivaPrep from './pages/VivaPrep';
import AIAssistant from './pages/AIAssistant';
import AdminPanel from './pages/AdminPanel';
import Billing from './pages/Billing';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            {/* Public Layout Pages */}
            <Route path="/" element={<MainLayout><Landing /></MainLayout>} />
            <Route path="/about" element={<MainLayout><About /></MainLayout>} />
            <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
            <Route path="/faq" element={<MainLayout><FAQ /></MainLayout>} />
            <Route path="/pricing" element={<MainLayout><Pricing /></MainLayout>} />
            
            {/* Auth Layout Pages */}
            <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
            <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
            <Route path="/forgot-password" element={<MainLayout><ForgotPassword /></MainLayout>} />
            <Route path="/reset-password" element={<MainLayout><ResetPassword /></MainLayout>} />
            <Route path="/verify-email" element={<MainLayout><VerifyEmail /></MainLayout>} />

            {/* Public Standalone Portfolios */}
            <Route path="/portfolio/:slug" element={<PublicPortfolio />} />

            {/* Protected Student Dashboard Area */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard/resume" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ResumeBuilder />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/dashboard/portfolio" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <PortfolioBuilder />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/dashboard/projects" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ProjectBuilder />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/dashboard/assignments" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AssignmentGenerator />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/dashboard/documentation" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DocGenerator />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/dashboard/viva" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <VivaPrep />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/dashboard/assistant" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AIAssistant />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/dashboard/billing" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Billing />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            {/* Admin Dedicated Section */}
            <Route path="/dashboard/admin" element={
              <ProtectedRoute>
                <AdminRoute>
                  <DashboardLayout>
                    <AdminPanel />
                  </DashboardLayout>
                </AdminRoute>
              </ProtectedRoute>
            } />

          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
