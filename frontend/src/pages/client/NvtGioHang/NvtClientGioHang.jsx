import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { shopApi } from '../../../api/client/tta_shop.api';
import { useAuth } from '../../../context/AuthContext';

export default function NvtClientGioHang() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({}); // mapping: itemId (G5_Id) -> boolean
  const [loading, setLoading] = useState(true);

  const getImageUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop';
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const fetchCart = async () => {
    try {
      const res = await shopApi.getCart();
      if (res.data?.data) {
        setCartItems(res.data.data);
        // By default, select all items
        const initialSelected = {};
        res.data.data.forEach(item => {
          initialSelected[item.Id] = true;
        });
        setSelectedItems(initialSelected);
      }
    } catch (err) {
      console.error("Lỗi lấy thông tin giỏ hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Handle select item
  const handleSelectItem = (id) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Handle select all
  const handleSelectAll = (checked) => {
    const nextSelected = {};
    cartItems.forEach(item => {
      nextSelected[item.Id] = checked;
    });
    setSelectedItems(nextSelected);
  };

  // Update item quantity in cart
  const handleUpdateQuantity = async (item, diff) => {
    const newQty = item.SoLuong + diff;
    if (newQty < 1) return;
    if (item.SoLuongTon !== undefined && newQty > item.SoLuongTon) {
      alert(`Rất tiếc, sản phẩm này chỉ còn ${item.SoLuongTon} sản phẩm trong kho.`);
      return;
    }

    try {
      await shopApi.updateCartItem(item.Id, { SoLuong: newQty });
      setCartItems(prev => prev.map(i => i.Id === item.Id ? { ...i, SoLuong: newQty } : i));
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) {
      console.error("Lỗi cập nhật số lượng:", err);
      alert("Không thể cập nhật số lượng.");
    }
  };

  // Delete item from cart
  const handleDeleteItem = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")) return;
    try {
      await shopApi.deleteCartItem(id);
      setCartItems(prev => prev.filter(i => i.Id !== id));
      setSelectedItems(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) {
      console.error("Lỗi xóa sản phẩm khỏi giỏ hàng:", err);
      alert("Không thể xóa sản phẩm khỏi giỏ hàng.");
    }
  };

  // Calculate prices
  const checkedItemsList = cartItems.filter(item => selectedItems[item.Id]);
  const subtotal = checkedItemsList.reduce((sum, item) => sum + item.GiaBan * item.SoLuong, 0);

  const handleCheckout = () => {
    if (checkedItemsList.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để đặt hàng.");
      return;
    }
    navigate('/dat-hang/cart', { state: { items: checkedItemsList } });
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-purple-100 rounded-3xl shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-3xl">lock</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk']">Yêu cầu đăng nhập</h2>
          <p className="text-sm text-slate-500">
            Bạn cần đăng nhập tài khoản để xem giỏ hàng và thực hiện thanh toán tại Zenith Store.
          </p>
        </div>
        <div className="pt-2 flex flex-col gap-3">
          <Link
            to="/login?redirect=/gio-hang"
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-900/10 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Đăng nhập ngay
          </Link>
          <Link
            to="/"
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-sm transition-all"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 text-purple-600">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold animate-pulse">Đang tải giỏ hàng...</p>
      </div>
    );
  }

  const allSelected = cartItems.length > 0 && cartItems.every(item => selectedItems[item.Id]);
  const someSelected = cartItems.length > 0 && cartItems.some(item => selectedItems[item.Id]);

  return (
    <div className="py-6 font-['Inter']">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-purple-600 font-bold mb-6 transition-colors">
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Quay lại mua sắm
      </Link>

      <h1 className="text-3xl font-extrabold text-slate-900 font-['Space_Grotesk'] mb-8 tracking-tight">Giỏ Hàng Của Bạn</h1>

      {cartItems.length === 0 ? (
        <div className="max-w-md mx-auto py-16 text-center space-y-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200 p-8">
          <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-3xl">shopping_cart</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk']">Giỏ hàng trống</h2>
            <p className="text-sm text-slate-500">
              Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá và thêm các sản phẩm công nghệ tuyệt vời ngay bây giờ!
            </p>
          </div>
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm shadow-md transition-all"
          >
            Khám phá mua sắm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM TRONG GIỎ HÀNG */}
          <div className="lg:col-span-7 space-y-4">
            {/* Header select all */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={allSelected}
                  ref={el => {
                    if (el) {
                      el.indeterminate = someSelected && !allSelected;
                    }
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
                />
                <span className="text-sm font-bold text-slate-700">Chọn tất cả ({cartItems.length} sản phẩm)</span>
              </label>
            </div>

            {/* List items */}
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.Id} className="bg-white border border-slate-100 rounded-3xl p-4 md:p-6 shadow-sm flex flex-col sm:flex-row gap-4 items-center relative hover:border-purple-200 transition-all">
                  {/* Checkbox */}
                  <div className="self-start sm:self-center">
                    <input 
                      type="checkbox"
                      checked={!!selectedItems[item.Id]}
                      onChange={() => handleSelectItem(item.Id)}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded cursor-pointer"
                    />
                  </div>

                  {/* Image */}
                  <div className="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-100 p-2 overflow-hidden flex items-center justify-center shrink-0">
                    <img 
                      src={getImageUrl(item.HinhAnh)} 
                      alt={item.TenSanPham} 
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Product details */}
                  <div className="flex-1 min-w-0 space-y-1.5 w-full">
                    <h3 className="font-extrabold text-sm text-slate-800 line-clamp-2 leading-snug">
                      {item.TenSanPham}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-extrabold text-purple-700 font-['Space_Grotesk']">{formatPrice(item.GiaBan)}</span>
                    </div>
                    {item.SoLuongTon !== undefined && (
                      <p className="text-[10px] font-bold text-emerald-600">Còn {item.SoLuongTon} sản phẩm</p>
                    )}
                  </div>

                  {/* Quantity selector & Delete */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 w-full sm:w-auto">
                    {/* Delete button */}
                    <button 
                      onClick={() => handleDeleteItem(item.Id)}
                      className="text-rose-500 hover:text-rose-700 flex items-center gap-1 transition-colors p-1.5 hover:bg-rose-50 rounded-xl"
                      title="Xóa khỏi giỏ hàng"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>

                    {/* Quantity controls */}
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
                      <button 
                        type="button"
                        onClick={() => handleUpdateQuantity(item, -1)}
                        className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors font-bold text-sm"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-bold text-sm text-slate-800">{item.SoLuong}</span>
                      <button 
                        type="button"
                        onClick={() => handleUpdateQuantity(item, 1)}
                        className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors font-bold text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG & NÚT ĐẶT HÀNG */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-slate-900 font-['Space_Grotesk'] pb-3 border-b border-slate-100 flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-600">shopping_bag</span>
                Tóm Tắt Đơn Hàng
              </h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Sản phẩm đã chọn</span>
                  <span className="font-semibold text-slate-800">{checkedItemsList.length} / {cartItems.length} sản phẩm</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Phí giao hàng</span>
                  <span className="text-emerald-600 font-bold">Miễn phí</span>
                </div>
                
                <div className="border-t border-dashed border-slate-200 pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Tổng tiền thanh toán</p>
                    <p className="text-[10px] text-slate-400">Đã bao gồm VAT nếu có</p>
                  </div>
                  <span className="text-xl font-extrabold text-purple-600 font-['Space_Grotesk']">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleCheckout}
                  disabled={checkedItemsList.length === 0}
                  className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-base shadow-lg shadow-purple-900/10 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">shopping_cart_checkout</span>
                  Tiến Hành Đặt Hàng ({checkedItemsList.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
