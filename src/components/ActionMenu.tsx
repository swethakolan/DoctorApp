'use client';
import { useState, useEffect } from 'react';
import { MoreVertical, RefreshCcw, XCircle, CheckCircle, FileText } from 'lucide-react';

interface ActionMenuProps {
  hasPrescription?: boolean;
  onReschedule: () => void;
  onCancel: () => void;
  onComplete: () => void;
  onPrescribe: () => void;
}

export default function ActionMenu({
  hasPrescription,
  onReschedule,
  onCancel,
  onComplete,
  onPrescribe,
}: ActionMenuProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!(e.target as HTMLElement).closest('.action-menu')) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <div className="relative inline-block text-left action-menu">
      <button onClick={() => setOpen(!open)} className="p-1 hover:bg-gray-200 rounded">
        <MoreVertical className="h-5 w-5 text-gray-600" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-lg z-10">
          <MenuItem icon={<RefreshCcw className="h-4 w-4" />} text="Reschedule" onClick={onReschedule} closeMenu={closeMenu} />
          <MenuItem icon={<XCircle className="h-4 w-4" />} text="Cancel" onClick={onCancel} closeMenu={closeMenu} />
          <MenuItem icon={<CheckCircle className="h-4 w-4" />} text="Mark Complete" onClick={onComplete} closeMenu={closeMenu} />
          <MenuItem
            icon={<FileText className="h-4 w-4" />}
            text={hasPrescription ? 'Edit Prescription' : 'Add Prescription'}
            onClick={onPrescribe}
            closeMenu={closeMenu}
          />
          
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, text, onClick, closeMenu }: any) {
  return (
    <button
      onClick={() => {
        onClick();
        closeMenu();
      }}
      className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100"
    >
      {icon} {text}
    </button>
  );
}
