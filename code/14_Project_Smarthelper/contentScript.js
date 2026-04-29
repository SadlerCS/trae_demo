// 内容脚本：检测选中文本，显示悬浮操作条与结果浮层；通过消息调用后台进行翻译与朗读

// 悬浮 UI 的根容器
let smartHelperRoot = null;
let currentSelectionText = '';
let currentTargetLang = 'zh';
let enableFloating = true;

// 创建悬浮 UI
function ensureUI() {
  if (smartHelperRoot) return smartHelperRoot;
  smartHelperRoot = document.createElement('div');
  smartHelperRoot.id = 'smart-helper-root';
  smartHelperRoot.style.position = 'absolute';
  smartHelperRoot.style.zIndex = '2147483647';
  smartHelperRoot.style.display = 'none';
  smartHelperRoot.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, Arial';

  // 操作条
  const bar = document.createElement('div');
  bar.id = 'smart-helper-bar';
  bar.className = 'smart-helper-bar';
  bar.innerHTML = `
    <div class="sh-row">
      <button class="sh-btn" data-action="translate">翻译</button>
      <button class="sh-btn" data-action="speak">朗读</button>
      <button class="sh-btn" data-action="stop">停止</button>
      <div class="sh-sep"></div>
      <label class="sh-label">目标语言：</label>
      <button class="sh-toggle ${currentTargetLang === 'zh' ? 'active' : ''}" data-lang="zh">中文</button>
      <button class="sh-toggle ${currentTargetLang === 'en' ? 'active' : ''}" data-lang="en">英文</button>
    </div>
  `;

  // 结果浮层
  const panel = document.createElement('div');
  panel.id = 'smart-helper-panel';
  panel.className = 'smart-helper-panel';
  panel.innerHTML = `
    <div class="sh-panel-title">翻译结果</div>
    <div class="sh-panel-body sh-status">提示：选中文本后点击“翻译”</div>
    <div class="sh-row">
      <button class="sh-btn" data-action="copy">复制</button>
      <button class="sh-btn" data-action="panel-speak">朗读</button>
      <button class="sh-btn" data-action="stop">停止</button>
      <button class="sh-btn sh-right" data-action="close">关闭</button>
    </div>
  `;

  smartHelperRoot.appendChild(bar);
  smartHelperRoot.appendChild(panel);
  document.documentElement.appendChild(smartHelperRoot);

  // 事件委托：按钮点击
  smartHelperRoot.addEventListener('click', async (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;

    // 切换目标语言
    if (target.dataset.lang) {
      currentTargetLang = target.dataset.lang;
      smartHelperRoot.querySelectorAll('.sh-toggle').forEach(el => el.classList.remove('active'));
      target.classList.add('active');
      if (currentSelectionText) {
        setPanelStatus('正在翻译…');
        try {
          const resp = await chrome.runtime.sendMessage({
            type: 'TRANSLATE',
            payload: { text: currentSelectionText, targetLang: currentTargetLang }
          });
          if (resp?.ok) setPanelResult(resp.data || '');
          else setPanelStatus('翻译失败，请重试');
        } catch (e) {
          setPanelStatus('网络异常，请检查网络后重试');
        }
      }
      return;
    }

    const action = target.dataset.action;
    if (!action) return;

    if (action === 'translate') {
      if (!currentSelectionText) {
        setPanelStatus('未检测到选中文本');
        return;
      }
      setPanelStatus('正在翻译…');
      try {
        const resp = await chrome.runtime.sendMessage({
          type: 'TRANSLATE',
          payload: { text: currentSelectionText, targetLang: currentTargetLang }
        });
        if (resp?.ok) {
          setPanelResult(resp.data || '');
        } else {
          const err = String(resp?.error || '翻译失败，请重试');
          if (err.includes('MISSING_API')) {
            setPanelStatus('未配置 Kimi API，前往设置');
          } else {
            setPanelStatus('翻译失败，请重试');
          }
        }
      } catch (e) {
        setPanelStatus('网络异常，请检查网络后重试');
      }
      return;
    }

    if (action === 'speak') {
      const translatedText = getPanelText();
      const bodyEl = smartHelperRoot?.querySelector('.sh-panel-body');
      const hasTranslated = bodyEl && !bodyEl.classList.contains('sh-status') && translatedText;
      const speakText = hasTranslated ? translatedText : currentSelectionText;
      if (!speakText) {
        setPanelStatus('未检测到选中文本');
        return;
      }
      await chrome.runtime.sendMessage({ type: 'TTS_STOP' });
      const resp = await chrome.runtime.sendMessage({ type: 'TTS_SPEAK', payload: { text: speakText, lang: currentTargetLang } });
      if (!resp?.ok) {
        setPanelStatus('浏览器朗读不可用');
      } else {
        setPanelStatus('正在朗读…');
      }
      return;
    }

    if (action === 'panel-speak') {
      const text = getPanelText();
      if (!text) return;
      await chrome.runtime.sendMessage({ type: 'TTS_STOP' });
      const resp = await chrome.runtime.sendMessage({ type: 'TTS_SPEAK', payload: { text, lang: currentTargetLang } });
      if (!resp?.ok) setPanelStatus('浏览器朗读不可用');
      else setPanelStatus('正在朗读…');
      return;
    }

    if (action === 'stop') {
      await chrome.runtime.sendMessage({ type: 'TTS_STOP' });
      setPanelStatus('已停止朗读');
      return;
    }

    if (action === 'copy') {
      const text = getPanelText();
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        setPanelStatus('已复制到剪贴板');
      } catch (e) {
        setPanelStatus('复制失败，请重试');
      }
      return;
    }

    if (action === 'close') {
      hideUI();
      return;
    }
  });

  return smartHelperRoot;
}

function setPanelStatus(msg) {
  const body = smartHelperRoot?.querySelector('.sh-panel-body');
  if (body) {
    body.classList.add('sh-status');
    body.textContent = msg;
  }
}

function setPanelResult(text) {
  const body = smartHelperRoot?.querySelector('.sh-panel-body');
  if (body) {
    body.classList.remove('sh-status');
    body.textContent = text;
  }
}

function getPanelText() {
  const body = smartHelperRoot?.querySelector('.sh-panel-body');
  return body?.textContent || '';
}

function showUIAt(rect) {
  const root = ensureUI();
  const scrollX = window.scrollX || document.documentElement.scrollLeft;
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  const left = rect.left + scrollX;
  const top = rect.bottom + scrollY + 6; // 面板显示在选区下方
  root.style.left = `${left}px`;
  root.style.top = `${top}px`;
  root.style.display = 'block';
}

function hideUI() {
  if (smartHelperRoot) smartHelperRoot.style.display = 'none';
}

// 获取选中文本与位置
function getSelectionInfo() {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed) return null;
  const text = sel.toString().trim();
  if (!text) return null;
  const range = sel.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  return { text, rect };
}

// 监听选区变化与鼠标事件
function bindSelectionEvents() {
  document.addEventListener('mouseup', async () => {
    const info = getSelectionInfo();
    if (!info) {
      currentSelectionText = '';
      hideUI();
      return;
    }
    currentSelectionText = info.text;
    const cfgResp = await chrome.runtime.sendMessage({ type: 'GET_CONFIG' }).catch(() => null);
    enableFloating = cfgResp?.data?.ENABLE_FLOATING !== false;
    currentTargetLang = cfgResp?.data?.DEFAULT_TARGET_LANGUAGE || currentTargetLang;
    if (!enableFloating) return;
    ensureUI();
    // 更新语言按钮激活态
    smartHelperRoot.querySelectorAll('.sh-toggle').forEach(el => {
      const lang = el.getAttribute('data-lang');
      if (lang === currentTargetLang) el.classList.add('active');
      else el.classList.remove('active');
    });
    showUIAt(info.rect);
    setPanelStatus('提示：选中文本后点击“翻译”');
  });

  // 点击页面其他区域时，若选区清空则隐藏
  document.addEventListener('mousedown', (e) => {
    const path = e.composedPath();
    if (smartHelperRoot && !path.includes(smartHelperRoot)) {
      // 不立即隐藏，交给 mouseup 处理；避免选择过程中抖动
    }
  });
}

// 初始化：加载配置、绑定事件
(async function init() {
  try {
    const cfg = await chrome.runtime.sendMessage({ type: 'GET_CONFIG' });
    currentTargetLang = cfg?.data?.DEFAULT_TARGET_LANGUAGE || 'zh';
    enableFloating = cfg?.data?.ENABLE_FLOATING !== false;
  } catch {}
  bindSelectionEvents();
})();
