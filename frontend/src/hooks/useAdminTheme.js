import { useState, useEffect } from 'react';

/**
 * Hook để đồng bộ trạng thái Dark Mode từ document element và localStorage
 */
export function useAdminTheme() {
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const syncTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    // Lắng nghe sự kiện tùy chỉnh khi theme thay đổi trong AdminLayout
    window.addEventListener('tta_settings_updated', syncTheme);
    
    // Observer để theo dõi thay đổi class 'dark' trực tiếp trên thẻ html
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      window.removeEventListener('tta_settings_updated', syncTheme);
      observer.disconnect();
    };
  }, []);

  return isDark;
}
