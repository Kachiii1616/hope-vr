/**
 * HOPE しごとタウン：デモ版の 保存先（スプレッドシート）
 *
 * - profiles シート：利用者ID ごとの くらし（名前・性別・あそびかた・家・お金・バッジ・家具）
 * - logs シート    ：体験の 記録（hope-work の TrialPhase と 同じ 項目 ＋ バッジ・おきゅうりょう）
 *
 * 画面（index.html）からは
 *   GET  ?action=load&id=…           → { ok, profile }（なければ profile: null）
 *   POST { action: 'saveProfile', id, profile }
 *   POST { action: 'addLog', id, name, entry }
 * POST は Content-Type: text/plain で 送る（ブラウザの 事前確認を 出さないため）。
 */
const SHEET_PROFILES = 'profiles';
const SHEET_LOGS = 'logs';
const PROFILE_HEADERS = ['id', 'name', 'gender', 'mode', 'home', 'money', 'badges', 'owned', 'snacks', 'updatedAt', 'profile_json'];
const LOG_HEADERS = ['savedAt', 'id', 'name', 'at', 'jobId', 'taskName', 'category', 'label', 'withSupport', 'supports',
  'durationSec', 'completed', 'inspected', 'defects', 'promptCount', 'questionCount', 'medal', 'pay'];
const ID_RE = /^[0-9A-Za-z_\-ぁ-んァ-ヶー一-龠]{1,32}$/;

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action === 'ping') return json_({ ok: true });
  if (p.action === 'load') {
    const id = String(p.id || '').trim();
    if (!ID_RE.test(id)) return json_({ ok: false, error: 'bad id' });
    return json_({ ok: true, profile: loadProfile_(id) });
  }
  return json_({ ok: false, error: 'unknown action' });
}

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: 'bad json' }); }
  const id = String(body.id || '').trim();
  if (!ID_RE.test(id)) return json_({ ok: false, error: 'bad id' });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    if (body.action === 'saveProfile') return json_(saveProfile_(id, body.profile || {}));
    if (body.action === 'addLog') return json_(addLog_(id, body.name || '', body.entry || {}));
    return json_({ ok: false, error: 'unknown action' });
  } finally {
    lock.releaseLock();
  }
}

/** はじめに 1 回 実行すると、2 つの シートを 作る */
function setup() {
  sheet_(SHEET_PROFILES, PROFILE_HEADERS);
  sheet_(SHEET_LOGS, LOG_HEADERS);
}

function loadProfile_(id) {
  const sh = sheet_(SHEET_PROFILES, PROFILE_HEADERS);
  const row = findRow_(sh, id);
  if (!row) return null;
  const json = sh.getRange(row, PROFILE_HEADERS.indexOf('profile_json') + 1).getValue();
  try { return JSON.parse(json); } catch (err) { return null; }
}

function saveProfile_(id, p) {
  const sh = sheet_(SHEET_PROFILES, PROFILE_HEADERS);
  const now = new Date();
  const values = [[
    id, p.name || '', p.gender || '', p.mode || '', p.home || '', Number(p.money) || 0,
    JSON.stringify(p.badges || {}), (p.owned || []).join(','), Number(p.snacks) || 0, now, JSON.stringify(p),
  ]];
  const row = findRow_(sh, id);
  if (row) sh.getRange(row, 1, 1, PROFILE_HEADERS.length).setValues(values);
  else sh.appendRow(values[0]);
  return { ok: true, savedAt: now.toISOString() };
}

function addLog_(id, name, entry) {
  const sh = sheet_(SHEET_LOGS, LOG_HEADERS);
  const ph = entry.phase || {};
  sh.appendRow([
    new Date(), id, name, entry.at || '', entry.jobId || '', entry.taskName || '', entry.category || '', ph.label || '',
    !!ph.withSupport, (ph.supports || []).join('・'), ph.durationSec || 0, ph.completed || 0, ph.inspected || 0,
    ph.defects || 0, ph.promptCount || 0, ph.questionCount || 0, entry.medal || '', entry.pay || 0,
  ]);
  return { ok: true };
}

function findRow_(sh, id) {
  const last = sh.getLastRow();
  if (last < 2) return 0;
  const ids = sh.getRange(2, 1, last - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) if (String(ids[i][0]) === id) return i + 2;
  return 0;
}

function sheet_(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.setFrozenRows(1);
  }
  return sh;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
