import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, User, Building2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Register() {
  const { register } = useAuth();
  const [companyName, setCompanyName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Hardcode role to Admin for the creator of the company account
    await register(adminName, email, password, 'Admin');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-offwhite flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-wider text-brand-dark mb-2">
            DSA<span className="text-brand-purple">.AI</span>
          </h1>
          <p className="text-gray-500 font-medium">Register your organization</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Company Name</label>
            <div className="relative">
              <Building2 size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 bg-gray-50 focus:bg-white transition-colors"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">System Admin Name</label>
            <div className="relative">
              <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 bg-gray-50 focus:bg-white transition-colors"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Work Email</label>
            <div className="relative">
              <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="email" 
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 bg-gray-50 focus:bg-white transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="password" 
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 bg-gray-50 focus:bg-white transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-dark text-white font-medium py-3 rounded-xl hover:bg-brand-dark/90 transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {isLoading && <Loader2 size={18} className="animate-spin" />}
            {isLoading ? 'Creating account...' : 'Create Organization'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Already registered? <Link to="/login" className="text-brand-purple font-semibold hover:underline">Sign In here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
