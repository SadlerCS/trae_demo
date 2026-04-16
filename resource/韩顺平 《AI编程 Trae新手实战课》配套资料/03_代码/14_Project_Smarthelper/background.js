// 背景脚本：负责加载配置、调用 Kimi 翻译 API、控制浏览器朗读（chrome.tts）

// 缓存配置，减少重复读取
let cachedConfig = null;

// 读取并合并配置：优先使用 options 中保存到 storage 的值，其次读取本地 config/config.json
async function loadConfig() {
  // 从 storage 读取用户配置
  const storageCfg = await chrome.storage.local.get([
    'KIMI_API_URL',
    'KIMI_API_KEY',
    'KIMI_MODEL',
    'DEFAULT_TARGET_LANGUAGE',
    'ENABLE_FLOATING',
    'TTS_RATE',
    'TTS_VOLUME',
    'TTS_VOICE'
  ]);

  // 读取本地配置文件（占位）
  let fileCfg = {};
  try {
    const url = chrome.runtime.getURL('config/config.json');
    const res = await fetch(url);
    if (res.ok) {
      fileCfg = await res.json();
    }
  } catch (e) {
    // 忽略文件读取错误，使用 storage 值即可
  }

  // 合并策略：storage 覆盖文件配置
  const merged = {
    KIMI_API_URL: storageCfg.KIMI_API_URL || fileCfg.KIMI_API_URL || '',
    KIMI_API_KEY: storageCfg.KIMI_API_KEY || fileCfg.KIMI_API_KEY || '',
    KIMI_MODEL: storageCfg.KIMI_MODEL || fileCfg.KIMI_MODEL || 'moonshot-v1-32k',
    DEFAULT_TARGET_LANGUAGE: storageCfg.DEFAULT_TARGET_LANGUAGE || fileCfg.DEFAULT_TARGET_LANGUAGE || 'zh',
    ENABLE_FLOATING: storageCfg.ENABLE_FLOATING ?? (fileCfg.ENABLE_FLOATING ?? true),
    TTS_RATE: storageCfg.TTS_RATE ?? (fileCfg.TTS_RATE ?? 1.0),
    TTS_VOLUME: storageCfg.TTS_VOLUME ?? (fileCfg.TTS_VOLUME ?? 1.0),
    TTS_VOICE: storageCfg.TTS_VOICE || fileCfg.TTS_VOICE || ''
  };

  cachedConfig = merged;
  return merged;
}

// 获取配置（带缓存）
async function getConfig() {
  if (cachedConfig) return cachedConfig;
  return await loadConfig();
}

// 翻译文本（调用 Kimi 的 Chat Completions 风格接口）
async function translateText(text, targetLang) {
  const cfg = await getConfig();
  const apiUrl = cfg.KIMI_API_URL;
  const apiKey = cfg.KIMI_API_KEY;
  const model = cfg.KIMI_MODEL || 'moonshot-v1-32k';

  if (!apiUrl || !apiKey) {
    throw new Error('MISSING_API');
  }

  // 构造提示词，确保只输出目标语言纯译文
  const systemPrompt = '你是专业的翻译助手，只输出目标语言的纯译文，不添加任何说明或标记。';
  const userPrompt = `目标语言：${targetLang === 'zh' ? '中文' : '英文'}\n待翻译文本：\n${text}`;

  const body = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0
  };

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`HTTP_${res.status}:${errText}`);
  }

  const data = await res.json();
  // 兼容 OpenAI/Moonshot 风格返回结构
  const content = data?.choices?.[0]?.message?.content || '';
  if (!content) throw new Error('EMPTY_RESPONSE');
  return content.trim();
}

// TTS 朗读控制
function getBestVoiceName(langTag, preferred) {
  return new Promise((resolve) => {
    if (preferred) return resolve(preferred);
    chrome.tts.getVoices((voices) => {
      let match = voices.find(v => v.lang === langTag && v.voiceName);
      if (!match && langTag.startsWith('zh')) {
        match = voices.find(v => (v.lang || '').startsWith('zh') && v.voiceName);
      }
      if (!match && langTag.startsWith('en')) {
        match = voices.find(v => (v.lang || '').startsWith('en') && v.voiceName);
      }
      resolve(match ? match.voiceName : '');
    });
  });
}

async function ttsSpeak(text, lang) {
  const cfg = await getConfig();
  const rate = Number(cfg.TTS_RATE) || 1.0;
  const volume = Number(cfg.TTS_VOLUME) || 1.0;
  const langTag = lang === 'zh' ? 'zh-CN' : 'en-US';
  const voiceName = await getBestVoiceName(langTag, cfg.TTS_VOICE || '');

  return new Promise((resolve, reject) => {
    chrome.tts.speak(text, {
      lang: langTag,
      rate,
      volume,
      voiceName,
      enqueue: false
    }, () => {
      const err = chrome.runtime.lastError;
      if (err) reject(err);
      else resolve(true);
    });
  });
}

function ttsPause() {
  chrome.tts.pause();
}

function ttsStop() {
  chrome.tts.stop();
}

// 处理来自 content script 与 options/popup 的消息
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === 'TRANSLATE') {
    const { text, targetLang } = msg.payload || {};
    (async () => {
      try {
        const translated = await translateText(text, targetLang);
        sendResponse({ ok: true, data: translated });
      } catch (e) {
        sendResponse({ ok: false, error: String(e?.message || e) });
      }
    })();
    return true; // 异步响应
  }

  if (msg?.type === 'TTS_SPEAK') {
    const { text, lang } = msg.payload || {};
    (async () => {
      try {
        await ttsSpeak(text, lang);
        sendResponse({ ok: true });
      } catch (e) {
        sendResponse({ ok: false, error: String(e?.message || e) });
      }
    })();
    return true;
  }

  if (msg?.type === 'TTS_PAUSE') {
    ttsPause();
    sendResponse({ ok: true });
    return false;
  }

  if (msg?.type === 'TTS_STOP') {
    ttsStop();
    sendResponse({ ok: true });
    return false;
  }

  if (msg?.type === 'GET_CONFIG') {
    (async () => {
      const cfg = await getConfig();
      sendResponse({ ok: true, data: cfg });
    })();
    return true;
  }

  if (msg?.type === 'TEST_AND_SAVE_CONFIG') {
    // options 页面：测试并保存配置
    const { KIMI_API_URL, KIMI_API_KEY, KIMI_MODEL } = msg.payload || {};
    (async () => {
      try {
        // 先保存，再用新值测试（避免读取缓存）
        await chrome.storage.local.set({ KIMI_API_URL, KIMI_API_KEY, KIMI_MODEL });
        cachedConfig = null; // 清缓存
        const cfg = await getConfig();
        await translateText('你好', 'en');
        sendResponse({ ok: true, data: cfg });
      } catch (e) {
        sendResponse({ ok: false, error: String(e?.message || e) });
      }
    })();
    return true;
  }

  if (msg?.type === 'SAVE_PREFERENCES') {
    const { DEFAULT_TARGET_LANGUAGE, ENABLE_FLOATING, TTS_RATE, TTS_VOLUME, TTS_VOICE } = msg.payload || {};
    (async () => {
      const toSave = {};
      if (DEFAULT_TARGET_LANGUAGE !== undefined) toSave.DEFAULT_TARGET_LANGUAGE = DEFAULT_TARGET_LANGUAGE;
      if (ENABLE_FLOATING !== undefined) toSave.ENABLE_FLOATING = ENABLE_FLOATING;
      if (TTS_RATE !== undefined) toSave.TTS_RATE = TTS_RATE;
      if (TTS_VOLUME !== undefined) toSave.TTS_VOLUME = TTS_VOLUME;
      if (TTS_VOICE !== undefined) toSave.TTS_VOICE = TTS_VOICE;
      await chrome.storage.local.set(toSave);
      cachedConfig = null;
      const cfg = await getConfig();
      sendResponse({ ok: true, data: cfg });
    })();
    return true;
  }

  return false;
});

// 安装时设置基础默认值
chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.local.get(['DEFAULT_TARGET_LANGUAGE', 'ENABLE_FLOATING']);
  if (existing.DEFAULT_TARGET_LANGUAGE == null) {
    await chrome.storage.local.set({ DEFAULT_TARGET_LANGUAGE: 'zh' });
  }
  if (existing.ENABLE_FLOATING == null) {
    await chrome.storage.local.set({ ENABLE_FLOATING: true });
  }
});
