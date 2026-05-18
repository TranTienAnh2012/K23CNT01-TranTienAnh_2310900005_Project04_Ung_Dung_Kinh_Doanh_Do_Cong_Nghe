import React from 'react';
import { useOutletContext } from 'react-router-dom';

export default function NnhClientHome() {
  // Lấy dữ liệu context (nếu cần) từ ClientLayout
  const { selectedCategory, setSelectedCategory } = useOutletContext() || {};

  // Dữ liệu danh sách bài viết blog mẫu phong phú, chất lượng cao
  const blogPosts = [
    {
      id: 1,
      title: 'Đánh giá chi tiết iPhone 15 Pro Max: Khung Titan và Camera 5x có thực sự đột phá?',
      excerpt: 'Khám phá sự thay đổi ngoạn mục về thiết kế với chất liệu Titanium hàng không vũ trụ cùng hệ thống ống kính tetraprism hoàn toàn mới...',
      category: 'Đánh giá chuyên sâu',
      date: '14 Tháng 5, 2026',
      readTime: '5 phút đọc',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop',
      featured: true,
    },
    {
      id: 2,
      title: 'Top 5 xu hướng Laptop AI định hình năm 2026: Sức mạnh xử lý NPU lên ngôi',
      excerpt: 'Sự ra mắt của các vi xử lý tích hợp NPU đang biến laptop cá nhân thành cỗ máy AI mạnh mẽ, hỗ trợ xử lý tác vụ thông minh ngay trên thiết bị...',
      category: 'Xu hướng công nghệ',
      date: '12 Tháng 5, 2026',
      readTime: '4 phút đọc',
      image: 'https://images.unsplash.com/photo-1496181130329-d50675f07ac5?q=80&w=600&auto=format&fit=crop',
      featured: false,
    },
    {
      id: 3,
      title: 'So sánh chi tiết AirPods Pro 2 và Sony WF-1000XM5: Đỉnh cao chống ồn',
      excerpt: 'Hai đại diện xuất sắc nhất trong thế giới tai nghe True Wireless cao cấp đọ sức về chất âm, khả năng chống ồn chủ động và độ thoải mái...',
      category: 'Tư vấn chọn mua',
      date: '10 Tháng 5, 2026',
      readTime: '6 phút đọc',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
      featured: false,
    },
    {
      id: 4,
      title: 'Hệ sinh thái thiết bị đeo thông minh: Tương lai của việc theo dõi sức khỏe',
      excerpt: 'Đồng hồ thông minh và nhẫn theo dõi sức khỏe đang kết hợp hoàn hảo để mang lại những cảnh báo y tế chuẩn xác nhất cho người dùng hiện đại...',
      category: 'Sức khỏe số',
      date: '08 Tháng 5, 2026',
      readTime: '3 phút đọc',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop',
      featured: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* TIÊU ĐỀ KHU VỰC BLOG */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block mb-1">Cập nhật 24/7</span>
          <h2 className="text-2xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">
            Tin tức & Bài viết mới nhất
          </h2>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Luôn cập nhật mới nhất
        </span>
      </div>

      {/* DANH SÁCH BÀI VIẾT BLOG - KẾT HỢP BÀI NỔI BẬT VÀ LƯỚI BÀI VIẾT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* BÀI VIẾT NỔI BẬT (FEATURED POST) - CHIẾM 2 CỘT */}
        {blogPosts.filter(p => p.featured).map((post) => (
          <div 
            key={post.id}
            className="lg:col-span-2 group relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-end min-h-[380px] shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
          >
            {/* LỚP ẢNH NỀN CÓ HIỆU ỨNG PARALLAX / ZOOM KHI HOVER */}
            <div className="absolute inset-0 z-0">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700" 
              />
              {/* GRADIENT OVERLAY ĐỂ ĐẢM BẢO ĐỘ ĐỌC CHỮ (CONTRAST) */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            </div>

            {/* NỘI DUNG BÀI NỔI BẬT PHÍA DƯỚI */}
            <div className="relative z-10 p-6 md:p-8 space-y-3 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-purple-600 text-white font-bold text-[10px] rounded-md tracking-wider uppercase shadow-sm">
                  {post.category}
                </span>
                <span className="text-slate-300 text-xs flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-xs">schedule</span> {post.readTime}
                </span>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-purple-300 transition-colors leading-snug font-['Space_Grotesk']">
                {post.title}
              </h3>

              <p className="text-slate-300 text-xs md:text-sm line-clamp-2 leading-relaxed">
                {post.excerpt}
              </p>

              <div className="pt-2 flex items-center justify-between text-slate-400 text-xs border-t border-white/10 mt-4">
                <span>Đăng ngày: {post.date}</span>
                <span className="text-purple-400 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Đọc tiếp <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* DANH SÁCH BÀI VIẾT PHỤ (SUB-POSTS) - NẰM CỘT BÊN PHẢI HOẶC TRẢI ĐỀU */}
        <div className="flex flex-col justify-between gap-6">
          {blogPosts.filter(p => !p.featured).slice(0, 2).map((post) => (
            <div 
              key={post.id}
              className="group bg-white border border-slate-100 hover:border-purple-200 rounded-2xl p-4 flex gap-4 items-center shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex-1"
            >
              {/* ẢNH THUMBNAIL BÀI VIẾT */}
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-50 shrink-0 relative">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <span className="absolute bottom-1 right-1 bg-slate-900/80 backdrop-blur-sm text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                  {post.category.split(' ')[0]}
                </span>
              </div>

              {/* THÔNG TIN BÀI VIẾT PHỤ */}
              <div className="space-y-1.5 flex-1 min-w-0">
                <p className="text-[10px] text-purple-600 font-bold uppercase tracking-wider">
                  {post.date}
                </p>
                <h4 
                  title={post.title}
                  className="font-bold text-xs text-slate-800 line-clamp-2 group-hover:text-purple-600 transition-colors leading-tight font-['Space_Grotesk']"
                >
                  {post.title}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  {post.excerpt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BÀI VIẾT THỨ 3 NẰM TRONG LƯỚI NGANG (NẾU CÓ) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {blogPosts.filter(p => !p.featured).slice(2).map((post) => (
          <div 
            key={post.id}
            className="group bg-gradient-to-r from-purple-50/50 to-indigo-50/50 border border-purple-100/60 rounded-2xl p-5 flex items-center justify-between gap-4 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="space-y-2 flex-1">
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 font-bold text-[10px] rounded">
                {post.category}
              </span>
              <h4 className="font-bold text-sm text-slate-900 group-hover:text-purple-700 transition-colors leading-snug font-['Space_Grotesk']">
                {post.title}
              </h4>
              <p className="text-xs text-slate-600 line-clamp-1">
                {post.excerpt}
              </p>
            </div>
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-sm">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>
          </div>
        ))}

        {/* THẺ ĐĂNG KÝ NHẬN TIN (NEWSLETTER MỚI LẠ) */}
        <div className="bg-gradient-to-br from-purple-900 to-indigo-950 rounded-2xl p-5 text-white flex flex-col justify-between relative overflow-hidden shadow-md">
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10">
            <span className="material-symbols-outlined text-8xl">mark_email_read</span>
          </div>
          <div className="space-y-1 relative z-10">
            <h4 className="font-bold text-sm font-['Space_Grotesk'] text-purple-200">Đăng ký bản tin công nghệ</h4>
            <p className="text-xs text-slate-300">Nhận mã giảm giá độc quyền và bài phân tích sớm nhất hàng tuần.</p>
          </div>
          <div className="flex gap-2 pt-3 relative z-10">
            <input 
              type="email" 
              placeholder="Email của bạn..." 
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-400 flex-1" 
            />
            <button 
              onClick={() => alert('Cảm ơn bạn đã đăng ký nhận bản tin!')}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs px-4 py-1.5 rounded-lg transition-colors shadow-sm"
            >
              Gửi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
