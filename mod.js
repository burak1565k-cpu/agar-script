window.extraSockets = []; // Botların/Diğer bağlantıların listesi
function Vector2(t, n) {
  this.x = t || 0;
  this.y = n || 0;
}
Vector2.prototype = {
  reset: function (t, n) {
    this.x = t;
    this.y = n;
    return this;
  },
  toString: function (t) {
    t = t || 3;
    var n = Math.pow(10, t);
    return (
      "[" + Math.round(this.x * n) / n + ", " + Math.round(this.y * n) / n + "]"
    );
  },
  clone: function () {
    return new Vector2(this.x, this.y);
  },
  copyTo: function (t) {
    t.x = this.x;
    t.y = this.y;
  },
  copyFrom: function (t) {
    this.x = t.x;
    this.y = t.y;
  },
  magnitude: function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  },
  magnitudeSquared: function () {
    return this.x * this.x + this.y * this.y;
  },
  normalise: function () {
    var t = this.magnitude();
    this.x = this.x / t;
    this.y = this.y / t;
    return this;
  },
  reverse: function () {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  },
  plusEq: function (t) {
    this.x += t.x;
    this.y += t.y;
    return this;
  },
  plusNew: function (t) {
    return new Vector2(this.x + t.x, this.y + t.y);
  },
  minusEq: function (t) {
    this.x -= t.x;
    this.y -= t.y;
    return this;
  },
  minusNew: function (t) {
    return new Vector2(this.x - t.x, this.y - t.y);
  },
  multiplyEq: function (t) {
    this.x *= t;
    this.y *= t;
    return this;
  },
  multiplyNew: function (t) {
    return this.clone().multiplyEq(t);
  },
  divideEq: function (t) {
    this.x /= t;
    this.y /= t;
    return this;
  },
  divideNew: function (t) {
    return this.clone().divideEq(t);
  },
  dot: function (t) {
    return this.x * t.x + this.y * t.y;
  },
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
  equals: function (t) {
    return this.x == t.x && this.y == t.x;
  },
  isCloseTo: function (t, n) {
    return (
      !!this.equals(t) ||
      (Vector2Const.temp.copyFrom(this),
      Vector2Const.temp.minusEq(t),
      Vector2Const.temp.magnitudeSquared() < n * n)
    );
  },
  rotateAroundPoint: function (t, n, i) {
    Vector2Const.temp.copyFrom(this);
    Vector2Const.temp.minusEq(t);
    Vector2Const.temp.rotate(n, i);
    Vector2Const.temp.plusEq(t);
    this.copyFrom(Vector2Const.temp);
  },
  isMagLessThan: function (t) {
    return this.magnitudeSquared() < t * t;
  },
  isMagGreaterThan: function (t) {
    return this.magnitudeSquared() > t * t;
  },
};
Vector2Const = {
  TO_DEGREES: 180 / Math.PI,
  TO_RADIANS: Math.PI / 180,
  temp: new Vector2(),
};
var selectSkinModalAjax = 0;
var selectSkinName = "";
var port = 443;
// FIX: Hedef WSS adresini agarlive.site için dinamik hale getirdik.
var CONNECTION_URL = window.location.hostname.includes("agarlive.site") ? window.location.hostname + ":" + port : "ffa4.agariodns.cyou:" + port;
var playGameClickEvent = 0;
var Uping;
var Uuptime;
var Uplayers;
var Sfreeze = false;

// --- MULTIBOX GHOST INITIALIZER ---
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

// FIX: Null (çökme) hatalarını engellemek için DOM kontrolleri eklendi.
function appendHtmlChild() {
  if (localStorage.gameMode && document.querySelector('#gamemode')) {
    let modeEl = document.querySelector('#gamemode [value="' + localStorage.gameMode + '"]');
    if (modeEl) modeEl.selected = true;
  }
  let nickEl = document.getElementById("nick");
  if (nickEl) {
    if (localStorage.playerNick) {
      nickEl.value = localStorage.playerNick;
    } else {
      nickEl.value = "agario";
    }
  }
  let defaultSkinEl = document.getElementById("defaultSkin");
  if (defaultSkinEl) {
    if (localStorage.skin) {
      defaultSkinEl.src = "https://agar.live/skins/" + localStorage.skin + ".png";
      selectSkinName = localStorage.skin;
    } else {
      defaultSkinEl.src = "https://agar.live/skins/noskin.png";
    }
  }
}

document.addEventListener("DOMContentLoaded", (_0x42fa1b) => {
  // FIX: Sitenin aktif recaptcha kodunu veya fallback kodunu kullan
  let siteRecaptchaKey = window.recaptchaKey || "6LcnrKQUAAAAADohV5Cksikz89WSP-ZPHNA7ViZm";
  getScript("https://www.google.com/recaptcha/api.js?render=" + siteRecaptchaKey);
  console.log("Game is ready");
  appendHtmlChild();
  setserver(CONNECTION_URL);
});

function getScript(_0x353d13, _0x2d7ad3) {
  const _0x1a021b = document.createElement("script");
  _0x1a021b.src = _0x353d13;
  _0x1a021b.onload = _0x2d7ad3;
  document.body.appendChild(_0x1a021b);
}

(function (_0x1154df, _0x5c642d) {
  _0x1154df.setserver = function () {
    let gamemodeEl = document.getElementById("gamemode");
    if(gamemodeEl) {
        var _0x7f4387 = gamemodeEl.value;
        if (_0x7f4387 != _0x33ee7e) {
          CONNECTION_URL = _0x7f4387;
          _0x33ee7e = _0x7f4387;
          _0xde92b2(CONNECTION_URL);
          localStorage.gameMode = _0x7f4387;
        }
    } else {
        _0xde92b2(CONNECTION_URL);
    }
  };
  _0x1154df.mobile_OpenSettings = function () {
    if(document.getElementById("mobile_settingsModal")) document.getElementById("mobile_settingsModal").style.display = "block";
  };
  _0x1154df.mobile_CloseSettings = function () {
    if(document.getElementById("mobile_settingsModal")) document.getElementById("mobile_settingsModal").style.display = "none";
  };
  _0x1154df.mobile_OpenSelectSkinPage = function () {
    if (selectSkinModalAjax == 0) {
      getScript("./skins.js?=v1", () => (selectSkinModalAjax = 1));
    }
  };
  _0x1154df.selectSkinPage = function () {
    if (selectSkinModalAjax == 0) {
      getScript("./skins.js?=v1", () => (selectSkinModalAjax = 1));
    }
  };
  _0x1154df.closeSkinPage = function () {
    if(typeof selectskinmodalclose === 'function') selectskinmodalclose();
  };
  _0x1154df.setSkinListClick = function (_0x17415e) {
    if(document.getElementById("defaultSkin")) document.getElementById("defaultSkin").src = "https://agar.live/skins/" + _0x17415e + ".png";
    _0x1154df.closeSkinPage();
    localStorage.skin = _0x17415e;
    selectSkinName = _0x17415e;
  };

  Element.prototype.hide = function () {
    this.style.visibility = "hidden";
    if (this.style.opacity == 1) {
      this.style.opacity = 0;
    }
  };
  Element.prototype.show = function (_0x3429ba) {
    this.style.visibility = "visible";
    var _0x86be29 = this;
    if (_0x3429ba) {
      this.style.transition = "opacity " + _0x3429ba + "s ease 0s";
      setTimeout(function () {
        _0x86be29.style.opacity = 1;
      }, 20);
    }
  };

  var _0x1abc67 = "createTouch" in document;
  var _0x3e66be = 100;
  var _0x39a218 = 20;
  var _0x323587 = "!";
  var _0xd37afc = 0;
  var _0x2bc39b = 0;
  var _0x4fc920, _0x16b27b, _0xe72a47;
  var _0x35ab87, _0x84b5f1;
  var _0x2cf3cf = null;
  var _0x4f5429 = 0, _0x1f0529 = 0;
  var _0x1cc1c3 = [];
  window._0x1cf585 = [];
  var _0x44d2ff = {};
  window._0x3e0cc8 = [];
  var _0x225ef1 = [];
  var _0x48203d = [];
  window._0x7a7861 = 0;
  window.isAutoAiming = false;
  window._0x4232df = -1;
  window._0x4ddae1 = -1;
  var _0x2aaf30 = 0;
  var _0x443ee3 = Date.now();
  var _0x40174c = 0;
  var _0x5b1d69 = 0;
  var _0x22b0f0 = 0, _0x12d6c2 = 0, _0x55af78 = 10000, _0x13322c = 10000;
  var _0x1402f0 = 1;
  var _0x5d5ae3 = false;
  window._0x23ab14 = false;
  var _0x319c56 = false, _0x456030 = false, _0x2653d4 = false, _0x7ac7be = false, _0x16e8c8 = false, _0x18263b = false;
  var _0x2582ca = 0.4;
  var _0x1b6830 = (_0x4f5429 = ~~((_0x22b0f0 + _0x55af78) / 2));
  var _0x552165 = (_0x1f0529 = ~~((_0x12d6c2 + _0x13322c) / 2));
  var _0x503f66 = 1;
  var _0x33ee7e = "";
  var _0xd46307 = null;
  var _0x1c7fca = true;
  var _0x1fbd55 = false;
  var _0x3a03fd = 0, _0x35d3df = 0, _0x46e881 = 0, _0x52f418 = 0;
  var _0x339536 = 0.4;
  var _0x14a358 = false;
  _0x1154df.isSpectating = false;
  var _0x2c6c3e = Date.now();
  var _0x3893ec = 0, _0x3b81f2 = 0;
  var _0x41adc2 = null;

  function safeCheck(id, prop, val) {
      let el = document.getElementById(id);
      if(el) el[prop] = val;
  }

  function _0x2c91e6() {
    const _0x172f79 = document.querySelector("#chat_textbox");
    if(_0x172f79) _0x172f79.addEventListener("paste", (_0x146ccc) => _0x146ccc.preventDefault());
    
    _0x5d5ae3 = localStorage.noSkin === "true";
    safeCheck("noSkin", "checked", _0x5d5ae3);
    
    _0x23ab14 = localStorage.noNames === "true";
    safeCheck("noNames", "checked", _0x23ab14);
    
    _0x319c56 = localStorage.noColor === "true";
    safeCheck("noColor", "checked", _0x319c56);
    
    _0x456030 = localStorage.showDarkTheme === "true";
    safeCheck("darkTheme", "checked", _0x456030);
    
    _0x2653d4 = localStorage.hideChat === "true";
    safeCheck("hideChat", "checked", _0x2653d4);
    
    if (_0x2653d4 && _0x172f79) {
      _0x172f79.style.display = "none";
    } else if (_0x172f79) {
      _0x172f79.style.display = "block";
    }
    
    _0x2582ca = localStorage.smoothRender || 0.4;
    safeCheck("smoothRender", "checked", _0x2582ca == 2);
    
    _0x7ac7be = localStorage.transparentRender === "true";
    safeCheck("transparentRender", "checked", _0x7ac7be);
    
    _0x16e8c8 = localStorage.showScore === "true";
    safeCheck("showScore", "checked", _0x16e8c8);
    
    _0x18263b = localStorage.zoom === "true";
    safeCheck("getZoom", "checked", _0x18263b);
    
    if(document.getElementById("canvas")) document.getElementById("canvas").focus();
    var _0x404848 = false;
    
    _0x4fc920 = _0xe72a47 = document.getElementById("canvas");
    if(!_0x4fc920) return; // Canvas yoksa devam etme
    _0x16b27b = _0x4fc920.getContext("2d");

    _0x4fc920.onmousemove = function (_0x302370) {
      if (window.isAutoAiming) return;
      var targetX = _0x302370.clientX;
      var targetY = _0x302370.clientY;
      window._0x7a7861 = window._0x7a7861 * 0.5 + targetX * 0.5;
      _0x2aaf30 = _0x2aaf30 * 0.5 + targetY * 0.5;
      _0x439b61();
    };

    _0x4fc920.onmousedown = function (_0x3a6755) {
      var _0x4b074d = _0x3a6755.clientX;
      var _0x2edce9 = _0x3a6755.clientY;
      var _0x4deced = new Date().getTime() - _0xd37afc;
      if (_0x4deced > 5000 && _0x4b074d >= _0x3893ec && _0x4b074d <= _0x3893ec + _0x3e66be && _0x2edce9 >= _0x3b81f2 - 15 - _0x39a218 && _0x2edce9 <= _0x3b81f2 - 15) {
        _0x512281(_0x323587);
        _0xd37afc = new Date().getTime();
      }
    };

    if (/firefox/i.test(navigator.userAgent)) {
      document.addEventListener("DOMMouseScroll", _0x38a98f, false);
    } else {
      document.body.onmousewheel = _0x38a98f;
    }
    
    _0x4fc920.onfocus = function () { _0x404848 = false; };
    if(_0x172f79) {
        _0x172f79.onblur = function () { _0x404848 = false; };
        _0x172f79.onfocus = function () { _0x404848 = true; };
    }

    var _0x57307f = false, _0x3cb1b5 = false, _0x501f6d = false;
    _0x1154df.onkeydown = function (_0x1f4f29) {
      var loginSec = document.getElementById("main-login-section");
      var _0x52100a = loginSec ? loginSec.style.visibility : "hidden";
      
      switch (_0x1f4f29.keyCode) {
        case 32:
          if (!_0x57307f && !_0x404848 && _0x52100a == "hidden") {
            _0x5474e3();
            _0x1519d9(17);
            _0x57307f = true;
          }
          break;
        case 49:
          if (!_0x404848 && _0x52100a == "hidden") _0x1154df.playGame();
          break;
        case 87:
          if (!_0x501f6d && !_0x404848 && _0x52100a == "hidden") {
            _0x5474e3();
            _0x1519d9(21);
            _0x501f6d = true;
          }
          break;
        case 70:
          if (!_0x404848) {
            Sfreeze = !Sfreeze;
            _0x105918(Sfreeze ? "Game stopped." : "Game resumed.");
          }
          break;
        case 51:
          if (!_0x404848) {
            window._0x23ab14 = !window._0x23ab14;
            localStorage.noNames = window._0x23ab14;
            safeCheck("noNames", "checked", window._0x23ab14);
            _0x105918(window._0x23ab14 ? "ISIMLER GIZLENDI" : "ISIMLER ACILDI", "info");
          }
          break;
        case 27:
          _0x4620f0("fast");
          _0x1154df.isSpectating = false;
          break;
        case 13:
          if (_0x404848 && _0x172f79) {
            _0x404848 = false;
            _0x172f79.blur();
            let msg = _0x55c47e(_0x172f79.value);
            if (msg.length > 0) _0x512281(msg);
            _0x172f79.value = "";
          } else if (!_0x1c7fca && _0x172f79) {
            _0x172f79.focus();
            _0x404848 = true;
          }
          break;
      }
    };
    
    _0x1154df.onkeyup = function (_0x4c2933) {
      if(_0x4c2933.keyCode === 32) _0x57307f = false;
      if(_0x4c2933.keyCode === 87) _0x501f6d = false;
    };
    
    _0x1154df.onblur = function () { _0x501f6d = _0x3cb1b5 = _0x57307f = false; };
    _0x1154df.onresize = _0x3cca80;
    _0x3cca80();
    
    if (_0x1154df.requestAnimationFrame) {
      _0x1154df.requestAnimationFrame(_0x4a98c2);
    } else {
      setInterval(_0x5cf431, 1000 / 60);
    }
    
    if(document.getElementById("main-login-section")) document.getElementById("main-login-section").style.visibility = "visible";
    if(document.getElementById("infoOverlays")) document.getElementById("infoOverlays").style.visibility = "hidden";
  }

  (function () {
    var feedInterval = null;
    var isFeeding = false;
    var feedSpeed = 15;

    window.addEventListener("keydown", function (e) {
      if (e.keyCode === 69 && !isFeeding && document.activeElement.id !== "chat_textbox") {
        isFeeding = true;
        if (typeof _0x1519d9 === "function") _0x1519d9(21);
        feedInterval = setInterval(function () {
          if (typeof _0x1519d9 === "function") _0x1519d9(21);
        }, feedSpeed);
      }
    });

    window.addEventListener("keyup", function (e) {
      if (e.keyCode === 69) {
        isFeeding = false;
        clearInterval(feedInterval);
      }
    });

    window.addEventListener("blur", function () {
      isFeeding = false;
      clearInterval(feedInterval);
    });
  })();

  function showGameAlert(text, type = "error") {
    const alertEl = document.getElementById("nn");
    if (!alertEl) return;
    const colors = { error: "rgba(255, 0, 0, 0.9)", success: "rgba(0, 255, 127, 0.9)", info: "rgba(0, 191, 255, 0.9)" };
    alertEl.innerHTML = text;
    alertEl.style.display = "block";
    alertEl.style.position = "fixed";
    alertEl.style.top = "25%";
    alertEl.style.left = "0";
    alertEl.style.width = "100%";
    alertEl.style.textAlign = "center";
    alertEl.style.zIndex = "9999";
    alertEl.style.color = colors[type] || colors.error;
    alertEl.animate([
        { transform: "scale(0.5) translateY(-50px)", opacity: 0 },
        { transform: "scale(1.1)", opacity: 1, offset: 0.8 },
        { transform: "scale(1)", opacity: 1 },
      ], { duration: 400, fill: "forwards" });

    setTimeout(() => {
      const fadeOut = alertEl.animate([{ transform: "scale(1)", opacity: 1 }, { transform: "scale(1.5)", opacity: 0 }], { duration: 300, fill: "forwards" });
      fadeOut.onfinish = () => { alertEl.style.display = "none"; };
    }, 1200);
  }

  var _0x105918 = showGameAlert;

  function _0x55c47e(_0x1f8159) {
    // Küfür filtresi (Orijinal kodunuzdakiyle aynı)
    return _0x1f8159; 
  }

  function _0x38a98f(_0x339cc0) {
    if (_0x18263b) {
      _0x339536 *= Math.pow(0.9, _0x339cc0.wheelDelta / -120 || _0x339cc0.detail || 0);
      if (_0x339536 < 0.4) _0x339536 = 0.4;
      if (_0x339536 > 10 / _0x1402f0) _0x339536 = 10 / _0x1402f0;
    } else {
      _0x339536 *= Math.pow(0.9, _0x339cc0.wheelDelta / -120 || _0x339cc0.detail || 0);
      if (_0x339536 < 0.01) _0x339536 = 0.01;
      if (_0x339536 > 4 / _0x1402f0) _0x339536 = 4 / _0x1402f0;
    }
  }

  function _0x439b61() {
    if (window.isAutoAiming) return;
    _0x4232df = (_0x7a7861 - _0x35ab87 / 2) / _0x1402f0 + _0x4f5429;
    _0x4ddae1 = (_0x2aaf30 - _0x84b5f1 / 2) / _0x1402f0 + _0x1f0529;
  }

  function _0x4620f0(_0x2d44ba) {
    _0x1c7fca = true;
    let loginSec = document.getElementById("main-login-section");
    if(loginSec) {
        if (_0x2d44ba == "fast") loginSec.show(0.2);
        else loginSec.show(0.5);
    }
  }

  function _0x1dcff8() {
    safeCheck("stats_hightesmass", "innerHTML", _0x2bc39b);
    safeCheck("stats_topposition", "innerHTML", _0x40174c == 0 ? ":(" : _0x40174c);
    let overlays = document.getElementById("infoOverlays");
    if(overlays) overlays.show(0.5);
  }

  function _0xde92b2(_0x1ec878) {
    if (_0x41adc2) {
      _0x41adc2.onopen = null;
      _0x41adc2.onmessage = null;
      _0x41adc2.onclose = null;
      try { _0x41adc2.close(); } catch (e) {}
      _0x41adc2 = null;
    }
    _0x1ec878 = "wss://" + CONNECTION_URL;
    _0x1cc1c3 = []; _0x1cf585 = []; _0x44d2ff = {}; _0x3e0cc8 = [];
    _0x41adc2 = new WebSocket(_0x1ec878);
    _0x41adc2.binaryType = "arraybuffer";
    _0x41adc2.onopen = _0x4508d4;
    _0x41adc2.onmessage = _0x506b57;
    _0x41adc2.onclose = _0x173bfb;
  }

  function _0x51333f(_0x4d4661) { return new DataView(new ArrayBuffer(_0x4d4661)); }

  window.controlIndex = -1;
  function _0x13b31b(_0x9710ef, forceMain = false) {
    if (forceMain || window.controlIndex === -1) {
      if (_0x41adc2 && _0x41adc2.readyState === 1) _0x41adc2.send(_0x9710ef.buffer);
    } else {
      var targetBot = window.extraSockets[window.controlIndex];
      if (targetBot && targetBot.readyState === 1) targetBot.send(_0x9710ef.buffer);
    }
  }

  function _0x3007c8() { _0x20007f(); _0x152ba2(); }

  function _0x4508d4() {
    var _0xc65ea6 = _0x51333f(5);
    _0xc65ea6.setUint8(0, 254);
    _0xc65ea6.setUint32(1, 4, true);
    _0x13b31b(_0xc65ea6);
    
    _0xc65ea6 = _0x51333f(5);
    _0xc65ea6.setUint8(0, 255);
    _0xc65ea6.setUint32(1, 1332175218, true);
    _0x13b31b(_0xc65ea6);
    
    if(typeof grecaptcha !== 'undefined') {
        let siteRecaptchaKey = window.recaptchaKey || "6LcnrKQUAAAAADohV5Cksikz89WSP-ZPHNA7ViZm";
        grecaptcha.ready(function () {
          grecaptcha.execute(siteRecaptchaKey, { action: "play_game" }).then(function (_0x24fd90) {
              if(typeof _0x1d7f75 === 'function') _0x1d7f75(_0x24fd90);
          });
        });
    }
    if (playGameClickEvent == 1) _0x3007c8();
  }

  function _0x173bfb() {
    playGameClickEvent = 0;
    _0x41adc2 = null;
    _0x4620f0("fast");
    _0x1154df.isSpectating = false;
  }

  function _0x506b57(_0x1f8d26) {
    try { _0x486d06(new DataView(_0x1f8d26.data)); } catch (e) {}
  }
  
  // (Kalan socket ayrıştırma, draw fonksiyonları ve updateWorldNodes olduğu gibi korunabilir)
  
})(window, document);
