// 设置页逻辑：保存与测试 Kimi API，保存朗读与行为偏好

async function loadInitial() {
  const resp = await chrome.runtime.sendMessage({ type: 'GET_CONFIG' });
  const cfg = resp?.data || {};
  document.getElementById('apiUrl').value = cfg.KIMI_API_URL || '';
  document.getElementById('apiKey').value = cfg.KIMI_API_KEY || '';
  document.getElementById('apiModel').value = cfg.KIMI_MODEL || '';
  document.getElementById('defaultLang').value = cfg.DEFAULT_TARGET_LANGUAGE || 'zh';
  document.getElementById('enableFloating').checked = cfg.ENABLE_FLOATING !== false;
  document.getElementById('ttsVoice').value = cfg.TTS_VOICE || '';
  document.getElementById('ttsRate').value = cfg.TTS_RATE ?? 1.0;
  document.getElementById('ttsVolume').value = cfg.TTS_VOLUME ?? 1.0;
}

document.getElementById('testSave').addEventListener('click', async () => {
  const KIMI_API_URL = document.getElementById('apiUrl').value.trim();
  const KIMI_API_KEY = document.getElementById('apiKey').value.trim();
  const KIMI_MODEL = document.getElementById('apiModel').value.trim();
  const statusEl = document.getElementById('saveStatus');
  statusEl.textContent = '测试中…';
  const resp = await chrome.runtime.sendMessage({ type: 'TEST_AND_SAVE_CONFIG', payload: { KIMI_API_URL, KIMI_API_KEY, KIMI_MODEL } });
  if (resp?.ok) {
    statusEl.textContent = '测试成功，已保存';
  } else {
    statusEl.textContent = '测试失败，请检查 Key 或 URL';
  }
});

document.getElementById('savePrefs').addEventListener('click', async () => {
  const DEFAULT_TARGET_LANGUAGE = document.getElementById('defaultLang').value;
  const ENABLE_FLOATING = document.getElementById('enableFloating').checked;
  const TTS_VOICE = document.getElementById('ttsVoice').value.trim();
  const TTS_RATE = parseFloat(document.getElementById('ttsRate').value);
  const TTS_VOLUME = parseFloat(document.getElementById('ttsVolume').value);
  const statusEl = document.getElementById('prefsStatus');
  statusEl.textContent = '保存中…';
  const resp = await chrome.runtime.sendMessage({ type: 'SAVE_PREFERENCES', payload: { DEFAULT_TARGET_LANGUAGE, ENABLE_FLOATING, TTS_VOICE, TTS_RATE, TTS_VOLUME } });
  statusEl.textContent = resp?.ok ? '已保存' : '保存失败，请重试';
});

loadInitial();

