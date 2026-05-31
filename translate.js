
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



// ── Language Popover Functions ───────────────────────────────────────────────
window.toggleLangPopover = function(event) {
  event.stopPropagation();
  const popover = document.getElementById('langPopoverMenu');
  const wrapper = document.querySelector('.lang-dropdown-popover');
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
      const onclickAttr = item.getAttribute('onclick') || '';
      const langCodeMatch = onclickAttr.match(/'([^']+)'/);
      const langCode = langCodeMatch ? cleanStr(langCodeMatch[1]) : '';
      
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
  const wrapper = document.querySelector('.lang-dropdown-popover');
  
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
    iframe.goog-te-banner-frame { display: none !important; }
    body { top: 0px !important; }
    .goog-logo-link { display: none !important; }
    .goog-te-gadget { color: transparent !important; font-size: 0px !important; }
    .goog-te-gadget .goog-te-combo { display: none !important; }
    .goog-te-balloon-frame { display: none !important; }
    .goog-tooltip { display: none !important; }
    .goog-tooltip:hover { display: none !important; }
    .goog-text-highlight { background-color: transparent !important; border: none !important; box-shadow: none !important; }
    
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
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.async = true;
  document.head.appendChild(script);
}
