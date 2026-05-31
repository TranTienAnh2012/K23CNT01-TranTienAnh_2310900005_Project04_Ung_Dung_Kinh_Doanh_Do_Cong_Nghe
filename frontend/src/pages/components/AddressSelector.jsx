import React, { useState, useEffect } from 'react';

const STATIC_PROVINCES = [
  {
    code: 1,
    name: "Thành phố Hà Nội",
    districts: [
      {
        code: 1,
        name: "Quận Ba Đình",
        wards: [{ code: 1, name: "Phường Phúc Xá" }, { code: 2, name: "Phường Trúc Bạch" }, { code: 3, name: "Phường Vĩnh Phúc" }]
      },
      {
        code: 2,
        name: "Quận Hoàn Kiếm",
        wards: [{ code: 4, name: "Phường Đồng Xuân" }, { code: 5, name: "Phường Hàng Đào" }, { code: 6, name: "Phường Tràng Tiền" }]
      },
      {
        code: 4,
        name: "Quận Cầu Giấy",
        wards: [{ code: 7, name: "Phường Dịch Vọng" }, { code: 8, name: "Phường Quan Hoa" }, { code: 9, name: "Phường Mai Dịch" }, { code: 10, name: "Phường Nghĩa Tân" }]
      },
      {
        code: 5,
        name: "Quận Đống Đa",
        wards: [{ code: 11, name: "Phường Láng Hạ" }, { code: 12, name: "Phường Cát Linh" }, { code: 13, name: "Phường Ô Chợ Dừa" }]
      },
      {
        code: 6,
        name: "Quận Thanh Xuân",
        wards: [{ code: 14, name: "Phường Khương Mai" }, { code: 15, name: "Phường Thanh Xuân Bắc" }, { code: 16, name: "Phường Nhân Chính" }]
      }
    ]
  },
  {
    code: 79,
    name: "Thành phố Hồ Chí Minh",
    districts: [
      {
        code: 760,
        name: "Quận 1",
        wards: [{ code: 26734, name: "Phường Bến Nghé" }, { code: 26740, name: "Phường Bến Thành" }, { code: 26743, name: "Phường Đa Kao" }]
      },
      {
        code: 764,
        name: "Quận Gò Vấp",
        wards: [{ code: 26866, name: "Phường 1" }, { code: 26869, name: "Phường 3" }, { code: 26872, name: "Phường 5" }]
      },
      {
        code: 769,
        name: "Thành phố Thủ Đức",
        wards: [{ code: 27076, name: "Phường Thảo Điền" }, { code: 27079, name: "Phường An Phú" }, { code: 27082, name: "Phường Bình Trưng Tây" }]
      }
    ]
  },
  {
    code: 48,
    name: "Thành phố Đà Nẵng",
    districts: [
      {
        code: 490,
        name: "Quận Liên Chiểu",
        wards: [{ code: 20197, name: "Phường Hòa Hiệp Bắc" }, { code: 20200, name: "Phường Hòa Hiệp Nam" }]
      },
      {
        code: 492,
        name: "Quận Hải Châu",
        wards: [{ code: 20227, name: "Phường Hải Châu I" }, { code: 20230, name: "Phường Hải Châu II" }]
      }
    ]
  }
];

export default function AddressSelector({ onChange, placeholder = "Số nhà, ngõ, tên đường...", required = true }) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [detailAddress, setDetailAddress] = useState('');

  const [loading, setLoading] = useState({
    provinces: false,
    districts: false,
    wards: false
  });

  const [isUsingFallback, setIsUsingFallback] = useState(false);

  // Load provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoading(prev => ({ ...prev, provinces: true }));
      try {
        const res = await fetch('https://provinces.open-api.vn/api/p/');
        if (!res.ok) throw new Error('API Error');
        const data = await res.json();
        setProvinces(data);
        setIsUsingFallback(false);
      } catch (err) {
        console.warn("Failed to fetch provinces, using fallback static data:", err);
        setProvinces(STATIC_PROVINCES);
        setIsUsingFallback(true);
      } finally {
        setLoading(prev => ({ ...prev, provinces: false }));
      }
    };
    fetchProvinces();
  }, []);

  // Handle province change
  const handleProvinceChange = async (e) => {
    const provinceCode = e.target.value;
    setSelectedProvince(provinceCode);
    setSelectedDistrict('');
    setSelectedWard('');
    setDistricts([]);
    setWards([]);

    if (!provinceCode) return;

    if (isUsingFallback) {
      const prov = STATIC_PROVINCES.find(p => p.code === parseInt(provinceCode));
      setDistricts(prov ? prov.districts : []);
      return;
    }

    setLoading(prev => ({ ...prev, districts: true }));
    try {
      const res = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      setDistricts(data.districts || []);
    } catch (err) {
      console.warn("Failed to fetch districts, falling back to static:", err);
      // Try to find in static
      const prov = STATIC_PROVINCES.find(p => p.code === parseInt(provinceCode));
      if (prov) {
        setDistricts(prov.districts);
      } else {
        setDistricts([]);
      }
    } finally {
      setLoading(prev => ({ ...prev, districts: false }));
    }
  };

  // Handle district change
  const handleDistrictChange = async (e) => {
    const districtCode = e.target.value;
    setSelectedDistrict(districtCode);
    setSelectedWard('');
    setWards([]);

    if (!districtCode) return;

    if (isUsingFallback) {
      const prov = STATIC_PROVINCES.find(p => p.code === parseInt(selectedProvince));
      const dist = prov ? prov.districts.find(d => d.code === parseInt(districtCode)) : null;
      setWards(dist ? dist.wards : []);
      return;
    }

    setLoading(prev => ({ ...prev, wards: true }));
    try {
      const res = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      setWards(data.wards || []);
    } catch (err) {
      console.warn("Failed to fetch wards, falling back to static:", err);
      const prov = STATIC_PROVINCES.find(p => p.code === parseInt(selectedProvince));
      const dist = prov ? prov.districts.find(d => d.code === parseInt(districtCode)) : null;
      if (dist) {
        setWards(dist.wards);
      } else {
        setWards([]);
      }
    } finally {
      setLoading(prev => ({ ...prev, wards: false }));
    }
  };

  // Build full address string and trigger callback
  useEffect(() => {
    const provName = provinces.find(p => String(p.code) === String(selectedProvince))?.name || '';
    const distName = districts.find(d => String(d.code) === String(selectedDistrict))?.name || '';
    const wardName = wards.find(w => String(w.code) === String(selectedWard))?.name || '';

    let parts = [];
    if (detailAddress.trim()) parts.push(detailAddress.trim());
    if (wardName) parts.push(wardName);
    if (distName) parts.push(distName);
    if (provName) parts.push(provName);

    const fullAddress = parts.join(', ');
    
    // Only call onChange if we have chosen at least Province, District, and Ward to avoid partial address pollution
    if (selectedProvince && selectedDistrict && selectedWard) {
      onChange(fullAddress);
    } else {
      onChange(''); // invalid/incomplete address
    }
  }, [selectedProvince, selectedDistrict, selectedWard, detailAddress, provinces, districts, wards]);

  return (
    <div className="space-y-3">
      {/* Dropdown selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Province / City */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Tỉnh / Thành phố</label>
          <select
            value={selectedProvince}
            onChange={handleProvinceChange}
            required={required}
            className="w-full h-10 px-3 border border-purple-100 rounded-xl outline-none text-xs focus:border-purple-500 bg-white"
          >
            <option value="">-- Chọn Tỉnh / Thành phố --</option>
            {provinces.map(p => (
              <option key={p.code} value={p.code}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* District */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Quận / Huyện</label>
          <select
            value={selectedDistrict}
            onChange={handleDistrictChange}
            disabled={!selectedProvince || loading.districts}
            required={required}
            className="w-full h-10 px-3 border border-purple-100 rounded-xl outline-none text-xs focus:border-purple-500 bg-white disabled:bg-slate-50 disabled:text-slate-400"
          >
            <option value="">
              {loading.districts ? 'Đang tải...' : '-- Chọn Quận / Huyện --'}
            </option>
            {districts.map(d => (
              <option key={d.code} value={d.code}>{d.name}</option>
            ))}
          </select>
        </div>

        {/* Ward / Commune */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Phường / Xã</label>
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            disabled={!selectedDistrict || loading.wards}
            required={required}
            className="w-full h-10 px-3 border border-purple-100 rounded-xl outline-none text-xs focus:border-purple-500 bg-white disabled:bg-slate-50 disabled:text-slate-400"
          >
            <option value="">
              {loading.wards ? 'Đang tải...' : '-- Chọn Phường / Xã --'}
            </option>
            {wards.map(w => (
              <option key={w.code} value={w.code}>{w.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Specific street address */}
      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Địa chỉ cụ thể (Số nhà, tên đường...)</label>
        <input
          type="text"
          value={detailAddress}
          onChange={(e) => setDetailAddress(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full h-10 px-3 border border-purple-100 rounded-xl outline-none text-xs focus:border-purple-500 bg-purple-50/10"
        />
      </div>
    </div>
  );
}
