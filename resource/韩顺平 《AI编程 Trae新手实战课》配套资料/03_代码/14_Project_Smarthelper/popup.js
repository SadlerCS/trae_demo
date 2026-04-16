// Popup：快速开关与状态查看

async function refresh() {
  const resp = await chrome.runtime.sendMessage({ type: 'GET_CONFIG' });
  const cfg = resp?.data || {};
  const enableFloating = cfg.ENABLE_FLOATING !== false;
  document.getElementById('enableFloating').checked = enableFloating;
  const lang = cfg.DEFAULT_TARGET_LANGUAGE || 'zh';
  document.getElementById('langZh').classList.toggle('active', lang === 'zh');
  document.getElementById('langEn').classList.toggle('active', lang === 'en');
  const apiOk = Boolean(cfg.KIMI_API_URL) && Boolean(cfg.KIMI_API_KEY);
  document.getElementById('apiStatus').textContent = `Kimi API：${apiOk ? '已配置' : '未配置'}`;
}

document.getElementById('enableFloating').addEventListener('change', async (e) => {
  await chrome.runtime.sendMessage({ type: 'SAVE_PREFERENCES', payload: { ENABLE_FLOATING: e.target.checked } });
});

document.getElementById('langZh').addEventListener('click', async () => {
  const resp = await chrome.runtime.sendMessage({ type: 'SAVE_PREFERENCES', payload: { DEFAULT_TARGET_LANGUAGE: 'zh' } });
  if (resp?.ok) {
    document.getElementById('langZh').classList.add('active');
    document.getElementById('langEn').classList.remove('active');
  }
});

document.getElementById('langEn').addEventListener('click', async () => {
  const resp = await chrome.runtime.sendMessage({ type: 'SAVE_PREFERENCES', payload: { DEFAULT_TARGET_LANGUAGE: 'en' } });
  if (resp?.ok) {
    document.getElementById('langEn').classList.add('active');
    document.getElementById('langZh').classList.remove('active');
  }
});

document.getElementById('openOptions').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

document.getElementById('openHelp').addEventListener('click', () => {
  // 打开一个简单的帮助页，可后续替换为文档链接
  chrome.tabs.create({ url: 'https://support.google.com/chrome_webstore/answer/2664769?hl=zh-Hans' });
});

document.getElementById('openFeedback').addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://forms.gle/' }); // 站位链接
});

refresh();
