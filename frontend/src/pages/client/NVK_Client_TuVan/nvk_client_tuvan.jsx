import React, { useState, useEffect } from 'react';
import { shopApi } from '../../../api/client/tta_shop.api';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function NvkClientTuVan() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState('services'); // 'services' or 'appointments'

  // Booking Modal State
  const [bookingService, setBookingService] = useState(null);
  const [form, setForm] = useState({
    G5_MaDichVu: '',
    G5_MaNhanVien: '',
    G5_ThoiGianBatDau: '',
    G5_ThoiGianKetThuc: '',
    G5_GhiChu: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [resServices, resStaff, resHistory] = await Promise.all([
        shopApi.getDichVuTuVan(),
        shopApi.getStaffList(),
        shopApi.getLichTuVan()
      ]);

      if (resServices.data?.data?.items) {
        setServices(resServices.data.data.items);
      }
      if (resStaff.data?.data?.items) {
        setStaff(resStaff.data.data.items);
      }
      if (resHistory.data?.data?.items) {
        setHistory(resHistory.data.data.items);
      }
    } catch (err) {
      console.error("Lỗi tải dữ liệu tư vấn:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      alert("Vui lòng đăng nhập để sử dụng dịch vụ tư vấn.");
      navigate('/login');
      return;
    }
    loadData();
  }, [user]);

  const handleOpenBooking = (service) => {
    setBookingService(service);
    setSelectedDate('');
    setSelectedTime('');
    setForm({
      G5_MaDichVu: service.G5_Id.toString(),
      G5_MaNhanVien: '',
      G5_ThoiGianBatDau: '',
      G5_ThoiGianKetThuc: '',
      G5_GhiChu: ''
    });
    setMessage({ type: '', text: '' });
  };

  const handleStartTimeChange = (val) => {
    setForm(prev => {
      const updated = { ...prev, G5_ThoiGianBatDau: val };
      if (bookingService && val) {
        const start = new Date(val);
        const durationMin = bookingService.G5_ThoiLuong || 60;
        const end = new Date(start.getTime() + durationMin * 60000);
        const tzoffset = end.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(end.getTime() - tzoffset)).toISOString().slice(0, -1).substring(0, 16);
        updated.G5_ThoiGianKetThuc = localISOTime;
      }
      return updated;
    });
  };

  const handleDateOrTimeChange = (date, time) => {
    if (date && time) {
      const combinedVal = `${date}T${time}`;
      handleStartTimeChange(combinedVal);
    } else {
      setForm(prev => ({
        ...prev,
        G5_ThoiGianBatDau: '',
        G5_ThoiGianKetThuc: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bookingService) return;
    if (!form.G5_ThoiGianBatDau) {
      setMessage({ type: 'error', text: 'Vui lòng chọn thời gian bắt đầu.' });
      return;
    }

    const startTime = new Date(form.G5_ThoiGianBatDau);
    if (startTime < new Date()) {
      setMessage({ type: 'error', text: 'Thời gian bắt đầu phải ở tương lai.' });
      return;
    }

    setSubmitting(true);
    setMessage({ type: '', text: '' });
    try {
      const payload = {
        G5_MaDichVu: parseInt(bookingService.G5_Id),
        G5_ThoiGianBatDau: form.G5_ThoiGianBatDau.replace('T', ' ') + ":00",
        G5_ThoiGianKetThuc: form.G5_ThoiGianKetThuc.replace('T', ' ') + ":00",
        G5_GhiChu: form.G5_GhiChu
      };

      if (form.G5_MaNhanVien) {
        payload.G5_MaNhanVien = parseInt(form.G5_MaNhanVien);
      }

      const res = await shopApi.bookLichTuVan(payload);
      if (res.data?.success) {
        alert('Đặt lịch tư vấn thành công!');
        setForm({
          G5_MaDichVu: '',
          G5_MaNhanVien: '',
          G5_ThoiGianBatDau: '',
          G5_ThoiGianKetThuc: '',
          G5_GhiChu: ''
        });
        setBookingService(null);
        setActiveTab('appointments');
        loadData();
      } else {
        setMessage({ type: 'error', text: res.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Không thể kết nối đến máy chủ.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelLich = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy lịch tư vấn này?")) return;
    try {
      const res = await shopApi.cancelLichTuVan({ G5_Id: id });
      if (res.data?.success) {
        alert("Đã hủy lịch tư vấn thành công!");
        loadData();
      } else {
        alert(res.data?.message || "Hủy lịch thất bại.");
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi hủy lịch tư vấn.");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Đã xác nhận':
      case 'Đã duyệt':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">Đã xác nhận</span>;
      case 'Đã hủy':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">Đã hủy</span>;
      case 'Đã hoàn thành':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200">Đã hoàn thành</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200">Chờ xác nhận</span>;
    }
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-8 font-['Inter'] min-h-screen">
      
      {/* Banner giới thiệu */}
      <div className="w-full bg-gradient-to-br from-purple-900 to-indigo-950 rounded-3xl p-8 md:p-12 text-white mb-8 relative overflow-hidden shadow-xl shadow-purple-950/10">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-[200px]">chat</span>
        </div>
        <div className="max-w-2xl relative z-10 space-y-4">
          <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs font-bold text-purple-300 tracking-wider uppercase">Tư vấn chuyên nghiệp</span>
          <h1 className="text-3xl md:text-4xl font-extrabold font-['Space_Grotesk'] tracking-tight">Dịch Vụ Tư Vấn Công Nghệ</h1>
          <p className="text-sm md:text-base text-purple-200/80 leading-relaxed font-medium">
            Đăng ký lịch tư vấn trực tiếp hoặc trực tuyến 1-1 với đội ngũ chuyên gia công nghệ của Zenith Ztore để được giải đáp thắc mắc và lựa chọn thiết bị phù hợp nhất.
          </p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-purple-100/60 mb-6 gap-6">
        <button
          onClick={() => setActiveTab('services')}
          className={`pb-3 text-base font-bold transition-all relative ${
            activeTab === 'services' ? 'text-purple-700' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Gói dịch vụ tư vấn
          {activeTab === 'services' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`pb-3 text-base font-bold transition-all relative ${
            activeTab === 'appointments' ? 'text-purple-700' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Lịch hẹn của bạn ({history.length})
          {activeTab === 'appointments' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-t-full" />
          )}
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 font-medium">Đang tải dữ liệu tư vấn...</p>
        </div>
      ) : activeTab === 'services' ? (
        
        /* TAB 1: DANH SÁCH DỊCH VỤ */
        services.length === 0 ? (
          <div className="py-20 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <span className="material-symbols-outlined text-5xl mb-3">support_agent</span>
            <p className="text-sm font-semibold">Hiện chưa có gói dịch vụ tư vấn nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {services.map((s) => (
              <div
                key={s.G5_Id}
                className="group bg-white border border-slate-100/80 hover:border-purple-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-100/50 text-purple-700 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                  <span className="material-symbols-outlined text-2xl">support_agent</span>
                </div>
                
                <div className="space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-800 leading-snug line-clamp-2">
                      {s.G5_TenDichVu}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-3">
                      {s.G5_MoTa || 'Hỗ trợ giải đáp thắc mắc, tư vấn cài đặt phần mềm và tối ưu thiết bị.'}
                    </p>
                    <div className="mt-3 text-xs text-slate-500">
                      <p>Thời lượng: <strong className="text-slate-800">{s.G5_ThoiLuong} phút</strong></p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-3 border-t border-slate-50 mt-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-purple-600 font-extrabold text-base font-['Space_Grotesk']">
                        {Number(s.G5_Gia).toLocaleString('vi-VN')} đ
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenBooking(s)}
                      className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors text-center active:scale-95 shadow-sm mt-2"
                    >
                      Đặt lịch ngay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        
        /* TAB 2: LỊCH SỬ HẸN TƯ VẤN */
        history.length === 0 ? (
          <div className="py-20 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <span className="material-symbols-outlined text-5xl mb-3">calendar_today</span>
            <p className="text-sm font-semibold">Bạn chưa có lịch hẹn tư vấn nào.</p>
            <button
              onClick={() => setActiveTab('services')}
              className="mt-3 text-xs font-bold text-purple-600 hover:underline"
            >
              Khám phá các gói dịch vụ tư vấn
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.G5_Id} className="border border-purple-50 hover:border-purple-100 rounded-2xl p-6 transition-all shadow-sm bg-gradient-to-br from-white to-purple-50/10">
                <div className="flex justify-between items-start mb-3 gap-2">
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">{item.G5_TenDichVu}</h3>
                    <p className="text-xs text-purple-600 font-semibold mt-0.5">
                      {Number(item.G5_Gia).toLocaleString('vi-VN')} đ
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(item.G5_TrangThai)}
                    {['Chờ xác nhận', 'Đã xác nhận', 'Đã duyệt'].includes(item.G5_TrangThai) && (
                      <button
                        onClick={() => handleCancelLich(item.G5_Id)}
                        className="px-2.5 py-0.5 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-lg text-[10px] font-bold transition-colors"
                      >
                        Hủy lịch
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600 border-t border-purple-50 pt-3">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-slate-400 text-sm">calendar_month</span>
                    <span>Bắt đầu: {formatDateTime(item.G5_ThoiGianBatDau)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-slate-400 text-sm">schedule</span>
                    <span>Kết thúc: {formatDateTime(item.G5_ThoiGianKetThuc)}</span>
                  </div>
                  {item.G5_TenNhanVien && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:col-span-2 mt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-slate-400 text-sm">person</span>
                        <span>Nhân viên tư vấn: <strong className="text-slate-800">{item.G5_TenNhanVien}</strong></span>
                      </div>
                      {['Đã xác nhận', 'Đã duyệt'].includes(item.G5_TrangThai) && (
                        <a
                          href="https://meet.google.com/g5-store-consulting"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg text-[10px] font-bold transition-all shadow-sm shadow-emerald-100 w-fit"
                        >
                          <span className="material-symbols-outlined text-[12px]">video_call</span>
                          Tham gia Google Meet
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {item.G5_GhiChu && (
                  <div className="mt-3 bg-purple-50/30 p-2.5 rounded-xl text-xs text-slate-500 border border-purple-50/50">
                    <strong>Ghi chú:</strong> {item.G5_GhiChu}
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}

      {/* BOOKING MODAL */}
      {bookingService && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-purple-100 animate-slide-up">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-purple-900 to-indigo-950 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Đặt Lịch Hẹn Tư Vấn</h3>
                <p className="text-xs text-purple-200/80">{bookingService.G5_TenDichVu}</p>
              </div>
              <button
                onClick={() => setBookingService(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {message.text && (
                <div className={`p-4 rounded-xl text-sm font-semibold mb-4 flex items-start gap-2.5 ${
                  message.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                    : 'bg-rose-50 text-rose-700 border border-rose-100'
                }`}>
                  <span className="material-symbols-outlined text-lg">
                    {message.type === 'success' ? 'check_circle' : 'error'}
                  </span>
                  <span>{message.text}</span>
                </div>
              )}

              <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100/50 space-y-1.5 text-xs text-purple-950">
                <p><strong>Thời lượng gói:</strong> {bookingService.G5_ThoiLuong} phút</p>
                <p><strong>Phí dịch vụ:</strong> {Number(bookingService.G5_Gia).toLocaleString('vi-VN')} đ</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Thời Gian Hẹn</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Chọn ngày</label>
                    <input
                      type="date"
                      value={selectedDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        handleDateOrTimeChange(e.target.value, selectedTime);
                      }}
                      className="w-full h-11 px-3 border border-slate-200 rounded-xl outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Chọn khung giờ</label>
                    <select
                      value={selectedTime}
                      onChange={(e) => {
                        setSelectedTime(e.target.value);
                        handleDateOrTimeChange(selectedDate, e.target.value);
                      }}
                      className="w-full h-11 px-3 border border-slate-200 rounded-xl outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm bg-white"
                      required
                    >
                      <option value="">-- Chọn giờ --</option>
                      <optgroup label="Sáng">
                        <option value="08:00">08:00 sáng</option>
                        <option value="08:30">08:30 sáng</option>
                        <option value="09:00">09:00 sáng</option>
                        <option value="09:30">09:30 sáng</option>
                        <option value="10:00">10:00 sáng</option>
                        <option value="10:30">10:30 sáng</option>
                        <option value="11:00">11:00 sáng</option>
                        <option value="11:30">11:30 sáng</option>
                      </optgroup>
                      <optgroup label="Chiều - Tối">
                        <option value="13:30">13:30 chiều</option>
                        <option value="14:00">14:00 chiều</option>
                        <option value="14:30">14:30 chiều</option>
                        <option value="15:00">15:00 chiều</option>
                        <option value="15:30">15:30 chiều</option>
                        <option value="16:00">16:00 chiều</option>
                        <option value="16:30">16:30 chiều</option>
                        <option value="17:00">17:00 chiều</option>
                        <option value="17:30">17:30 chiều</option>
                        <option value="18:00">18:00 tối</option>
                        <option value="18:30">18:30 tối</option>
                        <option value="19:00">19:00 tối</option>
                        <option value="19:30">19:30 tối</option>
                        <option value="20:00">20:00 tối</option>
                      </optgroup>
                    </select>
                  </div>
                </div>
              </div>

              {form.G5_ThoiGianKetThuc && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-655 flex justify-between items-center">
                  <span className="font-semibold text-slate-500">Thời gian kết thúc (dự kiến):</span>
                  <span className="font-bold text-slate-800">{formatDateTime(form.G5_ThoiGianKetThuc)}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Chọn Nhân Viên Tư Vấn (Nếu có)</label>
                <select
                  value={form.G5_MaNhanVien}
                  onChange={(e) => setForm(prev => ({ ...prev, G5_MaNhanVien: e.target.value }))}
                  className="w-full h-11 px-3 border border-slate-200 rounded-xl outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm bg-white"
                >
                  <option value="">-- Để hệ thống tự động phân công --</option>
                  {staff.map(st => (
                    <option key={st.G5_MaNguoiDung} value={st.G5_MaNguoiDung}>
                      {st.G5_HoTen}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Ghi Chú Yêu Cầu</label>
                <textarea
                  value={form.G5_GhiChu}
                  onChange={(e) => setForm(prev => ({ ...prev, G5_GhiChu: e.target.value }))}
                  placeholder="Nội dung cần tư vấn, các câu hỏi thắc mắc..."
                  rows="3"
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm resize-none"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setBookingService(null)}
                  className="flex-1 h-11 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition-colors text-sm"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 h-11 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-colors flex items-center justify-center gap-2 shadow-md shadow-purple-200 text-sm"
                >
                  {submitting ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">send</span>
                      <span>Xác nhận đặt lịch</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
