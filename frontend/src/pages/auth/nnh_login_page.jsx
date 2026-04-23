import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/tta_axios';

export default function TtaLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/tta_auth/login', { email, password });
      login(res.data.data.token);
      navigate('/admin');
    } catch (err) {
      alert('Đăng nhập thất bại: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md flex flex-col items-center justify-center min-h-[80vh]">
      <main className="w-full flex items-center justify-center p-6 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-fixed/30 rounded-full blur-[100px]"></div>
        </div>

        <div className="w-full max-w-md z-10">
          {/* Login Card */}
          <div className="bg-white border border-outline-variant p-10 rounded-xl shadow-[0_20px_50px_rgba(0,88,190,0.08)]">
            <div className="text-center mb-10">
              <h1 className="font-headline-lg text-[32px] text-primary tracking-tight mb-2">Access Portal</h1>
              <p className="font-body-md text-on-surface-variant">Continue your technological journey.</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="font-label-sm text-[14px] text-on-surface-variant" htmlFor="email">EMAIL ADDRESS</label>
                <div className="relative group">
                  <input 
                    className="w-full px-4 py-3 bg-surface-container-low border-b-2 border-transparent focus:border-secondary outline-none transition-all duration-300 font-body-md text-on-surface" 
                    id="email" 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-label-sm text-[14px] text-on-surface-variant" htmlFor="password">PASSWORD</label>
                  <a className="font-label-sm text-[14px] text-secondary hover:underline" href="#">Forgot password?</a>
                </div>
                <div className="relative group">
                  <input 
                    className="w-full px-4 py-3 bg-surface-container-low border-b-2 border-transparent focus:border-secondary outline-none transition-all duration-300 font-body-md text-on-surface" 
                    id="password" 
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input className="w-5 h-5 rounded border-outline-variant text-secondary focus:ring-secondary/20 transition-all duration-200" id="remember" type="checkbox" />
                <label className="font-body-md text-on-surface-variant cursor-pointer" htmlFor="remember">Remember me</label>
              </div>
              <button className="w-full py-4 bg-secondary text-white font-headline-md text-[18px] rounded-lg shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2" type="submit">
                Sign In
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </form>
            
            <div className="mt-10 text-center">
              <p className="font-body-md text-on-surface-variant">New to Zenith? <Link to="/register" className="text-secondary font-semibold hover:underline">Create an account</Link></p>
            </div>
          </div>
          
          <div className="mt-8 text-center px-4">
            <p className="font-label-sm text-xs text-on-surface-variant/60 leading-relaxed uppercase tracking-[0.15em]">
              By continuing, you agree to Zenith Ztore's cryptographic security protocols and global service distribution terms.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
