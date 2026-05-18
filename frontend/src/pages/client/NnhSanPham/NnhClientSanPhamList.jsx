import React from 'react';
import { Link } from 'react-router-dom';

export default function NnhClientSanPhamList({ 
  products = [], 
  loading = false, 
  selectedCategory = '', 
  setSelectedCategory 
}) {
  // Hàm hỗ trợ chuẩn hóa đường dẫn hình ảnh sản phẩm
  const getImageUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop';
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
  };

  // Hàm định dạng giá tiền tệ Việt Nam Đồng (VND)
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Lọc sản phẩm theo danh mục đang được người dùng chọn (Hỗ trợ cả key thực tế từ CSDL và key fallback)
  const filteredProducts = selectedCategory
    ? products.filter((p) => {
        const catName = p.TenDanhMuc || p.G5_TenDanhMuc || '';
        const prodName = p.TenSanPham || p.G5_TenSP || '';
        return catName.toLowerCase().includes(selectedCategory.toLowerCase()) || 
               prodName.toLowerCase().includes(selectedCategory.toLowerCase());
      })
    : products;

  // Xử lý sự kiện khi người dùng bấm nút "Thêm vào giỏ hàng"
  const handleAddToCart = (product) => {
    const name = product.TenSanPham || product.G5_TenSP || 'Sản phẩm';
    alert(`Đã thêm "${name}" vào giỏ hàng thành công!`);
  };

  return (
    <div className="space-y-6 pt-4">
      {/* TIÊU ĐỀ LƯỚI SẢN PHẨM & TRẠNG THÁI BỘ LỌC */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-xl font-bold text-slate-900 font-['Space_Grotesk'] flex items-center gap-2">
          {selectedCategory ? (
            <>
              <span className="material-symbols-outlined text-purple-600">filter_alt</span>
              Sản phẩm: <span className="text-purple-600">{selectedCategory}</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-purple-600">local_fire_department</span>
              Sản phẩm nổi bật
            </>
          )}
        </h2>
        {/* NÚT XÓA BỘ LỌC KHI ĐANG LỌC THEO DANH MỤC */}
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory?.('')}
            className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* HIỂN THỊ LƯỚI SẢN PHẨM TRÊN GIAO DIỆN */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 animate-pulse">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-slate-100 rounded-2xl h-80 border border-slate-200/60" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          {/* TRƯỜNG HỢP KHÔNG TÌM THẤY SẢN PHẨM TRONG DANH MỤC */}
          <span className="material-symbols-outlined text-4xl text-slate-400">inventory_2</span>
          <p className="text-slate-500 text-sm font-medium">Không tìm thấy sản phẩm nào trong danh mục này.</p>
          <button
            onClick={() => setSelectedCategory?.('')}
            className="text-xs font-bold text-purple-600 underline hover:text-purple-800"
          >
            Xem tất cả sản phẩm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {/* DANH SÁCH THẺ SẢN PHẨM */}
          {filteredProducts.map((prod, index) => {
            // Chuẩn hóa tên sản phẩm, hình ảnh và định danh
            const id = prod.MaSanPham || prod.G5_MaSP || index;
            const name = prod.TenSanPham || prod.G5_TenSP || 'Sản phẩm cao cấp';
            const image = prod.HinhAnh || prod.G5_HinhAnh;
            
            // Tính toán giá bán và giá gốc linh hoạt theo DB thực tế
            const priceSale = prod.GiaBan || prod.G5_Gia || 15000000;
            const priceOriginal = prod.Gia && prod.Gia > priceSale ? prod.Gia : priceSale * 1.15;
            
            // Tự động gán nhãn phần trăm giảm giá dựa trên chênh lệch giá hoặc chu kỳ
            const calculatedDiscount = Math.round((1 - priceSale / priceOriginal) * 100);
            const badgeText = prod.discount || `-${calculatedDiscount > 0 ? calculatedDiscount : 10}%`;

            return (
              <div
                key={id}
                className="group bg-white border border-slate-100/80 hover:border-purple-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                {/* HUY HIỆU GIẢM GIÁ (DISCOUNT PILL) */}
                <span className="absolute top-3 left-3 px-2 py-0.5 bg-purple-600 text-white font-bold text-[10px] rounded tracking-wide z-10 shadow-sm">
                  {badgeText}
                </span>

                {/* KHU VỰC HÌNH ẢNH SẢN PHẨM CÓ HIỆU ỨNG ZOOM KHI HOVER */}
                <Link to={`/san-pham/${id}`} className="block relative w-full aspect-square rounded-xl overflow-hidden bg-slate-50 p-2 mb-3 cursor-pointer">
                  <img
                    src={getImageUrl(image)}
                    alt={name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Nút Xem chi tiết trượt lên khi hover */}
                  <div className="absolute inset-0 bg-purple-950/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1 bg-white text-purple-900 font-bold text-xs rounded-full shadow-md transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      Xem chi tiết
                    </span>
                  </div>
                </Link>

                {/* THÔNG TIN CHI TIẾT SẢN PHẨM */}
                <div className="space-y-2 flex-1 flex flex-col justify-between">
                  {/* TÊN SẢN PHẨM TỐI ĐA 2 DÒNG */}
                  <Link to={`/san-pham/${id}`}>
                    <h3
                      title={name}
                      className="font-bold text-xs md:text-sm text-slate-800 line-clamp-2 group-hover:text-purple-600 transition-colors leading-snug cursor-pointer"
                    >
                      {name}
                    </h3>
                  </Link>

                  {/* KHU VỰC GIÁ VÀ NÚT THÊM VÀO GIỎ HÀNG */}
                  <div className="flex items-end justify-between pt-2">
                    <div>
                      {/* GIÁ BÁN KHUYẾN MÃI (CHÍNH) */}
                      <p className="text-purple-600 font-extrabold text-sm md:text-base font-['Space_Grotesk'] leading-none">
                        {formatPrice(priceSale)}
                      </p>
                      {/* GIÁ GỐC BỊ GẠCH NGANG */}
                      <p className="text-slate-400 line-through text-[10px] md:text-xs pt-1">
                        {formatPrice(priceOriginal)}
                      </p>
                    </div>

                    {/* NÚT THÊM VÀO GIỎ HÀNG HÌNH TRÒN */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(prod);
                      }}
                      title="Thêm vào giỏ hàng"
                      className="w-8 h-8 rounded-full bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-700 flex items-center justify-center transition-colors border border-purple-100/50 active:scale-95"
                    >
                      <span className="material-symbols-outlined text-sm md:text-base">add_shopping_cart</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
