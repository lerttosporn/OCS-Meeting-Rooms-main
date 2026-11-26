import { useState } from 'react';
import { X } from 'lucide-react';
import { Tool } from '../../hooks/useTools';

interface ToolFormModalProps {
  tool: Tool | null;
  onClose: () => void;
  onSave: (data: Omit<Tool, 'tool_id'>) => void;
}

export function ToolFormModal({ tool, onClose, onSave }: ToolFormModalProps) {
  const [form, setForm] = useState<Omit<Tool, 'tool_id'>>({
    name: tool?.name || '',
    description: tool?.description || '',
    unit_price: tool?.unit_price || 0,
    stock: tool?.stock || 0,
  });

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={e => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3>{tool ? 'แก้ไขอุปกรณ์' : 'เพิ่มอุปกรณ์ใหม่'}</h3>
          <button className="admin-modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="admin-modal-body">
          <div className="admin-form-group" style={{ marginBottom: '1rem' }}>
            <label>ชื่ออุปกรณ์</label>
            <input className="admin-setting-input" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="admin-form-group" style={{ marginBottom: '1rem' }}>
            <label>รายละเอียด</label>
            <input className="admin-setting-input" value={form.description || ''}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="admin-form-grid" style={{ marginBottom: '1rem' }}>
            <div className="admin-form-group">
              <label>ราคา (บาท)</label>
              <input className="admin-setting-input" type="number" value={form.unit_price}
                onChange={e => setForm(f => ({ ...f, unit_price: +e.target.value }))} />
            </div>
            <div className="admin-form-group">
              <label>คงเหลือ (ชิ้น)</label>
              <input className="admin-setting-input" type="number" value={form.stock}
                onChange={e => setForm(f => ({ ...f, stock: +e.target.value }))} />
            </div>
          </div>
          <div className="admin-modal-actions" style={{ justifyContent: 'flex-end' }}>
            <button className="admin-btn-outline" onClick={onClose}>ยกเลิก</button>
            <button className="admin-btn-primary" onClick={() => onSave(form)}>บันทึก</button>
          </div>
        </div>
      </div>
    </div>
  );
}
