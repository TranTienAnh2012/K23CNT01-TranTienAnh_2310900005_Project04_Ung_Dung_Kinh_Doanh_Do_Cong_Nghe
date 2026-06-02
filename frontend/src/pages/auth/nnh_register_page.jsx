import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api/tta_api';
import NnhClientHeader from '../components/NnhClientHeader';
import NnhClientFooter from '../components/NnhClientFooter';

export default function TtaRegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }
    
    setLoading(true);
    try {
      await authApi.register({ email, password, name, phone });
      alert("Đăng ký tài khoản thành công! Vui lòng đăng nhập.");
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NnhClientHeader />
      <div className="bg-surface font-body-md text-on-surface flex flex-col items-center justify-center min-h-[80vh]">
      <main className="w-full flex items-center justify-center p-6 relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-secondary-fixed opacity-20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-primary-fixed opacity-30 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="w-full max-w-md z-10">
          <div className="bg-white p-8 md:p-10 rounded-xl shadow-[0_8px_30px_rgb(0,88,190,0.08)] border border-outline-variant/30">
            <div className="text-center mb-8">
              <h1 className="font-headline-lg text-[32px] text-primary mb-2 tracking-tight">Tạo Tài Khoản</h1>
              <p className="font-body-md text-on-primary-container">Gia nhập hệ sinh thái công nghệ Zenith Ztore.</p>
            </div>
            
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-1.5">
                <label className="font-label-sm text-[14px] text-on-surface-variant flex items-center gap-2" htmlFor="name">HỌ VÀ TÊN</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">person</span>
                  <input 
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-low border-b border-outline-variant focus:border-secondary focus:ring-0 transition-colors placeholder:text-outline/50 font-body-md outline-none" 
                    id="name" 
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập họ và tên..." 
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="font-label-sm text-[14px] text-on-surface-variant flex items-center gap-2" htmlFor="email">ĐỊA CHỈ EMAIL</label>
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

              <div className="space-y-1.5">
                <label className="font-label-sm text-[14px] text-on-surface-variant flex items-center gap-2" htmlFor="phone">SỐ ĐIỆN THOẠI</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">call</span>
                  <input 
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-low border-b border-outline-variant focus:border-secondary focus:ring-0 transition-colors placeholder:text-outline/50 font-body-md outline-none" 
                    id="phone" 
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912345678" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-1.5">
                  <label className="font-label-sm text-[14px] text-on-surface-variant flex items-center gap-2" htmlFor="password">MẬT KHẨU</label>
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
                  <label className="font-label-sm text-[14px] text-on-surface-variant flex items-center gap-2" htmlFor="confirm_password">XÁC NHẬN MẬT KHẨU</label>
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
                  Tôi đồng ý với <a className="text-secondary hover:underline" href="#">Điều khoản dịch vụ</a> và <a className="text-secondary hover:underline" href="#">Chính sách bảo mật</a>.
                </label>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}
              
              <button 
                className="w-full py-4 bg-secondary text-white font-headline-md text-[18px] rounded-lg shadow-lg shadow-secondary/20 hover:translate-y-[-2px] hover:shadow-xl hover:shadow-secondary/30 transition-all active:scale-[0.98] mt-4 disabled:opacity-60" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Đăng Ký Ngay'}
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="font-body-md text-on-surface-variant">
                Đã có tài khoản? <Link to="/login" className="text-secondary font-semibold hover:underline">Đăng nhập</Link>
              </p>
            </div>
          </div>
          
          <div className="mt-12 flex justify-center items-center gap-8 opacity-40 grayscale group hover:opacity-100 hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
              <span className="font-label-sm text-[10px] uppercase tracking-[0.2em]">Bảo Mật Dữ Liệu</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">encrypted</span>
              <span className="font-label-sm text-[10px] uppercase tracking-[0.2em]">256-Bit SSL</span>
            </div>
          </div>
        </div>
      </main>
    </div>
    <NnhClientFooter />
    </>
  );
}
