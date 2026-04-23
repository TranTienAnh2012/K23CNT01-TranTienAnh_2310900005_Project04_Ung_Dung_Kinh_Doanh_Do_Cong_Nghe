import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../api/tta_axios';

export default function TtaRegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      // Giả sử có endpoint /api/tta_auth/register
      await axios.post('/api/tta_auth/register', { name, email, password });
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate('/login');
    } catch (err) {
      alert('Đăng ký thất bại: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="bg-surface font-body-md text-on-surface flex flex-col items-center justify-center min-h-[80vh]">
      <main className="w-full flex items-center justify-center p-6 relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-secondary-fixed opacity-20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-primary-fixed opacity-30 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="w-full max-w-md z-10">
          <div className="bg-white p-8 md:p-10 rounded-xl shadow-[0_8px_30px_rgb(0,88,190,0.08)] border border-outline-variant/30">
            <div className="text-center mb-8">
              <h1 className="font-headline-lg text-[32px] text-primary mb-2 tracking-tight">Create Account</h1>
              <p className="font-body-md text-on-primary-container">Join the ecosystem of technological clarity.</p>
            </div>
            
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-1.5">
                <label className="font-label-sm text-[14px] text-on-surface-variant flex items-center gap-2" htmlFor="name">FULL NAME</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">person</span>
                  <input 
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-low border-b border-outline-variant focus:border-secondary focus:ring-0 transition-colors placeholder:text-outline/50 font-body-md outline-none" 
                    id="name" 
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Họ và tên" 
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="font-label-sm text-[14px] text-on-surface-variant flex items-center gap-2" htmlFor="email">EMAIL ADDRESS</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">mail</span>
                  <input 
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-low border-b border-outline-variant focus:border-secondary focus:ring-0 transition-colors placeholder:text-outline/50 font-body-md outline-none" 
                    id="email" 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-1.5">
                  <label className="font-label-sm text-[14px] text-on-surface-variant flex items-center gap-2" htmlFor="password">PASSWORD</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
                    <input 
                      className="w-full pl-10 pr-4 py-3 bg-surface-container-low border-b border-outline-variant focus:border-secondary focus:ring-0 transition-colors placeholder:text-outline/50 font-body-md outline-none" 
                      id="password" 
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" 
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="font-label-sm text-[14px] text-on-surface-variant flex items-center gap-2" htmlFor="confirm_password">CONFIRM PASSWORD</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">shield</span>
                    <input 
                      className="w-full pl-10 pr-4 py-3 bg-surface-container-low border-b border-outline-variant focus:border-secondary focus:ring-0 transition-colors placeholder:text-outline/50 font-body-md outline-none" 
                      id="confirm_password" 
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••" 
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 py-2">
                <input className="mt-1 h-4 w-4 rounded border-outline-variant text-secondary focus:ring-secondary/20 transition-all" id="terms" type="checkbox" required />
                <label className="text-[14px] text-on-surface-variant font-medium leading-relaxed" htmlFor="terms">
                  I agree to the <a className="text-secondary hover:underline" href="#">Terms of Service</a> and <a className="text-secondary hover:underline" href="#">Privacy Policy</a>.
                </label>
              </div>
              
              <button className="w-full py-4 bg-secondary text-white font-headline-md text-[18px] rounded-lg shadow-lg shadow-secondary/20 hover:translate-y-[-2px] hover:shadow-xl hover:shadow-secondary/30 transition-all active:scale-[0.98] mt-4" type="submit">
                Create Account
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="font-body-md text-on-surface-variant">
                Already have an account? <Link to="/login" className="text-secondary font-semibold hover:underline">Login</Link>
              </p>
            </div>
          </div>
          
          <div className="mt-12 flex justify-center items-center gap-8 opacity-40 grayscale group hover:opacity-100 hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
              <span className="font-label-sm text-[10px] uppercase tracking-[0.2em]">Secure Data</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">encrypted</span>
              <span className="font-label-sm text-[10px] uppercase tracking-[0.2em]">256-Bit SSL</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
