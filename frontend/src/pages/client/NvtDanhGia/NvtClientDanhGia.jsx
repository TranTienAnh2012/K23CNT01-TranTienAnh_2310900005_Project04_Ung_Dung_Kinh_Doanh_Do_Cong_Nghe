import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { shopApi } from '../../../api/client/tta_shop.api';

export default function NvtClientDanhGia({ maSanPham }) {
  const { user } = useAuth();
  const [reviewsData, setReviewsData] = useState({ items: [], total: 0, average_stars: 0 });
  const [canReview, setCanReview] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Review form states
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await shopApi.getProductReviews(maSanPham);
      if (res.data?.data) {
        setReviewsData(res.data.data);
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách đánh giá:", err);
    }
  };

  const checkEligibility = async () => {
    if (!user) {
      setCanReview(false);
      setLoading(false);
      return;
    }
    try {
      const res = await shopApi.checkCanReview(maSanPham);
      if (res.data?.data) {
        setCanReview(res.data.data.allowed);
      }
    } catch (err) {
      console.error("Lỗi kiểm tra quyền đánh giá:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (maSanPham) {
      fetchReviews();
      checkEligibility();
    }
  }, [maSanPham, user]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      alert("Vui lòng chọn số sao từ 1 đến 5.");
      return;
    }
    setSubmitting(true);
    try {
      await shopApi.submitReview({
        MaSanPham: parseInt(maSanPham),
        SoSao: rating,
        BinhLuan: comment
      });
      alert("Đánh giá của bạn đã được gửi thành công!");
      setComment('');
      setRating(5);
      
      // Tải lại dữ liệu
      await fetchReviews();
      await checkEligibility();
      
      // Bắn sự kiện để trang chi tiết cập nhật lại số sao hiển thị ở đầu trang
      window.dispatchEvent(new Event('review-submitted'));
    } catch (err) {
      console.error("Lỗi gửi đánh giá:", err);
      alert("Gửi đánh giá thất bại: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8 font-['Inter']">
      {/* TỔNG QUAN SỐ SAO ĐÁNH GIÁ ĐẸP */}
      <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-10 items-center justify-between shadow-sm">
        <div className="text-center md:text-left space-y-2 shrink-0">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Đánh giá trung bình</p>
          <div className="flex items-baseline gap-2 justify-center md:justify-start">
            <span className="text-5xl font-extrabold text-purple-700 font-['Space_Grotesk']">
              {reviewsData.average_stars || '0.0'}
            </span>
            <span className="text-slate-400 text-sm font-semibold">/ 5</span>
          </div>
          <div className="flex items-center gap-1 text-amber-400 justify-center md:justify-start">
            {[1, 2, 3, 4, 5].map((star) => {
              const fullStars = Math.floor(reviewsData.average_stars);
              const hasHalf = reviewsData.average_stars - fullStars >= 0.3;
              const isFilled = star <= fullStars;
              const isHalf = star === fullStars + 1 && hasHalf;
              return (
                <span 
                  key={star} 
                  className={`material-symbols-outlined text-lg ${isFilled ? 'filled' : ''}`}
                >
                  {isHalf ? "star_half" : "star"}
                </span>
              );
            })}
          </div>
          <p className="text-xs text-slate-500 font-medium">({reviewsData.total} lượt đánh giá thực tế)</p>
        </div>

        {/* Mẹo nhỏ giải thích logic tính trung bình */}
        <div className="flex-1 max-w-md text-xs text-slate-500/80 bg-white border border-purple-50/60 p-4 rounded-2xl leading-relaxed space-y-1.5 shadow-sm">
          <p className="font-bold text-purple-950 flex items-center gap-1.5 text-xs">
            <span className="material-symbols-outlined text-sm text-purple-600">verified</span>
            Logic đánh giá Zenith Store:
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Chỉ những khách hàng đã mua sản phẩm (qua giỏ hàng hoặc mua ngay) mới được đánh giá 1 lần.</li>
            <li>Điểm đánh giá thực tế hiển thị là giá trị trung bình cộng tất cả lượt đánh giá.</li>
          </ul>
        </div>
      </div>

      {/* FORM VIẾT ĐÁNH GIÁ (Nếu được phép) */}
      {canReview && (
        <form onSubmit={handleSubmitReview} className="bg-white border border-purple-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-5 border-t-4 border-t-purple-600">
          <h3 className="text-lg font-bold text-slate-900 font-['Space_Grotesk'] flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-600">rate_review</span>
            Viết Đánh Giá Của Bạn
          </h3>

          {/* Chọn số sao */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Chọn mức độ hài lòng:</label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-amber-400 focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                >
                  <span 
                    className={`material-symbols-outlined text-3xl ${(hoverRating || rating) >= star ? 'filled' : ''}`}
                  >
                    star
                  </span>
                </button>
              ))}
              <span className="text-xs font-bold text-slate-500 ml-2">
                {rating === 5 && 'Rất hài lòng'}
                {rating === 4 && 'Hài lòng'}
                {rating === 3 && 'Bình thường'}
                {rating === 2 && 'Không hài lòng'}
                {rating === 1 && 'Rất tệ'}
              </span>
            </div>
          </div>

          {/* Nội dung bình luận */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Nhận xét chi tiết (text):</label>
            <textarea
              required
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm thực tế của bạn về chất lượng sản phẩm, chế độ bảo hành và vận chuyển..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all bg-slate-50/50 resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang gửi đánh giá...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">send</span>
                  Gửi đánh giá
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* DANH SÁCH ĐÁNH GIÁ HIỆN TẠI */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 font-['Space_Grotesk'] pb-2 border-b border-slate-100 flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-500">reviews</span>
          Nhận xét từ khách hàng ({reviewsData.total})
        </h3>

        {reviewsData.total === 0 ? (
          <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <span className="material-symbols-outlined text-3xl text-slate-300">chat_bubble_outline</span>
            <p className="text-slate-400 text-xs font-semibold mt-2">Chưa có đánh giá nào cho sản phẩm này.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviewsData.items.map((rev) => (
              <div key={rev.MaDanhGia} className="bg-white border border-slate-100/80 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700 font-black text-xs border border-purple-100">
                      {rev.HoTen?.[0]?.toUpperCase() || 'K'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{rev.HoTen}</p>
                      <div className="flex items-center gap-0.5 text-amber-400 mt-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span 
                            key={s} 
                            className={`material-symbols-outlined text-[14px] ${s <= rev.SoSao ? 'filled' : ''}`}
                          >
                            star
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">{formatDate(rev.NgayDanhGia)}</span>
                </div>
                
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium pl-12">
                  {rev.BinhLuan}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
