import React, { useState, useEffect } from 'react';

// Helper matching functions for robust address string parsing
const findMatchingProvince = (list, name) => {
  if (!name) return null;
  const clean = name.toLowerCase().replace(/^(tỉnh|thành phố)\s+/i, '').trim();
  return list.find(p => p.name.toLowerCase().includes(clean));
};

const findMatchingDistrict = (list, name) => {
  if (!name) return null;
  const clean = name.toLowerCase().replace(/^(quận|huyện|thị xã|thành phố)\s+/i, '').trim();
  return list.find(d => d.name.toLowerCase().includes(clean));
};

const findMatchingWard = (list, name) => {
  if (!name) return null;
  const clean = name.toLowerCase().replace(/^(phường|xã|thị trấn)\s+/i, '').trim();
  return list.find(w => w.name.toLowerCase().includes(clean));
};

export default function AddressSelector({ value, onChange, placeholder, required }) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [specific, setSpecific] = useState('');

  const [loading, setLoading] = useState(false);
  const [manualMode, setManualMode] = useState(false);

  // Load provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoading(true);
      try {
        const res = await fetch('https://provinces.open-api.vn/api/p/');
        if (!res.ok) throw new Error("Failed to fetch provinces");
        const data = await res.json();
        setProvinces(data);
      } catch (err) {
        console.error("Provinces API error, switching to manual mode:", err);
        setManualMode(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProvinces();
  }, []);

  // Parse incoming value on value prop change
  useEffect(() => {
    const currentCompiled = province && district && ward && specific 
      ? `${specific}, ${ward}, ${district}, ${province}` 
      : specific;

    if (value && value !== currentCompiled) {
      const loadAndParse = async () => {
        setLoading(true);
        try {
          const parts = value.split(',').map(p => p.trim());
          if (parts.length >= 4) {
            const provName = parts[parts.length - 1];
            const distName = parts[parts.length - 2];
            const wardName = parts[parts.length - 3];
            const spec = parts.slice(0, parts.length - 3).join(', ');

            // Ensure provinces are loaded
            let currentProvinces = provinces;
            if (currentProvinces.length === 0) {
              const res = await fetch('https://provinces.open-api.vn/api/p/');
              currentProvinces = await res.json();
              setProvinces(currentProvinces);
            }

            const matchedProv = findMatchingProvince(currentProvinces, provName);
            if (matchedProv) {
              setProvince(matchedProv.name);
              
              // Load districts
              const resDist = await fetch(`https://provinces.open-api.vn/api/p/${matchedProv.code}?depth=2`);
              const provObj = await resDist.json();
              const distList = provObj.districts || [];
              setDistricts(distList);

              const matchedDist = findMatchingDistrict(distList, distName);
              if (matchedDist) {
                setDistrict(matchedDist.name);

                // Load wards
                const resWard = await fetch(`https://provinces.open-api.vn/api/d/${matchedDist.code}?depth=2`);
                const distObj = await resWard.json();
                const wardList = distObj.wards || [];
                setWards(wardList);

                const matchedWard = findMatchingWard(wardList, wardName);
                if (matchedWard) {
                  setWard(matchedWard.name);
                } else {
                  setWard('');
                }
              } else {
                setDistrict('');
                setWard('');
              }
            } else {
              setProvince('');
              setDistrict('');
              setWard('');
            }
            setSpecific(spec);
          } else {
            setProvince('');
            setDistrict('');
            setWard('');
            setSpecific(value);
          }
        } catch (e) {
          console.error("Parsing address failed:", e);
          setSpecific(value);
        } finally {
          setLoading(false);
        }
      };
      loadAndParse();
    } else if (!value) {
      setProvince('');
      setDistrict('');
      setWard('');
      setSpecific('');
    }
  }, [value]);

  // Whenever components change, bubble compiled address up
  useEffect(() => {
    if (manualMode) {
      onChange(specific);
    } else {
      if (province && district && ward && specific) {
        onChange(`${specific}, ${ward}, ${district}, ${province}`);
      } else if (specific && !province && !district && !ward) {
        onChange(specific);
      } else {
        onChange('');
      }
    }
  }, [province, district, ward, specific, manualMode]);

  // Handle Province Select change
  const handleProvinceChange = async (e) => {
    const provName = e.target.value;
    setProvince(provName);
    setDistrict('');
    setWard('');
    setDistricts([]);
    setWards([]);

    if (!provName) return;

    const matchedProv = provinces.find(p => p.name === provName);
    if (matchedProv) {
      setLoading(true);
      try {
        const res = await fetch(`https://provinces.open-api.vn/api/p/${matchedProv.code}?depth=2`);
        const data = await res.json();
        setDistricts(data.districts || []);
      } catch (err) {
        console.error("Error loading districts:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle District Select change
  const handleDistrictChange = async (e) => {
    const distName = e.target.value;
    setDistrict(distName);
    setWard('');
    setWards([]);

    if (!distName) return;

    const matchedDist = districts.find(d => d.name === distName);
    if (matchedDist) {
      setLoading(true);
      try {
        const res = await fetch(`https://provinces.open-api.vn/api/d/${matchedDist.code}?depth=2`);
        const data = await res.json();
        setWards(data.wards || []);
      } catch (err) {
        console.error("Error loading wards:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (manualMode) {
    return (
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">
            Địa chỉ giao hàng (Nhập thủ công)
          </label>
          {provinces.length > 0 && (
            <button
              type="button"
              onClick={() => setManualMode(false)}
              className="text-[9px] font-bold text-purple-600 hover:underline"
            >
              Dùng chọn địa điểm tự động
            </button>
          )}
        </div>
        <input
          type="text"
          value={specific}
          onChange={(e) => setSpecific(e.target.value)}
          required={required}
          placeholder={placeholder || "Nhập số nhà, tên đường, quận huyện, tỉnh thành..."}
          className="w-full h-10 px-3 border border-purple-100 rounded-xl outline-none text-xs focus:border-purple-500 bg-purple-50/10 transition-colors"
        />
      </div>
    );
  }

  return (
    <div className="space-y-3 relative">
      {loading && (
        <div className="absolute right-0 -top-6 flex items-center gap-1.5 text-purple-600">
          <div className="w-3.5 h-3.5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[10px] font-bold">Đang tải địa điểm...</span>
        </div>
      )}

      {/* 3 Dropdowns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Tỉnh / Thành phố */}
        <div>
          <label className="block text-[10px] font-extrabold text-slate-400 tracking-wider uppercase mb-1">
            Tỉnh / Thành phố
          </label>
          <select
            value={province}
            onChange={handleProvinceChange}
            required={required}
            className="w-full h-10 px-3 border border-purple-100 rounded-xl outline-none text-xs focus:border-purple-500 bg-purple-50/10 font-medium text-slate-700 transition-colors"
          >
            <option value="">-- Chọn Tỉnh / Thành phố</option>
            {provinces.map(prov => (
              <option key={prov.code} value={prov.name}>{prov.name}</option>
            ))}
          </select>
        </div>

        {/* Quận / Huyện */}
        <div>
          <label className="block text-[10px] font-extrabold text-slate-400 tracking-wider uppercase mb-1">
            Quận / Huyện
          </label>
          <select
            value={district}
            onChange={handleDistrictChange}
            required={required}
            disabled={!province || districts.length === 0}
            className="w-full h-10 px-3 border border-purple-100 rounded-xl outline-none text-xs focus:border-purple-500 bg-purple-50/10 font-medium text-slate-700 disabled:opacity-50 transition-colors"
          >
            <option value="">-- Chọn Quận / Huyện</option>
            {districts.map(dist => (
              <option key={dist.code} value={dist.name}>{dist.name}</option>
            ))}
          </select>
        </div>

        {/* Phường / Xã */}
        <div>
          <label className="block text-[10px] font-extrabold text-slate-400 tracking-wider uppercase mb-1">
            Phường / Xã
          </label>
          <select
            value={ward}
            onChange={(e) => setWard(e.target.value)}
            required={required}
            disabled={!district || wards.length === 0}
            className="w-full h-10 px-3 border border-purple-100 rounded-xl outline-none text-xs focus:border-purple-500 bg-purple-50/10 font-medium text-slate-700 disabled:opacity-50 transition-colors"
          >
            <option value="">-- Chọn Phường / Xã</option>
            {wards.map(wrd => (
              <option key={wrd.code} value={wrd.name}>{wrd.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Địa chỉ cụ thể */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">
            Địa chỉ cụ thể (Số nhà, tên đường...)
          </label>
          <button
            type="button"
            onClick={() => setManualMode(true)}
            className="text-[9px] font-bold text-purple-600 hover:underline"
          >
            Tự viết tay địa chỉ
          </button>
        </div>
        <input
          type="text"
          value={specific}
          onChange={(e) => setSpecific(e.target.value)}
          required={required}
          placeholder={placeholder || "Số nhà, ngõ, tên đường..."}
          className="w-full h-10 px-3 border border-purple-100 rounded-xl outline-none text-xs focus:border-purple-500 bg-purple-50/10 transition-colors"
        />
      </div>
    </div>
  );
}
