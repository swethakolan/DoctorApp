'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Modal from './Modal';

interface PrescriptionModalProps {
  appointmentId: string;
  patientName: string;
  mode: 'add' | 'edit';
  onClose: () => void;
}

export default function PrescriptionModal({
  appointmentId,
  patientName,
  mode,
  onClose,
}: PrescriptionModalProps) {
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');

  // **Load existing prescription when editing**
  useEffect(() => {
    if (mode === 'edit') {
      supabase
        .from('prescriptions')
        .select('medicine_name, dosage, duration, notes')
        .eq('appointment_id', appointmentId)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching prescription:', error);
          } else if (data) {
            setMedicineName(data.medicine_name || '');
            setDosage(data.dosage || '');
            setDuration(data.duration || '');
            setNotes(data.notes || '');
          }
        });
    }
  }, [mode, appointmentId]);

  // Save or update prescription
  const handleSave = async () => {
    try {
      let response;
      if (mode === 'add') {
        response = await supabase.from('prescriptions').insert([
          {
            appointment_id: appointmentId,
            medicine_name: medicineName,
            dosage,
            duration,
            notes,
          },
        ]);
      } else {
        response = await supabase
          .from('prescriptions')
          .update({
            medicine_name: medicineName,
            dosage,
            duration,
            notes,
          })
          .eq('appointment_id', appointmentId);
      }

      console.log('Supabase response:', response);

      if (response.error) {
        alert(`Error: ${response.error.message}`);
        return;
      }

      onClose();
    } catch (error) {
      console.error('Error saving prescription:', error);
    }
  };

  // Delete prescription
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this prescription?')) return;

    try {
      await supabase.from('prescriptions').delete().eq('appointment_id', appointmentId);
      onClose();
    } catch (error) {
      console.error('Error deleting prescription:', error);
    }
  };

  return (
    <Modal
      title={`${mode === 'edit' ? 'Edit' : 'Add'} Prescription for ${patientName}`}
      onClose={onClose}
    >
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Medicine Name"
          value={medicineName}
          onChange={(e) => setMedicineName(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          placeholder="Dosage"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          placeholder="Duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <textarea
          placeholder="Notes / Instructions"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="border p-2 w-full rounded"
        />
      </div>

      <div className="flex justify-between items-center mt-4">
        {mode === 'edit' && (
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>
        )}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
