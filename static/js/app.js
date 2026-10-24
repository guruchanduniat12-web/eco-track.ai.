// EcoTrack AI - Main Frontend Application Logic
// Indian Tricolor Visual Identity System

let allReportsData = [];
let currentStatsData = null;
let currentActiveView = 'dashboard';

const DEFAULT_FALLBACK_STATS = {
  total_reports: 128,
  active_pending: 34,
  high_priority: 12,
  resolved: 94,
  severity_distribution: {
    critical: { count: 4, percent: 12 },
    high: { count: 8, percent: 24 },
    medium: { count: 15, percent: 44 },
    low: { count: 7, percent: 21 }
  },
  status_distribution: {
    pending: 18,
    assigned: 12,
    in_progress: 4,
    resolved: 94
  },
  overview: {
    reports_this_week: 42,
    resolved_this_week: 38,
    avg_resolution_time: '2.4 hrs',
    high_priority_percent: '14%'
  }
};

const DEFAULT_FALLBACK_REPORTS = [
  {
    id: "REF-ET-1048",
    title: "Overflowing bins near bus stop",
    category: "Household & Plastic",
    severity: "Critical",
    status: "Assigned",
    location: "Bus Depot Terminal 2, Pedestrian Plaza",
    ward_zone: "Smart Zone 4-A",
    submitted_at: new Date(Date.now() - 20 * 60000).toISOString(),
    ai_confidence: 94,
    description: "Three 240L municipal bins completely overflowing onto sidewalk. High citizen footfall, immediate compactor clearance required.",
    assigned_to: "Sanitation Crew #07 (Indore Central)",
    latitude: 22.7196,
    longitude: 75.8577,
    image_url: "static/images/sample_bin1.svg",
    citizen_name: "Pooja Verma",
    citizen_phone: "+91 98260 12345"
  },
  {
    id: "REF-ET-1042",
    title: "Waste accumulation near market",
    category: "Organic & Packaging",
    severity: "High",
    status: "In Progress",
    location: "Vegetable Mandi Gate 3, Sector 8",
    ward_zone: "Smart Zone 4-A",
    submitted_at: new Date(Date.now() - 60 * 60000).toISOString(),
    ai_confidence: 89,
    description: "Substantial pile of decomposing organic produce and wooden crates near storm drain. Risk of blockage before evening.",
    assigned_to: "Quick Response Vehicle #03",
    latitude: 22.7240,
    longitude: 75.8625,
    image_url: "static/images/sample_bin2.svg",
    citizen_name: "Anil Sharma",
    citizen_phone: "+91 94250 88219"
  },
  {
    id: "REF-ET-1037",
    title: "Public bin needs collection",
    category: "Mixed Municipal Solid Waste",
    severity: "High",
    status: "Pending",
    location: "Nehru Park East Promenade Entrance",
    ward_zone: "Smart Zone 4-A",
    submitted_at: new Date(Date.now() - 120 * 60000).toISOString(),
    ai_confidence: 86,
    description: "Litter bin tilted, plastic wrappers and beverage cups scattered within 10 meter radius around public benches.",
    assigned_to: null,
    latitude: 22.7150,
    longitude: 75.8710,
    image_url: "static/images/sample_bin3.svg",
    citizen_name: "Vikas Dubey",
    citizen_phone: "+91 97531 44520"
  },
  {
    id: "REF-ET-1020",
    title: "Construction debris dumped on roadside",
    category: "Construction & Demolition",
    severity: "Medium",
    status: "Resolved",
    location: "Ring Road Service Lane, Ward 9",
    ward_zone: "Smart Zone 4-B",
    submitted_at: new Date(Date.now() - 180 * 60000).toISOString(),
    resolved_at: new Date(Date.now() - 30 * 60000).toISOString(),
    ai_confidence: 91,
    description: "Broken bricks, cement sack bags, and plaster debris removed by JCB Loader #04 and transported to processing plant.",
    assigned_to: "C&D Recovery Team #2",
    latitude: 22.7090,
    longitude: 75.8820,
    image_url: "static/images/sample_bin1.svg",
    citizen_name: "Ramesh Patel",
    citizen_phone: "+91 91100 56789"
  },
  {
    id: "REF-ET-1015",
    title: "E-waste scrap bin capacity breach",
    category: "Electronic Waste",
    severity: "Medium",
    status: "Pending",
    location: "IT Park Hub 1, Green Collection Kiosk",
    ward_zone: "Smart Zone 4-C",
    submitted_at: new Date(Date.now() - 300 * 60000).toISOString(),
    ai_confidence: 93,
    description: "Designated e-waste drop-off container has reached 100% capacity. Safe recycling transfer protocol needed.",
    assigned_to: null,
    latitude: 22.7290,
    longitude: 75.8900,
    image_url: "static/images/sample_bin2.svg",
    citizen_name: "Sneha Kulkarni",
    citizen_phone: "+91 99260 77112"
  },
  {
    id: "REF-ET-1008",
    title: "Commercial cartons and plastic wrappers",
    category: "Commercial Recyclables",
    severity: "Low",
    status: "Resolved",
    location: "Main Market Commercial Arcade",
    ward_zone: "Smart Zone 4-A",
    submitted_at: new Date(Date.now() - 480 * 60000).toISOString(),
    resolved_at: new Date(Date.now() - 60 * 60000).toISOString(),
    ai_confidence: 88,
    description: "Cardboard packaging sorted and collected for dry-waste MRF facility.",
    assigned_to: "Dry Waste Collector #11",
    latitude: 22.7175,
    longitude: 75.8520,
    image_url: "static/images/sample_bin3.svg",
    citizen_name: "Sunil Jain",
    citizen_phone: "+91 98930 22340"
  }
];

const DEFAULT_FALLBACK_ACTIVITIES = [
  { report_id: "REF-ET-1048", action: "Status changed to Assigned", timestamp: new Date(Date.now() - 20 * 60000).toISOString(), type: "assignment" },
  { report_id: "REF-ET-1042", action: "Status changed to In Progress", timestamp: new Date(Date.now() - 60 * 60000).toISOString(), type: "status_change" },
  { report_id: "REF-ET-1037", action: "New report submitted", timestamp: new Date(Date.now() - 120 * 60000).toISOString(), type: "new_report" },
  { report_id: "REF-ET-1020", action: "Status changed to Resolved", timestamp: new Date(Date.now() - 180 * 60000).toISOString(), type: "resolved" }
];

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initFormListeners();
  initOverviewTabs();
  loadDashboardData();
});

function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = item.getAttribute('data-view');
      switchView(targetView);
    });
  });

  const newReportBtns = document.querySelectorAll('.trigger-new-report');
  newReportBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchView('new-report');
    });
  });

  const viewAllLinks = document.querySelectorAll('.trigger-all-reports');
  viewAllLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchView('all-reports');
    });
  });
}

function switchView(viewName) {
  currentActiveView = viewName;

  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.getAttribute('data-view') === viewName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  document.querySelectorAll('.view-panel').forEach(panel => {
    if (panel.id === `view-${viewName}`) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });

  const pageTitle = document.getElementById('headerPageTitle');
  const pageSubtitle = document.getElementById('headerPageSubtitle');
  if (viewName === 'dashboard') {
    pageTitle.textContent = 'Dashboard';
    pageSubtitle.textContent = 'Overview of overflowing garbage reports and key metrics';
    loadDashboardData();
  } else if (viewName === 'new-report') {
    pageTitle.textContent = 'New Citizen Report';
    pageSubtitle.textContent = 'Submit a community waste issue with AI-assisted severity tagging';
  } else if (viewName === 'all-reports') {
    pageTitle.textContent = 'All Reports';
    pageSubtitle.textContent = 'Comprehensive registry of municipal waste complaints and statuses';
    loadAllReports();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function loadDashboardData() {
  try {
    let statsData = DEFAULT_FALLBACK_STATS;
    try {
      const statsRes = await fetch('/api/stats');
      if (statsRes.ok) statsData = await statsRes.json();
    } catch(e) {
      console.warn("Using offline stats fallback:", e);
    }
    currentStatsData = statsData;
    updateStatsUI(currentStatsData);
    renderAnalyticsCharts(currentStatsData);

    let priorityItems = DEFAULT_FALLBACK_REPORTS.slice(0, 3);
    try {
      const priorityRes = await fetch('/api/priority-queue');
      if (priorityRes.ok) priorityItems = await priorityRes.json();
    } catch(e) {
      console.warn("Using offline priority queue fallback:", e);
    }
    renderPriorityQueue(priorityItems);

    let activities = DEFAULT_FALLBACK_ACTIVITIES;
    try {
      const actRes = await fetch('/api/activity');
      if (actRes.ok) activities = await actRes.json();
    } catch(e) {
      console.warn("Using offline activity fallback:", e);
    }
    renderActivityTimeline(activities);

    let reports = DEFAULT_FALLBACK_REPORTS;
    try {
      const reportsRes = await fetch('/api/reports');
      if (reportsRes.ok) reports = await reportsRes.json();
    } catch(e) {
      console.warn("Using offline reports fallback:", e);
    }
    allReportsData = reports;
    initDashboardMap(allReportsData);
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
}

function updateStatsUI(stats) {
  const elTotal = document.getElementById('statTotalReports');
  const elActive = document.getElementById('statActivePending');
  const elHigh = document.getElementById('statHighPriority');
  const elResolved = document.getElementById('statResolved');

  if (elTotal) elTotal.textContent = stats.total_reports;
  if (elActive) elActive.textContent = stats.active_pending;
  if (elHigh) elHigh.textContent = stats.high_priority;
  if (elResolved) elResolved.textContent = stats.resolved;

  const sev = stats.severity_distribution;
  if (sev) {
    updateSeverityRow('critical', sev.critical.count, sev.critical.percent);
    updateSeverityRow('high', sev.high.count, sev.high.percent);
    updateSeverityRow('medium', sev.medium.count, sev.medium.percent);
    updateSeverityRow('low', sev.low.count, sev.low.percent);
  }

  const ov = stats.overview;
  if (ov) {
    const elRepWeek = document.getElementById('ovReportsWeek');
    const elResWeek = document.getElementById('ovResolvedWeek');
    const elAvgTime = document.getElementById('ovAvgTime');
    const elHighPct = document.getElementById('ovHighPct');

    if (elRepWeek) elRepWeek.textContent = ov.reports_this_week;
    if (elResWeek) elResWeek.textContent = ov.resolved_this_week;
    if (elAvgTime) elAvgTime.textContent = ov.avg_resolution_time;
    if (elHighPct) elHighPct.textContent = ov.high_priority_percent;
  }
}

function updateSeverityRow(type, count, percent) {
  const countEl = document.getElementById(`sevCount-${type}`);
  const pctEl = document.getElementById(`sevPct-${type}`);
  const barEl = document.getElementById(`sevBar-${type}`);

  if (countEl) countEl.textContent = count;
  if (pctEl) pctEl.textContent = `${percent}%`;
  if (barEl) barEl.style.width = `${Math.min(100, Math.max(10, percent))}%`;
}

function renderPriorityQueue(items) {
  const container = document.getElementById('priorityQueueList');
  if (!container) return;

  if (!items || items.length === 0) {
    container.innerHTML = '<div style="color:#64748B; font-size:13px; text-align:center; padding:20px;">No urgent priority reports pending.</div>';
    return;
  }

  container.innerHTML = items.slice(0, 3).map(item => {
    const badgeClass = item.severity.toLowerCase();
    const timeFormatted = formatTimeAgo(item.submitted_at);
    const imgSrc = item.image_url || 'static/images/sample_bin1.svg';

    return `
      <div class="priority-item" onclick="openReportModal('${item.id}')">
        <div class="priority-left">
          <img src="${imgSrc}" alt="${item.title}" class="priority-thumb" />
          <div class="priority-info">
            <div class="priority-title">${escapeHtml(item.title)}</div>
            <div class="priority-meta">${item.id} · Submitted ${timeFormatted}</div>
          </div>
        </div>
        <div class="priority-right">
          <span class="badge-severity ${badgeClass}">${item.severity}</span>
          <svg class="priority-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>
    `;
  }).join('');
}

function renderActivityTimeline(activities) {
  const container = document.getElementById('activityTimelineList');
  if (!container) return;

  if (!activities || activities.length === 0) {
    container.innerHTML = '<div style="color:#64748B; font-size:13px; text-align:center; padding:20px;">No recent activities.</div>';
    return;
  }

  container.innerHTML = activities.slice(0, 5).map(act => {
    let dotClass = 'dot-green';
    if (act.type === 'assignment') {
      dotClass = 'dot-navy';
    } else if (act.type === 'new_report') {
      dotClass = 'dot-saffron';
    }

    const timeFormatted = formatTimeAgo(act.timestamp);

    return `
      <div class="activity-item">
        <div class="activity-left">
          <span class="activity-dot ${dotClass}"></span>
          <span class="activity-ref">${act.report_id}</span>
          <span class="activity-action">${escapeHtml(act.action)}</span>
        </div>
        <span class="activity-time">${timeFormatted}</span>
      </div>
    `;
  }).join('');
}

async function loadAllReports() {
  const search = (document.getElementById('tableSearchInput')?.value || '').toLowerCase();
  const severity = document.getElementById('filterSeverity')?.value || 'All';
  const status = document.getElementById('filterStatus')?.value || 'All';
  const ward = document.getElementById('filterWard')?.value || 'All';

  try {
    const url = `/api/reports?q=${encodeURIComponent(search)}&severity=${encodeURIComponent(severity)}&status=${encodeURIComponent(status)}&ward=${encodeURIComponent(ward)}`;
    let reports = null;
    try {
      const res = await fetch(url);
      if (res.ok) reports = await res.json();
    } catch(e) {
      console.warn("Using offline all-reports fallback:", e);
    }

    if (!reports) {
      reports = DEFAULT_FALLBACK_REPORTS.filter(r => {
        if (severity !== 'All' && r.severity !== severity) return false;
        if (status !== 'All' && r.status !== status) return false;
        if (ward !== 'All' && r.ward_zone !== ward) return false;
        if (search) {
          const s = `${r.id} ${r.title} ${r.category} ${r.location} ${r.description}`.toLowerCase();
          if (!s.includes(search)) return false;
        }
        return true;
      });
    }

    allReportsData = reports;
    renderReportsTable(allReportsData);
  } catch (e) {
    console.error('Error fetching all reports:', e);
  }
}

function renderReportsTable(reports) {
  const tbody = document.getElementById('reportsTableBody');
  if (!tbody) return;

  if (!reports || reports.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding:32px; color:#64748B;">
          No reports found matching selected criteria.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = reports.map(r => {
    const sevClass = r.severity.toLowerCase();
    const stClass = r.status.toLowerCase().replace(' ', '-');
    const timeFormatted = formatTimeAgo(r.submitted_at);

    return `
      <tr class="table-row-clickable" onclick="openReportModal('${r.id}')">
        <td><span class="table-id-badge">${r.id}</span></td>
        <td>
          <div class="table-title-meta">
            <span class="table-title">${escapeHtml(r.title)}</span>
            <span class="table-location">${escapeHtml(r.location)} (${r.ward_zone})</span>
          </div>
        </td>
        <td><span style="font-size:12.5px; color:#475569;">${escapeHtml(r.category)}</span></td>
        <td><span class="badge-severity ${sevClass}">${r.severity}</span></td>
        <td><span class="badge-status ${stClass}">${r.status}</span></td>
        <td><span style="font-size:12px; color:#64748B;">${timeFormatted}</span></td>
        <td>
          <button class="table-action-btn" onclick="event.stopPropagation(); openReportModal('${r.id}')">
            View / Update
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

let currentSelectedReport = null;

function openReportModal(reportId) {
  const report = allReportsData.find(r => r.id === reportId);
  if (!report) return;

  currentSelectedReport = report;
  const modal = document.getElementById('reportDetailModal');
  const title = document.getElementById('modalReportTitle');
  const idEl = document.getElementById('modalReportId');
  const content = document.getElementById('modalReportContent');

  if (title) title.textContent = report.title;
  if (idEl) idEl.textContent = report.id;

  const sevClass = report.severity.toLowerCase();
  const stClass = report.status.toLowerCase().replace(' ', '-');
  const timeAgo = formatTimeAgo(report.submitted_at);

  content.innerHTML = `
    <div style="display:flex; gap:16px; align-items:flex-start;">
      <img src="${report.image_url || 'static/images/sample_bin1.svg'}" style="width:110px; height:110px; border-radius:10px; object-fit:cover; border:1px solid #E2E8F0;" />
      <div style="display:flex; flex-direction:column; gap:6px; flex:1;">
        <div style="display:flex; gap:8px; align-items:center;">
          <span class="badge-severity ${sevClass}">${report.severity}</span>
          <span class="badge-status ${stClass}">${report.status}</span>
          <span style="font-size:12px; color:#64748B;">Submitted ${timeAgo}</span>
        </div>
        <div style="font-size:13.5px; color:#334155; margin-top:4px;">
          <strong>Location:</strong> ${escapeHtml(report.location)} (${report.ward_zone})
        </div>
        <div style="font-size:13px; color:#334155;">
          <strong>Category:</strong> ${escapeHtml(report.category)}
        </div>
        <div style="font-size:13px; color:#334155;">
          <strong>Assigned Unit:</strong> ${report.assigned_to ? escapeHtml(report.assigned_to) : '<span style="color:#FF9933; font-weight:600;">Unassigned (Auto-Routing Pending)</span>'}
        </div>
      </div>
    </div>

    <div style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:10px; padding:12px 16px; margin-top:8px;">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
        <span style="font-weight:700; font-size:12.5px; color:#138808; display:flex; align-items:center; gap:6px;">
          <svg style="width:16px; height:16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
          AI Computer Vision Diagnostic
        </span>
        <span style="font-weight:700; font-size:12px; color:#138808;">${report.ai_confidence}% Confidence</span>
      </div>
      <div style="font-size:12.5px; color:#334155;">
        ${escapeHtml(report.description || 'Overflowing waste profile detected. Recommended route: Heavy compaction compactor with 2 sanitary workers.')}
      </div>
    </div>

    <div style="display:flex; justify-content:space-between; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:10px 14px; font-size:12px; color:#64748B;">
      <span>Reported by: <strong>${escapeHtml(report.citizen_name || 'Citizen Contributor')}</strong></span>
      <span>Contact: <strong>${escapeHtml(report.citizen_phone || '+91 98000 00000')}</strong></span>
    </div>

    <div style="margin-top:10px;">
      <label style="font-size:12.5px; font-weight:700; color:#1E293B; display:block; margin-bottom:8px;">Update Complaint Status:</label>
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        <button class="table-action-btn" style="background:#FFF4E5; border-color:#FFD8A8; color:#D97706;" onclick="updateReportStatus('${report.id}', 'Pending')">
          Set Pending
        </button>
        <button class="table-action-btn" style="background:#EEF2FF; border-color:#C7D2FE; color:#000080;" onclick="updateReportStatus('${report.id}', 'Assigned', 'Sanitation Crew #07 (Indore Central)')">
          Assign Crew #07
        </button>
        <button class="table-action-btn" style="background:#DCFCE7; border-color:#86EFAC; color:#166534;" onclick="updateReportStatus('${report.id}', 'In Progress')">
          Set In Progress
        </button>
        <button class="table-action-btn" style="background:#138808; border-color:#138808; color:#FFFFFF;" onclick="updateReportStatus('${report.id}', 'Resolved')">
          Mark as Resolved ✓
        </button>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

function closeReportModal() {
  const modal = document.getElementById('reportDetailModal');
  if (modal) modal.classList.remove('active');
  currentSelectedReport = null;
}

async function updateReportStatus(reportId, newStatus, assignedTo) {
  try {
    const res = await fetch(`/api/reports/${reportId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus, assigned_to: assignedTo })
    });

    if (res.ok) {
      const updated = await res.json();
      showToast(`Report ${reportId} updated to ${newStatus}`);
      closeReportModal();

      loadDashboardData();
      if (currentActiveView === 'all-reports') {
        loadAllReports();
      }
    } else {
      showToast('Failed to update status', 'error');
    }
  } catch (e) {
    console.error('Error updating status:', e);
    showToast('Network error while updating status', 'error');
  }
}

let selectedFormImage = 'static/images/sample_bin1.svg';

function initFormListeners() {
  // ── Bin Type card selection ──────────────────────────────────────────
  const binGrid = document.getElementById('binTypeGrid');
  if (binGrid) {
    binGrid.querySelectorAll('.nr-option-card').forEach(card => {
      card.addEventListener('click', () => {
        binGrid.querySelectorAll('.nr-option-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const hiddenCat = document.getElementById('reportCategory');
        if (hiddenCat) hiddenCat.value = card.getAttribute('data-value');
        // auto-set title for backend
        const titleHidden = document.getElementById('reportTitle');
        if (titleHidden) titleHidden.value = 'Overflowing ' + card.getAttribute('data-value') + ' bin';
      });
    });
  }

  // ── Severity card selection ──────────────────────────────────────────
  const sevGrid = document.getElementById('severityGrid');
  if (sevGrid) {
    sevGrid.querySelectorAll('.nr-severity-card').forEach(card => {
      card.addEventListener('click', () => {
        sevGrid.querySelectorAll('.nr-severity-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const hiddenSev = document.getElementById('reportSeverity');
        if (hiddenSev) hiddenSev.value = card.getAttribute('data-value');
      });
    });
  }

  // ── GPS button ───────────────────────────────────────────────────────
  const gpsBtn = document.getElementById('gpsBtn');
  if (gpsBtn) {
    gpsBtn.addEventListener('click', () => {
      if (!navigator.geolocation) {
        showToast('GPS not supported by your browser', 'error');
        return;
      }
      gpsBtn.classList.add('loading');
      gpsBtn.querySelector('span').textContent = 'Locating…';
      navigator.geolocation.getCurrentPosition(
        pos => {
          const locInput = document.getElementById('reportLocation');
          if (locInput) locInput.value = `GPS: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
          gpsBtn.classList.remove('loading');
          gpsBtn.querySelector('span').textContent = 'Use GPS';
          showToast('Location captured via GPS');
        },
        err => {
          gpsBtn.classList.remove('loading');
          gpsBtn.querySelector('span').textContent = 'Use GPS';
          showToast('Unable to get GPS location: ' + err.message, 'error');
        },
        { timeout: 8000 }
      );
    });
  }

  // ── Photo file upload ────────────────────────────────────────────────
  const photoInput = document.getElementById('photoFileInput');
  if (photoInput) {
    photoInput.addEventListener('change', () => {
      const file = photoInput.files[0];
      if (!file) return;
      const maxBytes = 100 * 1024 * 1024; // 100 MB
      if (file.size > maxBytes) {
        showToast('File exceeds 100 MB limit. Please choose a smaller file.', 'error');
        photoInput.value = '';
        return;
      }
      const label = document.getElementById('photoUploadLabel');
      if (label) label.textContent = file.name;
      const reader = new FileReader();
      reader.onload = e => {
        const wrap = document.getElementById('photoPreviewWrap');
        const img = document.getElementById('photoPreviewImg');
        if (wrap && img) {
          img.src = e.target.result;
          wrap.style.display = 'flex';
          wrap.style.alignItems = 'center';
          selectedFormImage = e.target.result; // store data-URL for submission
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // ── Drag-and-drop on photo zone ──────────────────────────────────────
  const photoZone = document.getElementById('photoUploadZone');
  if (photoZone) {
    photoZone.addEventListener('dragover', e => { e.preventDefault(); photoZone.style.borderColor = '#138808'; });
    photoZone.addEventListener('dragleave', () => { photoZone.style.borderColor = ''; });
    photoZone.addEventListener('drop', e => {
      e.preventDefault();
      photoZone.style.borderColor = '';
      const file = e.dataTransfer.files[0];
      if (!file) return;
      const allowed = ['image/png', 'image/jpeg', 'image/webp'];
      if (!allowed.includes(file.type)) { showToast('Only PNG, JPG, and WEBP files are accepted.', 'error'); return; }
      const maxBytes = 100 * 1024 * 1024;
      if (file.size > maxBytes) { showToast('File exceeds 100 MB limit.', 'error'); return; }
      const dt = new DataTransfer();
      dt.items.add(file);
      if (photoInput) photoInput.files = dt.files;
      photoInput.dispatchEvent(new Event('change'));
    });
  }

  // ── Clear button ─────────────────────────────────────────────────────
  const clearBtn = document.getElementById('clearFormBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      const form = document.getElementById('newReportForm');
      if (form) {
        // reset text/tel/textarea inputs
        form.querySelectorAll('input[type=text], input[type=tel], textarea').forEach(el => el.value = '');
        // reset hidden fields
        const hiddenCat = document.getElementById('reportCategory');
        if (hiddenCat) hiddenCat.value = 'General Waste';
        const hiddenSev = document.getElementById('reportSeverity');
        if (hiddenSev) hiddenSev.value = 'Medium';
        const hiddenTitle = document.getElementById('reportTitle');
        if (hiddenTitle) hiddenTitle.value = '';
      }
      // reset bin type → General Waste
      if (binGrid) {
        binGrid.querySelectorAll('.nr-option-card').forEach(c => c.classList.remove('selected'));
        const first = binGrid.querySelector('[data-value="General Waste"]');
        if (first) first.classList.add('selected');
      }
      // reset severity → Medium
      if (sevGrid) {
        sevGrid.querySelectorAll('.nr-severity-card').forEach(c => c.classList.remove('selected'));
        const med = sevGrid.querySelector('[data-value="Medium"]');
        if (med) med.classList.add('selected');
      }
      // reset photo
      clearPhotoPreview();
      showToast('Form cleared');
    });
  }

  // ── Form submit ──────────────────────────────────────────────────────
  const form = document.getElementById('newReportForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Manual required-field validation
      const nameVal = (document.getElementById('citizenName')?.value || '').trim();
      const locVal  = (document.getElementById('reportLocation')?.value || '').trim();
      const catVal  = (document.getElementById('reportCategory')?.value || '').trim();
      const sevVal  = (document.getElementById('reportSeverity')?.value || '').trim();

      if (!nameVal) { showToast('Please enter your name.', 'error'); document.getElementById('citizenName')?.focus(); return; }
      if (!locVal)  { showToast('Please provide the report location.', 'error'); document.getElementById('reportLocation')?.focus(); return; }
      if (!catVal)  { showToast('Please select a bin type.', 'error'); return; }
      if (!sevVal)  { showToast('Please select a severity level.', 'error'); return; }

      // Build title from bin type for backend
      const titleHidden = document.getElementById('reportTitle');
      if (titleHidden && !titleHidden.value) titleHidden.value = 'Overflowing ' + catVal + ' bin';

      const newReportData = {
        title: titleHidden?.value || ('Overflowing ' + catVal + ' bin'),
        category: catVal,
        severity: sevVal,
        location: locVal,
        ward_zone: document.getElementById('reportWard')?.value || 'Smart Zone 4-A',
        description: document.getElementById('reportDescription')?.value || '',
        citizen_name: nameVal,
        citizen_phone: document.getElementById('citizenPhone')?.value || '',
        image_url: selectedFormImage || 'static/images/sample_bin1.svg'
      };

      try {
        const res = await fetch('/api/reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newReportData)
        });

        if (res.ok) {
          const created = await res.json();
          showToast(`Report ${created.id} submitted successfully!`);
          // reset form
          document.getElementById('clearFormBtn')?.click();
          switchView('dashboard');
        } else {
          showToast('Failed to create report', 'error');
        }
      } catch (err) {
        console.error('Error submitting form:', err);
        showToast('Submission error', 'error');
      }
    });
  }

  // ── All Reports table search / filters (unchanged) ───────────────────
  const tableSearch = document.getElementById('tableSearchInput');
  const filterSev = document.getElementById('filterSeverity');
  const filterSt  = document.getElementById('filterStatus');
  const filterWd  = document.getElementById('filterWard');

  if (tableSearch) tableSearch.addEventListener('input', debounce(loadAllReports, 300));
  if (filterSev)  filterSev.addEventListener('change', loadAllReports);
  if (filterSt)   filterSt.addEventListener('change', loadAllReports);
  if (filterWd)   filterWd.addEventListener('change', loadAllReports);
}

// Clear photo preview helper (called from HTML onclick and clear btn)
function clearPhotoPreview() {
  const photoInput = document.getElementById('photoFileInput');
  if (photoInput) photoInput.value = '';
  const wrap = document.getElementById('photoPreviewWrap');
  const img  = document.getElementById('photoPreviewImg');
  const label = document.getElementById('photoUploadLabel');
  if (wrap)  wrap.style.display = 'none';
  if (img)   img.src = '';
  if (label) label.textContent = 'PNG, JPG, WEBP up to 100 MB';
  selectedFormImage = 'static/images/sample_bin1.svg';
}

function initOverviewTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetId = tab.getAttribute('data-tab');
      document.querySelectorAll('.tab-content').forEach(tc => {
        if (tc.id === targetId) {
          tc.classList.add('active');
        } else {
          tc.classList.remove('active');
        }
      });

      if (targetId === 'tabMap' && window.ecoLeafletInstance) {
        window.ecoLeafletInstance.invalidateSize();
      }
    });
  });
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  if (type === 'error') {
    toast.style.borderLeftColor = '#DC2626';
  } else {
    toast.style.borderLeftColor = '#138808';
  }

  toast.innerHTML = `
    <svg style="width:18px; height:18px; color:${type === 'error' ? '#DC2626' : '#138808'}; flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function formatTimeAgo(isoString) {
  if (!isoString) return 'Just now';
  const diff = (new Date() - new Date(isoString)) / 1000;

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}
