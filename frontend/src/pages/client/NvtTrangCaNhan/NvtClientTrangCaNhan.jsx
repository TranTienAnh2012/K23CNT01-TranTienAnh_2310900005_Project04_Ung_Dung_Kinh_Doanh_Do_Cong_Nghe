import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { shopApi } from '../../../api/tta_api';

export default function NvtClientTrangCaNhan() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'addresses' | 'password' | 'orders'
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    HoTen: '',
    Email: '',
    SDT: '',
    NgaySinh: '',
    AvatarUrl: '',
    Gender: 'Male',
    TenDangNhap: ''
  });

  // Password State
  const [pwdData, setPwdData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Address State
  const [userAddress, setUserAddress] = useState(() => {
    return localStorage.getItem(`address_${user?.id}`) || 'Chưa cấu hình địa chỉ nhận hàng';
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [tempAddress, setTempAddress] = useState('');

  const fetchOrders = async () => {
    try {
      const res = await shopApi.getOrders();
      if (res.data?.data) {
        setOrders(res.data.data);
      }
    } catch (e) {
      console.error("Lỗi lấy danh sách đơn hàng:", e);
    }
  };

  const fetchProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await shopApi.getProfile();
      if (res.data?.data) {
        const p = res.data.data;
        setProfileData({
          HoTen: p.HoTen || '',
          Email: p.Email || '',
          SDT: p.SDT || '',
          NgaySinh: p.NgaySinh || '',
          AvatarUrl: p.AvatarUrl || '',
          Gender: p.GioiTinh || p.Gender || 'Male',
          TenDangNhap: p.TenDangNhap || ''
        });
        updateUser({
          name: p.HoTen,
          avatarUrl: p.AvatarUrl
        });
      }
    } catch (err) {
      console.error("Lỗi lấy thông tin cá nhân:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    fetchProfile();
    fetchOrders();
  }, [user?.id]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white border border-purple-100 rounded-3xl shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-3xl">lock</span>
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk']">Yêu cầu đăng nhập</h2>
        <p className="text-sm text-slate-500">Bạn cần đăng nhập để xem trang cá nhân.</p>
        <Link to="/login" className="inline-block w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm shadow-lg transition-all">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);
  
  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
  };

  const getStatusBadge = (s) => {
    const map = {
      'Pending': { label: 'Chờ xác nhận', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
      'Chờ xử lý': { label: 'Chờ xác nhận', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
      'Chờ xác nhận': { label: 'Chờ xác nhận', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
      'Processing': { label: 'Đã xác nhận', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
      'Đã xác nhận': { label: 'Đã xác nhận', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
      'Đang giao': { label: 'Đang giao', cls: 'bg-purple-50 text-purple-700 border-purple-200' },
      'Shipping': { label: 'Đang giao', cls: 'bg-purple-50 text-purple-700 border-purple-200' },
      'Hoàn thành': { label: 'Hoàn thành', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      'Completed': { label: 'Hoàn thành', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      'Đã hủy': { label: 'Đã hủy', cls: 'bg-rose-50 text-rose-700 border-rose-200' },
      'Cancelled': { label: 'Đã hủy', cls: 'bg-rose-50 text-rose-700 border-rose-200' },
    };
    const info = map[s] || { label: s, cls: 'bg-slate-50 text-slate-700 border-slate-200' };
    return (
      <span className={`px-2.5 py-0.5 border rounded-full text-[10px] font-bold ${info.cls}`}>
        {info.label}
      </span>
    );
  };

  // Profile Save handler
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await shopApi.updateProfile({
        HoTen: profileData.HoTen,
        SDT: profileData.SDT,
        NgaySinh: profileData.NgaySinh,
        TenDangNhap: profileData.TenDangNhap,
        GioiTinh: profileData.Gender
      });
      alert("Cập nhật hồ sơ thành công!");
      fetchProfile();
    } catch (err) {
      console.error("Lỗi cập nhật hồ sơ:", err);
      alert("Không thể cập nhật hồ sơ. Vui lòng thử lại.");
    } finally {
      setSavingProfile(false);
    }
  };

  // Change password handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwdData.newPassword !== pwdData.confirmPassword) {
      alert("Xác nhận mật khẩu mới không trùng khớp.");
      return;
    }
    setSavingPwd(true);
    try {
      await shopApi.changePassword({
        currentPassword: pwdData.currentPassword,
        newPassword: pwdData.newPassword
      });
      alert("Đổi mật khẩu thành công!");
      setPwdData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error("Lỗi đổi mật khẩu:", err);
      alert(err.response?.data?.message || "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại.");
    } finally {
      setSavingPwd(false);
    }
  };

  // File Upload avatar handler
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      alert("Kích thước file ảnh vượt quá giới hạn 1 MB.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await shopApi.uploadAvatar(formData);
      if (res.data?.data?.url) {
        const imgUrl = res.data.data.url;
        setProfileData(prev => ({ ...prev, AvatarUrl: imgUrl }));
        await shopApi.updateProfile({ AvatarUrl: imgUrl });
        alert("Cập nhật ảnh đại diện thành công!");
      }
    } catch (err) {
      console.error("Lỗi tải ảnh đại diện:", err);
      alert("Không thể tải lên ảnh đại diện. Vui lòng thử lại.");
    }
  };

  const handleSaveAddress = () => {
    localStorage.setItem(`address_${user.id}`, tempAddress);
    setUserAddress(tempAddress);
    setIsEditingAddress(false);
    alert("Cập nhật địa chỉ mặc định thành công!");
  };

  return (
    <div className="py-6 font-['Inter'] max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* CỘT TRÁI: SIDEBAR THÔNG TIN CÁ NHÂN */}
        <div className="md:col-span-1 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-12 h-12 rounded-full border border-purple-100 overflow-hidden bg-purple-50 flex items-center justify-center shrink-0 cursor-pointer hover:opacity-85 transition-opacity"
            >
              {profileData.AvatarUrl ? (
                <img 
                  src={getImageUrl(profileData.AvatarUrl)} 
                  alt="avatar" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <span className="text-purple-600 font-extrabold text-lg">
                  {profileData.HoTen?.[0]?.toUpperCase() || profileData.Email?.[0]?.toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-extrabold text-sm text-slate-800 truncate">
                {profileData.Email?.split('@')[0]}
              </p>
              <button 
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-purple-600 transition-colors"
              >
                <span className="material-symbols-outlined text-[12px]">edit</span>
                Sửa hồ sơ
              </button>
            </div>
          </div>

          <div className="space-y-1">
            {/* Mục: Tài khoản của tôi */}
            <div className="py-1">
              <div className="flex items-center gap-2.5 px-3 py-2 text-xs font-black text-slate-800 uppercase tracking-wider">
                <span className="material-symbols-outlined text-purple-600 text-sm">person</span>
                Tài khoản của tôi
              </div>
              <div className="pl-8 space-y-0.5">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left py-2 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === 'profile' 
                      ? 'text-purple-600' 
                      : 'text-slate-600 hover:text-purple-600'
                  }`}
                >
                  Hồ sơ
                </button>
                <button
                  onClick={() => {
                    setActiveTab('addresses');
                    setTempAddress(userAddress);
                  }}
                  className={`w-full text-left py-2 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === 'addresses' 
                      ? 'text-purple-600' 
                      : 'text-slate-600 hover:text-purple-600'
                  }`}
                >
                  Địa chỉ
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full text-left py-2 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === 'password' 
                      ? 'text-purple-600' 
                      : 'text-slate-600 hover:text-purple-600'
                  }`}
                >
                  Đổi mật khẩu
                </button>
              </div>
            </div>

            {/* Mục: Đơn mua */}
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-2.5 px-3 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-colors ${
                activeTab === 'orders'
                  ? 'bg-purple-50 text-purple-700'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-purple-600'
              }`}
            >
              <span className="material-symbols-outlined text-sm">receipt_long</span>
              Đơn mua của tôi
            </button>

            {/* Mục: Ví Voucher */}
            <Link
              to="/voucher"
              className="w-full flex items-center gap-2.5 px-3 py-3 text-xs font-black uppercase tracking-wider text-slate-700 hover:bg-slate-50 hover:text-purple-600 rounded-xl transition-colors"
            >
              <span className="material-symbols-outlined text-sm">confirmation_number</span>
              Ví Voucher của tôi
            </Link>

            {/* Mục: Đăng xuất */}
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-3 text-xs font-black uppercase tracking-wider text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              Đăng xuất
            </button>
          </div>
        </div>

        {/* CỘT PHẢI: CHI TIẾT TỪNG TAB */}
        <div className="md:col-span-3 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
          
          {/* TAB 1: HỒ SƠ CÁ NHÂN */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-extrabold text-slate-800 font-['Space_Grotesk']">Hồ sơ của tôi</h2>
                <p className="text-xs text-slate-400 font-medium">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
              </div>
              <div className="h-px bg-slate-100" />
              
              {loading ? (
                <div className="py-12 flex justify-center">
                  <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="flex flex-col-reverse lg:flex-row gap-8">
                  {/* CỘT TRÁI FORM */}
                  <div className="flex-1 space-y-5">
                    {/* Tên đăng nhập */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <label className="w-32 text-xs font-bold text-slate-500 sm:text-right">Tên đăng nhập</label>
                      <input 
                        type="text" 
                        value={profileData.TenDangNhap}
                        onChange={(e) => setProfileData(prev => ({ ...prev, TenDangNhap: e.target.value }))}
                        className="flex-1 px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:border-purple-500 focus:outline-none transition-colors"
                        placeholder="Nhập tên đăng nhập"
                        required
                      />
                    </div>

                    {/* Tên đầy đủ */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <label className="w-32 text-xs font-bold text-slate-500 sm:text-right">Tên</label>
                      <input 
                        type="text" 
                        value={profileData.HoTen}
                        onChange={(e) => setProfileData(prev => ({ ...prev, HoTen: e.target.value }))}
                        className="flex-1 px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:border-purple-500 focus:outline-none transition-colors"
                        placeholder="Nhập họ và tên"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <span className="w-32 text-xs font-bold text-slate-400 sm:text-right">Email</span>
                      <span className="text-xs font-bold text-slate-700 px-1 py-1 flex-1">
                        {profileData.Email}
                      </span>
                    </div>

                    {/* Số điện thoại */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <label className="w-32 text-xs font-bold text-slate-500 sm:text-right">Số điện thoại</label>
                      <input 
                        type="text" 
                        value={profileData.SDT}
                        onChange={(e) => setProfileData(prev => ({ ...prev, SDT: e.target.value }))}
                        className="flex-1 px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:border-purple-500 focus:outline-none transition-colors"
                        placeholder="Nhập số điện thoại"
                      />
                    </div>

                    {/* Giới tính */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <span className="w-32 text-xs font-bold text-slate-500 sm:text-right">Giới tính</span>
                      <div className="flex items-center gap-6">
                        {['Male', 'Female', 'Other'].map((g) => {
                          const label = g === 'Male' ? 'Nam' : g === 'Female' ? 'Nữ' : 'Khác';
                          return (
                            <label key={g} className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                              <input 
                                type="radio" 
                                name="gender" 
                                value={g}
                                checked={profileData.Gender === g}
                                onChange={() => setProfileData(prev => ({ ...prev, Gender: g }))}
                                className="w-4 h-4 text-purple-600 border-slate-300 focus:ring-purple-500"
                              />
                              {label}
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Ngày sinh */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <label className="w-32 text-xs font-bold text-slate-500 sm:text-right">Ngày sinh</label>
                      <input 
                        type="date" 
                        value={profileData.NgaySinh}
                        onChange={(e) => setProfileData(prev => ({ ...prev, NgaySinh: e.target.value }))}
                        className="flex-1 px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:border-purple-500 focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Nút lưu */}
                    <div className="flex flex-col sm:flex-row gap-6 pt-4">
                      <div className="w-32 hidden sm:block"></div>
                      <button 
                        type="submit"
                        disabled={savingProfile}
                        className="px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-100 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                      >
                        {savingProfile ? 'Đang lưu...' : 'Lưu thông tin'}
                      </button>
                    </div>
                  </div>

                  {/* CỘT PHẢI UPLOAD AVATAR */}
                  <div className="w-full lg:w-1/3 flex flex-col items-center justify-center p-4 border-l border-slate-100 gap-4">
                    <div className="relative group">
                      <div className="w-28 h-28 rounded-full border border-purple-100 overflow-hidden bg-purple-50 flex items-center justify-center shadow-inner">
                        {profileData.AvatarUrl ? (
                          <img 
                            src={getImageUrl(profileData.AvatarUrl)} 
                            alt="avatar" 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <span className="text-purple-600 font-extrabold text-3xl">
                            {profileData.HoTen?.[0]?.toUpperCase() || 'U'}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleAvatarUpload}
                      accept=".jpg,.jpeg,.png"
                      className="hidden" 
                    />
                    
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 border border-slate-200 hover:border-purple-300 hover:bg-purple-50/20 rounded-xl text-xs font-bold text-slate-600 hover:text-purple-700 transition-all cursor-pointer"
                    >
                      Chọn ảnh
                    </button>
                    
                    <div className="text-[10px] text-slate-400 text-center font-semibold leading-relaxed space-y-0.5">
                      <p>Dung lượng file tối đa 1 MB</p>
                      <p>Định dạng: .JPEG, .PNG</p>
                    </div>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: ĐỊA CHỈ */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-800 font-['Space_Grotesk']">Địa chỉ của tôi</h2>
                  <p className="text-xs text-slate-400 font-medium">Địa chỉ nhận hàng mặc định cho tài khoản của bạn</p>
                </div>
                {!isEditingAddress && (
                  <button
                    onClick={() => setIsEditingAddress(true)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Thay đổi
                  </button>
                )}
              </div>
              <div className="h-px bg-slate-100" />

              {isEditingAddress ? (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">Nhập địa chỉ giao hàng mới</label>
                    <textarea
                      value={tempAddress}
                      onChange={(e) => setTempAddress(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveAddress}
                      className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Lưu địa chỉ
                    </button>
                    <button
                      onClick={() => setIsEditingAddress(false)}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-250 text-slate-600 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Hủy bỏ
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-5 border border-purple-100 rounded-2xl bg-purple-50/20 space-y-3 relative overflow-hidden">
                  <div className="absolute right-4 top-4 px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-black rounded uppercase tracking-wider">
                    Mặc định
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800">
                      <span>{profileData.HoTen || 'Chưa cập nhật tên'}</span>
                      <span className="w-px h-3 bg-slate-300" />
                      <span className="text-slate-500 font-semibold">{profileData.SDT || 'Chưa cập nhật SĐT'}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      {userAddress}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ĐỔI MẬT KHẨU */}
          {activeTab === 'password' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-extrabold text-slate-800 font-['Space_Grotesk']">Đổi mật khẩu</h2>
                <p className="text-xs text-slate-400 font-medium">Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>
              </div>
              <div className="h-px bg-slate-100" />

              <form onSubmit={handleChangePassword} className="max-w-lg space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <label className="w-40 text-xs font-bold text-slate-500 sm:text-right">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    value={pwdData.currentPassword}
                    onChange={(e) => setPwdData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="flex-1 px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Nhập mật khẩu hiện tại"
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <label className="w-40 text-xs font-bold text-slate-500 sm:text-right">Mật khẩu mới</label>
                  <input
                    type="password"
                    value={pwdData.newPassword}
                    onChange={(e) => setPwdData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="flex-1 px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Nhập mật khẩu mới"
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <label className="w-40 text-xs font-bold text-slate-500 sm:text-right">Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    value={pwdData.confirmPassword}
                    onChange={(e) => setPwdData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="flex-1 px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Nhập lại mật khẩu mới"
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-6 pt-4">
                  <div className="w-40 hidden sm:block"></div>
                  <button
                    type="submit"
                    disabled={savingPwd}
                    className="px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-100 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                  >
                    {savingPwd ? 'Đang đổi...' : 'Xác nhận'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: ĐƠN MUA */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-extrabold text-slate-800 font-['Space_Grotesk']">Đơn mua của tôi</h2>
                <p className="text-xs text-slate-400 font-medium">Lịch sử và trạng thái mua sắm của bạn</p>
              </div>
              <div className="h-px bg-slate-100" />

              <div className="space-y-4">
                {loading ? (
                  <div className="min-h-[200px] flex flex-col items-center justify-center gap-3 text-purple-600">
                    <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-bold animate-pulse">Đang tải đơn hàng...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-16 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 space-y-4">
                    <span className="material-symbols-outlined text-4xl text-slate-300">shopping_cart_checkout</span>
                    <p className="font-bold text-slate-500">Chưa có đơn hàng nào</p>
                    <Link to="/" className="inline-block px-6 py-2.5 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition-all">
                      Mua sắm ngay
                    </Link>
                  </div>
                ) : (
                  orders.map(order => (
                    <div key={order.MaDonHang}
                      onClick={() => navigate(`/lich-su-don-hang/${order.MaDonHang}`)}
                      className="bg-white border border-slate-100 hover:border-purple-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-3 cursor-pointer group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-800 font-['Space_Grotesk'] group-hover:text-purple-600 transition-colors">Đơn #{order.MaDonHang}</span>
                          {getStatusBadge(order.TrangThai)}
                          {order.TrangThaiThanhToan === 'Paid' && (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[10px] font-bold">Đã TT</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 font-medium">{formatDate(order.NgayDatHang)}</p>
                      </div>

                      {order.items && order.items.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto scrollbar-none">
                          {order.items.slice(0, 4).map((item, idx) => (
                            <div key={idx} className="flex-shrink-0 flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
                              <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center overflow-hidden">
                                {getImageUrl(item.HinhAnh)
                                  ? <img src={getImageUrl(item.HinhAnh)} alt={item.TenSanPham} className="w-full h-full object-contain" />
                                  : <span className="material-symbols-outlined text-sm text-slate-300">image</span>
                                }
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-slate-700 max-w-[100px] truncate">{item.TenSanPham}</p>
                                <p className="text-[10px] text-slate-400">x{item.SoLuong}</p>
                              </div>
                            </div>
                          ))}
                          {order.items.length > 4 && (
                            <div className="flex-shrink-0 flex items-center px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                              <p className="text-[10px] font-bold text-slate-500">+{order.items.length - 4} SP</p>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 border-t border-slate-50">
                        <p className="text-xs text-slate-400 font-medium">{order.PhuongThucThanhToan}</p>
                        <p className="font-black text-purple-600 text-sm font-['Space_Grotesk']">{formatPrice(order.TongTien)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
