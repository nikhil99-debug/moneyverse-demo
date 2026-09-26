/* ============================================================
   MoneyVerse — shared client-side state (localStorage bridge)
   ------------------------------------------------------------
   One shared key: "moneyverse_demo_state". No backend, no build.
   Each playable module keeps its OWN progress store (e.g.
   "moneyverse_demo_captainInterest_progress"); this file mirrors the earned
   TOKENS + completed chapters from those stores into one shared
   object that the Nexus hub reads to light up each territory.

   Public API (window.MoneyVerseState):
     getState()                              -> full shared state
     saveState(state)                        -> persist a state object
     getCharacter(id)                        -> one character's record
     addTokens(character, amount)            -> add tokens (alias: addXP)
     completeChapter(character, id, reward)  -> mark a chapter done + reward
     syncCharacter(id, snapshot)             -> overwrite a character record
     mirrorFromProgress(id, progressObj)     -> mirror a module's own store
     refreshFromModules()                    -> pull every module store in
     totalTokens()                           -> sum across characters (alias: totalXP)
     resetDemo()                             -> wipe EVERYTHING to zero
   ============================================================ */
(function (global) {
  "use strict";

  var STATE_KEY = "moneyverse_demo_state";

  /* shared character id  ->  that module's own localStorage key */
  var CHARS = {
    moneta:  { progKey: "moneyverse_demo_moneta_progress" },
    weal:    { progKey: "moneyverse_demo_mrweal_progress" },
    captain: { progKey: "moneyverse_demo_captainInterest_progress" },
    recsus:  { progKey: "moneyverse_demo_recsus_progress" },
    vera:    { progKey: "moneyverse_demo_vera_progress" },
    inflare: { progKey: "moneyverse_demo_inflare_progress" }
  };

  /* ---- safe storage: never throw; fall back to in-memory ---- */
  var mem = {};
  function lsGet(k){ try { return global.localStorage.getItem(k); } catch (e) { return (k in mem) ? mem[k] : null; } }
  function lsSet(k, v){ try { global.localStorage.setItem(k, v); } catch (e) { mem[k] = String(v); } }
  function lsDel(k){ try { global.localStorage.removeItem(k); } catch (e) { delete mem[k]; } }

  function blankChar(){ return { tokens: 0, chaptersCompleted: [], streak: 0, lastPlayed: null }; }

  function blankState(){
    var s = { version: 1, characters: {} };
    Object.keys(CHARS).forEach(function (id) { s.characters[id] = blankChar(); });
    return s;
  }

  function uniqSortedNums(arr){
    var seen = {}, out = [];
    (arr || []).forEach(function (v) {
      v = Number(v);
      if (!isNaN(v) && !seen[v]) { seen[v] = 1; out.push(v); }
    });
    return out.sort(function (a, b) { return a - b; });
  }

  function getState(){
    var raw = lsGet(STATE_KEY), s;
    try { s = raw ? JSON.parse(raw) : blankState(); } catch (e) { s = blankState(); }
    if (!s || typeof s !== "object") s = blankState();
    if (!s.characters) s.characters = {};
    Object.keys(CHARS).forEach(function (id) {
      var c = s.characters[id] || blankChar();
      if (typeof c.tokens !== "number") c.tokens = 0;
      if (!Array.isArray(c.chaptersCompleted)) c.chaptersCompleted = [];
      if (typeof c.streak !== "number") c.streak = 0;
      if (c.lastPlayed === undefined) c.lastPlayed = null;
      s.characters[id] = c;
    });
    return s;
  }

  function saveState(s){ lsSet(STATE_KEY, JSON.stringify(s)); return s; }

  function getCharacter(id){ return getState().characters[id] || blankChar(); }

  /* ---- spec helpers ---- */
  function addTokens(character, amount){
    var s = getState(), c = s.characters[character];
    if (!c) return s;
    c.tokens += (amount || 0);
    c.lastPlayed = Date.now();
    return saveState(s);
  }

  function completeChapter(character, chapterId, tokenReward){
    var s = getState(), c = s.characters[character];
    if (!c) return s;
    chapterId = Number(chapterId);
    if (c.chaptersCompleted.indexOf(chapterId) === -1) {
      c.chaptersCompleted = uniqSortedNums(c.chaptersCompleted.concat([chapterId]));
      c.tokens += (tokenReward || 0);
    }
    c.lastPlayed = Date.now();
    return saveState(s);
  }

  /* ---- bridge used by the playable modules ---- */
  function syncCharacter(character, snap){
    var s = getState(), c = s.characters[character];
    if (!c) return s;
    if (snap) {
      if (typeof snap.tokens === "number") c.tokens = snap.tokens;
      if (Array.isArray(snap.chaptersCompleted)) c.chaptersCompleted = uniqSortedNums(snap.chaptersCompleted);
      if (typeof snap.streak === "number") c.streak = snap.streak;
      if (snap.lastPlayed !== undefined) c.lastPlayed = snap.lastPlayed;
    }
    return saveState(s);
  }

  /* derive tokens + completed chapters from a module's own `progress` object */
  function mirrorFromProgress(character, progress){
    if (!progress) return getState();
    var tokens = (typeof progress.totalXp === "number") ? progress.totalXp
               : (typeof progress.totalTokens === "number") ? progress.totalTokens : 0;
    var done = [];
    Object.keys(progress).forEach(function (k) {
      if (/^\d+$/.test(k) && progress[k] && progress[k].completedAt) done.push(Number(k));
    });
    return syncCharacter(character, {
      tokens: tokens,
      chaptersCompleted: done,
      lastPlayed: (done.length || tokens > 0) ? Date.now() : null
    });
  }

  /* pull the latest from every module's own progress store into shared state */
  function refreshFromModules(){
    Object.keys(CHARS).forEach(function (id) {
      var raw = lsGet(CHARS[id].progKey);
      if (!raw) return;
      try { mirrorFromProgress(id, JSON.parse(raw)); } catch (e) {}
    });
    return getState();
  }

  function totalTokens(){
    var s = getState(), t = 0;
    Object.keys(s.characters).forEach(function (id) { t += (s.characters[id].tokens || 0); });
    return t;
  }

  /* wipe shared state, every module's own progress, and all Nexus (verse_*) keys */
  function resetDemo(){
    var keys = [];
    try { for (var i = 0; i < global.localStorage.length; i++) keys.push(global.localStorage.key(i)); } catch (e) {}
    keys.forEach(function (k) {
      if (!k) return;
      if (k === STATE_KEY || /^verse_/.test(k) || /^moneyverse_/.test(k)) lsDel(k);
    });
    Object.keys(CHARS).forEach(function (id) { lsDel(CHARS[id].progKey); });
    saveState(blankState());
    return true;
  }

  /* If opened via file:// (double-click) instead of a local server, browsers
     don't reliably share localStorage across files (Safari blocks it outright),
     so progress can't sync. Warn loudly rather than fail silently. */
  try {
    if (global.location && global.location.protocol === "file:") {
      var showBanner = function () {
        if (!document.body || document.getElementById("mv-file-warning")) return;
        var bar = document.createElement("div");
        bar.id = "mv-file-warning";
        bar.textContent = "⚠ Run this through a local server (in this folder: python3 -m http.server, then open http://localhost:8000/nexus_hub_v2.html). Opened directly as a file, tokens and chapter progress can't be saved or shared.";
        bar.style.cssText = "position:fixed;left:0;right:0;top:0;z-index:2147483647;background:#b91c1c;color:#fff;font:600 13px/1.45 -apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;padding:11px 16px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,.45)";
        document.body.appendChild(bar);
      };
      if (document.readyState === "loading") global.addEventListener("DOMContentLoaded", showBanner);
      else showBanner();
    }
  } catch (e) {}


  /* ---- DEMO: pre-filled "few weeks in" state (Captain + Inflare only) ---- */
  function seedDemoIfEmpty(){
    try{
      if (lsGet("moneyverse_demo_seeded") === "1") return;
      var now = Date.now(), day = 86400000;
      lsSet("moneyverse_demo_captainInterest_progress", JSON.stringify({
        totalXp:620, totalCorrect:14, totalMax:6,
        "1":{status:"completed",score:90,xpEarned:210,completedAt:now-6*day},
        "2":{status:"completed",score:85,xpEarned:205,completedAt:now-3*day},
        "3":{status:"completed",score:88,xpEarned:205,completedAt:now-1*day},
        "4":{status:"unlocked",score:0,xpEarned:0,completedAt:null}
      }));
      lsSet("moneyverse_demo_inflare_progress", JSON.stringify({
        totalXp:480, totalCorrect:9, totalMax:5,
        "1":{status:"completed",score:92,xpEarned:250,completedAt:now-4*day},
        "2":{status:"completed",score:80,xpEarned:230,completedAt:now-1*day},
        "3":{status:"unlocked",score:0,xpEarned:0,completedAt:null}
      }));
      lsSet("moneyverse_demo_verse_balance", "100");
      // seeded "recent earnings" so the demo doesn't look empty on first load
      lsSet("moneyverse_demo_verse_transactions", JSON.stringify([
        {amount:210, reason:"Captain Interest · chapter", timestamp:now-6*day, multiplier:1},
        {amount:250, reason:"Inflare · chapter",          timestamp:now-4*day, multiplier:1},
        {amount:205, reason:"Captain Interest · chapter", timestamp:now-1*day, multiplier:1}
      ]));
      lsSet("moneyverse_demo_seeded", "1");
    }catch(e){}
  }

  global.MoneyVerseState = {
    STATE_KEY: STATE_KEY,
    characters: Object.keys(CHARS),
    getState: getState,
    saveState: saveState,
    getCharacter: getCharacter,
    addTokens: addTokens,
    addXP: addTokens,            /* spec alias — tokens are the earned currency */
    completeChapter: completeChapter,
    syncCharacter: syncCharacter,
    mirrorFromProgress: mirrorFromProgress,
    refreshFromModules: refreshFromModules,
    totalTokens: totalTokens,
    totalXP: totalTokens,        /* spec alias */
    resetDemo: resetDemo
  };
  seedDemoIfEmpty();
})(window);
