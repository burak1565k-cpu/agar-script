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
var CONNECTION_URL = "ffa4.agariodns.cyou:" + port;
var playGameClickEvent = 0;
var Uping;
var Uuptime;
var Uplayers;
var Sfreeze = false;

// --- MULTIBOX GHOST INITIALIZER (GÜVENLİ VE TEMİZLİKÇİ) ---
window.tabID = Math.random().toString(36).substring(2, 10);
window.bc = new BroadcastChannel("agario_multibox_vision");
window.ghostSessions = {};

window.bc.onmessage = function (ev) {
  if (ev.data && ev.data.tabID) {
    window.ghostSessions[ev.data.tabID] = ev.data;
    window.ghostSessions[ev.data.tabID].lastUpdate = Date.now();

    // TEMİZLİK: 2 saniyedir (2000ms) haber gelmeyenleri sil (Gereksiz silinmeyi önler)
    for (var id in window.ghostSessions) {
      if (Date.now() - window.ghostSessions[id].lastUpdate > 5000) {
        delete window.ghostSessions[id];
      }
    }
  }
};

function appendHtmlChild() {
  if (
    localStorage.gameMode &&
    localStorage.gameMode != undefined &&
    localStorage.gameMode != null
  ) {
    document.querySelector(
      '#gamemode [value="' + localStorage.gameMode + '"]'
    ).selected = true;
  }
  if (
    localStorage.playerNick &&
    localStorage.playerNick != undefined &&
    localStorage.playerNick != null
  ) {
    document.getElementById("nick").value = localStorage.playerNick;
  } else {
    document.getElementById("nick").value = "agario";
  }
  if (
    localStorage.skin &&
    localStorage.skin != undefined &&
    localStorage.skin != null
  ) {
    document.getElementById("defaultSkin").src =
      "https://agar.live/skins/" + localStorage.skin + ".png";
    selectSkinName = localStorage.skin;
  } else {
    document.getElementById("defaultSkin").src =
      "https://agar.live/skins/noskin.png";
  }
}
document.addEventListener("DOMContentLoaded", (_0x42fa1b) => {
  getScript(
    "https://www.google.com/recaptcha/api.js?render=6LcnrKQUAAAAADohV5Cksikz89WSP-ZPHNA7ViZm"
  );
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
    var _0x7f4387 = document.getElementById("gamemode").value;
    if (_0x7f4387 != _0x33ee7e) {
      CONNECTION_URL = _0x7f4387;
      _0x33ee7e = _0x7f4387;
      _0xde92b2(CONNECTION_URL);
      localStorage.gameMode = _0x7f4387;
    }
  };
  _0x1154df.mobile_OpenSettings = function () {
    document.getElementById("mobile_settingsModal").style.display = "block";
  };
  _0x1154df.mobile_CloseSettings = function () {
    document.getElementById("mobile_settingsModal").style.display = "none";
  };
  _0x1154df.mobile_OpenSelectSkinPage = function () {
    if (selectSkinModalAjax == 0) {
      getScript("./skins.js?=v1", () => (selectSkinModalAjax = 1));
    }
  };
  _0x1154df.selectSkinPage = function () {
    if (selectSkinModalAjax == 0 && selectSkinModalAjax == 0) {
      getScript("./skins.js?=v1", () => (selectSkinModalAjax = 1));
    }
  };
  _0x1154df.closeSkinPage = function () {
    selectskinmodalclose();
  };
  _0x1154df.setSkinListClick = function (_0x17415e) {
    document.getElementById("defaultSkin").src =
      "https://agar.live/skins/" + _0x17415e + ".png";
    closeSkinPage();
    localStorage.skin = _0x17415e;
    selectSkinName = _0x17415e;
    console.log(_0x17415e + " 'skin update'");
  };
  function _0x1d0b7d(
    _0x40b698,
    _0x58f698,
    _0x4fa260,
    _0x117797,
    _0x3df4b9,
    _0x2db189
  ) {
    if (
      _0x40b698 <= _0x3df4b9 &&
      _0x3df4b9 <= _0x4fa260 &&
      _0x58f698 <= _0x2db189 &&
      _0x2db189 <= _0x117797
    ) {
      return true;
    }
    return false;
  }
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
  var _0x2dd0ca = "https://agar.live/skins/";
  var _0xfa086b;
  var _0x1ef7b9;
  var _0x1abc67 = "createTouch" in document;
  var _0x2adf4e = [];
  var _0x2166a9 = -1;
  var _0x53271f = new Vector2(0, 0);
  var _0x148da7 = new Vector2(0, 0);
  var _0x26ba9e = new Vector2(0, 0);
  var _0x3e66be = 100;
  var _0x39a218 = 20;
  var _0x323587 = "!";
  var _0xd37afc = 0;
  var _0x989085 = 0;
  var _0x5e6b6a = 0;
  var _0x370936 = 0;
  var _0x3d769c = 0;
  var _0x218057 = false;
  var _0x257ead = 0;
  var _0xb388a5 = 0;
  var _0xdfc219 = _0x1154df.location.protocol;
  var _0x37fdcd = _0xdfc219 == "https:";
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
  var _0x91b001 = "?";
  var _0x45286b = 3600;
  var _0x48203d = [];
  window._0x7a7861 = 0;
  window.isAutoAiming = false;
  window._0x4232df = -1;
  window._0x4ddae1 = -1;
  var _0x2aaf30 = 0;
  var _0xe1267f = 0;
  var _0x443ee3 = Date.now();
  var _0x40174c = 0;
  var _0x2be5c9 = 0;
  var _0x5b1d69 = 0;
  var _0x22b0f0 = 0;
  var _0x12d6c2 = 0;
  var _0x55af78 = 10000;
  var _0x13322c = 10000;
  var _0x1402f0 = 1;
  var _0x805aaa = null;
  var _0x5d5ae3 = false;
  window._0x23ab14 = false; // 'var' silindi, 'window.' eklendi
  var _0x319c56 = false;
  var _0x171ae9 = false;
  var _0x4fea95 = 0;
  var _0x2bc39b = 0;
  var _0x456030 = false;
  var _0x16e8c8 = false;
  var _0x2eb996 = false;
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
  var _0x5d5623 = 0;
  var _0x3bf563 = ["#333333", "#FF3333", "#33FF33", "#3333FF"];
  var _0x339536 = 0.4;
  var _0x3167b9 =
    "ontouchstart" in _0x1154df &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  var _0x14a358 = false;
  var _0x3dce4b = document.createElement("canvas");
  _0x1154df.isSpectating = false;
  var _0x2c6c3e = Date.now();
  var _0x3893ec = 0;
  var _0x3b81f2 = 0;
  function _0x2c91e6() {
    const _0x172f79 = document.querySelector("#chat_textbox");
    _0x172f79.addEventListener("paste", (_0x146ccc) =>
      _0x146ccc.preventDefault()
    );
    var _0x4bd8d0 = "ontouchstart" in document.documentElement;
    if (_0x4bd8d0 == true) {
    } else {
    }
    if (localStorage.noSkin == null) {
      localStorage.noSkin = false;
    }
    _0x5d5ae3 = localStorage.noSkin === "true";
    document.getElementById("noSkin").checked = _0x5d5ae3;
    if (localStorage.noNames == null) {
      localStorage.noNames = false;
    }
    _0x23ab14 = localStorage.noNames === "true";
    document.getElementById("noNames").checked = _0x23ab14;
    if (localStorage.noColor == null) {
      localStorage.noColor = false;
    }
    _0x319c56 = localStorage.noColor === "true";
    document.getElementById("noColor").checked = _0x319c56;
    if (localStorage.showDarkTheme == null) {
      localStorage.showDarkTheme = false;
    }
    _0x456030 = localStorage.showDarkTheme === "true";
    document.getElementById("darkTheme").checked = _0x456030;
    if (localStorage.hideChat == null) {
      localStorage.hideChat = false;
    }
    _0x2653d4 = localStorage.hideChat === "true";
    document.getElementById("hideChat").checked = _0x2653d4;
    if (_0x2653d4) {
      document.getElementById("chat_textbox").style.display = "none";
    } else {
      document.getElementById("chat_textbox").style.display = "block";
    }
    if (localStorage.smoothRender == null) {
      localStorage.smoothRender = 0.4;
    }
    _0x2582ca = localStorage.smoothRender;
    document.getElementById("smoothRender").checked = _0x2582ca == 2;
    if (localStorage.transparentRender == null) {
      localStorage.transparentRender = false;
    }
    _0x7ac7be = localStorage.transparentRender === "true";
    document.getElementById("transparentRender").checked = _0x7ac7be;
    if (localStorage.showScore == null) {
      localStorage.showScore = false;
    }
    _0x16e8c8 = localStorage.showScore === "true";
    document.getElementById("showScore").checked = _0x16e8c8;
    if (localStorage.zoom == null) {
      localStorage.zoom = false;
    }
    _0x18263b = localStorage.zoom === "true";
    document.getElementById("getZoom").checked = _0x18263b;
    document.getElementById("canvas").focus();
    var _0x404848 = false;
    var _0x470893;
    _0x4fc920 = _0xe72a47 = document.getElementById("canvas");
    _0x16b27b = _0x4fc920.getContext("2d");
    _0x4fc920.onmousemove = function (_0x302370) {
      if (window.isAutoAiming) return;

      // Mouse koordinatlarını anında değil, çok hafif bir gecikmeyle (lerp) takip et
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
    _0x4fc920.onmouseup = function () {};
    if (/firefox/i.test(navigator.userAgent)) {
      document.addEventListener("DOMMouseScroll", _0x38a98f, false);
    } else {
      document.body.onmousewheel = _0x38a98f;
    }
    _0x4fc920.onfocus = function () {
      _0x404848 = false;
    };
    document.getElementById("chat_textbox").onblur = function () {
      _0x404848 = false;
    };
    document.getElementById("chat_textbox").onfocus = function () {
      _0x404848 = true;
    };
    var _0x57307f = false;
    var _0x3cb1b5 = false;
    var _0x501f6d = false;
    var _0x12195f = false;
    var _0x5e6dcb = 0;
    _0x1154df.onkeydown = function (_0x1f4f29) {
      var _0x52100a =
        document.getElementById("main-login-section").style.visibility;
      switch (_0x1f4f29.keyCode) {
        case 32:
          if (!_0x57307f && !_0x404848 && _0x52100a == "hidden") {
            _0x5474e3();
            _0x1519d9(17);
            _0x57307f = true;
          }
          break;
        case 49: // '1' Tuşu (Respawn)
          if (!_0x404848 && _0x52100a == "hidden") {
            // Chat kapalıysa ve oyundaysak
            _0x1154df.playGame();
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
            if (Sfreeze == false) {
              Sfreeze = true;
              _0x105918("Game stopped.");
            } else {
              Sfreeze = false;
              _0x105918("Game resumed.");
            }
          }
          break;

        case 51: // '3' Tuşu
          if (!_0x404848) {
            window._0x23ab14 = !window._0x23ab14; // Global değişkeni değiştir
            localStorage.noNames = window._0x23ab14;
            if (document.getElementById("noNames"))
              document.getElementById("noNames").checked = window._0x23ab14;
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
            document.getElementById("chat_textbox").blur();
            _0x470893 = _0x55c47e(
              document.getElementById("chat_textbox").value
            );
            if (_0x470893.length > 0) {
              _0x512281(_0x470893);
            }
            document.getElementById("chat_textbox").value = "";
          } else if (!_0x1c7fca) {
            document.getElementById("chat_textbox").focus();
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
    document.getElementById("main-login-section").style.visibility = "visible";
    document.getElementById("infoOverlays").style.visibility = "hidden";
  }

  (function () {
    var feedInterval = null;
    var isFeeding = false;
    var feedSpeed = 15; // Hız: 15ms (Ne kadar düşükse o kadar hızlı atar)

    window.addEventListener("keydown", function (e) {
      // 69 = E tuşu | chat_textbox odaklı değilse çalışır
      if (
        e.keyCode === 69 &&
        !isFeeding &&
        document.activeElement.id !== "chat_textbox"
      ) {
        isFeeding = true;

        // Hemen ilk yemi at
        if (typeof _0x1519d9 === "function") _0x1519d9(21);

        // Basılı tutulduğu sürece döngüyü başlat
        feedInterval = setInterval(function () {
          if (typeof _0x1519d9 === "function") {
            _0x1519d9(21); // 21 kodu sunucuya yem (W) paketini gönderir
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

    // Sekme değiştirirsen veya odak kaybolursa yem atmayı durdur (Takılı kalmaması için)
    window.addEventListener("blur", function () {
      isFeeding = false;
      clearInterval(feedInterval);
      feedInterval = null;
    });
  })();
  /**
   * Modern Oyun Bildirim Sistemi (Global Alert)
   * @param {string} text - Ekranda görünecek mesaj
   * @param {string} type - 'error' (kırmızı) veya 'success' (yeşil) - Opsiyonel
   */
  function showGameAlert(text, type = "error") {
    const alertEl = document.getElementById("nn");
    if (!alertEl) return; // Element yoksa hata verme

    // Stil ayarları (JS içinden dinamik ama modern)
    const colors = {
      error: "rgba(255, 0, 0, 0.9)",
      success: "rgba(0, 255, 127, 0.9)",
      info: "rgba(0, 191, 255, 0.9)",
    };

    // Temizlik ve Hazırlık
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
    alertEl.style.pointerEvents = "none"; // Oyuna engel olmasın

    // 2026 Estetiği: Renk ve Glow (Parlama)
    alertEl.style.color = colors[type] || colors.error;
    alertEl.style.textShadow = `0 0 20px ${
      colors[type] || colors.error
    }, 0 0 40px black`;

    // Animasyon: Giriş (Scale ve Opacity)
    alertEl.animate(
      [
        { transform: "scale(0.5) translateY(-50px)", opacity: 0 },
        { transform: "scale(1.1)", opacity: 1, offset: 0.8 },
        { transform: "scale(1)", opacity: 1 },
      ],
      {
        duration: 400,
        easing: "ease-out",
        fill: "forwards",
      }
    );

    // Otomatik Kapatma (Yumuşakça silinme)
    setTimeout(() => {
      const fadeOut = alertEl.animate(
        [
          { transform: "scale(1)", opacity: 1 },
          { transform: "scale(1.5)", opacity: 0 },
        ],
        {
          duration: 300,
          easing: "ease-in",
          fill: "forwards",
        }
      );

      fadeOut.onfinish = () => {
        alertEl.style.display = "none";
      };
    }, 1200); // Mesajın ekranda kalma süresi (1.2 saniye)
  }

  // Eski koddaki fonksiyon adıyla eşleştiriyoruz (Override için)
  var _0x105918 = showGameAlert;
  function _0x55c47e(_0x1f8159) {
    var _0x559fad = _0x1f8159;
    _0x559fad = _0x559fad.replace("piç", "***");
    _0x559fad = _0x559fad.replace("pussy", String.fromCodePoint(128513));
    _0x559fad = _0x559fad.replace(":)", String.fromCodePoint(128513));
    _0x559fad = _0x559fad.replace(":d", String.fromCodePoint(128513));
    _0x559fad = _0x559fad.replace(":D", String.fromCodePoint(128513));
    _0x559fad = _0x559fad.replace(":(", String.fromCodePoint(128577));
    _0x559fad = _0x559fad.replace(":p", String.fromCodePoint(128541));
    _0x559fad = _0x559fad.replace(":o", String.fromCodePoint(128562));
    _0x559fad = _0x559fad.replace(";)", String.fromCodePoint(128521));
    _0x559fad = _0x559fad.replace(":>", String.fromCodePoint(128535));
    _0x559fad = _0x559fad.replace(":$", String.fromCodePoint(129324));
    _0x559fad = _0x559fad.replace("love", String.fromCodePoint(128149));
    _0x559fad = _0x559fad.replace("okay", String.fromCodePoint(128077));
    _0x559fad = _0x559fad.replace("kiss", String.fromCodePoint(128139));
    _0x559fad = _0x559fad.replace("porn", String.fromCodePoint(128139));
    _0x559fad = _0x559fad.replace("sex", String.fromCodePoint(128139));
    _0x559fad = _0x559fad.replace("PORN", String.fromCodePoint(128139));
    _0x559fad = _0x559fad.replace("SEX", String.fromCodePoint(128139));
    _0x559fad = _0x559fad.replace("S1KEN", String.fromCodePoint(128139));
    _0x559fad = _0x559fad.replace("YARRAK", String.fromCodePoint(128139));
    _0x559fad = _0x559fad.replace("yarak", "***");
    _0x559fad = _0x559fad.replace("party", "***");
    _0x559fad = _0x559fad.replace("prty", "***");
    _0x559fad = _0x559fad.replace("PARTY", "***");
    _0x559fad = _0x559fad.replace("Party", "***");
    _0x559fad = _0x559fad.replace("SİKER", "GULER");
    _0x559fad = _0x559fad.replace("islam", "***");
    _0x559fad = _0x559fad.replace("ISLAM", "***");
    _0x559fad = _0x559fad.replace("MUSLIM", "***");
    _0x559fad = _0x559fad.replace("muslim", "***");
    _0x559fad = _0x559fad.replace("siker", "guler");
    _0x559fad = _0x559fad.replace("꧅", "***");
    _0x559fad = _0x559fad.replace("turkey", "GULER");
    _0x559fad = _0x559fad.replace("admin", "***");
    _0x559fad = _0x559fad.replace("ADMİN", "***");
    _0x559fad = _0x559fad.replace("ADMIN", "***");
    _0x559fad = _0x559fad.replace("O.Ç", "***");
    _0x559fad = _0x559fad.replace("o.ç", "***");
    _0x559fad = _0x559fad.replace("amcık", "***");
    _0x559fad = _0x559fad.replace("amc1", "***");
    _0x559fad = _0x559fad.replace("sikerim", "***");
    _0x559fad = _0x559fad.replace("www.agario.su", "***");
    _0x559fad = _0x559fad.replace("siken", "***");
    _0x559fad = _0x559fad.replace("SİKEN", "***");
    _0x559fad = _0x559fad.replace("sikerler", "***");
    _0x559fad = _0x559fad.replace("discord", "***");
    _0x559fad = _0x559fad.replace("http", "***");
    _0x559fad = _0x559fad.replace("HTTP", "***");
    _0x559fad = _0x559fad.replace("orospu", "***");
    _0x559fad = _0x559fad.replace("yarrak", "***");
    _0x559fad = _0x559fad.replace("skr", "***");
    _0x559fad = _0x559fad.replace("SKR", "***");
    _0x559fad = _0x559fad.replace("S1KER", "***");
    _0x559fad = _0x559fad.replace("sKr", "***");
    _0x559fad = _0x559fad.replace("SkR", "***");
    _0x559fad = _0x559fad.replace("s1keyim", "***");
    _0x559fad = _0x559fad.replace("s1k", "***");
    _0x559fad = _0x559fad.replace("ors", "***");
    _0x559fad = _0x559fad.replace("yarrağı", "***");
    _0x559fad = _0x559fad.replace("göt", "***");
    _0x559fad = _0x559fad.replace("fuck", "***");
    _0x559fad = _0x559fad.replace("ATATÜRK", "***");
    _0x559fad = _0x559fad.replace("parti", "***");
    _0x559fad = _0x559fad.replace("PARTİ", "***");
    _0x559fad = _0x559fad.replace("atatürk", "***");
    _0x559fad = _0x559fad.replace("fuck", "***");
    _0x559fad = _0x559fad.replace("FCK", "***");
    _0x559fad = _0x559fad.replace("FUCK", "***");
    _0x559fad = _0x559fad.replace("allah", "***");
    _0x559fad = _0x559fad.replace("ALLAH", "***");
    _0x559fad = _0x559fad.replace("HZ", "***");
    _0x559fad = _0x559fad.replace("hz", "***");
    _0x559fad = _0x559fad.replace("TAYYİP", "***");
    _0x559fad = _0x559fad.replace("RTE", "***");
    _0x559fad = _0x559fad.replace("RECEP", "***");
    _0x559fad = _0x559fad.replace("rte", "***");
    _0x559fad = _0x559fad.replace("FUCK", "***");
    _0x559fad = _0x559fad.replace("𝓕𝓤𝓒𝓚", "***");
    _0x559fad = _0x559fad.replace("𝓕𝓤𝓒𝓚𝓨𝓞𝓤", "***");
    _0x559fad = _0x559fad.replace("tayyip", "***");
    _0x559fad = _0x559fad.replace("tayyıp", "***");
    _0x559fad = _0x559fad.replace("recep", "***");
    _0x559fad = _0x559fad.replace("skmek", "***");
    _0x559fad = _0x559fad.replace("ananızı", "***");
    _0x559fad = _0x559fad.replace("sıkmek", "***");
    _0x559fad = _0x559fad.replace("rec", "***");
    _0x559fad = _0x559fad.replace("REC", "***");
    _0x559fad = _0x559fad.replace("BOK", "***");
    _0x559fad = _0x559fad.replace("bok", "***");
    _0x559fad = _0x559fad.replace("Ass", "***");
    _0x559fad = _0x559fad.replace("Vagina", "***");
    _0x559fad = _0x559fad.replace("Bitch", "***");
    _0x559fad = _0x559fad.replace("Sucker", "***");
    _0x559fad = _0x559fad.replace("meme", "***");
    _0x559fad = _0x559fad.replace("yarak", "***");
    _0x559fad = _0x559fad.replace("yarağı", "***");
    _0x559fad = _0x559fad.replace("sokam", "***");
    _0x559fad = _0x559fad.replace("sikem", "***");
    _0x559fad = _0x559fad.replace("sik", "***");
    _0x559fad = _0x559fad.replace("ANANIZI", "***");
    _0x559fad = _0x559fad.replace("gay", "***");
    _0x559fad = _0x559fad.replace("oç", "***");
    _0x559fad = _0x559fad.replace("o.ç", "***");
    _0x559fad = _0x559fad.replace("pkk", "!!!");
    _0x559fad = _0x559fad.replace("PKK", "!!!");
    _0x559fad = _0x559fad.replace("KURDISTAN", "BENGAVATIM");
    _0x559fad = _0x559fad.replace("KÜRDİSTAN", "!!!");
    _0x559fad = _0x559fad.replace("kurdıstan", "!!!");
    _0x559fad = _0x559fad.replace("kürdistan", "!!!");
    _0x559fad = _0x559fad.replace("kürd", "!!!");
    _0x559fad = _0x559fad.replace("kürt", "!!!");
    _0x559fad = _0x559fad.replace("kurt", "!!!");
    _0x559fad = _0x559fad.replace("KÜRT", "!!!");
    _0x559fad = _0x559fad.replace("KURT", "!!!");
    _0x559fad = _0x559fad.replace("kurd", "!!!");
    _0x559fad = _0x559fad.replace("P K K", "!!!");
    _0x559fad = _0x559fad.replace("P_K_K", "!!!");
    _0x559fad = _0x559fad.replace("P-K-K", "!!!");
    _0x559fad = _0x559fad.replace("p kk", "!!!");
    _0x559fad = _0x559fad.replace("pk k", "!!!");
    _0x559fad = _0x559fad.replace("p_k_k", "!!!");
    _0x559fad = _0x559fad.replace("p-k-k", "!!!");
    _0x559fad = _0x559fad.replace("o.çocuğu", "***");
    _0x559fad = _0x559fad.replace("penis", "***");
    _0x559fad = _0x559fad.replace("ananı", "***");
    _0x559fad = _0x559fad.replace("anasını", "***");
    _0x559fad = _0x559fad.replace("amına", "***");
    _0x559fad = _0x559fad.replace("Siken", "***");
    _0x559fad = _0x559fad.replace("iken", "***");
    _0x559fad = _0x559fad.replace("İKEN", "***");
    _0x559fad = _0x559fad.replace("sıktıgım", "***");
    _0x559fad = _0x559fad.replace("sıkıyım", "***");
    _0x559fad = _0x559fad.replace("orspu", "***");
    _0x559fad = _0x559fad.replace("annenızın", "***");
    _0x559fad = _0x559fad.replace("anneni", "***");
    _0x559fad = _0x559fad.replace("skym", "***");
    _0x559fad = _0x559fad.replace("sikeyim", "***");
    _0x559fad = _0x559fad.replace("SİKEN", "***");
    _0x559fad = _0x559fad.replace("sikeyim", "***");
    _0x559fad = _0x559fad.replace("sikeyim", "***");
    _0x559fad = _0x559fad.replace("vagina", "***");
    _0x559fad = _0x559fad.replace("ILAH", "***");
    _0x559fad = _0x559fad.replace("ilah", "***");
    _0x559fad = _0x559fad.replace("LAILAH", "***");
    _0x559fad = _0x559fad.replace("lailah", "***");
    _0x559fad = _0x559fad.replace("vagina", "***");
    return _0x559fad;
  }
  function _0x549cd7(_0x304c11) {}
  function _0x59057e(_0x4e0986) {}
  function _0x316e0b(_0x53cff8) {}
  function _0x38a98f(_0x339cc0) {
    if (_0x18263b) {
      _0x339536 *= Math.pow(
        0.9,
        _0x339cc0.wheelDelta / -120 || _0x339cc0.detail || 0
      );
      if (_0x339536 < 0.4) {
        _0x339536 = 0.4;
      }
      if (_0x339536 > 10 / _0x1402f0) {
        _0x339536 = 10 / _0x1402f0;
      }
    } else {
      _0x339536 *= Math.pow(
        0.9,
        _0x339cc0.wheelDelta / -120 || _0x339cc0.detail || 0
      );
      if (_0x339536 < 0.01) {
        _0x339536 = 0.01;
      }
      if (_0x339536 > 4 / _0x1402f0) {
        _0x339536 = 4 / _0x1402f0;
      }
    }
  }
  /**
   * Modern Spatial Indexing (Quadtree Builder) 2026
   * Bu fonksiyon, hücrelerin çarpışma ve titreme (wobble) hesaplamalarını
   * CPU'yu yormadan yapmasını sağlar.
   */
  function updateSpatialIndex() {
    // _0x1402f0: currentScale (Kamera ölçeği)
    // _0x2cf3cf: quadTree (Mevcut ağaç yapısı)
    // _0x3e0cc8: allCells (Tüm hücreler listesi)

    // Eğer zoom çok küçükse hesaplamayı durdur (Performans tasarrufu)
    if (_0x1402f0 < 0.4) {
      _0x2cf3cf = null;
      return;
    }

    // 1. Adım: Görünür alandaki sınırları (Bounding Box) belirle
    let minX = Infinity,
      minY = Infinity;
    let maxX = -Infinity,
      maxY = -Infinity;
    let maxCellSize = 0;
    let visibleCells = [];

    for (const cell of _0x3e0cc8) {
      // Hücre ekranda mı ve işlenmeye değer mi?
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

    // 2. Adım: Quadtree'yi modern verilerle modernize et
    // _0x2c6038: QuadtreeFactory (Ağaç oluşturucu sistem)
    _0x2cf3cf = _0x2c6038.init({
      minX: minX - (maxCellSize + 100),
      minY: minY - (maxCellSize + 100),
      maxX: maxX + (maxCellSize + 100),
      maxY: maxY + (maxCellSize + 100),
      maxChildren: 2,
      maxDepth: 4,
    });

    // 3. Adım: Görünür hücrelerin noktalarını ağaca yerleştir
    // Sadece viewport (ekran) içindeki noktaları ekleyerek GPU yükünü azaltıyoruz
    const halfWidth = _0x35ab87 / 2 / _0x1402f0;
    const halfHeight = _0x84b5f1 / 2 / _0x1402f0;

    const viewLeft = _0x4f5429 - halfWidth;
    const viewRight = _0x4f5429 + halfWidth;
    const viewTop = _0x1f0529 - halfHeight;
    const viewBottom = _0x1f0529 + halfHeight;

    for (const cell of visibleCells) {
      // Her hücrenin etrafındaki noktaları (points) dön
      for (const point of cell.points) {
        // Nokta tam olarak ekran sınırları içindeyse Quadtree'ye ekle
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

  // Override (Geriye dönük uyumluluk)
  var _0x1a661f = updateSpatialIndex;
  function _0x439b61() {
    if (window.isAutoAiming) return; // Kilitliyken mouse koordinatlarını güncelleme
    _0x4232df = (_0x7a7861 - _0x35ab87 / 2) / _0x1402f0 + _0x4f5429;
    _0x4ddae1 = (_0x2aaf30 - _0x84b5f1 / 2) / _0x1402f0 + _0x1f0529;
  }
  function _0x455917() {
    _0x1c7fca = false;
    document.getElementById("main-login-section").hide(1);
  }
  function _0x4620f0(_0x2d44ba) {
    _0x1c7fca = true;
    if (_0x2d44ba == "fast") {
      document.getElementById("main-login-section").show(0.2);
    } else {
      document.getElementById("main-login-section").show(0.5);
    }
  }
  function _0x1dcff8() {
    document.getElementById("stats_hightesmass").innerHTML = _0x2bc39b;
    document.getElementById("stats_timealive").innerHTML = _0xdd7d12(
      (Date.now() - _0x443ee3) / 1000
    );
    document.getElementById("stats_topposition").innerHTML =
      _0x40174c == 0 ? ":(" : _0x40174c;
    document.getElementById("infoOverlays").show(0.5);
  }
  function _0x30f669() {
    if (_0x225ef1 == null) {
      return 0;
    }
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
    _0x2be5c9 = 0;
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
  // Kontrol sırasını tutan değişken (-1: Ana Hücre, 0: Bot1, 1: Bot2...)
  window.controlIndex = -1;

  // Bu fonksiyonu dosyanın içindeki eski haliyle değiştir
  function _0x13b31b(_0x9710ef, forceMain = false) {
    // Eğer forceMain true ise veya kontrol indeksi -1 ise ana sokete gönder
    if (forceMain || window.controlIndex === -1) {
      if (_0x41adc2 && _0x41adc2.readyState === 1) {
        _0x41adc2.send(_0x9710ef.buffer);
      }
    }
    // Değilse seçili bot soketine gönder
    else {
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
    var _0xc65ea6;
    _0xc65ea6 = _0x51333f(5);
    _0xc65ea6.setUint8(0, 255);
    _0xc65ea6.setUint32(1, 1332175218, true);
    _0x13b31b(_0xc65ea6);
    grecaptcha.ready(function () {
      grecaptcha
        .execute("6LcnrKQUAAAAADohV5Cksikz89WSP-ZPHNA7ViZm", {
          action: "play_game",
        })
        .then(function (_0x24fd90) {
          _0x1d7f75(_0x24fd90);
        });
    });
    if (playGameClickEvent == 1) {
      _0x3007c8();
    }
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
        _0x14a358 = true;
        break;
      case 49:
        if (!_0xf47615) {
          _0x14a358 = false;
        }
        _0xd46307 = null;
        var _0x582a10 = _0x1956d7.getUint32(_0x3b5561, true);
        _0x3b5561 += 4;
        _0x225ef1 = [];
        for (_0x160c99 = 0; _0x160c99 < _0x582a10; ++_0x160c99) {
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
    if (_0x4d4989 & 2) {
      _0x34eaad += 4;
    }
    if (_0x4d4989 & 4) {
      _0x34eaad += 8;
    }
    if (_0x4d4989 & 8) {
      _0x34eaad += 16;
    }
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
  /**
   * 2026 Ultra-Fast World Update (Opcode 16)
   * Senpa.io Style Node Management & Memory Optimization
   */
  function updateWorldNodes(view, offset) {
    const now = Date.now();
    const updateCode = Math.random();
    _0x5b1d69 = now;
    _0x171ae9 = false;

    // 1. Yeme Olayları (Kim kimi yedi?)
    const eatCount = view.getUint16(offset, true);
    offset += 2;

    for (let i = 0; i < eatCount; i++) {
      const eater = _0x44d2ff[view.getUint32(offset, true)];
      const eaten = _0x44d2ff[view.getUint32(offset + 4, true)];
      offset += 8;

      if (eater && eaten) {
        eaten.destroy(); // Hücreyi silinmek üzere işaretle
        // Senpa.io Yumuşak Yeme Efekti: Yenen hücre yiyene doğru çekilir
        eaten.ox = eaten.x;
        eaten.oy = eaten.y;
        eaten.oSize = eaten.size;
        eaten.nx = eater.x;
        eaten.ny = eater.y;
        eaten.nSize = eaten.size;
        eaten.updateTime = now;
      }
    }

    // 2. Hücre Güncellemeleri ve Yeni Hücreler
    while (true) {
      const id = view.getUint32(offset, true);
      offset += 4;
      if (id === 0) break; // Liste bitti

      const nx = view.getInt16(offset, true);
      offset += 2;
      const ny = view.getInt16(offset, true);
      offset += 2;
      const size = view.getInt16(offset, true);
      offset += 2;

      // Renk İşleme (Bitwise ile %400 daha hızlı)
      const r = view.getUint8(offset++);
      const g = view.getUint8(offset++);
      const b = view.getUint8(offset++);
      const color =
        "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);

      const flags = view.getUint8(offset++);
      const isVirus = !!(flags & 1);
      const isAgitated = !!(flags & 16);

      // Opsiyonel Data (Protokol gereği atlanması gereken kısımlar)
      if (flags & 2) offset += 4;
      if (flags & 4) offset += 8;
      if (flags & 8) offset += 16;

      // İsim Okuma (UTF-16 Null Terminated)
      let name = "";
      while (true) {
        const charCode = view.getUint16(offset, true);
        offset += 2;
        if (charCode === 0) break;
        name += String.fromCharCode(charCode);
      }

      let node = _0x44d2ff[id];
      if (node) {
        // Mevcut Hücreyi Güncelle
        node.updatePos(); // Önceki pozisyonu sabitle
        node.ox = node.x;
        node.oy = node.y;
        node.oSize = node.size;
        node.color = color;
      } else {
        // Yeni Hücre Oluştur
        node = new _0x2b0fa0(id, nx, ny, size, color, name);
        _0x3e0cc8.push(node);
        _0x44d2ff[id] = node;
        node.ka = nx; // İlk X
        node.la = ny; // İlk Y
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

      // Oyuncunun Kendi Hücresi mi?
      if (_0x1cc1c3.indexOf(id) !== -1 && _0x1cf585.indexOf(node) === -1) {
        // Login ekranını gizle (Eğer yeni doğduysak)
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

    // 3. Silinen Hücreler
    // 3. Silinen Hücreler
    // 3. Silinen Hücreler
    // 3. Silinen Hücreler

    const removeCount = view.getUint32(offset, true);

    offset += 4;

    for (let i = 0; i < removeCount; i++) {
      //buga girme sorunu

      const removeId = view.getUint32(offset, true);

      offset += 4;

      const node = _0x44d2ff[removeId];

      if (node) node.destroy();
    }

    // 4. Reset Durumları
    if (_0x171ae9 && _0x1cf585.length === 0) {
      _0x1dcff8("slow"); // Ölüm ekranı tetikle
    }
  }

  // Orijinal İsmiyle Override
  var _0xa513e8 = updateWorldNodes;
  window._0x5474e3 = function () {
    // Eğer fare son gönderilen konumdan çok az hareket ettiyse boşuna paket gönderme (CPU tasarrufu)
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
    var _0xdbb0c7 = document.getElementById("nick").value;
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
      // DEĞİŞİKLİK BURADA: İkinci parametre 'true' verilerek ana sokete zorlanıyor
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
    _0xe72a47.width = _0x35ab87;
    _0xe72a47.height = _0x84b5f1;
    _0x5cf431();
  }
  function _0x951755() {
    var _0x563629;
    _0x563629 = Math.max(_0x84b5f1 / 1080, _0x35ab87 / 1920);
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

        // Parçaların ne kadar yayıldığını ölç
        if (cell.x < minX) minX = cell.x;
        if (cell.y < minY) minY = cell.y;
        if (cell.x > maxX) maxX = cell.x;
        if (cell.y > maxY) maxY = cell.y;
      }

      // Kütleye dayalı temel zoom
      var baseZoom = Math.pow(Math.min(64 / totalSize, 1), 0.4) * _0x951755();

      // Yayılmaya dayalı ekstra zoom (Parçalar uzaksa ekranı uzaklaştır)
      var spreadX = (maxX - minX) * 0.6; // Yayılma genişliği
      var spreadY = (maxY - minY) * 0.6; // Yayılma yüksekliği
      var spreadZoom = Math.min(
        _0x35ab87 / (1000 + spreadX),
        _0x84b5f1 / (1000 + spreadY)
      );

      // En güvenli zoom değerini seç (Hangi değer daha çok alanı gösteriyorsa)
      var targetZoom = Math.min(baseZoom, spreadZoom);

      // Zoom hızı (Yumuşak geçiş)
      _0x1402f0 = (_0x1402f0 * 19 + targetZoom) / 20;
    }
  }

  // --- BU BLOĞU _0x5cf431 FONKSİYONUNUN DIŞINA, EN ÜSTE KOY ---
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
      // Rakipleri listeye ekle (İSİM DAHİL EDİLDİ)
      var limited = tempEnemies.slice(0, 200);
      for (var i = 0; i < limited.length; i++) {
        enemies.push({
          id: limited[i].id,
          x: limited[i].x,
          y: limited[i].y,
          s: limited[i].size,
          c: limited[i].color,
          n: limited[i].name, // Burası kritik: İsim verisini pakete ekliyoruz
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
  }, 16); // 40ms yerine 100ms yaparsan işlemci çok daha rahatlar (Multibox için yeterlidir)

  function _0x5cf431() {
    var _0x448cd4;
    var _0x56c4ef = Date.now();
    ++_0xe1267f;
    var _0x17ac81 = Date.now() - _0x2c6c3e;
    if (_0x17ac81 > 15) {
      _0x2c6c3e = Date.now();
      _0x5474e3();
    }
    _0x5b1d69 = _0x56c4ef;
    if (_0x1cf585.length > 0) {
      _0x44fc5b(); // Zoom hesapla

      var totalX = 0,
        totalY = 0;
      var minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;

      // Tüm parçalarımızı tara
      for (var i = 0; i < _0x1cf585.length; i++) {
        var cell = _0x1cf585[i];
        cell.updatePos();

        // Ağırlıklı merkez için koordinatları topla
        totalX += cell.x;
        totalY += cell.y;

        // En uç noktaları belirle (Zoom için lazım olacak)
        if (cell.x < minX) minX = cell.x;
        if (cell.y < minY) minY = cell.y;
        if (cell.x > maxX) maxX = cell.x;
        if (cell.y > maxY) maxY = cell.y;
      }

      // 1. ODAKLANMA: Parçaların tam ortasını bul
      _0x1b6830 = totalX / _0x1cf585.length; // Hedef X
      _0x552165 = totalY / _0x1cf585.length; // Hedef Y
      _0x503f66 = _0x1402f0;

      // 2. HIZ: Kameranın takip hızı (0.1 çok yavaştı, 0.3 yaptık)
      // --- SENPA TARZI ESNEK KAMERA ---
      var elasticFactor = 0.12; // Bu sayı ne kadar küçükse kamera o kadar 'yumuşak' takip eder (0.10 - 0.15 idealdir)
      _0x4f5429 += (_0x1b6830 - _0x4f5429) * elasticFactor;
      _0x1f0529 += (_0x552165 - _0x1f0529) * elasticFactor;
    } else {
      // Öldüğümüzde veya izlemedeyken kamera yumuşak kalsın
      _0x4f5429 = (_0x4f5429 * 29 + _0x1b6830) / 30;
      _0x1f0529 = (_0x1f0529 * 29 + _0x552165) / 30;
      _0x1402f0 = (_0x1402f0 * 9 + _0x503f66 * _0x951755()) / 10;
    }
    _0x1a661f();
    _0x439b61();
    // YENİ RADIAL GRADIENT (MERKEZDEN DIŞA DOĞRU KARARMA)
    var gradient = _0x16b27b.createRadialGradient(
      _0x35ab87 / 2,
      _0x84b5f1 / 2,
      0, // Merkez noktası
      _0x35ab87 / 2,
      _0x84b5f1 / 2,
      _0x35ab87 / 1.2 // Yayılma çapı
    );
    // Saf Siyah Kontrast Arka Plan
    var gradient = _0x16b27b.createRadialGradient(
      _0x35ab87 / 2,
      _0x84b5f1 / 2,
      0,
      _0x35ab87 / 2,
      _0x84b5f1 / 2,
      _0x35ab87
    );
    gradient.addColorStop(0, "#080808"); // Merkez: Çok koyu füme (Solukluğu alan renk)
    gradient.addColorStop(1, "#000000"); // Kenarlar: Saf Tam Siyah

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
    // --- ANA HÜCRE STİLİNDE GHOST DRAWER (PERFORMANS MODU) ---
    _0x16b27b.save();
    var drawnIDs = new Set(); // Aynı hücreyi 3 botun birden çizmesini engeller (Kasmayı bitiren anahtar)

    for (var sessionID in window.ghostSessions) {
      var gData = window.ghostSessions[sessionID];
      // Eğer veri eskiyse veya kendi tab'ımızsa atla
      if (gData.tabID === window.tabID || Date.now() - gData.lastUpdate > 150)
        continue;

      if (gData.enemies) {
        for (var i = 0; i < gData.enemies.length; i++) {
          var e = gData.enemies[i];

          // Zaten ana ekranda varsa veya başka bir bot çizdiyse veya çok küçükse atla
          if (_0x44d2ff[e.id] || drawnIDs.has(e.id) || (e.s < 85 && !e.v))
            continue;

          drawnIDs.add(e.id); // Çizildi işaretle

          // 1. GÖVDE ÇİZİMİ
          if (e.v) {
            // e.v true ise bu bir virüstür (diken)
            var isSirenBlueGhost = Date.now() % 400 < 200;
            var sirenColorGhost = isSirenBlueGhost ? "#0055FF" : "#FF0000";

            _0x16b27b.globalAlpha = 1.0;
            _0x16b27b.fillStyle = sirenColorGhost;
            _0x16b27b.shadowBlur = 15; // Daha güçlü siren parlaması
            _0x16b27b.shadowColor = sirenColorGhost;
          } else {
            _0x16b27b.globalAlpha = 0.3; // Normal oyuncular şeffaf kalsın
            _0x16b27b.fillStyle = e.c;
            _0x16b27b.shadowBlur = 0;
          }

          _0x16b27b.beginPath();
          _0x16b27b.arc(e.x, e.y, e.v ? e.s * 1.1 : e.s, 0, Math.PI * 2);
          _0x16b27b.fill();
          _0x16b27b.shadowBlur = 0; // Diğer çizimleri etkilememesi için sıfırla

          // 2. İSİM ÇİZİMİ (ANA HÜCRE STİLİ - SİYAH POPS)
          if (e.n && !window._0x23ab14) {
            // _0x23ab14 önüne 'window.' eklendi
            _0x16b27b.save();
            _0x16b27b.globalAlpha = 0.8; // Yazı biraz daha belirgin olsun

            // Ana hücrendeki font ve boyut mantığı
            var nameSize = Math.max(~~(e.s * 0.2), 24);
            _0x16b27b.font = nameSize + "px Poppins";
            _0x16b27b.textAlign = "center";
            _0x16b27b.textBaseline = "middle";

            // ANA HÜCRENİN SİYAH YAZI STİLİ
            _0x16b27b.fillStyle = "#000";

            // İsmi temizle ve yaz (Split hızı için)
            var cleanName =
              e.n.indexOf("}") !== -1 ? e.n.split("}").pop() : e.n;
            _0x16b27b.fillText(cleanName, e.x, e.y);

            _0x16b27b.restore();
          }
        }
      }
    }
    _0x16b27b.restore();
    // --- MULTI-GHOST DRAWING END ---
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
    if (_0x7ac7be == true) {
      _0x16b27b.globalAlpha = 0.6;
    } else {
      _0x16b27b.globalAlpha = 1;
    }
    for (_0x4a53dc = 0; _0x4a53dc < _0x3e0cc8.length; _0x4a53dc++) {
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
    if (!_0x2653d4) {
      if (_0x4e0f0e != null && _0x4e0f0e.width > 0) {
        _0x16b27b.drawImage(_0x4e0f0e, 0, _0x84b5f1 - _0x4e0f0e.height - 50);
      }
    }
    _0x4fea95 = _0x3af1d3();
    _0x2bc39b = Math.max(_0x2bc39b, _0x4fea95);
    _0x16b27b.globalAlpha = 0.8;
    if (_0x456030 == true) {
      _0x16b27b.fillStyle = "#FFFFFF";
    } else {
      _0x16b27b.fillStyle = "#000000";
    }
    _0x16b27b.font = "24px Ubuntu";
    _0x16b27b.fillText("Score: " + _0x4fea95, 10, 34);
    _0x16b27b.fillText("Max: " + _0x2bc39b, 10, 60);
    if (this.countdown < 3600) {
      var _0x4fda26 = "";
      var _0x48083a = Math.floor(this.countdown / 60);
      if (_0x48083a < 10) {
        _0x4fda26 += "0";
      }
      _0x4fda26 += _0x48083a + ":";
      var _0x261599 = this.countdown % 60;
      if (_0x261599 < 10) {
        _0x4fda26 += "0";
      }
      _0x4fda26 += _0x261599;
      _0x16b27b.globalAlpha = 0.4;
      if (_0x456030 == false) {
        _0x16b27b.fillStyle = "#000000";
      } else {
        _0x16b27b.fillStyle = "#DDDDDD";
      }
      _0x16b27b.globalAlpha = 1;
      if (_0x456030 == true) {
        _0x16b27b.fillStyle = "#5959eb";
      } else {
        _0x16b27b.fillStyle = "#0000FF";
      }
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
      if (_0x456030 == true) {
        _0x16b27b.fillStyle = "#FFFFFF";
      } else {
        _0x16b27b.fillStyle = "#000000";
      }
      _0x16b27b.fillText(_0x5bf63c, _0x3893ec, _0x3b81f2 - 15);
    }
    if (_0x2653d4 == false) {
      var _0x1865c9 = 0;
      for (var _0x42d0b2 = _0x48203d.length - 1; _0x42d0b2 >= 0; _0x42d0b2--) {
        _0x1865c9++;
        if (_0x1865c9 > 15) {
          break;
        }
        var _0xc6a056 = _0x48203d[_0x42d0b2].name.trim();
        if (_0xc6a056 == "") {
          _0xc6a056 = "Agar.io";
        }
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
        if (_0x456030 == true) {
          _0x16b27b.fillStyle = "#FFFFFF";
        } else {
          _0x16b27b.fillStyle = "#000000";
        }
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
    if (_0xdce442 < 0.4) {
      _0xdce442 = 0.4;
    }
    if (_0xdce442 > 1) {
      _0xdce442 = 1;
    }
    _0xafbc37();
  }
  /**
   * 2026 High-End Minimap & Radar Engine
   * Senpa.io Style Glassmorphism & Neon Sectors
   */
  function updateMinimap() {
    // Eğer oyuncu hücresi yoksa çizme (Performans)
    if (_0x1cf585.length === 0) return;

    const ctx = _0x16b27b;
    const mapSize = 200; // Minimap boyutu
    const margin = 10;
    const posX = _0x35ab87 - mapSize - margin;
    const posY = _0x84b5f1 - mapSize - margin;

    ctx.save();

    // 1. Arka Plan: Modern Glassmorphism
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "rgba(0,0,0,0.5)";

    // Yuvarlatılmış köşe fonksiyonunu (daha önce eklemiştik) kullanıyoruz
    if (typeof drawRoundedRect === "function") {
      drawRoundedRect(ctx, posX, posY, mapSize, mapSize, 10);
      ctx.fill();
    } else {
      ctx.fillRect(posX, posY, mapSize, mapSize);
    }
    ctx.shadowBlur = 0;

    // Harita Sınır Oranları
    const mapW = _0x55af78 - _0x22b0f0;
    const mapH = _0x13322c - _0x12d6c2;

    // 2. Sektör Izgarası ve Koordinatlar (A1, B2...)
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.font = "bold 11px 'Ubuntu', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const sectorSize = mapSize / 5;

    // Mevcut Sektörü Belirle (Oyuncunun ilk hücresine göre)
    const playerX = _0x1cf585[0].x;
    const playerY = _0x1cf585[0].y;
    const currentSectorX = Math.floor(((playerX - _0x22b0f0) / mapW) * 5);
    const currentSectorY = Math.floor(((playerY - _0x12d6c2) / mapH) * 5);

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        const sX = posX + i * sectorSize;
        const sY = posY + j * sectorSize;

        // Mevcut Sektörü Aydınlat (Neon Glow)
        if (i === currentSectorX && j === currentSectorY) {
          ctx.fillStyle = "rgba(204, 255, 0, 0.15)"; // Senpa Sarısı/Yeşili
          ctx.fillRect(sX, sY, sectorSize, sectorSize);
          ctx.fillStyle = "rgba(204, 255, 0, 0.5)";
        } else {
          ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        }

        // Sektör Çizgileri
        ctx.strokeRect(sX, sY, sectorSize, sectorSize);

        // Koordinat Yazıları (A1, B2 vb.)
        const label = String.fromCharCode(65 + j) + (i + 1);
        ctx.fillText(label, sX + sectorSize / 2, sY + sectorSize / 2);
      }
    }

    // 3. Oyuncu Parçalarını Çiz (Radar Dots)
    for (let i = 0; i < _0x1cf585.length; i++) {
      const cell = _0x1cf585[i];

      // Harita üzerindeki normalize edilmiş pozisyon
      const ratioX = (cell.x - _0x22b0f0) / mapW;
      const ratioY = (cell.y - _0x12d6c2) / mapH;

      const dotX = posX + ratioX * mapSize;
      const dotY = posY + ratioY * mapSize;

      // Hücre boyutuna göre nokta büyüklüğü (Min: 2px, Max: 10px)
      const dotSize = Math.max(3, Math.min(10, cell.size / 50));

      ctx.beginPath();
      ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);

      // Neon Efekti
      ctx.fillStyle = cell.color || "#FFFFFF";
      ctx.shadowBlur = 8;
      ctx.shadowColor = cell.color || "#FFFFFF";
      ctx.fill();

      // Kontür
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.closePath();
    }

    ctx.restore();
  }

  // Orijinal İsmiyle Bağlama
  var _0xafbc37 = updateMinimap;
  /**
   * 2026 High-Performance Background Engine
   * Senpa.io Style Infinite Grid
   * Tek tek çizgi çizmek yerine "Tek Seferlik Path" mantığıyla FPS'i sabitler.
   */
  function updateGridAndBackground() {
    const isDark = _0x456030;
    // Sadece düz arka plan rengi atıyoruz, çizgileri (grid) hesaplamıyoruz.
    _0x16b27b.fillStyle = isDark ? "#080808" : "#F2FBFF";
    _0x16b27b.fillRect(0, 0, _0x35ab87, _0x84b5f1);
  }

  /**
   * 2026 Ultra-Fast Score Calculator
   * Oyuncunun toplam skorunu Senpa.io hızıyla hesaplar.
   */
  function calculatePlayerScore() {
    // _0x1cf585: Oyuncunun sahip olduğu hücreler dizisi
    if (!_0x1cf585 || _0x1cf585.length === 0) return 0;

    // Modern JS ile en hızlı toplama yöntemi
    return _0x1cf585.reduce((total, cell) => {
      return total + (cell.getScore ? cell.getScore() : 0);
    }, 0);
  }

  // Orijinal isimlerle override ediyoruz
  var _0x2b6f28 = updateGridAndBackground;
  var _0x3af1d3 = calculatePlayerScore;
  /**
   * 2026 Ultra-Developed Leaderboard System
   * Glassmorphism Design & High-Performance Rendering
   */
  // Global önbellek nesnesi (Bellek sızıntısını önlemek için)
  window.lbCache = {
    canvas: document.createElement("canvas"),
    crownImg: new Image(),
    lastData: "",
  };
  window.lbCache.crownImg.src = "/imgs/lbfirst.png"; // Resim bir kez yüklenir

  function updateLeaderboardUI() {
    // _0xd46307: Team Data (Pasta dilimleri)
    // _0x225ef1: Leaderboard Player Data
    // _0x1cc1c3: My Cell IDs
    // _0x573162: Last Winner / Mode Title

    const isTeams = _0xd46307 != null;
    const hasData = isTeams || (_0x225ef1 && _0x225ef1.length > 0);

    if (!hasData) {
      _0x1afb5a = null;
      return;
    }

    // Canvas Hazırlığı
    if (!_0x1afb5a) _0x1afb5a = window.lbCache.canvas;
    const ctx = _0x1afb5a.getContext("2d");

    // Boyut Hesaplama (Dinamik Scaling)
    const baseWidth = 220;
    let baseHeight = isTeams ? 240 : 100 + _0x225ef1.length * 28;
    const scale =
      Math.min(_0x84b5f1 * 0.22, Math.min(220, _0x35ab87 * 0.3)) / 200;

    _0x1afb5a.width = baseWidth * scale;
    _0x1afb5a.height = baseHeight * scale;
    ctx.scale(scale, scale);

    // 1. Arka Plan: Glassmorphism (Cam Efekti)
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "#000000";
    // Yuvarlatılmış köşeler (Modern UI)
    drawRoundedRect(ctx, 0, 0, baseWidth, baseHeight, 15);
    ctx.fill();
    ctx.restore();

    // Kenarlık Parlaması (Neon Glow)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    drawRoundedRect(ctx, 0, 0, baseWidth, baseHeight, 15);
    ctx.stroke();

    if (!isTeams) {
      // --- Standart Liderlik Tablosu (FFA/Solo) ---
      ctx.font = "bold 20px 'Poppins', 'Ubuntu', sans-serif";
      ctx.fillStyle = "#FFD700"; // Altın Sarısı Başlık
      ctx.textAlign = "center";
      ctx.fillText("LEADERBOARD", baseWidth / 2, 35);

      // Birinciye Taç Çizimi
      if (window.lbCache.crownImg.complete) {
        ctx.drawImage(window.lbCache.crownImg, baseWidth / 2 - 15, 5, 30, 30);
      }

      ctx.textAlign = "left";
      ctx.font = "bold 16px 'Ubuntu', sans-serif";

      for (let i = 0; i < _0x225ef1.length; i++) {
        const player = _0x225ef1[i];
        let name = player.name
          ? _0x52210d(player.name.split("*")[0])[1]
          : "Unnamed Cell";
        if (name.trim() === "") name = "Unnamed Cell";

        const isMe = _0x1cc1c3.indexOf(player.id) !== -1;

        // Satır Renkleri ve Parlama
        if (isMe) {
          ctx.fillStyle = "#00F2FF"; // Oyuncu Parlak Turkuaz
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#00F2FF";
        } else {
          ctx.fillStyle = i === 0 ? "#FFD700" : "#FFFFFF"; // 1. Altın, diğerleri Beyaz
          ctx.shadowBlur = 0;
        }

        const rankText = i + 1 + ". " + name;
        ctx.fillText(rankText, 20, 75 + i * 26);
      }
    } else {
      // --- Takım Modu (Modern Donut Chart) ---
      ctx.font = "bold 20px 'Poppins', sans-serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";
      ctx.fillText("TEAMS", 100, 35);

      let startAngle = 0;
      const centerX = 100,
        centerY = 135,
        radius = 70;

      for (let i = 0; i < _0xd46307.length; i++) {
        const share = _0xd46307[i];
        const sliceAngle = share * Math.PI * 2;
        const teamColor = _0x3bf563[i + 1] || "#FFFFFF";

        ctx.fillStyle = teamColor;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.fill();

        startAngle += sliceAngle;
      }

      // Ortayı Boşalt (Donut Effect)
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";

      // Merkeze İkon veya Toplam Skor Yazılabilir
      ctx.fillStyle = "white";
      ctx.font = "bold 12px Ubuntu";
      ctx.fillText("DOMINATION", centerX, centerY + 5);
    }
  }

  // Yardımcı Fonksiyon: Yuvarlatılmış Dikdörtgen
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

  // Orijinal İsmiyle Bağlıyoruz
  var _0x1cc94d = updateLeaderboardUI;
  function _0x2b0fa0(
    _0x39b709,
    _0x3da54c,
    _0x6b6308,
    _0x21a90b,
    _0x4b5169,
    _0x2c8a27
  ) {
    this.id = _0x39b709;
    this.ox = this.x = _0x3da54c;
    this.oy = this.y = _0x6b6308;
    this.oSize = this.size = _0x21a90b;
    this.color = _0x4b5169;
    this.points = [];
    this.pointsAcc = [];
    this.createPoints();
    this.setName(_0x2c8a27);
  }
  /**
   * 2026 Text & Canvas Engine Constructor
   * İsim ve Skor metinlerinin temelini oluşturur.
   */
  function _0x2a421a(size, color, stroke, strokeColor) {
    this._size = size || 16;
    this._color = color || "#FFFFFF";
    this._stroke = !!stroke;
    this._strokeColor = strokeColor || "#000000";
    this._dirty = true;
  }

  /**
   * Senpa.io Style Play & Spectate Logic
   * Oyuna giriş ve izleyici modu geçişleri.
   */
  _0x1154df.playGame = function () {
    const nickInput = document.getElementById("nick");
    const nick = nickInput.value.trim();

    _0x4fea95 = 0; // Current Score
    _0x2bc39b = 0; // Max Score

    if (!nick) {
      _0x105918("LÜTFEN BİR NİCK GİRİN!", "error"); // Daha önce geliştirdiğimiz modern alert
      nickInput.focus();
      return;
    }

    _0x455917(); // Giriş ekranını gizle

    // Socket Durum Kontrolü (ReadyState: 1 = OPEN)
    if (!_0x41adc2 || _0x41adc2.readyState !== 1) {
      playGameClickEvent = 1;
      _0xde92b2(); // Yeniden bağlan
    } else {
      _0x3007c8(); // Mevcut bağlantıyla başla
    }

    _0x443ee3 = Date.now();
    _0x40174c = 0; // Top position
  };

  _0x1154df.spectate = function () {
    _0x1154df.isSpectating = true;
    _0x455917();
    if (!_0x41adc2 || _0x41adc2.readyState !== 1) {
      _0xde92b2();
    } else {
      _0x1519d9(1); // Spectate paketini gönder
    }
  };

  /**
   * Merkezi Ayar Yönetimi (Senpa.io Standardı)
   * Her ayar için ayrı fonksiyon yerine tek bir işlemci.
   */
  const updateGameSetting = (key, elementId, globalVar, isBool = true) => {
    const el = document.getElementById(elementId);
    if (!el) return;

    const value = isBool ? el.checked : el.value;
    window[globalVar] = value;
    localStorage.setItem(key, value);

    // Özel durumlar (Chat gizleme gibi)
    if (elementId === "hideChat") {
      document.getElementById("chat_textbox").style.display = value
        ? "none"
        : "block";
    }
    // Smooth Render ayarı
    if (elementId === "smoothRender") {
      _0x2582ca = value ? 2 : 0.4;
    }
  };

  // Global Fonksiyonları Tek Tek Atıyoruz (Buton uyumluluğu için)
  _0x1154df.setHideSkins = () =>
    updateGameSetting("noSkin", "noSkin", "_0x5d5ae3");
  _0x1154df.setHideNames = () =>
    updateGameSetting("noNames", "noNames", "_0x23ab14");
  _0x1154df.setDarkTheme = () =>
    updateGameSetting("showDarkTheme", "darkTheme", "_0x456030");
  _0x1154df.setNoColor = () =>
    updateGameSetting("noColor", "noColor", "_0x319c56");
  _0x1154df.setSmooth = () =>
    updateGameSetting("smoothRender", "smoothRender", "_0x2582ca", false);
  _0x1154df.setTransparent = () =>
    updateGameSetting("transparentRender", "transparentRender", "_0x7ac7be");
  _0x1154df.setShowScore = () =>
    updateGameSetting("showScore", "showScore", "_0x16e8c8");
  _0x1154df.setSimpleGreen = () =>
    updateGameSetting("simpleGreen", "simpleGreen", "_0x2eb996");
  _0x1154df.setHideChat = () =>
    updateGameSetting("hideChat", "hideChat", "_0x2653d4");
  _0x1154df.setZoom = () => updateGameSetting("zoom", "getZoom", "_0x18263b");

  _0x1154df.clearChat = () => {
    _0x48203d = [];
  };
  _0x1154df.shareLocation = () => {
    if (_0x2cbf37()) _0x512281("psx2psx2");
  };

  /**
   * Senpa.io Seviyesi İstatistik ve Ping Takibi
   */
  // İstatistik Döngüsü (Her saniye)
  setInterval(() => {
    const currentPos = _0x30f669();
    if (currentPos !== 0) {
      _0x2be5c9++; // Time alive
      if (_0x40174c === 0 || currentPos < _0x40174c) {
        _0x40174c = currentPos; // Best position update
      }
    }
  }, 1000);

  // Ultra-Hassas Ping Döngüsü (performance.now() kullanarak)
  setInterval(() => {
    if (_0x2cbf37()) {
      const pingMsg = _0x51333f(5);
      pingMsg.setUint8(0, 90);
      pingMsg.setUint32(1, 123456789, true);

      // 2026 Standartı: performance.now() - Milisaniyenin binde biri hassasiyetindedir.
      window.lastPingTime = performance.now();
      _0x13b31b(pingMsg);
    }
  }, 1000);
  var _0x6a2dc8 = 500;
  var _0x5668bb = -1;
  var _0x12d92b = -1;
  var _0x19ba49 = null;
  var _0xdce442 = 1;
  var _0x275cab = null;
  var _0x460680 = {};
  var _0x4837a9 = {};
  var _0x4ae9a1 = ["_canvas'blob"];
  _0x2b0fa0.prototype = {
    id: 0,
    points: null,
    pointsAcc: null,
    name: null,
    skinName: null,
    hasSkinName: false,
    nameCache: null,
    sizeCache: null,
    x: 0,
    y: 0,
    size: 0,
    ox: 0,
    oy: 0,
    oSize: 0,
    nx: 0,
    ny: 0,
    nSize: 0,
    flag: 0,
    updateTime: 0,
    updateCode: 0,
    drawTime: 0,
    destroyed: false,
    isVirus: false,
    isAgitated: false,
    wasSimpleDrawing: true,
    destroy: function () {
      var _0x2c9ad8;
      for (_0x2c9ad8 = 0; _0x2c9ad8 < _0x3e0cc8.length; _0x2c9ad8++) {
        if (_0x3e0cc8[_0x2c9ad8] == this) {
          _0x3e0cc8.splice(_0x2c9ad8, 1);
          break;
        }
      }
      delete _0x44d2ff[this.id];
      _0x2c9ad8 = _0x1cf585.indexOf(this);
      if (_0x2c9ad8 != -1) {
        _0x171ae9 = true;
        _0x1cf585.splice(_0x2c9ad8, 1);
      }
      _0x2c9ad8 = _0x1cc1c3.indexOf(this.id);
      if (_0x2c9ad8 != -1) {
        _0x1cc1c3.splice(_0x2c9ad8, 1);
      }
      this.destroyed = true;
      _0x551ae1.push(this);
    },
    getNameSize: function () {
      return Math.max(~~(this.size * 0.3), 24);
    },
    setName: function (_0x33c324) {
      if ((this.name = _0x33c324)) {
        if (this.nameCache == null) {
          this.nameCache = new _0x2a421a(
            this.getNameSize(),
            "#FFFFFF",
            true,
            "#000000"
          );
          this.nameCache.setValue(this.name);
        } else {
          this.nameCache.setSize(this.getNameSize());
          this.nameCache.setValue(this.name);
        }
      }
    },
    setSkinName: function (_0x2f2cc1) {
      this.skinName = _0x2f2cc1;
    },
    createPoints: function () {
      for (
        var _0x4f6652 = this.getNumPoints();
        this.points.length > _0x4f6652;

      ) {
        var _0x121419 = ~~(Math.random() * this.points.length);
        this.points.splice(_0x121419, 1);
        this.pointsAcc.splice(_0x121419, 1);
      }
      if (this.points.length == 0 && _0x4f6652 > 0) {
        this.points.push({
          ref: this,
          size: this.size,
          x: this.x,
          y: this.y,
        });
        this.pointsAcc.push(Math.random() - 0.5);
      }
      while (this.points.length < _0x4f6652) {
        var _0x51082f = ~~(Math.random() * this.points.length);
        var _0x25a973 = this.points[_0x51082f];
        this.points.splice(_0x51082f, 0, {
          ref: this,
          size: _0x25a973.size,
          x: _0x25a973.x,
          y: _0x25a973.y,
        });
        this.pointsAcc.splice(_0x51082f, 0, this.pointsAcc[_0x51082f]);
      }
    },
    getNumPoints: function () {
      if (this.id == 0) {
        return 16;
      }
      var _0xbb338f = 10;
      if (this.size < 20) {
        _0xbb338f = 0;
      }
      if (this.isVirus) {
        _0xbb338f = 30;
      }
      var _0x216633 = this.size;
      if (!this.isVirus) {
        _0x216633 *= _0x1402f0;
      }
      _0x216633 *= _0xdce442;
      if (this.flag & 32) {
        _0x216633 *= 0.25;
      }
      return ~~Math.max(_0x216633, _0xbb338f);
    },
    movePoints: function () {
      this.createPoints();
      var _0x3f9575 = this.points;
      var _0x141f04 = this.pointsAcc;
      for (
        var _0x374cc3 = _0x3f9575.length, _0x48405f = 0;
        _0x48405f < _0x374cc3;
        ++_0x48405f
      ) {
        var _0x46a559 = _0x141f04[(_0x48405f - 1 + _0x374cc3) % _0x374cc3];
        var _0x1bedcf = _0x141f04[(_0x48405f + 1) % _0x374cc3];
        _0x141f04[_0x48405f] +=
          (Math.random() - 0.5) * (this.isAgitated ? 3 : 1);
        _0x141f04[_0x48405f] *= 0.7;
        if (_0x141f04[_0x48405f] > 10) {
          _0x141f04[_0x48405f] = 10;
        }
        if (_0x141f04[_0x48405f] < -10) {
          _0x141f04[_0x48405f] = -10;
        }
        _0x141f04[_0x48405f] =
          (_0x46a559 + _0x1bedcf + _0x141f04[_0x48405f] * 8) / 10;
      }
      var _0x326611 = this;
      var _0x4c4c63 = this.isVirus
        ? 0
        : (this.id / 1000 + _0x5b1d69 / 10000) % (Math.PI * 2);
      for (var _0x2f658e = 0; _0x2f658e < _0x374cc3; ++_0x2f658e) {
        var _0x4d0969 = _0x3f9575[_0x2f658e].size;
        var _0x963d36 = _0x3f9575[(_0x2f658e - 1 + _0x374cc3) % _0x374cc3].size;
        var _0x40e749 = _0x3f9575[(_0x2f658e + 1) % _0x374cc3].size;
        if (
          this.size > 15 &&
          _0x2cf3cf != null &&
          this.size * _0x1402f0 > 20 &&
          this.id != 0
        ) {
          var _0x4c3100 = false;
          var _0x31ffe4 = _0x3f9575[_0x2f658e].x;
          var _0x595b4e = _0x3f9575[_0x2f658e].y;
          _0x2cf3cf.retrieve2(
            _0x31ffe4 - 5,
            _0x595b4e - 5,
            10,
            10,
            function (_0x27dd26) {
              if (
                _0x27dd26.ref != _0x326611 &&
                (_0x31ffe4 - _0x27dd26.x) * (_0x31ffe4 - _0x27dd26.x) +
                  (_0x595b4e - _0x27dd26.y) * (_0x595b4e - _0x27dd26.y) <
                  25
              ) {
                _0x4c3100 = true;
              }
            }
          );
          if (
            (!_0x4c3100 && _0x3f9575[_0x2f658e].x < _0x22b0f0) ||
            _0x3f9575[_0x2f658e].y < _0x12d6c2 ||
            _0x3f9575[_0x2f658e].x > _0x55af78 ||
            _0x3f9575[_0x2f658e].y > _0x13322c
          ) {
            _0x4c3100 = true;
          }
          if (_0x4c3100) {
            if (_0x141f04[_0x2f658e] > 0) {
              _0x141f04[_0x2f658e] = 0;
            }
            _0x141f04[_0x2f658e] -= 1;
          }
        }
        _0x4d0969 += _0x141f04[_0x2f658e];
        if (_0x4d0969 < 0) {
          _0x4d0969 = 0;
        }
        _0x4d0969 = this.isAgitated
          ? (_0x4d0969 * 19 + this.size) / 20
          : (_0x4d0969 * 12 + this.size) / 13;
        _0x3f9575[_0x2f658e].size =
          (_0x963d36 + _0x40e749 + _0x4d0969 * 8) / 10;
        _0x963d36 = (Math.PI * 2) / _0x374cc3;
        _0x40e749 = this.points[_0x2f658e].size;
        if (this.isVirus && _0x2f658e % 2 == 0) {
          _0x40e749 += 5;
        }
        _0x3f9575[_0x2f658e].x =
          this.x + Math.cos(_0x963d36 * _0x2f658e + _0x4c4c63) * _0x40e749;
        _0x3f9575[_0x2f658e].y =
          this.y + Math.sin(_0x963d36 * _0x2f658e + _0x4c4c63) * _0x40e749;
      }
    },
    updatePos: function () {
      if (this.id == 0) {
        return 1;
      }
      var _0x5cc491;
      _0x5cc491 = (_0x5b1d69 - this.updateTime) / 149;
      _0x5cc491 = _0x5cc491 < 0 ? 0 : _0x5cc491 > 1 ? 1 : _0x5cc491;
      var _0x25d5d5 = _0x5cc491 < 0 ? 0 : _0x5cc491 > 1 ? 1 : _0x5cc491;
      this.getNameSize();
      if (this.destroyed && _0x25d5d5 >= 1) {
        var _0x4be2bb = _0x551ae1.indexOf(this);
        if (_0x4be2bb != -1) {
          _0x551ae1.splice(_0x4be2bb, 1);
        }
      }
      this.x = _0x5cc491 * (this.nx - this.ox) + this.ox;
      this.y = _0x5cc491 * (this.ny - this.oy) + this.oy;
      this.size = _0x25d5d5 * (this.nSize - this.oSize) + this.oSize;
      return _0x25d5d5;
    },
    shouldRender: function () {
      if (this.id == 0) return true;

      // Senpa.io SEVİYESİ: Ekranın 3 katı genişliğinde bir alanı render listesinde tut.
      // Artık ne kadar uzaklaşırsan uzaklaş, sunucunun gönderdiği hiçbir hücre "silinmeyecek".
      const viewRangeX = (_0x35ab87 * 1.5) / _0x1402f0;
      const viewRangeY = (_0x84b5f1 * 1.5) / _0x1402f0;

      const left = _0x4f5429 - viewRangeX;
      const right = _0x4f5429 + viewRangeX;
      const top = _0x1f0529 - viewRangeY;
      const bottom = _0x1f0529 + viewRangeY;

      // Görünürlük payını (margin) 2000 birime çıkartıyoruz.
      const margin = this.size + 2000;

      if (this.x + margin < left) return false;
      if (this.y + margin < top) return false;
      if (this.x - margin > right) return false;
      if (this.y - margin > bottom) return false;

      return true;
    },
    getScore: function () {
      var _0x2012c3 = ~~((this.nSize * this.nSize) / 100);
      return _0x2012c3;
    },
    drawOneCell: function (_0x4c36dc) {
      function darkenColor(hex, percent) {
        if (!hex) return "#FFFFFF";
        let num = parseInt(hex.slice(1), 16);
        let r = (num >> 16) & 255;
        let g = (num >> 8) & 255;
        let b = num & 255;
        r = Math.max(0, Math.floor(r * (1 - percent)));
        g = Math.max(0, Math.floor(g * (1 - percent)));
        b = Math.max(0, Math.floor(b * (1 - percent)));
        return (
          "#" + (16777216 + (r << 16) + (g << 8) + b).toString(16).slice(1)
        );
      }

      if (this.shouldRender()) {
        // --- RENK BELİRLEME MANTIĞI BURADA BAŞLIYOR ---
        var isMainCell = window._0x1cf585.indexOf(this) !== -1;
        var finalColor = this.color; // Varsayılan renk
        var isActive = false;

        // 1. Durum: Ana Hücre mi Seçili?
        if (window.controlIndex === -1) {
          if (isMainCell) {
            isActive = true;
          }
        }
        // 2. Durum: Botlardan Biri mi Seçili?
        else {
          var currentBotSocket = window.extraSockets[window.controlIndex];
          if (currentBotSocket && currentBotSocket.botID) {
            // Hücre ID'si botun ID'si ile eşleşiyor mu (16 parça dahil kontrol)
            if (
              this.id >= currentBotSocket.botID &&
              this.id < currentBotSocket.botID + 16
            ) {
              isActive = true;
            }
          }
        }

        // Eğer aktif olan buysa rengi BEYAZ yap, değilse orijinal kalsın
        if (isActive) {
          finalColor = "#FFFFFF";
        }
        // --- RENK BELİRLEME MANTIĞI BİTTİ ---

        var _0x3ed467 =
          this.id != 0 &&
          !this.isVirus &&
          !this.isAgitated &&
          _0x2582ca > _0x1402f0;
        if (this.getNumPoints() < 5) {
          _0x3ed467 = true;
        }

        _0x4c36dc.save();
        this.updatePos();

        if (this.destroyed) {
          _0x4c36dc.globalAlpha *= 1 - _0x3640bb;
        }

        _0x4c36dc.lineWidth = 10;

        // BURADA finalColor DEĞİŞKENİNİ KULLANIYORUZ
        if (_0x319c56) {
          _0x4c36dc.fillStyle = darkenColor("#FFFFFF", 0.3);
          _0x4c36dc.strokeStyle = darkenColor("#AAAAAA", 0.3);
        } else {
          _0x4c36dc.fillStyle = isActive
            ? "#FFFFFF"
            : darkenColor(finalColor, 0.3);
          _0x4c36dc.strokeStyle = isActive
            ? "#FFFFFF"
            : darkenColor(finalColor, 0.3);
        }

        // Kontür kalınlığı (Beyaz olduğunda daha net görünsün diye)
        if (isActive) {
          _0x4c36dc.lineWidth = this.size * 0.05 + 5;
          _0x4c36dc.globalAlpha = 1.0; // Aktif olan tam parlak olsun
        }

        // ... geri kalan çizim kodları (beginPath, arc, fill, stroke vs.) aynı kalacak ...
        if (this.isVirus) {
          // Polis Sireni Mantığı: Her 200ms'de bir renk değiştir (Kırmızı - Mavi)
          var isSirenBlue = Date.now() % 400 < 200;
          var sirenColor = isSirenBlue ? "#0055FF" : "#FF0000"; // Canlı Mavi ve Kırmızı

          _0x4c36dc.fillStyle = isSirenBlue
            ? "rgba(0, 85, 255, 0.8)"
            : "rgba(255, 0, 0, 0.8)";
          _0x4c36dc.strokeStyle = "#FFFFFF"; // Kenarlar beyaz olsun ki daha çok parlasın
          _0x4c36dc.lineWidth = 12; // Daha kalın ve belirgin kenarlık

          // Patlama/Yansıma efekti (Glow)
          _0x4c36dc.shadowBlur = 35;
          _0x4c36dc.shadowColor = sirenColor;
        }
        if (_0x1cf585.indexOf(this) !== -1) {
          _0x4c36dc.fillStyle = "#FFFFFF";
          _0x4c36dc.strokeStyle = "#FFFFFF";
          _0x4c36dc.lineWidth = this.size * 0.25;
        }
        _0x4c36dc.globalAlpha = 0.9;
        // Eğer hücre çok büyükse veya FPS tasarrufu gerekiyorsa karmaşık çizimi kapat
        if (this.size * _0x1402f0 < 100) _0x3ed467 = true;
        if (_0x3ed467 || _0x2eb996 == true) {
          _0x4c36dc.beginPath();
          _0x4c36dc.arc(
            this.x,
            this.y,
            this.isVirus ? this.size * 1.1 : this.size,
            0,
            Math.PI * 2,
            false
          );
        } else {
          this.movePoints();
          _0x4c36dc.beginPath();
          var _0x58f52c = this.getNumPoints();
          _0x4c36dc.moveTo(this.points[0].x, this.points[0].y);
          for (_0x3640bb = 1; _0x3640bb <= _0x58f52c; ++_0x3640bb) {
            var _0x1cb80f = _0x3640bb % _0x58f52c;
            _0x4c36dc.lineTo(
              this.points[_0x1cb80f].x,
              this.points[_0x1cb80f].y
            );
          }
        }
        _0x4c36dc.closePath();
        _0x3640bb = null;
        if (!this.isAgitated && !_0x5d5ae3 && _0x33ee7e != ":teams") {
          this.skinName = this.name.toLowerCase();
          li = _0x52210d(this.skinName);
          if (!this.isAgitated && this.skinName != "") {
            if (!_0x460680.hasOwnProperty(this.skinName)) {
              _0x460680[this.skinName] = new Image();
              _0x460680[this.skinName].src =
                "https://agar.live/skins/" + li[0] + ".png";
              _0x460680[this.skinName].onload = function () {
                _0x4837a9[this.src] = true;
              };
            }
            if (
              _0x460680[this.skinName].width != 0 &&
              _0x460680[this.skinName].complete
            ) {
              _0x3640bb = _0x460680[this.skinName];
            } else {
              _0x3640bb = null;
            }
          } else {
            _0x3640bb = null;
          }
        }
        _0x3640bb = (_0x1cb80f = _0x3640bb)
          ? _0x4ae9a1.indexOf(this.skinName) != -1
          : false;
        if (!_0x3ed467) {
          _0x4c36dc.stroke();
        }
        _0x4c36dc.fill();
        if (
          _0x1cb80f != null &&
          !_0x3640bb &&
          _0x4837a9.hasOwnProperty(_0x1cb80f.src)
        ) {
          _0x4c36dc.save();
          _0x4c36dc.clip();
          _0x4c36dc.drawImage(
            _0x1cb80f,
            this.x - this.size,
            this.y - this.size,
            this.size * 2,
            this.size * 2
          );
          _0x4c36dc.restore();
        }
        if ((_0x319c56 || this.size > 15) && !_0x3ed467) {
          _0x4c36dc.strokeStyle = "#000000";
          _0x4c36dc.globalAlpha *= 0.1;
          _0x4c36dc.stroke();
        }
        _0x4c36dc.globalAlpha = 1;
        if (
          _0x1cb80f != null &&
          _0x3640bb &&
          _0x4837a9.hasOwnProperty(_0x1cb80f.src)
        ) {
          _0x4c36dc.drawImage(
            _0x1cb80f,
            this.x - this.size * 2,
            this.y - this.size * 2,
            this.size * 4,
            this.size * 4
          );
        }
        _0x3640bb = _0x1cf585.indexOf(this) != -1;
        var _0xbf4c18;
        if (this.id != 0) {
          var _0x3ed467 = ~~this.y;
          if ((!_0x23ab14 || _0x3640bb) && this.name) {
            _0x4c36dc.globalAlpha = 1;
            _0x4c36dc.font = Math.max(~~(this.size * 0.2), 24) + "px Poppins";
            _0x4c36dc.shadowColor = "black";
            _0x4c36dc.shadowBlur = 5;
            _0x4c36dc.shadowOffsetX = 2;
            _0x4c36dc.shadowOffsetY = 2;
            _0x4c36dc.fillStyle = "#000";
            _0x4c36dc.textAlign = "center";
            _0x4c36dc.fillText(_0x52210d(this.name)[1], this.x, this.y);
            _0x4c36dc.shadowBlur = 0;
            _0x4c36dc.shadowOffsetX = 0;
            _0x4c36dc.shadowOffsetY = 0;
          }
          if (
            _0x16e8c8 == true &&
            !this.isAgitated &&
            ~~((this.size * this.size) / 100) >= 330 &&
            this.isVirus == false
          ) {
            _0x4c36dc.globalAlpha = 1;
            _0x4c36dc.font = this.getNameSize() + "px ubuntu";
            var _0x467122 = this.getScore() + "";
            _0x4c36dc.shadowColor = "black";
            _0x4c36dc.shadowBlur = 5;
            _0x4c36dc.fillStyle = "#000";
            _0x4c36dc.textAlign = "center";
            _0x4c36dc.textBaseline = "middle";
            _0x4c36dc.fillText(
              _0x467122,
              this.x,
              this.y + this.getNameSize() + 13
            );
            _0x4c36dc.shadowBlur = 0;
          }
        }
        _0x4c36dc.restore();
      }
    },
  };
  _0x2a421a.prototype = {
    _value: "",
    _color: "#000000",
    _stroke: false,
    _strokeColor: "#000000",
    _size: 16,
    _canvas: null,
    _ctx: null,
    _dirty: false,
    _scale: 1,
    setSize: function (_0x1670b9) {
      if (this._size != _0x1670b9) {
        this._size = _0x1670b9;
        this._dirty = true;
      }
    },
    setScale: function (_0x16badb) {
      if (this._scale != _0x16badb) {
        this._scale = _0x16badb;
        this._dirty = true;
      }
    },
    setStrokeColor: function (_0x3db234) {
      if (this._strokeColor != _0x3db234) {
        this._strokeColor = _0x3db234;
        this._dirty = true;
      }
    },
    setValue: function (_0x49ffb1) {
      if (_0x49ffb1 != this._value) {
        this._value = _0x49ffb1;
        this._dirty = true;
      }
    },
    render: function () {
      if (this._canvas == null) {
        this._canvas = document.createElement("canvas");
        this._ctx = this._canvas.getContext("2d");
      }
      if (this._dirty) {
        this._dirty = false;
        var _0x5fee74 = this._canvas;
        var _0x2a0428 = this._ctx;
        var _0x1dc48b = this._value;
        var _0x2ff3b7 = this._scale;
        var _0x11da08 = this._size;
        var _0x12c1e6 = _0x11da08 + "px Ubuntu";
        _0x2a0428.font = _0x12c1e6;
        var _0x1e2739 = ~~(_0x11da08 * 0.2);
        _0x5fee74.width =
          (_0x2a0428.measureText(_0x1dc48b).width + 8) * _0x2ff3b7;
        _0x5fee74.height = (_0x11da08 + _0x1e2739) * _0x2ff3b7;
        _0x2a0428.font = _0x12c1e6;
        _0x2a0428.scale(_0x2ff3b7, _0x2ff3b7);
        _0x2a0428.globalAlpha = 1;
        _0x2a0428.lineWidth = 3;
        _0x2a0428.strokeStyle = this._strokeColor;
        _0x2a0428.fillStyle = this._color;
        if (this._stroke) {
          _0x2a0428.strokeText(_0x1dc48b, 3, _0x11da08 - _0x1e2739 / 2);
        }
        _0x2a0428.fillText(_0x1dc48b, 3, _0x11da08 - _0x1e2739 / 2);
      }
      return this._canvas;
    },
    getWidth: function () {
      return _0x16b27b.measureText(this._value).width + 6;
    },
  };
  Date.now ||= function () {
    return new Date().getTime();
  };
  var _0x2c6038 = {
    init: function (_0x3d1be4) {
      function _0x353e58(
        _0x482b32,
        _0x3c1d35,
        _0x476725,
        _0x1746eb,
        _0x36d938
      ) {
        this.x = _0x482b32;
        this.y = _0x3c1d35;
        this.w = _0x476725;
        this.h = _0x1746eb;
        this.depth = _0x36d938;
        this.items = [];
        this.nodes = [];
      }
      var _0x5c1143 = _0x3d1be4.maxChildren || 2;
      var _0x802343 = _0x3d1be4.maxDepth || 4;
      _0x353e58.prototype = {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        depth: 0,
        items: null,
        nodes: null,
        exists: function (_0x254c66) {
          for (var _0x3302df = 0; _0x3302df < this.items.length; ++_0x3302df) {
            var _0x628965 = this.items[_0x3302df];
            if (
              _0x628965.x >= _0x254c66.x &&
              _0x628965.y >= _0x254c66.y &&
              _0x628965.x < _0x254c66.x + _0x254c66.w &&
              _0x628965.y < _0x254c66.y + _0x254c66.h
            ) {
              return true;
            }
          }
          if (this.nodes.length != 0) {
            var _0x232933 = this;
            return this.findOverlappingNodes(_0x254c66, function (_0xdbd449) {
              return _0x232933.nodes[_0xdbd449].exists(_0x254c66);
            });
          }
          return false;
        },
        retrieve: function (_0x3cf4e8, _0x2ab994) {
          for (var _0x20284e = 0; _0x20284e < this.items.length; ++_0x20284e) {
            _0x2ab994(this.items[_0x20284e]);
          }
          if (this.nodes.length != 0) {
            var _0x519a4a = this;
            this.findOverlappingNodes(_0x3cf4e8, function (_0x5f1b36) {
              _0x519a4a.nodes[_0x5f1b36].retrieve(_0x3cf4e8, _0x2ab994);
            });
          }
        },
        insert: function (_0x204c02) {
          if (this.nodes.length != 0) {
            this.nodes[this.findInsertNode(_0x204c02)].insert(_0x204c02);
          } else if (this.items.length >= _0x5c1143 && this.depth < _0x802343) {
            this.devide();
            this.nodes[this.findInsertNode(_0x204c02)].insert(_0x204c02);
          } else {
            this.items.push(_0x204c02);
          }
        },
        findInsertNode: function (_0x618f9b) {
          if (_0x618f9b.x < this.x + this.w / 2) {
            if (_0x618f9b.y < this.y + this.h / 2) {
              return 1;
            } else {
              return 2;
            }
          } else if (_0x618f9b.y < this.y + this.h / 2) {
            return 1;
          } else {
            return 3;
          }
        },
        findOverlappingNodes: function (_0x2763e8, _0xcb1dd4) {
          if (
            (_0x2763e8.x < this.x + this.w / 2 &&
              ((_0x2763e8.y < this.y + this.h / 2 && _0xcb1dd4(0)) ||
                (_0x2763e8.y >= this.y + this.h / 2 && _0xcb1dd4(2)))) ||
            (_0x2763e8.x >= this.x + this.w / 2 &&
              ((_0x2763e8.y < this.y + this.h / 2 && _0xcb1dd4(1)) ||
                (_0x2763e8.y >= this.y + this.h / 2 && _0xcb1dd4(3))))
          ) {
            return true;
          } else {
            return false;
          }
        },
        devide: function () {
          var _0x3be714 = this.depth + 1;
          var _0x2e66eb = this.w / 2;
          var _0x37b29f = this.h / 2;
          this.nodes.push(
            new _0x353e58(this.x, this.y, _0x2e66eb, _0x37b29f, _0x3be714)
          );
          this.nodes.push(
            new _0x353e58(
              this.x + _0x2e66eb,
              this.y,
              _0x2e66eb,
              _0x37b29f,
              _0x3be714
            )
          );
          this.nodes.push(
            new _0x353e58(
              this.x,
              this.y + _0x37b29f,
              _0x2e66eb,
              _0x37b29f,
              _0x3be714
            )
          );
          this.nodes.push(
            new _0x353e58(
              this.x + _0x2e66eb,
              this.y + _0x37b29f,
              _0x2e66eb,
              _0x37b29f,
              _0x3be714
            )
          );
          _0x3be714 = this.items;
          this.items = [];
          for (_0x2e66eb = 0; _0x2e66eb < _0x3be714.length; _0x2e66eb++) {
            this.insert(_0x3be714[_0x2e66eb]);
          }
        },
        clear: function () {
          for (var _0x1ce43b = 0; _0x1ce43b < this.nodes.length; _0x1ce43b++) {
            this.nodes[_0x1ce43b].clear();
          }
          this.items.length = 0;
          this.nodes.length = 0;
        },
      };
      var _0x52fbbc = {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
      };
      return {
        root: new _0x353e58(
          _0x3d1be4.minX,
          _0x3d1be4.minY,
          _0x3d1be4.maxX - _0x3d1be4.minX,
          _0x3d1be4.maxY - _0x3d1be4.minY,
          0
        ),
        insert: function (_0x572299) {
          this.root.insert(_0x572299);
        },
        retrieve: function (_0x2795f9, _0x3af323) {
          this.root.retrieve(_0x2795f9, _0x3af323);
        },
        retrieve2: function (
          _0x7d09ff,
          _0x188754,
          _0x185b45,
          _0x23d72,
          _0x45c804
        ) {
          _0x52fbbc.x = _0x7d09ff;
          _0x52fbbc.y = _0x188754;
          _0x52fbbc.w = _0x185b45;
          _0x52fbbc.h = _0x23d72;
          this.root.retrieve(_0x52fbbc, _0x45c804);
        },
        exists: function (_0x49ce91) {
          return this.root.exists(_0x49ce91);
        },
        clear: function () {
          this.root.clear();
        },
      };
    },
  };
  _0x1154df.onload = _0x2c91e6;
})(window, window.jQuery);
(function () {
  var _0x3be2ab = 4;
  var _0x245aa6 = 50;
  function _0x1f677a(_0x550daa) {
    if (_0x550daa.keyCode === 17) {
      for (var _0x5c71e8 = 0; _0x5c71e8 < _0x3be2ab; ++_0x5c71e8) {
        setTimeout(function () {
          window.onkeydown({
            keyCode: 32,
          });
          window.onkeyup({
            keyCode: 32,
          });
        }, _0x5c71e8 * _0x245aa6);
      }
    }
  }
  window.addEventListener("keydown", _0x1f677a);
})();

// 1. Botların Kendi ID'lerini ve Pozisyonlarını Tutacak Liste
window.botInfo = {};

// 2. Gelişmiş Bot Canlandırma
window.respawnBots = function () {
  var nick =
    (document.getElementById("nick")
      ? document.getElementById("nick").value
      : "Agar") + "-Bot";
  window.extraSockets.forEach(function (s) {
    if (s.readyState === 1) {
      var namePacket = new DataView(new ArrayBuffer(1 + nick.length * 2));
      namePacket.setUint8(0, 107);
      for (var i = 0; i < nick.length; i++) {
        namePacket.setUint16(1 + i * 2, nick.charCodeAt(i), true);
      }
      s.send(namePacket.buffer);
    }
  });
};

// --- KESİN RESPAWN SİSTEMİ (1 TUŞU) ---
window.addEventListener("keydown", function (e) {
  // 49 = '1' tuşu. Chat kutusu (chat_textbox) seçili değilken çalışır.
  if (e.keyCode === 49 && document.activeElement.id !== "chat_textbox") {
    if (typeof window.playGame === "function") {
      window.playGame();
      // Ekrana küçük bir uyarı verelim
      if (typeof _0x105918 === "function") {
        _0x105918("YENİDEN DOĞULUYOR...", "success");
      }
    }
  }
});

window.addGhost = function () {
  var s = new WebSocket("wss://" + CONNECTION_URL, ["protocol1", "protocol2"]);
  s.binaryType = "arraybuffer";
  s.botID = null;

  s.onopen = function () {
    console.log("Gözcü Bot Bağlandı - Görüş Paylaşımı Aktif!");
    var v1 = new DataView(new ArrayBuffer(5));
    v1.setUint8(0, 254);
    v1.setUint32(1, 4, true);
    s.send(v1.buffer);
    var v2 = new DataView(new ArrayBuffer(5));
    v2.setUint8(0, 255);
    v2.setUint32(1, 1332175218, true);
    s.send(v2.buffer);
    setTimeout(window.respawnBots, 500);
  };

  s.onmessage = function (msg) {
    var view = new DataView(msg.data);
    var offset = 0;
    if (view.byteLength < 1) return; // Boş paket kontrolü
    var opcode = view.getUint8(offset++);

    if (opcode == 16) {
      var botVisibleEnemies = [];
      // Yenen hücreleri güvenli atla
      if (offset + 2 > view.byteLength) return;
      var eatCount = view.getUint16(offset, true);
      offset += 2 + eatCount * 8;

      while (offset + 10 < view.byteLength) {
        // Hücre verisi için min 10 byte lazım
        var id = view.getUint32(offset, true);
        offset += 4;
        if (id == 0) break;

        var x = view.getInt16(offset, true);
        offset += 2;
        var y = view.getInt16(offset, true);
        offset += 2;
        var size = view.getInt16(offset, true);
        offset += 2;

        // Renk ve Flag (4 byte)
        if (offset + 4 > view.byteLength) break;
        var r = view.getUint8(offset++);
        var g = view.getUint8(offset++);
        var b = view.getUint8(offset++);
        var color =
          "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
        var flags = view.getUint8(offset++);

        if (flags & 2) offset += 4;
        if (flags & 4) offset += 8;
        if (flags & 8) offset += 16;

        var name = "";
        // GÜVENLİ İSİM OKUMA (Hata buradaydı)
        while (offset + 2 <= view.byteLength) {
          var charCode = view.getUint16(offset, true);
          offset += 2;
          if (charCode == 0) break;
          name += String.fromCharCode(charCode);
        }

        if (size >= 10) {
          botVisibleEnemies.push({
            id: id,
            x: x,
            y: y,
            s: size,
            c: color,
            v: !!(flags & 1),
            n: name,
          });
        }
      }

      window.ghostSessions["triple_bot_" + targetRank] = {
        tabID: "spectator_" + targetRank,
        lastUpdate: Date.now(),
        myPieces: [],
        enemies: botVisibleEnemies,
      };
    }
  };

  s.onclose = function () {
    var index = window.extraSockets.indexOf(s);
    if (index > -1) window.extraSockets.splice(index, 1);
    delete window.ghostSessions["bot_vision_" + s.botID];
  };

  window.extraSockets.push(s);
};

window.addEventListener("keydown", function (e) {
  // Q Tuşu (Keycode 81)
  if (e.keyCode === 81 && document.activeElement.id !== "chat_textbox") {
    // Sırayı bir artır
    window.controlIndex++;

    // Eğer bot sayısını geçerse tekrar Ana Hücreye (-1) dön
    if (window.controlIndex >= window.extraSockets.length) {
      window.controlIndex = -1;
    }

    // Ekrana kimin kontrol edildiğini yaz (Daha önce eklediğimiz modern alert)
    var msg =
      window.controlIndex === -1
        ? "KONTROL: ANA HUCRE"
        : "KONTROL: BOT " + (window.controlIndex + 1);

    if (typeof _0x105918 === "function") {
      _0x105918(msg, "info"); // Ekranda parlak yazı çıkar
    } else {
      console.log(msg);
    }
  }
});
// 4. Tuş Dinleyici
window.addEventListener("keydown", function (e) {
  if (e.keyCode === 82 && document.activeElement.id !== "chat_textbox")
    window.respawnBots();
});

// --- GELİŞMİŞ 6'LI PROXY RADAR SİSTEMİ (TOP 6) ---
window.activeSpectators = [];

window.spawnHexaSpectator = function () {
  console.log("Radar Sıfırlanıyor: 6 İzleyici Hazırlanıyor...");

  // 1. Eski botları kapat
  if (window.activeSpectators.length > 0) {
    window.activeSpectators.forEach((s) => {
      try {
        s.onclose = null;
        s.close();
      } catch (e) {}
    });
    window.activeSpectators = [];
  }

  // 2. Ghost verilerini temizle (6 bot için)
  for (let i = 1; i <= 6; i++) {
    delete window.ghostSessions["proxy_bot_" + i];
  }

  if (typeof _0x105918 === "function") {
    _0x105918("RADAR: İLK 6 KİŞİ (3 PROXY) AKTİF", "success");
  }

  // 3. 6 Tane Botu Spawn Et
  setTimeout(() => {
    for (let i = 1; i <= 6; i++) {
      setTimeout(() => {
        createProxyBot(i);
      }, i * 500); // 500ms gecikme güvenlidir
    }
  }, 500);
};

function createProxyBot(targetRank) {
  var bridgeURL = "ws://127.0.0.1:8080?target=" + CONNECTION_URL;
  var s = new WebSocket(bridgeURL, ["protocol1"]);
  s.binaryType = "arraybuffer";

  // ÖNEMLİ: Kapatabilmek için bu socketi listeye ekliyoruz
  window.activeSpectators.push(s);

  s.onopen = function () {
    console.log(`Bot ${targetRank} -> Tünel açıldı.`);

    // El sıkışma paketleri
    setTimeout(() => {
      if (s.readyState !== 1) return;
      var v1 = new DataView(new ArrayBuffer(5));
      v1.setUint8(0, 254);
      v1.setUint32(1, 4, true);
      s.send(v1.buffer);

      setTimeout(() => {
        if (s.readyState !== 1) return;
        var v2 = new DataView(new ArrayBuffer(5));
        v2.setUint8(0, 255);
        v2.setUint32(1, 1332175218, true);
        s.send(v2.buffer);

        // İzleme (Spectate) paketini döngüyle gönder
        setTimeout(() => {
          if (s.readyState === 1) {
            var spec = new DataView(new ArrayBuffer(1));
            spec.setUint8(0, 1);
            for (let i = 0; i < targetRank; i++) {
              setTimeout(() => {
                if (s.readyState === 1) s.send(spec.buffer);
              }, i * 500);
            }
          }
        }, 1000);
      }, 500);
    }, 1000);
  };

  s.onmessage = function (msg) {
    try {
      var view = new DataView(msg.data);
      var opcode = view.getUint8(0);
      if (opcode == 16) {
        var offset = 1;
        var botVisibleEnemies = [];
        var eatCount = view.getUint16(offset, true);
        offset += 2 + eatCount * 8;

        while (offset + 10 < view.byteLength) {
          var id = view.getUint32(offset, true);
          offset += 4;
          if (id == 0) break;
          var nx = view.getInt16(offset, true);
          offset += 2;
          var ny = view.getInt16(offset, true);
          offset += 2;
          var size = view.getInt16(offset, true);
          offset += 2;
          var r = view.getUint8(offset++);
          var g = view.getUint8(offset++);
          var b = view.getUint8(offset++);
          var color =
            "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
          var flags = view.getUint8(offset++);
          if (flags & 2) offset += 4;
          if (flags & 4) offset += 8;
          if (flags & 8) offset += 16;
          var name = "";
          while (offset + 2 <= view.byteLength) {
            var charCode = view.getUint16(offset, true);
            offset += 2;
            if (charCode == 0) break;
            name += String.fromCharCode(charCode);
          }
          if (size > 10)
            botVisibleEnemies.push({
              id,
              x: nx,
              y: ny,
              s: size,
              n: name,
              c: color,
              v: !!(flags & 1),
            });
        }
        window.ghostSessions["proxy_bot_" + targetRank] = {
          tabID: "spectator_" + targetRank,
          lastUpdate: Date.now(),
          enemies: botVisibleEnemies,
        };
      }
    } catch (e) {}
  };

  s.onclose = function () {
    // Kapanınca listeden temizle
    var index = window.activeSpectators.indexOf(s);
    if (index > -1) window.activeSpectators.splice(index, 1);
    delete window.ghostSessions["proxy_bot_" + targetRank];
  };
}

// --- GÜNCELLENMİŞ KLAVYE KONTROL MERKEZİ ---
window.addEventListener("keydown", function (e) {
  // Chat açıksa hiçbir şey yapma
  if (document.activeElement.id === "chat_textbox") return;

  switch (e.keyCode) {
    case 49: // '1' Tuşu - KESİN RESPAWN
      window.controlIndex = -1;
      if (typeof window.playGame === "function") window.playGame();
      if (typeof _0x105918 === "function")
        _0x105918("ANA HESAP DOGURULDU", "success");
      break;

    case 80: // 'P' Tuşu - TOP 6 RADAR RESTART
      if (typeof window.spawnHexaSpectator === "function") {
        window.spawnHexaSpectator();
      }
      break;

    case 81: // 'Q' Tuşu - KONTROL DEĞİŞTİRME
      window.controlIndex++;
      if (window.controlIndex >= window.extraSockets.length)
        window.controlIndex = -1;
      var msg =
        window.controlIndex === -1
          ? "KONTROL: ANA HESAP"
          : "KONTROL: BOT " + (window.controlIndex + 1);
      if (typeof _0x105918 === "function") _0x105918(msg, "info");
      break;

    case 82: // 'R' Tuşu - BOTLARI DOĞUR
      window.respawnBots();
      if (typeof _0x105918 === "function")
        _0x105918("BOTLAR DOGURULDU", "success");
      break;
  }
});
