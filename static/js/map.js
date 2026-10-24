// Leaflet & Vector Interactive Map for EcoTrack AI
// Displays Ward Map with colored pins matching severity levels

function initDashboardMap(reports) {
  const mapElement = document.getElementById('leafletMap');
  if (!mapElement) return;

  const defaultLat = 22.7196;
  const defaultLng = 75.8677;

  if (typeof L !== 'undefined') {
    try {
      if (window.ecoLeafletInstance) {
        window.ecoLeafletInstance.remove();
      }

      const map = L.map('leafletMap', {
        zoomControl: true,
        attributionControl: false
      }).setView([defaultLat, defaultLng], 14);

      window.ecoLeafletInstance = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(map);

      const pinColors = {
        'Critical': '#DC2626',
        'High': '#FF9933',
        'Medium': '#2563EB',
        'Low': '#138808'
      };

      const iconSymbols = {
        'Critical': '!',
        'High': '▲',
        'Medium': '●',
        'Low': '✓'
      };

      (reports || []).forEach(rep => {
        if (!rep.latitude || !rep.longitude) return;
        const color = pinColors[rep.severity] || '#138808';
        const symbol = iconSymbols[rep.severity] || '●';

        const customMarkerIcon = L.divIcon({
          className: 'custom-map-pin',
          html: `<div style="
            width: 24px;
            height: 24px;
            background-color: ${color};
            border: 2px solid #FFFFFF;
            border-radius: 50%;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-size: 11px;
            font-weight: 800;
            cursor: pointer;
          ">${symbol}</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([rep.latitude, rep.longitude], { icon: customMarkerIcon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 12px; min-width: 150px;">
            <div style="font-weight: 700; color: #11291A; margin-bottom: 2px;">${rep.id}</div>
            <div style="font-weight: 600; color: #334155; margin-bottom: 4px;">${rep.title}</div>
            <div style="display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; background: ${color}20; color: ${color};">
              ${rep.severity} · ${rep.status}
            </div>
          </div>
        `);
      });

      return;
    } catch (e) {
      console.warn("Leaflet map initialization fallback to SVG:", e);
    }
  }

  renderSvgMapFallback(mapElement, reports);
}

function renderSvgMapFallback(container, reports) {
  container.innerHTML = `
    <svg viewBox="0 0 600 240" width="100%" height="100%" style="background-color: #E2ECE5; border-radius: 8px;">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D1DFD6" stroke-width="1"/>
        </pattern>
      </defs>
      
      <rect width="600" height="240" fill="url(#grid)" />
      
      <path d="M 0 60 Q 200 80 400 50 T 600 90" stroke="#FFFFFF" stroke-width="8" fill="none" />
      <path d="M 0 60 Q 200 80 400 50 T 600 90" stroke="#CBD5E1" stroke-width="2" fill="none" stroke-dasharray="6 4" />
      
      <path d="M 120 0 L 160 240" stroke="#FFFFFF" stroke-width="7" fill="none" />
      <path d="M 380 0 Q 360 120 420 240" stroke="#FFFFFF" stroke-width="8" fill="none" />
      <path d="M 240 70 L 600 170" stroke="#FFFFFF" stroke-width="6" fill="none" />
      
      <path d="M 460 0 C 490 80 520 160 550 240" stroke="#93C5FD" stroke-width="12" fill="none" opacity="0.6" />
      <rect x="50" y="110" width="110" height="70" rx="10" fill="#BBF7D0" opacity="0.5" />
      <text x="75" y="148" font-size="11" fill="#15803D" font-weight="600" opacity="0.8">Nehru Park</text>

      <rect x="250" y="12" width="120" height="22" rx="4" fill="#FFFFFF" opacity="0.9" />
      <text x="262" y="27" font-size="11" fill="#138808" font-weight="700">SMART ZONE 4-A</text>

      <g transform="translate(150, 75)" cursor="pointer">
        <circle cx="0" cy="0" r="10" fill="#DC2626" stroke="#FFFFFF" stroke-width="2" />
        <text x="0" y="4" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">!</text>
      </g>

      <g transform="translate(260, 140)" cursor="pointer">
        <circle cx="0" cy="0" r="10" fill="#FF9933" stroke="#FFFFFF" stroke-width="2" />
        <text x="0" y="4" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">▲</text>
      </g>

      <g transform="translate(420, 115)" cursor="pointer">
        <circle cx="0" cy="0" r="10" fill="#2563EB" stroke="#FFFFFF" stroke-width="2" />
        <text x="0" y="4" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">●</text>
      </g>

      <g transform="translate(370, 45)" cursor="pointer">
        <circle cx="0" cy="0" r="10" fill="#138808" stroke="#FFFFFF" stroke-width="2" />
        <text x="0" y="4" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">✓</text>
      </g>

      <g transform="translate(510, 165)" cursor="pointer">
        <circle cx="0" cy="0" r="10" fill="#DC2626" stroke="#FFFFFF" stroke-width="2" />
        <text x="0" y="4" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">!</text>
      </g>
    </svg>
  `;
}
