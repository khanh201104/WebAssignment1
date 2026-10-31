/**
 * Biên Niên Sử Tro Tàn - Publish Chapter & Data Export Module
 */

(function () {
  'use strict';

  let illustrationRows = [];

  const el = {
    btnOpenPublish: document.getElementById('btn-open-publish'),
    btnDrawerAddChap: document.getElementById('btn-drawer-add-chap'),
    btnDrawerExport: document.getElementById('btn-drawer-export'),
    publishModal: document.getElementById('publish-modal'),
    btnClosePublishModal: document.getElementById('btn-close-publish-modal'),
    btnCancelPublish: document.getElementById('btn-cancel-publish'),
    formPublish: document.getElementById('form-publish-chapter'),
    inputChapNum: document.getElementById('input-chap-num'),
    inputChapArc: document.getElementById('input-chap-arc'),
    inputChapTitle: document.getElementById('input-chap-title'),
    inputChapContent: document.getElementById('input-chap-content'),
    btnAddIllusRow: document.getElementById('btn-add-illustration-row'),
    illusInputsList: document.getElementById('illustration-inputs-list')
  };

  function initPublishModule() {
    setupPublishEvents();
  }

  function setupPublishEvents() {
    el.btnOpenPublish.addEventListener('click', openPublishModal);
    if (el.btnDrawerAddChap) {
      el.btnDrawerAddChap.addEventListener('click', () => {
        const drawer = document.getElementById('drawer-menu');
        if (drawer) drawer.classList.remove('active');
        document.body.style.overflow = '';
        openPublishModal();
      });
    }

    if (el.btnDrawerExport) {
      el.btnDrawerExport.addEventListener('click', exportChaptersData);
    }

    el.btnClosePublishModal.addEventListener('click', closePublishModal);
    el.btnCancelPublish.addEventListener('click', closePublishModal);
    el.publishModal.addEventListener('click', (e) => {
      if (e.target === el.publishModal) closePublishModal();
    });

    el.btnAddIllusRow.addEventListener('click', () => addIllustrationInputRow());
    el.formPublish.addEventListener('submit', handlePublishSubmit);
  }

  function openPublishModal() {
    const appState = window.KalvinApp ? window.KalvinApp.getState() : null;
    if (appState && appState.chapters.length > 0) {
      const nextNum = appState.chapters.length + 1;
      el.inputChapNum.value = nextNum;
      el.inputChapArc.value = appState.chapters[appState.chapters.length - 1].arc || 'Arc 2: Học Viện Hoàng Gia Leicester';
      el.inputChapTitle.value = '';
      el.inputChapContent.value = '';
    }

    // Reset illustration rows
    illustrationRows = [];
    el.illusInputsList.innerHTML = '';

    el.publishModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    el.inputChapTitle.focus();
  }

  function closePublishModal() {
    el.publishModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function addIllustrationInputRow(defaultData = null) {
    const rowId = 'illus_row_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    const rowData = {
      id: rowId,
      url: defaultData ? defaultData.url : '',
      caption: defaultData ? defaultData.caption : '',
      position: defaultData ? defaultData.position : 'bottom'
    };

    illustrationRows.push(rowData);

    const rowEl = document.createElement('div');
    rowEl.className = 'illustration-input-item';
    rowEl.id = rowId;

    rowEl.innerHTML = `
      <button type="button" class="btn-del-illus" title="Xóa ảnh này" aria-label="Xóa">&times;</button>
      <div class="form-row">
        <div class="form-group flex-2">
          <label>Đường dẫn ảnh / URL hoặc chọn tệp ảnh từ máy</label>
          <input type="text" class="illus-url-input" placeholder="Ví dụ: assets/images/... hoặc dán link ảnh" value="${rowData.url}">
          <input type="file" accept="image/*" class="illus-file-input" style="margin-top: 6px; font-size: 12px;">
        </div>
        <div class="form-group flex-1">
          <label>Vị trí hiển thị</label>
          <select class="illus-pos-select">
            <option value="top" ${rowData.position === 'top' ? 'selected' : ''}>Đầu chương (Banner)</option>
            <option value="inline" ${rowData.position === 'inline' ? 'selected' : ''}>Giữa chương [ảnh: X]</option>
            <option value="bottom" ${rowData.position === 'bottom' ? 'selected' : ''}>Cuối chương (Gallery)</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label>Chú thích tranh minh họa</label>
        <input type="text" class="illus-caption-input" placeholder="Ví dụ: Kalvin và Roy trước cổng Rừng Sương Muối" value="${rowData.caption}">
      </div>
      <div class="illus-preview-wrap" style="display: none; margin-top: 6px;">
        <img class="illus-preview-img" style="max-height: 120px; border-radius: 6px; object-fit: contain; background: #000;" src="" alt="Xem trước">
      </div>
    `;

    el.illusInputsList.appendChild(rowEl);

    // Event bindings for row
    const btnDel = rowEl.querySelector('.btn-del-illus');
    const inputUrl = rowEl.querySelector('.illus-url-input');
    const inputFile = rowEl.querySelector('.illus-file-input');
    const selectPos = rowEl.querySelector('.illus-pos-select');
    const inputCaption = rowEl.querySelector('.illus-caption-input');
    const previewWrap = rowEl.querySelector('.illus-preview-wrap');
    const previewImg = rowEl.querySelector('.illus-preview-img');

    btnDel.addEventListener('click', () => {
      illustrationRows = illustrationRows.filter(r => r.id !== rowId);
      rowEl.remove();
    });

    inputUrl.addEventListener('input', (e) => {
      rowData.url = e.target.value;
      if (rowData.url) {
        previewImg.src = rowData.url;
        previewWrap.style.display = 'block';
      } else {
        previewWrap.style.display = 'none';
      }
    });

    selectPos.addEventListener('change', (e) => {
      rowData.position = e.target.value;
    });

    inputCaption.addEventListener('input', (e) => {
      rowData.caption = e.target.value;
    });

    // Handle file input -> base64 DataURL
    inputFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (ev) {
          rowData.url = ev.target.result;
          inputUrl.value = `[Đã chọn ảnh: ${file.name}]`;
          previewImg.src = rowData.url;
          previewWrap.style.display = 'block';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  function handlePublishSubmit(e) {
    e.preventDefault();

    const chapNum = parseInt(el.inputChapNum.value, 10);
    const arcTitle = el.inputChapArc.value.trim();
    const chapTitle = el.inputChapTitle.value.trim();
    const content = el.inputChapContent.value.trim();

    if (!chapNum || !chapTitle || !content) {
      alert('Vui lòng điền đầy đủ số chương, tiêu đề và nội dung.');
      return;
    }

    // Filter valid illustrations
    const validIllus = illustrationRows
      .filter(r => r.url && r.url.trim() !== '')
      .map(r => ({
        url: r.url.trim(),
        caption: r.caption.trim(),
        position: r.position || 'bottom'
      }));

    const wordCount = content.split(/\s+/).length;

    const newChapter = {
      id: chapNum,
      number: chapNum,
      title: chapTitle,
      full_title: `Chương ${chapNum}: ${chapTitle}`,
      arc: arcTitle || 'Arc 2: Học Viện Hoàng Gia Leicester',
      content: content,
      word_count: wordCount,
      illustrations: validIllus
    };

    const appState = window.KalvinApp ? window.KalvinApp.getState() : null;
    if (!appState) {
      alert('Hệ thống chưa sẵn sàng.');
      return;
    }

    // Check if chapter already exists (update or append)
    const existingIndex = appState.chapters.findIndex(c => c.id === chapNum);
    if (existingIndex !== -1) {
      if (confirm(`Chương ${chapNum} đã tồn tại. Bạn có muốn cập nhật nội dung chương này không?`)) {
        appState.chapters[existingIndex] = newChapter;
      } else {
        return;
      }
    } else {
      appState.chapters.push(newChapter);
      appState.chapters.sort((a, b) => a.number - b.number);
    }

    // Save to localStorage
    try {
      localStorage.setItem('kalvin_custom_chapters', JSON.stringify(appState.chapters));
    } catch (err) {
      console.warn('LocalStorage limit reached for custom chapters:', err);
    }

    // Update UI
    window.KalvinApp.populateChapterSelect();
    window.KalvinApp.renderDrawerList();
    window.KalvinApp.renderChapter(newChapter.id);

    closePublishModal();

    // Show friendly success toast/alert
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: #10b981;
      color: #fff;
      padding: 12px 24px;
      border-radius: 24px;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 4px 14px rgba(0,0,0,0.25);
      z-index: 2000;
      animation: fadeIn 0.3s ease;
    `;
    toast.textContent = `🎉 Đã đăng thành công Chương ${newChapter.number}: ${newChapter.title}!`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.5s ease';
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  }

  function exportChaptersData() {
    const appState = window.KalvinApp ? window.KalvinApp.getState() : null;
    if (!appState || !appState.chapters) return;

    const exportObj = {
      novel: appState.novel || {
        title: "Biên Niên Sử Tro Tàn: Kalvin Palace",
        total_chapters: appState.chapters.length
      },
      chapters: appState.chapters,
      exported_at: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `kalvin_chapters_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  document.addEventListener('DOMContentLoaded', initPublishModule);
})();
