import React, { useEffect, useMemo, useState } from 'react';
import Dashboard from './Dashboard.jsx';
import RequestDetail from './RequestDetail.jsx';
import FilterPanel from './FilterPanel.jsx';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001';
const STORAGE_KEY = 'service-desk-requests-v1';
const seed = [
  { id: '1', customer: 'BMN', ref: 'BMN-001', source: 'ไลน์', receivedAt: '2026-08-27T16:47', ticket: 'BMN000001', location: 'Sukhumvit Corner', contact: 'คุณไจ๋', phone: '', description: 'สื่อลูกค้าเป็นสีขาว ส่วนผลแสดงจอภาพเป็นอมฟ้า', jobType: 'แก้ไขหน้างาน', status: 'รอลูกค้าสรุปงาน', assignee: 'เอ็กซ์', appointment: '', completedAt: '2026-08-27T16:47', action: '', notes: 'รอคอนเฟิร์มกับยูนิลูมีน' },
  { id: '2', customer: 'โรงพยาบาลมิตรภาพ', ref: 'RHM-002', source: 'ไลน์', receivedAt: '2026-08-26T09:46', ticket: 'RHM000002', location: 'โรงพยาบาลมิตรภาพ สระบุรี', contact: 'Magazine', phone: '', description: 'งาน รพ.มิตรภาพ จอ Kiosk มีปัญหาการเล่นสื่อ', jobType: 'รีโมท', status: 'รอลูกค้าสรุปงาน', assignee: 'หนูเล็ก', appointment: '', completedAt: '2026-08-26T16:15', action: '', notes: '' },
  { id: '3', customer: 'Workoplus', ref: 'WOR-003', source: 'ไลน์', receivedAt: '2026-08-24T15:04', ticket: 'WOR000003', location: 'Levis Siam Paragon', contact: 'Siam Paragon', phone: '', description: 'ขอใบเสนอราคาและขอคิวเข้าแก้ไขจอ LED ที่ร้าน ลีวายส์ สาขา สยามพารากอนค่ะ', jobType: 'แก้ไขหน้างาน', status: 'รอลูกค้าสรุปงาน', assignee: '', appointment: '', completedAt: '2026-08-24T15:04', action: '', notes: 'รอตรวจสอบ ขอราคา' },
  { id: '4', customer: 'Besides Umi', ref: 'BSU-004', source: 'ไลน์', receivedAt: '2026-08-13T16:50', ticket: 'BSU000004', location: 'Besides Umi', contact: 'Shin', phone: '', description: 'จอเปิดไม่ติดจากอาการ ลมพัดจอล้ม ส่งทีมเข้าประเมินซ่อม', jobType: 'แก้ไขหน้างาน', status: 'รอลูกค้าสรุปงาน', assignee: 'มาร์ค , เอ็ม', appointment: '2026-08-19T13:00', completedAt: '2026-08-19T16:00', action: 'เข้าตรวจสอบอาการจอเสียหาย เนื่องจากจอโดนลมพัดล้ม ขนาด Kiosk 43 นิ้ว จำนวน 1 จอ', notes: 'รอเสนอราคา' },
  { id: '5', customer: 'GQ', ref: 'GQ-005', source: 'ไลน์', receivedAt: '2026-07-09T16:02', ticket: 'GQ000005', location: 'Mega bangna', contact: '', phone: '', description: 'เมกะบางนาจอหน้าร้านมุมบนขวามือลูกค้าแจ้งมีเสียไป 1 จุด', jobType: 'แก้ไขหน้างาน', status: 'รอลูกค้าสรุปงาน', assignee: '', appointment: '2026-07-18T18:00', completedAt: '2026-07-19T04:00', action: '', notes: '' },
  { id: '6', customer: 'บริษัท ดี.อาร์.แอดเวอร์ไทซิ่ง จำกัด', ref: 'DRA-006', source: 'ไลน์', receivedAt: '2026-07-06T10:58', ticket: 'DRA000006', location: 'True Shop Central Plaza Westgate', contact: '', phone: '', description: 'กล่อง restart เอง พบว่ากล่องเล่นสื่อ H.265 ไม่ได้', jobType: 'รีโมท', status: 'กำลังดำเนินการ', assignee: 'หนูเล็ก , XIE SHAOYANG', appointment: '', completedAt: '', action: 'อยู่ระหว่างประสานงานตรวจสอบกับซัพ', notes: 'ตรวจสอบโปรแกรม' },
];

const emptyRequest = {
  ref: '',
  customer: '',
  source: 'ไลน์',
  receivedAt: '',
  ticket: '',
  location: '',
  site: '',
  contact: '',
  phone: '',
  description: '',
  image: '',
  ma: 'N',
  jobType: 'แก้ไขหน้างาน',
  status: 'รับเรื่อง',
  assignee: '',
  appointment: '',
  appointmentEnd: '',
  action: '',
  result: '',
  equipment: '',
  completedAt: '',
  map: '',
  vehicle: '',
  notes: '',
  file: '',
};

const formatDate = (value) => value ? new Intl.DateTimeFormat('th-TH', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value)) : '-';

const normalizeRequest = (item = {}) => {
  const nextItem = { ...emptyRequest, ...item };
  delete nextItem.priority;
  return nextItem;
};

const readRequests = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/requests`);
    if (!response.ok) {
      throw new Error('Failed to fetch requests');
    }
    const data = await response.json();
    return Array.isArray(data) ? data.map(normalizeRequest) : seed.map(normalizeRequest);
  } catch {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (Array.isArray(stored) && stored.length) {
        return stored.map(normalizeRequest);
      }
    } catch {
      // ignore invalid localStorage data
    }
    return seed.map(normalizeRequest);
  }
};

const buildTrackingPrefix = (customer = '') => {
  const cleaned = String(customer || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 3).toUpperCase();
  return cleaned || 'REQ';
};

const generateTrackingNumber = (customer, existingRequests = []) => {
  const prefix = buildTrackingPrefix(customer);
  const matches = existingRequests
    .map((item) => item.ticket)
    .filter((value) => typeof value === 'string' && value.startsWith(prefix))
    .map((value) => Number.parseInt(value.slice(prefix.length), 10))
    .filter((value) => Number.isFinite(value));

  const next = matches.length ? Math.max(...matches) + 1 : 1;
  return `${prefix}${String(next).padStart(6, '0')}`;
};

const printPdf = (title) => {
  const printWindow = window.open('', '_blank', 'width=1200,height=850');
  if (!printWindow) {
    window.print();
    return;
  }

  const styles = [...document.querySelectorAll('style, link[rel="stylesheet"]')]
    .map((node) => node.outerHTML)
    .join('');

  const content = document.querySelector('.active-view')?.innerHTML || '';
  printWindow.document.write(`<!doctype html><html lang="th"><head><meta charset="UTF-8"><title>${title}</title>${styles}<style>body{background:#fff;padding:20px}.sidebar,.topbar,.toolbar,.page-heading .primary-btn,.daily-actions button{display:none!important}.view{display:block!important;padding:0}.report-card{box-shadow:none}</style></head><body>${content}</body></html>`);
  printWindow.document.close();
  printWindow.focus();
  printWindow.onload = () => {
    printWindow.print();
    printWindow.onafterprint = () => printWindow.close();
  };
};

function App() {
  const [requests, setRequests] = useState(seed.map(normalizeRequest));
  const [view, setView] = useState('requests');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('ทั้งหมด');
  const [filterOpen, setFilterOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({});
  const [editing, setEditing] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [toast, setToast] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRequests = async () => {
      setIsLoading(true);
      setError('');
      try {
        const nextRequests = await readRequests();
        setRequests(nextRequests);
      } catch {
        setError('ไม่สามารถโหลดข้อมูลได้');
      } finally {
        setIsLoading(false);
      }
    };
    loadRequests();
  }, []);

  const filtered = useMemo(() => requests
    .filter((item) => {
      const haystack = Object.values(item).join(' ').toLowerCase();
      const matchesAdvanced = Object.entries(advancedFilters).every(([key, value]) => {
        const selectedValues = Array.isArray(value) ? value : value ? [value] : [];
        return !selectedValues.length || selectedValues.includes(String(item[key] || ''));
      });
      return (!query || haystack.includes(query.toLowerCase()))
        && (status === 'ทั้งหมด' || item.status === status)
        && matchesAdvanced;
    })
    .sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt)), [requests, query, status, advancedFilters]);

  const persist = async (requestItem) => {
    const normalized = normalizeRequest(requestItem);
    const isUpdate = Boolean(normalized.id);
    const endpoint = isUpdate ? `${API_BASE_URL}/api/requests/${normalized.id}` : `${API_BASE_URL}/api/requests`;
    const method = isUpdate ? 'PUT' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalized),
      });

      if (!response.ok) {
        throw new Error('API save failed');
      }

      const saved = normalizeRequest(await response.json());
      const updated = isUpdate
        ? requests.map((item) => item.id === saved.id ? saved : item)
        : [...requests, saved];

      setRequests(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      const fallback = isUpdate
        ? requests.map((item) => item.id === normalized.id ? normalized : item)
        : [...requests, { ...normalized, id: normalized.id || crypto.randomUUID() }];
      setRequests(fallback);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
      return fallback;
    }
  };

  const saveRequest = async (request) => {
    const normalized = normalizeRequest({ ...request });
    const isExisting = Boolean(normalized.id);

    if (!isExisting) {
      normalized.receivedAt = new Date().toISOString();
    }

    const nextTicket = normalized.ticket && normalized.ticket.trim() ? normalized.ticket.trim() : generateTrackingNumber(normalized.customer, requests);
    normalized.ticket = nextTicket;

    const saved = await persist(normalized);
    if (saved) {
      setRequests(saved);
    }
    setEditing(null);
    setToast(isExisting ? 'อัปเดตงานแล้ว' : 'เพิ่มงานใหม่แล้ว');
    setTimeout(() => setToast(''), 2200);
  };

  const handleDeleteRequest = async (requestId) => {
    if (!requestId) return;
    const confirmed = window.confirm('ลบงานนี้ออกจากระบบใช่หรือไม่?');
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/requests/${requestId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Delete failed');
      }

      const next = requests.filter((item) => item.id !== requestId);
      setRequests(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSelectedRequest(null);
      setEditing(null);
      setToast('ลบงานแล้ว');
      setTimeout(() => setToast(''), 2200);
    } catch {
      setError('ลบงานไม่สำเร็จ');
      setToast('ลบงานไม่สำเร็จ');
      setTimeout(() => setToast(''), 2200);
    }
  };

  const exportCsv = () => {
    const headers = ['ลูกค้า', 'Ref.', 'ช่องทาง', 'วันเวลารับแจ้ง', 'เลขติดตาม', 'สถานที่', 'ผู้ติดต่อ', 'รายละเอียด', 'ลักษณะงาน', 'สถานะ', 'ผู้ดำเนินการ', 'วันเวลานัดหมาย', 'วันเวลาเสร็จ', 'การดำเนินการ', 'หมายเหตุ'];
    const keys = ['customer', 'ref', 'source', 'receivedAt', 'ticket', 'location', 'contact', 'description', 'jobType', 'status', 'assignee', 'appointment', 'completedAt', 'action', 'notes'];
    const csv = '\ufeff' + [headers, ...requests.map((row) => keys.map((key) => row[key] || ''))]
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
      .join('\n');

    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    link.download = `service-desk-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">SD</span>
          <div>
            <strong>Service Desk</strong>
            <small>ระบบงานบริการของคุณ</small>
          </div>
        </div>
        <nav className="side-nav">
          <button className={`nav-item ${view === 'requests' ? 'active' : ''}`} onClick={() => setView('requests')}>
            <span>▦</span> งานแจ้งบริการ
          </button>
          <button className={`nav-item ${view === 'reports' ? 'active' : ''}`} onClick={() => setView('reports')}>
            <span>◒</span> รายงานและสถิติ
          </button>
        </nav>
        <div className="side-foot">
          <div className="status-dot" />
          <div>
            <strong>ฐานข้อมูลในเครื่อง</strong>
            <small>ข้อมูลของคุณควบคุมเอง</small>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="mobile-brand">
            <span className="brand-mark">SD</span>
            <strong>Service Desk</strong>
          </div>
          <div className="top-actions">
            <span>{requests.length} รายการ</span>
            <button className="avatar">A</button>
          </div>
        </header>

        {view === 'requests' ? (
          selectedRequest ? (
            <RequestDetail
              request={selectedRequest}
              onBack={() => setSelectedRequest(null)}
              onEdit={(request) => { setSelectedRequest(null); setEditing(request); }}
              onDelete={() => handleDeleteRequest(selectedRequest.id)}
            />
          ) : (
            <RequestsView
              requests={requests}
              filtered={filtered}
              query={query}
              setQuery={setQuery}
              status={status}
              setStatus={setStatus}
              filterOpen={filterOpen}
              setFilterOpen={setFilterOpen}
              advancedFilters={advancedFilters}
              setAdvancedFilters={setAdvancedFilters}
              onAdd={() => setEditing({ ...emptyRequest })}
              onEdit={setSelectedRequest}
              onDelete={handleDeleteRequest}
              onExport={exportCsv}
              onExportPdf={() => printPdf('Service Desk - รายการที่กรอง')}
              isLoading={isLoading}
              error={error}
            />
          )
        ) : (
          <Dashboard requests={requests} onExport={() => printPdf('Service Desk - Dashboard รายวัน')} />
        )}
      </main>

      {filterOpen && (
        <FilterPanel
          filters={advancedFilters}
          setFilters={setAdvancedFilters}
          onClose={() => setFilterOpen(false)}
          requests={requests}
        />
      )}

      {editing && <RequestModal request={editing} requests={requests} onClose={() => setEditing(null)} onSave={saveRequest} />}
      {toast && <div className="toast show">{toast}</div>}
    </div>
  );
}

function RequestsView({ requests, filtered, query, setQuery, status, setStatus, setFilterOpen, onAdd, onEdit, onDelete, onExport, onExportPdf, isLoading, error }) {
  const active = requests.filter((r) => r.status !== 'เสร็จสิ้น').length;
  const done = requests.filter((r) => r.status === 'เสร็จสิ้น').length;

  return (
    <section className="view active-view">
      <div className="page-heading">
        <div>
          <p className="eyebrow">OPERATIONS / 2026</p>
          <h1>งานแจ้งบริการ</h1>
          <p className="subheading">ติดตามงานตั้งแต่รับแจ้งจนปิดงานในที่เดียว</p>
        </div>
        <button className="primary-btn" onClick={onAdd}><span>+</span> เพิ่มงานใหม่</button>
      </div>

      <div className="metric-row">
        <Metric label="งานทั้งหมด" value={requests.length} />
        <Metric label="งานที่ยังเปิดอยู่" value={active} className="accent" />
        <Metric label="ปิดงานแล้ว" value={done} />
      </div>

      <div className="toolbar">
        <label className="search-box">
          <span>⌕</span>
          <input type="search" placeholder="ค้นหาลูกค้า เลขติดตาม สถานที่..." value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option>ทั้งหมด</option>
          <option>รอดำเนินการ</option>
          <option>กำลังดำเนินการ</option>
          <option>รอลูกค้าสรุปงาน</option>
          <option>เสร็จสิ้น</option>
          <option>รอเสนอราคา</option>
        </select>
        <button className="secondary-btn" onClick={() => setFilterOpen(true)}>☷ ตัวกรอง</button>
        <button className="secondary-btn" onClick={onExport}>ดาวน์โหลด CSV</button>
        <button className="secondary-btn" onClick={onExportPdf}>ส่งออก PDF</button>
      </div>

      {isLoading && <div className="empty-state">กำลังโหลดข้อมูล...</div>}
      {!isLoading && error && <div className="empty-state error">{error}</div>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ลูกค้า</th>
              <th>Ref.</th>
              <th>เลขติดตาม</th>
              <th>สถานที่ / สาขา</th>
              <th>รายละเอียด</th>
              <th>สถานะ</th>
              <th>ผู้ดำเนินการ</th>
              <th>วันที่รับแจ้ง</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((request) => (
              <tr key={request.id}>
                <td onClick={() => onEdit(request)}>{request.customer}</td>
                <td onClick={() => onEdit(request)}>{request.ref || '-'}</td>
                <td onClick={() => onEdit(request)}>{request.ticket || '-'}</td>
                <td onClick={() => onEdit(request)}>{request.location || '—'}</td>
                <td onClick={() => onEdit(request)}>{request.description || '—'}</td>
                <td onClick={() => onEdit(request)}>{request.status || '—'}</td>
                <td onClick={() => onEdit(request)}>{request.assignee || '—'}</td>
                <td onClick={() => onEdit(request)}>{request.receivedAt ? formatDate(request.receivedAt) : '—'}</td>
                <td><button type="button" className="secondary-btn" onClick={(event) => { event.stopPropagation(); onDelete(request.id); }}>ลบ</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Metric({ label, value, className = '' }) {
  return (
    <div className="metric">
      <label>{label}</label>
      <strong className={className}>{value}</strong>
    </div>
  );
}

function RequestModal({ request, requests = [], onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    ...emptyRequest,
    ...normalizeRequest(request),
    receivedAt: request.id ? (request.receivedAt || new Date().toISOString().slice(0, 16)) : new Date().toISOString().slice(0, 16),
    ticket: request.ticket || '',
  }));
  const [assigneeDraft, setAssigneeDraft] = useState('');

  const assigneeList = (form.assignee || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  const addAssignee = () => {
    const value = assigneeDraft.trim();
    if (!value) return;
    const nextList = [...new Set([...assigneeList, value])];
    setForm({ ...form, assignee: nextList.join(', ') });
    setAssigneeDraft('');
  };

  const removeAssignee = (value) => {
    const nextList = assigneeList.filter((item) => item !== value);
    setForm({ ...form, assignee: nextList.join(', ') });
  };

  const update = (event) => {
    const nextForm = { ...form, [event.target.name]: event.target.value };
    setForm(nextForm);
  };

  const select = (name, label, options, required = false) => (
    <label key={name}>
      {label}
      <select name={name} value={form[name] || ''} onChange={update} required={required}>
        <option value="">เลือก...</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );

  const text = (name, label, required = false, type = 'text') => (
    <label key={name}>
      {label}{required && <em>*</em>}
      <input name={name} type={type} value={form[name] || ''} onChange={update} required={required} />
    </label>
  );

  return (
    <div className="modal form-modal" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal-panel">
        <div className="form-topbar">
          <button type="button" className="icon-btn" onClick={onClose}>×</button>
          <h2>DataServiceDR Form</h2>
          <div>
            <button type="button" className="secondary-btn" onClick={onClose}>Cancel</button>
            <button type="submit" form="serviceForm" className="primary-btn">Save</button>
          </div>
        </div>

        <form id="serviceForm" onSubmit={(event) => { event.preventDefault(); onSave(form); }}>
          <div className="form-column">
            {text('ref', 'Ref.', true)}
            {select('source', 'แหล่งที่มา', ['ไลน์', 'โทรศัพท์', 'อีเมล', 'เว็บไซต์'])}
            {text('receivedAt', 'วันเวลาที่รับแจ้ง', true, 'datetime-local')}
            {!request.id && <div className="field-hint">เลขติดตามจะถูกสร้างอัตโนมัติหลังบันทึก</div>}
            {request.id && text('ticket', 'เลขติดตาม', false)}
            {select('customer', 'ลูกค้า', ['BMN', 'โรงพยาบาลมิตรภาพ', 'Workoplus', 'Besides Umi', 'GQ', 'บริษัท ดี.อาร์.แอดเวอร์ไทซิ่ง จำกัด'], true)}
            {select('location', 'สถานที่/สาขา', ['Sukhumvit Corner', 'โรงพยาบาลมิตรภาพ สระบุรี', 'Levis Siam Paragon', 'Besides Umi', 'Mega bangna', 'True Shop Central Plaza Westgate'], true)}
            {text('site', 'สถานที่ตั้ง')}
            {text('contact', 'ผู้ติดต่อ')}
            {text('phone', 'เบอร์ติดต่อ')}
            {text('description', 'ข้อมูลการรับแจ้ง', true)}
            <FileField name="image" label="รูปภาพที่แจ้ง" value={form.image} onChange={update} />
            <div className="field-group">
              <span>MA</span>
              <div className="segmented">
                <button type="button" className={form.ma === 'N' ? 'selected' : ''} onClick={() => setForm({ ...form, ma: 'N' })}>N</button>
                <button type="button" className={form.ma === 'Y' ? 'selected' : ''} onClick={() => setForm({ ...form, ma: 'Y' })}>Y</button>
              </div>
            </div>
            {select('jobType', 'ลักษณะงาน', ['แก้ไขหน้างาน', 'รีโมท', 'แนะนำ', 'ประเมินราคา'], true)}
            {select('status', 'สถานะงาน', ['รับเรื่อง', 'รอดำเนินการ', 'กำลังดำเนินการ', 'รอลูกค้าสรุปงาน', 'เสร็จสิ้น', 'รอเสนอราคา'], true)}
            <div className="field-with-action" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span>ผู้ดำเนินการ</span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  value={assigneeDraft}
                  onChange={(event) => setAssigneeDraft(event.target.value)}
                  placeholder="เพิ่มผู้ดำเนินการ"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      addAssignee();
                    }
                  }}
                />
                <button type="button" title="เพิ่มผู้ดำเนินการ" onClick={addAssignee}>+</button>
              </div>
              {assigneeList.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {assigneeList.map((value) => (
                    <span key={value} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 8px', border: '1px solid #d0d7de', borderRadius: '999px', background: '#f6f8fa' }}>
                      {value}
                      <button type="button" onClick={() => removeAssignee(value)} aria-label={`ลบ ${value}`} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#d1242f', fontWeight: '700' }}>×</button>
                    </span>
                  ))}
                </div>
              )}
              <input type="hidden" name="assignee" value={form.assignee || ''} />
            </div>
            {select('equipment', 'เกี่ยวกับอุปกรณ์', ['จอ LED', 'Kiosk', 'กล่องเล่นสื่อ', 'อื่นๆ'])}
            <FileField name="completedImage" label="รูปภาพที่ดำเนินการเสร็จแล้ว" value={form.completedImage} onChange={update} />
            {text('completedAt', 'วันเวลาเสร็จ', false, 'datetime-local')}
            {text('map', 'MAP')}
            {text('vehicle', 'ทะเบียนรถ')}
            {text('notes', 'หมายเหตุ')}
            {text('file', 'ไฟล์', false, 'url')}
          </div>
        </form>
      </div>
    </div>
  );
}

function FileField({ name, label, value, onChange }) {
  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    if (file.size > 3 * 1024 * 1024) {
      window.alert('กรุณาเลือกไฟล์ภาพขนาดไม่เกิน 3 MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => onChange({ target: { name, value: reader.result } });
    reader.readAsDataURL(file);
  };

  return (
    <label className="file-field">
      {label}
      <input name={name} type="file" accept="image/*" onChange={handleFile} />
      <span>▣</span>
      {value && <img className="image-preview" src={value} alt="ตัวอย่างรูปภาพ" />}
    </label>
  );
}

export default App;
