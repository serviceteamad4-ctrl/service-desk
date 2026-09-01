import { useState } from 'react';

const filterFields = [
  ['ref', 'Ref.'], ['source', 'แหล่งที่มา'], ['receivedAt', 'วันเวลาที่รับแจ้ง'], ['ticket', 'เลขที่ติดตามงาน'],
  ['customer', 'ลูกค้า'], ['location', 'สถานที่/สาขา'], ['site', 'สถานที่ตั้ง'], ['contact', 'ผู้ติดต่อ'],
  ['phone', 'เบอร์ติดต่อ'], ['description', 'ข้อมูลการรับแจ้ง'], ['jobType', 'ลักษณะงาน'], ['status', 'สถานะงาน'],
  ['assignee', 'ผู้ดำเนินการ'], ['appointment', 'วันที่นัดหมาย เวลาเริ่มต้น'], ['appointmentEnd', 'วันที่นัดหมาย เวลาสิ้นสุด'],
  ['action', 'รายละเอียดการดำเนินการ'], ['result', 'ผลการดำเนินการ'], ['equipment', 'เกี่ยวกับอุปกรณ์'],
  ['completedAt', 'วันเวลาเสร็จ'], ['vehicle', 'ทะเบียนรถ'], ['notes', 'หมายเหตุ'], ['file', 'ไฟล์'],
];
const fallbackOptions = {
  source: ['ไลน์', 'โทรศัพท์', 'อีเมล', 'เว็บไซต์'],
  jobType: ['แก้ไขหน้างาน', 'รีโมท', 'แนะนำ', 'ประเมินราคา'],
  status: ['เรียบร้อยปกติ', 'ยกเลิก', 'เสนอราคา', 'รออะไหล่', 'รอลูกค้าสรุปงาน', 'กำลังดำเนินการ', 'รับเรื่อง', 'รอส่งสื่อตามวันที่ลูกค้ากำหนด'],
  equipment: ['จอ LED', 'Kiosk', 'กล่องเล่นสื่อ', 'อื่นๆ'],
};

export default function FilterPanel({ filters, setFilters, onClose, requests = [] }) {
  const [activeField, setActiveField] = useState(null);
  const valuesFor = (key) => [...new Set((requests.map((item) => item[key]).filter(Boolean).length ? requests.map((item) => item[key]).filter(Boolean) : fallbackOptions[key] || []))];
  const selected = (key) => Array.isArray(filters[key]) ? filters[key] : filters[key] ? [filters[key]] : [];
  const toggle = (key, value) => { const current = selected(key); const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value]; setFilters({ ...filters, [key]: next }); };
  const label = filterFields.find(([key]) => key === activeField)?.[1];
  return <div className="filter-backdrop" onClick={(event) => event.target === event.currentTarget && onClose()}><aside className="filter-panel">
    <div className="filter-header"><button className="filter-back" onClick={() => activeField ? setActiveField(null) : onClose()}>←</button><h2>{activeField ? label : 'Filter'}</h2></div>
    {!activeField ? <div className="filter-list">{filterFields.map(([key, name]) => <button className="filter-field filter-button" key={key} onClick={() => setActiveField(key)}><span>{name}</span>{selected(key).length > 0 && <small>{selected(key).length} รายการที่เลือก</small>}<b>›</b></button>)}</div> : <div className="filter-options">{valuesFor(activeField).map((value) => <label className="check-option" key={value}><input type="checkbox" checked={selected(activeField).includes(value)} onChange={() => toggle(activeField, value)} /><span>{value}</span></label>)}{!valuesFor(activeField).length && <p className="no-options">ยังไม่มีข้อมูลสำหรับเลือก</p>}</div>}
    <div className="filter-actions"><button className="clear-filter" onClick={() => activeField ? setFilters({ ...filters, [activeField]: [] }) : setFilters({})}>Clear</button><button className="done-filter" onClick={onClose}>Done</button></div>
  </aside></div>;
}
