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
    widthButtons: document.querySelectorAll('.btn-width')
  };

  // ==========================================================================
  // 1. Initialization
  // ==========================================================================

  function initApp() {
    loadPreferences();
    loadNovelData();
    setupEventListeners();
  }

  function loadNovelData() {
    // 1. LocalStorage custom chapters (if user created new chapters)
    const localChapters = localStorage.getItem('kalvin_custom_chapters');
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

    // 2. Global bundle window.KALVIN_DATA
    if (!state.chapters.length && window.KALVIN_DATA) {
      state.novel = window.KALVIN_DATA.novel;
      state.chapters = window.KALVIN_DATA.chapters;
    }

    // 3. Fallback to fetch data/chapters.json
    if (!state.chapters.length) {
      fetch('data/chapters.json')
        .then(res => res.json())
        .then(data => {
          state.novel = data.novel;
          state.chapters = data.chapters;
          onDataReady();
        })
        .catch(err => {
          console.warn('Fetch data/chapters.json failed:', err);
          if (window.KALVIN_DATA) {
            state.novel = window.KALVIN_DATA.novel;
            state.chapters = window.KALVIN_DATA.chapters;
            onDataReady();
          }
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

    renderChapter(targetId, false);
  }

  // ==========================================================================
  // 2. Chapter Rendering Logic (Chuẩn format hình mẫu 2)
  // ==========================================================================

  function renderChapter(chapterId, smoothScroll = true) {
    const chapter = state.chapters.find(c => c.id === chapterId);
    if (!chapter) return;

    state.currentChapterId = chapterId;
    localStorage.setItem('kalvin_last_read_chapter', chapterId);

    // Header updates (matching Image 2 layout)
    el.headerBadge.textContent = `Chương ${chapter.number}`;
    el.mainNovelTitle.textContent = state.novel ? state.novel.title : 'Biên Niên Sử Tro Tàn';
    el.mainChapterTitle.textContent = `CHƯƠNG ${chapter.number}: ${chapter.title.toUpperCase()}`;
    document.title = `Chương ${chapter.number}: ${chapter.title} - ${state.novel ? state.novel.title : 'Biên Niên Sử Tro Tàn'}`;

    const wordCount = chapter.word_count || (chapter.content ? chapter.content.split(/\s+/).length : 0);
    el.chapterWordCount.textContent = `Độ dài: ${wordCount.toLocaleString('vi-VN')} từ`;
    el.chapterArcName.textContent = chapter.arc || 'Chính Văn';

    // Render Clean Paragraphs
    renderFormattedContent(chapter);

    // Comments for this chapter
    renderComments(chapter.id);

    // Update Nav buttons (Both bottom bar and right dock)
    updateNavButtons();
    el.selectChapterJump.value = chapter.id;

    // Highlight active in drawer
    document.querySelectorAll('.drawer-item').forEach(item => {
      item.classList.toggle('active', parseInt(item.dataset.id, 10) === chapterId);
    });

    // Reset Progress & Scroll
    if (el.appHeader) {
      el.appHeader.classList.remove('header-hidden');
    }
    lastScrollY = 0;
    updateProgressBar();
    if (smoothScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  }

  function renderFormattedContent(chapter) {
    // If structured elements exist (clean paragraph objects from docx parser)
    if (chapter.elements && Array.isArray(chapter.elements) && chapter.elements.length > 0) {
      const htmlParts = [];
      chapter.elements.forEach(item => {
        if (item.type === 'paragraph') {
          const text = item.text.trim();
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
      const raw = chapter.content || '';
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
        htmlParts.push(`<p>${escapeHtml(mergedParagraph)}</p>`);
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

  function toggleBookmarkCurrentChapter() {
    const currentChap = state.chapters.find(c => c.id === state.currentChapterId);
    if (!currentChap) return;

    let bookmarks = getStoredBookmarks();
    const existingIndex = bookmarks.findIndex(b => b.chapterId === currentChap.id);

    if (existingIndex !== -1) {
      // Open bookmarks modal if already bookmarked
      openBookmarksModal();
      return;
    }

    const newBookmark = {
      chapterId: currentChap.id,
      title: currentChap.full_title,
      time: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      scrollY: window.scrollY
    };

    bookmarks.unshift(newBookmark);
    localStorage.setItem('kalvin_bookmarks', JSON.stringify(bookmarks));
    showToast(`🔖 Đã lưu dấu trang: Chương ${currentChap.number}!`);
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
      el.bookmarksList.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 20px;">Bạn chưa lưu dấu trang nào. Nhấn biểu tượng 🔖 trên thanh công cụ bên phải để lưu chương đang đọc.</div>';
    } else {
      el.bookmarksList.innerHTML = bookmarks.map((b, idx) => `
        <div class="bookmark-item" data-chapter-id="${b.chapterId}" data-scroll="${b.scrollY || 0}">
          <div class="bookmark-info">
            <span class="bookmark-title">${escapeHtml(b.title)}</span>
            <span class="bookmark-date">Đã lưu: ${b.time}</span>
          </div>
          <button class="btn-del-bookmark" data-index="${idx}" title="Xóa dấu trang">&times;</button>
        </div>
      `).join('');

      el.bookmarksList.querySelectorAll('.bookmark-item').forEach(item => {
        item.addEventListener('click', (e) => {
          if (e.target.classList.contains('btn-del-bookmark')) return;
          const chapId = parseInt(item.dataset.chapterId, 10);
          closeBookmarksModal();
          renderChapter(chapId, false);
          const scrollPos = parseInt(item.dataset.scroll, 10) || 0;
          setTimeout(() => window.scrollTo({ top: scrollPos, behavior: 'smooth' }), 100);
        });
      });

      el.bookmarksList.querySelectorAll('.btn-del-bookmark').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.dataset.index, 10);
          const bms = getStoredBookmarks();
          bms.splice(idx, 1);
          localStorage.setItem('kalvin_bookmarks', JSON.stringify(bms));
          openBookmarksModal();
          showToast('Đã xóa dấu trang.');
        });
      });
    }

    el.bookmarksModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeBookmarksModal() {
    el.bookmarksModal.classList.add('hidden');
    document.body.style.overflow = '';
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

  function openInfoModal() {
    el.infoModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeInfoModal() {
    el.infoModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  // ==========================================================================
  // 7. Lightbox, Progress & Preferences
  // ==========================================================================

  // Scroll Direction Tracker for Auto-Hiding Header
  let lastScrollY = Math.max(0, window.scrollY || document.documentElement.scrollTop);
  const SCROLL_THRESHOLD = 8;

  function updateProgressBar() {
    const currentScrollY = Math.max(0, window.scrollY || document.documentElement.scrollTop);
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(100, Math.max(0, (currentScrollY / docHeight) * 100)) : 0;
    if (el.progressBar) {
      el.progressBar.style.width = `${progress}%`;
    }

    if (!el.appHeader) return;

    // Luôn hiển thị header khi ở gần đỉnh trang (<= 50px)
    if (currentScrollY <= 50) {
      el.appHeader.classList.remove('header-hidden');
      lastScrollY = currentScrollY;
      return;
    }

    // Cuộn xuống (Scroll Down) -> Ẩn header
    if (currentScrollY > lastScrollY + SCROLL_THRESHOLD && currentScrollY > 70) {
      el.appHeader.classList.add('header-hidden');
      // Đóng popup cài đặt nếu đang mở để tránh lơ lửng giữa màn hình
      if (el.settingsPanel && !el.settingsPanel.classList.contains('hidden')) {
        el.settingsPanel.classList.add('hidden');
      }
    } 
    // Gạt lên (Scroll Up) -> Hiện header trở lại
    else if (currentScrollY < lastScrollY - SCROLL_THRESHOLD) {
      el.appHeader.classList.remove('header-hidden');
    }

    lastScrollY = currentScrollY;
  }

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

  function showToast(message) {
    el.toast.textContent = message;
    el.toast.classList.remove('hidden');
    setTimeout(() => el.toast.classList.add('hidden'), 2500);
  }

  function loadPreferences() {
    const savedTheme = localStorage.getItem('kalvin_theme') || 'sepia';
    const savedFont = localStorage.getItem('kalvin_font') || 'font-serif';
    const savedSize = parseInt(localStorage.getItem('kalvin_font_size'), 10) || 18;
    const savedLineHeight = parseFloat(localStorage.getItem('kalvin_line_height')) || 1.8;
    const savedWidth = parseInt(localStorage.getItem('kalvin_reader_width'), 10) || 780;

    applyTheme(savedTheme);
    applyFont(savedFont);
    applyFontSize(savedSize);
    applyLineHeight(savedLineHeight);
    applyReaderWidth(savedWidth);
  }

  function applyTheme(theme) {
    state.theme = theme;
    el.body.classList.remove('theme-sepia', 'theme-dark', 'theme-light');
    el.body.classList.add(`theme-${theme}`);
    localStorage.setItem('kalvin_theme', theme);
    el.themeButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.theme === theme));
  }

  function applyFont(font) {
    state.font = font;
    el.body.classList.remove('font-serif', 'font-sans');
    el.body.classList.add(font);
    localStorage.setItem('kalvin_font', font);
    el.fontButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.font === font));
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

  function applyReaderWidth(w) {
    state.readerWidth = w;
    document.documentElement.style.setProperty('--max-content-width', `${w}px`);
    localStorage.setItem('kalvin_reader_width', w);
    el.widthButtons.forEach(btn => btn.classList.toggle('active', parseInt(btn.dataset.width, 10) === w));
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

    // Right-Hand Floating Dock Buttons
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

    // Bottom Navigation
    el.btnPrevChapter.addEventListener('click', goToPrevChapter);
    el.btnNextChapter.addEventListener('click', goToNextChapter);
    el.selectChapterJump.addEventListener('change', (e) => renderChapter(parseInt(e.target.value, 10)));

    // Scroll & Progress
    el.btnScrollTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (el.appHeader) el.appHeader.classList.remove('header-hidden');
    });
    window.addEventListener('scroll', updateProgressBar, { passive: true });

    // Lightbox
    el.btnCloseLightbox.addEventListener('click', closeLightbox);
    el.lightbox.addEventListener('click', (e) => {
      if (e.target === el.lightbox) closeLightbox();
    });

    // Comments Form
    el.formComment.addEventListener('submit', handleCommentSubmit);

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
