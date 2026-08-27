(function () {
  'use strict';

  // Sayfa içi ana window bağlamında çalışacak güvenli yapı
  window.extraSockets = window.extraSockets || [];

  // Vektör İşlemleri Sınıfı
  function Vector2(t, n) {
    this.x = t || 0;
    this.y = n || 0;
  }

  Vector2.prototype = {
    reset: function (t, n) { this.x = t; this.y = n; return this; },
    toString: function (t) {
      t = t || 3;
      var n = Math.pow(10, t);
      return "[" + Math.round(this.x * n) / n + ", " + Math.round(this.y * n) / n + "]";
    },
    clone: function () { return new Vector2(this.x, this.y); },
    copyTo: function (t) { t.x = this.x; t.y = this.y; },
    copyFrom: function (t) { this.x = t.x; this.y = t.y; },
    magnitude: function () { return Math.sqrt(this.x * this.x + this.y * this.y); },
    magnitudeSquared: function () { return this.x * this.x + this.y * this.y; },
    normalise: function () {
      var t = this.magnitude();
      if (t !== 0) { this.x /= t; this.y /= t; }
      return this;
    },
    reverse: function () { this.x = -this.x; this.y = -this.y; return this; },
    plusEq: function (t) { this.x += t.x; this.y += t.y; return this; },
    plusNew: function (t) { return new Vector2(this.x + t.x, this.y + t.y); },
    minusEq: function (t) { this.x -= t.x; this.y -= t.y; return this; },
    minusNew: function (t) { return new Vector2(this.x - t.x, this.y - t.y); },
    multiplyEq: function (t) { this.x *= t; this.y *= t; return this; },
    multiplyNew: function (t) { return this.clone().multiplyEq(t); },
    divideEq: function (t) { this.x /= t; this.y /= t; return this; },
    divideNew: function (t) { return this.clone().divideEq(t); },
    dot: function (t) { return this.x * t.x + this.y * t.y; },
    angle: function (t) {
      return Math.atan2(this.y, this.x) * (t ? 1 : Vector2Const.TO_DEGREES);
    },
    rotate: function (t, n) {
      var i = Math.cos(t * (n ? 1 : Vector2Const.TO_RADIANS));
      var s = Math.sin(t * (n ? 1 : Vector2Const.TO_RADIANS));
      Vector2Const.temp.copyFrom(this);
      this.x = Vector2Const.temp.x * i - Vector2Const.temp.y * s;
      this.y = Vector2Const.temp.x * s + Vector2Const.temp.y * i;
      return this;
    },
    equals: function (t) { return this.x === t.x && this.y === t.y; },
    isCloseTo: function (t, n) {
      return !!this.equals(t) || (Vector2Const.temp.copyFrom(this), Vector2Const.temp.minusEq(t), Vector2Const.temp.magnitudeSquared() < n * n);
    },
    rotateAroundPoint: function (t, n, i) {
      Vector2Const.temp.copyFrom(this); Vector2Const.temp.minusEq(t);
      Vector2Const.temp.rotate(n, i); Vector2Const.temp.plusEq(t);
      this.copyFrom(Vector2Const.temp);
    },
    isMagLessThan: function (t) { return this.magnitudeSquared() < t * t; },
    isMagGreaterThan: function (t) { return this.magnitudeSquared() > t * t; }
  };

  var Vector2Const = {
    TO_DEGREES: 180 / Math.PI,
    TO_RADIANS: Math.PI / 180,
    temp: new Vector2()
  };

  // Multibox / Broadcast Sistem Ayarları
  window.tabID = Math.random().toString(36).substring(2, 10);
  window.bc = new BroadcastChannel("agario_multibox_vision");
  window.ghostSessions = {};

  window.bc.onmessage = function (ev) {
    if (ev.data && ev.data.tabID) {
      window.ghostSessions[ev.data.tabID] = ev.data;
      window.ghostSessions[ev.data.tabID].lastUpdate = Date.now();
      for (var id in window.ghostSessions) {
        if (Date.now() - window.ghostSessions[id].lastUpdate > 5000) {
          delete window.ghostSessions[id];
        }
      }
    }
  };

  // Oyuncu Tercihlerini Otomatik Doldurma
  function applyLocalStorageSettings() {
    if (localStorage.gameMode) {
      var el = document.querySelector('#gamemode [value="' + localStorage.gameMode + '"]');
      if (el) el.selected = true;
    }
    if (localStorage.playerNick) {
      var nickEl = document.getElementById("nick");
      if (nickEl) nickEl.value = localStorage.playerNick;
    }
    if (localStorage.skin) {
      var skinEl = document.getElementById("defaultSkin");
      if (skinEl) skinEl.src = "https://agar.live/skins/" + localStorage.skin + ".png";
    }
  }

  // Tuş Dinleyicileri & Makro Sistemi
  var isFeeding = false;
  var feedInterval = null;

  function sendPacket(opCode) {
    if (window.ws && window.ws.readyState === WebSocket.OPEN) {
      var view = new DataView(new ArrayBuffer(1));
      view.setUint8(0, opCode);
      window.ws.send(view.buffer);
    }
  }

  window.addEventListener("keydown", function (e) {
    // E tuşu ile seri besleme (Makro)
    if (e.keyCode === 69 && !isFeeding && document.activeElement.tagName !== "INPUT") {
      isFeeding = true;
      sendPacket(21);
      feedInterval = setInterval(function () {
        sendPacket(21);
      }, 15);
    }
    // Space (Bölünme)
    if (e.keyCode === 32 && document.activeElement.tagName !== "INPUT") {
      sendPacket(17);
    }
    // 3 Tuşu (İsim Gizleme)
    if (e.keyCode === 51 && document.activeElement.tagName !== "INPUT") {
      window.hideNames = !window.hideNames;
    }
  });

  window.addEventListener("keyup", function (e) {
    if (e.keyCode === 69) {
      isFeeding = false;
      clearInterval(feedInterval);
      feedInterval = null;
    }
  });

  // WebSocket Dinleyicisi (Orijinal Bağlantıyı Yakalama)
  var OriginalWebSocket = window.WebSocket;
  window.WebSocket = function (url, protocols) {
    var wsInstance = new OriginalWebSocket(url, protocols);
    window.ws = wsInstance;
    console.log("WebSocket başarıyla yakalandı:", url);
    return wsInstance;
  };
  window.WebSocket.prototype = OriginalWebSocket.prototype;

  // DOM Yüklendiğinde Tetikleme
  if (document.readyState === "complete" || document.readyState === "interactive") {
    applyLocalStorageSettings();
  } else {
    window.addEventListener("DOMContentLoaded", applyLocalStorageSettings);
  }

  console.log("Agar.live Özel Mod Scripti Başarıyla Yüklendi.");
})();
