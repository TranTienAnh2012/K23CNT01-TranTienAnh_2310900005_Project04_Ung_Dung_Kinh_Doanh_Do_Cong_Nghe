// ── Google Translate Languages ────────────────────────────────────────────────
const NQT_LANGUAGES = {
  'vi': { flag: '🇻🇳', name: 'Tiếng Việt' },
  'en': { flag: '🇺🇸', name: 'English' },
  'zh-CN': { flag: '🇨🇳', name: '简体中文' },
  'zh-TW': { flag: '🇹🇼', name: '繁體中文' },
  'ja': { flag: '🇯🇵', name: '日本語' },
  'ko': { flag: '🇰🇷', name: '한국어' },
  'ru': { flag: '🇷🇺', name: 'Русский' },
  'es': { flag: '🇪🇸', name: 'Español' },
  'fr': { flag: '🇫🇷', name: 'Français' },
  'de': { flag: '🇩🇪', name: 'Deutsch' },
  'hi': { flag: '🇮🇳', name: 'हिन्दी' },
  'it': { flag: '🇮🇹', name: 'Italiano' },
  'pt': { flag: '🇵🇹', name: 'Português' },
  'tr': { flag: '🇹🇷', name: 'Türkçe' },
  'ar': { flag: '🇸🇦', name: 'العربية' },
  'th': { flag: '🇹🇭', name: 'ภาษาไทย' },
  'id': { flag: '🇮🇩', name: 'Bahasa Indonesia' },
  'nl': { flag: '🇳🇱', name: 'Nederlands' },
  'pl': { flag: '🇵🇱', name: 'Polski' },
  'ms': { flag: '🇲🇾', name: 'Bahasa Melayu' },
  'tl': { flag: '🇵🇭', name: 'Filipino' },
  'km': { flag: '🇰🇭', name: 'ភាសាខ្មែរ' },
  'lo': { flag: '🇱🇦', name: 'ພາສາລາວ' },
  'my': { flag: '🇲🇲', name: 'မြန်မာဘာသာ' },
  'bn': { flag: '🇧🇩', name: 'বাংলা' },
  'fa': { flag: '🇮🇷', name: 'فارسی' },
  'uk': { flag: '🇺🇦', name: 'Українська' },
  'sv': { flag: '🇸🇪', name: 'Svenska' },
  'no': { flag: '🇳🇴', name: 'Norsk' },
  'da': { flag: '🇩🇰', name: 'Dansk' },
  'fi': { flag: '🇫🇮', name: 'Suomi' },
  'el': { flag: '🇬🇷', name: 'Ελληνικά' },
  'he': { flag: '🇮🇱', name: 'עברית' },
  'cs': { flag: '🇨🇿', name: 'Čeština' },
  'ro': { flag: '🇷🇴', name: 'Română' }
};

window.NQT_LANGUAGES = NQT_LANGUAGES;

// ── Language Popover Functions ───────────────────────────────────────────────
window.toggleLangPopover = function(event) {
  event.stopPropagation();
  const popover = document.getElementById('langPopoverMenu');
  const wrapper = event.currentTarget.closest('.lang-dropdown-popover');
  if (!popover || !wrapper) return;
  
  popover.classList.toggle('hidden');
  popover.classList.toggle('flex');
  wrapper.classList.toggle('active');

  if (popover.classList.contains('flex')) {
    const searchInput = document.getElementById('langSearchInput');
    if (searchInput) {
      searchInput.value = '';
      window.filterLanguages();
      setTimeout(() => searchInput.focus(), 50);
    }
  }
};

window.filterLanguages = function() {
  const input = document.getElementById('langSearchInput');
  if (!input) return;
  
  const cleanStr = (str) => {
    if (!str) return '';
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "d")
      .toLowerCase()
      .trim();
  };
  
  const filter = cleanStr(input.value);
  const items = document.querySelectorAll('.lang-popover-item');
  
  items.forEach(item => {
    const nameSpan = item.querySelector('.lang-name');
    if (nameSpan) {
      const text = cleanStr(nameSpan.textContent);
      const onclickAttr = item.getAttribute('data-lang') || '';
      const langCode = cleanStr(onclickAttr);
      
      if (text.includes(filter) || langCode.includes(filter)) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    }
  });
};

window.changeLanguage = function(langCode) {
  function eraseCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    const host = window.location.hostname;
    const parts = host.split('.');
    for (let i = 0; i < parts.length; i++) {
      const domain = parts.slice(i).join('.');
      if (domain) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + domain + ';';
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + domain + ';';
      }
    }
  }

  eraseCookie('googtrans');

  const cookieValue = langCode === 'vi' ? "/vi/vi" : "/vi/" + langCode;
  const host = window.location.hostname;
  const parts = host.split('.');
  
  document.cookie = "googtrans=" + cookieValue + "; path=/;";
  for (let i = 0; i < parts.length; i++) {
    const domain = parts.slice(i).join('.');
    if (domain) {
      document.cookie = "googtrans=" + cookieValue + "; path=/; domain=" + domain + ";";
      document.cookie = "googtrans=" + cookieValue + "; path=/; domain=." + domain + ";";
    }
  }
  
  localStorage.setItem('website_lang', langCode);
  location.reload();
};

// Close popover when clicking anywhere outside
window.addEventListener('click', function(event) {
  const popover = document.getElementById('langPopoverMenu');
  const wrapper = document.querySelector('.lang-dropdown-popover.active');
  
  if (popover && !popover.classList.contains('hidden')) {
    const isClickInside = wrapper?.contains(event.target);
    if (!isClickInside) {
      popover.classList.add('hidden');
      popover.classList.remove('flex');
      wrapper?.classList.remove('active');
    }
  }
});

// Dynamic script injection for Google Translate
if (typeof window !== 'undefined' && !window.googleTranslateElementInit) {
  window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({pageLanguage: 'vi'}, 'google_translate_element');
  };

  const gDiv = document.createElement('div');
  gDiv.id = 'google_translate_element';
  gDiv.style.display = 'none';
  document.body.appendChild(gDiv);

  const style = document.createElement('style');
  style.innerHTML = `
    .goog-te-banner-frame,
    .goog-te-banner-frame.skiptranslate,
    iframe.goog-te-banner-frame,
    iframe.goog-te-banner-frame.skiptranslate,
    #goog-gt-tt,
    .goog-te-balloon-frame,
    .goog-te-gadget,
    .goog-te-banner,
    .skiptranslate:not(.lang-dropdown-popover):not(.lang-dropdown-popover *) {
      display: none !important;
      visibility: hidden !important;
      height: 0px !important;
      width: 0px !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }
    body, html {
      top: 0px !important;
      margin-top: 0px !important;
      position: static !important;
    }
    font {
      font-family: 'Inter', sans-serif !important;
      font-size: inherit !important;
      color: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
      letter-spacing: inherit !important;
      vertical-align: inherit !important;
    }
    h1 font, h2 font, h3 font, h4 font, h5 font, h6 font, 
    [class*="logo"] font, 
    [class*="Space_Grotesk"] font, 
    [class*="headline"] font,
    .font-headline-xl font,
    .font-headline-lg font,
    .font-headline-md font {
      font-family: 'Space Grotesk', sans-serif !important;
    }
    /* Đảm bảo thẻ font bên trong icon không bị đè font-family */
    .material-symbols-outlined font,
    .material-icons font {
      font-family: 'Material Symbols Outlined', 'Material Icons' !important;
    }
    .goog-logo-link { display: none !important; }
    .goog-te-gadget .goog-te-combo { display: none !important; }
    .goog-tooltip { display: none !important; }
    .goog-tooltip:hover { display: none !important; }
    
    .goog-text-highlight,
    .goog-text-highlight *,
    [class*="goog-text-highlight"],
    [class*="goog-te-highlight"] {
      background-color: transparent !important;
      background: transparent !important;
      box-shadow: none !important;
      border: none !important;
    }
    
    .lang-dropdown-popover button {
      cursor: pointer;
      background: transparent;
      transition: all 0.2s ease;
    }
    .lang-dropdown-popover.active button {
      border-color: rgba(200, 241, 53, 0.5) !important;
      background-color: rgba(200, 241, 53, 0.05) !important;
      color: #C8F135 !important;
    }
    #langPopoverMenu {
      backdrop-filter: blur(16px);
      background: rgba(18, 18, 26, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
      min-width: 240px;
      border-radius: 12px;
    }
    .lang-popover-item {
      transition: background-color 0.15s ease, color 0.15s ease;
    }
  `;
  document.head.appendChild(style);

  const script = document.createElement('script');
  script.src = 'https://translate.googleapis.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.async = true;
  script.onerror = (e) => {
    console.warn("Google Translate script failed to load:", e);
  };
  document.head.appendChild(script);

  // Vòng lặp dọn dẹp chủ động thanh công cụ Google Translate và căn chỉnh lại body/html
  const cleanUpGoogleTranslate = () => {
    // 1. Quét ẩn tất cả iframe chứa Google Translate
    const iframes = document.getElementsByTagName('iframe');
    for (let i = 0; i < iframes.length; i++) {
      const iframe = iframes[i];
      const classList = iframe.className || '';
      const id = iframe.id || '';
      const src = iframe.src || '';
      if (
        classList.includes('goog') || 
        classList.includes('skiptranslate') || 
        id.includes('goog') || 
        id.includes('translate') ||
        src.includes('translate')
      ) {
        iframe.style.setProperty('display', 'none', 'important');
        iframe.style.setProperty('visibility', 'hidden', 'important');
        iframe.style.setProperty('height', '0px', 'important');
        iframe.style.setProperty('width', '0px', 'important');
        iframe.style.setProperty('opacity', '0', 'important');
      }
    }
    
    // 2. Bảo vệ các icon thiết kế (Material Symbols) không bị Google dịch hoặc chèn font lỗi
    const icons = document.querySelectorAll('.material-symbols-outlined, .material-icons');
    icons.forEach(icon => {
      if (!icon.classList.contains('notranslate')) {
        icon.classList.add('notranslate');
      }
      if (icon.getAttribute('translate') !== 'no') {
        icon.setAttribute('translate', 'no');
      }
      // Khử bỏ thẻ font nếu Google Translate lỡ bọc text của icon
      const fontTag = icon.querySelector('font');
      if (fontTag) {
        icon.textContent = fontTag.textContent;
      }
    });
    
    // 3. Quét ẩn các phần tử widget khác của Google Translate
    const elements = document.querySelectorAll('.goog-te-banner-frame, .goog-te-banner, #goog-gt-tt, .goog-te-balloon-frame, .goog-te-gadget, .skiptranslate');
    elements.forEach(el => {
      if (el.classList.contains('lang-dropdown-popover') || el.closest('.lang-dropdown-popover')) {
        return;
      }
      el.style.setProperty('display', 'none', 'important');
      el.style.setProperty('visibility', 'hidden', 'important');
      el.style.setProperty('height', '0px', 'important');
      el.style.setProperty('width', '0px', 'important');
      el.style.setProperty('opacity', '0', 'important');
    });

    // 3. Khóa cứng khoảng cách body và html
    if (document.body) {
      if (document.body.style.top !== '0px' && document.body.style.top !== '') {
        document.body.style.setProperty('top', '0px', 'important');
      }
      if (document.body.style.marginTop !== '0px' && document.body.style.marginTop !== '') {
        document.body.style.setProperty('margin-top', '0px', 'important');
      }
    }
    const htmlEl = document.documentElement;
    if (htmlEl) {
      if (htmlEl.style.top !== '0px' && htmlEl.style.top !== '') {
        htmlEl.style.setProperty('top', '0px', 'important');
      }
      if (htmlEl.style.marginTop !== '0px' && htmlEl.style.marginTop !== '') {
        htmlEl.style.setProperty('margin-top', '0px', 'important');
      }
    }
  };
  
  setInterval(cleanUpGoogleTranslate, 100);
}
