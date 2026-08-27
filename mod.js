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
    if (t !== 0) {
      this.x = this.x / t;
      this.y = this.y / t;
    }
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
    return this.x === t.x && this.y === t.y;
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

// --- EKSİK YARDIMCI FONKSİYONLAR VE SINIFLAR ---
function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

var _0x2c6038 = {
  init: function (bounds) {
    return {
      bounds: bounds,
      points: [],
      insert: function (p) {
        this.points.push(p);
      },
    };
  },
};

function _0x2b0fa0(id, x, y, size, color, name) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.ox = x;
  this.oy = y;
  this.nx = x;
  this.ny = y;
  this.size = size;
  this.oSize = size;
  this.nSize = size;
  this.color = color || "#FFFFFF";
  this.name = name || "";
  this.points = [{ x: x, y: y }];
  this.destroyed = false;
  this.updateTime = Date.now();
}
_0x2b0fa0.prototype = {
  destroy: function () {
    this.destroyed = true;
  },
  shouldRender: function () {
    return !this.destroyed;
  },
  updatePos: function () {
    var dt = (Date.now() - this.updateTime) / 120;
    dt = Math.max(0, Math.min(1, dt));
    this.x = this.ox + (this.nx - this.ox) * dt;
    this.y = this.oy + (this.ny - this.oy) * dt;
    this.size = this.oSize + (this.nSize - this.oSize) * dt;
    this.points = [{ x: this.x, y: this.y }];
  },
  setName: function (name) {
    this.name = name;
  },
  drawOneCell: function (ctx) {
    if (this.destroyed) return;
    this.updatePos();
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    if (this.name && !window._0x23ab14) {
      ctx.fillStyle = "#FFFFFF";
      ctx.font = Math.max(~~(this.size * 0.3), 12) + "px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      var cleanName =
        this.name.indexOf("}") !== -1 ? this.name.split("}").pop() : this.name;
      ctx.fillText(cleanName, this.x, this.y);
    }
    ctx.restore();
  },
};

var selectSkinModalAjax = 0;
var selectSkinName = "";
var port = 443;
var CONNECTION_URL = "ffa4.agariodns.cyou:" + port;
var playGameClickEvent = 0;
var Uping = 0;
var Uuptime = 0;
var Uplayers = 0;
var Sfreeze = false;
var latency = Date.now();

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

function appendHtmlChild() {
  if (localStorage.gameMode) {
    var gmEl = document.querySelector(
      '#gamemode [value="' + localStorage.gameMode + '"]'
    );
    if (gmEl) gmEl.selected = true;
  }
  var nickEl = document.getElementById("nick");
  if (nickEl) {
    nickEl.value = localStorage.playerNick || "agario";
  }
  var skinEl = document.getElementById("defaultSkin");
  if (skinEl) {
    if (localStorage.skin) {
      skinEl.src = "https://agar.live/skins/" + localStorage.skin + ".png";
      selectSkinName = localStorage.skin;
    } else {
      skinEl.src = "https://agar.live/skins/noskin.png";
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  getScript(
    "https://www.google.com/recaptcha/api.js?render=6LcnrKQUAAAAADohV5Cksikz89WSP-ZPHNA7ViZm"
  );
  console.log("Game is ready");
  appendHtmlChild();
  setserver(CONNECTION_URL);
});

function getScript(src, callback) {
  const script = document.createElement("script");
  script.src = src;
  script.onload = callback;
  document.body.appendChild(script);
}

(function (_0x1154df, _0x5c642d) {
  _0x1154df.setserver = function () {
    var gm = document.getElementById("gamemode");
    if (!gm) return;
    var _0x7f4387 = gm.value;
    if (_0x7f4387 != _0x33ee7e) {
      CONNECTION_URL = _0x7f4387;
      _0x33ee7e = _0x7f4387;
      _0xde92b2(CONNECTION_URL);
      localStorage.gameMode = _0x7f4387;
    }
  };
  _0x1154df.mobile_OpenSettings = function () {
    var m = document.getElementById("mobile_settingsModal");
    if (m) m.style.display = "block";
  };
  _0x1154df.mobile_CloseSettings = function () {
    var m = document.getElementById("mobile_settingsModal");
    if (m) m.style.display = "none";
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
    if (typeof selectskinmodalclose === "function") selectskinmodalclose();
  };
  _0x1154df.setSkinListClick = function (_0x17415e) {
    var s = document.getElementById("defaultSkin");
    if (s) s.src = "https://agar.live/skins/" + _0x17415e + ".png";
    if (typeof closeSkinPage === "function") closeSkinPage();
    localStorage.skin = _0x17415e;
    selectSkinName = _0x17415e;
    console.log(_0x17415e + " 'skin update'");
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
  var _0xe72a47;
  var _0x16b27b;
  var _0x4fc920;
  var _0x1afb5a;
  var _0x4e0f0e;
  var _0x35ab87;
  var _0x84b5f1;
  var _0x2cf3cf = null;
  var _0x41adc2 = null;
  var _0x4f5429 = 0;
  var _0x1f0529 = 0;
  var _0x1cc1c3 = [];
  window._0x1cf585 = [];
  var _0x44d2ff = {};
  window._0x3e0cc8 = [];
  var _0x551ae1 = [];
  var _0x225ef1 = [];
  var _0x573162 = "RESTART";
  var _0x48203d = [];
  window._0x7a7861 = 0;
  window.isAutoAiming = false;
  window._0x4232df = -1;
  window._0x4ddae1 = -1;
  var _0x2aaf30 = 0;
  var _0xe1267f = 0;
  var _0x443ee3 = Date.now();
  var _0x40174c = 0;
  var _0x5b1d69 = 0;
  var _0x22b0f0 = 0;
  var _0x12d6c2 = 0;
  var _0x55af78 = 10000;
  var _0x13322c = 10000;
  var _0x1402f0 = 1;
  var _0x5d5ae3 = false;
  window._0x23ab14 = false;
  var _0x319c56 = false;
  var _0x171ae9 = false;
  var _0x4fea95 = 0;
  var _0x2bc39b = 0;
  var _0x456030 = false;
  var _0x2582ca = 0.4;
  var _0x7ac7be = false;
  var _0x2653d4 = false;
  var _0x18263b = false;
  var _0x1b6830 = (_0x4f5429 = ~~((_0x22b0f0 + _0x55af78) / 2));
  var _0x552165 = (_0x1f0529 = ~~((_0x12d6c2 + _0x13322c) / 2));
  var _0x503f66 = 1;
  var _0x33ee7e = "";
  var _0xd46307 = null;
  var _0x1c7fca = true;
  var _0x1fbd55 = false;
  var _0x3a03fd = 0;
  var _0x35d3df = 0;
  var _0x46e881 = 0;
  var _0x52f418 = 0;
  var _0x339536 = 0.4;
  var _0x5668bb = 0;
  var _0x12d92b = 0;
  var _0xdce442 = 1;
  _0x1154df.isSpectating = false;
  var _0x2c6c3e = Date.now();
  var _0x3893ec = 0;
  var _0x3b81f2 = 0;

  function _0x2c91e6() {
    const chatInput = document.querySelector("#chat_textbox");
    if (chatInput) {
      chatInput.addEventListener("paste", (e) => e.preventDefault());
    }

    _0x5d5ae3 = localStorage.noSkin === "true";
    var ns = document.getElementById("noSkin");
    if (ns) ns.checked = _0x5d5ae3;

    _0x23ab14 = localStorage.noNames === "true";
    var nn = document.getElementById("noNames");
    if (nn) nn.checked = _0x23ab14;

    _0x319c56 = localStorage.noColor === "true";
    var nc = document.getElementById("noColor");
    if (nc) nc.checked = _0x319c56;

    _0x456030 = localStorage.showDarkTheme === "true";
    var dt = document.getElementById("darkTheme");
    if (dt) dt.checked = _0x456030;

    _0x2653d4 = localStorage.hideChat === "true";
    var hc = document.getElementById("hideChat");
    if (hc) hc.checked = _0x2653d4;
    if (chatInput) {
      chatInput.style.display = _0x2653d4 ? "none" : "block";
    }

    _0x2582ca = localStorage.smoothRender || 0.4;
    var sr = document.getElementById("smoothRender");
    if (sr) sr.checked = _0x2582ca == 2;

    _0x7ac7be = localStorage.transparentRender === "true";
    var tr = document.getElementById("transparentRender");
    if (tr) tr.checked = _0x7ac7be;

    _0x18263b = localStorage.zoom === "true";
    var gz = document.getElementById("getZoom");
    if (gz) gz.checked = _0x18263b;

    var cvs = document.getElementById("canvas");
    if (cvs) cvs.focus();

    var _0x404848 = false;
    _0x4fc920 = _0xe72a47 = document.getElementById("canvas");
    if (_0x4fc920) {
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
        if (
          _0x4deced > 5000 &&
          _0x4b074d >= _0x3893ec &&
          _0x4b074d <= _0x3893ec + _0x3e66be &&
          _0x2edce9 >= _0x3b81f2 - 15 - _0x39a218 &&
          _0x2edce9 <= _0x3b81f2 - 15
        ) {
          _0x512281(_0x323587);
          _0xd37afc = new Date().getTime();
        }
      };
      if (_0x1abc67) {
        _0x4fc920.addEventListener("touchstart", _0x549cd7, false);
        _0x4fc920.addEventListener("touchmove", _0x59057e, false);
        _0x4fc920.addEventListener("touchend", _0x316e0b, false);
      }
      _0x4fc920.onfocus = function () {
        _0x404848 = false;
      };
    }

    if (/firefox/i.test(navigator.userAgent)) {
      document.addEventListener("DOMMouseScroll", _0x38a98f, false);
    } else {
      document.body.onmousewheel = _0x38a98f;
    }

    if (chatInput) {
      chatInput.onblur = function () {
        _0x404848 = false;
      };
      chatInput.onfocus = function () {
        _0x404848 = true;
      };
    }

    var _0x57307f = false;
    var _0x3cb1b5 = false;
    var _0x501f6d = false;

    _0x1154df.onkeydown = function (_0x1f4f29) {
      var loginSec = document.getElementById("main-login-section");
      var _0x52100a = loginSec ? loginSec.style.visibility : "visible";
      switch (_0x1f4f29.keyCode) {
        case 32:
          if (!_0x57307f && !_0x404848 && _0x52100a == "hidden") {
            _0x5474e3();
            _0x1519d9(17);
            _0x57307f = true;
          }
          break;
        case 49:
          if (!_0x404848 && _0x52100a == "hidden") {
            if (typeof _0x1154df.playGame === "function") _0x1154df.playGame();
          }
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
            var el = document.getElementById("noNames");
            if (el) el.checked = window._0x23ab14;
            _0x105918(
              window._0x23ab14 ? "ISIMLER GIZLENDI" : "ISIMLER ACILDI",
              "info"
            );
          }
          break;
        case 67:
          if (!_0x404848) {
            _0x512281("psx2psx2");
          }
          break;
        case 27:
          _0x4620f0("fast");
          _0x1154df.isSpectating = false;
          break;
        case 13:
          if (_0x404848) {
            _0x404848 = false;
            if (chatInput) {
              chatInput.blur();
              var msg = _0x55c47e(chatInput.value);
              if (msg.length > 0) _0x512281(msg);
              chatInput.value = "";
            }
          } else if (!_0x1c7fca) {
            if (chatInput) chatInput.focus();
            _0x404848 = true;
          }
          break;
      }
    };

    _0x1154df.onkeyup = function (_0x4c2933) {
      switch (_0x4c2933.keyCode) {
        case 32:
          _0x57307f = false;
          break;
        case 87:
          _0x501f6d = false;
          break;
        case 81:
          if (_0x3cb1b5) {
            _0x1519d9(19);
            _0x3cb1b5 = false;
          }
          break;
      }
    };
    _0x1154df.onblur = function () {
      _0x501f6d = _0x3cb1b5 = _0x57307f = false;
    };
    _0x1154df.onresize = _0x3cca80;
    _0x3cca80();

    if (_0x1154df.requestAnimationFrame) {
      _0x1154df.requestAnimationFrame(_0x4a98c2);
    } else {
      setInterval(_0x5cf431, 1000 / 60);
    }

    var loginSec = document.getElementById("main-login-section");
    if (loginSec) loginSec.style.visibility = "visible";
    var infoOv = document.getElementById("infoOverlays");
    if (infoOv) infoOv.style.visibility = "hidden";
  }

  (function () {
    var feedInterval = null;
    var isFeeding = false;
    var feedSpeed = 15;

    window.addEventListener("keydown", function (e) {
      if (
        e.keyCode === 69 &&
        !isFeeding &&
        document.activeElement.id !== "chat_textbox"
      ) {
        isFeeding = true;
        if (typeof _0x1519d9 === "function") _0x1519d9(21);
        feedInterval = setInterval(function () {
          if (typeof _0x1519d9 === "function") {
            _0x1519d9(21);
          }
        }, feedSpeed);
      }
    });

    window.addEventListener("keyup", function (e) {
      if (e.keyCode === 69) {
        isFeeding = false;
        clearInterval(feedInterval);
        feedInterval = null;
      }
    });

    window.addEventListener("blur", function () {
      isFeeding = false;
      clearInterval(feedInterval);
      feedInterval = null;
    });
  })();

  function showGameAlert(text, type = "error") {
    const alertEl = document.getElementById("nn");
    if (!alertEl) return;

    const colors = {
      error: "rgba(255, 0, 0, 0.9)",
      success: "rgba(0, 255, 127, 0.9)",
      info: "rgba(0, 191, 255, 0.9)",
    };

    alertEl.innerHTML = text;
    alertEl.style.display = "block";
    alertEl.style.position = "fixed";
    alertEl.style.top = "25%";
    alertEl.style.left = "0";
    alertEl.style.width = "100%";
    alertEl.style.textAlign = "center";
    alertEl.style.zIndex = "9999";
    alertEl.style.fontFamily = "'Ubuntu', 'Poppins', sans-serif";
    alertEl.style.fontWeight = "800";
    alertEl.style.textTransform = "uppercase";
    alertEl.style.letterSpacing = "5px";
    alertEl.style.pointerEvents = "none";

    alertEl.style.color = colors[type] || colors.error;
    alertEl.style.textShadow = `0 0 20px ${
      colors[type] || colors.error
    }, 0 0 40px black`;

    if (alertEl.animate) {
      alertEl.animate(
        [
          { transform: "scale(0.5) translateY(-50px)", opacity: 0 },
          { transform: "scale(1.1)", opacity: 1, offset: 0.8 },
          { transform: "scale(1)", opacity: 1 },
        ],
        { duration: 400, easing: "ease-out", fill: "forwards" }
      );

      setTimeout(() => {
        const fadeOut = alertEl.animate(
          [
            { transform: "scale(1)", opacity: 1 },
            { transform: "scale(1.5)", opacity: 0 },
          ],
          { duration: 300, easing: "ease-in", fill: "forwards" }
        );
        fadeOut.onfinish = () => {
          alertEl.style.display = "none";
        };
      }, 1200);
    }
  }

  var _0x105918 = showGameAlert;

  function _0x55c47e(_0x1f8159) {
    if (!_0x1f8159) return "";
    var _0x559fad = _0x1f8159;
    _0x559fad = _0x559fad.replace("piç", "***");
    _0x559fad = _0x559fad.replace(":)", String.fromCodePoint(128513));
    _0x559fad = _0x559fad.replace(":d", String.fromCodePoint(128513));
    _0x559fad = _0x559fad.replace(":D", String.fromCodePoint(128513));
    _0x559fad = _0x559fad.replace(":(", String.fromCodePoint(128577));
    _0x559fad = _0x559fad.replace("siker", "guler");
    _0x559fad = _0x559fad.replace("sikerim", "***");
    _0x559fad = _0x559fad.replace("orospu", "***");
    _0x559fad = _0x559fad.replace("yarrak", "***");
    return _0x559fad;
  }

  function _0x549cd7(_0x304c11) {}
  function _0x59057e(_0x4e0986) {}
  function _0x316e0b(_0x53cff8) {}

  function _0x38a98f(_0x339cc0) {
    var delta = _0x339cc0.wheelDelta / -120 || _0x339cc0.detail || 0;
    if (_0x18263b) {
      _0x339536 *= Math.pow(0.9, delta);
      if (_0x339536 < 0.4) _0x339536 = 0.4;
      if (_0x339536 > 10 / _0x1402f0) _0x339536 = 10 / _0x1402f0;
    } else {
      _0x339536 *= Math.pow(0.9, delta);
      if (_0x339536 < 0.01) _0x339536 = 0.01;
      if (_0x339536 > 4 / _0x1402f0) _0x339536 = 4 / _0x1402f0;
    }
  }

  function updateSpatialIndex() {
    if (_0x1402f0 < 0.4) {
      _0x2cf3cf = null;
      return;
    }
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    let maxCellSize = 0;
    let visibleCells = [];

    for (const cell of _0x3e0cc8) {
      if (
        cell.shouldRender() &&
        !cell.prepareData &&
        cell.size * _0x1402f0 > 20
      ) {
        maxCellSize = Math.max(cell.size, maxCellSize);
        minX = Math.min(cell.x, minX);
        minY = Math.min(cell.y, minY);
        maxX = Math.max(cell.x, maxX);
        maxY = Math.max(cell.y, maxY);
        visibleCells.push(cell);
      }
    }

    _0x2cf3cf = _0x2c6038.init({
      minX: minX - (maxCellSize + 100),
      minY: minY - (maxCellSize + 100),
      maxX: maxX + (maxCellSize + 100),
      maxY: maxY + (maxCellSize + 100),
      maxChildren: 2,
      maxDepth: 4,
    });

    const halfWidth = _0x35ab87 / 2 / _0x1402f0;
    const halfHeight = _0x84b5f1 / 2 / _0x1402f0;
    const viewLeft = _0x4f5429 - halfWidth;
    const viewRight = _0x4f5429 + halfWidth;
    const viewTop = _0x1f0529 - halfHeight;
    const viewBottom = _0x1f0529 + halfHeight;

    for (const cell of visibleCells) {
      for (const point of cell.points) {
        if (
          point.x >= viewLeft &&
          point.x <= viewRight &&
          point.y >= viewTop &&
          point.y <= viewBottom
        ) {
          _0x2cf3cf.insert(point);
        }
      }
    }
  }

  var _0x1a661f = updateSpatialIndex;

  function _0x439b61() {
    if (window.isAutoAiming) return;
    _0x4232df = (_0x7a7861 - _0x35ab87 / 2) / _0x1402f0 + _0x4f5429;
    _0x4ddae1 = (_0x2aaf30 - _0x84b5f1 / 2) / _0x1402f0 + _0x1f0529;
  }

  function _0x455917() {
    _0x1c7fca = false;
    var el = document.getElementById("main-login-section");
    if (el) el.hide(1);
  }

  function _0x4620f0(_0x2d44ba) {
    _0x1c7fca = true;
    var el = document.getElementById("main-login-section");
    if (!el) return;
    if (_0x2d44ba == "fast") {
      el.show(0.2);
    } else {
      el.show(0.5);
    }
  }

  function _0x1dcff8() {
    var h = document.getElementById("stats_hightesmass");
    if (h) h.innerHTML = _0x2bc39b;
    var t = document.getElementById("stats_timealive");
    if (t) t.innerHTML = _0xdd7d12((Date.now() - _0x443ee3) / 1000);
    var p = document.getElementById("stats_topposition");
    if (p) p.innerHTML = _0x40174c == 0 ? ":(" : _0x40174c;
    var io = document.getElementById("infoOverlays");
    if (io) io.show(0.5);
  }

  function _0x3af1d3() {
    var total = 0;
    for (var i = 0; i < _0x1cf585.length; i++) {
      total += _0x1cf585[i].size;
    }
    return Math.floor(total);
  }

  function _0x1cc94d() {}

  function _0x30f669() {
    if (_0x225ef1 == null) return 0;
    for (var _0x11b9af = 0; _0x11b9af < _0x225ef1.length; ++_0x11b9af) {
      if (_0x1cc1c3.indexOf(_0x225ef1[_0x11b9af].id) != -1) {
        return _0x11b9af + 1;
      }
    }
    return 0;
  }

  function _0x52210d(_0x5bbcc8, _0x2cea99) {
    if (_0x5bbcc8.indexOf("{") != -1 && _0x5bbcc8.indexOf("}") != -1) {
      var _0x12169c = _0x5bbcc8.indexOf("{");
      var _0x454cf5 = _0x5bbcc8.indexOf("}");
      var _0x262bb5 = _0x5bbcc8.slice(_0x454cf5 + 1);
      if (_0x2cea99) {
        if (_0x262bb5 == "") {
          _0x262bb5 = "UnnamedCell";
        } else {
          _0x262bb5 = _0x5bbcc8.slice(_0x454cf5 + 1);
        }
      }
      return [_0x5bbcc8.slice(_0x12169c + 1, _0x454cf5), _0x262bb5];
    } else {
      return ["", _0x5bbcc8];
    }
  }

  function _0xdd7d12(_0x597c71) {
    _0x597c71 = ~~_0x597c71;
    var _0x2f3a97 = (_0x597c71 % 60).toString();
    _0x597c71 = (~~(_0x597c71 / 60)).toString();
    if (_0x2f3a97.length < 2) {
      _0x2f3a97 = "0" + _0x2f3a97;
    }
    return _0x597c71 + ":" + _0x2f3a97;
  }

  function _0xde92b2(_0x1ec878) {
    if (_0x41adc2) {
      _0x41adc2.onopen = null;
      _0x41adc2.onmessage = null;
      _0x41adc2.onclose = null;
      try {
        _0x41adc2.close();
      } catch (_0xd99386) {
        console.log("Connection not closed");
      }
      _0x41adc2 = null;
    }
    var _0x54f62b = CONNECTION_URL;
    _0x1ec878 = "wss://" + _0x54f62b;
    _0x1cc1c3 = [];
    _0x1cf585 = [];
    _0x44d2ff = {};
    _0x3e0cc8 = [];
    _0x551ae1 = [];
    _0x225ef1 = [];
    _0x573162 = "RESTART";
    this.countdown = 3599;
    _0x4fc920 = _0xd46307 = null;
    _0x2bc39b = 0;
    _0x4fea95 = 0;

    _0x41adc2 = new WebSocket(_0x1ec878, ["protocol1", "protocol2"]);
    _0x41adc2.binaryType = "arraybuffer";
    _0x41adc2.onopen = _0x4508d4;
    _0x41adc2.onmessage = _0x506b57;
    _0x41adc2.onclose = _0x173bfb;
    _0x41adc2.onerror = function (_0x10ae64) {
      console.log(_0x10ae64);
    };
  }

  function _0x51333f(_0x4d4661) {
    return new DataView(new ArrayBuffer(_0x4d4661));
  }

  window.controlIndex = -1;

  function _0x13b31b(_0x9710ef, forceMain = false) {
    if (forceMain || window.controlIndex === -1) {
      if (_0x41adc2 && _0x41adc2.readyState === 1) {
        _0x41adc2.send(_0x9710ef.buffer);
      }
    } else {
      var targetBot = window.extraSockets[window.controlIndex];
      if (targetBot && targetBot.readyState === 1) {
        targetBot.send(_0x9710ef.buffer);
      }
    }
  }

  function _0x3007c8() {
    _0x20007f();
    _0x152ba2();
  }

  function _0x4508d4() {
    console.log("Connected to the game");
    var _0xc65ea6 = _0x51333f(5);
    _0xc65ea6.setUint8(0, 254);
    _0xc65ea6.setUint32(1, 4, true);
    _0x13b31b(_0xc65ea6);

    _0xc65ea6 = _0x51333f(5);
    _0xc65ea6.setUint8(0, 255);
    _0xc65ea6.setUint32(1, 1332175218, true);
    _0x13b31b(_0xc65ea6);

    if (typeof grecaptcha !== "undefined") {
      grecaptcha.ready(function () {
        grecaptcha
          .execute("6LcnrKQUAAAAADohV5Cksikz89WSP-ZPHNA7ViZm", {
            action: "play_game",
          })
          .then(function (_0x24fd90) {
            _0x1d7f75(_0x24fd90);
          });
      });
    }

    if (playGameClickEvent == 1) {
      _0x3007c8();
    }
  }

  function _0x1d7f75(token) {
    // Recaptcha token paketi gerekirse
  }

  function _0x173bfb() {
    playGameClickEvent = 0;
    console.log("Connection closed");
    _0x41adc2 = null;
    _0x4620f0("fast");
    _0x1154df.isSpectating = false;
  }

  function _0x506b57(_0x1f8d26) {
    try {
      _0x486d06(new DataView(_0x1f8d26.data));
    } catch (_0x496a06) {
      console.log("Ws Message could not be sent");
    }
  }

  function _0x486d06(_0x1956d7) {
    function _0x26a109() {
      var _0x2a43d9 = "";
      var _0x56402e;
      while ((_0x56402e = _0x1956d7.getUint16(_0x3b5561, true)) != 0) {
        _0x3b5561 += 2;
        _0x2a43d9 += String.fromCharCode(_0x56402e);
      }
      _0x3b5561 += 2;
      return _0x2a43d9;
    }
    var _0x3b5561 = 0;
    var _0xf47615 = false;
    if (_0x1956d7.getUint8(_0x3b5561) == 240) {
      _0x3b5561 += 5;
    }
    switch (_0x1956d7.getUint8(_0x3b5561++)) {
      case 16:
        _0xa513e8(_0x1956d7, _0x3b5561);
        break;
      case 17:
        _0x1b6830 = _0x1956d7.getFloat32(_0x3b5561, true);
        _0x3b5561 += 4;
        _0x552165 = _0x1956d7.getFloat32(_0x3b5561, true);
        _0x3b5561 += 4;
        _0x503f66 = _0x1956d7.getFloat32(_0x3b5561, true);
        _0x3b5561 += 4;
        break;
      case 20:
        _0x1cf585 = [];
        _0x1cc1c3 = [];
        break;
      case 21:
        _0x3a03fd = _0x1956d7.getInt16(_0x3b5561, true);
        _0x3b5561 += 2;
        _0x35d3df = _0x1956d7.getInt16(_0x3b5561, true);
        _0x3b5561 += 2;
        if (!_0x1fbd55) {
          _0x1fbd55 = true;
          _0x46e881 = _0x3a03fd;
          _0x52f418 = _0x35d3df;
        }
        break;
      case 32:
        _0x1cc1c3.push(_0x1956d7.getUint32(_0x3b5561, true));
        _0x3b5561 += 4;
        break;
      case 48:
        _0xf47615 = true;
        break;
      case 49:
        _0xd46307 = null;
        var _0x582a10 = _0x1956d7.getUint32(_0x3b5561, true);
        _0x3b5561 += 4;
        _0x225ef1 = [];
        for (var _0x160c99 = 0; _0x160c99 < _0x582a10; ++_0x160c99) {
          var _0x3f42dd = _0x1956d7.getUint32(_0x3b5561, true);
          _0x3b5561 += 4;
          _0x225ef1.push({
            id: _0x3f42dd,
            name: _0x26a109(),
          });
        }
        _0x1cc94d();
        break;
      case 50:
        _0xd46307 = [];
        var _0x19788a = _0x1956d7.getUint32(_0x3b5561, true);
        _0x3b5561 += 4;
        for (var _0x160c99 = 0; _0x160c99 < _0x19788a; ++_0x160c99) {
          _0xd46307.push(_0x1956d7.getFloat32(_0x3b5561, true));
          _0x3b5561 += 4;
        }
        _0x1cc94d();
        break;
      case 64:
        _0x22b0f0 = _0x1956d7.getFloat64(_0x3b5561, true);
        _0x3b5561 += 8;
        _0x12d6c2 = _0x1956d7.getFloat64(_0x3b5561, true);
        _0x3b5561 += 8;
        _0x55af78 = _0x1956d7.getFloat64(_0x3b5561, true);
        _0x3b5561 += 8;
        _0x13322c = _0x1956d7.getFloat64(_0x3b5561, true);
        _0x3b5561 += 8;
        _0x1b6830 = (_0x55af78 + _0x22b0f0) / 2;
        _0x552165 = (_0x13322c + _0x12d6c2) / 2;
        _0x503f66 = 1;
        if (_0x1cf585.length == 0) {
          _0x4f5429 = _0x1b6830;
          _0x1f0529 = _0x552165;
          _0x1402f0 = _0x503f66;
        }
        break;
      case 90:
        Uping = new Date() - latency;
        Uuptime = _0x1956d7.getFloat64(_0x3b5561, true);
        _0x3b5561 += 8;
        Uplayers = _0x1956d7.getFloat64(_0x3b5561, true);
        _0x3b5561 += 8;
        break;
      case 92:
        this.gameName = "";
        var _0xad9cb8;
        while ((_0xad9cb8 = _0x1956d7.getUint16(_0x3b5561, true)) != 0) {
          _0x3b5561 += 2;
          this.gameName += String.fromCharCode(_0xad9cb8);
        }
        break;
      case 96:
        this.countdown = _0x1956d7.getUint16(_0x3b5561, true);
        break;
      case 97:
        _0x573162 = "";
        var _0xad9cb8;
        while ((_0xad9cb8 = _0x1956d7.getUint16(_0x3b5561, true)) != 0) {
          _0x3b5561 += 2;
          _0x573162 += String.fromCharCode(_0xad9cb8);
        }
        break;
      case 109:
        _0x492247(_0x1956d7, _0x3b5561);
        break;
    }
  }

  function _0x492247(_0xa31417, _0x34eaad) {
    function _0x1d4d71() {
      var _0x478ac3 = "";
      var _0x523e66;
      while ((_0x523e66 = _0xa31417.getUint16(_0x34eaad, true)) != 0) {
        _0x34eaad += 2;
        _0x478ac3 += String.fromCharCode(_0x523e66);
      }
      _0x34eaad += 2;
      return _0x478ac3;
    }
    var _0x4d4989 = _0xa31417.getUint8(_0x34eaad++);
    if (_0x4d4989 & 2) _0x34eaad += 4;
    if (_0x4d4989 & 4) _0x34eaad += 8;
    if (_0x4d4989 & 8) _0x34eaad += 16;

    var _0xc965b9 = _0xa31417.getUint8(_0x34eaad++);
    var _0x24c98f = _0xa31417.getUint8(_0x34eaad++);
    var _0x3fb0eb = _0xa31417.getUint8(_0x34eaad++);
    var _0x490cfb = ((_0xc965b9 << 16) | (_0x24c98f << 8) | _0x3fb0eb).toString(
      16
    );
    while (_0x490cfb.length > 6) {
      _0x490cfb = "0" + _0x490cfb;
    }
    _0x490cfb = "#" + _0x490cfb;

    _0x48203d.push({
      name: _0x52210d(_0x1d4d71())[1],
      color: _0x490cfb,
      message: _0x1d4d71(),
      time: Date.now(),
    });
  }

  function updateWorldNodes(view, offset) {
    const now = Date.now();
    const updateCode = Math.random();
    _0x5b1d69 = now;
    _0x171ae9 = false;

    const eatCount = view.getUint16(offset, true);
    offset += 2;

    for (let i = 0; i < eatCount; i++) {
      const eater = _0x44d2ff[view.getUint32(offset, true)];
      const eaten = _0x44d2ff[view.getUint32(offset + 4, true)];
      offset += 8;

      if (eater && eaten) {
        eaten.destroy();
        eaten.ox = eaten.x;
        eaten.oy = eaten.y;
        eaten.oSize = eaten.size;
        eaten.nx = eater.x;
        eaten.ny = eater.y;
        eaten.nSize = eaten.size;
        eaten.updateTime = now;
      }
    }

    while (true) {
      const id = view.getUint32(offset, true);
      offset += 4;
      if (id === 0) break;

      const nx = view.getInt16(offset, true);
      offset += 2;
      const ny = view.getInt16(offset, true);
      offset += 2;
      const size = view.getInt16(offset, true);
      offset += 2;

      const r = view.getUint8(offset++);
      const g = view.getUint8(offset++);
      const b = view.getUint8(offset++);
      const color =
        "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);

      const flags = view.getUint8(offset++);
      const isVirus = !!(flags & 1);
      const isAgitated = !!(flags & 16);

      if (flags & 2) offset += 4;
      if (flags & 4) offset += 8;
      if (flags & 8) offset += 16;

      let name = "";
      while (true) {
        const charCode = view.getUint16(offset, true);
        offset += 2;
        if (charCode === 0) break;
        name += String.fromCharCode(charCode);
      }

      let node = _0x44d2ff[id];
      if (node) {
        node.updatePos();
        node.ox = node.x;
        node.oy = node.y;
        node.oSize = node.size;
        node.color = color;
      } else {
        node = new _0x2b0fa0(id, nx, ny, size, color, name);
        _0x3e0cc8.push(node);
        _0x44d2ff[id] = node;
      }

      node.isVirus = isVirus;
      node.isAgitated = isAgitated;
      node.nx = nx;
      node.ny = ny;
      node.nSize = size;
      node.updateCode = updateCode;
      node.updateTime = now;
      node.flag = flags;

      if (name) node.setName(name);

      if (_0x1cc1c3.indexOf(id) !== -1 && _0x1cf585.indexOf(node) === -1) {
        const loginUI = document.getElementById("main-login-section");
        if (loginUI && loginUI.style.visibility !== "hidden") {
          loginUI.style.visibility = "hidden";
        }
        _0x1cf585.push(node);
        if (_0x1cf585.length === 1) {
          _0x4f5429 = node.x;
          _0x1f0529 = node.y;
        }
      }
    }

    const removeCount = view.getUint32(offset, true);
    offset += 4;

    for (let i = 0; i < removeCount; i++) {
      const removeId = view.getUint32(offset, true);
      offset += 4;
      const node = _0x44d2ff[removeId];
      if (node) node.destroy();
    }

    if (_0x171ae9 && _0x1cf585.length === 0) {
      _0x1dcff8("slow");
    }
  }

  var _0xa513e8 = updateWorldNodes;

  window._0x5474e3 = function () {
    if (
      Math.abs(_0x5668bb - _0x4232df) < 2 &&
      Math.abs(_0x12d92b - _0x4ddae1) < 2
    )
      return;
    if (!_0x2cbf37() || Sfreeze === true) return;
    var diffX = _0x7a7861 - _0x35ab87 / 2;
    var diffY = _0x2aaf30 - _0x84b5f1 / 2;
    if (diffX * diffX + diffY * diffY < 100) return;
    _0x5668bb = _0x4232df;
    _0x12d92b = _0x4ddae1;
    var packet = _0x51333f(21);
    packet.setUint8(0, 16);
    packet.setFloat64(1, _0x4232df, true);
    packet.setFloat64(9, _0x4ddae1, true);
    packet.setUint32(17, 0, true);
    _0x13b31b(packet);
  };

  function _0x152ba2() {
    if (_0x2cbf37()) {
      var _0x44cabc = _0x51333f(1);
      _0x44cabc.setUint8(0, 27);
      _0x13b31b(_0x44cabc);
    }
  }

  function _0x20007f() {
    var nickEl = document.getElementById("nick");
    var _0xdbb0c7 = nickEl ? nickEl.value : "agario";
    localStorage.playerNick = _0xdbb0c7;
    _0xdbb0c7 = _0x55c47e(_0xdbb0c7);
    if (selectSkinName != "") {
      _0xdbb0c7 = "{" + selectSkinName + "}" + _0xdbb0c7;
    }
    if (_0x2cbf37()) {
      var _0x3e378b = _0x51333f(1 + _0xdbb0c7.length * 2);
      _0x3e378b.setUint8(0, 107);
      for (var _0x1d34f4 = 0; _0x1d34f4 < _0xdbb0c7.length; ++_0x1d34f4) {
        _0x3e378b.setUint16(
          1 + _0x1d34f4 * 2,
          _0xdbb0c7.charCodeAt(_0x1d34f4),
          true
        );
      }
      _0x13b31b(_0x3e378b, true);
    }
  }

  function _0x512281(_0x15ad21) {
    if (_0x2cbf37() && _0x15ad21.length < 200 && _0x15ad21.length > 0) {
      var _0x268806 = _0x51333f(2 + _0x15ad21.length * 2);
      var _0x9b9b3e = 0;
      _0x268806.setUint8(_0x9b9b3e++, 109);
      _0x268806.setUint8(_0x9b9b3e++, 0);
      for (var _0xc567ed = 0; _0xc567ed < _0x15ad21.length; ++_0xc567ed) {
        _0x268806.setUint16(_0x9b9b3e, _0x15ad21.charCodeAt(_0xc567ed), true);
        _0x9b9b3e += 2;
      }
      _0x13b31b(_0x268806);
    }
  }

  function _0x2cbf37() {
    return _0x41adc2 != null && _0x41adc2.readyState == _0x41adc2.OPEN;
  }

  window._0x1519d9 = function (_0x759b8d) {
    if (_0x2cbf37()) {
      var _0x51d083 = _0x51333f(1);
      _0x51d083.setUint8(0, _0x759b8d);
      _0x13b31b(_0x51d083);
    }
  };

  function _0x4a98c2() {
    _0x5cf431();
    _0x1154df.requestAnimationFrame(_0x4a98c2);
  }

  function _0x3cca80() {
    window.scrollTo(0, 0);
    _0x35ab87 = _0x1154df.innerWidth;
    _0x84b5f1 = _0x1154df.innerHeight;
    if (_0xe72a47) {
      _0xe72a47.width = _0x35ab87;
      _0xe72a47.height = _0x84b5f1;
    }
    _0x5cf431();
  }

  function _0x951755() {
    var _0x563629 = Math.max(_0x84b5f1 / 1080, _0x35ab87 / 1920);
    return _0x563629 * _0x339536;
  }

  function _0x44fc5b() {
    if (_0x1cf585.length != 0) {
      var totalSize = 0;
      var minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;

      for (var i = 0; i < _0x1cf585.length; i++) {
        var cell = _0x1cf585[i];
        totalSize += cell.size;
        if (cell.x < minX) minX = cell.x;
        if (cell.y < minY) minY = cell.y;
        if (cell.x > maxX) maxX = cell.x;
        if (cell.y > maxY) maxY = cell.y;
      }

      var baseZoom = Math.pow(Math.min(64 / totalSize, 1), 0.4) * _0x951755();
      var spreadX = (maxX - minX) * 0.6;
      var spreadY = (maxY - minY) * 0.6;
      var spreadZoom = Math.min(
        _0x35ab87 / (1000 + spreadX),
        _0x84b5f1 / (1000 + spreadY)
      );

      var targetZoom = Math.min(baseZoom, spreadZoom);
      _0x1402f0 = (_0x1402f0 * 19 + targetZoom) / 20;
    }
  }

  setInterval(function () {
    if (
      typeof _0x44d2ff !== "undefined" &&
      (window._0x1cf585.length > 0 || window.isSpectating)
    ) {
      var enemies = [];
      var myPieces = [];
      var tempEnemies = [];

      for (var id in _0x44d2ff) {
        var node = _0x44d2ff[id];
        if (!node || node.destroyed || node.size < 10) continue;

        if (window._0x1cf585.indexOf(node) !== -1) {
          myPieces.push({ id: node.id, x: node.x, y: node.y, s: node.size });
        } else if (!node.isVirus) {
          tempEnemies.push(node);
        } else {
          enemies.push({
            id: node.id,
            x: node.x,
            y: node.y,
            s: node.size,
            c: node.color,
            v: true,
          });
        }
      }
      tempEnemies.sort((a, b) => b.size - a.size);
      var limited = tempEnemies.slice(0, 200);
      for (var i = 0; i < limited.length; i++) {
        enemies.push({
          id: limited[i].id,
          x: limited[i].x,
          y: limited[i].y,
          s: limited[i].size,
          c: limited[i].color,
          n: limited[i].name,
          v: false,
        });
      }

      window.bc.postMessage({
        tabID: window.tabID,
        myPieces: myPieces,
        enemies: enemies,
        lastUpdate: Date.now(),
      });
    }
  }, 16);

  function _0x5cf431() {
    if (!_0x16b27b) return;
    var _0x56c4ef = Date.now();
    ++_0xe1267f;
    var _0x17ac81 = Date.now() - _0x2c6c3e;
    if (_0x17ac81 > 15) {
      _0x2c6c3e = Date.now();
      _0x5474e3();
    }
    _0x5b1d69 = _0x56c4ef;
    if (_0x1cf585.length > 0) {
      _0x44fc5b();

      var totalX = 0,
        totalY = 0;
      for (var i = 0; i < _0x1cf585.length; i++) {
        var cell = _0x1cf585[i];
        cell.updatePos();
        totalX += cell.x;
        totalY += cell.y;
      }

      _0x1b6830 = totalX / _0x1cf585.length;
      _0x552165 = totalY / _0x1cf585.length;
      _0x503f66 = _0x1402f0;

      var elasticFactor = 0.12;
      _0x4f5429 += (_0x1b6830 - _0x4f5429) * elasticFactor;
      _0x1f0529 += (_0x552165 - _0x1f0529) * elasticFactor;
    } else {
      _0x4f5429 = (_0x4f5429 * 29 + _0x1b6830) / 30;
      _0x1f0529 = (_0x1f0529 * 29 + _0x552165) / 30;
      _0x1402f0 = (_0x1402f0 * 9 + _0x503f66 * _0x951755()) / 10;
    }
    _0x1a661f();
    _0x439b61();

    var gradient = _0x16b27b.createRadialGradient(
      _0x35ab87 / 2,
      _0x84b5f1 / 2,
      0,
      _0x35ab87 / 2,
      _0x84b5f1 / 2,
      _0x35ab87
    );
    gradient.addColorStop(0, "#080808");
    gradient.addColorStop(1, "#000000");

    _0x16b27b.fillStyle = gradient;
    _0x16b27b.fillRect(0, 0, _0x35ab87, _0x84b5f1);

    _0x3e0cc8.sort(function (_0x3e2c64, _0x58cf05) {
      if (_0x3e2c64.size == _0x58cf05.size) {
        return _0x3e2c64.id - _0x58cf05.id;
      } else {
        return _0x3e2c64.size - _0x58cf05.size;
      }
    });

    _0x16b27b.save();
    _0x16b27b.translate(_0x35ab87 / 2, _0x84b5f1 / 2);
    _0x16b27b.scale(_0x1402f0, _0x1402f0);
    _0x16b27b.translate(-_0x4f5429, -_0x1f0529);

    _0x16b27b.save();
    var drawnIDs = new Set();

    for (var sessionID in window.ghostSessions) {
      var gData = window.ghostSessions[sessionID];
      if (gData.tabID === window.tabID || Date.now() - gData.lastUpdate > 150)
        continue;

      if (gData.enemies) {
        for (var i = 0; i < gData.enemies.length; i++) {
          var e = gData.enemies[i];
          if (_0x44d2ff[e.id] || drawnIDs.has(e.id) || (e.s < 85 && !e.v))
            continue;

          drawnIDs.add(e.id);

          if (e.v) {
            var isSirenBlueGhost = Date.now() % 400 < 200;
            var sirenColorGhost = isSirenBlueGhost ? "#0055FF" : "#FF0000";
            _0x16b27b.globalAlpha = 1.0;
            _0x16b27b.fillStyle = sirenColorGhost;
            _0x16b27b.shadowBlur = 15;
            _0x16b27b.shadowColor = sirenColorGhost;
          } else {
            _0x16b27b.globalAlpha = 0.3;
            _0x16b27b.fillStyle = e.c;
            _0x16b27b.shadowBlur = 0;
          }

          _0x16b27b.beginPath();
          _0x16b27b.arc(e.x, e.y, e.v ? e.s * 1.1 : e.s, 0, Math.PI * 2);
          _0x16b27b.fill();
          _0x16b27b.shadowBlur = 0;

          if (e.n && !window._0x23ab14) {
            _0x16b27b.save();
            _0x16b27b.globalAlpha = 0.8;
            var nameSize = Math.max(~~(e.s * 0.2), 24);
            _0x16b27b.font = nameSize + "px Poppins";
            _0x16b27b.textAlign = "center";
            _0x16b27b.textBaseline = "middle";
            _0x16b27b.fillStyle = "#000";
            var cleanName =
              e.n.indexOf("}") !== -1 ? e.n.split("}").pop() : e.n;
            _0x16b27b.fillText(cleanName, e.x, e.y);
            _0x16b27b.restore();
          }
        }
      }
    }
    _0x16b27b.restore();

    _0x16b27b.strokeStyle = "#FFF";
    _0x16b27b.lineWidth = 80;
    _0x16b27b.lineCap = "round";
    _0x16b27b.lineJoin = "round";
    _0x16b27b.beginPath();
    _0x16b27b.moveTo(_0x22b0f0, _0x12d6c2);
    _0x16b27b.lineTo(_0x55af78, _0x12d6c2);
    _0x16b27b.lineTo(_0x55af78, _0x13322c);
    _0x16b27b.lineTo(_0x22b0f0, _0x13322c);
    _0x16b27b.closePath();
    _0x16b27b.stroke();

    _0x16b27b.globalAlpha = _0x7ac7be ? 0.6 : 1;

    for (var _0x4a53dc = 0; _0x4a53dc < _0x3e0cc8.length; _0x4a53dc++) {
      _0x3e0cc8[_0x4a53dc].drawOneCell(_0x16b27b);
    }

    if (_0x1fbd55) {
      _0x46e881 = (_0x46e881 * 3 + _0x3a03fd) / 4;
      _0x52f418 = (_0x52f418 * 3 + _0x35d3df) / 4;
      _0x16b27b.save();
      _0x16b27b.strokeStyle = "#FFAAAA";
      _0x16b27b.lineWidth = 10;
      _0x16b27b.lineCap = "round";
      _0x16b27b.lineJoin = "round";
      _0x16b27b.globalAlpha = 0.5;
      _0x16b27b.beginPath();
      for (_0x4a53dc = 0; _0x4a53dc < _0x1cf585.length; _0x4a53dc++) {
        _0x16b27b.moveTo(_0x1cf585[_0x4a53dc].x, _0x1cf585[_0x4a53dc].y);
        _0x16b27b.lineTo(_0x46e881, _0x52f418);
      }
      _0x16b27b.stroke();
      _0x16b27b.restore();
    }
    _0x16b27b.restore();

    if (_0x1afb5a && _0x1afb5a.width) {
      _0x16b27b.drawImage(_0x1afb5a, _0x35ab87 - _0x1afb5a.width - 10, 10);
    }
    if (!_0x2653d4 && _0x4e0f0e != null && _0x4e0f0e.width > 0) {
      _0x16b27b.drawImage(_0x4e0f0e, 0, _0x84b5f1 - _0x4e0f0e.height - 50);
    }

    _0x4fea95 = _0x3af1d3();
    _0x2bc39b = Math.max(_0x2bc39b, _0x4fea95);
    _0x16b27b.globalAlpha = 0.8;
    _0x16b27b.fillStyle = _0x456030 ? "#FFFFFF" : "#000000";
    _0x16b27b.font = "24px Ubuntu";
    _0x16b27b.fillText("Score: " + _0x4fea95, 10, 34);
    _0x16b27b.fillText("Max: " + _0x2bc39b, 10, 60);

    if (this.countdown < 3600) {
      var _0x4fda26 = "";
      var _0x48083a = Math.floor(this.countdown / 60);
      if (_0x48083a < 10) _0x4fda26 += "0";
      _0x4fda26 += _0x48083a + ":";
      var _0x261599 = this.countdown % 60;
      if (_0x261599 < 10) _0x4fda26 += "0";
      _0x4fda26 += _0x261599;

      _0x16b27b.fillStyle = _0x456030 ? "#5959eb" : "#0000FF";
      _0x16b27b.font = "15px Ubuntu";
      _0x16b27b.fillText("Latency " + Uping + " ms;", 10, 90);
      _0x16b27b.fillText("Uptime " + Uuptime + " sec;", 10, 110);
      _0x16b27b.fillText("Restart " + _0x4fda26, 10, 130);
      _0x16b27b.fillText("Players " + Uplayers + ";", 10, 150);
    }

    if (_0x2cbf37()) {
      _0x16b27b.globalAlpha = 1;
      _0x16b27b.font = "16px Ubuntu";
      var _0x473451 = "share";
      var _0x5bf63c =
        Math.round(_0x4f5429 / 1000) +
        " , " +
        Math.round(_0x1f0529 / 1000) +
        " " +
        _0x473451;
      _0x3e66be = _0x16b27b.measureText(_0x5bf63c).width;
      _0x39a218 = 16;
      _0x323587 =
        "*** " +
        Math.round(_0x4f5429 / 1000) +
        " , " +
        Math.round(_0x1f0529 / 1000) +
        " ***";
      _0x16b27b.fillStyle = _0x456030 ? "#FFFFFF" : "#000000";
      _0x16b27b.fillText(_0x5bf63c, _0x3893ec, _0x3b81f2 - 15);
    }

    if (!_0x2653d4) {
      var _0x1865c9 = 0;
      for (var _0x42d0b2 = _0x48203d.length - 1; _0x42d0b2 >= 0; _0x42d0b2--) {
        _0x1865c9++;
        if (_0x1865c9 > 15) break;
        var _0xc6a056 = _0x48203d[_0x42d0b2].name.trim();
        if (_0xc6a056 == "") _0xc6a056 = "Agar.io";
        var _0x1612c2 = _0x48203d[_0x42d0b2].message.trim();
        var _0x3a44c9 = " : " + _0x1612c2;
        var _0x5cdd26 = _0x3a44c9.toLowerCase();
        var _0x4e5aac = _0x5cdd26.replace(
          /[^a-zA-ZğüşıöçĞÜŞİÖÇ@)(!,?:^0-9 ]/g,
          ""
        );
        _0x16b27b.font = "18px Arial";
        _0x48203d[_0x42d0b2].name_x = 15;
        _0x48203d[_0x42d0b2].name_y = _0x84b5f1 - 30 - _0x1865c9 * 20;
        _0x48203d[_0x42d0b2].name_w = _0x16b27b.measureText(_0xc6a056).width;
        _0x48203d[_0x42d0b2].name_h = 18;
        _0x48203d[_0x42d0b2].msg_x = 15 + _0x48203d[_0x42d0b2].name_w;
        _0x48203d[_0x42d0b2].msg_y = _0x48203d[_0x42d0b2].name_y;
        _0x48203d[_0x42d0b2].msg_w = _0x16b27b.measureText(_0x3a44c9).width;
        _0x48203d[_0x42d0b2].msg_h = _0x48203d[_0x42d0b2].name_h;
        _0x16b27b.fillStyle = _0x48203d[_0x42d0b2].color;
        _0x16b27b.fillText(
          _0xc6a056,
          _0x48203d[_0x42d0b2].name_x,
          _0x48203d[_0x42d0b2].name_y
        );
        _0x16b27b.fillStyle = _0x456030 ? "#FFFFFF" : "#000000";
        _0x16b27b.fillText(
          _0x4e5aac,
          _0x48203d[_0x42d0b2].msg_x,
          _0x48203d[_0x42d0b2].msg_y
        );
      }
    }

    var _0x579343 = Date.now() - _0x56c4ef;
    if (_0x579343 > 1000 / 60) {
      _0xdce442 -= 0.01;
    } else if (_0x579343 < 1000 / 65) {
      _0xdce442 += 0.01;
    }
    if (_0xdce442 < 0.4) _0xdce442 = 0.4;
    if (_0xdce442 > 1) _0xdce442 = 1;

    updateMinimap();
  }

  // --- TAMAMLANMIŞ HARİTA (MINIMAP) FONKSİYONU ---
  function updateMinimap() {
    if (_0x1cf585.length === 0 || !_0x16b27b) return;

    const ctx = _0x16b27b;
    const mapSize = 200;
    const margin = 10;
    const posX = _0x35ab87 - mapSize - margin;
    const posY = _0x84b5f1 - mapSize - margin;

    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "rgba(0,0,0,0.5)";

    drawRoundedRect(ctx, posX, posY, mapSize, mapSize, 10);
    ctx.fill();
    ctx.shadowBlur = 0;

    const mapW = _0x55af78 - _0x22b0f0 || 1;
    const mapH = _0x13322c - _0x12d6c2 || 1;

    // Grid ve Sektör Çizimi
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    for (let i = 1; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(posX + (mapSize / 5) * i, posY);
      ctx.lineTo(posX + (mapSize / 5) * i, posY + mapSize);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(posX, posY + (mapSize / 5) * i);
      ctx.lineTo(posX + mapSize, posY + (mapSize / 5) * i);
      ctx.stroke();
    }

    // Kendi Hücrelerimizi Minimap Üzerinde Göster
    ctx.fillStyle = "#00FF7F";
    for (let i = 0; i < _0x1cf585.length; i++) {
      const cell = _0x1cf585[i];
      const mx = posX + ((cell.x - _0x22b0f0) / mapW) * mapSize;
      const my = posY + ((cell.y - _0x12d6c2) / mapH) * mapSize;

      ctx.beginPath();
      ctx.arc(mx, my, Math.max(2, (cell.size / mapW) * mapSize), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  var _0xafbc37 = updateMinimap;

  // Sayfa yüklendiğinde motoru başlat
  _0x2c91e6();
})(window);
