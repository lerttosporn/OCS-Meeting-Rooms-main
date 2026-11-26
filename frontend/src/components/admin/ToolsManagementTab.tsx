import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Package } from 'lucide-react';
import { useTools, Tool } from '../../hooks/useTools';
import { ToolFormModal } from './ToolFormModal';
import { AdminSection } from './AdminDashboard';

export const toolsNavItem = {
  id: 'tools' as AdminSection,
  label: 'Tools Management',
  desc: 'จัดการอุปกรณ์เสริม',
  icon: Package,
  color: '#0ea5e9'
};

interface ToolsManagementTabProps {
  isTechnician: boolean;
}

export function ToolsManagementTab({ isTechnician }: ToolsManagementTabProps) {
  const { tools, loading: toolsLoading, createTool, updateTool, deleteTool } = useTools();
  const [toolSearch, setToolSearch] = useState('');
  const [showToolModal, setShowToolModal] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);

  const filteredTools = tools.filter(t => 
    t.name.toLowerCase().includes(toolSearch.toLowerCase())
  );

  return (
    <div className="admin-section">
      <div className="admin-toolbar">
        <div className="admin-search-wrap">
          <Search className="admin-search-icon" size={16} />
          <input
            type="text"
            className="admin-search-input"
            placeholder="ค้นหาอุปกรณ์..."
            value={toolSearch}
            onChange={e => setToolSearch(e.target.value)}
          />
        </div>
        {!isTechnician && (
          <button className="admin-btn-primary" onClick={() => { setEditingTool(null); setShowToolModal(true); }}>
            <Plus size={16} />
            เพิ่มอุปกรณ์ใหม่
          </button>
        )}
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>ชื่ออุปกรณ์</th>
              <th>รายละเอียด</th>
              <th>ราคา (บาท)</th>
              <th>คงเหลือ (ชิ้น)</th>
              <th>การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {toolsLoading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>กำลังโหลดข้อมูล...</td></tr>
            ) : filteredTools.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>ไม่พบข้อมูลอุปกรณ์</td></tr>
            ) : (
              filteredTools.map((tool, index) => (
                <tr key={tool.tool_id}>
                  <td>{index + 1}</td>
                  <td>{tool.name}</td>
                  <td>{tool.description || '-'}</td>
                  <td>฿{Number(tool.unit_price).toLocaleString()}</td>
                  <td>{tool.stock}</td>
                  <td>
                    <div className="admin-action-btns">
                      {!isTechnician && (
                        <>
                          <button className="admin-action-btn edit" title="แก้ไข"
                            onClick={() => { setEditingTool(tool); setShowToolModal(true); }}>
                            <Edit2 size={14} />
                          </button>
                          <button className="admin-action-btn delete" title="ลบ"
                            onClick={() => deleteTool(tool.tool_id)}>
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showToolModal && (
        <ToolFormModal
          tool={editingTool}
          onClose={() => setShowToolModal(false)}
          onSave={async (data) => {
            try {
              if (editingTool) {
                await updateTool(editingTool.tool_id, data);
              } else {
                await createTool(data);
              }
              setShowToolModal(false);
            } catch (err) {
              alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
            }
          }}
        />
      )}
    </div>
  );
}
