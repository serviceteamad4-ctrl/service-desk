import { formatDate } from './requestUtils.js';

const fields = [
  ['customer', 'ลูกค้า'], ['ref', 'Ref.'], ['source', 'แหล่งที่มา'],
  ['receivedAt', 'วันเวลาที่รับแจ้ง'], ['ticket', 'เลขที่ติดตามงาน'], ['location', 'สถานที่/สาขา'],
  ['site', 'สถานที่ตั้ง'], ['contact', 'ผู้ติดต่อ'], ['phone', 'เบอร์ติดต่อ'], ['description', 'ข้อมูลการรับแจ้ง'],
  ['image', 'รูปภาพที่แจ้ง'], ['ma', 'MA'], ['jobType', 'ลักษณะงาน'], ['status', 'สถานะงาน'],
  ['assignee', 'ผู้ดำเนินการ'], ['appointment', 'วันนัดหมาย เวลาเริ่มต้น'], ['appointmentEnd', 'วันนัดหมาย เวลาสิ้นสุด'],
  ['action', 'รายละเอียดการดำเนินการ'], ['result', 'ผลการดำเนินการ'], ['equipment', 'เกี่ยวกับอุปกรณ์'],
  ['completedImage', 'รูปภาพที่ดำเนินการเสร็จแล้ว'], ['completedAt', 'วันเวลาเสร็จ'], ['map', 'MAP'],
  ['vehicle', 'ทะเบียนรถ'], ['notes', 'หมายเหตุ'], ['file', 'ไฟล์'],
];

export default function RequestDetail({ request, onBack, onEdit, onDelete }) {
  return <section className="detail-page view active-view">
    <div className="detail-header"><button className="detail-back" onClick={onBack}>←</button><div><p className="eyebrow">SERVICE REQUEST / DETAIL</p><h1>{request.ticket || request.ref || 'รายละเอียดงาน'}</h1><p className="subheading">รายละเอียดข้อมูลการแจ้งบริการ</p></div><div style={{ display: 'flex', gap: '8px' }}><button className="secondary-btn" type="button" onClick={() => onDelete && onDelete(request.id)}>ลบ</button><button className="primary-btn" onClick={() => onEdit(request)}>แก้ไขงาน</button></div></div>
    <div className="detail-card"><div className="detail-status"><span className="status">{request.status || '-'}</span>{request.ref ? <span className="level p2">{request.ref}</span> : null}</div><div className="detail-grid">{fields.map(([key, label]) => { const value = request[key]; if (!value) return null; return <div className={`detail-field ${['description', 'action', 'result', 'notes', 'image', 'completedImage'].includes(key) ? 'detail-wide' : ''}`} key={key}><span>{label}</span>{['image', 'completedImage'].includes(key) && String(value).startsWith('data:image') ? <img src={value} alt={label} /> : <strong>{['receivedAt', 'appointment', 'appointmentEnd', 'completedAt'].includes(key) ? formatDate(value) : value}</strong>}</div>; })}</div></div>
  </section>;
}
