import { useState } from 'react';

const typeCount = (type, items) => items.filter((item) => item.jobType === type).length;

export default function Dashboard({ requests, onExport }) {
  const [date, setDate] = useState('2026-08-28');
  const dayRequests = requests.filter((item) => item.receivedAt?.slice(0, 10) === date);
  const completed = requests.filter((item) => item.completedAt?.slice(0, 10) === date);
  const rows = [
    { number: '1', label: 'ประเภทงาน', value: dayRequests.length, tone: 'purple', children: [['งานส่งซ่อม', typeCount('ส่งซ่อม', dayRequests)], ['งานแก้ไขสื่อ', typeCount('แก้ไขสื่อ', dayRequests)], ['งานแจ้งซ่อม', typeCount('แก้ไขหน้างาน', dayRequests)]] },
    { number: '2', label: 'เคสที่เสร็จวันนี้', value: completed.length, tone: 'blue', children: [['งานส่งซ่อม', typeCount('ส่งซ่อม', completed)], ['งานแก้ไขสื่อ', typeCount('แก้ไขสื่อ', completed)], ['งานแจ้งซ่อม', typeCount('แก้ไขหน้างาน', completed)]] },
    { number: '3', label: 'นัดหมายงาน รับเรื่อง', value: dayRequests.filter((item) => item.appointment).length, tone: 'yellow', children: [['สถานะงาน', dayRequests.filter((item) => item.status === 'รับเรื่อง').length], ['ยังไม่ได้จัดแพลนคิวงาน', dayRequests.filter((item) => !item.appointment).length]] },
    { number: '4', label: 'รอคิวช่าง', value: dayRequests.filter((item) => item.status === 'รอคิวช่าง').length, tone: 'green', children: [['รอพนักงานแจ้งกลับมาจากแพลนคิวงาน (รอจัดคิวช่าง)', '']] },
    { number: '5', label: 'รออะไหล่', value: dayRequests.filter((item) => item.status === 'รออะไหล่').length, tone: 'blue', children: [] },
    { number: '6', label: 'ประสานงานไม่ทันเวลา', value: dayRequests.filter((item) => item.notes?.includes('ไม่ทัน')).length, tone: 'gray', children: [] },
  ];

  return <section className="dashboard-page view active-view"><div className="page-heading"><div><p className="eyebrow">REPORTS / DAILY OPERATIONS</p><h1>Dashboard รายงานประจำวัน</h1><p className="subheading">สรุปสถานะงานบริการจากข้อมูลของคุณ</p></div><div className="dashboard-actions"><input type="date" value={date} onChange={(event) => setDate(event.target.value)} /><button className="secondary-btn" onClick={onExport}>ส่งออก PDF</button></div></div><div className="daily-sheet"><div className="sheet-date">{date}</div><div className="sheet-label">เคสทั้งหมด</div><div className="sheet-value">{requests.length}</div><div className="sheet-note" />{rows.map((row) => <ReportRow key={row.number} row={row} />)}</div></section>;
}

function ReportRow({ row }) { return <><div className="sheet-number">{row.number}</div><div className={`sheet-label ${row.tone}`}>{row.label}</div><div className={`sheet-value ${row.tone}`}>{row.value}</div><div className="sheet-note" />{row.children.map(([label, value]) => <ReportChild key={label} label={label} value={value} />)}</>; }

function ReportChild({ label, value }) { return <><div /><div className="sheet-child">{label}</div><div className="sheet-child-value">{value}</div><div /></>; }