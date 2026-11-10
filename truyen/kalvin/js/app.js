/**
 * Biên Niên Sử Tro Tàn: Kalvin Palace - Standard Novel Reader Application
 * Hỗ trợ giao diện chuẩn web truyện (Image 2), thanh công cụ dock nổi, bookmark, comment
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
    fontSize: 18,
    lineHeight: 1.8,
    readerWidth: 780
  };

  // DOM Elements
  const el = {
    body: document.body,
    appHeader: document.querySelector('.app-header'),
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
    mainNovelTitle: document.getElementById('main-novel-title'),
    mainChapterTitle: document.getElementById('main-chapter-title'),
    metaCommentsLink: document.getElementById('meta-comments-link'),
    chapterWordCount: document.getElementById('chapter-word-count'),
    chapterArcName: document.getElementById('chapter-arc-name'),
    chapterContent: document.getElementById('chapter-content'),
    btnPrevChapter: document.getElementById('btn-prev-chapter'),
    btnNextChapter: document.getElementById('btn-next-chapter'),
    selectChapterJump: document.getElementById('select-chapter-jump'),
    btnScrollTop: document.getElementById('btn-scroll-top'),
    // Floating Dock Buttons
    dockBtnPrev: document.getElementById('dock-btn-prev'),
    dockBtnHome: document.getElementById('dock-btn-home'),
    dockBtnSettings: document.getElementById('dock-btn-settings'),
    dockBtnInfo: document.getElementById('dock-btn-info'),
    dockBtnBookmark: document.getElementById('dock-btn-bookmark'),
    dockBtnNext: document.getElementById('dock-btn-next'),
    // Modals
    infoModal: document.getElementById('info-modal'),
    btnCloseInfoModal: document.getElementById('btn-close-info-modal'),
    bookmarksModal: document.getElementById('bookmarks-modal'),
    btnCloseBookmarksModal: document.getElementById('btn-close-bookmarks-modal'),
    bookmarksList: document.getElementById('bookmarks-list'),
    // Comments
    commentsSection: document.getElementById('comments-section'),
    commentsCount: document.getElementById('comments-count'),
    formComment: document.getElementById('form-comment'),
    commentAuthor: document.getElementById('comment-author'),
    commentText: document.getElementById('comment-text'),
    commentsList: document.getElementById('comments-list'),
    // Lightbox & Toast
    lightbox: document.getElementById('image-lightbox'),
    lightboxImg: document.getElementById('lightbox-img'),
    lightboxCaption: document.getElementById('lightbox-caption'),
    btnCloseLightbox: document.getElementById('btn-close-lightbox'),
    toast: document.getElementById('toast'),
    // Settings controls
    fontSizeSlider: document.getElementById('font-size-slider'),
    fontSizeVal: document.getElementById('font-size-val'),
    btnFontDecrease: document.getElementById('btn-font-decrease'),
    btnFontIncrease: document.getElementById('btn-font-increase'),
    lineHeightSlider: document.getElementById('line-height-slider'),
    lineHeightVal: document.getElementById('line-height-val'),
    themeButtons: document.querySelectorAll('.btn-theme'),
    fontButtons: document.querySelectorAll('.btn-font'),
    widthButtons: document.querySelectorAll('.btn-width'),
    // UX additions
    floatingDock: document.getElementById('floating-dock'),
    headerProgress: document.getElementById('header-progress'),
    metaThemeColor: document.getElementById('meta-theme-color'),
    chapterEndCard: document.getElementById('chapter-end-card'),
    chapterReadTime: document.getElementById('chapter-read-time'),
    btnDrawerBookmarks: document.getElementById('btn-drawer-bookmarks'),
    btnResetSettings: document.getElementById('btn-reset-settings')
  };

  // ==========================================================================
  // 0. UX Helpers: tiến độ đọc, thời gian đọc, lịch sử overlay
  // ==========================================================================

  const READING_WPM = 220; // Tốc độ đọc trung bình tiếng Việt (từ/phút)
  const DEFAULT_PREFS = { theme: 'sepia', font: 'font-serif', fontSize: 18, lineHeight: 1.8, readerWidth: 780 };
  const THEME_COLORS = { sepia: '#ede7d9', dark: '#131316', light: '#fafaf8' };
  const isTouchDevice = window.matchMedia('(hover: none)').matches;
  let appReady = false;

  function getWordCount(chapter) {
    return chapter.word_count || (chapter.content ? chapter.content.split(/\s+/).length : 0);
  }

  function getReadMinutes(words) {
    return Math.max(1, Math.round(words / READING_WPM));
  }

  function getScrollRatio() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return 0;
    return Math.min(1, Math.max(0, (window.scrollY || document.documentElement.scrollTop) / docHeight));
  }

  function scrollToRatio(ratio) {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, Math.max(0, Math.round(docHeight * ratio)));
  }

  // Lưu vị trí đọc theo từng chương: { [chapterId]: { pos: 0..1, max: 0..1 } }
  function getProgressMap() {
    try {
      return JSON.parse(localStorage.getItem('kalvin_progress')) || {};
    } catch (e) {
      return {};
    }
  }

  function saveChapterProgress() {
    if (!appReady) return;
    const ratio = getScrollRatio();
    const map = getProgressMap();
    const prev = map[state.currentChapterId] || { pos: 0, max: 0 };
    map[state.currentChapterId] = {
      pos: Math.round(ratio * 1000) / 1000,
      max: Math.round(Math.max(prev.max || 0, ratio) * 1000) / 1000
    };
    try {
      localStorage.setItem('kalvin_progress', JSON.stringify(map));
    } catch (e) { /* quota exceeded - bỏ qua */ }
  }

  let saveProgressTimer = null;
  function scheduleSaveProgress() {
    clearTimeout(saveProgressTimer);
    saveProgressTimer = setTimeout(saveChapterProgress, 400);
  }

  // Giữ nguyên vị trí đọc khi thay đổi cỡ chữ / giãn dòng / độ rộng
  function keepReadingPosition(fn) {
    if (!appReady) {
      fn();
      return;
    }
    const ratio = getScrollRatio();
    fn();
    requestAnimationFrame(() => scrollToRatio(ratio));
  }

  // Nút Back (Android/trình duyệt) sẽ đóng overlay thay vì rời trang
  let overlayHistoryActive = false;

  function anyOverlayOpen() {
    return el.drawerMenu.classList.contains('active') ||
      !el.infoModal.classList.contains('hidden') ||
      !el.bookmarksModal.classList.contains('hidden') ||
      !el.lightbox.classList.contains('hidden') ||
      !el.settingsPanel.classList.contains('hidden');
  }

  function pushOverlayState() {
    if (overlayHistoryActive) return;
    overlayHistoryActive = true;
    try {
      history.pushState({ kalvinOverlay: true }, '');
    } catch (e) { /* ignore */ }
  }

  function releaseOverlayState() {
    if (!overlayHistoryActive || anyOverlayOpen()) return;
    overlayHistoryActive = false;
    if (history.state && history.state.kalvinOverlay) {
      history.back();
    }
  }

  function syncBodyScrollLock() {
    const locked = el.drawerMenu.classList.contains('active') ||
      !el.infoModal.classList.contains('hidden') ||
      !el.bookmarksModal.classList.contains('hidden') ||
      !el.lightbox.classList.contains('hidden');
    document.body.style.overflow = locked ? 'hidden' : '';
  }

  // ==========================================================================
  // 1. Initialization
  // ==========================================================================

  function initApp() {
    loadPreferences();
    loadNovelData();
    setupEventListeners();
  }

  function cleanMetaAnnotations(str) {
    if (!str || typeof str !== 'string') return str;
    return str
      .replace(/\s*\(Giai đoạn[^)]*\)/gi, '')
      .replace(/\s*-\s*Năm nhất\b/gi, '')
      .replace(/\s*-\s*Cuối năm nhất\b/gi, '')
      .replace(/\s*\(Kỳ khảo hạch thực địa cuối Năm nhất\)/gi, '')
      .replace(/\s*\(Kết thúc kỳ khảo hạch Năm nhất\)/gi, '');
  }

  function sanitizeChapter(ch) {
    if (!ch) return ch;
    if (ch.content) {
      ch.content = cleanMetaAnnotations(ch.content);
    }
    if (Array.isArray(ch.elements)) {
      ch.elements.forEach(el => {
        if (el && el.text) {
          el.text = cleanMetaAnnotations(el.text);
        }
      });
    }
    return ch;
  }

  function loadNovelData() {
    // 1. Always prioritize official bundled data from window.KALVIN_DATA
    if (window.KALVIN_DATA && Array.isArray(window.KALVIN_DATA.chapters) && window.KALVIN_DATA.chapters.length > 0) {
      state.novel = window.KALVIN_DATA.novel;
      state.chapters = window.KALVIN_DATA.chapters.map(ch => sanitizeChapter(ch));
    }

    // 2. Merge custom chapters from localStorage (only chapters beyond the official list)
    const localChapters = localStorage.getItem('kalvin_custom_chapters');
    if (localChapters) {
      try {
        const parsed = JSON.parse(localChapters);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (!state.chapters.length) {
            state.chapters = parsed.map(ch => sanitizeChapter(ch));
          } else {
            const maxOfficialNum = Math.max(...state.chapters.map(c => c.number || c.id || 0));
            const extraChapters = parsed
              .filter(c => (c.number || c.id || 0) > maxOfficialNum)
              .map(ch => sanitizeChapter(ch));
            if (extraChapters.length > 0) {
              state.chapters.push(...extraChapters);
            } else {
              // Stale cache of official chapters in localStorage, remove to prevent stale data
              localStorage.removeItem('kalvin_custom_chapters');
            }
          }
        }
      } catch (e) {
        console.error('Error parsing local chapters:', e);
      }
    }

    // 3. Fallback to fetch data/chapters.json
    if (!state.chapters.length) {
      fetch('data/chapters.json?v=' + Date.now())
        .then(res => res.json())
        .then(data => {
          state.novel = data.novel;
          state.chapters = (data.chapters || []).map(ch => sanitizeChapter(ch));
          onDataReady();
        })
        .catch(err => {
          console.warn('Fetch data/chapters.json failed:', err);
          if (window.KALVIN_DATA) {
            state.novel = window.KALVIN_DATA.novel;
            state.chapters = (window.KALVIN_DATA.chapters || []).map(ch => sanitizeChapter(ch));
          }
          onDataReady();
        });
      return;
    }

    onDataReady();
  }

  function onDataReady() {
    if (state.novel) {
      el.headerTitle.textContent = state.novel.title;
      el.mainNovelTitle.textContent = state.novel.title;
      document.title = `${state.novel.title} - Web Đọc Truyện`;
    }
    el.drawerCount.textContent = `${state.chapters.length} chương`;

    populateChapterSelect();
    renderDrawerList();

    const savedChapterId = parseInt(localStorage.getItem('kalvin_last_read_chapter'), 10);
    const targetId = (savedChapterId && state.chapters.some(c => c.id === savedChapterId))
      ? savedChapterId
      : (state.chapters[0] ? state.chapters[0].id : 1);

    renderChapter(targetId, false, true);
    appReady = true;

    // Nếu người dùng bấm nút "Mục lục" từ trang chủ Tủ Truyện (#chapter-list), tự động mở ngăn kéo Mục Lục
    if (window.location.hash === '#chapter-list') {
      history.replaceState(null, '', window.location.pathname + window.location.search);
      openDrawer();
    }
  }

  // ==========================================================================
  // 2. Chapter Rendering Logic (Chuẩn format hình mẫu 2)
  // ==========================================================================

  function renderChapter(chapterId, smoothScroll = true, restoreSavedScroll = false) {
    const chapter = state.chapters.find(c => c.id === chapterId);
    if (!chapter) return;

    // Lưu lại tiến độ của chương trước trước khi chuyển chương
    if (appReady && state.currentChapterId && state.currentChapterId !== chapterId) {
      saveChapterProgress();
    }

    state.currentChapterId = chapterId;
    localStorage.setItem('kalvin_last_read_chapter', chapterId);

    // Header updates (matching Image 2 layout)
    el.headerBadge.textContent = `Chương ${chapter.number}`;
    el.mainNovelTitle.textContent = state.novel ? state.novel.title : 'Biên Niên Sử Tro Tàn';
    el.mainChapterTitle.textContent = `CHƯƠNG ${chapter.number}: ${chapter.title.toUpperCase()}`;
    document.title = `Chương ${chapter.number}: ${chapter.title} - ${state.novel ? state.novel.title : 'Biên Niên Sử Tro Tàn'}`;

    const wordCount = getWordCount(chapter);
    const readMinutes = getReadMinutes(wordCount);
    el.chapterWordCount.textContent = `${wordCount.toLocaleString('vi-VN')} từ`;
    if (el.chapterReadTime) {
      el.chapterReadTime.textContent = `~${readMinutes} phút đọc`;
    }
    el.chapterArcName.textContent = chapter.arc || 'Chính Văn';

    // Render Clean Paragraphs
    renderFormattedContent(chapter);

    // Render End-of-Chapter Next CTA Card
    renderEndOfChapterCard(chapter);

    // Comments for this chapter
    renderComments(chapter.id);

    // Update Nav buttons & Bookmark active state
    updateNavButtons();
    updateBookmarkButtonState();
    el.selectChapterJump.value = chapter.id;

    // Update drawer list badges & active item
    renderDrawerList(el.searchChapterInput ? el.searchChapterInput.value : '');

    // Reset or Restore Progress & Scroll
    if (el.appHeader) el.appHeader.classList.remove('header-hidden');
    if (el.floatingDock) el.floatingDock.classList.remove('dock-hidden');
    lastScrollY = 0;

    const progressMap = getProgressMap();
    const savedProg = progressMap[chapterId];
    if (restoreSavedScroll && savedProg && savedProg.pos > 0.03 && savedProg.pos < 0.96) {
      requestAnimationFrame(() => {
        scrollToRatio(savedProg.pos);
        lastScrollY = Math.max(0, window.scrollY || document.documentElement.scrollTop);
        updateProgressBar();
        showToast(`📖 Đã khôi phục vị trí đọc (${Math.round(savedProg.pos * 100)}%)`);
      });
    } else {
      if (smoothScroll) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo(0, 0);
      }
      updateProgressBar();
    }
  }

  function renderEndOfChapterCard(chapter) {
    if (!el.chapterEndCard) return;
    const currentIndex = state.chapters.findIndex(c => c.id === chapter.id);
    const nextChap = state.chapters[currentIndex + 1];

    if (nextChap) {
      const nextWords = getWordCount(nextChap);
      const nextMins = getReadMinutes(nextWords);
      el.chapterEndCard.innerHTML = `
        <div class="end-card-inner">
          <span class="end-card-eyebrow">Hết Chương ${chapter.number} • Tiếp theo</span>
          <h3 class="end-card-title">${escapeHtml(nextChap.full_title || ('Chương ' + nextChap.number + ': ' + nextChap.title))}</h3>
          <p class="end-card-meta">${escapeHtml(nextChap.arc || 'Chính Văn')} • ${nextWords.toLocaleString('vi-VN')} từ (~${nextMins} phút đọc)</p>
          <button type="button" class="btn-end-card-next" id="btn-end-card-next">
            <span>Đọc tiếp Chương ${nextChap.number}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      `;
      const btnNextCard = document.getElementById('btn-end-card-next');
      if (btnNextCard) {
        btnNextCard.addEventListener('click', goToNextChapter);
      }
    } else {
      el.chapterEndCard.innerHTML = `
        <div class="end-card-inner end-card-complete">
          <span class="end-card-eyebrow">🎉 Bạn đã đọc tới chương mới nhất</span>
          <h3 class="end-card-title">Hết Chương ${chapter.number}: ${escapeHtml(chapter.title)}</h3>
          <p class="end-card-meta">Hãy để lại bình luận bên dưới hoặc lưu dấu trang để theo dõi chương tiếp theo!</p>
        </div>
      `;
    }
  }

  function renderFormattedContent(chapter) {
    // If structured elements exist (clean paragraph objects from docx parser)
    if (chapter.elements && Array.isArray(chapter.elements) && chapter.elements.length > 0) {
      const htmlParts = [];
      chapter.elements.forEach(item => {
        if (item.type === 'paragraph') {
          const text = cleanMetaAnnotations(item.text ? item.text.trim() : '');
          if (text) {
            htmlParts.push(`<p>${escapeHtml(text)}</p>`);
          }
        } else if (item.type === 'break') {
          htmlParts.push('<p class="scene-break">❖ ❖ ❖</p>');
        } else if (item.type === 'image') {
          htmlParts.push(createIllustrationCard(item));
        }
      });
      el.chapterContent.innerHTML = htmlParts.join('\n');
    } else {
      // Fallback: parse raw content by double-newlines (\n\s*\n)
      const raw = cleanMetaAnnotations(chapter.content || '');
      const blocks = raw.split(/\r?\n\s*\r?\n/);
      const htmlParts = [];

      blocks.forEach(block => {
        const trimmed = block.trim();
        if (!trimmed) return;

        if (trimmed === '***' || trimmed === '---' || trimmed === '• • •' || trimmed === '❖ ❖ ❖') {
          htmlParts.push('<p class="scene-break">❖ ❖ ❖</p>');
          return;
        }

        // Check if block contains markdown image: ![caption](url)
        const imgMatch = trimmed.match(/!\[(.*?)\]\((.*?)\)/);
        if (imgMatch) {
          htmlParts.push(createIllustrationCard({ url: imgMatch[2], caption: imgMatch[1] }));
          return;
        }

        // Join internal lines inside this paragraph into one unified unbroken paragraph
        const lines = trimmed.split(/\r?\n/);
        const mergedParagraph = lines.map(l => l.trim()).filter(Boolean).join(' ');
        htmlParts.push(`<p>${escapeHtml(cleanMetaAnnotations(mergedParagraph))}</p>`);
      });

      // Append bottom illustrations if any
      if (chapter.illustrations && chapter.illustrations.length > 0) {
        chapter.illustrations.forEach(illus => {
          htmlParts.push(createIllustrationCard(illus));
        });
      }

      el.chapterContent.innerHTML = htmlParts.join('\n');
    }

    // Attach click events for illustration cards
    el.chapterContent.querySelectorAll('.illustration-img-wrap').forEach(wrap => {
      wrap.addEventListener('click', () => {
        const img = wrap.querySelector('img');
        const caption = wrap.dataset.caption || '';
        openLightbox(img.src, caption);
      });
    });
  }

  function createIllustrationCard(illus) {
    const captionHtml = illus.caption ? `<div class="illustration-caption">${escapeHtml(illus.caption)}</div>` : '';
    return `
      <figure class="illustration-card">
        <div class="illustration-img-wrap" data-caption="${escapeHtml(illus.caption || '')}">
          <img src="${illus.url}" alt="${escapeHtml(illus.caption || 'Minh họa')}" loading="lazy" />
        </div>
        ${captionHtml}
      </figure>
    `;
  }

  // ==========================================================================
  // 3. Navigation Controls (Bottom Bar & Right-Hand Dock)
  // ==========================================================================

  function updateNavButtons() {
    const currentIndex = state.chapters.findIndex(c => c.id === state.currentChapterId);
    const prevChap = state.chapters[currentIndex - 1];
    const nextChap = state.chapters[currentIndex + 1];

    const hasPrev = Boolean(prevChap);
    const hasNext = Boolean(nextChap);

    // Bottom controls
    el.btnPrevChapter.disabled = !hasPrev;
    el.btnNextChapter.disabled = !hasNext;

    // Right-Hand Floating Dock controls
    el.dockBtnPrev.disabled = !hasPrev;
    el.dockBtnNext.disabled = !hasNext;

    if (hasPrev) {
      el.btnPrevChapter.setAttribute('title', `Chương trước: ${prevChap.full_title}`);
      el.dockBtnPrev.setAttribute('title', `Chương trước: ${prevChap.full_title} (<<)`);
    }
    if (hasNext) {
      el.btnNextChapter.setAttribute('title', `Chương sau: ${nextChap.full_title}`);
      el.dockBtnNext.setAttribute('title', `Chương sau: ${nextChap.full_title} (>>)`);
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
  // 4. Bookmarks Feature (🔖)
  // ==========================================================================

  function updateBookmarkButtonState() {
    if (!el.dockBtnBookmark) return;
    const bookmarks = getStoredBookmarks();
    const isBookmarked = bookmarks.some(b => b.chapterId === state.currentChapterId);
    el.dockBtnBookmark.classList.toggle('bookmarked', isBookmarked);
    el.dockBtnBookmark.setAttribute('aria-pressed', isBookmarked ? 'true' : 'false');
    const labelEl = el.dockBtnBookmark.querySelector('.dock-label');
    if (labelEl) {
      labelEl.textContent = isBookmarked ? 'Đã lưu' : 'Lưu';
    }
  }

  function toggleBookmarkCurrentChapter() {
    const currentChap = state.chapters.find(c => c.id === state.currentChapterId);
    if (!currentChap) return;

    let bookmarks = getStoredBookmarks();
    const existingIndex = bookmarks.findIndex(b => b.chapterId === currentChap.id);

    if (existingIndex !== -1) {
      // Nếu đã lưu chương này, cập nhật vị trí cuộn mới nhất và mở danh sách Dấu trang
      bookmarks[existingIndex].scrollY = Math.round(window.scrollY || 0);
      bookmarks[existingIndex].ratio = Math.round(getScrollRatio() * 100);
      localStorage.setItem('kalvin_bookmarks', JSON.stringify(bookmarks));
      openBookmarksModal();
      return;
    }

    const newBookmark = {
      chapterId: currentChap.id,
      title: currentChap.full_title,
      time: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      scrollY: Math.round(window.scrollY || 0),
      ratio: Math.round(getScrollRatio() * 100)
    };

    bookmarks.unshift(newBookmark);
    localStorage.setItem('kalvin_bookmarks', JSON.stringify(bookmarks));
    updateBookmarkButtonState();
    showToast(`🔖 Đã lưu dấu trang: Chương ${currentChap.number} (${newBookmark.ratio}%)`);
  }

  function getStoredBookmarks() {
    try {
      const data = localStorage.getItem('kalvin_bookmarks');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function openBookmarksModal() {
    const bookmarks = getStoredBookmarks();
    if (bookmarks.length === 0) {
      el.bookmarksList.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 20px;">Bạn chưa lưu dấu trang nào. Nhấn nút <strong>Lưu</strong> trên thanh công cụ dưới cùng để lưu vị trí đang đọc.</div>';
    } else {
      el.bookmarksList.innerHTML = bookmarks.map((b, idx) => `
        <div class="bookmark-item" data-chapter-id="${b.chapterId}" data-scroll="${b.scrollY || 0}">
          <div class="bookmark-info">
            <span class="bookmark-title">${escapeHtml(b.title)}</span>
            <span class="bookmark-date">Đã lưu: ${b.time}${typeof b.ratio === 'number' ? ` • Vị trí ${b.ratio}%` : ''}</span>
          </div>
          <button class="btn-del-bookmark" data-index="${idx}" title="Xóa dấu trang">&times;</button>
        </div>
      `).join('');

      el.bookmarksList.querySelectorAll('.bookmark-item').forEach(item => {
        item.addEventListener('click', (e) => {
          if (e.target.classList.contains('btn-del-bookmark')) return;
          const chapId = parseInt(item.dataset.chapterId, 10);
          closeBookmarksModal();
          renderChapter(chapId, false, false);
          const scrollPos = parseInt(item.dataset.scroll, 10) || 0;
          setTimeout(() => window.scrollTo({ top: scrollPos, behavior: 'smooth' }), 80);
        });
      });

      el.bookmarksList.querySelectorAll('.btn-del-bookmark').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.dataset.index, 10);
          const bms = getStoredBookmarks();
          bms.splice(idx, 1);
          localStorage.setItem('kalvin_bookmarks', JSON.stringify(bms));
          updateBookmarkButtonState();
          openBookmarksModal();
          showToast('Đã xóa dấu trang.');
        });
      });
    }

    el.bookmarksModal.classList.remove('hidden');
    pushOverlayState();
    syncBodyScrollLock();
  }

  function closeBookmarksModal() {
    el.bookmarksModal.classList.add('hidden');
    syncBodyScrollLock();
    releaseOverlayState();
  }

  // ==========================================================================
  // 5. Comments Section (💬)
  // ==========================================================================

  function getStoredComments(chapterId) {
    try {
      const data = localStorage.getItem(`kalvin_comments_${chapterId}`);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function renderComments(chapterId) {
    const comments = getStoredComments(chapterId);
    el.commentsCount.textContent = comments.length;
    el.metaCommentsLink.textContent = `${comments.length} Bình luận`;

    // Pre-fill author name if saved
    const savedAuthor = localStorage.getItem('kalvin_comment_author') || '';
    if (savedAuthor) el.commentAuthor.value = savedAuthor;

    if (comments.length === 0) {
      el.commentsList.innerHTML = '<div style="color: var(--text-muted); font-size: 13.5px; font-style: italic; padding: 10px 0;">Chưa có bình luận nào cho chương này. Hãy là người đầu tiên chia sẻ cảm nghĩ!</div>';
      return;
    }

    el.commentsList.innerHTML = comments.map(c => `
      <div class="comment-item">
        <div class="comment-avatar">${(c.author || 'A').charAt(0).toUpperCase()}</div>
        <div class="comment-content">
          <div class="comment-author-wrap">
            <span class="comment-author">${escapeHtml(c.author)}</span>
            <span class="comment-time">${c.time}</span>
          </div>
          <p class="comment-body">${escapeHtml(c.text)}</p>
        </div>
      </div>
    `).join('');
  }

  function handleCommentSubmit(e) {
    e.preventDefault();
    const author = el.commentAuthor.value.trim();
    const text = el.commentText.value.trim();

    if (!author || !text) return;

    localStorage.setItem('kalvin_comment_author', author);

    const comments = getStoredComments(state.currentChapterId);
    const newComment = {
      id: Date.now(),
      author: author,
      text: text,
      time: 'Vừa xong'
    };

    comments.unshift(newComment);
    localStorage.setItem(`kalvin_comments_${state.currentChapterId}`, JSON.stringify(comments));

    el.commentText.value = '';
    renderComments(state.currentChapterId);
    showToast('💬 Đã gửi bình luận thành công!');
  }

  // ==========================================================================
  // 6. Drawer Menu & Modal Dialogs
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

    const progressMap = getProgressMap();
    let currentArc = null;
    const htmlParts = [];

    filtered.forEach(ch => {
      const arc = ch.arc || 'Chính Văn';
      if (arc !== currentArc) {
        currentArc = arc;
        htmlParts.push(`<div class="drawer-arc-title">${escapeHtml(arc)}</div>`);
      }

      const isActive = ch.id === state.currentChapterId;
      const hasIllus = (ch.illustrations && ch.illustrations.length > 0) || (ch.elements && ch.elements.some(e => e.type === 'image'));
      const wordCountK = Math.round(getWordCount(ch) / 100) / 10;
      const prog = progressMap[ch.id];
      const isRead = prog && prog.max >= 0.9;
      const inProgressPct = (!isRead && prog && prog.pos > 0.03) ? Math.round(prog.pos * 100) : 0;

      let statusHtml = `<span class="drawer-item-badge">${wordCountK}k từ</span>`;
      if (isRead) {
        statusHtml = `<span class="drawer-item-badge drawer-badge-done" title="Đã đọc xong">✓ Đã đọc</span>`;
      } else if (inProgressPct > 0) {
        statusHtml = `<span class="drawer-item-badge drawer-badge-reading" title="Đang đọc dở">${inProgressPct}%</span>`;
      }

      htmlParts.push(`
        <div class="drawer-item ${isActive ? 'active' : ''} ${isRead ? 'drawer-item-read' : ''}" data-id="${ch.id}">
          <div class="drawer-item-title">
            <span>${escapeHtml(ch.full_title)}</span>
            ${hasIllus ? '<span title="Có ảnh minh họa">🖼️</span>' : ''}
          </div>
          ${statusHtml}
        </div>
      `);
    });

    el.drawerList.innerHTML = htmlParts.join('');

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

  function openDrawer() {
    renderDrawerList(el.searchChapterInput ? el.searchChapterInput.value : '');
    el.drawerMenu.classList.add('active');
    pushOverlayState();
    syncBodyScrollLock();

    // Cuộn mục lục tới đúng chương đang đọc để người dùng không phải tìm trong 34+ chương
    requestAnimationFrame(() => {
      const activeItem = el.drawerList.querySelector('.drawer-item.active');
      if (activeItem && typeof activeItem.scrollIntoView === 'function') {
        activeItem.scrollIntoView({ block: 'center', behavior: 'instant' });
      }
      // Chỉ tự động focus ô tìm kiếm trên máy tính (tránh bật bàn phím ảo che mất nửa màn hình điện thoại)
      if (!isTouchDevice && el.searchChapterInput) {
        el.searchChapterInput.focus();
      }
    });
  }

  function closeDrawer() {
    el.drawerMenu.classList.remove('active');
    syncBodyScrollLock();
    releaseOverlayState();
  }

  function toggleSettings() {
    const willOpen = el.settingsPanel.classList.contains('hidden');
    el.settingsPanel.classList.toggle('hidden');
    if (willOpen) {
      pushOverlayState();
    } else {
      releaseOverlayState();
    }
  }

  function openInfoModal() {
    el.infoModal.classList.remove('hidden');
    pushOverlayState();
    syncBodyScrollLock();
  }

  function closeInfoModal() {
    el.infoModal.classList.add('hidden');
    syncBodyScrollLock();
    releaseOverlayState();
  }

  // ==========================================================================
  // 7. Lightbox, Progress & Preferences
  // ==========================================================================

  // Scroll Direction Tracker for Auto-Hiding Header & Dock
  let lastScrollY = Math.max(0, window.scrollY || document.documentElement.scrollTop);
  const SCROLL_THRESHOLD = 8;

  function setChromeHidden(hidden) {
    if (el.appHeader) el.appHeader.classList.toggle('header-hidden', hidden);
    if (el.floatingDock) el.floatingDock.classList.toggle('dock-hidden', hidden);
    if (hidden && el.settingsPanel && !el.settingsPanel.classList.contains('hidden')) {
      el.settingsPanel.classList.add('hidden');
    }
  }

  function updateProgressBar() {
    const currentScrollY = Math.max(0, window.scrollY || document.documentElement.scrollTop);
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(100, Math.max(0, (currentScrollY / docHeight) * 100)) : 0;
    if (el.progressBar) {
      el.progressBar.style.width = `${progress}%`;
    }
    if (el.headerProgress) {
      el.headerProgress.textContent = `${Math.round(progress)}%`;
    }

    scheduleSaveProgress();

    if (!el.appHeader) return;

    const nearTop = currentScrollY <= 50;
    const nearBottom = docHeight > 0 && (docHeight - currentScrollY <= 120);

    // Luôn hiển thị thanh công cụ khi ở đầu chương hoặc sát cuối chương
    if (nearTop || nearBottom) {
      setChromeHidden(false);
      lastScrollY = currentScrollY;
      return;
    }

    // Cuộn xuống (Scroll Down) -> Ẩn cả Header và Bottom Dock để đọc toàn màn hình
    if (currentScrollY > lastScrollY + SCROLL_THRESHOLD && currentScrollY > 70) {
      setChromeHidden(true);
    }
    // Gạt lên (Scroll Up) -> Hiện Header và Bottom Dock trở lại
    else if (currentScrollY < lastScrollY - SCROLL_THRESHOLD) {
      setChromeHidden(false);
    }

    lastScrollY = currentScrollY;
  }

  function openLightbox(src, caption) {
    el.lightboxImg.src = src;
    el.lightboxCaption.textContent = caption || '';
    el.lightbox.classList.remove('hidden');
    pushOverlayState();
    syncBodyScrollLock();
  }

  function closeLightbox() {
    el.lightbox.classList.add('hidden');
    syncBodyScrollLock();
    releaseOverlayState();
  }

  let toastTimer = null;
  function showToast(message) {
    clearTimeout(toastTimer);
    el.toast.textContent = message;
    el.toast.classList.remove('hidden');
    toastTimer = setTimeout(() => el.toast.classList.add('hidden'), 2600);
  }

  function loadPreferences() {
    const savedTheme = localStorage.getItem('kalvin_theme') || DEFAULT_PREFS.theme;
    const savedFont = localStorage.getItem('kalvin_font') || DEFAULT_PREFS.font;
    const savedSize = parseInt(localStorage.getItem('kalvin_font_size'), 10) || DEFAULT_PREFS.fontSize;
    const savedLineHeight = parseFloat(localStorage.getItem('kalvin_line_height')) || DEFAULT_PREFS.lineHeight;
    const savedWidth = parseInt(localStorage.getItem('kalvin_reader_width'), 10) || DEFAULT_PREFS.readerWidth;

    applyTheme(savedTheme);
    applyFont(savedFont);
    applyFontSize(savedSize);
    applyLineHeight(savedLineHeight);
    applyReaderWidth(savedWidth);
  }

  function resetPreferences() {
    applyTheme(DEFAULT_PREFS.theme);
    applyFont(DEFAULT_PREFS.font);
    applyFontSize(DEFAULT_PREFS.fontSize);
    applyLineHeight(DEFAULT_PREFS.lineHeight);
    applyReaderWidth(DEFAULT_PREFS.readerWidth);
    showToast('↺ Đã khôi phục cài đặt hiển thị mặc định');
  }

  function applyTheme(theme) {
    state.theme = theme;
    el.body.classList.remove('theme-sepia', 'theme-dark', 'theme-light');
    el.body.classList.add(`theme-${theme}`);
    localStorage.setItem('kalvin_theme', theme);
    el.themeButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.theme === theme));
    if (el.metaThemeColor && THEME_COLORS[theme]) {
      el.metaThemeColor.setAttribute('content', THEME_COLORS[theme]);
    }
  }

  function applyFont(font) {
    keepReadingPosition(() => {
      state.font = font;
      el.body.classList.remove('font-serif', 'font-sans');
      el.body.classList.add(font);
      localStorage.setItem('kalvin_font', font);
      el.fontButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.font === font));
    });
  }

  function applyFontSize(size) {
    keepReadingPosition(() => {
      state.fontSize = size;
      document.documentElement.style.setProperty('--reader-font-size', `${size}px`);
      el.fontSizeVal.textContent = `${size}px`;
      el.fontSizeSlider.value = size;
      localStorage.setItem('kalvin_font_size', size);
    });
  }

  function applyLineHeight(lh) {
    keepReadingPosition(() => {
      state.lineHeight = lh;
      document.documentElement.style.setProperty('--reader-line-height', lh);
      el.lineHeightVal.textContent = lh;
      el.lineHeightSlider.value = lh;
      localStorage.setItem('kalvin_line_height', lh);
    });
  }

  function applyReaderWidth(w) {
    keepReadingPosition(() => {
      state.readerWidth = w;
      document.documentElement.style.setProperty('--max-content-width', `${w}px`);
      localStorage.setItem('kalvin_reader_width', w);
      el.widthButtons.forEach(btn => btn.classList.toggle('active', parseInt(btn.dataset.width, 10) === w));
      const widthLabel = document.getElementById('reader-width-val');
      if (widthLabel) {
        widthLabel.textContent = w <= 680 ? 'Gọn' : (w >= 900 ? 'Rộng' : 'Chuẩn');
      }
    });
  }

  // ==========================================================================
  // 8. Event Listeners
  // ==========================================================================

  function setupEventListeners() {
    // Top Bar Actions
    el.btnToggleMenu.addEventListener('click', openDrawer);
    el.btnCloseDrawer.addEventListener('click', closeDrawer);
    el.drawerOverlay.addEventListener('click', closeDrawer);
    el.searchChapterInput.addEventListener('input', (e) => renderDrawerList(e.target.value));

    if (el.btnDrawerBookmarks) {
      el.btnDrawerBookmarks.addEventListener('click', () => {
        el.drawerMenu.classList.remove('active');
        openBookmarksModal();
      });
    }

    if (el.btnToggleSettings) {
      el.btnToggleSettings.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSettings();
      });
    }

    document.addEventListener('click', (e) => {
      const isHeaderBtn = el.btnToggleSettings && (e.target === el.btnToggleSettings || el.btnToggleSettings.contains(e.target));
      const isDockBtn = el.dockBtnSettings && (e.target === el.dockBtnSettings || el.dockBtnSettings.contains(e.target));
      if (!el.settingsPanel.contains(e.target) && !isHeaderBtn && !isDockBtn) {
        el.settingsPanel.classList.add('hidden');
      }
    });

    // Chạm nhẹ vùng giữa màn hình để Bật/Tắt chế độ đọc toàn màn hình (Immersive Reader)
    el.chapterContent.addEventListener('click', (e) => {
      if (e.target.closest('a, button, .illustration-img-wrap, input, textarea')) return;
      const sel = window.getSelection ? window.getSelection() : null;
      if (sel && sel.toString().trim().length > 0) return;

      const yRatio = e.clientY / window.innerHeight;
      if (yRatio >= 0.25 && yRatio <= 0.75) {
        const isHidden = el.appHeader && el.appHeader.classList.contains('header-hidden');
        setChromeHidden(!isHidden);
      }
    });

    // Right-Hand / Bottom Floating Dock Buttons
    el.dockBtnPrev.addEventListener('click', goToPrevChapter);
    el.dockBtnHome.addEventListener('click', openDrawer);
    el.dockBtnSettings.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSettings();
    });
    el.dockBtnInfo.addEventListener('click', openInfoModal);
    el.dockBtnBookmark.addEventListener('click', toggleBookmarkCurrentChapter);
    el.dockBtnNext.addEventListener('click', goToNextChapter);

    // Modals
    el.btnCloseInfoModal.addEventListener('click', closeInfoModal);
    el.infoModal.addEventListener('click', (e) => {
      if (e.target === el.infoModal) closeInfoModal();
    });

    el.btnCloseBookmarksModal.addEventListener('click', closeBookmarksModal);
    el.bookmarksModal.addEventListener('click', (e) => {
      if (e.target === el.bookmarksModal) closeBookmarksModal();
    });

    // Theme & Font Settings
    el.themeButtons.forEach(btn => btn.addEventListener('click', () => applyTheme(btn.dataset.theme)));
    el.fontButtons.forEach(btn => btn.addEventListener('click', () => applyFont(btn.dataset.font)));
    el.fontSizeSlider.addEventListener('input', (e) => applyFontSize(parseInt(e.target.value, 10)));
    el.btnFontDecrease.addEventListener('click', () => applyFontSize(Math.max(14, state.fontSize - 1)));
    el.btnFontIncrease.addEventListener('click', () => applyFontSize(Math.min(28, state.fontSize + 1)));
    el.lineHeightSlider.addEventListener('input', (e) => applyLineHeight(parseFloat(e.target.value)));
    el.widthButtons.forEach(btn => btn.addEventListener('click', () => applyReaderWidth(parseInt(btn.dataset.width, 10))));
    if (el.btnResetSettings) {
      el.btnResetSettings.addEventListener('click', resetPreferences);
    }

    // Bottom Navigation
    el.btnPrevChapter.addEventListener('click', goToPrevChapter);
    el.btnNextChapter.addEventListener('click', goToNextChapter);
    el.selectChapterJump.addEventListener('change', (e) => renderChapter(parseInt(e.target.value, 10)));

    // Scroll & Progress
    el.btnScrollTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setChromeHidden(false);
    });
    window.addEventListener('scroll', updateProgressBar, { passive: true });
    window.addEventListener('beforeunload', saveChapterProgress);

    // Lightbox
    el.btnCloseLightbox.addEventListener('click', closeLightbox);
    el.lightbox.addEventListener('click', (e) => {
      if (e.target === el.lightbox) closeLightbox();
    });

    // Comments Form
    el.formComment.addEventListener('submit', handleCommentSubmit);

    // Nút Back vật lý / cử chỉ vuốt cạnh trên điện thoại: đóng popup/mục lục thay vì thoát trang
    window.addEventListener('popstate', () => {
      if (anyOverlayOpen()) {
        overlayHistoryActive = false;
        el.drawerMenu.classList.remove('active');
        el.infoModal.classList.add('hidden');
        el.bookmarksModal.classList.add('hidden');
        el.lightbox.classList.add('hidden');
        el.settingsPanel.classList.add('hidden');
        syncBodyScrollLock();
      }
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDrawer();
        closeLightbox();
        closeInfoModal();
        closeBookmarksModal();
        el.settingsPanel.classList.add('hidden');
      } else if (e.key === 'ArrowLeft' && !document.querySelector('input:focus, textarea:focus')) {
        goToPrevChapter();
      } else if (e.key === 'ArrowRight' && !document.querySelector('input:focus, textarea:focus')) {
        goToNextChapter();
      }
    });
  }

  function escapeHtml(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Global API
  window.KalvinApp = {
    getState: () => state,
    renderChapter,
    renderDrawerList,
    populateChapterSelect,
    showToast,
    escapeHtml
  };

  document.addEventListener('DOMContentLoaded', initApp);
})();
