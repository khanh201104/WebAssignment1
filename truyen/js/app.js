/**
 * Tủ Truyện Chữ — logic trang chủ
 * - Đổi giao diện (giấy cũ / sáng / đêm), ghi nhớ lựa chọn
 * - Tìm kiếm + lọc thể loại, đồng bộ trạng thái lên URL
 * - Nhắc tiếp tục đọc dựa trên tiến độ lưu trong localStorage
 */

(() => {
  'use strict';

  const STORAGE_THEME = 'kalvin_theme';
  const STORAGE_LAST_CHAPTER = 'kalvin_last_read_chapter';
  const STORAGE_PROGRESS = 'kalvin_progress';

  const THEME_COLORS = {
    sepia: '#f4efe3',
    light: '#fbfaf7',
    dark: '#141317',
  };

  const root = document.documentElement;
  const body = document.body;
  const metaThemeColor = document.getElementById('meta-theme-color');

  /* ----------------------------------------------------------------------
     Giao diện
     ---------------------------------------------------------------------- */

  const themeButtons = Array.from(document.querySelectorAll('.theme-btn'));

  function applyTheme(theme) {
    const next = THEME_COLORS[theme] ? theme : 'sepia';

    body.classList.remove('theme-sepia', 'theme-dark', 'theme-light');
    body.classList.add(`theme-${next}`);

    // Giúp scrollbar và control gốc của trình duyệt đổi màu theo
    root.style.colorScheme = next === 'dark' ? 'dark' : 'light';

    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', THEME_COLORS[next]);
    }

    themeButtons.forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.theme === next));
    });

    try {
      localStorage.setItem(STORAGE_THEME, next);
    } catch (error) {
      /* chế độ riêng tư: bỏ qua */
    }
  }

  themeButtons.forEach((btn) => {
    btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
  });

  let savedTheme = 'sepia';
  try {
    savedTheme = localStorage.getItem(STORAGE_THEME) || 'sepia';
  } catch (error) {
    /* bỏ qua */
  }
  applyTheme(savedTheme);

  /* ----------------------------------------------------------------------
     Tiếp tục đọc
     ---------------------------------------------------------------------- */

  function percentRead(chapterId) {
    try {
      const progress = JSON.parse(localStorage.getItem(STORAGE_PROGRESS) || '{}');
      const entry = progress[chapterId];
      const value = entry && typeof entry.pos === 'number' ? entry.pos : 0;
      return Math.min(100, Math.max(0, Math.round(value * 100)));
    } catch (error) {
      return 0;
    }
  }

  function showContinueCard() {
    const card = document.getElementById('continue-card');
    let lastChapter = null;

    try {
      lastChapter = localStorage.getItem(STORAGE_LAST_CHAPTER);
    } catch (error) {
      return;
    }

    if (!card || !lastChapter) return;

    const percent = percentRead(lastChapter);
    document.getElementById('continue-chapter').textContent = lastChapter;

    const progressBar = document.getElementById('continue-progress');
    progressBar.setAttribute('aria-valuenow', String(percent));
    progressBar.setAttribute('aria-valuetext', `Đã đọc ${percent}% chương ${lastChapter}`);
    document.getElementById('continue-progress-fill').style.width = `${percent}%`;

    card.hidden = false;

    // Đổi nhãn nút chính của thẻ truyện thành "Đọc tiếp"
    const label = document.getElementById('kalvin-btn-label');
    if (label) {
      label.textContent = `Đọc tiếp chương ${lastChapter}`;
    }
    const primary = document.getElementById('kalvin-btn-continue');
    if (primary) {
      primary.setAttribute('title', `Tiếp tục chương ${lastChapter} (${percent}%)`);
    }
  }

  showContinueCard();

  /* ----------------------------------------------------------------------
     Tìm kiếm & lọc
     ---------------------------------------------------------------------- */

  const searchInput = document.getElementById('search-input');
  const searchClear = document.getElementById('search-clear');
  const tagButtons = Array.from(document.querySelectorAll('.chip'));
  const cards = Array.from(document.querySelectorAll('.novel-card, .card[data-title]'));
  const countEl = document.getElementById('novel-count');
  const emptyState = document.getElementById('empty-state');
  const resetButton = document.getElementById('reset-filters');

  const params = new URLSearchParams(window.location.search);
  let state = {
    query: (params.get('q') || '').trim(),
    tag: params.get('the') || 'all',
  };

  if (!tagButtons.some((btn) => btn.dataset.tag === state.tag)) {
    state.tag = 'all';
  }

  function normalize(value) {
    return value.toLowerCase().normalize('NFC');
  }

  function matches(card, query, tag) {
    const title = normalize(card.dataset.title || '');
    const author = normalize(card.dataset.author || '');
    const tags = normalize(card.dataset.tags || '');

    const byTag = tag === 'all' || tags.includes(normalize(tag));
    const byQuery = !query || title.includes(query) || author.includes(query) || tags.includes(query);

    return byTag && byQuery;
  }

  function syncUrl() {
    const next = new URLSearchParams();
    if (state.query) next.set('q', state.query);
    if (state.tag !== 'all') next.set('the', state.tag);

    const search = next.toString();
    const url = search ? `${window.location.pathname}?${search}` : window.location.pathname;
    window.history.replaceState(null, '', url);
  }

  function render() {
    const query = normalize(state.query);
    let visible = 0;

    cards.forEach((card) => {
      const show = matches(card, query, state.tag);
      card.hidden = !show;
      if (show) visible += 1;
    });

    // Ô "bộ truyện tiếp theo" chỉ có ý nghĩa khi tủ còn hiện kết quả
    const placeholder = document.querySelector('.card-placeholder');
    if (placeholder) placeholder.hidden = visible === 0;

    tagButtons.forEach((btn) => {
      const active = btn.dataset.tag === state.tag;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    if (searchClear) searchClear.hidden = state.query.length === 0;
    if (emptyState) emptyState.hidden = visible !== 0;

    if (countEl) {
      countEl.textContent = visible === 0
        ? 'Không có bộ truyện nào'
        : `${visible} bộ truyện`;
    }

    syncUrl();
  }

  if (searchInput) {
    searchInput.value = state.query;

    searchInput.addEventListener('input', (event) => {
      state.query = event.target.value.trim();
      render();
    });

    // Escape: xoá nhanh từ khoá
    searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && searchInput.value) {
        event.preventDefault();
        searchInput.value = '';
        state.query = '';
        render();
      }
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      if (!searchInput) return;
      searchInput.value = '';
      state.query = '';
      searchInput.focus();
      render();
    });
  }

  tagButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      state.tag = btn.dataset.tag || 'all';
      render();
    });
  });

  if (resetButton) {
    resetButton.addEventListener('click', () => {
      state = { query: '', tag: 'all' };
      if (searchInput) searchInput.value = '';
      render();
      if (searchInput) searchInput.focus();
    });
  }

  // Phím "/" đưa con trỏ vào ô tìm kiếm (bỏ qua khi đang gõ ở nơi khác)
  document.addEventListener('keydown', (event) => {
    if (event.key !== '/' || !searchInput) return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    const active = document.activeElement;
    const typing = active && (
      active.tagName === 'INPUT' ||
      active.tagName === 'TEXTAREA' ||
      active.isContentEditable
    );

    if (typing) return;

    event.preventDefault();
    searchInput.focus();
  });

  render();
})();
