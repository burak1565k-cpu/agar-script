(function () {
  'use strict';

  // WebSocket Paket Gönderici Yakalayıcı
  window.gameWebSocket = null;

  var NativeWebSocket = window.WebSocket;
  window.WebSocket = function (url, protocols) {
    var ws = new NativeWebSocket(url, protocols);
    
    ws.addEventListener('open', function() {
      window.gameWebSocket = ws;
      console.log("WebSocket bağlantısı başarıyla yakalandı.");
    });

    return ws;
  };
  window.WebSocket.prototype = NativeWebSocket.prototype;

  // Güvenli Paket Gönderme
  function sendPacket(opCode) {
    if (window.gameWebSocket && window.gameWebSocket.readyState === 1) {
      var view = new DataView(new ArrayBuffer(1));
      view.setUint8(0, opCode);
      window.gameWebSocket.send(view.buffer);
    }
  }

  // Seri Yem (E) ve Bölünme (Space) Makrosu
  var isFeeding = false;
  var feedInterval = null;

  window.addEventListener("keydown", function (e) {
    // Sohbet kutusuna yazarken makronun çalışmasını engelle
    if (document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) {
      return;
    }

    // E Tuşu - Hızlı Seri Yem
    if (e.keyCode === 69 && !isFeeding) {
      isFeeding = true;
      sendPacket(21);
      feedInterval = setInterval(function () {
        sendPacket(21);
      }, 10);
    }

    // Space - Bölünme
    if (e.keyCode === 32) {
      sendPacket(17);
    }

    // 3 Tuşu - İsim Gizleme
    if (e.keyCode === 51) {
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

  console.log("Agar.live Düzeltilmiş Makro Kodu Aktif!");
})();
