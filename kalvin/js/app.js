/**
 * Biên Niên Sử Tro Tàn: Kalvin Palace - Mobile-First Reader Application
 */

(function () {
  'use strict';

  // Application State
  const state = {
    novel: null,
    chapters: [],
    currentChapterId: 1,
    theme: 'sepia',
    font: 'font-serif',
    fontSize: 19,
    lineHeight: 1.8
  };

  // DOM Elements Cache
  const el = {
    body: document.body,
    progressBar: document.getElementById('progress-bar'),
    headerTitle: document.getElementById('header-novel-title'),
    headerBadge: document.getElementById('header-chapter-badge'),
    btnToggleMenu: document.getElementById('btn-toggle-menu'),
    btnToggleSettings: document.getElementById('btn-toggle-settings'),
    settingsPanel: document.getElementById('settings-panel'),
    drawerMenu: document.getElementById('drawer-menu'),
    drawerOverlay: document.getElementById('drawer-overlay'),
    btnCloseDrawer: document.getElementById('btn-close-drawer'),
    drawerList: document.getElementById('drawer-chapter-list'),
    drawerCount: document.getElementById('drawer-chapter-count'),
    searchChapterInput: document.getElementById('search-chapter-input'),
    chapterArc: document.getElementById('chapter-arc'),
    chapterTitle: document.getElementById('chapter-title'),
    chapterWordCount: document.getElementById('chapter-word-count'),
    chapterReadTime: document.getElementById('chapter-read-time'),
    chapterHasIllusBadge: document.getElementById('chapter-has-illus-badge'),
    chapterTopIllus: document.getElementById('chapter-top-illustrations'),
    chapterContent: document.getElementById('chapter-content'),
    chapterBottomIllus: document.getElementById('chapter-bottom-illustrations'),
    bottomIllusGrid: document.getElementById('bottom-illustrations-grid'),
    btnPrevChapter: document.getElementById('btn-prev-chapter'),
    btnNextChapter: document.getElementById('btn-next-chapter'),
    selectChapterJump: document.getElementById('select-chapter-jump'),
    btnScrollTop: document.getElementById('btn-scroll-top'),
    lightbox: document.getElementById('image-lightbox'),
    lightboxImg: document.getElementById('lightbox-img'),
    lightboxCaption: document.getElementById('lightbox-caption'),
    btnCloseLightbox: document.getElementById('btn-close-lightbox'),
    fontSizeSlider: document.getElementById('font-size-slider'),
    fontSizeVal: document.getElementById('font-size-val'),
    btnFontDecrease: document.getElementById('btn-font-decrease'),
    btnFontIncrease: document.getElementById('btn-font-increase'),
    lineHeightSlider: document.getElementById('line-height-slider'),
    lineHeightVal: document.getElementById('line-height-val'),
    themeButtons: document.querySelectorAll('.btn-theme'),
    fontButtons: document.querySelectorAll('.btn-font')
  };

  // ==========================================================================
  // 1. Initialization & Data Loading
  // ==========================================================================

  function initApp() {
    loadPreferences();
    loadNovelData();
    setupEventListeners();
  }

  function loadNovelData() {
    // Check localStorage first (in case user added chapters locally)
    const localChapters = localStorage.getItem('kalvin_custom_chapters');
    let loadedData = null;

    if (localChapters) {
      try {
        const parsed = JSON.parse(localChapters);
        if (Array.isArray(parsed) && parsed.length > 0) {
          state.chapters = parsed;
        }
      } catch (e) {
        console.error('Error parsing local chapters:', e);
      }
    }

    // Fallback to window.KALVIN_DATA (zero CORS requirement)
    if (!state.chapters.length && window.KALVIN_DATA) {
      state.novel = window.KALVIN_DATA.novel;
      state.chapters = window.KALVIN_DATA.chapters;
    }

    // Fallback to fetch data/chapters.json if available
    if (!state.chapters.length) {
      fetch('data/chapters.json')
        .then(res => res.json())
        .then(data => {
          state.novel = data.novel;
          state.chapters = data.chapters;
          onDataReady();
        })
        .catch(err => {
          console.warn('Fetch data/chapters.json failed, checking window data:', err);
          if (window.KALVIN_DATA) {
            state.novel = window.KALVIN_DATA.novel;
            state.chapters = window.KALVIN_DATA.chapters;
            onDataReady();
          } else {
            el.chapterContent.innerHTML = '<p style="text-align:center;color:red;">Không thể tải dữ liệu truyện. Vui lòng kiểm tra lại tệp data/chapters.json.</p>';
          }
        });
      return;
    }

    onDataReady();
  }

  function onDataReady() {
    if (state.novel) {
      el.headerTitle.textContent = state.novel.title;
      document.title = `${state.novel.title} - Trình Đọc Truyện`;
    }
    el.drawerCount.textContent = `${state.chapters.length} chương`;

    populateChapterSelect();
    renderDrawerList();

    // Restore last read chapter
    const savedChapterId = parseInt(localStorage.getItem('kalvin_last_read_chapter'), 10);
    const targetId = (savedChapterId && state.chapters.some(c => c.id === savedChapterId))
      ? savedChapterId
      : (state.chapters[0] ? state.chapters[0].id : 1);

    renderChapter(targetId, false);
  }

  // ==========================================================================
  // 2. Render Chapter Logic
  // ==========================================================================

  function renderChapter(chapterId, smoothScroll = true) {
    const chapter = state.chapters.find(c => c.id === chapterId);
    if (!chapter) return;

    state.currentChapterId = chapterId;
    localStorage.setItem('kalvin_last_read_chapter', chapterId);

    // Update Header
    el.headerBadge.textContent = `Chương ${chapter.number}`;
    document.title = `${chapter.full_title} - ${state.novel ? state.novel.title : 'Biên Niên Sử Tro Tàn'}`;

    // Update Meta
    el.chapterArc.textContent = chapter.arc || 'Chính Văn';
    el.chapterTitle.textContent = chapter.full_title || `Chương ${chapter.number}: ${chapter.title}`;
    
    const wordCount = chapter.word_count || (chapter.content ? chapter.content.split(/\s+/).length : 0);
    el.chapterWordCount.textContent = `~${wordCount.toLocaleString('vi-VN')} từ`;
    const readMinutes = Math.max(1, Math.round(wordCount / 280));
    el.chapterReadTime.textContent = `~${readMinutes} phút đọc`;

    // Process Illustrations
    const illustrations = chapter.illustrations || [];
    const hasIllus = illustrations.length > 0;
    el.chapterHasIllusBadge.classList.toggle('hidden', !hasIllus);

    renderIllustrations(illustrations, chapter);

    // Render Content
    renderContentBody(chapter.content, illustrations);

    // Update Navigation Controls
    updateNavButtons();
    el.selectChapterJump.value = chapter.id;

    // Highlight in drawer
    document.querySelectorAll('.drawer-item').forEach(item => {
      item.classList.toggle('active', parseInt(item.dataset.id, 10) === chapterId);
    });

    // Reset Progress & Scroll
    updateProgressBar();
    if (smoothScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  }

  function renderContentBody(rawContent, illustrations) {
    if (!rawContent) {
      el.chapterContent.innerHTML = '<p class="loading-spinner">Chưa có nội dung cho chương này.</p>';
      return;
    }

    const lines = rawContent.split(/\r?\n/);
    const htmlParts = [];
    const inlineIllus = illustrations.filter(i => i.position === 'inline');
    let inlineCounter = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Check for scene breaks
      if (line === '***' || line === '---' || line === '• • •') {
        htmlParts.push('<p class="scene-break">❖ ❖ ❖</p>');
        continue;
      }

      // Check for inline illustration tag: [ảnh: 1] or [image: 1]
      const imgMatch = line.match(/^\[(ảnh|anh|image|img)\s*:\s*(\d+)\]$/i);
      if (imgMatch) {
        const imgIndex = parseInt(imgMatch[2], 10) - 1;
        if (illustrations[imgIndex]) {
          htmlParts.push(createIllustrationCard(illustrations[imgIndex]));
          continue;
        }
      }

      // Check if this paragraph triggers an inline illustration based on target text
      let matchedIllus = null;
      if (inlineIllus.length > 0) {
        matchedIllus = inlineIllus.find(item => item.target_text && line.includes(item.target_text));
      }

      // Render standard paragraph
      htmlParts.push(`<p>${escapeHtml(line)}</p>`);

      // If matched inline illustration, render right after this paragraph
      if (matchedIllus) {
        htmlParts.push(createIllustrationCard(matchedIllus));
        // Remove from inline list to avoid duplicates
        const idx = inlineIllus.indexOf(matchedIllus);
        if (idx !== -1) inlineIllus.splice(idx, 1);
      }
    }

    el.chapterContent.innerHTML = htmlParts.join('\n');

    // Attach click events for inline images
    el.chapterContent.querySelectorAll('.illustration-img-wrap').forEach(wrap => {
      wrap.addEventListener('click', () => {
        const img = wrap.querySelector('img');
        const caption = wrap.dataset.caption || '';
        openLightbox(img.src, caption);
      });
    });
  }

  function renderIllustrations(illustrations, chapter) {
    // Top illustrations (Banner style)
    const topIllus = illustrations.filter(i => i.position === 'top');
    if (topIllus.length > 0) {
      el.chapterTopIllus.classList.remove('hidden');
      el.chapterTopIllus.innerHTML = topIllus.map(createIllustrationCard).join('');
      el.chapterTopIllus.querySelectorAll('.illustration-img-wrap').forEach(wrap => {
        wrap.addEventListener('click', () => {
          const img = wrap.querySelector('img');
          openLightbox(img.src, wrap.dataset.caption || '');
        });
      });
    } else {
      el.chapterTopIllus.classList.add('hidden');
      el.chapterTopIllus.innerHTML = '';
    }

    // Bottom illustrations (Gallery / Manga pages / Panels)
    const bottomIllus = illustrations.filter(i => i.position === 'bottom' || (!i.position && i !== topIllus[0]));
    if (bottomIllus.length > 0) {
      el.chapterBottomIllus.classList.remove('hidden');
      el.bottomIllusGrid.innerHTML = bottomIllus.map(createIllustrationCard).join('');
      el.bottomIllusGrid.querySelectorAll('.illustration-img-wrap').forEach(wrap => {
        wrap.addEventListener('click', () => {
          const img = wrap.querySelector('img');
          openLightbox(img.src, wrap.dataset.caption || '');
        });
      });
    } else {
      el.chapterBottomIllus.classList.add('hidden');
      el.bottomIllusGrid.innerHTML = '';
    }
  }

  function createIllustrationCard(illus) {
    const captionHtml = illus.caption ? `<div class="illustration-caption">${escapeHtml(illus.caption)}</div>` : '';
    return `
      <figure class="illustration-card">
        <div class="illustration-img-wrap" data-caption="${escapeHtml(illus.caption || '')}">
          <img src="${illus.url}" alt="${escapeHtml(illus.caption || 'Minh họa')}" loading="lazy" />
          <div class="illustration-zoom-hint">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
            Chạm để phóng to
          </div>
        </div>
        ${captionHtml}
      </figure>
    `;
  }

  // ==========================================================================
  // 3. Drawer & Navigation Elements
  // ==========================================================================

  function renderDrawerList(filter = '') {
    const term = filter.toLowerCase().trim();
    const filtered = state.chapters.filter(ch => {
      if (!term) return true;
      return ch.title.toLowerCase().includes(term) ||
             ch.full_title.toLowerCase().includes(term) ||
             `chương ${ch.number}`.includes(term);
    });

    if (filtered.length === 0) {
      el.drawerList.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--text-muted);">Không tìm thấy chương phù hợp.</div>';
      return;
    }

    // Group by Arc
    let currentArc = null;
    const htmlParts = [];

    filtered.forEach(ch => {
      const arc = ch.arc || 'Chính Văn';
      if (arc !== currentArc) {
        currentArc = arc;
        htmlParts.push(`<div class="drawer-arc-title">${escapeHtml(arc)}</div>`);
      }

      const isActive = ch.id === state.currentChapterId;
      const hasIllus = ch.illustrations && ch.illustrations.length > 0;
      const wordCountK = Math.round(ch.word_count / 100) / 10;

      htmlParts.push(`
        <div class="drawer-item ${isActive ? 'active' : ''}" data-id="${ch.id}">
          <div class="drawer-item-title">
            <span>${escapeHtml(ch.full_title)}</span>
            ${hasIllus ? '<span title="Có ảnh minh họa">🖼️</span>' : ''}
          </div>
          <span class="drawer-item-badge">${wordCountK}k từ</span>
        </div>
      `);
    });

    el.drawerList.innerHTML = htmlParts.join('');

    // Attach click events
    el.drawerList.querySelectorAll('.drawer-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = parseInt(item.dataset.id, 10);
        renderChapter(id);
        closeDrawer();
      });
    });
  }

  function populateChapterSelect() {
    el.selectChapterJump.innerHTML = state.chapters.map(ch => {
      return `<option value="${ch.id}">${escapeHtml(ch.full_title)}</option>`;
    }).join('');
  }

  function updateNavButtons() {
    const currentIndex = state.chapters.findIndex(c => c.id === state.currentChapterId);
    const prevChap = state.chapters[currentIndex - 1];
    const nextChap = state.chapters[currentIndex + 1];

    el.btnPrevChapter.disabled = !prevChap;
    el.btnNextChapter.disabled = !nextChap;

    if (prevChap) {
      el.btnPrevChapter.setAttribute('title', `Chương trước: ${prevChap.full_title}`);
    }
    if (nextChap) {
      el.btnNextChapter.setAttribute('title', `Chương sau: ${nextChap.full_title}`);
    }
  }

  function goToPrevChapter() {
    const currentIndex = state.chapters.findIndex(c => c.id === state.currentChapterId);
    if (currentIndex > 0) {
      renderChapter(state.chapters[currentIndex - 1].id);
    }
  }

  function goToNextChapter() {
    const currentIndex = state.chapters.findIndex(c => c.id === state.currentChapterId);
    if (currentIndex < state.chapters.length - 1) {
      renderChapter(state.chapters[currentIndex + 1].id);
    }
  }

  // ==========================================================================
  // 4. Reading Progress Bar
  // ==========================================================================

  function updateProgressBar() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
    el.progressBar.style.width = `${progress}%`;
  }

  // ==========================================================================
  // 5. Lightbox Modal
  // ==========================================================================

  function openLightbox(src, caption) {
    el.lightboxImg.src = src;
    el.lightboxCaption.textContent = caption || '';
    el.lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    el.lightbox.classList.add('hidden');
    document.body.style.overflow = '';
  }

  // ==========================================================================
  // 6. Settings & Preferences
  // ==========================================================================

  function loadPreferences() {
    const savedTheme = localStorage.getItem('kalvin_theme') || 'sepia';
    const savedFont = localStorage.getItem('kalvin_font') || 'font-serif';
    const savedSize = parseInt(localStorage.getItem('kalvin_font_size'), 10) || 19;
    const savedLineHeight = parseFloat(localStorage.getItem('kalvin_line_height')) || 1.8;

    applyTheme(savedTheme);
    applyFont(savedFont);
    applyFontSize(savedSize);
    applyLineHeight(savedLineHeight);
  }

  function applyTheme(theme) {
    state.theme = theme;
    el.body.classList.remove('theme-sepia', 'theme-dark', 'theme-light');
    el.body.classList.add(`theme-${theme}`);
    localStorage.setItem('kalvin_theme', theme);

    el.themeButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });
  }

  function applyFont(font) {
    state.font = font;
    el.body.classList.remove('font-serif', 'font-sans');
    el.body.classList.add(font);
    localStorage.setItem('kalvin_font', font);

    el.fontButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.font === font);
    });
  }

  function applyFontSize(size) {
    state.fontSize = size;
    document.documentElement.style.setProperty('--reader-font-size', `${size}px`);
    el.fontSizeVal.textContent = `${size}px`;
    el.fontSizeSlider.value = size;
    localStorage.setItem('kalvin_font_size', size);
  }

  function applyLineHeight(lh) {
    state.lineHeight = lh;
    document.documentElement.style.setProperty('--reader-line-height', lh);
    el.lineHeightVal.textContent = lh;
    el.lineHeightSlider.value = lh;
    localStorage.setItem('kalvin_line_height', lh);
  }

  // ==========================================================================
  // 7. Drawer & UI Toggles
  // ==========================================================================

  function openDrawer() {
    el.drawerMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
    el.searchChapterInput.focus();
  }

  function closeDrawer() {
    el.drawerMenu.classList.remove('active');
    document.body.style.overflow = '';
  }

  function toggleSettings() {
    el.settingsPanel.classList.toggle('hidden');
  }

  // ==========================================================================
  // 8. Event Listeners Setup
  // ==========================================================================

  function setupEventListeners() {
    // Menu & Drawer
    el.btnToggleMenu.addEventListener('click', openDrawer);
    el.btnCloseDrawer.addEventListener('click', closeDrawer);
    el.drawerOverlay.addEventListener('click', closeDrawer);

    el.searchChapterInput.addEventListener('input', (e) => {
      renderDrawerList(e.target.value);
    });

    // Settings Panel
    el.btnToggleSettings.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSettings();
    });

    document.addEventListener('click', (e) => {
      if (!el.settingsPanel.contains(e.target) && e.target !== el.btnToggleSettings) {
        el.settingsPanel.classList.add('hidden');
      }
    });

    // Theme Switch
    el.themeButtons.forEach(btn => {
      btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
    });

    // Font Switch
    el.fontButtons.forEach(btn => {
      btn.addEventListener('click', () => applyFont(btn.dataset.font));
    });

    // Font Size
    el.fontSizeSlider.addEventListener('input', (e) => applyFontSize(parseInt(e.target.value, 10)));
    el.btnFontDecrease.addEventListener('click', () => applyFontSize(Math.max(14, state.fontSize - 1)));
    el.btnFontIncrease.addEventListener('click', () => applyFontSize(Math.min(28, state.fontSize + 1)));

    // Line Height
    el.lineHeightSlider.addEventListener('input', (e) => applyLineHeight(parseFloat(e.target.value)));

    // Chapter Navigation
    el.btnPrevChapter.addEventListener('click', goToPrevChapter);
    el.btnNextChapter.addEventListener('click', goToNextChapter);
    el.selectChapterJump.addEventListener('change', (e) => {
      renderChapter(parseInt(e.target.value, 10));
    });

    // Scroll to Top & Progress
    el.btnScrollTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('scroll', updateProgressBar, { passive: true });

    // Lightbox
    el.btnCloseLightbox.addEventListener('click', closeLightbox);
    el.lightbox.addEventListener('click', (e) => {
      if (e.target === el.lightbox) closeLightbox();
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDrawer();
        closeLightbox();
        el.settingsPanel.classList.add('hidden');
      } else if (e.key === 'ArrowLeft' && !document.querySelector('input:focus, textarea:focus')) {
        goToPrevChapter();
      } else if (e.key === 'ArrowRight' && !document.querySelector('input:focus, textarea:focus')) {
        goToNextChapter();
      }
    });
  }

  // Helper
  function escapeHtml(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Expose global API for publish.js
  window.KalvinApp = {
    getState: () => state,
    renderChapter,
    renderDrawerList,
    populateChapterSelect,
    escapeHtml
  };

  // Start app
  document.addEventListener('DOMContentLoaded', initApp);
})();
