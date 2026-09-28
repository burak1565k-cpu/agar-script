(function () {
    var _0x16e4b3 = function (_0x2d3a2e, _0x3e76a1) {
        _0x2d3a2e = _0x2d3a2e - 0x0;
        var _0x53e4f3 = _0x16e4b3[_0x2d3a2e];
        return _0x53e4f3;
    };

    // Vector2 Matematik Sınıfı
    function Vector2(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    Vector2.prototype = {
        set: function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        },
        add: function (v) {
            this.x += v.x;
            this.y += v.y;
            return this;
        },
        sub: function (v) {
            this.x -= v.x;
            this.y -= v.y;
            return this;
        },
        mul: function (s) {
            this.x *= s;
            this.y *= s;
            return this;
        },
        div: function (s) {
            this.x /= s;
            this.y /= s;
            return this;
        },
        magnitude: function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        },
        normalise: function () {
            var m = this.magnitude();
            if (m > 0) this.div(m);
            return this;
        },
        angle: function () {
            return Math.atan2(this.y, this.x);
        },
        dot: function (v) {
            return this.x * v.x + this.y * v.y;
        },
        rotate: function (angle) {
            var cos = Math.cos(angle);
            var sin = Math.sin(angle);
            var x = this.x;
            var y = this.y;
            this.x = x * cos - y * sin;
            this.y = x * sin + y * cos;
            return this;
        }
    };

    // Yardımcı Fonksiyonlar (Cookie ve Script Yükleyici)
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function delete_cookie(name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;';
    }

    function loadJS(FILE_URL, async) {
        var scriptEle = document.createElement("script");
        scriptEle.setAttribute("src", FILE_URL);
        scriptEle.setAttribute("type", "text/javascript");
        scriptEle.setAttribute("async", async);
        document.body.appendChild(scriptEle);
    }

    // Yarıda Kalan Obfuscated Mantık Ekranı ve Tamamlaması
    var _0x4d2a = {
        SNvDi: function (_0x1a2b3c, _0x4d5e6f) {
            return _0x1a2b3c(_0x4d5e6f);
        },
        initBot: function () {
            if (window.botData) {
                console.log("Bot sistemi aktif edildi.");
            }
        }
    };

    // Otomatik Başlatma
    window.Vector2 = Vector2;
    window._botHelpers = _0x4d2a;
})();
