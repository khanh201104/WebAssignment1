/**
 * Kho Truyện Chữ - Homepage Application Logic
 * Hỗ trợ tìm kiếm, lọc thể loại, đổi theme (Sepia, Dark, Light) và ghi nhớ chương đang đọc dở
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const body = document.body;
  const themeButtons = document.querySelectorAll('.theme-btn');
  const searchInput = document.getElementById('search-input');
  const tagButtons = document.querySelectorAll('.tag-btn');
  const novelCards = document.querySelectorAll('.novel-card');
  const novelCountEl = document.getElementById('novel-count');
  const kalvinContinueBtn = document.getElementById('kalvin-btn-continue');

  // ==========================================================================
  // 1. Theme Manager
  // ==========================================================================
  const THEME_COLORS = { sepia: '#ede7d9', dark: '#131316', light: '#fafaf8' };
  const metaThemeColor = document.getElementById('meta-theme-color');

  function applyTheme(theme) {
    body.classList.remove('theme-sepia', 'theme-dark', 'theme-light');
    body.classList.add(`theme-${theme}`);
    localStorage.setItem('kalvin_theme', theme);
    if (metaThemeColor && THEME_COLORS[theme]) {
      metaThemeColor.setAttribute('content', THEME_COLORS[theme]);
    }

    themeButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });
  }

  // Load saved theme or default to Sepia
  const savedTheme = localStorage.getItem('kalvin_theme') || 'sepia';
  applyTheme(savedTheme);

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.theme);
    });
  });

  // ==========================================================================
  // 2. Reading Continuity Check
  // ==========================================================================
  if (kalvinContinueBtn) {
    const lastReadChapter = localStorage.getItem('kalvin_last_read_chapter');
    if (lastReadChapter) {
      let progressBadge = '';
      try {
        const progMap = JSON.parse(localStorage.getItem('kalvin_progress')) || {};
        const chProg = progMap[lastReadChapter];
        if (chProg && chProg.pos > 0.03) {
          progressBadge = ` (${Math.round(chProg.pos * 100)}%)`;
        }
      } catch (e) { /* ignore */ }

      kalvinContinueBtn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        Đọc tiếp: C.${lastReadChapter}${progressBadge}
      `;
      kalvinContinueBtn.setAttribute('title', `Tiếp tục đọc từ Chương ${lastReadChapter}${progressBadge}`);
    }
  }

  // ==========================================================================
  // 3. Search and Category Filter
  // ==========================================================================
  let currentTag = 'all';
  let searchQuery = '';

  function filterNovels() {
    let visibleCount = 0;

    novelCards.forEach(card => {
      const title = (card.dataset.title || '').toLowerCase();
      const author = (card.dataset.author || '').toLowerCase();
      const tags = (card.dataset.tags || '').toLowerCase();

      const matchesTag = currentTag === 'all' || tags.includes(currentTag.toLowerCase());
      const matchesSearch = !searchQuery || 
        title.includes(searchQuery) || 
        author.includes(searchQuery) || 
        tags.includes(searchQuery);

      if (matchesTag && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (novelCountEl) {
      novelCountEl.textContent = `${visibleCount} bộ truyện`;
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      filterNovels();
    });
  }

  tagButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tagButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTag = btn.dataset.tag || 'all';
      filterNovels();
    });
  });
});
