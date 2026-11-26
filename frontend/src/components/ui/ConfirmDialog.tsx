import { useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { AlertTriangle, X } from 'lucide-react';

// ─── Inline Dialog Component ────────────────────────────────────────────────

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({
  title,
  message,
  confirmLabel = 'ยืนยัน',
  cancelLabel = 'ยกเลิก',
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.15s ease',
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: '#fff', borderRadius: 16, padding: '2rem',
          minWidth: 360, maxWidth: 440, width: '90%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
          animation: 'slideUp 0.18s ease',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', marginBottom: '1rem' }}>
          <div style={{
            flexShrink: 0, width: 40, height: 40, borderRadius: '50%',
            background: danger ? '#fee2e2' : '#fef3c7',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <AlertTriangle size={20} style={{ color: danger ? '#dc2626' : '#d97706' }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>{title}</p>
            <p style={{ margin: '0.35rem 0 0', fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5 }}>
              {message}
            </p>
          </div>
          <button
            onClick={onCancel}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '1.5rem' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '0.5rem 1.25rem', borderRadius: 8, border: '1px solid #e2e8f0',
              background: '#f8fafc', color: '#475569', fontWeight: 600,
              fontSize: '0.875rem', cursor: 'pointer',
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '0.5rem 1.25rem', borderRadius: 8, border: 'none',
              background: danger
                ? 'linear-gradient(135deg,#ef4444,#dc2626)'
                : 'linear-gradient(135deg,#3b82f6,#2563eb)',
              color: '#fff', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
              boxShadow: danger ? '0 2px 8px rgba(239,68,68,0.3)' : '0 2px 8px rgba(37,99,235,0.3)',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(12px); opacity:0; } to { transform: translateY(0); opacity:1; } }
      `}</style>
    </div>
  );
}

// ─── Imperative helper (like Modal.confirm) ──────────────────────────────────

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

/**
 * Show a styled confirmation dialog imperatively.
 * Returns a Promise<boolean> — true if the user confirmed.
 *
 * Usage:
 *   const ok = await confirm({ message: 'Delete this item?', danger: true });
 *   if (ok) { ... }
 */
export function showConfirm(options: ConfirmOptions): Promise<boolean> {
  return new Promise(resolve => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    const cleanup = (result: boolean) => {
      root.unmount();
      container.remove();
      resolve(result);
    };

    root.render(
      <ConfirmDialog
        title={options.title ?? 'ยืนยันการดำเนินการ'}
        message={options.message}
        confirmLabel={options.confirmLabel}
        cancelLabel={options.cancelLabel}
        danger={options.danger}
        onConfirm={() => cleanup(true)}
        onCancel={() => cleanup(false)}
      />
    );
  });
}

// ─── React hook variant (for use inside components) ──────────────────────────

export function useConfirm() {
  const [dialogProps, setDialogProps] = useState<(ConfirmDialogProps & { key: number }) | null>(null);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise(resolve => {
      setDialogProps({
        key: Date.now(),
        title: options.title ?? 'ยืนยันการดำเนินการ',
        message: options.message,
        confirmLabel: options.confirmLabel,
        cancelLabel: options.cancelLabel,
        danger: options.danger,
        onConfirm: () => { setDialogProps(null); resolve(true); },
        onCancel:  () => { setDialogProps(null); resolve(false); },
      });
    });
  }, []);

  const DialogNode = dialogProps ? <ConfirmDialog {...dialogProps} /> : null;

  return { confirm, DialogNode };
}
