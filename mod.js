(function () {
  'use strict';

  // --- 1. SINIRSIZ ZOOM & KAMERA MEKANİZMASI ---
  let customZoom = 1;

  window.addEventListener('wheel', function (e) {
    // Fare tekerleği ile sınırsız uzaklaşma/yakınlaşma
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    customZoom *= zoomFactor;

    // Minimum ve maksimum zoom sınırları haritanın tamamını görecek şekilde genişletildi
    customZoom = Math.max(0.0005, Math.min(customZoom, 50));

    if (window.agarioZoom !== undefined) {
      window.agarioZoom = customZoom;
    }
  }, { passive: true });

  // --- 2. HÜCRE & NESNE FİLTRELERİNİ KALDIRMA ---
  // Ekran alanı (Viewport) dışında kalan hücrelerin gizlenmesini engeller
  if (typeof window.updateSpatialIndex === 'function') {
    const originalUpdateSpatial = window.updateSpatialIndex;
    window.updateSpatialIndex = function () {
      // Orijinal görünürlük sınırlandırmasını ezerek tüm hücreleri işleme alır
      if (this.visibleCells && this.spatialTree) {
        for (let i = 0; i < this.visibleCells.length; i++) {
          const cell = this.visibleCells[i];
          if (cell && cell.points) {
            for (let j = 0; j < cell.points.length; j++) {
              this.spatialTree.insert(cell.points[j]);
            }
          }
        }
      } else {
        originalUpdateSpatial.apply(this, arguments);
      }
    };
  }

  // --- 3. MULTI-BOX & GHOST SESSION TÜM HARİTA ÇİZİMİ ---
  // Diğer sekmelerinizden BroadcastChannel ile gelen verileri boyut/mesafe sınırı olmadan çizer
  if (window.ghostSessions) {
    const originalDrawGhost = window.drawGhostSessions;
    
    window.drawGhostSessions = function (ctx) {
      if (!window.ghostSessions) return;

      const drawnIDs = new Set();
      const currentCells = window.myCells || {};

      for (const sessionKey in window.ghostSessions) {
        const session = window.ghostSessions[sessionKey];
        if (!session || !session.cells) continue;

        for (let i = 0; i < session.cells.length; i++) {
          const cell = session.cells[i];
          
          // Zaten ekranda kendi ana bağınızla çizilen hücreleri tekrar çizme
          if (currentCells[cell.id] || drawnIDs.has(cell.id)) continue;

          // ESKİ KODDAKİ BOYUT VE MESAFA FİLTRESİ (cell.s < 85 vb.) KALDIRILDI
          // Ghost sekmelerin gördüğü her oyuncu/hücre doğrudan tuvale çizilir
          drawnIDs.add(cell.id);

          ctx.save();
          ctx.beginPath();
          ctx.arc(cell.x, cell.y, cell.size || cell.s, 0, Math.PI * 2);
          ctx.fillStyle = cell.color || '#FF0000';
          ctx.globalAlpha = 0.6; // Ghost verileri ayırt etmek için yarı saydam
          ctx.fill();
          ctx.lineWidth = 3;
          ctx.strokeStyle = '#FFFFFF';
          ctx.stroke();

          // İsim Çizimi
          if (cell.name) {
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold ' + Math.max(12, (cell.size || cell.s) * 0.3) + 'px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(cell.name, cell.x, cell.y);
          }
          ctx.restore();
        }
      }
    };
  }

  console.log("Agarlive Harita Görüş & Zoom Eklentisi Aktif.");
})();
