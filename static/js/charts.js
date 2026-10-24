// Charts & Analytics for EcoTrack AI
// Indian Tricolor Palette: India Green (#138808), Saffron (#FF9933), Ashoka Chakra Navy (#000080)

function renderAnalyticsCharts(statsData) {
  renderReportsOverTimeChart();
  renderSeverityDistributionChart(statsData);
  renderStatusDistributionChart(statsData);
}

// 1. Reports Over Time (Line Chart)
// Primary line: India Green (#138808), Secondary highlight: Saffron (#FF9933)
function renderReportsOverTimeChart() {
  const container = document.getElementById('chartReportsOverTime');
  if (!container) return;

  container.innerHTML = `
    <div style="font-size: 13px; font-weight: 700; color: #11291A; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
      <span>Reports & Resolution Trend (7 Days)</span>
      <div style="display: flex; gap: 12px; font-size: 11px; font-weight: 600;">
        <span style="display: flex; align-items: center; gap: 4px; color: #138808;">
          <span style="width: 10px; height: 3px; background: #138808; display: inline-block; border-radius: 2px;"></span> Reports
        </span>
        <span style="display: flex; align-items: center; gap: 4px; color: #FF9933;">
          <span style="width: 10px; height: 3px; background: #FF9933; display: inline-block; border-radius: 2px;"></span> Resolved
        </span>
      </div>
    </div>
    <svg viewBox="0 0 500 130" width="100%" height="130" style="overflow: visible;">
      <defs>
        <linearGradient id="greenFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#138808" stop-opacity="0.25" />
          <stop offset="100%" stop-color="#138808" stop-opacity="0.0" />
        </linearGradient>
      </defs>
      
      <line x1="40" y1="20" x2="480" y2="20" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="3 3" />
      <line x1="40" y1="55" x2="480" y2="55" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="3 3" />
      <line x1="40" y1="90" x2="480" y2="90" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="3 3" />

      <path d="M 50 90 L 50 65 L 120 50 L 190 55 L 260 25 L 330 40 L 400 15 L 470 38 L 470 90 Z" fill="url(#greenFill)" />

      <path d="M 50 65 L 120 50 L 190 55 L 260 25 L 330 40 L 400 15 L 470 38" 
            fill="none" stroke="#138808" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      
      <path d="M 50 72 L 120 58 L 190 48 L 260 38 L 330 44 L 400 22 L 470 42" 
            fill="none" stroke="#FF9933" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="5 4" />

      <circle cx="50" cy="65" r="3.5" fill="#FFFFFF" stroke="#138808" stroke-width="2" />
      <circle cx="120" cy="50" r="3.5" fill="#FFFFFF" stroke="#138808" stroke-width="2" />
      <circle cx="190" cy="55" r="3.5" fill="#FFFFFF" stroke="#138808" stroke-width="2" />
      <circle cx="260" cy="25" r="4" fill="#138808" stroke="#FFFFFF" stroke-width="1.5" />
      <circle cx="330" cy="40" r="3.5" fill="#FFFFFF" stroke="#138808" stroke-width="2" />
      <circle cx="400" cy="15" r="4.5" fill="#138808" stroke="#FFFFFF" stroke-width="2" />
      <circle cx="470" cy="38" r="3.5" fill="#FFFFFF" stroke="#138808" stroke-width="2" />

      <text x="50" y="112" font-size="10.5" fill="#64748B" text-anchor="middle">Mon</text>
      <text x="120" y="112" font-size="10.5" fill="#64748B" text-anchor="middle">Tue</text>
      <text x="190" y="112" font-size="10.5" fill="#64748B" text-anchor="middle">Wed</text>
      <text x="260" y="112" font-size="10.5" fill="#64748B" text-anchor="middle">Thu</text>
      <text x="330" y="112" font-size="10.5" fill="#64748B" text-anchor="middle">Fri</text>
      <text x="400" y="112" font-size="10.5" fill="#64748B" text-anchor="middle">Sat</text>
      <text x="470" y="112" font-size="10.5" fill="#64748B" text-anchor="middle">Sun</text>
    </svg>
  `;
}

// 2. Severity Distribution Chart
// Critical -> Red, High -> Saffron, Medium -> Yellow, Low -> India Green
function renderSeverityDistributionChart(stats) {
  const container = document.getElementById('chartSeverityDist');
  if (!container) return;

  const data = [
    { label: 'Critical', count: 4, color: '#DC2626' },
    { label: 'High', count: 8, color: '#FF9933' },
    { label: 'Medium', count: 15, color: '#EAB308' },
    { label: 'Low', count: 7, color: '#138808' }
  ];

  const total = data.reduce((a, b) => a + b.count, 0);

  container.innerHTML = `
    <div style="font-size: 13px; font-weight: 700; color: #11291A; margin-bottom: 8px;">Severity Breakdown</div>
    <div style="display: flex; height: 16px; border-radius: 6px; overflow: hidden; margin-bottom: 12px; box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);">
      ${data.map(d => {
        const pct = ((d.count / total) * 100).toFixed(1);
        return `<div style="width: ${pct}%; background-color: ${d.color};" title="${d.label}: ${d.count} (${pct}%)"></div>`;
      }).join('')}
    </div>
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; font-size: 11px;">
      ${data.map(d => `
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 6px; text-align: center;">
          <div style="font-weight: 700; color: ${d.color}; font-size: 13px;">${d.count}</div>
          <div style="color: #64748B;">${d.label}</div>
        </div>
      `).join('')}
    </div>
  `;
}

// 3. Status Distribution Chart
// Pending -> Saffron (#FF9933), Assigned -> Ashoka Chakra Navy (#000080), In Progress -> Green (#22C55E), Resolved -> India Green (#138808)
function renderStatusDistributionChart(stats) {
  const container = document.getElementById('chartStatusDist');
  if (!container) return;

  const statusItems = [
    { label: 'Pending', count: 18, color: '#FF9933' },
    { label: 'Assigned', count: 12, color: '#000080' },
    { label: 'In Progress', count: 4, color: '#22C55E' },
    { label: 'Resolved', count: 94, color: '#138808' }
  ];

  const total = statusItems.reduce((a, b) => a + b.count, 0);

  container.innerHTML = `
    <div style="font-size: 13px; font-weight: 700; color: #11291A; margin-bottom: 8px;">Status Distribution</div>
    <div style="display: flex; height: 16px; border-radius: 6px; overflow: hidden; margin-bottom: 12px; box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);">
      ${statusItems.map(s => {
        const pct = ((s.count / total) * 100).toFixed(1);
        return `<div style="width: ${pct}%; background-color: ${s.color};" title="${s.label}: ${s.count} (${pct}%)"></div>`;
      }).join('')}
    </div>
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; font-size: 11px;">
      ${statusItems.map(s => `
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 6px; text-align: center;">
          <div style="font-weight: 700; color: ${s.color}; font-size: 13px;">${s.count}</div>
          <div style="color: #64748B;">${s.label}</div>
        </div>
      `).join('')}
    </div>
  `;
}
